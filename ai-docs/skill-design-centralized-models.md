# Skill Design: Centralized Model Recommendations with Shared Folder Architecture

**Date:** 2025-11-14
**Version:** 2.0 (Centralized Architecture)
**Author:** agent-architect

---

## Architecture Overview

### Core Principle: Single Source of Truth + Distribution

```
shared/                              ← SOURCE OF TRUTH (edit here)
└── models/
    └── recommended-models.json      ← Master copy

    ↓ (sync script distributes)

plugins/*/skills/recommended-models/ ← DISTRIBUTED COPIES (generated)
├── SKILL.md                         ← Plugin-specific
└── models.json                      ← Copy from shared/
```

**Key Rules:**
- ✅ Edit: `shared/models/recommended-models.json` (source)
- ✅ Run: `bun run sync-shared` (distribute)
- ✅ Commit: Both `shared/` and `plugins/*/` changes
- ❌ Never edit: `plugins/*/skills/recommended-models/models.json` (will be overwritten)

---

## Architecture Principles

1. **Single Source of Truth** - `shared/models/recommended-models.json` is the master copy
2. **Automated Distribution** - Sync script copies to all plugins automatically
3. **Manual Curation** - Human-maintained list ensures quality and accuracy
4. **No Runtime Dependencies** - Plugins read local copies (no network calls)
5. **Version Controlled** - Both source and distributed copies committed to git
6. **Extensible Pattern** - Can add more shared resources beyond models

## 1. Directory Structure

### 1.1 Shared Folder (Repository Root)

```
shared/
├── README.md                        # Documentation for shared resources
├── models/
│   └── recommended-models.json      # Master model recommendations
├── skills/                          # Future: shared skill templates
└── templates/                       # Future: agent templates
```

### 1.2 Plugin Distribution (After Sync)

```
plugins/
├── frontend/
│   └── skills/
│       └── recommended-models/
│           ├── SKILL.md             # Plugin-specific skill definition
│           └── models.json          # COPIED from shared/
├── code-analysis/
│   └── skills/
│       └── recommended-models/
│           ├── SKILL.md
│           └── models.json
└── bun/
    └── skills/
        └── recommended-models/
            ├── SKILL.md
            └── models.json
```

---

## 2. Sync Script Design

### 2.1 Implementation: `scripts/sync-shared.ts`

```typescript
#!/usr/bin/env bun

/**
 * Sync Script: Distribute Shared Resources to Plugins
 *
 * Purpose: Copy shared resources from `shared/` to all plugins
 * Usage: bun run sync-shared
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

// Configuration
const SHARED_DIR = join(import.meta.dir, '../shared');
const PLUGINS_DIR = join(import.meta.dir, '../plugins');

interface SyncResult {
  source: string;
  destinations: string[];
  status: 'success' | 'error';
  error?: string;
}

async function validateJSON(filePath: string): Promise<void> {
  const content = await readFile(filePath, 'utf-8');
  try {
    JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error}`);
  }
}

