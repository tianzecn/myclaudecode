# Skill Design: OpenRouter Trending Models

## Overview

**Type:** Shareable Skill (cross-plugin utility)
**Purpose:** Fetch and analyze trending programming models from OpenRouter rankings
**Location:** `/skills/openrouter-models/` (project-level shared skill)
**Components:** SKILL.md + fetch-models.ts (Bun executable script)

## Problem Statement

The plan-reviewer agent and other multi-model features need access to current trending programming models from OpenRouter. Currently, model recommendations are hardcoded in agent prompts. This skill provides dynamic, data-driven model recommendations based on actual usage trends.

**Current Pain Points:**
- Model recommendations are static and can become outdated
- No visibility into which models are actually trending for programming tasks
- Manual effort required to research and update model lists
- No programmatic access to OpenRouter ranking data

**Solution:**
Create a shareable skill with an executable Bun script that:
1. Fetches trending model rankings from OpenRouter
2. Parses React Server Component streaming format
3. Extracts top 9 programming models from most recent week
4. Fetches model details (context window, pricing) from OpenRouter API
5. Returns structured JSON for easy consumption

---

## Design Decisions

### 1. Skill Location: Project-Level Shared

**Decision:** Place in `skills/openrouter-models/`

**Rationale:**
- **Cross-plugin utility** - Useful for frontend, bun, and future plugins
- **Follows existing pattern** - Matches `/skills/release/` structure
- **Team-wide accessibility** - Available to all plugins without duplication
- **Easy discovery** - Project-level skills are loaded globally

**Structure:**
```
skills/
└── openrouter-models/
    ├── SKILL.md              # Skill instructions for Claude
    └── fetch-models.ts       # Bun executable script
```

### 2. Data Source: OpenRouter Rankings Page

**URL:** `https://openrouter.ai/rankings?category=programming&view=trending&_rsc=2nz0s`

**Format:** React Server Component (RSC) streaming format

**Data Structure Analysis:**
```javascript
// React streaming format contains embedded JSON data
1b:["$","$L25",null,{"data":[
  {
    "x": "2025-11-10",  // Week ending date (YYYY-MM-DD)
    "ys": {             // Models ranked by token usage
      "x-ai/grok-code-fast-1": 908664328688,
      "anthropic/claude-4.5-sonnet-20250929": 377524868904,
      "google/gemini-2.5-flash": 233089448161,
      // ... 6 more models
      "Others": 1465338918838  // Aggregated remaining models
    }
  },
  // ... previous weeks
]}]
```

**Key Insights:**
- Data is embedded in RSC streaming format (line starting with `1b:["$","$L25"...`)
- Most recent week is FIRST in the array (`data[0]`)
- Top 9 models + "Others" category (always 10th)
- Token usage values are large integers (billions of tokens)
- Model IDs follow `provider/model-name` format

### 3. Parsing Strategy: Regex + JSON

**Challenge:** RSC format wraps JSON in React component structure

**Approach:**
```typescript
// 1. Fetch HTML response
const response = await fetch(url);
const text = await response.text();

// 2. Extract JSON data using regex
// Pattern: 1b:["$","$L25",null,{"data":[...]}]
const match = text.match(/1b:\["[^"]+","[^"]+",null,(\{.*?\})\]/s);

// 3. Parse extracted JSON
const data = JSON.parse(match[1]);

// 4. Get most recent week (first item)
const latestWeek = data.data[0];

// 5. Extract top 9 models (exclude "Others")
const models = Object.entries(latestWeek.ys)
  .filter(([name]) => name !== "Others")
  .slice(0, 9);
```

**Alternative Considered:** DOM parsing with cheerio
- **Rejected:** Adds external dependency, more complex for simple data extraction
- **Chosen:** Regex is sufficient for predictable structure, zero dependencies

### 4. Model Details: OpenRouter API

**Endpoint:** `https://openrouter.ai/api/v1/models`

**Response Format:**
```json
{
  "data": [
    {
      "id": "x-ai/grok-code-fast-1",
      "name": "Grok Code Fast",
      "context_length": 131072,
      "pricing": {
        "prompt": "0.0000005",    // Per token (USD)
        "completion": "0.000001"
      },
      "top_provider": {
        "max_completion_tokens": 32768
      }
    }
  ]
}
```

