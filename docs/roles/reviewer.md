# Reviewer Agent Guide

## Goal
Ensure code quality, architecture compliance, and test coverage.

## Workflow

```
1. Find PR to review
2. Read plan for context
3. Check architecture
4. Check tests
5. Leave comments
6. Approve or request changes
```

## Step by Step

### 1. Find PR
```bash
gh pr list --state open
gh pr view PR_NUMBER
gh pr diff PR_NUMBER
```

### 2. Read context
```bash
# Find plan reference in PR description
cat plans/active/TASK-ID.md
cat docs/architecture.md
```

### 3. Check architecture
```bash
harness enforce --check           # Automated check
harness audit                     # Full quality score
```

Manual checks:
- Layer boundaries respected?
- No cross-domain direct imports?
- Data validated at boundaries?

### 4. Check tests
- New behavior has tests?
- Edge cases covered?
- No test just checking implementation details?

### 5. Leave comments
```bash
gh pr review PR_NUMBER --comment --body "
## Review

### Architecture
- [x] Layer boundaries respected
- [x] No cross-domain imports
- [ ] Issue: line 42 imports directly from auth domain

### Tests
- [x] Unit tests present
- [ ] Missing test for error case

### Issues
1. **line 42**: Direct import from auth domain violates architecture.
   Fix: Use the auth interface from providers/
"
```

### 6. Decision

**Approve:**
```bash
gh pr review PR_NUMBER --approve --body "LGTM. Architecture clean, tests pass."
```
Then output: `REVIEW_COMPLETE APPROVED`

**Request changes:**
```bash
gh pr review PR_NUMBER --request-changes --body "[issues listed above]"
```
Then output: `REVIEW_COMPLETE CHANGES_REQUESTED`

## Review Checklist

- [ ] PR references a plan file
- [ ] `harness enforce` passes
- [ ] `harness audit` score >= 80
- [ ] New behavior has tests
- [ ] Data validated at boundaries
- [ ] No duplicated utility code
- [ ] Decisions documented (if non-obvious)
- [ ] Docs updated (if behavior changed)
