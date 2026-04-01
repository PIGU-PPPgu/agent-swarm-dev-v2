# Golden Rules (Principles)

These are non-negotiable. CI enforces them mechanically.

## Code Quality

### 1. Validate at boundaries
Parse incoming data at every boundary (API responses, user input, file reads).
Never assume data shape. Use schema validation or typed SDKs.

```bash
# Bad
const user = JSON.parse(response)
user.name.toUpperCase()

# Good
const user = UserSchema.parse(JSON.parse(response))
user.name.toUpperCase()
```

### 2. Shared utilities over duplicated helpers
Before writing a helper function, check `src/shared/`.
If it doesn't exist there, add it there — don't create local copies.

### 3. Structured logging only
No `console.log`. Use the shared logger with structured fields.

```bash
# Bad
console.log("user created", userId)

# Good
logger.info("user_created", { userId, timestamp })
```

### 4. No magic numbers or strings
Constants belong in a constants file, not inline.

### 5. File size limits
- Source files: max 300 lines
- Test files: max 500 lines
- If larger, split by responsibility

## Architecture

### 6. Respect layer boundaries
Dependencies flow in one direction only. See `docs/architecture.md`.
Violations are caught by `harness enforce`.

### 7. No cross-domain direct imports
Domains communicate through defined interfaces, not direct imports.

### 8. Every PR references a plan
PR description must link to `plans/active/TASK-ID.md`.

## Documentation

### 9. Decisions get recorded
Any non-obvious architectural decision goes in `docs/decisions/`.
Format: `docs/decisions/YYYY-MM-DD-short-title.md`

### 10. Docs stay fresh
The doc-gardener agent scans for stale docs weekly.
If you change behavior, update the relevant doc in the same PR.

---

## Enforcement

```bash
harness golden-rules --check   # Check all rules
harness enforce --check        # Check architecture rules
harness audit                  # Full quality score
```

CI runs these on every PR. Fix violations before requesting review.

---

## Why These Rules?

In an agent-generated codebase, patterns replicate fast.
One bad pattern in 10 files becomes 100 files in a week.
These rules are the immune system.