**Data Extraction:**
```typescript
interface ModelDetails {
  id: string;
  name: string;
  contextLength: number;
  pricing: {
    prompt: number;    // Converted to number
    completion: number;
  };
  maxCompletionTokens: number;
}

async function fetchModelDetails(modelId: string): Promise<ModelDetails> {
  const response = await fetch("https://openrouter.ai/api/v1/models");
  const data = await response.json();

  const model = data.data.find((m: any) => m.id === modelId);

  return {
    id: model.id,
    name: model.name,
    contextLength: model.context_length,
    pricing: {
      prompt: parseFloat(model.pricing.prompt),
      completion: parseFloat(model.pricing.completion),
    },
    maxCompletionTokens: model.top_provider?.max_completion_tokens || 0,
  };
}
```

**API Key:** NOT REQUIRED - Public endpoint, no authentication needed

### 5. Output Schema: Structured JSON

**File:** `trending-models.json` (written to skill directory)

**Schema:**
```typescript
interface TrendingModelsOutput {
  metadata: {
    fetchedAt: string;        // ISO 8601 timestamp
    weekEnding: string;       // YYYY-MM-DD
    category: "programming";
    view: "trending";
  };
  models: Array<{
    rank: number;             // 1-9
    id: string;               // "x-ai/grok-code-fast-1"
    name: string;             // "Grok Code Fast"
    tokenUsage: number;       // 908664328688
    contextLength: number;    // 131072
    maxCompletionTokens: number;
    pricing: {
      prompt: number;         // 0.0000005
      completion: number;     // 0.000001
      promptPer1M: number;    // 0.50 (calculated)
      completionPer1M: number; // 1.00 (calculated)
    };
  }>;
  summary: {
    totalTokens: number;      // Sum of top 9 models
    topProvider: string;      // Most represented provider
    averageContextLength: number;
    priceRange: {
      min: number;
      max: number;
      unit: "USD per 1M tokens";
    };
  };
}
```

**Example Output:**
```json
{
  "metadata": {
    "fetchedAt": "2025-11-14T10:30:00Z",
    "weekEnding": "2025-11-10",
    "category": "programming",
    "view": "trending"
  },
  "models": [
    {
      "rank": 1,
      "id": "x-ai/grok-code-fast-1",
      "name": "Grok Code Fast",
      "tokenUsage": 908664328688,
      "contextLength": 131072,
      "maxCompletionTokens": 32768,
      "pricing": {
        "prompt": 0.0000005,
        "completion": 0.000001,
        "promptPer1M": 0.50,
        "completionPer1M": 1.00
      }
    }
    // ... 8 more models
  ],
  "summary": {
    "totalTokens": 4500000000000,
    "topProvider": "x-ai",
    "averageContextLength": 98304,
    "priceRange": {
      "min": 0.50,
      "max": 15.00,
      "unit": "USD per 1M tokens"
    }
  }
}
```

### 6. Script Architecture: Bun TypeScript

**File:** `fetch-models.ts`

**Why Bun:**
- **Zero dependencies** - Built-in fetch, no need for node-fetch
- **TypeScript native** - No build step required
- **Fast execution** - Perfect for CLI scripts
- **Project standard** - Matches Bun backend plugin patterns

