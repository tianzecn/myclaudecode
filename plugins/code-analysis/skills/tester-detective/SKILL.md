---
name: tester-detective
description: Testing-focused codebase investigation using INDEXED MEMORY (claudemem). GREP/FIND ARE FORBIDDEN. Analyzes test coverage, finds edge cases, discovers testing patterns, and identifies untested paths. Use when auditing test quality, planning test strategies, or finding gaps in coverage.
allowed-tools: Bash, Task, Read, AskUserQuestion
---

# ⛔⛔⛔ CRITICAL: INDEXED MEMORY ONLY ⛔⛔⛔

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   🧠 THIS SKILL USES INDEXED MEMORY (claudemem) EXCLUSIVELY                  ║
║                                                                              ║
║   ❌ GREP IS FORBIDDEN                                                       ║
║   ❌ FIND IS FORBIDDEN                                                       ║
║   ❌ GLOB IS FORBIDDEN                                                       ║
║   ❌ Grep tool IS FORBIDDEN                                                  ║
║   ❌ Glob tool IS FORBIDDEN                                                  ║
║                                                                              ║
║   ✅ claudemem search "query" IS THE ONLY WAY                               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

# Tester Detective Skill

**Version:** 1.1.0
**Role:** QA Engineer / Test Specialist
**Purpose:** Test coverage investigation using INDEXED MEMORY (claudemem)

## Role Context

You are investigating this codebase as a **QA Engineer**. Your focus is on:
- **Test coverage** - What is tested vs. untested
- **Edge cases** - Boundary conditions, error paths
- **Testing patterns** - Mocks, fixtures, assertions
- **Test quality** - Meaningful assertions, isolation
- **Testability** - Code that's hard to test (tight coupling, side effects)

## Claudemem Integration

<skill name="claudemem" version="0.1">
<purpose>
Semantic code search using vector embeddings.
Finds code by MEANING, not just text matching.
Use INSTEAD of grep/find for: architecture discovery, pattern matching, understanding codebases.
</purpose>

<capabilities>
INDEXING: Parse code → chunk by AST (functions/classes/methods) → embed → store in LanceDB
SEARCH: Natural language → vector similarity + BM25 keyword → ranked results with file:line
AUTO-INDEX: Changed files re-indexed automatically before search
</capabilities>

<tools>
CLI:
  claudemem index [path] [-f]      # Index codebase (force with -f)
  claudemem search "query" [-n N]  # Search (auto-indexes changes)
  claudemem status                 # Show index info
  claudemem clear                  # Remove index
  claudemem ai <role>              # Get role instructions

MCP (Claude Code integration):
  search_code        query, limit?, language?, autoIndex?
  index_codebase     path?, force?, model?
  get_status         path?
  clear_index        path?
  list_embedding_models  freeOnly?
</tools>
</skill>

## Tester-Focused Search Patterns

### Finding Existing Tests
```bash
# Find test files for a feature
claudemem search "test spec describe it user authentication"

# Find integration tests
claudemem search "integration test API endpoint database"

# Find unit tests
claudemem search "unit test mock stub isolated function"

# Find E2E tests
claudemem search "end to end test browser playwright cypress"
```

### Test Infrastructure
```bash
# Find test setup/teardown
claudemem search "beforeEach afterEach setup teardown test"

# Find test fixtures
claudemem search "fixture test data factory mock"

# Find mocking patterns
claudemem search "mock jest vi spyOn stub fake"

# Find test utilities
claudemem search "test helper utility render query"
```

### Coverage Analysis
```bash
# Find tested functions (have corresponding tests)
claudemem search "describe test should [function name]"

# Find assertion patterns
claudemem search "expect assert toEqual toBe throw"

# Find coverage configuration
claudemem search "coverage threshold jest vitest"
```

