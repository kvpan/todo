# Local CI Workflow

This document outlines our approach to **local-first continuous integration** — a workflow where developers run all checks locally before pushing, signing off on their own commits. This is built on a foundation of **trust and ownership**.

# The Signoff Workflow

1. Developer writes code and commits changes
2. Developer pushes to GitHub
3. Developer runs `pnpm signoff` which:
    - Runs lint, type-check, build, test in Docker (isolated environment)
    - On success, reports "signoff" status to GitHub for that commit
4. Developer creates PR — status check is already green
5. Reviewer requests changes
6. Developer commits new changes, pushes, and runs `pnpm signoff` again
7. Repeat until approved and merged