**Script Structure:**
```typescript
#!/usr/bin/env bun

/**
 * Fetch trending programming models from OpenRouter
 *
 * Usage:
 *   bun run fetch-models.ts
 *   bun run fetch-models.ts --output custom-path.json
 *
 * Output:
 *   trending-models.json (or custom path)
 */

// Types
interface RankingData {
  x: string;  // date
  ys: Record<string, number>;  // model -> token count
}

interface ModelDetails {
  id: string;
  name: string;
  contextLength: number;
  pricing: {
    prompt: number;
    completion: number;
    promptPer1M: number;
    completionPer1M: number;
  };
  maxCompletionTokens: number;
}

interface TrendingModelsOutput {
  metadata: {
    fetchedAt: string;
    weekEnding: string;
    category: "programming";
    view: "trending";
  };
  models: Array<ModelDetails & {
    rank: number;
    tokenUsage: number;
  }>;
  summary: {
    totalTokens: number;
    topProvider: string;
    averageContextLength: number;
    priceRange: {
      min: number;
      max: number;
      unit: "USD per 1M tokens";
    };
  };
}

// Functions
async function fetchRankings(): Promise<RankingData> {
  // Fetch and parse RSC format
}

async function fetchModelDetails(modelId: string): Promise<ModelDetails> {
  // Fetch from OpenRouter API
}

function calculateSummary(models: ModelDetails[]): TrendingModelsOutput["summary"] {
  // Calculate aggregate statistics
}

async function main() {
  // 1. Fetch rankings
  // 2. Extract top 9 models
  // 3. Fetch details for each model (parallel)
  // 4. Build output JSON
  // 5. Write to file
  // 6. Print summary to console
}

// Execute
main().catch(console.error);
```

**Error Handling:**
```typescript
try {
  const rankings = await fetchRankings();
} catch (error) {
  console.error("Failed to fetch rankings:", error.message);
  console.error("URL may have changed or network issue occurred");
  process.exit(1);
}

try {
  const details = await fetchModelDetails(modelId);
} catch (error) {
  console.warn(`Failed to fetch details for ${modelId}, using defaults`);
  // Use fallback values
}
```

**CLI Arguments:**
```bash
# Default output
bun run fetch-models.ts

# Custom output path
bun run fetch-models.ts --output /path/to/output.json

# Verbose logging
bun run fetch-models.ts --verbose

# Help
bun run fetch-models.ts --help
```

### 7. SKILL.md Structure

**Frontmatter:**
```yaml
---
name: openrouter-models
description: Fetch trending programming models from OpenRouter rankings. Use when selecting models for multi-model review, updating model recommendations, or researching current AI coding trends. Provides model IDs, context windows, pricing, and usage statistics.
---
```

**Content Sections:**
1. **Overview** - What this skill does and when to use it
2. **Quick Start** - How to run the script
3. **Output Format** - JSON schema and examples
4. **Use Cases** - Specific scenarios (plan review, model selection, research)
5. **Integration Examples** - How agents can use this data
6. **Troubleshooting** - Common issues and solutions
7. **Data Freshness** - Weekly updates, caching recommendations

---

## Implementation Plan

### Phase 1: Core Script (Priority: High)

**Files to Create:**
1. `skills/openrouter-models/fetch-models.ts`
   - Fetch rankings from OpenRouter
   - Parse RSC format
   - Extract top 9 models
   - Fetch model details from API
   - Generate JSON output
   - Error handling and validation

**Acceptance Criteria:**
- ✅ Script runs without dependencies: `bun run fetch-models.ts`
- ✅ Outputs valid JSON to `trending-models.json`
- ✅ Includes all 9 models with complete details
- ✅ Handles network errors gracefully
- ✅ Execution time < 5 seconds

### Phase 2: SKILL.md Documentation (Priority: High)

**File to Create:**
2. `skills/openrouter-models/SKILL.md`
   - Clear frontmatter with use cases
   - Instructions for when to invoke this skill
   - Output format documentation
   - Integration examples for agents
   - Troubleshooting guide

**Acceptance Criteria:**
- ✅ Follows existing skill pattern (see `/skills/release/SKILL.md`)
- ✅ Clear description with 3-5 concrete use cases
- ✅ JSON schema documented
- ✅ Example integration code for agents

### Phase 3: Integration (Priority: Medium)

**Files to Update:**
3. Update `plan-reviewer` agent to reference this skill
   - Add skill reference in frontmatter or instructions
   - Update model selection logic to use dynamic data
   - Document when to refresh model data

**Acceptance Criteria:**
- ✅ Plan reviewer can invoke skill to get current models
- ✅ Model recommendations stay up-to-date
- ✅ Graceful fallback to hardcoded models if skill fails

### Phase 4: Automation (Priority: Low)

**Optional Enhancement:**
4. Add GitHub Action to auto-update weekly
   - Cron job runs `bun run fetch-models.ts` weekly
   - Commits updated `trending-models.json` to repo
   - Creates PR for review

