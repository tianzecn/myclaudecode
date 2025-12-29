# Command Design: /update-models

## Overview

**Command Name:** `/update-models`
**Type:** Orchestrator Command
**Purpose:** Automate the process of updating recommended AI models from OpenRouter trending rankings
**Location:** `.claude/commands/update-models.md`

## Design Summary

The `/update-models` command orchestrates a 5-phase workflow to scrape OpenRouter trending models, intelligently filter and deduplicate them through specialized agents, obtain user approval, update the shared models file, and sync to all plugins. It strictly follows the orchestrator pattern by delegating ALL data manipulation to specialized agents.

## Role Definition

### Identity
OpenRouter Model Sync Orchestrator

### Expertise
- Multi-agent orchestration patterns
- Bash script execution and validation
- User approval workflows
- File synchronization across plugins
- Error recovery and rollback strategies

### Mission
Streamline the process of keeping AI model recommendations current by coordinating specialized agents for OpenRouter data collection and intelligent filtering, obtaining user validation, and distributing updates across all plugins.

## Core Instructions

### Critical Constraints

1. **Orchestrator Role (STRICT)**
   - MUST use Task tool to delegate ALL data manipulation to agents
   - MUST use AskUserQuestion for user approval gate
   - MUST use Bash for running sync script and git commands
   - MUST use Read for file verification only
   - MUST NOT use Write or Edit tools directly
   - MUST NOT perform filtering, categorization, or file updates itself
   - MUST only coordinate workflow and make decisions about delegation

2. **TodoWrite Requirement**
   - MUST create TodoWrite at start with all 5 phases
   - MUST update progress as phases complete
   - MUST mark exactly ONE task as in_progress at a time

3. **Delegation Contract**
   - ALL scraping → model-scraper agent
   - ALL filtering/deduplication/categorization → model-scraper agent
   - ALL file updates → model-scraper agent
   - Orchestrator only: coordinates, validates, approves, recovers from errors

4. **User Approval Gate**
   - MUST present filtered model list to user before updating
   - MUST show: model IDs, providers, categories, pricing
   - MUST allow user to approve, modify, or reject
   - MUST NOT proceed without approval

### Core Principles

1. **Strict Orchestration Pattern**
   - Orchestrator coordinates but never manipulates data
   - All data operations delegated to specialized agents
   - Clear separation of concerns: orchestration vs implementation

2. **Safe Updates**
   - Always read existing file first for verification
   - Create backup before sync
   - Rollback on any failure
   - Preserve existing file if update fails

3. **Error Recovery with Retry Limits**
   - Handle scraping failures gracefully (max 3 attempts)
   - Rollback on sync script errors
   - Partial sync recovery (continue with successful, retry failures)
   - Log all errors for debugging

4. **Structured User Input**
   - Define clear format for user modifications
   - Validate user input before processing
   - Prevent ambiguous or unparseable requests

## model-scraper Agent Contract

### Explicit Capabilities

The model-scraper agent is responsible for:

1. **Scraping** - Extract model data from OpenRouter rankings
2. **Filtering** - Apply filtering rules provided by orchestrator:
   - Remove Anthropic models
   - Deduplicate by provider (keep top-ranked per provider)
   - Balance categories (ensure diversity)
   - Limit to 9-12 models
3. **Categorization** - Assign categories (coding, reasoning, vision, budget)
4. **File Updates** - Update shared/recommended-models.md with:
   - Quick Reference Table
   - Model entries per category
   - Performance Benchmarks
   - Version increment (patch)
   - Last Updated date

### Input/Output Contract

**Input Format:**
```
Task prompt with:
- Target URL (OpenRouter rankings)
- Filtering rules:
  * exclude_providers: ["anthropic"]
  * max_per_provider: 1
  * min_per_category: 2
  * target_count: 9-12 models
- Category focus areas
- File structure preservation rules
```

**Output Format:**
```
- List of filtered models with:
  * slug (provider/model-name)
  * provider name
  * category
  * pricing (average)
  * context window
  * rank (original position)
- Summary of changes (added/removed/updated)
- Updated file path
```

## Orchestration Workflow

### Allowed Tools
- Task (delegate to model-scraper agent)
- AskUserQuestion (user approval gate)
- Bash (run sync script, git commands, verification)
- Read (read files for verification only)
- Glob (find files)
- Grep (search files)
- TodoWrite (progress tracking)

### Forbidden Tools
- Write (file creation - delegate to model-scraper)
- Edit (file modification - delegate to model-scraper)

### Delegation Rules

| Scope | Delegate To | Rationale |
|-------|------------|-----------|
| Scraping OpenRouter | model-scraper agent | Specialized for Chrome DevTools MCP automation |
| Filtering models | model-scraper agent | Agent has data manipulation capabilities |
| Categorizing models | model-scraper agent | Agent understands model capabilities |
| Deduplication logic | model-scraper agent | Agent has Write tool access for updates |
| User approval | AskUserQuestion | Interactive decision gate |
| File updates | model-scraper agent | Agent has Write tool access |
| Syncing to plugins | Bash script | Automated distribution via sync-shared.ts |
| Verification | Orchestrator (Read + Bash) | Validation after delegation |

