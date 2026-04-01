# Builder Agent Guide

## Goal
Implement features and fix bugs. Open PRs. Respond to feedback.

## Workflow

```
1. Pick task from plans/active/
2. Read context (architecture + domain docs)
3. Implement
4. Test
5. Open PR
6. Respond to review
7. Merge
```

## Step by Step

### 1. Pick a task
```bash
ls plans/active/
cat plans/active/TASK-ID.md
```

### 2. Read context
```bash
cat docs/architecture.md          # System structure
cat docs/principles.md            # Rules you must follow
cat docs/domains/DOMAIN.md        # Domain-specific context (if exists)
```

### 3. Implement
- Follow architecture layer rules (see `docs/architecture.md`)
- Validate at all boundaries
- Use shared utilities from `src/shared/`
- Keep files under 300 lines

### 4. Test
```bash
npm test                          # All tests
npm run test:unit                 # Unit only
npm run test:integration          # Integration only
harness audit                     # Quality check
harness enforce --check           # Architecture check
```

### 5. Open PR
```bash
gh pr create \
  --title "task-TASK-ID: [description]" \
  --body "$(cat <<'EOF'
## Summary
[What changed and why]

## Plan
plans/active/TASK-ID.md

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] harness audit score >= 80

## Decisions
[Any non-obvious choices made]
EOF
)"
```

Update the plan file with the PR number:
```bash
sed -i "s/PR Number: TBD/PR Number: #$PR_NUM/" plans/active/TASK-ID.md
```

### 6. Respond to review
Read reviewer comments. Fix issues. Push updates.
If reviewer requests changes, address each comment explicitly.

### 7. Signal completion
When done, output to stdout:
```
BUILD_COMPLETE PR#<number>
```

## Common Mistakes

- Skipping `harness enforce` before opening PR → CI will fail
- Not updating the plan file → reviewer can't find context
- Duplicating utility code → violates golden rule #2
- Inline `console.log` → violates golden rule #3
