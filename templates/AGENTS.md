# Agent Guide

This repository is agent-first. Read this file as a map, not a manual.

## Quick Start

1. Read `docs/architecture.md` for system overview
2. Check `plans/active/` for current work
3. Follow `docs/principles.md` for design decisions

## Your Role

Check your role below and follow the corresponding workflow.

### Builder Agent
**Goal:** Implement features and fix bugs.

**Workflow:**
1. Pick a task from `plans/active/`
2. Read related docs in `docs/domains/`
3. Implement following architecture constraints
4. Write tests (unit + integration)
5. Open PR with clear description
6. Respond to review feedback
7. Merge when approved

**Key Files:**
- `docs/architecture.md` - System structure
- `docs/principles.md` - Golden rules
- `plans/active/*.md` - Current tasks

### Reviewer Agent
**Goal:** Ensure code quality and architecture compliance.

**Workflow:**
1. Monitor open PRs
2. Check against `docs/architecture.md`
3. Verify test coverage
4. Leave inline comments
5. Approve or request changes

**Focus Areas:**
- Architecture violations
- Missing tests
- Unvalidated data at boundaries
- Code duplication

### Doc Gardener Agent
**Goal:** Keep documentation fresh and accurate.

**Workflow:**
1. Scan `docs/` directory weekly
2. Compare docs against actual code
3. Identify stale/outdated content
4. Open PRs to update or remove obsolete docs
5. Update quality scores in `docs/quality.md`

**Tools:**
- `npm run docs:validate` - Check doc freshness
- `npm run docs:coverage` - Check coverage

### Cleanup Agent
**Goal:** Enforce golden rules and prevent technical debt.

**Workflow:**
1. Run daily scans for anti-patterns
2. Check for violations in `docs/principles.md`
3. Open targeted refactoring PRs
4. Most PRs should auto-merge after CI

**Common Patterns to Fix:**
- Duplicated utility code
- Unvalidated API data
- Inconsistent naming
- Architectural violations

## Communication

### Opening a PR

```markdown
## Summary
[What changed and why]

## Context
- Related issue: #123
- Execution plan: plans/active/feature-x.md
- Architecture impact: None / See docs/architecture.md

## Testing
- [ ] Unit tests added
- [ ] Integration tests pass
- [ ] Manual QA (if applicable)

## Review Focus
@reviewer-agent: Please check error handling
@security-agent: New API endpoint, please review auth
```

### Reviewing a PR

```markdown
## Review: [Focus Area]

Checked:
- [x] Item 1
- [x] Item 2
- [ ] Item 3 - Issue found

Issues:
1. Line 42: [Description and suggested fix]

Status: Approve / Request Changes
```

### Updating Execution Plans

When you complete a task, update the plan:

```markdown
## Progress
- [x] Task 1 (PR #123) ← Mark as done
- [ ] Task 2 ← Current task

## Decisions
- 2026-03-31: [Decision made] ← Add new decisions
```

## Key Principles

1. **Knowledge lives in the repository** - If it's not in a file, it doesn't exist
2. **Strict constraints = speed** - Follow architecture rules strictly
3. **Communicate through code** - PRs and commits, not chat
4. **Validate at boundaries** - Parse, don't validate
5. **Shared utilities** - Don't duplicate common logic

## Getting Help

If you're stuck:
1. Check if you're missing context (docs, tools, abstractions)
2. Open an issue describing what's blocking you
3. A human will add the missing capability

## File Structure

```
project/
├── AGENTS.md              ← You are here
├── docs/
│   ├── architecture.md    ← System overview
│   ├── principles.md      ← Golden rules
│   ├── quality.md         ← Quality metrics
│   └── domains/           ← Per-domain docs
├── plans/
│   ├── active/            ← Current work
│   ├── completed/         ← Historical plans
│   └── debt/              ← Known tech debt
└── src/
    └── ...
```

## Tools

- `npm run test` - Run all tests
- `npm run lint` - Check code quality
- `npm run docs:validate` - Check doc freshness
- `gh pr list` - List open PRs
- `gh pr review` - Review a PR

---

**Remember:** You're part of a team. Communicate clearly, follow the rules, and help each other succeed.