**Acceptance Criteria:**
- ✅ Weekly updates automated
- ✅ Human review before merge
- ✅ Notifications on failures

---

## Technical Specifications

### Script Requirements

**Language:** TypeScript
**Runtime:** Bun (v1.0+)
**Dependencies:** None (use built-in APIs only)

**External APIs Used:**
1. OpenRouter Rankings Page (public HTML)
2. OpenRouter Models API (public, no auth required)

**Network Requirements:**
- Internet connection
- Access to `openrouter.ai` domain
- HTTPS support

**File System:**
- Write permission in skill directory
- Read/write permission for output file

### Data Validation

**Input Validation:**
```typescript
// Validate rankings data structure
function validateRankings(data: any): data is { data: RankingData[] } {
  return (
    data &&
    Array.isArray(data.data) &&
    data.data.length > 0 &&
    typeof data.data[0].x === "string" &&
    typeof data.data[0].ys === "object"
  );
}

// Validate model details
function validateModelDetails(data: any): data is ModelDetails {
  return (
    data &&
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    typeof data.context_length === "number" &&
    data.pricing &&
    typeof data.pricing.prompt === "string" &&
    typeof data.pricing.completion === "string"
  );
}
```

**Output Validation:**
- All 9 models have complete data
- Token usage values are positive integers
- Context lengths are reasonable (> 0, < 1M)
- Pricing values are positive numbers
- Dates are valid ISO 8601 format

### Performance Targets

**Execution Time:**
- Fetch rankings: < 1 second
- Fetch model details (9 parallel requests): < 2 seconds
- Total execution: < 5 seconds

**Optimization Strategies:**
1. **Parallel API calls** - Use `Promise.all()` for model details
2. **Early validation** - Fail fast on invalid data
3. **Minimal parsing** - Regex is faster than DOM parsing
4. **Caching** - Save output to file, agents can reuse

**Memory Usage:**
- Target: < 50MB
- JSON output size: ~5-10KB
- Network buffers: ~100KB per request

---

## Use Cases

### 1. Plan Reviewer Agent - Dynamic Model Selection

**Scenario:** User requests architecture plan review with external AI

**Before (Hardcoded):**
```markdown
**Top Recommended Models:**
- x-ai/grok-code-fast-1
- openai/gpt-5-codex
- minimax/minimax-m2
```

**After (Dynamic):**
```markdown
**Current Trending Models (Week of Nov 10, 2025):**
1. x-ai/grok-code-fast-1 (131K context, $0.50/1M tokens)
2. anthropic/claude-4.5-sonnet-20250929 (200K context, $3.00/1M tokens)
3. google/gemini-2.5-flash (1M context, $0.075/1M tokens)
```

**Agent Logic:**
```typescript
// In plan-reviewer agent
if (needsModelRecommendations) {
  // Check if trending-models.json exists and is recent (< 7 days)
  const modelsPath = "/skills/openrouter-models/trending-models.json";
  const modelsData = await readJSON(modelsPath);

  if (isStale(modelsData.metadata.fetchedAt)) {
    // Run skill to refresh
    await Bash("cd /skills/openrouter-models && bun run fetch-models.ts");
    modelsData = await readJSON(modelsPath);
  }

  // Use top 3-5 models for recommendations
  const topModels = modelsData.models.slice(0, 5);
  // Present to user with pricing and context info
}
```

### 2. Developer Research - Model Comparison

**Scenario:** Developer wants to choose best model for coding task

**Usage:**
```bash
cd /skills/openrouter-models
bun run fetch-models.ts
cat trending-models.json | jq '.models[] | {rank, id, contextLength, pricing}'
```

**Output:**
```json
{
  "rank": 1,
  "id": "x-ai/grok-code-fast-1",
  "contextLength": 131072,
  "pricing": {
    "promptPer1M": 0.50,
    "completionPer1M": 1.00
  }
}
// ... more models
```

### 3. Plugin Documentation - Auto-Update Model Lists

**Scenario:** Update plugin README with current trending models

**Automation:**
```typescript
// In documentation update script
const models = await fetchTrendingModels();

const markdown = `
## Recommended Models (Updated ${models.metadata.weekEnding})

