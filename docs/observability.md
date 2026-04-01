# Observability Guide

Agents can directly observe the running application.
Use these tools to verify behavior, reproduce bugs, and validate fixes.

## Logs

```bash
# See recent errors
agent-observe logs --filter "ERROR" --tail 50

# See logs from last 10 minutes
agent-observe logs --since "10 minutes ago"

# See logs for a specific component
agent-observe logs --filter "auth" --tail 100
```

**When to use:**
- After a build, check for startup errors
- When reproducing a bug, look for related log lines
- After a fix, verify the error no longer appears

## Metrics

```bash
# See all recorded metrics
agent-observe metrics

# See specific metric
agent-observe metrics --name "response_time"

# See metrics from last hour
agent-observe metrics --since "1 hour ago"
```

**Emitting metrics from your code/tests:**
```bash
# Record a metric event
agent-observe record "build_duration" "45" "seconds"
agent-observe record "test_pass_rate" "98.5" "percent"
agent-observe record "bundle_size" "234" "kb"
```

## Screenshots

```bash
# Capture current UI state
agent-observe screenshot --url http://localhost:3000

# Capture specific page
agent-observe screenshot --url http://localhost:3000/dashboard --out /tmp/dashboard.png
```

**When to use:**
- Reproduce a UI bug: screenshot before fix
- Validate a fix: screenshot after fix
- Document a feature: screenshot for PR description

**Requirements:** `playwright` or `puppeteer` for real screenshots.
Falls back to HTML snapshot if neither is available.

```bash
npm install -g playwright
playwright install chromium
```

## Health Check

```bash
# Check if app is running and healthy
agent-observe health
```

Checks common health endpoints:
- `http://localhost:3000/health`
- `http://localhost:3000/api/health`
- `http://localhost:8080/health`

Also shows agent-daemon and agent-watcher status.

## Execution Trace

```bash
# Full trace of a task: plan + decisions + agent sessions + logs
agent-observe trace task-20260402-001234-abc123
```

Use this to understand what happened in a previous task before starting related work.

## Workflow: Reproduce → Fix → Verify

This is the pattern from OpenAI's Harness Engineering article:

```bash
# 1. Reproduce the bug
agent-observe logs --filter "ERROR" --tail 20
agent-observe screenshot --url http://localhost:3000 --out /tmp/before.png

# 2. Implement fix
# ... make changes ...

# 3. Verify fix
agent-observe logs --filter "ERROR" --tail 20   # errors gone?
agent-observe screenshot --url http://localhost:3000 --out /tmp/after.png
agent-observe health                             # still healthy?

# 4. Record metrics
agent-observe record "bug_fix_verified" "true"

# 5. Open PR with before/after screenshots
gh pr create --title "fix: ..." --body "Before: [screenshot] After: [screenshot]"
```

## App Log Setup

To make logs available to agents, pipe your app output:

```bash
# Development
npm run dev 2>&1 | tee .agent-swarm/app.log

# Or configure your app to write to logs/app.log
```

Structured JSON logs work best:
```json
{"level":"error","msg":"auth failed","userId":"123","ts":"2026-04-02T00:30:00Z"}
```
