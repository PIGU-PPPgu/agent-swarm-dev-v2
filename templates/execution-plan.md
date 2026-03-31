# [Feature Name]

**Status:** Not Started | In Progress | Blocked | Completed  
**Owner:** [agent-name]  
**Started:** YYYY-MM-DD  
**Target:** YYYY-MM-DD  

## Goal

[1-2 sentence description of what this feature does and why it's needed]

## Success Criteria

- [ ] Criterion 1 (e.g., Users can log in with email/password)
- [ ] Criterion 2 (e.g., Session persists for 7 days)
- [ ] Criterion 3 (e.g., 95% test coverage)

## Context

**Related Issues:** #123, #456  
**Design Doc:** docs/designs/feature-x.md  
**Architecture Impact:** None / See docs/architecture.md section X  

## Implementation Steps

### Phase 1: Foundation
- [ ] Step 1: Create database schema (PR #XXX)
- [ ] Step 2: Implement repository layer (PR #XXX)
- [ ] Step 3: Add unit tests (PR #XXX)

### Phase 2: Business Logic
- [ ] Step 4: Implement service layer (PR #XXX)
- [ ] Step 5: Add validation (PR #XXX)
- [ ] Step 6: Add integration tests (PR #XXX)

### Phase 3: API & UI
- [ ] Step 7: Create API endpoints (PR #XXX)
- [ ] Step 8: Build UI components (PR #XXX)
- [ ] Step 9: Add E2E tests (PR #XXX)

### Phase 4: Polish
- [ ] Step 10: Documentation (PR #XXX)
- [ ] Step 11: Performance optimization (PR #XXX)
- [ ] Step 12: Security review (PR #XXX)

## Decisions

**YYYY-MM-DD:** [Decision made and rationale]
- Example: Chose JWT over sessions for auth tokens
- Rationale: Better for distributed systems, easier to scale
- See: docs/decisions/001-auth-tokens.md

**YYYY-MM-DD:** [Another decision]
- ...

## Blockers

**Current Blockers:**
- None

**Resolved Blockers:**
- YYYY-MM-DD: [Blocker description] - Resolved by [solution]

## Dependencies

**Depends On:**
- [ ] Feature Y (plans/active/feature-y.md)
- [ ] Infrastructure change Z (plans/active/infra-z.md)

**Blocks:**
- Feature A (plans/active/feature-a.md)

## Testing Strategy

### Unit Tests
- Test all service layer functions
- Mock external dependencies
- Target: 90% coverage

### Integration Tests
- Test API endpoints end-to-end
- Use test database
- Cover happy path + error cases

### E2E Tests
- Test critical user flows
- Use Playwright
- Run in CI before merge

## Rollout Plan

1. **Alpha:** Internal team only (Week 1)
2. **Beta:** 10% of users (Week 2)
3. **GA:** 100% rollout (Week 3)

**Feature Flag:** `feature_x_enabled`

## Metrics

**Success Metrics:**
- Adoption rate: Target 50% of users in first month
- Error rate: < 0.1%
- Performance: P95 latency < 200ms

**Monitoring:**
- Dashboard: [Link to Grafana/Datadog]
- Alerts: [Link to alert config]

## Related

- **Design Doc:** docs/designs/feature-x.md
- **Architecture:** docs/architecture.md#feature-x
- **API Spec:** docs/api/feature-x.md
- **Issues:** #123, #456
- **PRs:** #789, #790

## Notes

[Any additional context, gotchas, or things to remember]

---

**Last Updated:** YYYY-MM-DD by [agent-name]
