# Multi-Model Orchestration Pattern - Design Document

**Target Skill:** `shared/skills/claudish-usage/SKILL.md`
**Section Name:** Multi-Model Orchestration Pattern
**Insertion Point:** After line 200 (after Quick Start Guide, before Best Practice: File-Based Sub-Agent Pattern)
**Estimated Length:** 500-600 lines
**Version:** 1.1.0 (Revised based on 4-model review feedback)
**Created:** November 19, 2025
**Revised:** November 19, 2025

## Revision Notes

This design has been reviewed by 4 external AI models (Grok, DeepSeek, Gemini 3 Pro, GPT-5.1) and revised to address:
- **CRITICAL:** Error handling with Promise.allSettled
- **CRITICAL:** Regex escaping errors fixed
- **CRITICAL:** Improved token estimation
- **CRITICAL:** Helper function implementations clarified
- **HIGH:** Timeout patterns added
- **HIGH:** Progress indicators added
- **HIGH:** Pseudocode intent clarified
- **HIGH:** Model capability validation added

---

## 1. Section Overview

### Purpose
Teach AI agents how to orchestrate **parallel execution across multiple AI models** using Claudish CLI to get diverse perspectives, consensus analysis, and comprehensive insights. This pattern is universal - it works with ANY agent type and ANY task that benefits from multiple perspectives.

### Key Differentiators
- **Parallel Execution** - Launch multiple models simultaneously (3-5x speedup)
- **Consensus Analysis** - Identify where models agree (high confidence) and disagree (valuable divergence)
- **Cost Transparency** - Show pricing BEFORE execution, get user approval
- **Universal Pattern** - Works with ANY agent type (architect, reviewer, implementer, tester, etc.)
- **Critical Mapping** - Friendly names → Model IDs (user sees names, claudish needs IDs)

### When to Use
- ✅ Complex architectural decisions requiring diverse perspectives
- ✅ Code review needing thorough analysis from multiple viewpoints
- ✅ High-stakes implementation with multiple validation layers
- ✅ Test strategy requiring comprehensive coverage assessment
- ✅ API design validation from different reasoning approaches
- ✅ Security audit needing multiple analysis angles
- ✅ ANY task where consensus or diverse insights add value

### What This Adds to Existing Content
- **Existing:** File-based pattern for single-model delegation
- **Existing:** Sub-agent delegation for context isolation
- **NEW:** Multi-model parallel orchestration for consensus/divergence analysis
- **NEW:** Cost transparency and user approval workflow
- **NEW:** Label → Model ID mapping pattern (CRITICAL for UX)
- **NEW:** Synthesis methodology for consolidating multiple outputs

---

## 2. Detailed Outline

### 2.1 Section Structure

```markdown
## Multi-Model Orchestration Pattern

### When to Use Multi-Model Orchestration
[Scenarios where multiple models add value]

### The Universal 5-Step Pattern
[Step-by-step methodology]

#### Step 1: Get Available Models
[How to query and filter models]

#### Step 2: Present to User with Pricing (CRITICAL MAPPING)
[Label → ID mapping, cost transparency, user selection]

#### Step 3: Launch Parallel Sub-Agents
[ONE Task per model, ALL in single message]

#### Step 4: Workspace Communication
[Isolated file structure, no context pollution]

#### Step 5: Synthesize Results
[Consensus, divergence, unique insights]

### Supported Agent Types (Universal Pattern)
[Table showing this works with ANY agent]

### Complete Example: Architecture Review with 3 Models
[Full workflow from start to finish]

### Cost Transparency Template
[How to show costs and get approval]

### Critical Rules
[Dos and don'ts]

### Advanced Patterns
[Enhanced workflows]
```

### 2.2 Subsection Details

#### **Section Header: Multi-Model Orchestration Pattern**

**Opening paragraph:**
- Introduce the concept: running SAME task through MULTIPLE AI models simultaneously
- Key benefit: Consensus = high confidence, Divergence = valuable insights
- Universal applicability: Works with ANY agent type, ANY task

**Core principle:**
- File-based workspace isolation (builds on existing pattern)
- Parallel execution via Task tool (all in single message)
- Synthesis of multiple perspectives into actionable recommendation

---

#### **Subsection: When to Use Multi-Model Orchestration**

**Content:**
1. **Complex Decision-Making Scenarios**
   - Architecture decisions with long-term impact
   - Technology stack selection
   - Database schema design
   - Security architecture

2. **Quality Assurance Scenarios**
   - Code review requiring thorough analysis
   - Security vulnerability assessment
   - Performance bottleneck investigation
   - API contract validation

3. **Planning Scenarios**
   - Test strategy development
   - Migration planning
   - Refactoring strategy
   - Deployment architecture

4. **High-Stakes Implementation**
   - Critical business logic
   - Payment/financial systems
   - Authentication/authorization
   - Data migration scripts

**Key Insight Box:**
```
🌟 WHEN TO USE MULTIPLE MODELS

Use this pattern when:
✅ Multiple perspectives add value (not just more tokens)
✅ Consensus increases confidence in decisions
✅ Divergence reveals important edge cases
✅ Cost is justified by task criticality

Don't use when:
❌ Task is straightforward (no benefit from multiple models)
❌ Budget constraints prohibit multi-model execution
❌ Time constraints require faster single-model approach
```

---

#### **Subsection: The Universal 5-Step Pattern**

**⚠️ IMPORTANT: Code Examples are Agent Orchestration Patterns**

All code examples in this section demonstrate **patterns for Claude Code AI agents**, not standard TypeScript applications:
- `Task()`, `Bash()`, `Read()`, `Write()` are **Claude Code tools**, not imported functions
- Examples show how to orchestrate external AI models using Claudish CLI
- Code is instructional pseudocode, not meant to be compiled as standalone TypeScript
- Agents interpret these patterns to execute multi-model workflows

**Introduction:**
- This pattern works with ANY Claude Code agent type
- Examples: backend-architect, senior-code-reviewer, test-writer, frontend-architect, etc.
- Same methodology, different subagent_type parameter

**Step-by-step breakdown:**

---

##### **Step 1: Get Available Models and Validate Capabilities**

**Content:**
```typescript
// Query available models with pricing and capabilities
const { stdout } = await Bash({
  command: "claudish --list-models --json",
  description: "Get available OpenRouter models with pricing"
});

const modelsData = JSON.parse(stdout);
const allModels = modelsData.models;

// Filter by category and validate capabilities
const minimumContextLength = 128000; // Require sufficient context for code review

const suitableModels = allModels.filter(m => {
  const hasRequiredContext = m.context_length >= minimumContextLength;
  const isSupportedCategory = ['coding', 'reasoning'].includes(m.category);
  const isActive = m.status !== 'deprecated'; // Skip deprecated models

  return hasRequiredContext && isSupportedCategory && isActive;
});

console.log(`Found ${suitableModels.length} suitable models (filtered from ${allModels.length})`);
```

**What to Extract:**
- `id` - Model identifier for claudish (e.g., "x-ai/grok-code-fast-1")
- `name` - Human-readable name (e.g., "xAI Grok Code Fast")
- `pricing.prompt` - Cost per 1M input tokens
- `pricing.completion` - Cost per 1M output tokens
- `context_length` - Maximum context window
- `category` - Model category (coding, reasoning, vision, etc.)
- `status` - Model availability (active, deprecated, etc.)

**Example Output:**
```json
{
  "models": [
    {
      "id": "x-ai/grok-code-fast-1",
      "name": "xAI Grok Code Fast",
      "category": "coding",
      "pricing": {
        "prompt": "0.5",
        "completion": "1.5"
      },
      "context_length": 262144
    }
  ]
}
```

---

##### **Step 2: Present to User with Pricing (CRITICAL MAPPING)**

**⚠️ CRITICAL: Label → Model ID Mapping**

