# Automation Guide - Agent Swarm Development

This guide explains how to use the fully automatic agent swarm system.

## Overview

The agent swarm system now supports three levels of automation:

1. **Manual Mode** - You run each agent script manually
2. **Semi-Automatic Mode** - Agents execute automatically, you monitor
3. **Fully Automatic Mode** - Everything runs automatically via GitHub Actions

## Components

### 1. Agent Orchestrator (`agent-orchestrator`)

The main coordinator that:
- Receives high-level tasks
- Creates execution plans
- Generates agent scripts
- Tracks progress

**Commands:**
```bash
agent-orchestrator run "Task description"
agent-orchestrator status
agent-orchestrator watch
agent-orchestrator stop [task-id]
```

### 2. Agent Daemon (`agent-daemon`) - NEW!

Background service that:
- Monitors agent session files
- Executes agent scripts automatically
- Detects completion signals
- Triggers next phase agents
- Retries failed agents

**Commands:**
```bash
agent-daemon start      # Start daemon in background
agent-daemon stop       # Stop daemon
agent-daemon restart    # Restart daemon
agent-daemon status     # Check if running
agent-daemon logs       # Tail daemon logs
```

**How it works:**
1. Daemon runs in background (checks every 10 seconds)
2. Scans `.agent-swarm/sessions/*.json` for `status: "active"`
3. Executes corresponding `.sh` script
4. Parses output for completion signals:
   - `DESIGN_COMPLETE`
   - `BUILD_COMPLETE PR#123`
   - `REVIEW_COMPLETE [APPROVED|CHANGES_REQUESTED]`
   - `DOC_COMPLETE`
5. Updates session status to `completed`
6. Triggers next phase agent

### 3. Agent Watcher (`agent-watcher`) - NEW!

File change monitor that:
- Watches `plans/` directory for updates
- Watches `.agent-swarm/sessions/` for status changes
- Detects phase completions in plan files
- Triggers agents based on file changes

**Commands:**
```bash
agent-watcher start     # Start watching (foreground)
agent-watcher test      # Test file detection
```

**Dependencies:**
- macOS: `brew install fswatch`
- Linux: `apt install inotify-tools`

**How it works:**
1. Uses `fswatch` (macOS) or `inotifywait` (Linux) for real-time file monitoring
2. Detects changes to plan files (`plans/**/*.md`)
3. Parses plan files for phase completions (`[x]`)
4. Updates agent session status to trigger execution
5. Falls back to polling if no file watcher available

### 4. GitHub Actions Integration - NEW!

Two workflows:

#### `agent-trigger.yml`
Triggers on PR events:
- **PR opened** → Spawns reviewer agent
- **Review submitted (changes requested)** → Re-triggers builder agent
- **Review approved** → Triggers doc gardener

#### `quality-checks.yml`
Runs on every PR:
- Harness audit (quality score)
- Architecture enforcement
- Golden rules check
- Test execution
- Coverage reporting

## Setup Guide

### Quick Start (Semi-Automatic)

```bash
# 1. Navigate to your project
cd your-project

# 2. Initialize agent swarm
harness init

# 3. Start the daemon
agent-daemon start

# 4. Start the watcher (in separate terminal or background)
agent-watcher start &

# 5. Initiate a task
agent-orchestrator run "Implement user authentication"

# 6. Watch it work!
agent-orchestrator watch
```

### Full Setup (Fully Automatic with GitHub)

```bash
# 1. Copy workflows to your project
cp -r /path/to/agent-swarm-dev-v2/.github/workflows .github/

# 2. Commit and push
git add .github/workflows
git commit -m "Add agent swarm automation"
git push

# 3. Start local daemon (for local development)
agent-daemon start
agent-watcher start &

# 4. Create a task
agent-orchestrator run "Add new feature"

# 5. Agents will:
#    - Design locally
#    - Build locally
#    - Open PR
#    - GitHub Actions spawns reviewer
#    - Review happens in CI
#    - Doc gardener updates docs
```

## Workflow Examples

### Example 1: Simple Feature

```bash
# Start automation
agent-daemon start
agent-watcher start &

# Initiate task
agent-orchestrator run "Add user profile page"

# What happens:
# 1. Design agent creates design doc (auto)
# 2. Builder agent implements code (auto)
# 3. Builder opens PR (auto)
# 4. GitHub Actions spawns reviewer (auto)
# 5. Reviewer approves (auto if quality passes)
# 6. Doc gardener updates docs (auto)
# 7. Task marked complete (auto)

# You just monitor:
agent-orchestrator watch
```

### Example 2: Bug Fix

```bash
agent-orchestrator run "Fix bug #123: Login timeout"

# Agents will:
# 1. Read issue #123 from GitHub
# 2. Design fix
# 3. Implement fix
# 4. Write regression test
# 5. Open PR with "Fixes #123"
# 6. Self-review
# 7. Request human review if complex
```

### Example 3: Refactoring

```bash
agent-orchestrator run "Refactor auth module for better testability"

# Agents will:
# 1. Analyze current architecture
# 2. Design refactoring plan
# 3. Implement changes incrementally
# 4. Ensure all tests pass
# 5. Update documentation
# 6. Open PR with before/after comparison
```

## Monitoring and Control

### Real-Time Monitoring

