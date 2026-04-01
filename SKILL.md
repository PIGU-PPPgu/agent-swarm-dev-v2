# Agent Swarm Development

**Multi-agent collaborative software development framework inspired by OpenAI's Harness Engineering approach.**

## Overview

This skill enables multiple AI agents to collaborate on software projects with minimal human intervention. Based on OpenAI's experience building a 1M+ LOC product with 3 engineers and AI agents in 5 months.

**NEW: Now supports fully automatic execution!** Agents can run autonomously with daemon + file watcher + GitHub Actions integration.

## Automation Levels

### Level 1: Manual (Original)
- Human runs each agent script manually
- Human monitors completion
- Human triggers next phase

### Level 2: Semi-Automatic (NEW!)
- `agent-daemon` executes scripts automatically
- `agent-watcher` detects completions
- Next phase triggers automatically
- Human monitors via dashboard

### Level 3: Fully Automatic (NEW!)
- GitHub Actions trigger agents on PR events
- Agents communicate via PR comments
- Automatic retries on failure
- Human intervention only on escalation

**Quick Start (Automatic Mode):**
```bash
agent-swarm-start  # Starts daemon + watcher
agent-orchestrator run "Your task"
agent-orchestrator watch  # Monitor progress
```

See [docs/AUTOMATION.md](./docs/AUTOMATION.md) for complete automation guide.

## Core Principles

1. **Humans steer. Agents execute.**
2. **Knowledge lives in the repository, not in heads.**
3. **Strict constraints = speed multipliers.**
4. **Agent-to-agent communication through code, not chat.**

## Agent Roles

### 1. Builder Agent (编码智能体)
**Responsibility:** Implement features, write code, open PRs.

**Workflow:**
- Read task from execution plan or issue
- Run `/harness audit` to check current project quality
- Implement solution following architecture constraints
- Use `/harness enforce --check` to verify architecture compliance
- Write tests (unit + integration)
- Open PR with clear description
- Respond to review feedback
- Merge when approved

**Tools:** 
- git, gh CLI, language-specific tooling
- `/harness audit` - Check project quality before starting
- `/harness enforce` - Verify architecture constraints

### 2. Reviewer Agent (审查智能体)
**Responsibility:** Review PRs for correctness, architecture compliance, and code quality.

**Workflow:**
- Monitor open PRs
- Run `/harness audit` on PR changes
- Check against architecture rules (see `docs/architecture.md`)
- Use `/harness enforce --check` to verify no violations
- Verify test coverage
- Leave inline comments
- Approve or request changes
- Can be multiple reviewer agents with different focuses (security, performance, UX)

**Tools:** 
- gh CLI, custom linters, static analysis
- `/harness audit --pr` - Audit PR changes
- `/harness enforce --check` - Check architecture violations

### 3. Doc Gardener Agent (文档维护智能体)
**Responsibility:** Keep documentation fresh and accurate.

**Workflow:**
- Run `/harness garden --docs-only` weekly
- Scan `docs/` directory for stale content
- Compare docs against actual code behavior
- Identify stale/outdated content
- Open PRs to update or remove obsolete docs
- Update quality scores in `docs/quality.md`

**Tools:** 
- grep, ast parsers, doc validators
- `/harness garden --docs-only` - Automated doc cleanup
- `/harness audit --docs` - Check doc quality

### 4. Cleanup Agent (清理智能体)
**Responsibility:** Enforce "golden rules" and prevent technical debt accumulation.

**Workflow:**
- Run `/harness golden-rules` daily/weekly
- Use `/harness garden --code-only` for code cleanup
- Check for:
  - Duplicated utility code (should use shared packages)
  - Unvalidated data at boundaries
  - Inconsistent naming conventions
  - Architectural violations
- Open targeted refactoring PRs
- Most PRs should be auto-mergeable after CI passes

**Tools:** 
- custom linters, structural tests, pattern matchers
- `/harness golden-rules` - Apply golden rules refactoring
- `/harness garden --code-only` - Automated code cleanup

## Harness Quality Tools

