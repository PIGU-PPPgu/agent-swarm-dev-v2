# AGENTS.md — Agent Guide

This is a map, not a manual. Read it to orient yourself, then follow the links.

## What is this repo?

A framework that gives Claude, Codex, and other AI agents a structured environment
to build software autonomously. You are an agent using this framework.

**Core principle:** Humans steer. Agents execute.

---

## Start Here

```
1. What am I doing?     → plans/active/
2. How does this work?  → docs/architecture.md
3. What are the rules?  → docs/principles.md
4. What's my role?      → See "Roles" below
```

---

## Roles

### builder
Implement features and fix bugs.
→ Full guide: `docs/roles/builder.md`

### reviewer
Ensure quality and architecture compliance.
→ Full guide: `docs/roles/reviewer.md`

### doc-gardener
Keep documentation accurate and fresh.
→ Full guide: `docs/roles/doc-gardener.md`

### cleanup
Enforce golden rules, prevent drift.
→ Full guide: `docs/roles/cleanup.md`

---

## Execution Flow

```
Task created → plans/active/TASK.md
    ↓
builder runs → opens PR
    ↓
reviewer checks → approves or requests changes
    ↓
doc-gardener updates docs
    ↓
Task moves → plans/completed/TASK.md
```

Completion signals (output to stdout):
- `DESIGN_COMPLETE`
- `BUILD_COMPLETE PR#<number>`
- `REVIEW_COMPLETE APPROVED` or `REVIEW_COMPLETE CHANGES_REQUESTED`
- `DOC_COMPLETE`

---

## Key Locations

| What | Where |
|------|-------|
| Current tasks | `plans/active/` |
| Completed tasks | `plans/completed/` |
| Tech debt | `plans/debt/` |
| Architecture | `docs/architecture.md` |
| Golden rules | `docs/principles.md` |
| Domain docs | `docs/domains/` |
| Decision log | `docs/decisions/` |
| Quality scores | `docs/quality.md` |

---

## Tools Available

```bash
harness audit          # Quality score (0-100)
harness enforce        # Check architecture violations
harness golden-rules   # Check golden rule violations
harness garden         # Find stale docs
agent-orchestrator     # Spawn and manage agents
agent-worktree         # Manage isolated worktrees per task
plan-update log        # Append to task progress log
plan-update decision   # Record a decision in the task log
plan-update phase      # Mark a phase complete
plan-update pr         # Set PR number on task plan
gh pr create           # Open a PR
gh pr review           # Review a PR
```

---

## Rules (non-negotiable)

1. **Validate at boundaries** — parse incoming data, never assume shape
2. **No knowledge outside the repo** — if it's not in a file, it doesn't exist
3. **Shared utilities over duplicated helpers** — check `src/shared/` first
4. **Architecture layers are strict** — see `docs/architecture.md`
5. **Every PR needs a plan reference** — link to `plans/active/TASK.md`

Violations are caught by CI. Fix them before merging.

---

## When You're Stuck

Something is missing (tool, doc, abstraction). Don't guess.
1. Check `docs/` for relevant context
2. Check `plans/debt/` for known issues
3. Open a PR that adds the missing capability
4. A human or cleanup agent will unblock you

---

*~100 lines. For depth, follow the links above.*
