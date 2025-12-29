# Model Scraper Agent - Critical Behavior Fix Design

**Version:** 1.1.0
**Date:** 2025-11-14
**Issue:** Agent using API calls (curl/jq) instead of Chrome DevTools MCP browser navigation
**Priority:** CRITICAL - Blocks agent functionality

---

## Executive Summary

The model-scraper agent is attempting to use curl and jq commands to access the OpenRouter API instead of using Chrome DevTools MCP to navigate and scrape the rankings page. This violates the agent's core design and results in incorrect data extraction.

**Root Cause:** Insufficient constraint enforcement and missing critical URL parameter
**Solution:** Strengthen constraints, add explicit tool usage rules, fix URL, add validation gate
**Impact:** Ensures agent uses correct MCP-based approach for reliable scraping

---

## Problem Analysis

### Observed Behavior

User reports these errors from the agent:

```bash
Waiting… run scripts/get-trending-models.ts 2>&1)
Error: Exit code 1

Waiting…l -s https://openrouter.ai/api/v1/models | bun run -e "const data = await Bun.stdin.json()...
Usage: bun run [flags] <file or script>

Waiting…l -s https://openrouter.ai/api/v1/models | jq -r '.data | map(select(.id | contains("gpt-5")...
openai/gpt-5.1|OpenAI: GPT-5.1|400000|0.00000125|0.00001
```

**What's happening:**
1. Agent is running bash scripts (scripts/get-trending-models.ts)
2. Agent is using `curl` to access OpenRouter API endpoint
3. Agent is using `jq` to parse JSON responses
4. Agent is completely ignoring Chrome DevTools MCP tools

### Expected Behavior

The agent should:
1. Use `mcp__chrome-devtools__navigate` to open rankings page
2. Use `mcp__chrome-devtools__evaluate` to execute JavaScript
3. Wait for React hydration before extracting data
4. Extract data from rendered HTML, NOT from API
5. NEVER use curl, wget, fetch, or any HTTP requests

---

## Root Cause Analysis

### 1. **Instructions Buried in Workflow**

**Current location:** Lines 148-175 (PHASE 2 `<critical_requirement>`)

**Problem:** Critical constraint is buried INSIDE the workflow section, not at the top of instructions. By the time the agent reads this far, it may have already decided on its approach.

**Evidence:**
- Line 148-152: `<critical_requirement>` exists but is nested deep in PHASE 2
- Agent likely plans its approach before reading detailed workflow
- Instructions at top (lines 30-68) don't explicitly forbid API usage

### 2. **Missing URL Parameter**

**Current URL (Line 154):**
```
https://openrouter.ai/rankings?view=month#categories
```

**Missing parameter:** `category=programming`

**Problem:** Without this parameter, the page shows ALL model categories (text, image, coding, chat), making extraction unreliable. The agent may not find the correct programming models.

**Correct URL:**
```
https://openrouter.ai/rankings?category=programming&view=month#categories
```

### 3. **Weak Tool Constraints**

**Current constraint (Line 149-151):**
```xml
<critical_requirement>
  MUST use mcp__chrome-devtools__* tools for ALL web interactions.
  NEVER use curl, fetch, or any API calls.
  ONLY scrape data from the rendered web page using browser MCP.
</critical_requirement>
```

**Problems:**
- Not explicit enough about Bash tool usage
- Doesn't list specific forbidden patterns (curl, wget, etc.)
- No examples showing wrong vs right approach
- Not positioned prominently enough (buried in PHASE 2)

### 4. **No Validation Gate**

**Current PHASE 1 (Lines 139-145):**
- Step 2 says "Verify Chrome DevTools MCP is available (test navigate)"
- But no explicit CHECK or STOP instruction
- No example of what this verification looks like
- Agent may skip this step

**Problem:** Agent doesn't validate MCP availability before attempting scraping, leading to fallback to API calls.

### 5. **Insufficient Examples**

**Current examples (Lines 523-649):**
- Show successful scraping with MCP tools (good)
- Show partial failures and critical failures (good)
- **DON'T show what NOT to do** (wrong approaches)
- **DON'T show API usage as anti-pattern**

**Missing:** Explicit "wrong vs right" examples that show API calls being rejected.

---

## Proposed Changes

### Change 1: Move Critical Constraints to Top

**Location:** After `<critical_constraints>` opening tag (line 30)

**New section:** `<approach_requirement>` (BEFORE todowrite_requirement)