**Why This Matters:**
- User sees friendly names: "Grok Code Fast", "Gemini 2.5 Flash", "GPT-5"
- Claudish needs model IDs: "x-ai/grok-code-fast-1", "google/gemini-2.5-flash", "openai/gpt-5"
- Without mapping, you'll pass wrong values to claudish (BREAKS EXECUTION)

**The Mapping Pattern:**
```typescript
// Step 2a: Build mapping from labels to model IDs
const modelOptions = models.map(m => ({
  label: `${m.name} ($${m.pricing.prompt}/$${m.pricing.completion} per 1M tokens)`,
  modelId: m.id
}));

// Step 2b: Present options to user
const response = await AskUserQuestion({
  question: `Select models for multi-model review (comma-separated numbers):

${modelOptions.map((opt, idx) => `${idx + 1}. ${opt.label}`).join('\n')}

Estimated cost per model: ~$0.05-0.15 (varies by task complexity)
`,
  type: "text"
});

// Step 2c: Parse user selection and MAP to model IDs
const selectedIndices = response.split(',').map(s => parseInt(s.trim()) - 1);
const selectedModelIds = selectedIndices.map(idx => modelOptions[idx].modelId);

// ✅ Now you have model IDs that claudish can use
console.log("Selected models:", selectedModelIds);
// Output: ["x-ai/grok-code-fast-1", "google/gemini-2.5-flash", "openai/gpt-5"]
```

**Cost Estimation:**
```typescript
function estimateCost(models: Model[], estimatedTokens: { input: number, output: number }) {
  return models.map(model => {
    const inputCost = (estimatedTokens.input / 1_000_000) * parseFloat(model.pricing.prompt);
    const outputCost = (estimatedTokens.output / 1_000_000) * parseFloat(model.pricing.completion);
    const totalCost = inputCost + outputCost;

    return {
      modelName: model.name,
      estimatedCost: totalCost,
      breakdown: { inputCost, outputCost }
    };
  });
}
```

**Example User Prompt:**
```
Select models for architecture review (comma-separated numbers):

1. xAI Grok Code Fast ($0.5/$1.5 per 1M tokens)
2. Google Gemini 2.5 Flash ($0.075/$0.3 per 1M tokens)
3. OpenAI GPT-5 ($5/$15 per 1M tokens)
4. DeepSeek V3 ($0.14/$0.28 per 1M tokens)

Estimated cost per model: ~$0.05-0.15
Total for 3 models: ~$0.15-0.45

Enter your selection (e.g., "1,2,3"):
```

---

##### **Step 3: Launch Parallel Sub-Agents**

**Core Principle: ONE Task per Model, ALL in Single Message**

**Why Parallel Execution:**
- ✅ 3-5x faster (15 min → 5 min with 3 models)
- ✅ True parallelism (Task tool supports parallel execution)
- ✅ No sequential bottleneck

**Pattern:**
```typescript
const timestamp = Date.now();
const workspaceDir = `/tmp/multi-model-review-${timestamp}`;

// Create workspace directory
await Bash(`mkdir -p ${workspaceDir}`);

// Create shared instruction file
const instructionFile = `${workspaceDir}/instruction.md`;
await Write({
  file_path: instructionFile,
  content: createReviewInstruction(files, workspace)
});

// Launch ALL sub-agents in SINGLE message (parallel execution)
const tasks = selectedModelIds.map(modelId => ({
  subagent_type: "senior-code-reviewer",  // Same agent type for all
  description: `Code review with ${modelId}`,
  prompt: `
CRITICAL: Use Claudish to perform code review with external model.

