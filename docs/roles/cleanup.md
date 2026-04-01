# Cleanup Agent Guide

## Goal
Enforce golden rules, fix drift, prevent technical debt accumulation.

## Workflow

```
1. Scan for golden rule violations
2. Identify patterns (not one-offs)
3. Open targeted refactoring PRs
4. Most should auto-merge after CI
```

## Step by Step

### 1. Scan for violations
```bash
harness golden-rules --check      # All golden rule violations
harness enforce --check           # Architecture violations
harness audit                     # Full quality report
```

### 2. Identify patterns
Don't fix one instance. Find all instances of the same pattern.

```bash
# Example: find all console.log violations
grep -r "console\.log" src/ --include="*.ts" -l

# Example: find duplicated utility functions
# Look for functions with same name in multiple files
```

### 3. Open targeted PRs
One PR per pattern type. Keep PRs small and focused.

```bash
gh pr create \
  --title "cleanup: replace console.log with structured logger" \
  --body "
## Summary
Automated cleanup: replaced console.log with structured logger.
Violation of golden rule #3.

## Changes
- 12 files updated
- No behavior change

## Auto-merge
This PR can auto-merge after CI passes.
"
```

### 4. Signal completion
After opening all cleanup PRs:
```
CLEANUP_COMPLETE
```

## Common Patterns to Fix

### Duplicated helpers
```bash
# Find files with similar function names
grep -r "function formatDate\|const formatDate\|formatDate =" src/ -l
```
Fix: consolidate into `src/shared/utils/date.ts`

### Unvalidated boundaries
```bash
# Find JSON.parse without schema validation
grep -r "JSON\.parse" src/ --include="*.ts" -l
```
Fix: wrap with schema validation

### Direct cross-domain imports
```bash
# Find imports that cross domain boundaries
# Check docs/architecture.md for allowed import paths
```

### Oversized files
```bash
# Find files over 300 lines
find src/ -name "*.ts" | xargs wc -l | sort -n | tail -20
```
Fix: split by responsibility

## Frequency

Run cleanup agent:
- Daily: golden rule scan
- Weekly: full architecture audit
- After major features: drift check

Most cleanup PRs should be reviewable in under 1 minute.