All agents can use these quality tools to maintain code and documentation standards:

### `/harness init` - Initialize Project Structure

Creates agent-first project structure with proper documentation hierarchy:

```bash
/harness init
```

Creates:
- `docs/architecture/` - Architecture documentation
- `docs/design-docs/` - Design documents
- `docs/exec-plans/` - Execution plans
- `docs/product-specs/` - Product specifications
- `docs/references/` - Third-party library references
- `docs/quality/` - Quality standards and scores

### `/harness audit` - Quality Audit

Evaluates project quality from agent perspective:

```bash
/harness audit              # Full audit
/harness audit --docs       # Documentation only
/harness audit --pr         # PR changes only
/harness audit --score      # Show score only
```

**Audit Dimensions:**
1. **Documentation Coverage** - Are all modules documented?
2. **Architecture Clarity** - Is the structure clear?
3. **Context Reachability** - Can agents find what they need?
4. **Mechanical Verification** - Are constraints enforced?

**Output:**
- Readability score (0-100)
- Issue list (prioritized)
- Improvement suggestions

### `/harness enforce` - Architecture Constraints

Generates and applies architecture rules:

```bash
/harness enforce            # Apply constraints
/harness enforce --check    # Check only (no changes)
/harness enforce --dry-run  # Show what would be enforced
```

**Enforces:**
- Layered architecture (types → config → repo → service → runtime → ui)
- Dependency direction (no circular dependencies)
- Boundary validation (Zod schemas at API boundaries)
- File size limits
- Naming conventions

### `/harness garden` - Cleanup Stale Content

Automated cleanup of outdated docs and code:

```bash
/harness garden                # Full cleanup
/harness garden --docs-only    # Documentation only
/harness garden --code-only    # Code only
/harness garden --auto-pr      # Auto-create PRs
```

**Cleans:**
- Outdated documentation
- Broken links
- Duplicate code
- Unused exports
- Inconsistent naming

### `/harness golden-rules` - Apply Best Practices

Interactive refactoring based on golden rules:

```bash
/harness golden-rules          # Interactive mode
/harness golden-rules --check  # Check only
/harness golden-rules --rule shared-utils  # Specific rule
```

**Golden Rules:**
1. **Shared utilities** - Use shared packages, not inline helpers
2. **Boundary validation** - Parse data at system boundaries
3. **Typed SDKs** - Use generated clients, not manual requests
4. **Centralized invariants** - Encode rules in tools

## Repository Structure

```
project/
├── AGENTS.md              # 100-line map (not encyclopedia)
├── docs/
│   ├── architecture.md    # System architecture overview
│   ├── principles.md      # Core design principles
│   ├── quality.md         # Quality scores by domain
│   └── domains/           # Per-domain documentation
│       ├── auth.md
│       ├── billing.md
│       └── ...
├── plans/
│   ├── active/            # Current execution plans
│   ├── completed/         # Historical plans with decisions
│   └── debt/              # Known technical debt
├── .github/
│   └── workflows/         # CI/CD (also agent-generated)
└── src/
    └── ...
```

## Communication Protocol

### Agent-to-Agent via Pull Requests

**Opening a PR:**
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

**Reviewing a PR:**
```markdown
## Architecture Review ✅

Checked against docs/architecture.md:
- [x] Follows domain layering (Types → Service → UI)
- [x] No circular dependencies
- [x] Proper error boundaries

## Code Quality ⚠️

Issues found:
1. Line 42: Unvalidated input from API - please add Zod schema
2. Line 89: Consider extracting to shared utility

Approve after fixes.
```

### Shared State Files

**`plans/active/feature-x.md`** (Execution Plan)
```markdown
# Feature X Implementation

**Status:** In Progress (60%)
**Owner:** builder-agent-1
**Started:** 2026-03-31

## Goal
[Clear description]

## Progress
- [x] Design doc approved
- [x] Database schema
- [ ] API endpoints (in review: PR #123)
- [ ] Frontend UI
- [ ] E2E tests

## Decisions
- 2026-03-31: Chose PostgreSQL over MongoDB (see docs/decisions/001.md)
- 2026-03-30: API versioning strategy decided

## Blockers
None
```