## Phase Breakdown

### PHASE 0: Initialization

**Objective:** Set up workflow tracking and validate prerequisites

**Steps:**
1. Create TodoWrite with all 5 phases
2. Check if model-scraper agent available:
   ```bash
   # Use Task tool attempt (not grep) for better diagnostics
   # If agent exists, this will succeed; if not, will get clear error
   test -f .claude/agents/model-scraper.md
   ```
3. Check if sync script exists:
   ```bash
   test -f scripts/sync-shared.ts
   ```
4. Check if shared models file exists:
   ```bash
   test -f shared/recommended-models.md
   ```
5. Read existing shared/recommended-models.md to cache current state
6. Mark PHASE 0 complete, PHASE 1 in_progress

**Quality Gate:** All prerequisites validated

**Error Recovery:**
- If model-scraper missing: Report error, suggest creating agent first
- If sync script missing: Report error, stop workflow
- If shared file missing: Report error, suggest manual creation

### PHASE 1: Scrape and Filter Models

**Objective:** Get latest model rankings from OpenRouter and apply intelligent filtering

**Steps:**
1. Mark PHASE 1 as in_progress in TodoWrite
2. Launch model-scraper agent via Task tool with filtering rules:
   ```
   Prompt: "Scrape trending programming models from OpenRouter and apply these filters:

   **Filtering Rules:**
   - Exclude providers: anthropic (Claude models available natively)
   - Max per provider: 1 (keep top-ranked only for diversity)
   - Min per category: 2 (ensure category balance)
   - Target count: 9-12 models

   **Category Focus:**
   - Fast coding models (low latency, high throughput)
   - Advanced reasoning models (complex problem-solving)
   - Vision-capable models (multimodal)
   - Budget-friendly options (cost-effective)

   **Deduplication Algorithm:**
   1. Filter: Remove all Anthropic models
   2. Group by provider: Extract provider from slug (provider/model-name)
   3. Deduplicate: Keep ONLY top-ranked model per provider (first in list)
      - Ranking = OpenRouter's inherent sort order (most popular first)
   4. Category balance: Count models per category
      - If category has <2 models, consider re-adding 2nd model from that provider
      - Priority: Under-represented categories > provider deduplication
   5. Limit: If >12 models, remove lowest-ranked budget models first

   **Return:**
   - JSON array of filtered models with: slug, provider, category, pricing, context, rank
   - Summary of filtering (original count, filtered count, models removed)
   - DO NOT update shared/recommended-models.md yet (wait for user approval)"
   ```
3. Wait for model-scraper to complete
4. Parse returned model data (JSON format)
5. Validate data completeness:
   - Minimum 7 models extracted
   - All models have required fields (slug, provider, category, pricing)
   - No Anthropic models in list
   - Providers are diverse (≥5 different providers)
6. Mark PHASE 1 complete, PHASE 2 in_progress

**Quality Gate:** Minimum 7 diverse models extracted successfully

**Error Recovery with Retry Limits:**
- **Attempt 1:** If <7 models, retry scraping once
- **Attempt 2:** If still <7 models, retry with relaxed filters (allow 2 per provider)
- **Attempt 3:** If still fails, ask user:
  - Option A: Use existing recommendations (no update)
  - Option B: Manual model addition
  - Option C: Abort workflow
- **Max retries:** 3 attempts total
- **Fallback strategy:** Preserve existing file, warn user about outdated models

**Scraping Failure Behavior:**
- If Chrome DevTools MCP error: Report error, suggest MCP configuration check
- If page structure changed: Report error, suggest manual verification
- If network issues: Report error, suggest retry later
- **Clarification:** "Use existing models" means: Abort update, preserve current shared/recommended-models.md, notify user no changes made

### PHASE 2: User Approval

**Objective:** Present filtered models to user for validation

**Steps:**
1. Mark PHASE 2 as in_progress in TodoWrite
2. Format model shortlist for presentation:
   ```
   ## 🔄 Model Update Proposal

   **Status:** Ready for approval

   ### Summary
   - **Original scraped:** {original_count} models
   - **After Anthropic filter:** {after_anthropic} models (-{anthropic_count} Anthropic)
   - **After deduplication:** {after_dedup} models (-{dedup_count} duplicate providers)
   - **Final shortlist:** {final_count} models

   ### Proposed Updates

   #### Fast Coding ⚡
   1. **x-ai/grok-3**
      - Provider: xAI
      - Pricing: $2.00/1M avg
      - Context: 256K tokens
      - Rank: #1

   #### Advanced Reasoning 🧠
   2. **google/gemini-2.5-pro**
      - Provider: Google
      - Pricing: $5.63/1M avg
      - Context: 1049K tokens
      - Rank: #2

   [... continue for all models ...]

   ### Models Removed
   - ❌ anthropic/claude-sonnet-4.5 (Reason: Native Claude access)
   - ❌ x-ai/grok-code-fast-1 (Reason: Duplicate xAI - kept higher-ranked grok-3)

   ### Diversity Check
   - ✅ {provider_count} providers (xAI, Google, OpenAI, etc.)
   - ✅ {category_count} categories covered
   - ✅ Price range: ${min_price}-${max_price}/1M

   **Approve this update?**
   ```
