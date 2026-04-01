# Doc Gardener Agent Guide

## Goal
Keep documentation accurate, fresh, and useful for future agents.

## Workflow

```
1. Scan docs/ for stale content
2. Compare docs against actual code
3. Open PRs to fix or remove outdated docs
4. Update quality scores
```

## Step by Step

### 1. Scan for stale docs
```bash
harness garden                    # Find stale/outdated docs
```

Look for:
- Docs referencing files that no longer exist
- Docs describing behavior that has changed
- Docs with no corresponding code
- Duplicate documentation

### 2. Compare against code
For each doc in `docs/domains/`:
- Does the described API still exist?
- Are the examples still valid?
- Are the file paths still correct?

### 3. Fix or remove
**Update stale doc:**
```bash
# Edit the doc to reflect current reality
# Add "Last verified: YYYY-MM-DD" at the bottom
```

**Remove obsolete doc:**
```bash
git rm docs/domains/OLD-FEATURE.md
# Note removal in PR description
```

**Open PR:**
```bash
gh pr create \
  --title "docs: update stale documentation" \
  --body "
## Summary
Updated/removed stale docs found by doc-gardener scan.

## Changes
- Updated docs/domains/X.md: API changed in PR #123
- Removed docs/domains/Y.md: feature removed in PR #456

## Verification
Each doc verified against current code.
"
```

### 4. Update quality scores
After fixing docs, update `docs/quality.md`:
```bash
# Update the score for affected domains
# Format: | Domain | Score | Last Updated | Notes |
```

### 5. Signal completion
```
DOC_COMPLETE
```

## What Good Docs Look Like

- **Short** — one page max per topic
- **Accurate** — matches current code behavior
- **Linked** — references related docs and code
- **Dated** — includes "Last verified" timestamp
- **Actionable** — tells agents what to do, not just what exists

## Anti-patterns to Fix

- Docs that say "TODO: update this"
- Docs with broken file path references
- Duplicate docs covering the same topic
- Docs longer than 200 lines (split them)
- Docs with no links to related code