```xml
<critical_constraints>
  <approach_requirement priority="ABSOLUTE">
    **THIS AGENT MUST USE CHROME DEVTOOLS MCP - NO EXCEPTIONS**

    ✅ **ONLY ALLOWED APPROACH:**
    - mcp__chrome-devtools__navigate - Navigate to web pages
    - mcp__chrome-devtools__evaluate - Execute JavaScript in browser
    - mcp__chrome-devtools__screenshot - Take debugging screenshots
    - mcp__chrome-devtools__console - Read console logs

    ❌ **ABSOLUTELY FORBIDDEN:**
    - curl, wget, or any HTTP client commands
    - fetch() or any JavaScript HTTP requests
    - API endpoints (https://openrouter.ai/api/*)
    - Bash scripts that make network requests
    - Any approach that doesn't use the browser

    **WHY:** OpenRouter rankings page is a React SPA. The data is rendered
    client-side via JavaScript. API endpoints don't expose the rankings data.
    ONLY browser-based scraping works.

    **IF MCP IS UNAVAILABLE:** STOP immediately and report configuration error.
    DO NOT attempt fallback approaches.
  </approach_requirement>

  <todowrite_requirement>
    You MUST use TodoWrite to track scraping progress through all phases.
    ...
  </todowrite_requirement>
  ...
</critical_constraints>
```

**Rationale:**
- Appears FIRST in critical constraints (impossible to miss)
- Uses visual indicators (✅ ❌) for clarity
- Explains WHY (React SPA requires browser)
- Explicitly forbids fallback approaches

### Change 2: Fix URL Parameter

**Location:** Line 154 (PHASE 2, step 1)

**Current:**
```xml
<step number="1">Use mcp__chrome-devtools__navigate to: https://openrouter.ai/rankings?view=month#categories</step>
```

**New:**
```xml
<step number="1">Use mcp__chrome-devtools__navigate to: https://openrouter.ai/rankings?category=programming&view=month#categories

  **CRITICAL:** URL MUST include `category=programming` parameter to filter to programming models only.
  Without this parameter, page shows all categories and extraction will fail.
</step>
```

**Rationale:**
- Adds missing `category=programming` parameter
- Includes inline explanation of why it's critical
- Prevents extraction errors from wrong category data

### Change 3: Add Explicit Bash Tool Rules

**Location:** New section in `<core_principles>` (after line 136)

**New principle:**

```xml
<principle name="Bash Tool Usage Restrictions" priority="critical">
  The Bash tool is ONLY allowed for these specific operations:

  ✅ **ALLOWED Bash commands:**
  - `mkdir -p /tmp/scraper-debug` - Create debug directories
  - `ls /tmp/scraper-debug` - Check debug output
  - `test -f /path/to/file` - Check if files exist
  - `date +%Y-%m-%d` - Get current date for versioning

  ❌ **FORBIDDEN Bash commands:**
  - `curl` - Use mcp__chrome-devtools__navigate instead
  - `wget` - Use mcp__chrome-devtools__navigate instead
  - `fetch` - Use mcp__chrome-devtools__navigate instead
  - Any command accessing `https://openrouter.ai/api/*`
  - Any command accessing `https://openrouter.ai/models/*` directly
  - Any HTTP client (httpie, aria2c, etc.)
  - Running scripts that make network requests (scripts/get-trending-models.ts)

  **IF YOU ATTEMPT A FORBIDDEN COMMAND:**
  STOP immediately. Re-read the <approach_requirement> section.
  You are violating the agent's core design.

  **EXAMPLE OF WRONG APPROACH:**
  ```bash
  # ❌ WRONG - Never do this
  curl -s https://openrouter.ai/api/v1/models | jq '.data'
  ```

  **EXAMPLE OF CORRECT APPROACH:**
  ```javascript
  // ✅ CORRECT - Always use MCP tools
  mcp__chrome-devtools__navigate({
    url: "https://openrouter.ai/rankings?category=programming&view=month#categories"
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  mcp__chrome-devtools__evaluate({
    expression: `
      (function() {
        const modelLinks = document.querySelectorAll('a[href*="/models/"]');
        return Array.from(modelLinks).map(link => ({
          slug: link.href.split('/models/')[1],
          name: link.textContent.trim()
        }));
      })()
    `
  });
  ```