${models.models.slice(0, 5).map((m, i) =>
  `${i + 1}. **${m.name}** (\`${m.id}\`)
   - Context: ${m.contextLength.toLocaleString()} tokens
   - Pricing: $${m.pricing.promptPer1M}/1M input, $${m.pricing.completionPer1M}/1M output
`).join('\n')}
`;

// Write to README.md
```

### 4. Cost Optimization - Find Cheapest Quality Models

**Scenario:** User wants high-quality models at lowest cost

**Analysis:**
```typescript
const models = await fetchTrendingModels();

// Filter by context length (need > 100K)
const largeCon text = models.models.filter(m => m.contextLength > 100000);

// Sort by price (ascending)
const cheapest = largeContext.sort((a, b) =>
  a.pricing.promptPer1M - b.pricing.promptPer1M
);

console.log("Best value models (>100K context):");
cheapest.slice(0, 3).forEach(m => {
  console.log(`- ${m.name}: $${m.pricing.promptPer1M}/1M (${m.contextLength} tokens)`);
});
```

---

## Integration Patterns

### Pattern 1: On-Demand Skill Invocation

**When:** Agent needs fresh model data during execution

```markdown
# In agent instructions

When user requests model recommendations:

1. Check if trending-models.json exists and is recent (< 7 days)
2. If stale or missing, invoke skill:
   ```
   Bash: cd skills/openrouter-models && bun run fetch-models.ts
   ```
3. Read trending-models.json
4. Present top 5 models with context and pricing
5. Let user select preferred model
```

### Pattern 2: Pre-Cached Data

**When:** Multiple agents need model data, avoid redundant fetches

```markdown
# Setup (run once per week)
cd skills/openrouter-models
bun run fetch-models.ts

# Agent usage (read cached data)
Read: skills/openrouter-models/trending-models.json
Use models array for recommendations
```

### Pattern 3: Background Refresh

**When:** Keep data fresh without blocking agent workflow

```markdown
# In command orchestrator

PHASE 0.5: Data Preparation (parallel, non-blocking)
- Launch background task: Bash("cd skills/openrouter-models && bun run fetch-models.ts", run_in_background: true)
- Continue with PHASE 1 immediately

PHASE 1.5: Model Selection
- Read trending-models.json (should be ready by now)
- If still processing, use last known good data
```

---

## Troubleshooting

### Issue 1: Failed to Fetch Rankings

**Symptom:**
```
Error: Failed to fetch rankings: fetch failed
```

**Causes:**
- Network connectivity issue
- OpenRouter site down or changed URL
- Firewall blocking openrouter.ai

**Solutions:**
1. Check internet connection: `curl https://openrouter.ai/rankings`
2. Verify URL hasn't changed (check openrouter.ai/rankings in browser)
3. Check firewall/proxy settings
4. Use cached data as fallback

### Issue 2: Parse Error (RSC Format Changed)

**Symptom:**
```
Error: Cannot parse rankings data: regex match failed
```

**Cause:** OpenRouter changed their page structure or RSC format

**Solutions:**
1. Inspect page HTML: `curl "https://openrouter.ai/rankings?category=programming&view=trending&_rsc=2nz0s" | head -100`
2. Update regex pattern in `fetchRankings()` function
3. Consider alternative parsing strategy (DOM parser)
4. Report issue to skill maintainer

### Issue 3: Model Details Not Found

**Symptom:**
```
Warning: Failed to fetch details for x-ai/grok-code-fast-1, using defaults
```

**Cause:** Model not available in OpenRouter API or ID mismatch

**Solutions:**
1. Verify model ID exists: `curl "https://openrouter.ai/api/v1/models" | jq '.data[] | select(.id == "x-ai/grok-code-fast-1")'`
2. Use fallback values (0 context, 0 pricing) - indicates data gap
3. Check if model was recently added/removed
4. Manual correction in trending-models.json if needed

### Issue 4: Stale Data

**Symptom:** Trending models seem outdated

**Cause:** Script hasn't been run recently

**Solutions:**
1. Check last fetch: `jq '.metadata.fetchedAt' trending-models.json`
2. Re-run script: `bun run fetch-models.ts`
3. Set up weekly cron job or GitHub Action
4. Add staleness warning in agent output

