# Architecture

## Overview

This repo is an agent-first development framework. The system coordinates multiple
AI agents (Claude, Codex, etc.) to build software with minimal human intervention.

## Components

```
bin/
├── agent-orchestrator   # Task decomposition + agent spawning
├── agent-daemon         # Background executor (runs agent scripts)
├── agent-watcher        # File change monitor (detects completions)
├── agent-swarm-start    # Quick start (daemon + watcher)
└── harness              # Quality enforcement tool

.agent-swarm/
├── sessions/            # Agent session state (JSON)
├── logs/                # Agent execution logs
├── state/               # Daemon/watcher health state
└── locks/               # File locks (prevent concurrent writes)

plans/
├── active/              # Tasks in progress
├── completed/           # Finished tasks
└── debt/                # Known tech debt

docs/
├── architecture.md      # This file
├── principles.md        # Golden rules
├── quality.md           # Quality scores per domain
├── roles/               # Per-role agent guides
├── domains/             # Per-domain documentation
└── decisions/           # Architecture decision records (ADRs)
```

## Agent Session Lifecycle

```
status: "active"     → daemon picks up, executes script
status: "running"    → script executing
status: "completed"  → completion signal detected
status: "failed"     → exit code != 0
status: "retry_pending" → waiting for backoff window
```

## Phase Transitions

```
design → builder → reviewer → doc-gardener
```

Each phase activates the next by setting the next session's status to `active`.
Reviewer with `CHANGES_REQUESTED` re-activates builder (feedback loop).

## Execution Plan Format

Every task has a plan file at `plans/active/TASK-ID.md`:

```markdown
# Task: [Description]

## Phases
- [ ] Phase 1: Design
- [ ] Phase 2: Implementation
- [ ] Phase 3: Review
- [ ] Phase 4: Documentation

## Agent Assignments
- Design: [status]
- Builder: [status]
- Reviewer: [status]
- Doc Gardener: [status]

## PR Information
- PR Number: TBD
- PR URL: TBD

## Decisions
- [date]: [decision and rationale]

## Progress Log
- [timestamp]: [what happened]
```

## Constraints

- Agents communicate via files, not direct calls
- All state lives in the repository (version-controlled)
- No knowledge outside the repo — if not in a file, doesn't exist
- Architecture layers enforced by `harness enforce`