</principle>
```

**Rationale:**
- Explicit whitelist of allowed Bash commands
- Explicit blacklist of forbidden Bash commands
- Shows concrete wrong vs right examples
- Uses visual indicators for clarity

### Change 4: Strengthen PHASE 1 Validation

**Location:** Lines 139-145 (PHASE 1)

**Current:**
```xml
<phase number="1" name="Initialization">
  <step number="1">Initialize TodoWrite with scraping phases</step>
  <step number="2">Verify Chrome DevTools MCP is available (test navigate)</step>
  <step number="3">Read existing recommended-models.md for structure reference</step>
  <step number="4">Create debug output directory (/tmp/scraper-debug/)</step>
  <step number="5">Mark PHASE 1 as completed, PHASE 2 as in_progress</step>
</phase>
```

**New:**
```xml
<phase number="1" name="Initialization and MCP Validation">
  <step number="1">Initialize TodoWrite with scraping phases</step>

  <step number="2">
    **CRITICAL VALIDATION:** Test Chrome DevTools MCP availability

    **Action:** Attempt to navigate to a test URL using MCP tools

    ```javascript
    // Test MCP availability by navigating to OpenRouter homepage
    try {
      mcp__chrome-devtools__navigate({
        url: "https://openrouter.ai/"
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify navigation worked by checking page title
      const titleCheck = mcp__chrome-devtools__evaluate({
        expression: "document.title"
      });

      if (!titleCheck || titleCheck.includes("error")) {
        throw new Error("MCP navigation failed");
      }

      console.log("✅ Chrome DevTools MCP verified and working");
    } catch (error) {
      console.error("❌ Chrome DevTools MCP not available");
      console.error("   Error:", error.message);
      console.error("\n   CONFIGURATION REQUIRED:");
      console.error("   Add to .claude/settings.json:");
      console.error('   {');
      console.error('     "mcpServers": {');
      console.error('       "chrome-devtools": {');
      console.error('         "command": "npx",');
      console.error('         "args": ["chrome-devtools-mcp"]');
      console.error('       }');
      console.error('     }');
      console.error('   }');

      // STOP execution - do NOT proceed without MCP
      throw new Error("CRITICAL: Chrome DevTools MCP required but not available");
    }
    ```

    **IF MCP TEST FAILS:** STOP immediately. Report configuration error to user.
    DO NOT attempt any fallback approaches (curl, scripts, etc.).
  </step>

  <step number="3">Read existing recommended-models.md for structure reference</step>
  <step number="4">Create debug output directory using Bash: `mkdir -p /tmp/scraper-debug`</step>
  <step number="5">Mark PHASE 1 as completed, PHASE 2 as in_progress</step>
</phase>
```

**Rationale:**
- Explicit test of MCP navigation BEFORE any scraping
- Shows concrete code for validation
- Includes error handling with clear instructions
- Forces agent to STOP if MCP unavailable
- Prevents fallback to API calls

### Change 5: Remove Critical Requirements from PHASE 2

**Location:** Lines 148-175 (PHASE 2)

**Current:**
```xml
<phase number="2" name="Navigate and Extract Rankings">
  <critical_requirement>
    MUST use mcp__chrome-devtools__* tools for ALL web interactions.
    NEVER use curl, fetch, or any API calls.
    ONLY scrape data from the rendered web page using browser MCP.
  </critical_requirement>

  <step number="1">Use mcp__chrome-devtools__navigate to: https://openrouter.ai/rankings?view=month#categories</step>
  ...
</phase>
```

**New:**
```xml
<phase number="2" name="Navigate and Extract Rankings">
  <step number="1">Use mcp__chrome-devtools__navigate to: https://openrouter.ai/rankings?category=programming&view=month#categories

  **CRITICAL:** URL MUST include `category=programming` parameter to filter to programming models only.
  Without this parameter, page shows all categories and extraction will fail.
  </step>
  ...
</phase>
```

**Rationale:**
- Remove redundant `<critical_requirement>` (already at top of instructions)
- Focus on execution details only
- Reduce noise in workflow section

### Change 6: Update PHASE 3 URL Note

**Location:** Lines 170-175 (PHASE 3)

**Current:**
```xml
<phase number="3" name="Extract Model Details">
  <critical_requirement>
    MUST use mcp__chrome-devtools__* tools for ALL model detail extraction.
    NEVER use curl or API endpoints to fetch model data.
    ONLY extract data from the rendered HTML page using browser MCP.
  </critical_requirement>
  ...