3. Use AskUserQuestion with structured options:
   - **Question:** "Approve these model updates?"
   - **Options:**
     1. ✅ Approve and proceed with update
     2. ✏️ Modify list (add/remove models)
     3. ❌ Cancel update
4. **If "Approve":** Proceed to PHASE 3
5. **If "Modify":**
   - Show structured input format:
     ```
     To add a model:
     add: provider/model-slug, category, pricing

     To remove a model:
     remove: provider/model-slug

     Examples:
     add: meta-llama/llama-3.2-11b-vision-instruct, vision, 0.25
     remove: deepseek/deepseek-chat
     ```
   - Parse user input with validation:
     - Check slug format (provider/model-name)
     - Validate category (coding|reasoning|vision|budget)
     - Validate pricing (numeric)
   - Update shortlist based on validated input
   - Re-present for approval
   - Maximum 2 modification loops to prevent infinite iterations
   - After 2 loops, force decision: approve current or cancel
6. **If "Cancel":** Stop workflow, mark all phases complete, report no changes
7. Mark PHASE 2 complete, PHASE 3 in_progress

**Quality Gate:** User approved model shortlist

**Ranking Clarification:**
- "Rank" = OpenRouter's inherent sort order as displayed on rankings page
- Models scraped in order: #1 (top), #2, #3, etc.
- "Top-ranked per provider" = first model from that provider in scraped list

**Structured User Input Parsing:**
```typescript
// Pseudocode for input validation
function parseUserModification(input: string): Modification {
  const lines = input.split('\n').filter(l => l.trim());

  for (const line of lines) {
    if (line.startsWith('add:')) {
      const [_, data] = line.split('add:');
      const [slug, category, pricing] = data.split(',').map(s => s.trim());

      // Validate slug format
      if (!slug.match(/^[\w-]+\/[\w-]+$/)) {
        throw new Error(`Invalid slug format: ${slug}`);
      }

      // Validate category
      const validCategories = ['coding', 'reasoning', 'vision', 'budget'];
      if (!validCategories.includes(category)) {
        throw new Error(`Invalid category: ${category}`);
      }

      // Validate pricing
      if (isNaN(parseFloat(pricing))) {
        throw new Error(`Invalid pricing: ${pricing}`);
      }

      return { action: 'add', slug, category, pricing: parseFloat(pricing) };
    }

    if (line.startsWith('remove:')) {
      const [_, slug] = line.split('remove:');
      const trimmedSlug = slug.trim();

      // Validate slug format
      if (!trimmedSlug.match(/^[\w-]+\/[\w-]+$/)) {
        throw new Error(`Invalid slug format: ${trimmedSlug}`);
      }

      return { action: 'remove', slug: trimmedSlug };
    }
  }

  throw new Error('No valid modification command found');
}
```

### PHASE 3: Update Shared File

**Objective:** Update shared/recommended-models.md with approved models

**Steps:**
1. Mark PHASE 3 as in_progress in TodoWrite
2. Create backup of current file:
   ```bash
   cp shared/recommended-models.md \
      shared/recommended-models.md.backup
   ```
   (Note: Use paths relative to repository root)
3. Launch model-scraper agent to update file:
   ```
   Prompt: "Update shared/recommended-models.md with these approved models:

   {JSON array of approved models}

   **Instructions:**
   - Preserve file structure (decision tree, examples, metadata)
   - Update Quick Reference Table
   - Update model entries in each category section
   - Update Performance Benchmarks
   - Increment version number (patch: 1.1.0 → 1.1.1)
   - Update 'Last Updated' date to today (YYYY-MM-DD)
   - DO NOT modify decision tree section
   - DO NOT modify integration examples section
   - DO NOT modify maintenance instructions section

   **Return:**
   - Summary of changes (models added/removed/updated)
   - Version number (old → new)
   - Confirmation of file update"
   ```
4. Wait for model-scraper to complete
5. Read updated file to verify changes:
   ```bash
   # Verify version incremented
   grep "Version:" shared/recommended-models.md

   # Verify date updated
   grep "Last Updated:" shared/recommended-models.md

   # Verify file is valid markdown
   # (No automated check - visual inspection during read)
   ```
6. If verification fails:
   - Restore from backup:
     ```bash
     cp shared/recommended-models.md.backup \
        shared/recommended-models.md
     ```
   - Report error and stop
   - Preserve backup for debugging
7. Mark PHASE 3 complete, PHASE 4 in_progress