---

## Security Considerations

### Data Privacy
- ✅ **No authentication required** - Public APIs only
- ✅ **No sensitive data** - Model IDs and pricing are public
- ✅ **No user data collected** - Skill doesn't track usage

### Network Security
- ✅ **HTTPS only** - All requests use secure connections
- ⚠️ **No certificate pinning** - Trusts system CA store
- ✅ **No arbitrary code execution** - Only parses JSON/text data

### File System Security
- ✅ **Writes to skill directory only** - No arbitrary file access
- ✅ **No executable files created** - Only JSON output
- ⚠️ **No input sanitization needed** - No user input processed

### Dependency Security
- ✅ **Zero external dependencies** - No npm packages
- ✅ **Bun built-in APIs only** - Maintained by Bun team
- ✅ **No eval() or similar** - Secure parsing only

---

## Maintenance

### Update Frequency

**Recommended:** Weekly
**Minimum:** Monthly
**Automated:** Optional (GitHub Action)

**Staleness Indicators:**
- `fetchedAt` > 7 days old → Yellow (suggest refresh)
- `fetchedAt` > 14 days old → Orange (data may be outdated)
- `fetchedAt` > 30 days old → Red (definitely stale)

### Breaking Changes to Monitor

1. **OpenRouter Rankings Page:**
   - URL changes
   - RSC format changes
   - Data structure changes

2. **OpenRouter Models API:**
   - Endpoint changes
   - Schema changes
   - Authentication requirements added

3. **Bun Runtime:**
   - Built-in API changes
   - TypeScript compatibility

**Monitoring Strategy:**
- Test script monthly: `bun run fetch-models.ts`
- Validate output schema: `jq '.models | length' trending-models.json` (should be 9)
- Check for errors: `bun run fetch-models.ts 2>&1 | grep -i error`

### Version History

Track changes in SKILL.md:

```markdown
## Changelog

### v1.0.0 (2025-11-14)
- Initial release
- Fetch top 9 trending programming models
- Include context length and pricing
- Zero dependencies implementation

### v1.1.0 (TBD)
- Add filtering by provider
- Support custom category (not just programming)
- Cache model details to reduce API calls
```

---

## Future Enhancements

### Priority: Medium
1. **Category Selection** - Support other categories (creative, analysis, etc.)
2. **Historical Trends** - Track ranking changes over time
3. **Provider Filtering** - Focus on specific providers (Anthropic, OpenAI, etc.)
4. **Cost Calculator** - Estimate cost for typical workflows

### Priority: Low
5. **Web Dashboard** - Visual ranking trends (HTML export)
6. **Alerts** - Notify when new models enter top 9
7. **Comparison Tool** - Side-by-side model comparison
8. **Benchmarks Integration** - Pull performance data from LiveBench/LMSYS

### Research Ideas
- Correlate rankings with model quality (accuracy, speed)
- Identify "best value" models (performance / price ratio)
- Predict upcoming trending models
- Multi-category analysis (programming + reasoning)

---

## Summary

This skill design provides:

✅ **Dynamic model discovery** - No more hardcoded model lists
✅ **Data-driven recommendations** - Based on actual usage trends
✅ **Zero dependencies** - Pure Bun TypeScript with built-in APIs
✅ **Cross-plugin utility** - Shareable across all plugins
✅ **Rich metadata** - Context, pricing, usage statistics
✅ **Easy integration** - Simple JSON output, CLI executable
✅ **Maintainable** - Clear error handling, validation, troubleshooting

**Next Steps:**
1. Implement `fetch-models.ts` script
2. Write `SKILL.md` documentation
3. Test with real data
4. Integrate with `plan-reviewer` agent
5. Set up weekly refresh (manual or automated)

**Success Metrics:**
- Script executes in < 5 seconds
- Outputs valid JSON with 9 models
- Agents successfully use data for model recommendations
- Data stays fresh (< 7 days old)
- Zero maintenance required after initial setup

---

**Design Date:** November 14, 2025
**Status:** Ready for Implementation
**Estimated Implementation Time:** 2-3 hours
**Dependencies:** Bun runtime, internet connection