</phase>
```

**New:**
```xml
<phase number="3" name="Extract Model Details">
  <step number="1">For each model in top 9 (or max available):
    <substep>1a. Construct detail page URL: https://openrouter.ai/models/{slug}

    **NOTE:** Use mcp__chrome-devtools__navigate, NOT curl or API calls.
    </substep>
    ...
  </step>
</phase>
```

**Rationale:**
- Remove redundant critical requirement
- Add inline reminder at point of use
- Keep workflow clean and focused

### Change 7: Add Anti-Pattern Examples

**Location:** New section in `<examples>` (before existing examples)

**New example:**

```xml
<examples>
  <example>
    <scenario>❌ WRONG APPROACH - Using API calls instead of MCP</scenario>
    <user_observation>
      Agent attempting to use curl and jq commands:

      ```bash
      curl -s https://openrouter.ai/api/v1/models | jq '.data'
      bun run scripts/get-trending-models.ts
      ```
    </user_observation>
    <why_wrong>
      - OpenRouter rankings data is NOT available via API
      - API endpoint shows different data than rankings page
      - Rankings page requires browser JavaScript to render
      - This violates the <approach_requirement> critical constraint
    </why_wrong>
    <correct_approach>
      1. STOP immediately when you realize you're using curl/API
      2. Re-read <approach_requirement> in critical constraints
      3. Use mcp__chrome-devtools__navigate to open rankings page
      4. Use mcp__chrome-devtools__evaluate to execute JavaScript extraction
      5. Extract data from rendered HTML, NOT from API responses

      **Code example:**
      ```javascript
      // ✅ CORRECT approach
      mcp__chrome-devtools__navigate({
        url: "https://openrouter.ai/rankings?category=programming&view=month#categories"
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      const models = mcp__chrome-devtools__evaluate({
        expression: `
          (function() {
            const modelLinks = document.querySelectorAll('a[href*="/models/"]');
            return Array.from(modelLinks).slice(0, 9).map((link, index) => ({
              rank: index + 1,
              slug: link.href.split('/models/')[1].split('?')[0],
              name: link.textContent.trim()
            }));
          })()
        `
      });
      ```
    </correct_approach>
  </example>

  <example>
    <scenario>❌ WRONG APPROACH - Running bash scripts for scraping</scenario>
    <user_observation>
      Agent attempting to run scripts/get-trending-models.ts which makes HTTP requests
    </user_observation>
    <why_wrong>
      - Bash tool should ONLY be used for: mkdir, ls, test, date
      - Scripts that make network requests violate approach requirements
      - MCP tools are the ONLY way to access web pages
    </why_wrong>
    <correct_approach>
      1. DON'T run scripts that make HTTP requests
      2. Use Bash tool ONLY for allowed operations:
         - `mkdir -p /tmp/scraper-debug` (create directories)
         - `ls /tmp/scraper-debug` (check files)
         - `date +%Y-%m-%d` (get date)
      3. Use MCP tools for ALL web interactions
    </correct_approach>
  </example>

  <!-- Existing successful examples below -->
  <example>
    <scenario>✅ CORRECT APPROACH - Successful scraping of all 9 models</scenario>
    ...
  </example>
</examples>
```

**Rationale:**
- Shows exactly what user observed (curl/jq/scripts)
- Explains WHY it's wrong
- Shows correct MCP-based approach
- Positions anti-patterns BEFORE success examples
- Uses visual indicators (❌ ✅) for clarity

### Change 8: Update Knowledge Templates

**Location:** Lines 477-520 (Templates section)

**Update template:**

```xml
<templates>
  <template name="WRONG vs RIGHT Approaches">
```bash
# ❌ WRONG - Never use these approaches
curl -s https://openrouter.ai/api/v1/models | jq '.data'
wget https://openrouter.ai/rankings
bun run scripts/get-trending-models.ts
fetch('https://openrouter.ai/api/v1/models').then(r => r.json())

# ✅ CORRECT - Always use MCP tools
# (See examples below)
```
  </template>

  <template name="MCP Navigation">
```javascript
// Navigate to rankings page
mcp__chrome-devtools__navigate({
  url: "https://openrouter.ai/rankings?category=programming&view=month#categories"
});

// Wait for hydration
await new Promise(resolve => setTimeout(resolve, 3000));

// Take screenshot
mcp__chrome-devtools__screenshot({
  path: "/tmp/scraper-debug/01-rankings-loaded.png"
});
```
  </template>

  <template name="Model Detail Navigation">