### Edge Case Discovery
```bash
# Find error handling tests
claudemem search "test throw error exception invalid"

# Find boundary condition tests
claudemem search "test edge case boundary null undefined empty"

# Find timeout/async tests
claudemem search "test async timeout promise reject"

# Find race condition tests
claudemem search "test concurrent race condition parallel"
```

### Testability Issues
```bash
# Find hard-to-mock dependencies
claudemem search "new Date Math.random process.env global"

# Find side effects
claudemem search "database write file system external API"

# Find tight coupling
claudemem search "new SomeClass direct instantiation"
```

## Workflow: Test Coverage Analysis

### Phase 1: Map Test Infrastructure
```bash
# 1. Ensure index exists
claudemem status || claudemem index -y

# 2. Find test configuration
claudemem search "jest vitest mocha test config setup" -n 5

# 3. Find test utilities
claudemem search "test helper utility factory builder" -n 10

# 4. Find mocking setup
claudemem search "mock module setup vi.mock jest.mock" -n 10
```

### Phase 2: Analyze Feature Coverage
```bash
# For a specific feature, find:

# Implementation
claudemem search "[feature] service implementation" -n 5

# Corresponding tests
claudemem search "describe test [feature]" -n 10

# Edge case tests
claudemem search "test [feature] error invalid edge" -n 5
```

### Phase 3: Find Coverage Gaps
```bash
# Find complex functions
claudemem search "complex logic conditional if else switch" -n 10

# Cross-reference with tests
# (manually check if tests exist for found functions)

# Find error paths
claudemem search "throw error reject catch" -n 10

# Check for error path tests
claudemem search "test error throw expect reject" -n 10
```

### Phase 4: Identify Testability Issues
```bash
# Find code that's hard to test
claudemem search "global state singleton shared mutable" -n 5
claudemem search "new dependency tight coupling" -n 5
claudemem search "setTimeout setInterval timer" -n 5
```

## Output Format: Test Coverage Report

### 1. Test Infrastructure Summary
```
┌─────────────────────────────────────────────────────────┐
│                   TEST INFRASTRUCTURE                    │
├─────────────────────────────────────────────────────────┤
│  Framework: Vitest 2.x                                  │
│  Test Files: 156 files (*.spec.ts, *.test.ts)          │
│  Test Utils: src/__tests__/utils/                       │
│  Fixtures: src/__tests__/fixtures/                      │
│  Mocking: vi.mock, MSW for API                          │
└─────────────────────────────────────────────────────────┘
```

### 2. Coverage by Feature
```
| Feature           | Unit | Integration | E2E | Overall |
|-------------------|------|-------------|-----|---------|
| Authentication    | ✅ 85%| ✅ 90%      | ✅  | 🟢 High |
| User Management   | ✅ 70%| ⚠️ 40%      | ❌  | 🟡 Medium|
| Payment Processing| ✅ 95%| ✅ 80%      | ✅  | 🟢 High |
| File Upload       | ⚠️ 30%| ❌ 0%       | ❌  | 🔴 Low  |
| Notifications     | ✅ 60%| ⚠️ 20%      | ❌  | 🟡 Medium|
```

### 3. Untested Code Paths
```
🔴 HIGH PRIORITY - No Tests Found:
   └── src/services/payment/refund.ts:45 refundPayment()
   └── src/services/notification/sms.ts:23 sendSMS()
   └── src/utils/encryption.ts:12 encryptPII()

⚠️ MEDIUM PRIORITY - Partial Coverage:
   └── src/services/user/profile.ts - Missing error cases
   └── src/controllers/admin.ts - Missing auth checks

📝 LOW PRIORITY - Edge Cases Missing:
   └── Empty array handling in listUsers()
   └── Concurrent request handling in checkout()
```

### 4. Edge Cases Missing
```
| Function            | Missing Edge Cases                    |
|---------------------|---------------------------------------|
| createUser()        | - Duplicate email                     |
|                     | - Invalid email format                |
|                     | - Password too weak                   |
| processPayment()    | - Insufficient funds                  |
|                     | - Expired card                        |
|                     | - Network timeout                     |
| uploadFile()        | - File too large                      |
|                     | - Invalid file type                   |
|                     | - Storage quota exceeded              |
```