**Quality Gate:** File updated successfully and verified

**Verification Checks:**
- ✅ Version number incremented (patch)
- ✅ Last Updated date is today
- ✅ All approved models present in file
- ✅ Decision tree section unchanged
- ✅ File is valid markdown (no syntax errors)

### PHASE 4: Sync to Plugins

**Objective:** Distribute updated models file to all plugins with partial failure recovery

**Steps:**
1. Mark PHASE 4 as in_progress in TodoWrite
2. Run sync script via Bash:
   ```bash
   bun run scripts/sync-shared.ts
   ```
3. Wait for script completion
4. Verify sync results:
   ```bash
   # Check that files were updated
   ls -l plugins/*/recommended-models.md

   # Verify content matches source (md5 hash comparison)
   md5 shared/recommended-models.md \
       plugins/frontend/recommended-models.md \
       plugins/bun/recommended-models.md \
       plugins/code-analysis/recommended-models.md
   ```
5. **Partial Sync Recovery Strategy:**
   - If ALL syncs fail:
     - Restore backup: `cp shared/recommended-models.md.backup shared/recommended-models.md`
     - Report complete failure
     - Suggest checking permissions and re-running
   - If SOME syncs succeed:
     - Identify which plugins synced successfully (check md5 hashes)
     - Identify which plugins failed (different md5 or missing file)
     - Ask user:
       * Option A: Continue with successful syncs (partial update)
       * Option B: Rollback everything (restore backup + manual sync)
       * Option C: Retry failed plugins only (selective retry)
     - Based on user choice:
       * **Continue:** Keep successful, report failed plugins for manual sync
       * **Rollback:** Restore backup, revert all plugin files to backup
       * **Retry:** Run sync script again (max 2 retry attempts)
6. Show git status to user:
   ```bash
   git status
   git diff --stat
   ```
7. Present summary:
   ```
   ## ✅ Model Update Complete

   **Models Updated:** {count} models
   **File Updated:** shared/recommended-models.md
   **Version:** {old_version} → {new_version}
   **Synced To:**
   - ✅ plugins/frontend/recommended-models.md
   - ✅ plugins/bun/recommended-models.md
   - ✅ plugins/code-analysis/recommended-models.md

   **Next Steps:**
   1. Review changes: git diff shared/recommended-models.md
   2. Test model selection in /implement command
   3. Commit changes: git add . && git commit -m "chore: update recommended models v{new_version}"

   **Files Modified:**
   M  shared/recommended-models.md
   M  plugins/frontend/recommended-models.md
   M  plugins/bun/recommended-models.md
   M  plugins/code-analysis/recommended-models.md
   ```
8. Remove backup file:
   ```bash
   rm shared/recommended-models.md.backup
   ```
9. Mark PHASE 4 complete
10. Mark ALL TodoWrite tasks complete

**Quality Gate:** Files synced successfully, git status shows expected changes

**Error Recovery:**
- If sync script fails completely: Restore backup, report error, suggest manual sync
- If verification fails: Restore backup, report error
- If partial sync: Offer continue/rollback/retry options
- If git status unexpected: Show diff to user for manual review

**Partial Sync Recovery Decision Matrix:**

| Scenario | Successful Syncs | Failed Syncs | Recommendation |
|----------|------------------|--------------|----------------|
| Complete Success | 3/3 plugins | None | Continue normally |
| Partial Failure | 2/3 plugins | 1 plugin | Offer continue/retry/rollback |
| Partial Failure | 1/3 plugins | 2 plugins | Suggest rollback or retry |
| Complete Failure | 0/3 plugins | 3 plugins | Restore backup, report error |

## Knowledge Section

### Filtering Logic (Delegated to model-scraper)

**Orchestrator Provides These Rules to model-scraper:**

#### Rule 1: Anthropic Filter
```yaml
exclude_providers:
  - anthropic
reason: Claude models available natively via Anthropic API
```

#### Rule 2: Provider Deduplication
```yaml
max_per_provider: 1
strategy: keep_top_ranked
ranking_source: OpenRouter inherent sort order
exception: category_balance_override (see Rule 3)
```

**Clarification on Ranking:**
- "Rank" = Position in OpenRouter's scraped list (1 = first/top)
- OpenRouter sorts by popularity/usage metrics
- "Top-ranked per provider" = First occurrence of that provider in list

#### Rule 3: Category Balance
```yaml
min_per_category: 2
categories:
  - coding (fast, low-latency models)
  - reasoning (complex problem-solving)
  - vision (multimodal, image understanding)
  - budget (cost-effective options)

balancing_strategy:
  # If category has <2 models after deduplication:
  # Consider re-adding 2nd model from under-represented provider
  # Priority: Category diversity > Provider deduplication

algorithm:
  1. Apply Anthropic filter
  2. Apply provider deduplication (keep top-ranked)
  3. Count models per category
  4. For categories with <2 models:
     - Find providers with removed 2nd-ranked models in that category
     - Re-add highest-ranked removed model from that category
     - Only re-add up to 2 models per provider maximum
  5. Final limit: 12 models (remove lowest-ranked budget models if exceeded)
```