**`docs/quality.md`** (Quality Dashboard)
```markdown
# Documentation Quality

| Domain | Coverage | Freshness | Owner |
|--------|----------|-----------|-------|
| Auth   | 95%      | ✅ Fresh  | doc-gardener |
| Billing| 60%      | ⚠️ Stale  | doc-gardener |
| API    | 100%     | ✅ Fresh  | doc-gardener |

Last updated: 2026-03-31 by doc-gardener-agent
```

## Constraints & Automation

### Architecture Rules (Enforced by Linters)

**Example: Layered Architecture**
```
Domain Structure:
  types/      → config/ → repo/ → service/ → runtime/ → ui/
  
Rules:
- Code can only depend "forward" (left to right)
- No circular dependencies
- Cross-cutting concerns (auth, logging) via Providers interface
```

**Custom Lint Example:**
```javascript
// .eslintrc.js (agent-generated)
rules: {
  'no-unvalidated-api-data': 'error',  // Must use Zod/validation
  'prefer-shared-utils': 'warn',       // Don't reinvent utilities
  'max-file-lines': ['error', 300],    // Keep files small
}
```

### CI/CD Pipeline

**`.github/workflows/agent-review.yml`**
```yaml
name: Agent Review
on: [pull_request]

jobs:
  structural-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check architecture constraints
        run: npm run test:structure
      
  doc-freshness:
    runs-on: ubuntu-latest
    steps:
      - name: Validate docs against code
        run: npm run docs:validate
      
  auto-merge:
    needs: [structural-tests, doc-freshness]
    if: github.actor == 'cleanup-agent'
    runs-on: ubuntu-latest
    steps:
      - name: Auto-merge cleanup PRs
        run: gh pr merge --auto --squash
```

## Human Involvement

### When Humans Step In

1. **Initial setup** - Define architecture, principles, golden rules
2. **Judgment calls** - Product decisions, UX trade-offs
3. **Validation** - Final QA before production deploy
4. **Feedback** - User bug reports → execution plans

### When Humans Don't Step In

1. **Code review** - Agents review each other
2. **Refactoring** - Cleanup agent handles it
3. **Documentation** - Doc gardener keeps it fresh
4. **CI fixes** - Builder agent retries and fixes

## Getting Started

### 1. Initialize Repository

```bash
# Create structure
mkdir -p docs/{domains,decisions} plans/{active,completed,debt}

# Generate initial AGENTS.md
cat > AGENTS.md << 'EOF'
# Agent Guide

This repository is agent-first. Read this file as a map, not a manual.

## Quick Start
1. Read docs/architecture.md for system overview
2. Check plans/active/ for current work
3. Follow docs/principles.md for design decisions

## Roles
- Builder: Implement features (see plans/active/)
- Reviewer: Review PRs (check docs/architecture.md)
- Doc Gardener: Keep docs/ fresh
- Cleanup: Enforce golden rules (see docs/principles.md)

## Communication
- Open PRs for all changes
- Tag relevant agents in PR descriptions
- Update execution plans in plans/active/
- Log decisions in docs/decisions/

See docs/ for detailed guidance.
EOF
```

### 2. Define Architecture

**`docs/architecture.md`**
```markdown
# System Architecture

## Layered Structure
[Diagram and explanation]

## Domain Boundaries
[List of domains: auth, billing, api, etc.]

## Dependency Rules
[What can depend on what]

## Technology Choices
- Language: TypeScript
- Framework: Next.js
- Database: PostgreSQL
- Testing: Vitest
```

### 3. Set Golden Rules

**`docs/principles.md`**
```markdown
# Golden Rules

These are mechanically enforced via linters and CI.

1. **Parse, don't validate** - Validate data at boundaries
2. **Shared utilities** - Don't duplicate common logic
3. **Structured logging** - Always use logger.info({...})
4. **Type safety** - No `any` types without justification
5. **Test coverage** - Minimum 80% for new code
```