### 5. Testability Issues
```
🔧 Code That's Hard to Test:

1. Direct Date instantiation (src/utils/scheduler.ts:15)
   └── Recommendation: Inject clock/timer interface

2. Global state mutation (src/config/runtime.ts:8)
   └── Recommendation: Use configuration injection

3. Tight coupling (src/services/email/sender.ts:34)
   └── Recommendation: Inject email provider interface

4. External API in constructor (src/clients/stripe.ts:12)
   └── Recommendation: Lazy initialization or factory
```

### 6. Test Quality Issues
```
⚠️ Test Smells Found:

1. No assertions (src/__tests__/user.test.ts:45)
   └── Test calls function but doesn't verify result

2. Snapshot overuse (src/__tests__/ui/*.test.tsx)
   └── 47 snapshot tests, consider more specific assertions

3. Mocking too much (src/__tests__/payment.test.ts)
   └── Test mocks internal implementation details

4. Flaky test (src/__tests__/async.test.ts:23)
   └── Uses setTimeout instead of proper async handling
```

## Integration with Detective Agent

When using the codebase-detective agent with this skill:

```typescript
Task({
  subagent_type: "code-analysis:detective",
  description: "Test coverage investigation",
  prompt: `
## Tester Investigation

Use claudemem with testing-focused queries to:
1. Map the test infrastructure (framework, utilities, mocks)
2. Analyze coverage for [feature/module]
3. Find untested code paths
4. Identify missing edge case tests
5. Spot testability issues

Focus on TEST COVERAGE and QUALITY, not implementation.

Generate a Test Coverage Report with:
- Test infrastructure summary
- Coverage by feature matrix
- Untested code paths (prioritized)
- Missing edge cases
- Testability improvement recommendations
  `
})
```

## Best Practices for Test Investigation

1. **Pair tests with code**
   - For each function, look for corresponding test
   - Check describe/it blocks match function names

2. **Prioritize by risk**
   - Focus on business-critical paths first
   - Error handling in payments, auth > minor features

3. **Look for test smells**
   - Empty tests (no assertions)
   - Tests that never fail
   - Over-mocked tests
   - Flaky tests with timing issues

4. **Check edge cases systematically**
   - Null/undefined inputs
   - Empty collections
   - Boundary values
   - Error conditions
   - Concurrent operations

5. **Evaluate testability**
   - Can you mock dependencies?
   - Is state isolated?
   - Are side effects contained?

## Practical Search Examples

### Example: "Is the payment flow well-tested?"
```bash
# 1. Find payment implementation
claudemem search "payment process charge service" -n 5

# 2. Find payment tests
claudemem search "describe test payment process charge" -n 10

# 3. Find error case tests
claudemem search "test payment error fail decline" -n 5

# 4. Find integration tests
claudemem search "test payment integration stripe API" -n 5
```

### Example: "What's untested in auth?"
```bash
# 1. Find all auth code
claudemem search "authentication login session token" -n 15

# 2. Find auth tests
claudemem search "describe test auth login session" -n 15

# 3. Compare and find gaps
# (manually cross-reference the two lists)

# 4. Find error paths
claudemem search "auth error invalid expired unauthorized" -n 10
```

### Example: "Are there flaky tests?"
```bash
# Find potential flaky test patterns
claudemem search "setTimeout waitFor sleep delay test" -n 10
claudemem search "Math.random Date.now test" -n 5
claudemem search "retry flaky intermittent test" -n 5
```

## Notes

- Requires claudemem CLI installed and configured
- Works best on indexed codebases (run `claudemem index` first)
- Focuses on test quality over implementation
- Pairs well with developer-detective for understanding what to test

---

**Maintained by:** MadAppGang
**Plugin:** code-analysis
**Last Updated:** December 2025