**Category Balance Re-inclusion Example:**
```typescript
// Pseudocode for clarity
const models = [
  { slug: 'x-ai/grok-3', category: 'coding', rank: 1 },
  { slug: 'google/gemini-pro', category: 'reasoning', rank: 2 },
  { slug: 'openai/gpt-5', category: 'reasoning', rank: 3 },
  // After deduplication: 3 models, reasoning=2, coding=1, vision=0, budget=0
];

const removed = [
  { slug: 'x-ai/grok-vision', category: 'vision', rank: 4 }, // 2nd xAI
  { slug: 'deepseek/deepseek-chat', category: 'budget', rank: 5 },
];

// Category balance check:
// - coding: 1 model (UNDER - need 1 more)
// - vision: 0 models (UNDER - need 2 more)
// - budget: 0 models (UNDER - need 2 more)

// Re-inclusion:
// 1. Re-add x-ai/grok-vision (rank 4) for vision category (allows 2 xAI models)
// 2. Re-add deepseek/deepseek-chat (rank 5) for budget category
// 3. Find another budget model if available

// Final: 5 models with better category distribution
```

#### Rule 4: Target Count
```yaml
target_range: 9-12 models
if_exceeded: remove_lowest_ranked_budget_models_first
if_below_minimum: keep_all_filtered (already filtered to best)
```

### model-scraper Markdown Update Capabilities

The model-scraper agent can:

1. **Parse Markdown Structure:**
   - Identify sections by headers (## Quick Reference, ## Fast Coding, etc.)
   - Preserve sections marked as "DO NOT MODIFY"
   - Understand table formats

2. **Update Specific Sections:**
   - Quick Reference Table (model list + pricing)
   - Category sections (Fast Coding, Advanced Reasoning, Vision, Budget)
   - Performance Benchmarks table
   - Cost Comparison table

3. **Preserve File Metadata:**
   - Decision tree flowchart (unchanged)
   - Integration examples (unchanged)
   - Maintenance instructions (unchanged)
   - Questions and Support section (unchanged)

4. **Version Management:**
   - Increment patch version (1.1.0 → 1.1.1)
   - Update Last Updated date (YYYY-MM-DD format)
   - Maintain version history consistency

5. **Return Confirmation:**
   - Summary of changes (models added/removed/updated)
   - Old version → New version
   - File path updated

### Diversity Principle Thresholds

**Explicit Diversity Targets:**
```yaml
min_providers: 5 different providers
max_per_provider: 2 models (only with category balance override)
min_per_category: 2 models per category
target_category_balance: 25% per category (flexible)
price_range_diversity: Include models from budget (<$1) to premium (>$5)
```

## Examples

### Example 1: Successful Update with Deduplication

**User Input:** `/update-models`

**Execution:**
```
PHASE 0: Initialize workflow ✅
  - Verified model-scraper agent exists
  - Verified sync script exists
  - Read existing shared/recommended-models.md (v1.1.0)

PHASE 1: Scrape and filter models ✅
  - Delegated to model-scraper with filtering rules
  - Original scraped: 9 models (2 Anthropic, 2 xAI, 2 Google, 1 OpenAI, 1 Qwen, 1 DeepSeek)
  - Anthropic filter: 9 → 7 models
  - Provider deduplication: 7 → 5 models
    * Removed x-ai/grok-code-fast-1 (kept x-ai/grok-3)
    * Removed google/gemini-flash (kept google/gemini-pro)
  - Category balance: 5 models (coding=2, reasoning=2, vision=0, budget=1)
    * Re-added qwen/qwen3-vl for vision (under-represented)
  - Final: 6 diverse models

PHASE 2: User approval ✅
  - Presented shortlist with diversity metrics
  - User approved without modifications

PHASE 3: Update shared file ✅
  - Delegated to model-scraper for file update
  - Version: 1.1.0 → 1.1.1
  - Verified changes (version, date, model entries)
  - Backup created

PHASE 4: Sync to plugins ✅
  - Synced to 3 plugin directories
  - Verified md5 hashes match
  - Git status: 4 files modified
  - Removed backup
```

**Output:**
```markdown
## ✅ Model Update Complete

**Models Updated:** 6 models
**File Updated:** shared/recommended-models.md (v1.1.1)
**Synced To:** frontend, bun, code-analysis plugins

**Models Added:**
- x-ai/grok-3 (Fast Coding)
- google/gemini-2.5-pro (Advanced Reasoning)
- openai/gpt-5-codex (Advanced Reasoning)
- qwen/qwen3-vl-30b-a3b-instruct (Vision)
- deepseek/deepseek-chat (Budget)
- meta-llama/llama-3.2-90b-vision-instruct (Vision)

**Models Removed:**
- anthropic/claude-sonnet-4.5 (Native access)
- anthropic/claude-sonnet-4 (Native access)
- x-ai/grok-code-fast-1 (Duplicate provider - kept grok-3)
- google/gemini-2.5-flash (Duplicate provider - kept gemini-pro)

**Diversity Metrics:**
- ✅ 5 providers (xAI, Google, OpenAI, Qwen, DeepSeek, Meta)
- ✅ 4 categories covered (2 coding, 2 reasoning, 2 vision, 1 budget)
- ✅ Price range: $0.25-$9.00/1M

**Next Steps:**
1. Review: git diff shared/recommended-models.md
2. Test in /implement command
3. Commit: git add . && git commit -m "chore: update models v1.1.1"
```

### Example 2: User Modifies List with Structured Input

**User Input:** `/update-models`

**Execution:**
```
PHASE 0-1: ✅ (scraped and filtered to 5 models)

PHASE 2: User approval with modification ✏️
  - Presented shortlist (5 models)
  - User selects "Modify"
  - Orchestrator shows structured input format:
    """
    To add a model:
    add: provider/model-slug, category, pricing

    To remove a model:
    remove: provider/model-slug
    """
  - User input:
    """
    add: meta-llama/llama-3.2-11b-vision-instruct, vision, 0.25
    remove: deepseek/deepseek-chat
    """
  - Orchestrator validates input:
    ✅ Slug format valid
    ✅ Category valid (vision)
    ✅ Pricing valid (0.25)
  - Updated shortlist: 5 models (added llama, removed deepseek)
  - Re-presented for approval
  - User approved

PHASE 3-4: ✅ (updated with 5 modified models)
```

**Key Difference:** Structured user input with validation ensures clean parsing and prevents errors.

### Example 3: Scraping Failure with Retry Limits

**User Input:** `/update-models`

**Execution:**
```
PHASE 0: Initialize workflow ✅

PHASE 1: Scrape and filter models (with retries) ⚠️
  - Attempt 1: Delegated to model-scraper
    * Error: Chrome DevTools MCP not responding
    * Only 4 models extracted (below minimum 7)
    * Retry...

  - Attempt 2: Delegated with relaxed filters (allow 2 per provider)
    * Error: Still only 5 models extracted
    * Retry with further relaxation...

  - Attempt 3: Final attempt
    * Error: Still only 6 models (below minimum 7)
    * Max retries reached (3/3)

  - Fallback decision requested from user:
    1. Use existing recommendations (no update)
    2. Proceed with 6 models (below target)
    3. Abort workflow

  - User selects: Option 1 (Use existing)

PHASE 2-4: SKIPPED (user chose to preserve existing)

Workflow completed: No files modified
```

**Output:**
```markdown
## ⚠️ Model Update Aborted (Insufficient Data)

**Phase:** PHASE 1 - Scrape and Filter Models
**Error:** Insufficient models extracted after 3 retry attempts

**Retry History:**
- Attempt 1: 4 models (below minimum 7)
- Attempt 2: 5 models (with relaxed filters)
- Attempt 3: 6 models (final attempt)

**Likely Causes:**
1. Chrome DevTools MCP not responding properly
2. OpenRouter page structure may have changed
3. Network connectivity issues during scraping

**User Decision:** Use existing recommendations (no update)

**Result:** No files were modified. Current recommendations preserved.

**Recommendation:**
1. Check MCP status: Test Chrome DevTools MCP manually
2. Verify page access: Visit https://openrouter.ai/rankings in browser
3. Review logs: Check model-scraper agent output for detailed errors
4. Retry later: Run /update-models again when MCP is stable

**Next Steps:** Fix MCP issues and re-run /update-models
```

### Example 4: Partial Sync Failure with Recovery

**User Input:** `/update-models`

**Execution:**
```
PHASE 0-3: ✅ (scraped, filtered, approved, file updated successfully)

PHASE 4: Sync to plugins (partial failure) ⚠️
  - Sync script ran
  - Verification results:
    * ✅ plugins/frontend/recommended-models.md (md5 match)
    * ✅ plugins/bun/recommended-models.md (md5 match)
    * ❌ plugins/code-analysis/recommended-models.md (md5 mismatch - permission denied)

  - Partial sync detected: 2/3 successful

  - Orchestrator asks user:
    1. Continue with successful syncs (frontend, bun updated; code-analysis needs manual sync)
    2. Rollback everything (restore backup + revert plugin files)
    3. Retry failed plugin only (attempt selective sync)

  - User selects: Option 1 (Continue)

  - Orchestrator confirms:
    * Keeps shared/recommended-models.md updated
    * Keeps frontend and bun plugin synced
    * Reports code-analysis needs manual sync
    * Removes backup (successful update)
```

**Output:**
```markdown
## ⚠️ Model Update Partial Success

**Phase:** PHASE 4 - Sync to Plugins (Partial Failure)
**Error:** code-analysis plugin sync failed (permission denied)

**Status:**
- ✅ Models scraped successfully (6 models)
- ✅ Models filtered and approved
- ✅ Shared file updated (v1.1.0 → v1.1.1)
- ✅ Frontend plugin synced
- ✅ Bun plugin synced
- ❌ Code-analysis plugin sync failed

**User Decision:** Continue with successful syncs

**Files Modified:**
M  shared/recommended-models.md
M  plugins/frontend/recommended-models.md
M  plugins/bun/recommended-models.md

**Manual Recovery Steps for code-analysis plugin:**
1. Check permissions:
   ```bash
   ls -la plugins/code-analysis/
   ```
2. Manually copy file:
   ```bash
   cp shared/recommended-models.md \
      plugins/code-analysis/recommended-models.md
   ```
3. Verify sync:
   ```bash
   md5 shared/recommended-models.md \
       plugins/code-analysis/recommended-models.md
   ```

**Next Steps:**
1. Fix permissions issue for code-analysis plugin
2. Manually sync code-analysis file (commands above)
3. Verify all 3 plugins have matching files
4. Commit changes: git add . && git commit -m "chore: update models v1.1.1"
```

## Error Recovery Strategies

### Scraping Failures (with Retry Limits)
**Symptom:** model-scraper returns <7 models

**Recovery:**
1. **Attempt 1:** Retry with same filters
2. **Attempt 2:** Retry with relaxed filters (allow 2 per provider)
3. **Attempt 3:** Final retry (last chance)
4. **Max retries reached:** Ask user:
   - Option A: Use existing recommendations (preserve file)
   - Option B: Proceed with fewer models (if ≥5 models)
   - Option C: Abort workflow
5. **Clarification on "Use existing":** Preserve current shared/recommended-models.md with no changes, notify user models may be outdated

### User Cancellation
**Symptom:** User selects "Cancel" in approval gate

**Recovery:**
1. Acknowledge cancellation
2. No files modified (preserve existing)
3. Remove backup if created (cleanup)
4. Mark all TodoWrite tasks complete
5. Provide summary of what was scraped (for user reference)

### File Update Failures
**Symptom:** model-scraper fails to update file

**Recovery:**
1. Restore from backup immediately:
   ```bash
   cp shared/recommended-models.md.backup \
      shared/recommended-models.md
   ```
2. Verify backup restoration (read file)
3. Report specific error to user
4. Suggest checking file permissions
5. Offer manual edit option with approved model list

### Sync Script Failures
**Symptom:** `bun run scripts/sync-shared.ts` exits non-zero

**Recovery:**

#### Complete Failure (0/3 plugins synced)
1. Restore backup:
   ```bash
   cp shared/recommended-models.md.backup \
      shared/recommended-models.md
   ```
2. Verify restoration with md5sum
3. Report error and script output
4. Suggest manual sync commands
5. Provide diagnostic steps (check permissions, check script)

#### Partial Failure (1-2/3 plugins synced)
1. Identify successful syncs (md5 hash comparison)
2. Identify failed syncs (different md5 or error)
3. Ask user:
   - **Continue:** Keep successful syncs, report failures for manual sync
   - **Rollback:** Restore backup + revert all plugin files (use git restore)
   - **Retry:** Attempt sync again for failed plugins only (max 2 retry attempts)
4. Based on user choice:
   - **Continue:** Remove backup, report manual steps for failed plugins
   - **Rollback:** Execute rollback, verify all files restored, remove backup
   - **Retry:** Re-run sync script (if still fails, offer continue/rollback)

**Partial Sync Recovery Decision Matrix:**

| Successful | Failed | Recommendation | Rationale |
|------------|--------|----------------|-----------|
| 3/3 | 0/3 | Continue normally | Complete success |
| 2/3 | 1/3 | Offer continue/retry/rollback | Minor issue, fixable |
| 1/3 | 2/3 | Suggest rollback or retry | Major issue, risky state |
| 0/3 | 3/3 | Restore backup, report error | Complete failure |

### Modification Loop Limit
**Symptom:** User requests >2 modifications to model list

**Recovery:**
1. After 2 modification loops, force decision
2. Present options:
   - Approve current list (proceed with update)
   - Abort update (preserve existing file)
   - Manually edit shared file (provide model list for reference)
3. Explain why limit exists (prevent infinite loops, time management)
4. Proceed based on user selection

## Success Criteria

Command execution is successful when:

- ✅ TodoWrite initialized and all tasks completed
- ✅ model-scraper successfully scraped ≥7 models (within 3 retry attempts)
- ✅ Anthropic models filtered out (delegated to model-scraper)
- ✅ Providers deduplicated with category balance (delegated to model-scraper)
- ✅ User approved final model list
- ✅ shared/recommended-models.md updated correctly (delegated to model-scraper)
- ✅ Version number incremented (patch)
- ✅ Last Updated date is current
- ✅ Decision tree and examples preserved
- ✅ Sync script completed successfully (or partial success with user approval)
- ✅ All or approved-subset of plugin files updated
- ✅ Git status shows expected changes

**Quality Indicators:**
- Model count: 9-12 (diverse selection)
- Provider count: ≥5 different providers
- Category balance: ≥2 models per category
- No Anthropic models in final list
- Max 2 models per provider (only with category balance override)
- File structure preserved (decision tree intact)
- Orchestrator never used Write/Edit tools (strict delegation)

## Limitations

1. **Scraping Dependency:** Relies on model-scraper agent and Chrome DevTools MCP availability
2. **Retry Limits:** Maximum 3 scraping attempts before requiring user decision
3. **Manual Commit:** Does not auto-commit changes (user must commit)
4. **Partial Rollback Complexity:** Selective rollback for partial sync failures requires manual git operations
5. **Category Heuristics:** Category assignment delegated to model-scraper (may have edge cases)
6. **No Model Testing:** Does not validate models work with Claudish before updating
7. **Modification Loop Limit:** Maximum 2 user modifications to prevent infinite iterations

## Future Enhancements

**Potential improvements for future versions:**

1. **Model Validation:** Test each model with Claudish before adding to recommendations
2. **Smart Deduplication:** Machine learning-based similarity detection (not just provider-based)
3. **Automatic Commit:** Optionally commit changes with generated message (with user approval)
4. **Atomic Rollback:** Implement automatic rollback for all plugins on any failure
5. **Category ML:** Use AI to classify models instead of name heuristics (more accurate)
6. **Diff Preview:** Show side-by-side before/after comparison before approval
7. **Cost Tracking:** Track estimated costs for new models and compare with existing
8. **Model Testing Suite:** Run test prompts through new models before approval
9. **Historical Tracking:** Maintain changelog of model recommendations over time
10. **Model Deprecation Workflow:** Detect and flag deprecated models from OpenRouter

---

## Design Decisions

### Why Orchestrator Pattern?
- Separates concerns: data manipulation (model-scraper) vs orchestration (this command)
- Reuses existing specialized agent (model-scraper)
- Allows independent testing of components
- Follows established pattern from /implement, /develop-agent
- **Critical:** Ensures orchestrator never violates tool restrictions (no Write/Edit)

### Why Delegate ALL Filtering to model-scraper?
- **Orchestrator Pattern Compliance:** Orchestrator coordinates but never manipulates data
- **Tool Alignment:** model-scraper has Write/Edit permissions needed for filtering and file updates
- **Clear Separation:** Orchestrator provides filtering rules, agent executes filtering logic
- **Maintainability:** Filtering logic contained in one agent, easier to test and improve

### Why Anthropic Filter?
- Claude models available natively via Anthropic API
- No benefit to routing through OpenRouter for Claude
- Reduces confusion in model selection
- Focuses list on models that add value beyond native access

### Why Provider Deduplication with Category Balance Override?
- **Primary Goal:** Maximize provider diversity (expose users to different AI paradigms)
- **Secondary Goal:** Ensure category diversity (≥2 models per category)
- **Conflict Resolution:** Allow up to 2 models per provider if needed for category balance
- **Rationale:** Provider diversity prevents vendor lock-in; category diversity ensures use case coverage

### Why Retry Limits (Max 3 Attempts)?
- **Prevent Infinite Loops:** Scraping failures should not cause endless retries
- **Reasonable Attempts:** 3 tries gives adequate opportunity to succeed
- **User Control:** After 3 failures, escalate to user decision (use existing, proceed with fewer, abort)
- **Fallback Strategy:** Preserve existing recommendations on persistent failures (safety net)

### Why User Approval Gate?
- Model recommendations impact production workflows
- User may have specific model preferences
- Allows review before committing changes
- Prevents automatic updates that break workflows

### Why Structured User Modification Input?
- **Clear Format:** "add: provider/model, category, pricing" or "remove: provider/model"
- **Validation:** Prevents parsing errors from unstructured text
- **Better UX:** Users know exactly what format to use
- **Error Handling:** Can catch and report invalid input early

### Why Partial Sync Recovery?
- **Real-World Scenario:** File permissions, network issues can cause selective failures
- **User Choice:** Some users prefer partial updates over complete rollback
- **Flexibility:** Continue with successful syncs, manually fix failures later
- **Avoids Data Loss:** Don't undo successful work due to one plugin failure

### Why Manual Commit?
- Follows repository conventions (no auto-commits)
- Allows user to review diff before commit
- Enables batching with other changes
- Gives user control over commit message

### Why Backup and Restore?
- Safety net for file operations
- Enables rollback on errors
- Prevents data loss on sync failures
- Standard practice for destructive operations

---

**Version:** 2.0.0 (Major revision - addressed critical architectural issues)
**Designed:** 2025-11-14
**Revised:** 2025-11-14
**Status:** Ready for Implementation
**Target Location:** `.claude/commands/update-models.md`
**Revision Summary:** See ai-docs/plan-revision-summary.md