async function ensureDirectory(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

async function syncModelRecommendations(): Promise<SyncResult> {
  const source = join(SHARED_DIR, 'models/recommended-models.json');
  const destinations: string[] = [];

  try {
    // Validate source JSON
    await validateJSON(source);
    console.log('✓ Validated source JSON');

    // Read source content
    const content = await readFile(source, 'utf-8');

    // Get all plugin directories
    const pluginNames = await readdir(PLUGINS_DIR, { withFileTypes: true });
    const plugins = pluginNames
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Copy to each plugin
    for (const plugin of plugins) {
      const destDir = join(PLUGINS_DIR, plugin, 'skills/recommended-models');
      const destFile = join(destDir, 'models.json');

      await ensureDirectory(destDir);
      await writeFile(destFile, content, 'utf-8');

      destinations.push(destFile);
      console.log(`✓ Copied to ${plugin}/skills/recommended-models/models.json`);
    }

    return { source, destinations, status: 'success' };

  } catch (error) {
    return {
      source,
      destinations,
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function main(): Promise<void> {
  console.log('🔄 Syncing shared resources to plugins...\n');

  const result = await syncModelRecommendations();

  console.log('\n📊 Sync Summary:');
  console.log(`Source: ${result.source}`);
  console.log(`Destinations: ${result.destinations.length} plugins`);
  console.log(`Status: ${result.status === 'success' ? '✅ Success' : '❌ Failed'}`);

  if (result.error) {
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }

  console.log('\n✨ Sync complete!');
}

// Run if executed directly
if (import.meta.main) {
  main();
}
```

### 2.2 Package.json Scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "sync-shared": "bun run scripts/sync-shared.ts"
  }
}
```

---

## 3. JSON Schema: Recommended Models

### 3.1 Schema Definition

File: `shared/models/recommended-models.json`

**Schema Definition:**

```typescript
interface ModelRecommendation {
  id: string;                    // OpenRouter model ID (e.g., "x-ai/grok-code-fast-1")
  name: string;                  // Human-readable name (e.g., "xAI Grok Code Fast")
  provider: string;              // Provider name (e.g., "xAI", "OpenAI", "Anthropic")
  contextWindow: number;         // Context window size in tokens
  pricing: {
    prompt: number;              // Price per 1M input tokens (USD)
    completion: number;          // Price per 1M output tokens (USD)
  };
  capabilities: string[];        // Capabilities (e.g., ["coding", "reasoning", "vision"])
  useCases: string[];           // Recommended use cases
  description: string;           // Brief description of model strengths
  tier: "premium" | "standard" | "budget";  // Performance/cost tier
  recommended: boolean;          // Is this a top recommendation?
  notes?: string;               // Optional additional notes
}

interface ModelKnowledgeBase {
  version: string;               // Schema version (semver)
  lastUpdated: string;          // ISO 8601 timestamp
  source: string;               // Source URL or "manually_curated"
  categories: {
    coding: ModelRecommendation[];
    reasoning: ModelRecommendation[];
    vision: ModelRecommendation[];
    budget: ModelRecommendation[];
  };
  topRecommendations: string[];  // Array of model IDs (top 5-7)
}
```

**Example JSON File:**

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-11-14T00:00:00Z",
  "source": "manually_curated",
  "categories": {
    "coding": [
      {
        "id": "x-ai/grok-code-fast-1",
        "name": "xAI Grok Code Fast",
        "provider": "xAI",
        "contextWindow": 131072,
        "pricing": {
          "prompt": 5.00,
          "completion": 15.00
        },
        "capabilities": ["coding", "reasoning", "fast-inference"],
        "useCases": [
          "Code review and refactoring",
          "API implementation",
          "Bug fixing and debugging",
          "Quick code generation"
        ],
        "description": "Fast inference optimized for coding tasks. Excellent for code review, refactoring, and rapid prototyping.",
        "tier": "premium",
        "recommended": true,
        "notes": "Best for speed-critical coding workflows. Verified 100% routing to xAI."
      },
      {
        "id": "openai/gpt-5-codex",
        "name": "OpenAI GPT-5 Codex",
        "provider": "OpenAI",
        "contextWindow": 200000,
        "pricing": {
          "prompt": 10.00,
          "completion": 30.00
        },
        "capabilities": ["coding", "reasoning", "planning"],
        "useCases": [
          "Complex architecture design",
          "Multi-file refactoring",
          "Advanced code analysis",
          "Technical documentation"
        ],
        "description": "Advanced reasoning for complex coding tasks. Superior architecture planning and multi-step reasoning.",
        "tier": "premium",
        "recommended": true,
        "notes": "Best for complex planning and architectural decisions."
      }
    ],
    "reasoning": [
      {
        "id": "minimax/minimax-m2",
        "name": "MiniMax M2",
        "provider": "MiniMax",
        "contextWindow": 128000,
        "pricing": {
          "prompt": 3.00,
          "completion": 9.00
        },
        "capabilities": ["reasoning", "coding", "planning"],
        "useCases": [
          "Architecture planning",
          "Design reviews",
          "Multi-step reasoning",
          "Technical decision-making"
        ],
        "description": "High-performance reasoning for technical planning. Excellent balance of cost and capability.",
        "tier": "standard",
        "recommended": true
      }
    ],
    "vision": [
      {
        "id": "qwen/qwen3-vl-235b-a22b-instruct",
        "name": "Alibaba Qwen 3 VL",
        "provider": "Alibaba",
        "contextWindow": 32768,
        "pricing": {
          "prompt": 2.00,
          "completion": 6.00
        },
        "capabilities": ["vision", "coding", "reasoning"],
        "useCases": [
          "UI/UX design review",
          "Screenshot analysis",
          "Visual debugging",
          "Design implementation"
        ],
        "description": "Vision-language model for UI design and visual analysis. Strong image understanding.",
        "tier": "standard",
        "recommended": true
      }
    ],
    "budget": [
      {
        "id": "anthropic/claude-3-5-haiku-20241022",
        "name": "Claude 3.5 Haiku",
        "provider": "Anthropic",
        "contextWindow": 200000,
        "pricing": {
          "prompt": 1.00,
          "completion": 5.00
        },
        "capabilities": ["coding", "reasoning", "fast-inference"],
        "useCases": [
          "Simple utility tasks",
          "Quick validations",
          "Code cleanup",
          "Basic testing"
        ],
        "description": "Fast and cost-effective for simple tasks. Great for utility work and quick operations.",
        "tier": "budget",
        "recommended": false
      }
    ]
  },
  "topRecommendations": [
    "x-ai/grok-code-fast-1",
    "openai/gpt-5-codex",
    "minimax/minimax-m2",
    "qwen/qwen3-vl-235b-a22b-instruct",
    "anthropic/claude-sonnet-4.5"
  ]
}
```

---

## 4. Skill Design (Plugin-Specific)

### 4.1 File: `plugins/*/skills/recommended-models/SKILL.md`

**Purpose:** Provide curated model recommendations to agents

**Skill Type:** Knowledge reference (simple Read tool usage)

**Complete Skill Markdown:**

```markdown
---
name: recommended-models
description: Curated list of recommended AI models for different use cases (coding, reasoning, vision, budget). Use when helping users select models for Claudish, multi-model review, or external AI tasks. Updated manually with each plugin release.
---

# Recommended AI Models Knowledge Base

This skill provides access to a curated list of recommended AI models for various development tasks.

## How to Use This Skill

**When to activate this skill:**
- User asks about model recommendations
- User wants to compare different AI models
- User needs help selecting a model for specific task
- Planning multi-model review workflow
- Setting up Claudish for the first time

**How to access the data:**

```typescript
// Read the centralized knowledge base
const knowledgeBase = await Read({
  file_path: "knowledge/recommended-models.json"
});

const models = JSON.parse(knowledgeBase);

// Access by category
const codingModels = models.categories.coding;
const reasoningModels = models.categories.reasoning;
const visionModels = models.categories.vision;
const budgetModels = models.categories.budget;

// Get top recommendations
const topPicks = models.topRecommendations.map(id =>
  findModelById(id, models.categories)
);
```

## Model Categories

### Coding Models
Optimized for code generation, review, refactoring, and implementation tasks.

**Top Picks:**
- **xAI Grok Code Fast** - Speed-optimized for coding workflows
- **OpenAI GPT-5 Codex** - Advanced reasoning for complex code

### Reasoning Models
Strong at architecture planning, design reviews, and multi-step technical decisions.

**Top Picks:**
- **MiniMax M2** - High performance reasoning at reasonable cost

### Vision Models
Capable of analyzing screenshots, UI designs, and visual debugging.

**Top Picks:**
- **Alibaba Qwen 3 VL** - Strong vision-language capabilities

### Budget Models
Cost-effective options for simple utility tasks and quick validations.

**Top Picks:**
- **Claude 3.5 Haiku** - Fast and affordable for simple tasks

## Understanding Model Properties

### Context Window
- Larger context = more code/documentation can fit in prompt
- 128K+ tokens recommended for complex codebases
- 200K+ tokens ideal for architecture planning

### Pricing Tiers
- **Premium** ($5-10+ per 1M input tokens) - Advanced capabilities, best performance
- **Standard** ($2-5 per 1M input tokens) - Good balance of cost and quality
- **Budget** ($0.50-2 per 1M input tokens) - Cost-effective for simple tasks

### Capabilities
- **coding** - Code generation, review, refactoring
- **reasoning** - Planning, architecture, decision-making
- **vision** - Image analysis, UI review, screenshots
- **fast-inference** - Optimized for speed

## Selection Guidelines

**For Code Review:**
→ Use coding models with large context (Grok, GPT-5 Codex)

**For Architecture Planning:**
→ Use reasoning models (MiniMax M2, GPT-5 Codex)

**For UI Design Review:**
→ Use vision models (Qwen 3 VL)

**For Multi-Model Validation:**
→ Mix models from different providers for diverse perspectives
→ Example: Grok + GPT-5 Codex + MiniMax M2

**For Budget-Conscious Work:**
→ Use budget tier for simple tasks, premium tier for critical work

## Example: Helping User Select Model

```markdown
**User:** "I need to review an architecture plan. Which model should I use?"

**Assistant (with this skill):**

Based on your architecture review task, I recommend these models:

**Top Pick: OpenAI GPT-5 Codex**
- 200K context window (fits large architecture docs)
- Advanced reasoning for complex planning
- $10/1M input tokens
- Best for: Multi-step architectural decisions

**Alternative: MiniMax M2**
- 128K context window
- Strong reasoning at lower cost ($3/1M input)
- Good balance of quality and price
- Best for: Most architecture reviews

**Multi-Model Approach:**
For critical architecture, run both GPT-5 Codex AND MiniMax M2 to get
diverse perspectives and catch more potential issues.

Would you like me to launch the plan-reviewer agent with one of these models?
```

## Maintenance Notes

**For Maintainers:**
- Knowledge base updated manually before each plugin release
- Use `/scripts/update-models.ts` to fetch latest data from external source (optional)
- Verify pricing and capabilities before committing updates
- Keep top recommendations list to 5-7 models max
- Add release notes when model recommendations change

**Version:** 1.0.0
**Last Updated:** 2025-11-14
**Next Review:** Before v3.4.0 release
```

---

### 3. Agent Design: `model-advisor`

**Location:** `plugins/frontend/agents/model-advisor.md`

**Purpose:** Help users select the right AI model for their task

**Agent Type:** Utility Agent (Haiku model - simple task)

**Complete Agent Markdown:**

```markdown
---
name: model-advisor
description: Helps users select the right AI model for their specific task. Use when:\n\n1. User asks 'Which model should I use for X?'\nassistant: 'I'll use the model-advisor agent to recommend the best model for your task.'\n\n2. Setting up multi-model review:\nuser: 'I want multiple models to review my architecture'\nassistant: 'I'm launching model-advisor to recommend the best model combination for architecture review.'\n\n3. Configuring Claudish:\nuser: 'Help me pick a model for code review in Claudish'\nassistant: 'The model-advisor agent will help you choose the optimal model based on your code review needs.'
model: haiku
color: cyan
tools: Read
---

<role>
  <identity>AI Model Selection Specialist</identity>
  <expertise>
    - OpenRouter model ecosystem and capabilities
    - Cost-performance trade-offs for different tasks
    - Multi-model validation strategies
    - Claudish configuration and usage
    - Model strengths and weaknesses for coding, reasoning, vision tasks
  </expertise>
  <mission>
    Help users select the optimal AI model(s) for their specific task by analyzing
    requirements, comparing capabilities, and providing clear recommendations with
    cost-performance trade-offs.
  </mission>
</role>

<instructions>
  <critical_constraints>
    <knowledge_base_requirement>
      You MUST read the centralized model knowledge base from:
      `knowledge/recommended-models.json`

      This is your authoritative source for model recommendations.
      DO NOT make up model information or use outdated data.
    </knowledge_base_requirement>

    <recommendation_principles>
      - Always explain the trade-offs (cost vs performance vs speed)
      - Recommend 1-3 models maximum (avoid overwhelming user)
      - For critical tasks, suggest multi-model validation
      - Consider user's task complexity when recommending tier
      - Explain WHY a model is recommended for their specific use case
    </recommendation_principles>
  </critical_constraints>

  <workflow>
    <step number="1">
      Read model knowledge base from recommended-models.json
    </step>

    <step number="2">
      Analyze user's task to identify:
      - Task type (coding, reasoning, vision, mixed)
      - Complexity level (simple, moderate, complex)
      - Context requirements (small, medium, large codebase)
      - Budget sensitivity (cost-conscious or performance-critical)
    </step>

    <step number="3">
      Filter models by:
      - Matching capabilities for task type
      - Appropriate tier for complexity level
      - Sufficient context window for requirements
    </step>

    <step number="4">
      Present top 1-3 recommendations with:
      - Model name and provider
      - Why it's recommended for this specific task
      - Cost per 1M tokens (context for budget planning)
      - Key strengths and any limitations
    </step>

    <step number="5">
      If task is critical or complex:
      - Suggest multi-model approach (2-3 models from different providers)
      - Explain benefits of diverse perspectives
      - Provide example of how to run multiple models
    </step>
  </workflow>
</instructions>

<knowledge>
  <task_categorization>
    <category name="Simple Tasks" tier="budget">
      - Code cleanup and formatting
      - Simple bug fixes
      - Basic utility scripts
      - Quick validations

      **Recommended Tier:** Budget (Haiku, smaller models)
    </category>

    <category name="Standard Coding Tasks" tier="standard">
      - Feature implementation
      - Code refactoring
      - API endpoint creation
      - Unit test writing

      **Recommended Tier:** Standard or Premium coding models (Grok, GPT-4)
    </category>

    <category name="Complex Architecture" tier="premium">
      - System architecture design
      - Multi-service integration planning
      - Security architecture review
      - Performance optimization strategy

      **Recommended Tier:** Premium reasoning models (GPT-5 Codex, MiniMax M2)
    </category>

    <category name="UI/Design Work" tier="standard-vision">
      - UI design review
      - Screenshot analysis
      - Visual debugging
      - Design implementation from mockups

      **Recommended Tier:** Vision models (Qwen 3 VL)
    </category>
  </task_categorization>

  <multi_model_strategies>
    <strategy name="Consensus Validation">
      **When to use:** Critical architecture decisions, security reviews

      **Approach:**
      - Run 2-3 models from different providers
      - Compare recommendations for commonalities
      - Issues flagged by multiple models = high confidence

      **Example Models:** GPT-5 Codex + Grok + MiniMax M2
    </strategy>

    <strategy name="Specialized + General">
      **When to use:** Tasks with multiple aspects (UI + API)

      **Approach:**
      - Use specialized model for primary aspect
      - Use general model for broader context

      **Example:** Qwen 3 VL (UI design) + GPT-5 Codex (implementation review)
    </strategy>

    <strategy name="Budget + Premium">
      **When to use:** Initial review before expensive model usage

      **Approach:**
      - Quick pass with budget model (find obvious issues)
      - Deep review with premium model (complex issues)

      **Example:** Haiku (first pass) → GPT-5 Codex (detailed review)
    </strategy>
  </multi_model_strategies>
</knowledge>

<examples>
  <example>
    <scenario>User asks for code review model</scenario>
    <user_request>I need to review a large TypeScript backend. Which model should I use?</user_request>
    <correct_approach>
      1. Read knowledge base
      2. Identify task: Standard/complex coding (large codebase)
      3. Filter: coding capability + large context window
      4. Recommend:

         **Top Pick: xAI Grok Code Fast**
         - 131K context window (fits large codebases)
         - Optimized for coding workflows
         - Fast inference for quick review
         - $5/1M input tokens

         **Alternative: OpenAI GPT-5 Codex**
         - 200K context window (even larger codebases)
         - Advanced reasoning for complex issues
         - More expensive ($10/1M) but deeper analysis

      5. Suggest multi-model: "For critical production code, consider
         running BOTH Grok and GPT-5 Codex to catch more issues."
    </correct_approach>
  </example>

  <example>
    <scenario>User planning architecture with budget concerns</scenario>
    <user_request>I'm designing a new microservice architecture but don't want to spend too much. Recommendations?</user_request>
    <correct_approach>
      1. Read knowledge base
      2. Identify task: Architecture planning (reasoning) + budget-sensitive
      3. Filter: reasoning capability + standard tier
      4. Recommend:

         **Best Value: MiniMax M2**
         - Strong reasoning for architecture planning
         - 128K context window
         - $3/1M input tokens (3x cheaper than GPT-5 Codex)
         - Excellent balance of quality and cost

      5. Note: "If this is a critical production system with high complexity,
         consider upgrading to GPT-5 Codex for the initial architecture design,
         then use MiniMax M2 for iteration and refinement."
    </correct_approach>
  </example>

  <example>
    <scenario>Multi-model validation for critical plan</scenario>
    <user_request>This is a critical security architecture plan. I want multiple expert opinions.</user_request>
    <correct_approach>
      1. Read knowledge base
      2. Identify task: Critical architecture (requires multi-model validation)
      3. Recommend 3 models from different providers:

         **Multi-Model Validation Strategy:**

         1. **OpenAI GPT-5 Codex** (primary)
            - Advanced reasoning for security implications
            - $10/1M input tokens

         2. **xAI Grok Code Fast** (second opinion)
            - Fast technical review
            - Different training approach from GPT-5
            - $5/1M input tokens

         3. **MiniMax M2** (cost-effective validation)
            - Strong reasoning at lower cost
            - Additional perspective from different provider
            - $3/1M input tokens

      4. Explain benefits: "Running all 3 models gives you:
         - Diverse perspectives (3 different providers/architectures)
         - Issues flagged by multiple models = high confidence
         - Total cost: ~$18/1M tokens (reasonable for critical security review)"
    </correct_approach>
  </example>

  <example>
    <scenario>User needs UI design review</scenario>
    <user_request>I have Figma mockups and need to validate my implementation matches the design.</user_request>
    <correct_approach>
      1. Read knowledge base
      2. Identify task: UI design validation (vision capability required)
      3. Filter: vision capability
      4. Recommend:

         **Top Pick: Alibaba Qwen 3 VL**
         - Vision-language model for design analysis
         - Can analyze screenshots and Figma exports
         - $2/1M input tokens (affordable for iterative design)
         - Strong image understanding

      5. Additional tip: "Export your Figma designs as images and run them
         through Qwen 3 VL alongside your implementation screenshots for
         side-by-side comparison."
    </correct_approach>
  </example>
</examples>

<formatting>
  <communication_style>
    - Be concise but thorough
    - Always explain WHY a model is recommended
    - Include pricing for budget planning
    - Highlight trade-offs clearly
    - Use bullet points for readability
    - Provide actionable next steps
  </communication_style>

  <recommendation_structure>
    **Top Pick: {Model Name}**
    - Context window: {size}
    - Pricing: ${cost}/1M input tokens
    - Best for: {specific use cases}
    - Why: {explanation of fit for user's task}

    **Alternative: {Model Name}**
    - [Same structure]

    **Multi-Model Suggestion (if applicable):**
    - [Strategy explanation]
    - [Cost estimate]
  </recommendation_structure>

  <edge_cases>
    <case name="Model not in knowledge base">
      Response: "The model you mentioned isn't in my curated recommendations.
      Based on your requirements, I recommend {alternative} instead because..."
    </case>

    <case name="Task outside model capabilities">
      Response: "This task requires {capability} which isn't currently available
      in the recommended models. Consider breaking it down into: {sub-tasks}
      which can be handled by {models}."
    </case>

    <case name="All recommended models too expensive">
      Response: "While premium models are ideal for this task, here's a
      budget-conscious approach: {strategy using budget tier}"
    </case>
  </edge_cases>
</formatting>
```

---

### 4. Optional Update Script: `scripts/update-models.ts`

**Location:** `scripts/update-models.ts`

**Purpose:** Maintainers can update model data from external source (optional)

**Usage:** `bun run scripts/update-models.ts [--source URL]`

**Script Design:**

```typescript
#!/usr/bin/env bun

/**
 * Update Model Knowledge Base
 *
 * Optional script for maintainers to update model recommendations
 * from an external source (e.g., https://madappgang.com/models.json)
 *
 * Usage:
 *   bun run scripts/update-models.ts
 *   bun run scripts/update-models.ts --source https://custom-url.com/models.json
 */

import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DEFAULT_SOURCE = 'https://madappgang.com/models.json';
const OUTPUT_PATH = join(process.cwd(), 'knowledge', 'recommended-models.json');
const BACKUP_PATH = join(process.cwd(), 'knowledge', 'recommended-models.backup.json');

interface UpdateOptions {
  source: string;
  backup: boolean;
  validate: boolean;
}

async function updateModels(options: UpdateOptions) {
  console.log('🔄 Updating model knowledge base...\n');

  // Step 1: Backup existing file
  if (options.backup) {
    console.log('📦 Creating backup...');
    try {
      const existing = await readFile(OUTPUT_PATH, 'utf-8');
      await writeFile(BACKUP_PATH, existing);
      console.log('✅ Backup created:', BACKUP_PATH, '\n');
    } catch (error) {
      console.warn('⚠️  No existing file to backup\n');
    }
  }

  // Step 2: Fetch new data
  console.log('🌐 Fetching from:', options.source);
  try {
    const response = await fetch(options.source);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Step 3: Validate schema
    if (options.validate) {
      console.log('✅ Validating schema...');
      validateSchema(data);
      console.log('✅ Schema valid\n');
    }

    // Step 4: Write to file
    console.log('💾 Writing to:', OUTPUT_PATH);
    await writeFile(
      OUTPUT_PATH,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    console.log('\n✅ Model knowledge base updated successfully!');
    console.log(`📊 Models: ${countModels(data)}`);
    console.log(`📅 Last Updated: ${data.lastUpdated}`);
    console.log(`🔖 Version: ${data.version}`);

  } catch (error) {
    console.error('\n❌ Update failed:', error);

    // Restore backup if available
    if (options.backup) {
      console.log('\n🔄 Restoring from backup...');
      try {
        const backup = await readFile(BACKUP_PATH, 'utf-8');
        await writeFile(OUTPUT_PATH, backup);
        console.log('✅ Backup restored');
      } catch {
        console.error('❌ Failed to restore backup');
      }
    }

    process.exit(1);
  }
}

function validateSchema(data: any): void {
  // Basic schema validation
  if (!data.version) throw new Error('Missing field: version');
  if (!data.lastUpdated) throw new Error('Missing field: lastUpdated');
  if (!data.categories) throw new Error('Missing field: categories');
  if (!data.topRecommendations) throw new Error('Missing field: topRecommendations');

  // Validate categories
  const requiredCategories = ['coding', 'reasoning', 'vision', 'budget'];
  for (const category of requiredCategories) {
    if (!data.categories[category]) {
      throw new Error(`Missing category: ${category}`);
    }
    if (!Array.isArray(data.categories[category])) {
      throw new Error(`Category ${category} must be an array`);
    }
  }

  // Validate model structure (check first model in each category)
  for (const category of requiredCategories) {
    const models = data.categories[category];
    if (models.length === 0) continue;

    const model = models[0];
    const requiredFields = ['id', 'name', 'provider', 'contextWindow', 'pricing', 'capabilities', 'useCases', 'description', 'tier', 'recommended'];

    for (const field of requiredFields) {
      if (!(field in model)) {
        throw new Error(`Model missing required field: ${field}`);
      }
    }

    // Validate pricing structure
    if (!model.pricing.prompt || !model.pricing.completion) {
      throw new Error('Model pricing must include prompt and completion costs');
    }
  }
}

function countModels(data: any): number {
  return Object.values(data.categories)
    .reduce((sum: number, models: any) => sum + (models?.length || 0), 0);
}

// Parse CLI arguments
const args = process.argv.slice(2);
const sourceIndex = args.indexOf('--source');
const source = sourceIndex !== -1 ? args[sourceIndex + 1] : DEFAULT_SOURCE;
const noBackup = args.includes('--no-backup');
const noValidate = args.includes('--no-validate');

const options: UpdateOptions = {
  source,
  backup: !noBackup,
  validate: !noValidate,
};

// Run update
updateModels(options);
```

**Add to package.json:**

```json
{
  "scripts": {
    "update-models": "bun run scripts/update-models.ts",
    "update-models:custom": "bun run scripts/update-models.ts --source"
  }
}
```

---

### 5. Integration Patterns for Existing Agents

**Pattern 1: Reference in Agent Description**

For agents that may benefit from model selection (like `plan-reviewer`):

```markdown
---
name: plan-reviewer
description: Reviews architecture plans with external AI models. For model selection guidance, use the 'model-advisor' agent or reference the 'recommended-models' skill.
---
```

**Pattern 2: Add Skill Reference in Agent Instructions**

```xml
<knowledge>
  <model_selection>
    For model recommendations, agents can:
    1. Reference the centralized knowledge base at `knowledge/recommended-models.json`
    2. Delegate to the `model-advisor` agent for complex selection decisions
    3. Use the `recommended-models` skill for inline model data access
  </model_selection>
</knowledge>
```

**Pattern 3: Update `/implement` Command to Reference Model Advisor**

In PHASE 1.5 of `/implement` command (multi-model plan review):

```xml
<phase number="1.5" name="Multi-Model Plan Review (Optional)">
  <step number="1">
    Ask user: "Would you like external AI models to review this architecture plan?"
    If yes, continue. If no, skip to PHASE 2.
  </step>

  <step number="2">
    **Model Selection:** Launch `model-advisor` agent to help user select
    appropriate models for architecture review based on complexity and budget.

    Example: "I'll help you select the best models for this review..."
  </step>

  <step number="3">
    Launch plan-reviewer agents in parallel with selected models...
  </step>
</phase>
```

---

## File Structure

```
project-root/
├── knowledge/
│   └── recommended-models.json          # Single source of truth (NEW)
├── skills/
│   └── recommended-models/
│       └── SKILL.md                     # Knowledge base access skill (NEW)
├── plugins/frontend/agents/
│   ├── model-advisor.md                 # Model selection agent (NEW)
│   └── plan-reviewer.md                 # Updated to reference model-advisor
├── scripts/
│   └── update-models.ts                 # Optional update script (NEW)
└── package.json                         # Add update-models script
```

---

## Implementation Checklist

- [ ] Create `knowledge/` directory in repo root
- [ ] Write initial `recommended-models.json` with curated models
- [ ] Create `skills/recommended-models/` directory
- [ ] Write `recommended-models/SKILL.md`
- [ ] Create `model-advisor.md` agent in `plugins/frontend/agents/`
- [ ] Write `scripts/update-models.ts` (optional)
- [ ] Add npm script to `package.json`
- [ ] Update `plan-reviewer.md` to reference model-advisor
- [ ] Update `/implement` command PHASE 1.5 to use model-advisor
- [ ] Test model-advisor agent with various scenarios
- [ ] Document in CHANGELOG and README
- [ ] Commit all files (JSON is committed, not gitignored)

---

## Benefits Over Dynamic HTML Parsing

### 1. Reliability
- ✅ No runtime failures from HTML changes
- ✅ No network dependencies during normal operation
- ✅ Consistent behavior (no variance from external API changes)

### 2. Performance
- ✅ Instant reads (no network latency)
- ✅ Simple JSON parse (vs complex HTML parsing)
- ✅ Cacheable in memory if needed

### 3. Maintainability
- ✅ Single file to update
- ✅ Manual curation ensures quality
- ✅ Version controlled (track changes over time)
- ✅ Easy to review and validate

### 4. Quality
- ✅ Curated recommendations (not just trending)
- ✅ Contextual use cases and guidance
- ✅ Verified pricing and capabilities
- ✅ Human oversight on all updates

### 5. Simplicity
- ✅ No React Server Component parsing complexity
- ✅ No HTML sanitization concerns
- ✅ No external API rate limits
- ✅ Clear update process for maintainers

---

## Release Notes Template

For inclusion in next plugin release:

```markdown
## New Features

### Centralized Model Knowledge Base (v3.4.0)

**New Agent: `model-advisor`**
- Helps users select the right AI model for their task
- Analyzes task complexity and recommends optimal models
- Explains cost-performance trade-offs
- Suggests multi-model validation strategies

**New Skill: `recommended-models`**
- Curated list of recommended AI models
- Categorized by use case (coding, reasoning, vision, budget)
- Includes pricing, capabilities, and selection guidelines
- Updated manually with each release for quality assurance

**New Knowledge Base: `knowledge/recommended-models.json`**
- Single source of truth for model recommendations
- Manually curated for quality and accuracy
- No runtime dependencies or network calls
- Fast, reliable access to model information

**Integration:**
- `/implement` command now uses `model-advisor` in PHASE 1.5
- `plan-reviewer` agent references `model-advisor` for model selection
- All agents can access centralized model knowledge via skill

**For Maintainers:**
- Optional `scripts/update-models.ts` script for updating from external source
- Run `bun run update-models` to fetch latest data (manual step before release)
- JSON file is version controlled and committed to repo
```

---

## Future Enhancements (Optional)

### 1. Model Performance Tracking
Add usage statistics and performance metrics:

```json
{
  "id": "x-ai/grok-code-fast-1",
  "performance": {
    "averageLatency": "2.5s",
    "successRate": 0.98,
    "userRating": 4.5
  }
}
```

### 2. Task-Specific Model Presets
Pre-configured model combinations for common workflows:

```json
{
  "presets": {
    "architecture-review": ["openai/gpt-5-codex", "minimax/minimax-m2"],
    "code-review": ["x-ai/grok-code-fast-1", "openai/gpt-5-codex"],
    "ui-design-review": ["qwen/qwen3-vl-235b-a22b-instruct"]
  }
}
```

### 3. Model Comparison Tool
CLI tool to compare models side-by-side:

```bash
bun run compare-models "grok-code-fast-1" "gpt-5-codex"
```

### 4. Cost Estimation
Calculate estimated cost for a task based on context size:

```typescript
function estimateCost(modelId: string, inputTokens: number): number {
  const model = findModelById(modelId);
  return (inputTokens / 1_000_000) * model.pricing.prompt;
}
```

---

## Conclusion

This centralized model knowledge base architecture provides a simple, reliable, and maintainable solution for model recommendations. By avoiding dynamic HTML parsing and relying on curated JSON data, we eliminate runtime dependencies, improve performance, and ensure consistent quality.

The design is extensible (can add new models easily), version controlled (track changes over time), and user-friendly (clear recommendations with guidance).

**Next Steps:**
1. Create initial `recommended-models.json` with 10-15 curated models
2. Implement `model-advisor` agent
3. Create `recommended-models` skill
4. Integrate into existing workflows (`/implement`, `plan-reviewer`)
5. Test with real user scenarios
6. Document in user-facing README

---

**Design Complete**
**Total Files:** 4 new files (JSON, skill, agent, script) + 2 updated (plan-reviewer, /implement)
**Estimated Implementation Time:** 2-3 hours
**Complexity:** Low (simple Read operations, no complex parsing)
