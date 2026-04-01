# Quality Scores

Track documentation and code quality per domain.
Updated by doc-gardener agent after each scan.

## Scoring

| Score | Meaning |
|-------|---------|
| 90-100 | Excellent — accurate, complete, well-linked |
| 70-89 | Good — minor gaps or stale sections |
| 50-69 | Needs work — significant gaps or outdated content |
| < 50 | Poor — major issues, agents may be misled |

## Current Scores

| Domain | Doc Score | Code Score | Last Updated | Notes |
|--------|-----------|------------|--------------|-------|
| Core Framework | — | — | — | Initial setup |
| Agent Orchestration | — | — | — | Initial setup |
| Quality Tools | — | — | — | Initial setup |

## How to Update

After a doc-gardener run, update this table:

```markdown
| Domain | Doc Score | Code Score | Last Updated | Notes |
|--------|-----------|------------|--------------|-------|
| Auth | 85 | 90 | 2026-04-02 | API docs updated |
```

## Target

All domains should maintain score >= 80.
Scores below 70 trigger a cleanup agent run.