```bash
# Watch dashboard (refreshes every 5s)
agent-orchestrator watch

# Check daemon status
agent-daemon status

# Tail daemon logs
agent-daemon logs

# Tail watcher logs
tail -f .agent-swarm/logs/watcher.log
```

### Manual Intervention

```bash
# Stop all agents
agent-orchestrator stop

# Stop specific task
agent-orchestrator stop task-20260401-123456-abc123

# Stop daemon
agent-daemon stop

# Manually execute an agent
bash .agent-swarm/sessions/task-xxx-builder.sh
```

### Debugging

```bash
# Check agent session status
cat .agent-swarm/sessions/task-xxx-builder.json

# Check agent output
cat .agent-swarm/logs/task-xxx-builder.log

# Check orchestrator logs
cat .agent-swarm/logs/orchestrator.log

# Check plan file
cat plans/in-progress/task-xxx.md
```

## Completion Signals

Agents must output specific signals to indicate completion:

### Design Agent
```
DESIGN_COMPLETE
```

### Builder Agent
```
BUILD_COMPLETE PR#123
```

### Reviewer Agent
```
REVIEW_COMPLETE APPROVED
# or
REVIEW_COMPLETE CHANGES_REQUESTED
```

### Doc Gardener
```
DOC_COMPLETE
```

## Error Handling

### Automatic Retry

The daemon automatically retries failed agents with exponential backoff:
- 1st retry: 1 minute
- 2nd retry: 5 minutes
- 3rd retry: 15 minutes
- After 3 failures: Human escalation

### Manual Retry

```bash
# Reset agent status to retry
jq '.status = "active"' .agent-swarm/sessions/task-xxx-builder.json > tmp.json
mv tmp.json .agent-swarm/sessions/task-xxx-builder.json

# Daemon will pick it up automatically
```

### Human Escalation

When an agent fails 3 times:
1. Daemon logs error
2. Task plan updated with "BLOCKED" status
3. Human notified (if notifications configured)
4. Human can:
   - Fix the issue manually
   - Update agent instructions
   - Retry with modified context

## Configuration

### Daemon Configuration

Edit `.agent-swarm/config.json`:

```json
{
  "daemon": {
    "check_interval": 10,
    "max_retries": 3,
    "retry_backoff": [60, 300, 900],
    "ai_cli": "openclaw"
  },
  "watcher": {
    "enabled": true,
    "poll_interval": 10
  },
  "notifications": {
    "enabled": false,
    "webhook_url": ""
  }
}
```

### GitHub Actions Configuration

Edit `.github/workflows/agent-trigger.yml`:

```yaml
env:
  OPENCLAW_API_KEY: ${{ secrets.OPENCLAW_API_KEY }}
  AI_CLI: "openclaw"  # or "codex" or "claude"
```

## Best Practices

1. **Start with semi-automatic mode** - Get comfortable before going fully automatic
2. **Monitor the first few tasks** - Ensure agents behave as expected
3. **Keep execution plans updated** - Agents rely on accurate plans
4. **Use meaningful task descriptions** - Better descriptions = better agent performance
5. **Review agent outputs** - Especially in the beginning
6. **Set up notifications** - Get alerted when human intervention needed
7. **Keep golden rules updated** - Agents enforce what you define
8. **Regular quality audits** - Run `/harness audit` periodically

## Troubleshooting

### Daemon not executing agents

```bash
# Check daemon status
agent-daemon status

# Check logs
agent-daemon logs

# Restart daemon
agent-daemon restart
```

### Watcher not detecting changes

```bash
# Test watcher
agent-watcher test

# Check if fswatch/inotify installed
which fswatch  # macOS
which inotifywait  # Linux

# Install if missing
brew install fswatch  # macOS
sudo apt install inotify-tools  # Linux
```

### Agents not completing

```bash
# Check agent output
cat .agent-swarm/logs/task-xxx-builder.log

# Verify completion signal
grep "COMPLETE" .agent-swarm/logs/task-xxx-builder.log

# Manually mark as complete
jq '.status = "completed" | .completion_signal = "BUILD_COMPLETE"' \
  .agent-swarm/sessions/task-xxx-builder.json > tmp.json
mv tmp.json .agent-swarm/sessions/task-xxx-builder.json
```

### GitHub Actions not triggering

```bash
# Check workflow file
cat .github/workflows/agent-trigger.yml

# Check GitHub Actions logs in repository

# Verify task ID in PR title
# PR title must contain: task-YYYYMMDD-HHMMSS-xxxxxx
```

## Performance Tips

1. **Use faster AI models for simple tasks** - Configure per-agent
2. **Batch similar tasks** - More efficient than one-by-one
3. **Optimize check intervals** - Balance responsiveness vs. resource usage
4. **Use caching** - Cache dependencies, build artifacts
5. **Parallel execution** - Multiple agents can run simultaneously

## Security Considerations

1. **Secrets management** - Use GitHub Secrets for API keys
2. **Code review** - Always review agent-generated code
3. **Access control** - Limit agent permissions
4. **Audit logs** - Keep logs for compliance
5. **Rate limiting** - Prevent API abuse

## Next Steps

1. Try manual mode first
2. Enable semi-automatic mode
3. Set up GitHub Actions
4. Configure notifications
5. Customize agent prompts
6. Add custom quality checks
7. Scale to multiple projects

---

**Questions?** Check the main [README.md](./README.md) or [SKILL.md](./SKILL.md)