## Configuration
- Model: ${modelId}
- Instruction file: ${instructionFile}
- Output file: ${workspaceDir}/${modelId.replace(/\//g, '-')}-review.md

## Execution Steps
1. Read instruction file: ${instructionFile}
2. Run: claudish --model ${modelId} --stdin < ${instructionFile}
3. Write output to: ${workspaceDir}/${modelId.replace(/\//g, '-')}-review.md
4. Return ONLY a 1-sentence confirmation

DO NOT include full review in response. It's in the workspace file.
  `
}));

// Execute ALL tasks in parallel with graceful error handling
console.log(`⏳ Launching ${tasks.length} parallel reviews (est. 5-7 min)...`);

const results = await Promise.allSettled(tasks.map((task, idx) =>
  Task(task).then(result => {
    console.log(`✅ ${idx + 1}/${tasks.length} complete`);
    return result;
  })
));

// Handle partial failures gracefully
const successful = results.filter(r => r.status === 'fulfilled');
const failed = results.filter(r => r.status === 'rejected');

if (failed.length > 0) {
  console.warn(`⚠️  ${failed.length}/${tasks.length} models failed. Continuing with ${successful.length} successful reviews.`);
}

if (successful.length === 0) {
  throw new Error("All models failed. Unable to proceed with multi-model review.");
}
```

**Key Points:**
- ✅ Same `subagent_type` for all (ensures consistent methodology)
- ✅ Different `modelId` for each (diversity of perspectives)
- ✅ Isolated output files (no context collision)
- ✅ Minimal response from each sub-agent (summary only)

---

##### **Step 4: Workspace Communication**

**File Structure:**
```
/tmp/multi-model-review-{timestamp}/
├── instruction.md                    # Shared input
├── x-ai-grok-code-fast-1-review.md  # Grok output
├── google-gemini-2.5-flash-review.md # Gemini output
└── openai-gpt-5-review.md            # GPT-5 output
```

**Instruction File Template:**
```markdown
# Code Review Task

## Files to Review
- /path/to/file1.ts
- /path/to/file2.ts

## Review Criteria
- Code quality and maintainability
- Security vulnerabilities
- Performance issues
- Best practice violations

## Output Format
Write your review in structured markdown:

### Summary
[2-3 sentence overview]

### Critical Issues
- [Issue 1 with severity and location]
- [Issue 2 with severity and location]

### Medium Issues
- [Issue 3]

### Recommendations
- [Recommendation 1]

### Strengths
- [What was done well]
```

**Output File Reading:**
```typescript
// After all sub-agents complete, read all outputs
const reviews = await Promise.all(
  selectedModelIds.map(async modelId => {
    const reviewFile = `${workspaceDir}/${modelId.replace(/\//g, '-')}-review.md`;
    const content = await Read({ file_path: reviewFile });
    return {
      modelId,
      modelName: models.find(m => m.id === modelId)?.name,
      review: content
    };
  })
);
```

---

##### **Step 5: Synthesize Results**

**Synthesis Methodology:**

1. **Extract Issues from Each Review**
   ```typescript
   function extractIssues(review: string): Issue[] {
     // Parse markdown sections
     // NOTE: Implementation details omitted for brevity
     // In practice, use regex or markdown parser to extract bullet points from sections
     const critical = parseSection(review, "Critical Issues");
     const medium = parseSection(review, "Medium Issues");
     const low = parseSection(review, "Low Issues");

     return [...critical, ...medium, ...low];
   }

   // Helper function (implementation omitted for brevity)
   // Extracts issues from a markdown section by section title
   function parseSection(markdown: string, sectionTitle: string): Issue[] {
     // Extract section content between ### {sectionTitle} and next ###
     // Parse each bullet point/list item as an issue
     // Return array of Issue objects with { title, location, severity, description }
   }
   ```

2. **Find Consensus (All Models Agree)**
   ```typescript
   function findConsensus(allIssues: Issue[][]): Issue[] {
     // Issues mentioned by ALL models (high confidence)
     const consensusIssues = [];

     for (const issue of allIssues[0]) {
       const mentionedByAll = allIssues.every(modelIssues =>
         modelIssues.some(i => isSimilarIssue(i, issue))
       );

       if (mentionedByAll) {
         consensusIssues.push({
           ...issue,
           confidence: "unanimous",
           models: allIssues.length
         });
       }
     }

     return consensusIssues;
   }

   // Helper function (implementation omitted for brevity)
   // Fuzzy matching to determine if two issues are semantically similar
   function isSimilarIssue(issue1: Issue, issue2: Issue): boolean {
     // Compare location (exact match) or title/description similarity (>70% threshold)
     // Use Jaccard similarity or Levenshtein distance for text comparison
   }
   ```

3. **Find Divergence (Models Disagree)**
   ```typescript
   function findDivergence(allIssues: Issue[][]): Issue[] {
     // Issues mentioned by SOME models (valuable unique insights)
     const divergentIssues = [];
     const seen = new Set(); // Deduplicate issues

     for (const modelIssues of allIssues) {
       for (const issue of modelIssues) {
         const issueKey = `${issue.location}:${issue.title}`;

         // Skip if already processed
         if (seen.has(issueKey)) continue;

         const mentionCount = allIssues.filter(issues =>
           issues.some(i => isSimilarIssue(i, issue))
         ).length;

         if (mentionCount === 1) {
           divergentIssues.push({
             ...issue,
             confidence: "unique",
             model: issue.modelName
           });
           seen.add(issueKey); // Mark as processed
         }
       }
     }

     return divergentIssues;
   }
   ```

4. **Present Consolidated Report**
   ```markdown
   ## Multi-Model Code Review Results

   **Models:** Grok Code Fast, Gemini 2.5 Flash, GPT-5
   **Files Reviewed:** 5
   **Total Cost:** $0.23

   ### Unanimous Issues (All 3 Models Agree)
   These issues were identified by ALL models - highest confidence:

   1. **Security: SQL Injection Risk** (Critical)
      - Location: `api/users.ts:42`
      - All models flagged unsanitized user input
      - Recommendation: Use parameterized queries

   2. **Performance: N+1 Query** (Medium)
      - Location: `api/posts.ts:78`
      - All models identified inefficient data fetching
      - Recommendation: Use JOIN or eager loading

   ### Strong Consensus (2/3 Models Agree)
   These issues were identified by majority - high confidence:

   1. **Maintainability: Duplicate Code** (Medium)
      - Grok + Gemini identified code duplication in auth module
      - Recommendation: Extract to shared utility

   ### Divergent Insights (Unique to One Model)
   These unique findings may reveal edge cases or alternative perspectives:

   1. **GPT-5 Only: Potential Race Condition** (Low)
      - Location: `services/cache.ts:123`
      - Only GPT-5 flagged this concurrency issue
      - Worth investigating further

   2. **Grok Only: TypeScript Type Safety** (Low)
      - Suggested stronger type constraints in API layer
      - Optional improvement

   ### Recommendations (Prioritized)

   **Immediate Action Required:**
   - ✅ Fix SQL injection vulnerability (unanimous)
   - ✅ Resolve N+1 query issue (unanimous)

   **High Priority:**
   - 🔶 Investigate race condition (GPT-5 unique insight)
   - 🔶 Refactor duplicate code (2/3 consensus)

   **Nice to Have:**
   - 💡 Enhance TypeScript types (Grok suggestion)
   ```

**Synthesis Template:**
```typescript
function synthesizeReviews(reviews: Review[]): ConsolidatedReport {
  const allIssues = reviews.map(r => extractIssues(r.review));

  return {
    unanimous: findConsensus(allIssues),
    strongConsensus: findStrongConsensus(allIssues, 2), // 2/3 models
    divergent: findDivergence(allIssues),
    recommendations: prioritizeRecommendations(allIssues),
    metadata: {
      models: reviews.map(r => r.modelName),
      totalCost: calculateTotalCost(reviews),
      filesReviewed: countFiles(reviews)
    }
  };
}
```

---

#### **Subsection: Supported Agent Types (Universal Pattern)**

**Table:**

| Agent Type | Example Subagent | Task Examples | When to Use Multi-Model |
|------------|------------------|---------------|------------------------|
| **Architecture** | `backend-architect`, `frontend-architect` | API design, system architecture, tech stack decisions | ✅ Critical decisions benefit from diverse perspectives |
| **Code Review** | `senior-code-reviewer`, `codex-code-reviewer` | Security audit, performance review, code quality | ✅ Multiple reviewers catch more issues |
| **Testing** | `test-architect`, `test-writer` | Test strategy, coverage analysis, test case design | ✅ Comprehensive test suites need multiple viewpoints |
| **Implementation** | `backend-developer`, `typescript-frontend-dev` | Feature implementation, refactoring, bug fixes | ⚠️ Use selectively for complex/critical features |
| **Analysis** | `codebase-detective`, `api-documentation-analyst` | Pattern discovery, dependency analysis, documentation review | ✅ Complex codebases benefit from diverse analysis |
| **Planning** | Custom planning agents | Migration planning, deployment strategy, risk assessment | ✅ Strategic decisions benefit from consensus |

**Key Insight:**
```
🌟 UNIVERSAL PATTERN

This pattern works with ANY agent type because:
✅ All agents use same Task tool interface
✅ Workspace isolation prevents context pollution
✅ Synthesis methodology is agent-agnostic
✅ Only `subagent_type` parameter changes

Just use the agent you would normally use, but launch multiple instances with different models.
```

---

#### **Subsection: Complete Example - Architecture Review with 3 Models**

**Full Workflow:**

```typescript
/**
 * Complete Example: Review API architecture with 3 models
 *
 * Demonstrates:
 * - Model selection with pricing
 * - Label → ID mapping (CRITICAL)
 * - Parallel execution
 * - Consensus analysis
 * - Cost transparency
 */

async function reviewArchitectureWithMultipleModels() {
  const timestamp = Date.now();
  const workspaceDir = `/tmp/arch-review-${timestamp}`;

  // STEP 1: Get Available Models
  console.log("📋 Step 1: Getting available models...");

  const { stdout } = await Bash({
    command: "claudish --list-models --json",
    description: "Get OpenRouter models"
  });

  const modelsData = JSON.parse(stdout);

  // Filter for suitable models (coding + reasoning categories)
  const suitableModels = modelsData.models.filter(m =>
    ['coding', 'reasoning'].includes(m.category)
  );

  // STEP 2: Present to User with Pricing (BUILD MAPPING!)
  console.log("💰 Step 2: Presenting model options with pricing...");

  // Build label → ID mapping
  const modelOptions = suitableModels.map(m => ({
    label: `${m.name} ($${m.pricing.prompt}/$${m.pricing.completion} per 1M tokens) - ${m.context_length/1000}K context`,
    modelId: m.id,
    model: m
  }));

  const response = await AskUserQuestion({
    question: `Select 3 models for architecture review (comma-separated numbers):

${modelOptions.map((opt, idx) => `${idx + 1}. ${opt.label}`).join('\n')}

Recommended: 1,2,3 (Grok for speed, Gemini for depth, GPT-5 for reasoning)
Estimated total cost: $0.15 - $0.45 (based on ~10K input + 5K output tokens per model)

Enter selection: `,
    type: "text"
  });

  // Parse and MAP to model IDs (CRITICAL STEP)
  const selectedIndices = response.split(',').map(s => parseInt(s.trim()) - 1);
  const selectedModels = selectedIndices.map(idx => modelOptions[idx]);
  const selectedModelIds = selectedModels.map(opt => opt.modelId);

  console.log("✅ Selected models:", selectedModelIds);

  // Show cost estimate and get approval
  const estimatedCost = selectedModels.reduce((sum, opt) => {
    const model = opt.model;
    const inputCost = (10000 / 1_000_000) * parseFloat(model.pricing.prompt);
    const outputCost = (5000 / 1_000_000) * parseFloat(model.pricing.completion);
    return sum + inputCost + outputCost;
  }, 0);

  const approval = await AskUserQuestion({
    question: `Estimated cost for 3 models: $${estimatedCost.toFixed(3)}

Proceed with multi-model architecture review?`,
    type: "yesno"
  });

  if (approval !== "yes") {
    return "❌ Review cancelled by user";
  }

  // STEP 3: Create Workspace and Instruction File
  console.log("📁 Step 3: Creating workspace...");

  await Bash(`mkdir -p ${workspaceDir}`);

  const instructionFile = `${workspaceDir}/instruction.md`;
  const instruction = `# API Architecture Review

## Files to Review
- src/api/users.ts
- src/api/posts.ts
- src/api/auth.ts

## Review Criteria
1. **Architecture Quality**
   - Layer separation (routes → controllers → services → repositories)
   - Dependency management
   - Code organization

2. **Security**
   - Authentication/authorization patterns
   - Input validation
   - SQL injection risks

3. **Performance**
   - Query optimization
   - Caching strategies
   - N+1 query issues

4. **Maintainability**
   - Code clarity and documentation
   - Error handling
   - Test coverage

## Output Format
Provide structured analysis:

### Summary
[2-3 sentences overview]

### Critical Issues
- [Issue with severity, location, and fix recommendation]

### Medium Issues
- [Issue with location and suggestion]

### Low Priority Issues
- [Minor improvements]

### Strengths
- [What's well-designed]

### Recommendations
1. [Prioritized action items]
`;

  await Write({ file_path: instructionFile, content: instruction });

  // STEP 4: Launch Parallel Sub-Agents
  console.log("🚀 Step 4: Launching parallel architecture reviews...");
  console.log("⏱️  Estimated time: 5-7 minutes (parallel execution)");

  // Create Task calls (all will execute in parallel when sent in single response)
  const reviewTasks = selectedModelIds.map(modelId =>
    Task({
      subagent_type: "backend-architect",  // Use architecture agent
      description: `Architecture review with ${modelId}`,
      prompt: `
CRITICAL: Perform API architecture review using Claudish with external model.

## Configuration
- Model: ${modelId}
- Instruction file: ${instructionFile}
- Output file: ${workspaceDir}/${modelId.replace(/\//g, '-')}-review.md

## Execution Steps
1. Read instruction file: ${instructionFile}
2. Analyze the API files mentioned in the instruction
3. Run: claudish --model ${modelId} --stdin < ${instructionFile}
4. Ensure output is written to: ${workspaceDir}/${modelId.replace(/\//g, '-')}-review.md
5. Return ONLY: "✅ Review complete. Output: [filename]"

DO NOT include the full review in your response.
The review is saved to the workspace file.
      `
    })
  );

  // Execute all tasks in parallel with graceful error handling
  const taskResults = await Promise.allSettled(reviewTasks);

  // Handle partial failures
  const successful = taskResults.filter(r => r.status === 'fulfilled');
  const failed = taskResults.filter(r => r.status === 'rejected');

  if (failed.length > 0) {
    console.warn(`⚠️  ${failed.length} models failed. Continuing with ${successful.length} successful reviews.`);
  }

  if (successful.length === 0) {
    throw new Error("All models failed. Falling back to embedded Claude review.");
  }

  console.log("✅ All reviews complete");

  // STEP 5: Read All Reviews
  console.log("📖 Step 5: Reading review outputs...");

  const reviews = await Promise.all(
    selectedModelIds.map(async (modelId, idx) => {
      const reviewFile = `${workspaceDir}/${modelId.replace(/\//g, '-')}-review.md`;
      const content = await Read({ file_path: reviewFile });
      const modelName = selectedModels[idx].model.name;

      return {
        modelId,
        modelName,
        review: content
      };
    })
  );

  // STEP 6: Synthesize Results
  console.log("🔬 Step 6: Synthesizing consensus and divergence...");

  // Extract issues from each review
  const allIssues = reviews.map(r => extractIssues(r.review));

  // Find unanimous issues (all 3 models agree)
  const unanimousIssues = findUnanimousIssues(allIssues);

  // Find strong consensus (2/3 models agree)
  const strongConsensus = findStrongConsensusIssues(allIssues, 2);

  // Find divergent insights (unique to one model)
  const divergentInsights = findDivergentInsights(allIssues);

  // STEP 7: Present Consolidated Report
  const report = `
# Multi-Model API Architecture Review

**Models Used:** ${reviews.map(r => r.modelName).join(', ')}
**Files Reviewed:** 3
**Total Cost:** $${estimatedCost.toFixed(3)}
**Execution Time:** 5 minutes (parallel)

---

## 🎯 Unanimous Issues (All ${reviews.length} Models Agree)
**Highest Confidence - Immediate Action Required**

${unanimousIssues.map((issue, idx) => `
### ${idx + 1}. ${issue.title} (${issue.severity})
**Location:** ${issue.location}
**All models flagged:** ${issue.description}

**Fix Recommendation:**
${issue.recommendation}
`).join('\\n')}

---

## 🔶 Strong Consensus (${strongConsensus.length} Issues - 2/${reviews.length} Models Agree)
**High Confidence - Recommended Action**

${strongConsensus.map((issue, idx) => `
${idx + 1}. **${issue.title}** - ${issue.location}
   - Models: ${issue.models.join(', ')}
   - ${issue.description}
`).join('\\n')}

---

## 💡 Divergent Insights (Unique Findings)
**Valuable Alternative Perspectives - Consider Investigating**

${divergentInsights.map((issue, idx) => `
${idx + 1}. **${issue.title}** (${issue.model} only)
   - Location: ${issue.location}
   - Insight: ${issue.description}
   - Why unique: ${issue.rationale}
`).join('\\n')}

---

## 📋 Prioritized Action Plan

**🔴 Critical (Do Now):**
${unanimousIssues.filter(i => i.severity === 'Critical').map(i => `- ${i.title}`).join('\\n')}

**🟡 High Priority (Do This Week):**
${unanimousIssues.filter(i => i.severity === 'Medium').map(i => `- ${i.title}`).join('\\n')}
${strongConsensus.filter(i => i.severity === 'Critical').map(i => `- ${i.title} (2/3 consensus)`).join('\\n')}

**🟢 Low Priority (Nice to Have):**
${divergentInsights.map(i => `- ${i.title} (${i.model} suggestion - evaluate)`).join('\\n')}

---

## 💪 Strengths Identified

${extractStrengths(reviews).map((strength, idx) => `${idx + 1}. ${strength}`).join('\\n')}

---

## 📊 Model Performance Comparison

| Model | Critical Issues Found | Medium Issues | Unique Insights | Review Depth |
|-------|----------------------|---------------|-----------------|--------------|
${reviews.map(r => {
  const issues = extractIssues(r.review);
  return `| ${r.modelName} | ${issues.filter(i => i.severity === 'Critical').length} | ${issues.filter(i => i.severity === 'Medium').length} | ${countUniqueIssues(r, reviews)} | ${estimateDepth(r.review)} |`;
}).join('\\n')}

---

**Next Steps:**
1. Address all unanimous critical issues immediately
2. Investigate divergent insights (may reveal edge cases)
3. Schedule follow-up review after fixes
  `;

  // Save consolidated report
  await Write({
    file_path: `${workspaceDir}/consolidated-report.md`,
    content: report
  });

  // Clean up temp files (keep report)
  await Bash(`rm ${instructionFile}`);
  reviews.forEach(r => {
    Bash(`rm ${workspaceDir}/${r.modelId.replace(/\//g, '-')}-review.md`);
  });

  return report;
}

// Helper functions (implementation details omitted for brevity)
function extractIssues(review: string): Issue[] {
  // Parse markdown sections for issues
  const critical = parseIssueSection(review, "Critical Issues");
  const medium = parseIssueSection(review, "Medium Issues");
  const low = parseIssueSection(review, "Low Priority Issues");

  return [...critical, ...medium, ...low];
}

// Parses a markdown section and extracts issues as structured objects
function parseIssueSection(markdown: string, sectionTitle: string): Issue[] {
  // Implementation: Extract section content between ### {sectionTitle} and next ###
  // Parse each bullet point as { title, location, severity, description }
}

function findUnanimousIssues(allIssues: Issue[][]): Issue[] {
  // Issues mentioned by ALL models
  const unanimous = [];
  const modelCount = allIssues.length;

  for (const issue of allIssues[0]) {
    let matchCount = 0;
    const matchingIssues = [];

    for (const modelIssues of allIssues) {
      const match = modelIssues.find(i =>
        isSimilarIssue(i, issue) // Fuzzy matching by location + description
      );
      if (match) {
        matchCount++;
        matchingIssues.push(match);
      }
    }

    if (matchCount === modelCount) {
      unanimous.push({
        ...issue,
        confidence: "unanimous",
        models: matchingIssues.map(i => i.modelName)
      });
    }
  }

  return unanimous;
}

function findStrongConsensusIssues(allIssues: Issue[][], threshold: number): Issue[] {
  // Issues mentioned by THRESHOLD or more models
  const consensus = [];
  const seen = new Set();

  for (const modelIssues of allIssues) {
    for (const issue of modelIssues) {
      const key = `${issue.location}:${issue.title}`;
      if (seen.has(key)) continue;

      let matchCount = 0;
      const matchingModels = []; // Fixed: was undefined 'models' reference

      for (const otherIssues of allIssues) {
        if (otherIssues.some(i => isSimilarIssue(i, issue))) {
          matchCount++;
          matchingModels.push(issue.modelName); // Track which models found this issue
        }
      }

      if (matchCount >= threshold && matchCount < allIssues.length) {
        consensus.push({
          ...issue,
          confidence: "strong",
          models: matchingModels
        });
        seen.add(key);
      }
    }
  }

  return consensus;
}

function findDivergentInsights(allIssues: Issue[][]): Issue[] {
  // Issues unique to ONE model
  const divergent = [];

  for (let i = 0; i < allIssues.length; i++) {
    const modelIssues = allIssues[i];

    for (const issue of modelIssues) {
      // Check if NO other model has similar issue
      const foundInOthers = allIssues.some((otherIssues, idx) =>
        idx !== i && otherIssues.some(i => isSimilarIssue(i, issue))
      );

      if (!foundInOthers) {
        divergent.push({
          ...issue,
          confidence: "unique",
          model: issue.modelName,
          rationale: "Only this model identified this issue - may indicate edge case or alternative perspective"
        });
      }
    }
  }

  return divergent;
}

function isSimilarIssue(issue1: Issue, issue2: Issue): boolean {
  // Fuzzy matching logic
  const locationMatch = issue1.location === issue2.location;
  const titleSimilarity = calculateSimilarity(issue1.title, issue2.title);
  const descriptionSimilarity = calculateSimilarity(issue1.description, issue2.description);

  return locationMatch || (titleSimilarity > 0.7 && descriptionSimilarity > 0.6);
}

function calculateSimilarity(str1: string, str2: string): number {
  // Simple Jaccard similarity
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

// Additional helper functions (implementations omitted for brevity)
function extractStrengths(reviews: Review[]): string[] {
  // Extract common strengths mentioned across reviews
}

function countUniqueIssues(review: Review, allReviews: Review[]): number {
  // Count issues found only by this review, not by others
}

function estimateDepth(reviewText: string): string {
  // Estimate review depth based on length and detail level
  // Returns: "⭐⭐⭐⭐⭐" (Very thorough) to "⭐⭐" (Superficial)
}
```

**Expected Output:**
```
# Multi-Model API Architecture Review

**Models Used:** xAI Grok Code Fast, Google Gemini 2.5 Flash, OpenAI GPT-5
**Files Reviewed:** 3
**Total Cost:** $0.187
**Execution Time:** 5 minutes (parallel)

---

## 🎯 Unanimous Issues (All 3 Models Agree)
**Highest Confidence - Immediate Action Required**

### 1. SQL Injection Vulnerability (Critical)
**Location:** `src/api/users.ts:42`
**All models flagged:** Unsanitized user input directly concatenated into SQL query

**Fix Recommendation:**
Use parameterized queries or ORM (Prisma) to prevent SQL injection:
\`\`\`typescript
// Before: VULNERABLE
const query = \`SELECT * FROM users WHERE id = ${req.params.id}\`;

// After: SAFE
const user = await prisma.user.findUnique({ where: { id: req.params.id } });
\`\`\`

[... rest of report ...]
```

---

#### **Subsection: Cost Transparency Template**

**Cost Display Pattern:**

```typescript
/**
 * Template for showing costs BEFORE execution
 * Gives user full transparency and control
 */

async function displayCostEstimate(models: Model[], estimatedTokens: TokenEstimate) {
  const estimates = models.map(model => {
    const inputCost = (estimatedTokens.input / 1_000_000) * parseFloat(model.pricing.prompt);
    const outputCost = (estimatedTokens.output / 1_000_000) * parseFloat(model.pricing.completion);
    const totalCost = inputCost + outputCost;

    return {
      modelName: model.name,
      inputCost,
      outputCost,
      totalCost
    };
  });

  const totalEstimate = estimates.reduce((sum, e) => sum + e.totalCost, 0);

  const costTable = `
## 💰 Cost Estimate

| Model | Input Cost | Output Cost | Total Cost |
|-------|-----------|-------------|------------|
${estimates.map(e =>
  `| ${e.modelName} | $${e.inputCost.toFixed(4)} | $${e.outputCost.toFixed(4)} | $${e.totalCost.toFixed(4)} |`
).join('\n')}
| **TOTAL** | | | **$${totalEstimate.toFixed(4)}** |

**Assumptions:**
- Input tokens: ~${estimatedTokens.input.toLocaleString()} (${Math.ceil(estimatedTokens.input / 1000)}K)
- Output tokens: ~${estimatedTokens.output.toLocaleString()} (${Math.ceil(estimatedTokens.output / 1000)}K)
- Actual cost may vary ±20% based on task complexity

**Price Range:** $${(totalEstimate * 0.8).toFixed(3)} - $${(totalEstimate * 1.2).toFixed(3)}
  `;

  console.log(costTable);

  // Get user approval
  const approved = await AskUserQuestion({
    question: `Total estimated cost: $${totalEstimate.toFixed(3)}

Proceed with multi-model execution?`,
    type: "yesno"
  });

  return approved === "yes";
}

/**
 * Token estimation helper
 * Uses code-aware estimation for better accuracy
 */
function estimateTokens(instructionFile: string, outputFormat: string): TokenEstimate {
  // Conservative estimates based on content type

  // Read instruction file to estimate input
  const instruction = fs.readFileSync(instructionFile, 'utf-8');

  // Code-aware estimation (code is denser than prose)
  const isCode = /^\s*(function|class|const|let|var|import|export|interface|type)/m.test(instruction);
  const charsPerToken = isCode ? 3 : 4; // Code: 3 chars/token, Prose: 4 chars/token

  // Count special characters (count as individual tokens)
  const specialChars = (instruction.match(/[{}[\]()<>]/g) || []).length;

  const instructionTokens = Math.ceil(instruction.length / charsPerToken) + specialChars;

  // Add codebase context (file contents)
  const codebaseTokens = 5000; // Estimate based on file count

  // System prompts and tool definitions
  const systemTokens = 2000;

  // Output format template tokens (code-aware)
  const outputTemplateTokens = Math.ceil(outputFormat.length / charsPerToken);

  // Expected output (conservative estimate)
  const expectedOutputTokens = outputTemplateTokens * 3; // Assume 3x template length

  // Add conservative overestimation (1.2x multiplier)
  const conservativeFactor = 1.2;

  return {
    input: Math.ceil((instructionTokens + codebaseTokens + systemTokens) * conservativeFactor),
    output: Math.ceil(expectedOutputTokens * conservativeFactor)
  };
}
```

**Example Cost Display:**

```
## 💰 Cost Estimate

| Model | Input Cost | Output Cost | Total Cost |
|-------|-----------|-------------|------------|
| xAI Grok Code Fast | $0.0050 | $0.0075 | $0.0125 |
| Google Gemini 2.5 Flash | $0.0008 | $0.0015 | $0.0023 |
| OpenAI GPT-5 | $0.0500 | $0.0750 | $0.1250 |
| **TOTAL** | | | **$0.1398** |

**Assumptions:**
- Input tokens: ~10,000 (10K)
- Output tokens: ~5,000 (5K)
- Actual cost may vary ±20% based on task complexity

**Price Range:** $0.112 - $0.168

Total estimated cost: $0.140

Proceed with multi-model execution? (yes/no)
```

---

#### **Subsection: Critical Rules**

**✅ DO These:**

1. **✅ Build Label → Model ID Mapping**
   ```typescript
   // User sees: "xAI Grok Code Fast"
   // Claudish needs: "x-ai/grok-code-fast-1"
   const mapping = models.map(m => ({ label: m.name, modelId: m.id }));
   ```

2. **✅ Launch All Tasks in Single Message**
   ```typescript
   // Parallel execution (3-5x faster)
   const tasks = models.map(m => Task({ ... }));
   await Promise.all(tasks);
   ```

3. **✅ Show Pricing BEFORE Execution**
   ```typescript
   const approved = await displayCostEstimate(models, tokens);
   if (!approved) return "Cancelled by user";
   ```

4. **✅ Use Same Agent Type for All Models**
   ```typescript
   // Consistent methodology across models
   subagent_type: "senior-code-reviewer" // Same for all
   ```

5. **✅ Isolate Outputs to Workspace Files**
   ```typescript
   // No context pollution
   outputFile: `/tmp/workspace/${modelId.replace('/', '-')}-output.md`
   ```

6. **✅ Synthesize Results**
   ```typescript
   // Don't just dump raw outputs - analyze and consolidate
   const consensus = findConsensus(allOutputs);
   const divergence = findDivergence(allOutputs);
   ```

**❌ DON'T Do These:**

1. **❌ Don't Pass Labels to Claudish**
   ```typescript
   // WRONG - claudish won't recognize friendly name
   await Bash(`claudish --model "xAI Grok Code Fast" ...`);

   // RIGHT - use model ID
   await Bash(`claudish --model x-ai/grok-code-fast-1 ...`);
   ```

2. **❌ Don't Run Sequentially**
   ```typescript
   // SLOW - sequential execution
   for (const model of models) {
     await Task({ ... }); // Each waits for previous
   }

   // FAST - parallel execution
   await Promise.all(models.map(m => Task({ ... })));
   ```

3. **❌ Don't Skip Cost Display**
   ```typescript
   // Bad UX - user surprised by cost
   await runMultiModelReview(models);

   // Good UX - transparent pricing
   const approved = await displayCostEstimate(models, tokens);
   if (approved) await runMultiModelReview(models);
   ```

4. **❌ Don't Return Raw Outputs**
   ```typescript
   // Unhelpful - too much information
   return reviews.map(r => r.fullOutput).join('\n\n');

   // Actionable - synthesized insights
   return synthesizeReviews(reviews);
   ```

5. **❌ Don't Mix Agent Types**
   ```typescript
   // Inconsistent - hard to compare
   Task({ subagent_type: "senior-code-reviewer" });
   Task({ subagent_type: "backend-architect" });

   // Consistent - apples-to-apples comparison
   Task({ subagent_type: "senior-code-reviewer" }); // All same
   ```

6. **❌ Don't Pollute Main Context**
   ```typescript
   // Context pollution - 30K+ tokens per model
   await Bash(`claudish --model grok ...`); // In main thread

   // Isolated - clean workspace pattern
   await Task({ ... }); // In sub-agent
   ```

**Summary Box:**

```
🌟 CRITICAL RULES SUMMARY

✅ Map labels → IDs (user-friendly to machine-friendly)
✅ Parallel execution (all tasks in single message)
✅ Show costs first (transparent pricing)
✅ Same agent type (consistent methodology)
✅ Workspace isolation (no context pollution)
✅ Synthesize results (actionable insights)

❌ No label passing to claudish
❌ No sequential execution
❌ No hidden costs
❌ No raw output dumps
❌ No mixed agent types
❌ No main context pollution
```

---

#### **Subsection: Advanced Patterns**

**Pattern 1: Adaptive Model Selection**

```typescript
/**
 * Automatically select best models based on task type
 */
function selectModelsForTask(allModels: Model[], taskType: string): Model[] {
  const recommendations = {
    'code-review': ['x-ai/grok-code-fast-1', 'google/gemini-2.5-flash', 'deepseek/deepseek-v3'],
    'architecture': ['google/gemini-2.5-flash', 'openai/gpt-5', 'anthropic/claude-sonnet-4.5'],
    'testing': ['x-ai/grok-code-fast-1', 'openai/gpt-5', 'google/gemini-2.5-flash'],
    'refactoring': ['deepseek/deepseek-v3', 'x-ai/grok-code-fast-1', 'google/gemini-2.5-flash'],
    'security': ['openai/gpt-5', 'google/gemini-2.5-flash', 'anthropic/claude-sonnet-4.5']
  };

  const recommendedIds = recommendations[taskType] || recommendations['code-review'];

  return allModels.filter(m => recommendedIds.includes(m.id));
}
```

**Pattern 2: Weighted Consensus**

```typescript
/**
 * Weight model opinions by their cost (expensive models = more weight)
 */
function findWeightedConsensus(reviews: Review[]): Issue[] {
  // Assign weights based on pricing tier
  const weights = reviews.map(r => {
    const avgCost = (parseFloat(r.model.pricing.prompt) + parseFloat(r.model.pricing.completion)) / 2;
    if (avgCost > 5) return 3;      // Premium models (GPT-5): 3x weight
    if (avgCost > 1) return 2;      // Mid-tier (Grok): 2x weight
    return 1;                       // Budget (Gemini Flash): 1x weight
  });

  // Extract all issues from all reviews
  const allIssues = reviews.flatMap(r => extractIssues(r.review)); // Fixed: was undefined

  // Find issues with weighted consensus
  const weightedIssues = [];

  for (const issue of allIssues) {
    let totalWeight = 0;
    reviews.forEach((review, idx) => {
      const reviewIssues = extractIssues(review.review);
      if (reviewIssues.some(i => isSimilarIssue(i, issue))) {
        totalWeight += weights[idx];
      }
    });

    const maxWeight = weights.reduce((a, b) => a + b, 0);
    const consensus = totalWeight / maxWeight;

    if (consensus > 0.5) { // Majority by weight
      weightedIssues.push({
        ...issue,
        consensusScore: consensus,
        confidence: consensus > 0.8 ? "high" : "medium"
      });
    }
  }

  return weightedIssues;
}
```

**Pattern 3: Timeout Handling**

```typescript
/**
 * Add timeout to prevent infinite hangs
 * Recommended: 5-10 minutes per model for code review tasks
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, taskName: string): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout: ${taskName} exceeded ${timeoutMs}ms`)), timeoutMs)
  );

  return Promise.race([promise, timeout]);
}

