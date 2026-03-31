# Agent Swarm Development

Multi-agent collaborative software development framework with integrated quality tools, inspired by OpenAI's Harness Engineering.

## What is this?

A comprehensive framework for coordinating multiple AI agents (Claude, Codex, Cursor, etc.) to build software collaboratively with minimal human intervention, **plus integrated quality tools** to maintain code and documentation standards.

Based on OpenAI's experience: **3 engineers + AI agents → 1M+ lines of code in 5 months**.

## Key Features

- **4 Agent Roles:** Builder, Reviewer, Doc Gardener, Cleanup
- **Agent-to-Agent Communication:** Via PRs and shared repository state
- **Integrated Quality Tools:** `/harness` commands for audit, enforce, garden, golden-rules
- **Strict Architecture Constraints:** Enforced by linters and CI
- **Knowledge in Repository:** Everything agents need is version-controlled
- **Platform Agnostic:** Works with any AI coding assistant

## Quick Start

1. **Initialize repository structure:**
   ```bash
   mkdir -p docs/{domains,decisions} plans/{active,completed,debt}
   ```

2. **Create AGENTS.md** (100-line map, not encyclopedia)

3. **Define architecture** in `docs/architecture.md`

4. **Set golden rules** in `docs/principles.md`

5. **Spawn agents** with role-specific prompts

See [SKILL.md](./SKILL.md) for complete documentation.

## Core Principles

1. **Humans steer. Agents execute.**
2. **Knowledge lives in the repository, not in heads.**
3. **Strict constraints = speed multipliers.**
4. **Agent-to-agent communication through code, not chat.**

## Agent Roles

| Role | Responsibility | Frequency | Harness Tools |
|------|---------------|-----------|---------------|
| **Builder** | Write code, open PRs | Continuous | `/harness audit`, `/harness enforce --check` |
| **Reviewer** | Review PRs, enforce architecture | Per PR | `/harness audit --pr`, `/harness enforce --check` |
| **Doc Gardener** | Keep docs fresh | Weekly | `/harness garden --docs-only`, `/harness audit --docs` |
| **Cleanup** | Enforce golden rules, refactor | Daily | `/harness golden-rules`, `/harness garden --code-only` |

## Example Workflow

```
1. Human: Define feature in execution plan
   └─> plans/active/feature-x.md

2. Builder Agent: Run quality check
   └─> /harness audit
   └─> /harness enforce --check

3. Builder Agent: Implement feature
   └─> Opens PR #123

4. Reviewer Agent: Review PR
   └─> /harness audit --pr
   └─> /harness enforce --check
   └─> Leaves comments, requests changes

5. Builder Agent: Address feedback
   └─> Updates PR, responds to comments

6. Reviewer Agent: Approves
   └─> PR auto-merges

7. Doc Gardener: Updates docs
   └─> /harness garden --docs-only
   └─> Opens PR #124 to update docs/

8. Cleanup Agent: Scans for anti-patterns
   └─> /harness golden-rules
   └─> /harness garden --code-only
   └─> Opens PR #125 to refactor duplicated code
```

## Harness Quality Tools

All agents use these integrated tools:

```bash
/harness init              # Initialize project structure
/harness audit             # Audit code quality (score 0-100)
/harness enforce           # Enforce architecture constraints
/harness garden            # Cleanup stale docs/code
/harness golden-rules      # Apply best practices refactoring
```

**Example: Builder Agent workflow**
```bash
# Before starting work
/harness audit --score
# Score: 78/100

# Implement feature...

# Before opening PR
/harness enforce --check
# ✓ No architecture violations

/harness audit --score
# Score: 82/100 (+4)
```

## Repository Structure

```
project/
├── AGENTS.md              # 100-line agent guide
├── docs/
│   ├── architecture.md    # System overview
│   ├── principles.md      # Golden rules
│   ├── quality.md         # Quality metrics
│   └── domains/           # Per-domain docs
├── plans/
│   ├── active/            # Current work
│   ├── completed/         # Historical plans
│   └── debt/              # Known tech debt
└── src/
    └── ...
```

## Platform Support

- ✅ **OpenClaw** - Native support via `openclaw spawn`
- ✅ **Cursor** - Use multiple tabs with role-specific system prompts
- ✅ **Codex CLI** - Use `--agent-role` flag
- ✅ **Claude Code** - Spawn sub-agents with role prompts
- ✅ **Any AI assistant** - Follow the communication protocol

## Why This Works

### Traditional Development
- Human writes every line of code
- Code review is bottleneck
- Documentation lags behind
- Technical debt accumulates

### Agent Swarm Development
- Agents write code, humans steer
- Agents review each other
- Doc gardener keeps docs fresh
- Cleanup agent prevents debt accumulation

**Result:** 10x faster development with maintained quality.

## Real-World Results (OpenAI)

- **Team:** 3 engineers → 7 engineers
- **Output:** 1,500 PRs in 5 months
- **Codebase:** 1M+ lines of code
- **Throughput:** 3.5 PRs/day/engineer
- **Human coding:** 0% (all agent-generated)

## Getting Started

### Option 1: OpenClaw

```bash
# Install skill
openclaw skills install agent-swarm-dev

# Initialize project
cd your-project
openclaw agent-swarm init

# Spawn agents
openclaw spawn --agent builder --task "Implement auth"
openclaw spawn --agent reviewer --watch-prs
openclaw spawn --agent doc-gardener --schedule weekly
openclaw spawn --agent cleanup --schedule daily
```

### Option 2: Manual Setup

1. Read [SKILL.md](./SKILL.md)
2. Copy repository structure
3. Create AGENTS.md, docs/, plans/
4. Define architecture and golden rules
5. Spawn agents with role-specific prompts

## Examples

See [examples/](./examples/) for:
- Sample AGENTS.md
- Architecture documentation templates
- Execution plan templates
- Custom linter examples
- CI/CD workflows

## Contributing

This is a living framework. Contributions welcome:
- Share your agent coordination patterns
- Add platform-specific guides
- Improve templates and examples

## License

MIT

## References

- [OpenAI Harness Engineering](https://openai.com/index/harness-engineering/)
- [Architecture Decision Records](https://adr.github.io/)
- [OpenClaw Documentation](https://docs.openclaw.ai)

---

**Version:** 1.0.0  
**Maintained by:** OpenClaw Community  
**Last Updated:** 2026-03-31