### 4. Spawn Agents

**Using OpenClaw:**
```bash
# Builder agent
openclaw spawn --agent builder --task "Implement user auth" \
  --plan plans/active/auth.md

# Reviewer agent (watches PRs)
openclaw spawn --agent reviewer --watch-prs \
  --focus architecture,security

# Doc gardener (weekly)
openclaw spawn --agent doc-gardener --schedule weekly

# Cleanup agent (daily)
openclaw spawn --agent cleanup --schedule daily \
  --rules docs/principles.md
```

**Using other platforms:**
- Cursor: Open multiple tabs, assign roles in system prompts
- Codex CLI: Use `codex --agent-role=builder` flag
- Claude Code: Spawn sub-agents with role-specific prompts

## Advanced Patterns

### Execution Plans

**`plans/active/feature-x.md`** (Template)
```markdown
# [Feature Name]

**Status:** Not Started | In Progress | Blocked | Completed
**Owner:** [agent-name]
**Started:** YYYY-MM-DD
**Target:** YYYY-MM-DD

## Goal
[1-2 sentence description]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Implementation Steps
1. [ ] Step 1 (PR #XXX)
2. [ ] Step 2
3. [ ] Step 3

## Decisions
- YYYY-MM-DD: [Decision made and rationale]

## Blockers
[List any blockers]

## Related
- Design doc: docs/designs/feature-x.md
- Issues: #123, #456
```

### Decision Logs

**`docs/decisions/001-database-choice.md`**
```markdown
# ADR 001: Database Choice

**Date:** 2026-03-31
**Status:** Accepted
**Deciders:** human-lead, builder-agent-1

## Context
Need to choose database for user data storage.

## Decision
Use PostgreSQL.

## Rationale
- ACID compliance needed for billing
- JSON support for flexible schemas
- Strong ecosystem and agent familiarity

## Consequences
- Positive: Reliable, well-documented
- Negative: More complex than MongoDB for simple cases
- Mitigation: Use Prisma ORM for easier schema management
```

### Quality Metrics

Track and improve over time:

```markdown
# Metrics Dashboard

## Code Quality
- Test coverage: 87% (target: 80%)
- Lint violations: 3 (target: 0)
- Cyclomatic complexity: avg 4.2 (target: <10)

## Documentation
- Coverage: 92% of public APIs documented
- Freshness: 95% updated in last 30 days
- Broken links: 0

## Agent Performance
- Builder throughput: 3.5 PRs/day/agent
- Review latency: avg 15 minutes
- Auto-merge rate: 78% (cleanup PRs)

Last updated: 2026-03-31
```

## Troubleshooting

### Agent is stuck / making no progress

**Diagnosis:** Missing context or tools.

**Solution:**
1. Check what the agent is trying to do
2. Identify missing capability (tool, abstraction, documentation)
3. Add it to the repository (let another agent implement it)
4. Retry original task

### Code quality degrading

**Diagnosis:** Agents copying bad patterns.

**Solution:**
1. Identify the anti-pattern
2. Add it to `docs/principles.md` as a golden rule
3. Create custom linter to detect it
4. Run cleanup agent to fix existing instances

### Documentation drift

**Diagnosis:** Docs not keeping up with code changes.

**Solution:**
1. Increase doc-gardener frequency (daily instead of weekly)
2. Add CI check: fail PR if docs become stale
3. Require doc updates in PR template

### Too many merge conflicts

**Diagnosis:** Agents working on overlapping areas.

**Solution:**
1. Better task decomposition in execution plans
2. Use feature flags to isolate changes
3. Coordinate via execution plan ownership

## References

- [OpenAI Harness Engineering](https://openai.com/index/harness-engineering/)
- [Architecture Decision Records](https://adr.github.io/)
- [Parse, Don't Validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)

## License

MIT - Feel free to adapt for your projects.

---

**Maintained by:** OpenClaw Community
**Version:** 1.0.0
**Last Updated:** 2026-03-31