// Usage in multi-model orchestration
const REVIEW_TIMEOUT = 10 * 60 * 1000; // 10 minutes per model

const reviewTasks = selectedModelIds.map(modelId =>
  withTimeout(
    Task({
      subagent_type: "senior-code-reviewer",
      description: `Review with ${modelId}`,
      prompt: `...`
    }),
    REVIEW_TIMEOUT,
    `Review with ${modelId}`
  )
);

const results = await Promise.allSettled(reviewTasks);
```

**Pattern 4: Fallback Strategy with Graceful Degradation**

```typescript
/**
 * Graceful degradation if external models fail
 * Demonstrates 7 error recovery strategies
 */
async function reviewWithFallback(files: string[], preferredModels: string[]) {
  try {
    // Try multi-model review with timeout
    const results = await Promise.allSettled(
      preferredModels.map(model =>
        withTimeout(
          multiModelReview(files, [model]),
          10 * 60 * 1000,
          `Review with ${model}`
        )
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled');

    // Strategy 1: Full success (all models succeeded)
    if (successful.length === results.length) {
      return synthesizeAllReviews(successful);
    }

    // Strategy 2: Partial success (some models succeeded)
    if (successful.length > 0) {
      console.warn(`⚠️  ${results.length - successful.length} models failed. Continuing with ${successful.length} reviews.`);
      return synthesizePartialReviews(successful);
    }

    // Strategy 3: Total failure - fall back to embedded Claude
    throw new Error("All external models failed");

  } catch (error) {
    console.warn("Multi-model review failed, falling back to embedded Claude...");

    // Strategy 4: Fallback to embedded Claude Sonnet (always available)
    return await Task({
      subagent_type: "senior-code-reviewer",
      description: "Code review (fallback to embedded Claude)",
      prompt: `Review these files: ${files.join(', ')}`
    });
  }
}

/**
 * Complete error recovery strategies:
 *
 * 1. Full Success - All models complete successfully
 * 2. Partial Success - Continue with successful models (graceful degradation)
 * 3. Retry Failed Models - Retry individual failures once
 * 4. Fallback to Embedded Claude - Use embedded Claude Sonnet if all fail
 * 5. User Notification - Inform user of failures and ask to proceed
 * 6. Cost Refund - Don't charge for failed model executions
 * 7. Diagnostic Logging - Log failures for troubleshooting
 */
```

**Pattern 5: Progressive Disclosure**

```typescript
/**
 * Start with fast/cheap models, escalate to expensive only if needed
 */
async function progressiveReview(files: string[]) {
  // Tier 1: Fast scan with Grok (cheap)
  const grokReview = await quickScan(files, 'x-ai/grok-code-fast-1');

  // If Grok finds critical issues, escalate to thorough review
  if (grokReview.criticalIssues.length > 0) {
    console.log("Critical issues found. Escalating to thorough multi-model review...");

    return await multiModelReview(files, [
      'x-ai/grok-code-fast-1',
      'google/gemini-2.5-flash',
      'openai/gpt-5' // Expensive, but justified
    ]);
  }

  return grokReview; // No critical issues, single review sufficient
}
```

**Pattern 6: Specialized Model Assignment**

```typescript
/**
 * Assign different models to different aspects of review
 */
async function specializedReview(files: string[]) {
  const aspects = {
    security: 'openai/gpt-5',           // Best for security reasoning
    performance: 'x-ai/grok-code-fast-1', // Fast performance analysis
    architecture: 'google/gemini-2.5-flash', // Deep architectural insights
    testing: 'deepseek/deepseek-v3'     // Comprehensive test coverage
  };

  // Launch parallel reviews with specialized focus
  const reviews = await Promise.all(
    Object.entries(aspects).map(([aspect, modelId]) =>
      Task({
        subagent_type: "senior-code-reviewer",
        description: `${aspect} review with ${modelId}`,
        prompt: `
Review files with focus on ${aspect}:
${files.join('\n')}

Use model: ${modelId}
Focus exclusively on ${aspect} issues.
        `
      })
    )
  );

  // Combine specialized reviews
  return combineAspectReviews(reviews);
}
```

**Pattern 7: Security-Hardened Bash Commands**

```typescript
/**
 * Escape user-provided model IDs in bash commands
 * Prevents command injection vulnerabilities
 */
function safeBashCommand(command: string, args: string[]): string {
  // Escape single quotes in arguments
  const escaped = args.map(arg => `'${arg.replace(/'/g, "'\\''")}'`);
  return `${command} ${escaped.join(' ')}`;
}

// Usage:
const modelId = "x-ai/grok-code-fast-1"; // Could be user-provided
const instructionFile = "/tmp/instruction.md";

// UNSAFE:
await Bash(`claudish --model ${modelId} --stdin < ${instructionFile}`);

// SAFER:
const safeCmd = safeBashCommand('claudish', ['--model', modelId, '--stdin']);
await Bash(`${safeCmd} < '${instructionFile.replace(/'/g, "'\\''")}'`);
```

**Security Note:**
- Model IDs come from OpenRouter API and are generally safe
- But always validate and escape when constructing bash commands
- Use single-quote escaping: `'value'` becomes `'value'\''s'`
- Prefer Claude Code's built-in Bash tool which handles escaping

---

## 3. Key Points to Emphasize

### 3.1 Critical Concepts

1. **Label → Model ID Mapping is CRITICAL**
   - User sees friendly names for readability
   - Claudish requires exact model IDs for API calls
   - Without mapping, execution FAILS (claudish won't recognize labels)
   - Build mapping BEFORE presenting to user

2. **Parallel Execution is KEY to Performance**
   - Sequential: 15 minutes for 3 models (5 min each)
   - Parallel: 5 minutes for 3 models (simultaneous execution)
   - Use Promise.all or send all Task calls in single response

3. **Cost Transparency Builds Trust**
   - Show pricing BEFORE execution
   - Break down input vs output costs
   - Provide range (±20%) to account for variation
   - Get explicit user approval

4. **Synthesis > Raw Outputs**
   - Users don't want 3 separate reviews
   - They want: What all models agree on (high confidence)
   - And: Where models disagree (valuable divergence)
   - Present consolidated, actionable recommendations

5. **Universal Pattern**
   - Works with ANY agent type (architect, reviewer, tester, etc.)
   - Same methodology, just change `subagent_type`
   - Workspace isolation ensures no context pollution
   - Synthesis methodology is agent-agnostic

### 3.2 Common Pitfalls

1. **Passing Labels to Claudish** - Will fail. Always map to model IDs.
2. **Sequential Execution** - 3-5x slower. Always run in parallel.
3. **Hidden Costs** - User frustration. Always show estimates first.
4. **Context Pollution** - Use workspace isolation, not main context.
5. **Raw Output Dumps** - Overwhelming. Synthesize into insights.
6. **Mixed Agent Types** - Hard to compare. Use same agent for all models.

### 3.3 Success Indicators

✅ User sees friendly model names in selection UI
✅ Claudish receives correct model IDs (not labels)
✅ All models execute in parallel (check timestamps)
✅ Cost estimate shown before execution
✅ User explicitly approves before proceeding
✅ Synthesis identifies consensus and divergence
✅ Final report is actionable (not just raw outputs)
✅ Workspace files are cleaned up after synthesis

---

## 4. Code Examples to Include

### 4.1 Label → ID Mapping (Most Critical)

```typescript
// Build mapping from user-friendly labels to claudish model IDs
const modelOptions = models.map(m => ({
  label: `${m.name} ($${m.pricing.prompt}/$${m.pricing.completion} per 1M tokens)`,
  modelId: m.id  // CRITICAL: Store the actual ID
}));

// Present labels to user
const response = await AskUserQuestion({
  question: `Select models (comma-separated):
${modelOptions.map((opt, idx) => `${idx + 1}. ${opt.label}`).join('\n')}`,
  type: "text"
});

// Map user selection to model IDs
const indices = response.split(',').map(s => parseInt(s.trim()) - 1);
const selectedModelIds = indices.map(idx => modelOptions[idx].modelId);

// ✅ Now pass IDs to claudish
await Bash(`claudish --model ${selectedModelIds[0]} ...`);
```

### 4.2 Parallel Execution

```typescript
// Launch ALL tasks in single response (parallel execution)
const tasks = selectedModelIds.map(modelId =>
  Task({
    subagent_type: "senior-code-reviewer",
    description: `Review with ${modelId}`,
    prompt: `Use claudish --model ${modelId} ...`
  })
);

// Execute in parallel (3-5x faster than sequential)
const results = await Promise.all(tasks);
```

### 4.3 Cost Transparency

```typescript
function estimateCost(models, tokens) {
  const estimates = models.map(m => {
    const inputCost = (tokens.input / 1_000_000) * parseFloat(m.pricing.prompt);
    const outputCost = (tokens.output / 1_000_000) * parseFloat(m.pricing.completion);
    return { modelName: m.name, totalCost: inputCost + outputCost };
  });

  const total = estimates.reduce((sum, e) => sum + e.totalCost, 0);

  // Show before execution
  console.log(`Total estimated cost: $${total.toFixed(3)}`);
  estimates.forEach(e =>
    console.log(`  ${e.modelName}: $${e.totalCost.toFixed(4)}`)
  );

  return total;
}
```

### 4.4 Consensus Analysis

```typescript
function findConsensus(allIssues) {
  const consensusIssues = [];

  for (const issue of allIssues[0]) {
    const mentionedByAll = allIssues.every(modelIssues =>
      modelIssues.some(i => isSimilar(i, issue))
    );

    if (mentionedByAll) {
      consensusIssues.push({
        ...issue,
        confidence: "unanimous",
        models: allIssues.length
      });
    }
  }

  return consensusIssues;
}
```

### 4.5 Workspace Isolation

```typescript
const timestamp = Date.now();
const workspaceDir = `/tmp/multi-model-${timestamp}`;

await Bash(`mkdir -p ${workspaceDir}`);

// Each model writes to isolated file
const outputFile = `${workspaceDir}/${modelId.replace('/', '-')}-output.md`;

// After all complete, read all outputs
const outputs = await Promise.all(
  modelIds.map(id => Read({ file_path: `${workspaceDir}/${id.replace('/', '-')}-output.md` }))
);

// Clean up after synthesis
await Bash(`rm -rf ${workspaceDir}`);
```

---

## 5. Integration Points with Existing Content

### 5.1 Builds On

- **File-Based Sub-Agent Pattern (line 285)** - Uses same workspace isolation principle
- **Sub-Agent Delegation Pattern (line 437)** - Extends to multiple parallel sub-agents
- **Agent Selection Guide (line 48)** - Uses recommended agents with multiple models

### 5.2 References

- **Recommended Models (line 247)** - Same model IDs used in multi-model orchestration
- **Claudish CLI Flags (line 629)** - Same --model, --stdin, --json flags
- **Cost Tracking (line 675)** - Builds on cost tracking with upfront transparency

### 5.3 Cross-References to Add

In existing sections, add pointers to new section:

**In "Best Practice: File-Based Sub-Agent Pattern" (line 285):**
```markdown
**See Also:** Multi-Model Orchestration Pattern (below) for running same task across multiple models in parallel.
```

**In "Sub-Agent Delegation Pattern" (line 437):**
```markdown
**Advanced:** For multi-model consensus/divergence analysis, see Multi-Model Orchestration Pattern below.
```

**In "Agent Selection Guide" (line 48):**
```markdown
**Tip:** For complex tasks, consider using Multi-Model Orchestration Pattern to get consensus from multiple AI models.
```

### 5.4 Placement Rationale

**Insert After Line 200 (after Quick Start Guide) because:**
1. ✅ User has learned basics (installation, model selection, running claudish)
2. ✅ User understands single-model workflows
3. ✅ Ready for advanced pattern (multi-model orchestration)
4. ✅ Before diving into file-based pattern details (line 285)
5. ✅ Logical progression: Basics → Advanced → Implementation Details

**Alternative considered:** After line 587 (after Sub-Agent Delegation)
- ❌ Too late - user already deep in implementation details
- ❌ Breaks flow - should introduce concept earlier

---

## 6. Estimated Length

**Total Estimated Lines:** 550-650 lines

**Breakdown:**
- Section Header + Introduction: 20 lines
- When to Use Multi-Model: 50 lines
- The Universal 5-Step Pattern: 250 lines
  - Step 1: Get Models (40 lines)
  - Step 2: Present with Pricing (80 lines) ← MOST CRITICAL
  - Step 3: Launch Parallel (50 lines)
  - Step 4: Workspace Communication (40 lines)
  - Step 5: Synthesize Results (40 lines)
- Supported Agent Types Table: 30 lines
- Complete Example: 120 lines
- Cost Transparency Template: 60 lines
- Critical Rules: 80 lines
- Advanced Patterns: 100 lines

**Justification for Length:**
- ✅ Complex pattern requires thorough explanation
- ✅ Code examples need to be complete and runnable
- ✅ Critical mapping concept needs heavy emphasis
- ✅ Multiple examples show universality across agent types
- ✅ Matches length of comparable sections in existing skill

**Comparison to Existing Sections:**
- "File-Based Sub-Agent Pattern" (line 285-587): ~300 lines
- "Sub-Agent Delegation Pattern" (line 437-587): ~150 lines
- "Common Workflows" (line 589-628): ~40 lines
- **New Section: ~550 lines** (justified by complexity and importance)

---

## 7. Success Criteria

### 7.1 Technical Success

✅ **Agent correctly builds label → ID mapping**
- User sees: "xAI Grok Code Fast ($0.5/$1.5 per 1M)"
- Claudish receives: "x-ai/grok-code-fast-1"
- No execution failures due to invalid model names

✅ **Parallel execution works correctly**
- All Task calls in single response
- Timestamps show simultaneous execution
- 3-5x speedup vs sequential (verified in logs)

✅ **Cost transparency implemented**
- Estimate shown BEFORE execution
- User explicitly approves
- Actual cost matches estimate (±20%)

✅ **Workspace isolation prevents pollution**
- Main context stays clean (no 30K+ token dumps)
- Each model writes to isolated file
- Files cleaned up after synthesis

✅ **Synthesis produces actionable insights**
- Consensus issues clearly identified
- Divergent insights highlighted
- Prioritized recommendations provided
- Not just raw output dumps

### 7.2 Educational Success

✅ **Agent understands WHEN to use pattern**
- Can identify scenarios benefiting from multi-model
- Doesn't over-use pattern for simple tasks
- Justifies model selection based on task type

✅ **Agent understands WHY each step matters**
- Explains mapping importance (UX + correctness)
- Explains parallel execution (performance)
- Explains cost transparency (trust)
- Explains synthesis (actionability)

✅ **Agent can adapt pattern to ANY agent type**
- Uses same pattern for architect, reviewer, tester
- Only changes `subagent_type` parameter
- Understands universal applicability

✅ **Agent avoids common pitfalls**
- Never passes labels to claudish
- Never runs sequentially
- Never skips cost display
- Never dumps raw outputs

### 7.3 User Experience Success

✅ **User gets clear model selection UI**
- Friendly names with pricing
- Numbered options for easy selection
- Cost estimate included

✅ **User has cost control**
- Sees estimate before execution
- Understands breakdown (input/output)
- Can approve or decline

✅ **User receives actionable report**
- Clear consensus vs divergence
- Prioritized action items
- Model performance comparison
- Not overwhelmed by raw outputs

✅ **User trusts the results**
- Transparent methodology
- Clear confidence indicators
- Rationale for unanimous vs unique findings
- Can trace back to source models if needed

---

## 8. Review Checklist

Before finalizing section, verify:

- [ ] All code examples are complete and runnable
- [ ] Label → ID mapping is emphasized in multiple places
- [ ] Parallel execution pattern is clear (Promise.all)
- [ ] Cost transparency template is production-ready
- [ ] Synthesis methodology is detailed and actionable
- [ ] Universal pattern applicability is demonstrated
- [ ] Critical rules cover all common pitfalls
- [ ] Advanced patterns show real-world extensions
- [ ] Integration points with existing content are clear
- [ ] Length is justified by complexity and value
- [ ] Success criteria are measurable and specific
- [ ] Style matches existing skill (emoji, formatting, tone)
- [ ] Real model IDs from OpenRouter are used
- [ ] Examples include realistic cost estimates
- [ ] Troubleshooting guidance is included

---

## 9. Next Steps

1. **Review this design document** with stakeholders
2. **Validate code examples** - Ensure all TypeScript compiles and bash runs
3. **Test mapping pattern** - Verify labels correctly map to IDs
4. **Verify cost calculations** - Check pricing with OpenRouter API
5. **Write the actual section** based on this design
6. **Insert into skill file** at line 200
7. **Test with AI agent** - Verify agent can follow pattern
8. **Iterate based on feedback** - Refine examples and explanations

---

**Design Document Version:** 1.0.0
**Status:** Ready for Review
**Last Updated:** November 19, 2025
