#!/usr/bin/env bash
set -e

# Timer
SECONDS=0

# Colors
green() { echo -e "\033[32m$1\033[0m"; }
red() { echo -e "\033[31m$1\033[0m"; }

# Ensure clean working tree
if [[ -n $(git status --porcelain) ]]; then
    red "❌ Can't sign off on a dirty repository!"
    git status
    exit 1
fi

# Repository info
OWNER=$(gh repo view --json owner --jq .owner.login)
REPO=$(gh repo view --json name --jq .name)
SHA=$(git rev-parse HEAD)
USER=$(git config user.name)

green "🚀 Signing off on $SHA as $USER"

# Run in Docker for isolation (--build to include latest source)
docker compose -f docker-compose.ci.yml run --rm --build ci

# Report success to GitHub
gh api \
    --method POST --silent \
    -H "Accept: application/vnd.github+json" \
    /repos/$OWNER/$REPO/statuses/$SHA \
    -f "context=signoff" \
    -f "state=success" \
    -f "description=Signed off by $USER"

green "✅ Signed off on $SHA in $SECONDS seconds"