```javascript
// For each model
for (const model of extractedModels) {
  // Navigate to detail page using MCP (NOT curl)
  mcp__chrome-devtools__navigate({
    url: `https://openrouter.ai/models/${model.slug}`
  });

  // Wait for load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract details via JavaScript (NOT API calls)
  const details = mcp__chrome-devtools__evaluate({
    expression: `(${extractModelDetailsScript})()`
  });

  // Merge with model data
  model.pricing = details.inputPrice + details.outputPrice;
  model.context = details.contextWindow;
  model.description = details.description;
  model.provider = details.provider;
}
```
  </template>
</templates>
```

**Rationale:**
- Add explicit "wrong vs right" template at top
- Show forbidden patterns clearly
- Emphasize MCP usage in existing templates

---

## Implementation Plan

### Step 1: Update Critical Constraints (Top of Instructions)

**File:** `.claude/agents/model-scraper.md`
**Lines:** 30-68 (expand to add new section)

**Changes:**
1. Add `<approach_requirement>` as FIRST constraint (before todowrite_requirement)
2. Use visual indicators (✅ ❌)
3. List allowed MCP tools explicitly
4. List forbidden approaches explicitly
5. Explain WHY (React SPA, API doesn't expose rankings)

**Expected result:** Agent sees approach requirement FIRST, before reading anything else.

### Step 2: Add Bash Tool Rules

**File:** `.claude/agents/model-scraper.md`
**Lines:** After line 136 (in `<core_principles>`)

**Changes:**
1. Add new `<principle name="Bash Tool Usage Restrictions">`
2. Whitelist allowed Bash commands (mkdir, ls, test, date)
3. Blacklist forbidden Bash commands (curl, wget, fetch, scripts)
4. Show wrong vs right examples
5. Add "STOP if you attempt forbidden command" instruction

**Expected result:** Agent knows exactly what Bash commands are allowed.

### Step 3: Fix URL Parameter

**File:** `.claude/agents/model-scraper.md`
**Line:** 154 (PHASE 2, step 1)

**Changes:**
1. Change URL from `?view=month#categories` to `?category=programming&view=month#categories`
2. Add inline explanation of why parameter is critical

**Expected result:** Agent navigates to correct filtered page.

### Step 4: Strengthen PHASE 1 Validation

**File:** `.claude/agents/model-scraper.md`
**Lines:** 139-145 (PHASE 1)

**Changes:**
1. Expand step 2 with concrete MCP test code
2. Show try/catch error handling
3. Add explicit STOP instruction if MCP unavailable
4. Show configuration instructions for user

**Expected result:** Agent validates MCP works BEFORE attempting scraping.

### Step 5: Remove Redundant Requirements from PHASE 2 and PHASE 3

**File:** `.claude/agents/model-scraper.md`
**Lines:** 148-175 (PHASE 2 and PHASE 3)

**Changes:**
1. Remove `<critical_requirement>` blocks (already at top)
2. Add inline URL notes where relevant
3. Keep workflow focused on execution only

**Expected result:** Cleaner workflow, less redundancy.

### Step 6: Add Anti-Pattern Examples

**File:** `.claude/agents/model-scraper.md`
**Lines:** 523-649 (Examples section)

**Changes:**
1. Add 2 new anti-pattern examples at TOP of examples
2. Show curl/jq/scripts usage (what user observed)
3. Explain WHY it's wrong
4. Show correct MCP approach
5. Use visual indicators (❌ ✅)

**Expected result:** Agent sees what NOT to do before seeing success examples.

### Step 7: Update Knowledge Templates

**File:** `.claude/agents/model-scraper.md`
**Lines:** 477-520 (Templates section)

**Changes:**
1. Add "WRONG vs RIGHT Approaches" template at top
2. Update existing templates to emphasize MCP usage
3. Add comments like "NOT curl" and "NOT API calls"

**Expected result:** Templates reinforce correct approach.

---

## Validation Strategy

### How to Test if Changes Work

**Test 1: Read agent and verify structure**
```bash
# Read the updated agent file
cat .claude/agents/model-scraper.md

# Verify:
# 1. <approach_requirement> appears at line ~32 (FIRST constraint)
# 2. <principle name="Bash Tool Usage Restrictions"> appears after line 136
# 3. URL in PHASE 2 includes "category=programming"
# 4. PHASE 1 step 2 has MCP validation code
# 5. Anti-pattern examples appear at top of <examples>
```

**Test 2: Simulate agent execution (dry run)**
```
Use the agent-architect agent to review the updated model-scraper agent.
Ask it to trace the execution flow and verify:
1. Does it see approach_requirement BEFORE planning approach?
2. Does PHASE 1 validation force MCP test?
3. Are Bash tool rules clear enough?
4. Are anti-pattern examples prominent?
```

**Test 3: Run agent with monitoring**
```bash
# Launch agent and watch for forbidden commands
# Expected: NO curl, wget, fetch, or script execution
# Expected: YES mcp__chrome-devtools__navigate calls

# Monitor agent output for these patterns:
# ✅ GOOD: "mcp__chrome-devtools__navigate"
# ✅ GOOD: "mcp__chrome-devtools__evaluate"
# ❌ BAD: "curl -s https://openrouter.ai"
# ❌ BAD: "bun run scripts/get-trending-models.ts"
```

**Test 4: Verify output**
```bash
# After agent runs, verify:
# 1. File exists: shared/recommended-models.md
# 2. Contains 7-9 models
# 3. All models have pricing, context, description
# 4. URL in agent includes "category=programming"

cat shared/recommended-models.md | head -50
```

---

## Before/After Comparison

### Before (Current Agent)

**Critical Constraints Location:**
- Line 30-68: General constraints (todowrite, mcp_availability, data_quality)
- Line 148-175: PHASE 2 has critical_requirement (buried in workflow)

**Bash Tool Rules:**
- None. No guidance on what Bash commands allowed/forbidden.

**URL:**
- Missing `category=programming` parameter
- Will show all model categories, not just programming

**PHASE 1 Validation:**
- Step 2: "Verify Chrome DevTools MCP is available (test navigate)"
- No concrete code showing HOW to verify
- No STOP instruction if verification fails

**Examples:**
- Shows 3 success/partial/failure scenarios
- Doesn't show anti-patterns (what NOT to do)
- No curl/API examples marked as wrong

**Result:** Agent plans approach before seeing critical requirements, has no explicit Bash rules, may skip MCP validation, doesn't see anti-patterns.

### After (Proposed Changes)

**Critical Constraints Location:**
- Line 30-68: `<approach_requirement>` appears FIRST (before todowrite)
- Uses visual indicators (✅ ❌)
- Lists allowed MCP tools explicitly
- Lists forbidden approaches explicitly
- Explains WHY (React SPA requires browser)

**Bash Tool Rules:**
- New principle: "Bash Tool Usage Restrictions" in core principles
- Whitelist: mkdir, ls, test, date
- Blacklist: curl, wget, fetch, scripts
- Shows wrong vs right examples

**URL:**
- Includes `category=programming&view=month#categories`
- Inline explanation of why parameter critical

**PHASE 1 Validation:**
- Concrete JavaScript code testing MCP navigation
- try/catch error handling
- Explicit STOP instruction if MCP unavailable
- Configuration instructions for user

**Examples:**
- 2 anti-pattern examples at TOP showing curl/scripts
- Explains WHY wrong
- Shows correct MCP approach
- Existing success examples below

**Result:** Agent sees approach requirement FIRST, has explicit Bash rules, must validate MCP in PHASE 1, sees anti-patterns before planning.

---

## Success Criteria

**Changes are successful if:**

1. ✅ Agent reads `<approach_requirement>` BEFORE planning its approach
2. ✅ Agent validates MCP availability in PHASE 1 (test navigation)
3. ✅ Agent STOPS if MCP unavailable (no fallback to curl/API)
4. ✅ Agent uses correct URL with `category=programming` parameter
5. ✅ Agent ONLY uses allowed Bash commands (mkdir, ls, test, date)
6. ✅ Agent NEVER uses forbidden Bash commands (curl, wget, fetch, scripts)
7. ✅ Agent sees anti-pattern examples showing curl/API as wrong
8. ✅ Agent successfully extracts 7-9 models using MCP tools only

**Verification:**
- Monitor agent execution for forbidden commands (should be ZERO)
- Check generated file has correct models
- Verify debug screenshots exist (proves MCP navigation worked)

---

## Risk Assessment

### Risk 1: Agent still uses API calls despite changes

**Likelihood:** Low
**Mitigation:**
- Approach requirement is FIRST constraint (impossible to miss)
- Bash rules explicitly forbid curl/wget/fetch
- PHASE 1 validation forces MCP test before scraping
- Anti-pattern examples show curl/API as wrong
- Multiple reinforcement points throughout agent

### Risk 2: URL parameter change breaks scraping

**Likelihood:** Very Low
**Mitigation:**
- Parameter `category=programming` is valid OpenRouter URL parameter
- Makes scraping MORE reliable (filters to programming models only)
- Inline explanation helps agent understand why it's needed

### Risk 3: MCP validation gate blocks execution unnecessarily

**Likelihood:** Low
**Mitigation:**
- Validation only tests navigation (lightweight operation)
- Clear error message guides user to configure MCP
- Prevents worse scenario (agent using API calls)

### Risk 4: Changes make agent too verbose/slow

**Likelihood:** Very Low
**Mitigation:**
- Validation adds ~2-5 seconds (one navigation test)
- Anti-pattern examples don't add execution time
- Agent still follows same 5-phase workflow

---

## Appendix A: Line-by-Line Changes

### Change 1: Add approach_requirement (after line 30)

```diff
 <instructions>
   <critical_constraints>
+    <approach_requirement priority="ABSOLUTE">
+      **THIS AGENT MUST USE CHROME DEVTOOLS MCP - NO EXCEPTIONS**
+
+      ✅ **ONLY ALLOWED APPROACH:**
+      - mcp__chrome-devtools__navigate - Navigate to web pages
+      - mcp__chrome-devtools__evaluate - Execute JavaScript in browser
+      - mcp__chrome-devtools__screenshot - Take debugging screenshots
+      - mcp__chrome-devtools__console - Read console logs
+
+      ❌ **ABSOLUTELY FORBIDDEN:**
+      - curl, wget, or any HTTP client commands
+      - fetch() or any JavaScript HTTP requests
+      - API endpoints (https://openrouter.ai/api/*)
+      - Bash scripts that make network requests
+      - Any approach that doesn't use the browser
+
+      **WHY:** OpenRouter rankings page is a React SPA. The data is rendered
+      client-side via JavaScript. API endpoints don't expose the rankings data.
+      ONLY browser-based scraping works.
+
+      **IF MCP IS UNAVAILABLE:** STOP immediately and report configuration error.
+      DO NOT attempt fallback approaches.
+    </approach_requirement>
+
     <todowrite_requirement>
```

### Change 2: Add Bash Tool Usage Restrictions (after line 136)

```diff
     </principle>

+    <principle name="Bash Tool Usage Restrictions" priority="critical">
+      The Bash tool is ONLY allowed for these specific operations:
+
+      ✅ **ALLOWED Bash commands:**
+      - `mkdir -p /tmp/scraper-debug` - Create debug directories
+      - `ls /tmp/scraper-debug` - Check debug output
+      - `test -f /path/to/file` - Check if files exist
+      - `date +%Y-%m-%d` - Get current date for versioning
+
+      ❌ **FORBIDDEN Bash commands:**
+      - `curl` - Use mcp__chrome-devtools__navigate instead
+      - `wget` - Use mcp__chrome-devtools__navigate instead
+      - `fetch` - Use mcp__chrome-devtools__navigate instead
+      - Any command accessing `https://openrouter.ai/api/*`
+      - Any command accessing `https://openrouter.ai/models/*` directly
+      - Any HTTP client (httpie, aria2c, etc.)
+      - Running scripts that make network requests (scripts/get-trending-models.ts)
+
+      **IF YOU ATTEMPT A FORBIDDEN COMMAND:**
+      STOP immediately. Re-read the <approach_requirement> section.
+      You are violating the agent's core design.
+    </principle>
+
     <principle name="Screenshot Debugging" priority="medium">
```

### Change 3: Fix URL parameter (line 154)

```diff
-      <step number="1">Use mcp__chrome-devtools__navigate to: https://openrouter.ai/rankings?view=month#categories</step>
+      <step number="1">Use mcp__chrome-devtools__navigate to: https://openrouter.ai/rankings?category=programming&view=month#categories
+
+      **CRITICAL:** URL MUST include `category=programming` parameter to filter to programming models only.
+      Without this parameter, page shows all categories and extraction will fail.
+      </step>
```

### Change 4: Strengthen PHASE 1 validation (lines 139-145)

```diff
-    <phase number="1" name="Initialization">
+    <phase number="1" name="Initialization and MCP Validation">
       <step number="1">Initialize TodoWrite with scraping phases</step>
-      <step number="2">Verify Chrome DevTools MCP is available (test navigate)</step>
+
+      <step number="2">
+        **CRITICAL VALIDATION:** Test Chrome DevTools MCP availability
+
+        Use mcp__chrome-devtools__navigate to test navigation to OpenRouter homepage.
+        Verify page title loads correctly.
+
+        **IF MCP TEST FAILS:** STOP immediately. Report configuration error to user.
+        DO NOT attempt any fallback approaches (curl, scripts, etc.).
+      </step>
+
       <step number="3">Read existing recommended-models.md for structure reference</step>
-      <step number="4">Create debug output directory (/tmp/scraper-debug/)</step>
+      <step number="4">Create debug output directory using Bash: `mkdir -p /tmp/scraper-debug`</step>
       <step number="5">Mark PHASE 1 as completed, PHASE 2 as in_progress</step>
     </phase>
```

### Change 5: Remove redundant requirements from PHASE 2 (lines 148-152)

```diff
     <phase number="2" name="Navigate and Extract Rankings">
-      <critical_requirement>
-        MUST use mcp__chrome-devtools__* tools for ALL web interactions.
-        NEVER use curl, fetch, or any API calls.
-        ONLY scrape data from the rendered web page using browser MCP.
-      </critical_requirement>
-
-      <step number="1">Use mcp__chrome-devtools__navigate to: https://openrouter.ai/rankings?view=month#categories</step>
+      <step number="1">Use mcp__chrome-devtools__navigate to: https://openrouter.ai/rankings?category=programming&view=month#categories</step>
```

### Change 6: Remove redundant requirements from PHASE 3 (lines 170-175)

```diff
     <phase number="3" name="Extract Model Details">
-      <critical_requirement>
-        MUST use mcp__chrome-devtools__* tools for ALL model detail extraction.
-        NEVER use curl or API endpoints to fetch model data.
-        ONLY extract data from the rendered HTML page using browser MCP.
-      </critical_requirement>
-
       <step number="1">For each model in top 9 (or max available):
         <substep>1a. Construct detail page URL: https://openrouter.ai/models/{slug}</substep>
```

### Change 7: Add anti-pattern examples (before line 523)

```diff
 <examples>
+  <example>
+    <scenario>❌ WRONG APPROACH - Using API calls instead of MCP</scenario>
+    <user_observation>
+      Agent attempting to use curl and jq commands:
+
+      ```bash
+      curl -s https://openrouter.ai/api/v1/models | jq '.data'
+      bun run scripts/get-trending-models.ts
+      ```
+    </user_observation>
+    <why_wrong>
+      - OpenRouter rankings data is NOT available via API
+      - API endpoint shows different data than rankings page
+      - Rankings page requires browser JavaScript to render
+      - This violates the <approach_requirement> critical constraint
+    </why_wrong>
+    <correct_approach>
+      Use mcp__chrome-devtools__navigate to open rankings page.
+      Use mcp__chrome-devtools__evaluate to execute JavaScript extraction.
+      Extract data from rendered HTML, NOT from API responses.
+    </correct_approach>
+  </example>
+
   <example>
```

---

## Appendix B: Quick Reference Checklist

**For implementer applying these changes:**

- [ ] Add `<approach_requirement>` as FIRST constraint (after line 30)
- [ ] Add `<principle name="Bash Tool Usage Restrictions">` (after line 136)
- [ ] Fix URL to include `category=programming` parameter (line 154)
- [ ] Strengthen PHASE 1 validation with MCP test (lines 139-145)
- [ ] Remove redundant `<critical_requirement>` from PHASE 2 (lines 148-152)
- [ ] Remove redundant `<critical_requirement>` from PHASE 3 (lines 170-175)
- [ ] Add 2 anti-pattern examples at top of `<examples>` (before line 523)
- [ ] Update knowledge templates to show wrong vs right (lines 477-520)

**After implementation:**

- [ ] Read updated agent file to verify structure
- [ ] Test agent with monitoring for forbidden commands
- [ ] Verify agent uses MCP tools only (no curl/wget/fetch)
- [ ] Verify agent navigates to correct URL with category parameter
- [ ] Verify agent validates MCP in PHASE 1
- [ ] Verify output file contains correct programming models

---

**Design Document Version:** 1.1.0
**Created:** 2025-11-14
**Author:** Claude (Sonnet 4.5)
**Status:** Ready for Implementation
**Estimated Implementation Time:** 20-30 minutes
**Risk Level:** Low (strengthening existing constraints, not changing core logic)
