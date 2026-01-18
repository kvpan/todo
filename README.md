# Local CI Workflow

This document outlines our approach to **local-first continuous integration** — a workflow where developers run all checks locally before pushing, signing off on their own commits. This is built on a foundation of **trust and ownership**.

## Repository Setup

Go to **Settings → Branches → Add branch ruleset**

1. **Branch name pattern**: `main`
2. Enable **"Require a pull request before merging"**
3. Enable **"Require status checks to pass before merging"**
4. In the status check search box, type `signoff`
5. Select `signoff` as a required check

The key insight: **the `signoff` status check is reported by the developer's machine**, not by a cloud CI runner.

## The Signoff Workflow

### How It Works

1. Developer writes code and commits changes
2. Developer pushes to GitHub
3. Developer runs `pnpm signoff` which:
    - Runs lint, type-check, build, test in Docker (isolated environment)
    - On success, reports "signoff" status to GitHub for that commit
4. Developer creates PR — status check is already green
5. Reviewer requests changes
6. Developer commits new changes, pushes, and runs `pnpm signoff` again
7. Repeat until approved and merged

## Design Decisions

### 1. Volume Mount (Resolved ✓)

We use a **volume mount** approach rather than cloning the repo fresh in the container.

**How it works:**

- Mount the local repo into the container
- Run `pnpm install --frozen-lockfile` fresh each time
- The signoff script validates a **specific commit SHA**

**Why this is safe:**
The signoff is tied to a specific commit hash. Even if files in the volume were modified after signing off:

1. The signoff status is recorded against that exact SHA
2. If new commits are pushed, the HEAD changes and the existing signoff becomes irrelevant
3. GitHub branch protection requires a valid signoff for the **current HEAD** to unblock merging

This means the worst case of tampering with mounted files would just result in a wasted signoff that doesn't actually unblock anything — you'd need to signoff the new HEAD anyway.

**Trade-off accepted:** Slightly less isolated than a fresh clone, but significantly faster and the commit-specific validation provides equivalent integrity guarantees.

### 2. In-Memory Database (Resolved ✓)

We use **tmpfs** for PostgreSQL data — a RAM-based filesystem that's fast and always fresh.

**Trade-off accepted:** Uses RAM, but databases are small and speed matters for local CI.

### 3. Sequential Execution (Resolved ✓)

We run lint, build, and test **sequentially** rather than in parallel.

**Trade-off accepted:** Slower wall-clock time, but easier to debug with clear ordering. We'll revisit if we feel the pain.

### 4. No Caching (Resolved ✓)

We start with **no caching** between signoff runs for maximum isolation.

**Trade-off accepted:** Slower installs/builds, but pure isolation.

---

## Failure Modes & Safeguards

### What if someone pushes without signing off?

Branch protection prevents merging without the `signoff` status check. The PR will be blocked.

### What about squash merging?

**This is a known limitation.** When you squash merge a PR:

1. Your feature branch commits (which were signed off) get combined
2. GitHub creates a **new commit** with a different SHA
3. The signoff status was on the old SHA — the new squash commit has no status

**Our current choice:** Accept the limitation. The signoff verified the _code changes_, even if the exact commit SHA changes during squash. The squash commit contains the same code that was verified.

### What if someone fakes the signoff?

They would need to manually call the GitHub API. This is technically possible but:

1. It's traceable (the signoff records their name)
2. It's a trust violation that should be addressed culturally

### What if the Docker environment differs from production?

Use the **same base image** as production. Our CI Dockerfile should match production as closely as possible.

### What if signoff passes locally but fails elsewhere?

This is the beauty of Docker isolation — if it passes in the container, it should pass anywhere with the same container. If not, we have a reproducibility bug to fix.

---

## References

- [DHH: We're moving continuous integration back to developer machines](https://world.hey.com/dhh/we-re-moving-continuous-integration-back-to-developer-machines-3ac6c611)
- [DHH's signoff script (Ruby/Rails)](https://gist.github.com/dhh/c5051aae633ff91bc4ce30528e4f0b60)
