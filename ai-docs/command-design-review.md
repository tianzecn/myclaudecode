# Command Design: `/review` - Multi-Model Code Review Orchestrator

## Overview

**Command Type**: Orchestrator
**Purpose**: Orchestrate comprehensive multi-model code review workflow with parallel execution
**Plugin**: Frontend Development Plugin
**Version**: 1.0.0

### Mission Statement

Provide developers with comprehensive, multi-perspective code review by orchestrating reviews across multiple AI models in parallel, consolidating feedback with consensus analysis, and presenting actionable insights prioritized by reviewer agreement.

### Key Capabilities

1. **Flexible Review Targets** - Review unstaged changes, specific files/directories, or commit ranges
2. **Multi-Model Selection** - Choose up to 9 external AI models + 1 embedded reviewer
3. **Parallel Execution** - Run all reviews simultaneously for 3-5x speed improvement
4. **Consensus Analysis** - Highlight issues flagged by multiple models (high confidence)
5. **Cost Transparency** - Display estimated costs before running external models
6. **Graceful Degradation** - Works with embedded reviewer only if Claudish unavailable

---

## Key Design Innovation: Parallel Execution Architecture

### The Performance Breakthrough

**Problem**: Running multiple external model reviews sequentially takes 15-30 minutes
**Solution**: Execute ALL external reviews in parallel using Claude Code's multi-task pattern
**Result**: 3-5x speedup (5 minutes vs 15 minutes for 3 models)

### How Parallel Execution Works

Claude Code's Task tool supports **multiple task invocations in a single message**, executing them all in parallel:

```markdown
[Single message with multiple Task calls - ALL execute simultaneously]

Task: senior-code-reviewer

PROXY_MODE: x-ai/grok-code-fast-1

Review the code changes via Grok model.

INPUT FILE (read yourself):
- ai-docs/code-review-context.md

OUTPUT FILE (write review here):
- ai-docs/code-review-grok.md

RETURN: Brief verdict only.

---

Task: senior-code-reviewer

PROXY_MODE: google/gemini-2.5-flash

Review the code changes via Gemini Flash model.

INPUT FILE (read yourself):
- ai-docs/code-review-context.md

OUTPUT FILE (write review here):
- ai-docs/code-review-gemini-flash.md

RETURN: Brief verdict only.

---

Task: senior-code-reviewer

PROXY_MODE: deepseek/deepseek-chat

Review the code changes via DeepSeek model.

INPUT FILE (read yourself):
- ai-docs/code-review-context.md

OUTPUT FILE (write review here):
- ai-docs/code-review-deepseek.md

RETURN: Brief verdict only.
```

### Performance Comparison

**Sequential Execution (OLD WAY - DO NOT USE)**:
```
Model 1: 5 minutes (start at T+0, finish at T+5)
Model 2: 5 minutes (start at T+5, finish at T+10)
Model 3: 5 minutes (start at T+10, finish at T+15)
Total Time: 15 minutes
```

**Parallel Execution (THIS IMPLEMENTATION)**:
```
Model 1: 5 minutes (start at T+0, finish at T+5)
Model 2: 5 minutes (start at T+0, finish at T+5)
Model 3: 5 minutes (start at T+0, finish at T+5)
Total Time: max(5, 5, 5) = 5 minutes
```

**Speedup**: 15 min → 5 min = **3x faster**

### Implementation Requirements

1. **Single Message Pattern**: All Task invocations MUST be in ONE message
2. **Task Separation**: Use `---` separator between Task blocks
3. **Independent Tasks**: Each task must be self-contained (no dependencies)
4. **Output Files**: Each task writes to different file (no conflicts)
5. **Wait for All**: Orchestrator waits for ALL tasks to complete before Phase 4

### Why This Is Critical

This parallel execution pattern is the **KEY INNOVATION** that makes multi-model review practical:
- Without it: 15-30 minutes for 3-6 models (users won't wait)
- With it: 5-10 minutes for same review (acceptable UX)

**Implementation Note**: See PHASE 3 (Step 3.2) for detailed execution workflow.

---

## Design Considerations

### 1. Parallel Execution Strategy

**See Top-Level Section**: [Key Design Innovation: Parallel Execution Architecture](#key-design-innovation-parallel-execution-architecture)

The parallel execution pattern (3-5x speedup) is the KEY INNOVATION that makes multi-model review practical. All implementation details, code examples, and performance comparisons are documented in the dedicated section above.

**Quick Summary**:
- Execute ALL external reviews in parallel using single-message multi-Task pattern
- 3x faster: 5 minutes vs 15 minutes for 3 models
- Critical for user experience (users won't wait 15-30 minutes)

### 2. Consensus Highlighting

**Rationale**: Issues flagged by multiple models = higher confidence, reduce false positives

**Consensus Levels**:
- **Unanimous** (100% agreement) - Very high confidence, critical to address
- **Strong Consensus** (>66% agreement) - High confidence, recommended to address
- **Majority** (>50% agreement) - Medium confidence, should consider
- **Divergent** (1 model only) - Low confidence, may be model bias or edge case

**Example**:
```
Issue: "Missing input validation on user registration endpoint"
- Flagged by: Grok, GPT-5 Codex, Gemini Pro (3/5 reviewers = 60% = Majority)
- Confidence: HIGH
- Priority: CRITICAL
```

### 3. Cost Transparency

**Approach**: Show estimated costs BEFORE running external models

**Cost Calculation**:
- Estimate tokens for code being reviewed (lines of code × 1.5 for context)
- Look up pricing per model from OpenRouter
- Calculate: (input_tokens × input_cost) + (output_tokens × output_cost)
- Show total estimated cost with breakdown

**Example Display**:
```markdown
💰 Estimated Review Costs:

External Models Selected: 3
- x-ai/grok-code-fast-1: ~$0.15-0.30 (fast)
- openai/gpt-5-codex: ~$0.30-0.50 (advanced)
- google/gemini-2.5-flash: ~$0.10-0.20 (affordable)

Total Estimated Cost: $0.55-1.00

Proceed with multi-model review? [Yes/No/Select Different Models]
```

### 4. Graceful Degradation

**Scenario 1**: Claudish not installed
- Show informational message about external model benefits
- Proceed with embedded (local) Claude Sonnet reviewer only
- Command still provides value

**Scenario 2**: OPENROUTER_API_KEY not set
- Show setup instructions
- Offer to proceed with embedded reviewer only
- Don't block workflow

**Scenario 3**: One external model fails
- Continue with remaining reviewers
- Log failure in consolidation report
- Don't fail entire review

### 5. Review Target Flexibility

**Option 1: All Unstaged Changes (Default)**
- Run `git diff` to get changes
- Summarize changes and show to user
- User confirms before review

**Option 2: Specific Files/Directories**
- User provides paths (can be multiple)
- Read files and prepare for review
- Support globs: `src/components/**/*.tsx`

**Option 3: Recent Commits**
- User specifies commit range (e.g., `HEAD~3..HEAD`)
- Run `git diff {range}` to get changes
- Show commit messages for context

---

## Command Structure (XML Format)

### Core Tags

```xml
<mission>
  Orchestrate comprehensive multi-model code review workflow with parallel execution,
  consensus analysis, and actionable insights prioritized by reviewer agreement.
</mission>

<user_request>
  $ARGUMENTS
</user_request>

<instructions>
  <critical_constraints>
    <orchestrator_role>
      You are an ORCHESTRATOR, not an IMPLEMENTER.
      - MUST: Use Task tool to delegate ALL reviews to senior-code-reviewer agent
      - MUST: Use TodoWrite to track all 5 phases
      - MUST: Execute external reviews in PARALLEL (single message, multiple Task calls)
      - MUST NOT: Use Write or Edit tools (only reviewers write to files)
    </orchestrator_role>

    <cost_transparency>
      Before running external models, MUST show estimated costs and get user approval.
    </cost_transparency>

    <graceful_degradation>
      If Claudish unavailable or no external models selected, proceed with embedded
      Claude Sonnet reviewer only. Command must always provide value.
    </graceful_degradation>
  </critical_constraints>

  <workflow>
    <step number="0">Initialize TodoWrite with 5 phases before starting</step>
    <step number="1">PHASE 1: Determine what to review (unstaged/files/commits)</step>
    <step number="2">PHASE 2: Select AI models (multi-select, up to 9 external + 1 embedded)</step>
    <step number="3">PHASE 3: Execute ALL reviews in parallel (one message, multiple Tasks)</step>
    <step number="4">PHASE 4: Consolidate reviews with consensus analysis</step>
    <step number="5">PHASE 5: Present consolidated results with priorities</step>
  </workflow>
</instructions>
```

---

## Detailed Workflow (5 Phases)

### PHASE 0: Initialize TodoWrite

**BEFORE starting any phase**, create global workflow todo list:

```javascript
TodoWrite([
  {
    content: "PHASE 1: Ask user what to review",
    status: "in_progress",
    activeForm: "PHASE 1: Asking user what to review"
  },
  {
    content: "PHASE 1: Gather review target (git diff/files/commits)",
    status: "pending",
    activeForm: "PHASE 1: Gathering review target"
  },
  {
    content: "PHASE 2: Present model selection options",
    status: "pending",
    activeForm: "PHASE 2: Presenting model selection options"
  },
  {
    content: "PHASE 2: Show estimated costs and get approval",
    status: "pending",
    activeForm: "PHASE 2: Showing estimated costs"
  },
  {
    content: "PHASE 3: Execute embedded (local) review",
    status: "pending",
    activeForm: "PHASE 3: Executing embedded review"
  },
  {
    content: "PHASE 3: Execute ALL external reviews in parallel",
    status: "pending",
    activeForm: "PHASE 3: Executing external reviews in parallel"
  },
  {
    content: "PHASE 4: Read all review files",
    status: "pending",
    activeForm: "PHASE 4: Reading all review files"
  },
  {
    content: "PHASE 4: Analyze consensus and consolidate feedback",
    status: "pending",
    activeForm: "PHASE 4: Analyzing consensus"
  },
  {
    content: "PHASE 4: Write consolidated report",
    status: "pending",
    activeForm: "PHASE 4: Writing consolidated report"
  },
  {
    content: "PHASE 5: Present final results to user",
    status: "pending",
    activeForm: "PHASE 5: Presenting final results"
  }
]);
```

---

### PHASE 1: What to Review

#### Step 1.1: Ask User What to Review

Use `AskUserQuestion` to present options:

```markdown
What would you like to review?

1. **All unstaged changes** (default) - Review all uncommitted changes in working directory
2. **Specific files/directories** - Review selected files (you'll provide paths)
3. **Recent commits** - Review changes in commit range (you'll specify range)

Please select 1, 2, or 3 (or just hit Enter for option 1).
```

**Store user selection** as `review_target_type`.

#### Step 1.2: Gather Review Target

Based on `review_target_type`, gather code to review:

**Option 1: All Unstaged Changes**

```bash
# Check for changes
git status

# If changes exist, get diff
git diff
```

**If NO changes found**:
```markdown
ℹ️ No unstaged changes found.

You have no uncommitted changes in your working directory.

Options:
- Review recent commits instead? (I can review HEAD~3..HEAD)
- Review specific files? (Provide file paths)
- Exit review workflow

What would you like to do?
```

Exit gracefully if user chooses to exit.

**If changes found**:
- Summarize what changed (files modified, lines added/removed)
- Show brief diff summary
- Ask user to confirm before proceeding:

```markdown
📋 Review Target Summary

Files Changed: 5
- src/components/UserProfile.tsx (+45, -12)
- src/services/userService.ts (+23, -8)
- src/types/user.ts (+10, -0)
- tests/unit/userService.test.ts (+67, -15)
- src/pages/ProfilePage.tsx (+15, -3)

Total: +160, -38 lines

Proceed with review of these changes? [Yes/No/Show Details]
```

**Option 2: Specific Files/Directories**

```markdown
Please provide the files or directories to review.

You can specify:
- Individual files: src/components/UserProfile.tsx
- Multiple files: src/services/*.ts
- Directories: src/components/
- Globs: src/**/*.tsx

Enter paths (comma-separated or one per line):
```

Store paths, use Glob to expand globs, then Read files.

**Option 3: Recent Commits**

```markdown
Please specify the commit range to review.

Examples:
- Last 3 commits: HEAD~3..HEAD
- Specific range: abc123..def456
- Since branch: main..feature-branch

Enter commit range:
```

Run `git diff {range}` to get changes.

#### Step 1.3: Prepare Review Context

Create a structured review context file for reviewers:

**File**: `ai-docs/code-review-context.md`

```markdown
# Code Review Context

## Review Target
Type: [Unstaged Changes | Specific Files | Commit Range]
Timestamp: 2025-11-14 14:30:00

## Files Under Review
1. src/components/UserProfile.tsx (+45, -12)
2. src/services/userService.ts (+23, -8)
3. src/types/user.ts (+10, -0)
4. tests/unit/userService.test.ts (+67, -15)
5. src/pages/ProfilePage.tsx (+15, -3)

## Summary of Changes
[Brief 2-3 sentence summary of what changed and why]

## Git Diff
```diff
[Full git diff output here]
```

## Review Instructions
Please review this code for:
1. Security vulnerabilities (OWASP standards)
2. Code simplicity and maintainability
3. Performance issues
4. Type safety and error handling
5. Test coverage adequacy
6. Adherence to best practices
```

**Update TodoWrite**: Mark PHASE 1 tasks as completed, mark PHASE 2 as in_progress.

---

### PHASE 2: Model Selection

#### Step 2.1: Check Claudish Availability

```bash
# Check if Claudish is available
npx claudish --version 2>&1
```

**If Claudish NOT available**:

```markdown
ℹ️ Claudish CLI Not Found

Multi-model code review requires Claudish CLI for external AI model integration.

**Options**:
1. **Install Claudish** (recommended):
   ```bash
   npm install -g claudish
   # or use npx (already works without install)
   ```

2. **Proceed with embedded Claude Sonnet reviewer only** (single model, no external costs)

What would you like to do? [Install/Embedded Only/Cancel]
```

- If "Install": Wait for user to install, then re-check
- If "Embedded Only": Set `external_models = []`, skip model selection
- If "Cancel": Exit workflow gracefully

**If Claudish available**, check `OPENROUTER_API_KEY`:

```bash
# Check if API key is set
if [ -z "$OPENROUTER_API_KEY" ]; then
  echo "OPENROUTER_API_KEY not set"
fi
```

**If API key NOT set**:

```markdown
⚠️ OpenRouter API Key Not Set

To use external AI models, you need an OpenRouter API key.

**Setup Instructions**:
1. Get API key from: https://openrouter.ai/keys
2. Set environment variable:
   ```bash
   export OPENROUTER_API_KEY='sk-or-v1-your-key-here'
   ```
3. Or add to project .env file:
   ```bash
   echo 'OPENROUTER_API_KEY=sk-or-v1-your-key-here' >> .env
   ```

**Options**:
1. **Set API key now** (I'll wait)
2. **Proceed with embedded reviewer only** (no external costs)
3. **Cancel review**

What would you like to do? [Setup/Embedded Only/Cancel]
```

#### Step 2.2: Present Model Selection

Use `AskUserQuestion` for multi-select model picker:

```markdown
🤖 Select AI Models for Code Review

You can select up to 9 external models + 1 embedded reviewer.

**Recommended Models** (check all that apply):

External Models (via OpenRouter):
□ x-ai/grok-code-fast-1 - xAI Grok (fast coding) [$0.15-0.30]
□ google/gemini-2.5-flash - Gemini Flash (fast & affordable) [$0.10-0.20]
□ google/gemini-2.5-pro - Gemini Pro (advanced reasoning) [$0.25-0.45]
□ deepseek/deepseek-chat - DeepSeek (reasoning specialist) [$0.10-0.20]
□ openai/gpt-5-codex - GPT-5 Codex (advanced analysis) [$0.30-0.50]
□ anthropic/claude-sonnet-4.5 - Claude (different perspective) [$0.35-0.55]
□ Custom model ID (you can type OpenRouter format: provider/model)

Embedded Reviewer (local, no cost):
☑ Claude Sonnet 4.5 (embedded) - Senior code reviewer [FREE]

**Default**: Embedded only (if you skip selection)

Enter your selections (numbers or model IDs, comma-separated):
```

**Parse user selection**:
- Extract selected model IDs
- If "Custom" selected, ask for model ID:
  ```markdown
  Enter custom OpenRouter model ID (format: provider/model-name):

  Examples:
  - qwen/qwen3-vl-235b-a22b-instruct
  - minimax/minimax-m2
  - x-ai/grok-code-fast-1

  See full list: https://openrouter.ai/models
  ```
- Validate model IDs (basic format check: `provider/model-name`)
- Store as `selected_external_models` (array)
- Store `use_embedded = true` if embedded selected

#### Step 2.3: Estimate and Show Costs

**Calculate estimated costs** for external models:

```javascript
// Pseudo-code for cost estimation
function estimateCosts(reviewContext, models) {
  const codeLines = countLines(reviewContext.diff);

  // INPUT TOKENS: Code context + review instructions + system prompt
  const estimatedInputTokens = codeLines * 1.5; // Context + instructions

  // OUTPUT TOKENS: Review is primarily output (varies by complexity)
  // Simple reviews: ~1500 tokens
  // Medium reviews: ~2500 tokens
  // Complex reviews: ~4000 tokens
  const estimatedOutputTokensMin = 2000; // Conservative estimate
  const estimatedOutputTokensMax = 4000; // Upper bound for complex reviews

  const costs = models.map(model => {
    const pricing = getModelPricing(model); // From OpenRouter API

    // Calculate separate input/output costs
    const inputCost = (estimatedInputTokens / 1000000) * pricing.input;
    const outputCostMin = (estimatedOutputTokensMin / 1000000) * pricing.output;
    const outputCostMax = (estimatedOutputTokensMax / 1000000) * pricing.output;

    return {
      model,
      inputCost,
      outputCostMin,
      outputCostMax,
      totalMin: inputCost + outputCostMin,
      totalMax: inputCost + outputCostMax
    };
  });

  return costs;
}

// IMPORTANT: Output tokens typically cost 3-5x more than input tokens
// Reviews are OUTPUT-heavy (generating analysis), so costs vary significantly
// by review depth, model verbosity, and code complexity.
```

**Present cost estimate**:

```markdown
💰 Estimated Review Costs

**Code Size**: ~350 lines (estimated ~525 input tokens per review)

**External Models Selected**: 3

| Model | Input Cost | Output Cost (Range) | Total (Range) |
|-------|-----------|---------------------|---------------|
| x-ai/grok-code-fast-1 | $0.08 | $0.15 - $0.30 | $0.23 - $0.38 |
| google/gemini-2.5-flash | $0.05 | $0.10 - $0.20 | $0.15 - $0.25 |
| deepseek/deepseek-chat | $0.05 | $0.10 - $0.20 | $0.15 - $0.25 |

**Total Estimated Cost**: $0.53 - $0.88

**Embedded Reviewer**: Claude Sonnet 4.5 (FREE - included)

**Cost Breakdown**:
- Input tokens (code context): Fixed per review (~$0.05-$0.08 per model)
- Output tokens (review analysis): Variable by complexity (~2000-4000 tokens)
- Output tokens cost 3-5x more than input tokens

**Note**: Actual costs may vary based on review depth, code complexity, and model verbosity.
Higher-quality models may generate more detailed reviews (higher output tokens).

Proceed with multi-model review? [Yes/No/Change Selection]
```

**Handle user response**:
- "Yes": Proceed to PHASE 3
- "No": Exit workflow gracefully
- "Change Selection": Go back to Step 2.2

**Update TodoWrite**: Mark PHASE 2 tasks as completed, mark PHASE 3 as in_progress.

---

### PHASE 3: Parallel Multi-Model Review

#### Step 3.1: Execute Embedded Review (Always)

**Always run embedded reviewer first** (even if external models selected):

```markdown
Launching embedded Claude Sonnet 4.5 code reviewer...
```

Use Task tool to delegate to senior-code-reviewer agent (NO PROXY_MODE):

```
Task: senior-code-reviewer

Review the code changes for security, simplicity, maintainability, and best practices.

INPUT FILE (read yourself):
- ai-docs/code-review-context.md

OUTPUT FILE (write your review here):
- ai-docs/code-review-local.md

RETURN: Brief verdict only (use the template from your agent configuration).
```

**Wait for embedded review to complete**, then update TodoWrite.

#### Step 3.2: Execute ALL External Reviews in PARALLEL

**CRITICAL**: This is the key optimization (3-5x speedup).

**See**: [Key Design Innovation: Parallel Execution Architecture](#key-design-innovation-parallel-execution-architecture) for complete implementation details, code examples, and performance analysis.

**Summary**: Run ALL external model reviews in a SINGLE message with multiple Task calls.

**Example message to send**:

```markdown
Launching 3 external code reviewers in parallel:
- x-ai/grok-code-fast-1 (Grok - fast coding)
- google/gemini-2.5-flash (Gemini Flash - affordable)
- deepseek/deepseek-chat (DeepSeek - reasoning)

This will take ~5 minutes (parallel execution)...

[Then send single message with 3 Task invocations - see top-level section for template]
```

**Implementation Pattern**: Single message with multiple Task blocks separated by `---`

**Each Task Block Format**:
```
Task: senior-code-reviewer
PROXY_MODE: {model_id}
[Input/Output file specifications]
```

**Result**: All tasks execute simultaneously, total time = max(individual times) instead of sum

**Track Progress**:
```markdown
✅ Embedded review complete (1/4)
⏳ External reviews in progress (0/3)...

✅ Embedded review complete (1/4)
✅ Grok review complete (2/4)
⏳ External reviews in progress (1/3)...

✅ Embedded review complete (1/4)
✅ Grok review complete (2/4)
✅ Gemini Flash review complete (3/4)
⏳ External reviews in progress (2/3)...

✅ All reviews complete (4/4)
```

**Update TodoWrite**: Mark PHASE 3 tasks as completed, mark PHASE 4 as in_progress.

#### Step 3.3: Handle Review Failures

If any external review fails:

```markdown
⚠️ Review Status

✅ Embedded (Claude Sonnet): Complete
✅ Grok: Complete
❌ Gemini Flash: Failed (timeout)
✅ DeepSeek: Complete

**Note**: Proceeding with 3/4 reviews. Consolidation will note the failure.
```

**Don't block workflow** - continue with available reviews.

---

### PHASE 4: Consolidate Reviews

#### Step 4.1: Read All Review Files

Use Read tool to read all completed review files:

```
Read: ai-docs/code-review-local.md
Read: ai-docs/code-review-grok.md
Read: ai-docs/code-review-gemini-flash.md
Read: ai-docs/code-review-deepseek.md
```

Store each review in memory for consolidation.

#### Step 4.2: Parse and Normalize Reviews

Extract structured data from each review:

```javascript
// Pseudo-code for parsing
function parseReview(reviewContent) {
  return {
    reviewer: extractReviewerName(reviewContent),
    verdict: extractVerdict(reviewContent), // PASSED/REQUIRES_IMPROVEMENT/FAILED
    issues: {
      critical: extractIssues(reviewContent, "CRITICAL"),
      medium: extractIssues(reviewContent, "MEDIUM"),
      low: extractIssues(reviewContent, "LOW")
    },
    strengths: extractStrengths(reviewContent)
  };
}

// Normalize issue descriptions for comparison
function normalizeIssue(issue) {
  // Extract key concepts, ignore wording differences
  return {
    title: extractTitle(issue),
    category: categorizeIssue(issue), // Security/Performance/Type Safety/etc.
    severity: issue.severity,
    location: extractLocation(issue),
    description: issue.description
  };
}
```

#### Step 4.3: Identify Consensus Issues

**Algorithm for consensus detection**:

```javascript
function findConsensusIssues(allReviews) {
  const allIssues = [];

  // Flatten all issues from all reviewers
  for (const review of allReviews) {
    for (const severity of ['critical', 'medium', 'low']) {
      for (const issue of review.issues[severity]) {
        allIssues.push({
          ...normalizeIssue(issue),
          reviewer: review.reviewer,
          severity
        });
      }
    }
  }

  // Group similar issues
  const issueGroups = groupSimilarIssues(allIssues);

  // Calculate consensus for each group
  const consensusIssues = issueGroups.map(group => {
    const reviewerCount = allReviews.length;
    const flaggedByCount = new Set(group.map(i => i.reviewer)).size;
    const agreementPercent = (flaggedByCount / reviewerCount) * 100;

    return {
      title: group[0].title,
      category: group[0].category,
      severity: getMostSevereSeverity(group),
      flaggedBy: [...new Set(group.map(i => i.reviewer))],
      agreementPercent,
      consensusLevel: getConsensusLevel(agreementPercent),
      descriptions: group.map(i => ({
        reviewer: i.reviewer,
        description: i.description
      }))
    };
  });

  // Sort by consensus level, then severity
  return consensusIssues.sort((a, b) => {
    if (a.agreementPercent !== b.agreementPercent) {
      return b.agreementPercent - a.agreementPercent; // Higher agreement first
    }
    return severityWeight(b.severity) - severityWeight(a.severity);
  });
}

function getConsensusLevel(agreementPercent) {
  if (agreementPercent === 100) return "UNANIMOUS";
  if (agreementPercent >= 67) return "STRONG_CONSENSUS";
  if (agreementPercent >= 50) return "MAJORITY";
  return "DIVERGENT";
}

function groupSimilarIssues(issues) {
  // SIMPLIFIED ALGORITHM (v1.0): Keyword-based matching with confidence threshold
  // Advanced ML-based grouping deferred to v2.0 for reliability
  //
  // Strategy: Conservative grouping with fallback to preserve separate items
  // if confidence is low. Better to have duplicates than miss real issues.

  const groups = [];
  const used = new Set();

  for (let i = 0; i < issues.length; i++) {
    if (used.has(i)) continue;

    const group = [issues[i]];
    used.add(i);

    for (let j = i + 1; j < issues.length; j++) {
      if (used.has(j)) continue;

      const similarity = calculateSimilarity(issues[i], issues[j]);

      // Conservative threshold: Only group if high confidence (>0.6)
      if (similarity.score > 0.6 && similarity.confidence === 'high') {
        group.push(issues[j]);
        used.add(j);
      } else if (similarity.confidence === 'low') {
        // Low confidence: Preserve as separate item (don't group)
        // Better to have duplicates than incorrectly merge different issues
        continue;
      }
    }

    groups.push(group);
  }

  return groups;
}

function calculateSimilarity(issue1, issue2) {
  // Multi-factor similarity scoring with confidence levels

  // Factor 1: Category must match (hard requirement)
  if (issue1.category !== issue2.category) {
    return { score: 0, confidence: 'high' }; // Different categories = definitely different issues
  }

  // Factor 2: Location must match (hard requirement)
  if (issue1.location !== issue2.location) {
    return { score: 0, confidence: 'high' }; // Different locations = different issues
  }

  // Factor 3: Keyword overlap (soft requirement)
  const keywords1 = extractKeywords(issue1.description);
  const keywords2 = extractKeywords(issue2.description);

  const overlap = keywords1.filter(k => keywords2.includes(k)).length;
  const union = new Set([...keywords1, ...keywords2]).size;
  const keywordScore = overlap / union; // Jaccard similarity

  // Confidence assessment based on keyword count
  let confidence = 'high';
  if (keywords1.length < 3 || keywords2.length < 3) {
    confidence = 'low'; // Too few keywords to reliably compare
  } else if (overlap === 0) {
    confidence = 'high'; // No overlap = definitely different
  } else if (keywordScore > 0.8) {
    confidence = 'high'; // Very high overlap = definitely similar
  } else if (keywordScore < 0.4) {
    confidence = 'high'; // Very low overlap = definitely different
  } else {
    confidence = 'medium'; // Ambiguous range (0.4-0.8)
  }

  return {
    score: keywordScore,
    confidence: confidence
  };
}

function extractKeywords(description) {
  // Simple keyword extraction (v1.0)
  // Extract meaningful terms, ignore common words

  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'this', 'that', 'these', 'those', 'it', 'its', 'should', 'could', 'would'
  ]);

  const words = description
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  return [...new Set(words)]; // Deduplicate
}
```

#### Step 4.4: Create Consolidated Report

Write consolidated report to `ai-docs/code-review-consolidated.md`:

```markdown
# Multi-Model Code Review - Consolidated Report

**Review Date**: 2025-11-14 14:35:00
**Code Review Context**: ai-docs/code-review-context.md

---

## Executive Summary

**Models Consulted**: 4 (1 embedded + 3 external)
- ✅ Claude Sonnet 4.5 (embedded)
- ✅ x-ai/grok-code-fast-1
- ✅ google/gemini-2.5-flash
- ✅ deepseek/deepseek-chat

**Overall Verdict**: REQUIRES IMPROVEMENT
**Recommendation**: Address 2 unanimous critical issues before proceeding

**Issue Breakdown**:
- Unanimous (100% agreement): 2 critical, 1 medium
- Strong Consensus (75% agreement): 1 critical, 3 medium
- Majority (50% agreement): 2 medium, 4 low
- Divergent (1 reviewer only): 5 low

**Estimated Total Cost**: $0.53

---

## 🚨 Unanimous Issues (100% Agreement - VERY HIGH CONFIDENCE)

### Issue 1: Missing Input Validation on User Registration
**Flagged by**: ALL 4 reviewers
**Severity**: CRITICAL
**Category**: Security
**Location**: src/services/userService.ts:45-67
**Confidence**: VERY HIGH (100% agreement)

**Consolidated Description**:
All reviewers identified missing input validation for user registration data. The service accepts raw user input without validating email format, password strength, or sanitizing potentially malicious input.

**Reviewer Perspectives**:
- **Claude Sonnet**: "No Zod schema validation before database insertion. SQL injection risk."
- **Grok**: "Missing input sanitization. User data flows directly to database without validation."
- **Gemini Flash**: "Input validation absent. Email and password not validated against security standards."
- **DeepSeek**: "No input validation layer. Registration endpoint vulnerable to malformed data."

**Recommended Fix**:
```typescript
import { z } from 'zod';

const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  name: z.string().min(1).max(100)
});

export const registerUser = async (data: unknown) => {
  const validatedData = userRegistrationSchema.parse(data); // Throws if invalid
  // ... rest of implementation
};
```

**Priority**: 🔴 MUST FIX BEFORE MERGE

---

### Issue 2: Async Error Handling Not Implemented
**Flagged by**: ALL 4 reviewers
**Severity**: CRITICAL
**Category**: Error Handling
**Location**: src/controllers/userController.ts:23-45
**Confidence**: VERY HIGH (100% agreement)

**Consolidated Description**:
Controllers don't properly handle promise rejections. Unhandled promise rejections will crash the application or return 500 errors without context.

**Reviewer Perspectives**:
- **Claude Sonnet**: "Controllers missing try-catch for async operations. Unhandled rejections."
- **Grok**: "No error boundary for async functions. Promise rejections not caught."
- **Gemini Flash**: "Async/await without error handling. Server crashes on rejected promises."
- **DeepSeek**: "Error handling absent in async controller methods. 500 errors without details."

**Recommended Fix**:
```typescript
export const createUser = async (c: Context) => {
  try {
    const data = c.get('validatedData');
    const user = await userService.createUser(data);
    return c.json(user, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return c.json({ error: error.message }, 400);
    }
    if (error instanceof NotFoundError) {
      return c.json({ error: error.message }, 404);
    }
    // Log unexpected errors, don't expose internals
    console.error('Unexpected error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
```

**Priority**: 🔴 MUST FIX BEFORE MERGE

---

## ⚠️ Strong Consensus Issues (67-99% Agreement - HIGH CONFIDENCE)

### Issue 3: Inefficient Database Query (N+1 Problem)
**Flagged by**: Claude Sonnet, Grok, DeepSeek (3/4 = 75%)
**Severity**: CRITICAL
**Category**: Performance
**Location**: src/services/postService.ts:89-102
**Confidence**: HIGH (75% agreement)

**Consolidated Description**:
The `getUserPosts` function queries posts individually in a loop instead of using a batch query, causing N+1 database queries.

**Recommended Fix**:
```typescript
// ❌ Before (N+1 queries)
const posts = await userRepository.findUserIds(userId);
for (const post of posts) {
  post.author = await userRepository.findById(post.authorId);
}

// ✅ After (2 queries total)
const posts = await postRepository.findByUserIdWithAuthor(userId);
```

**Priority**: 🟠 RECOMMENDED TO FIX

**Note**: Gemini Flash didn't flag this - may have missed the N+1 pattern.

---

## 💬 Majority Issues (50-66% Agreement - MEDIUM CONFIDENCE)

[... more issues ...]

---

## 💭 Divergent Issues (Single Reviewer - LOW CONFIDENCE)

These issues were flagged by only one reviewer. They may be valid edge cases or model-specific concerns. Review carefully.

### Issue 10: TypeScript `any` Usage in Helper Functions
**Flagged by**: Claude Sonnet only (1/4 = 25%)
**Severity**: LOW
**Category**: Type Safety
**Location**: src/utils/helpers.ts:15-23

**Description**:
Claude Sonnet noted 3 instances of `any` type usage. Other reviewers didn't flag this, possibly because the code works correctly despite weak typing.

**Recommendation**: Consider fixing for better type safety, but not blocking.

---

## ✅ Code Strengths (Acknowledged by Multiple Reviewers)

**Strengths mentioned by 3+ reviewers**:
- ✅ Clean layered architecture (Routes → Controllers → Services → Repositories)
- ✅ Comprehensive test coverage (87% per tests)
- ✅ Good use of TypeScript strict mode
- ✅ Clear naming conventions and code organization

**Strengths mentioned by 2 reviewers**:
- ✅ Proper use of repository pattern
- ✅ Separation of concerns between layers

---

## Model Agreement Matrix

| Issue | Claude | Grok | Gemini | DeepSeek | Agreement |
|-------|--------|------|--------|----------|-----------|
| Missing input validation | ✅ | ✅ | ✅ | ✅ | 100% |
| Async error handling | ✅ | ✅ | ✅ | ✅ | 100% |
| N+1 query problem | ✅ | ✅ | ❌ | ✅ | 75% |
| Weak password hashing | ✅ | ✅ | ✅ | ❌ | 75% |
| Missing rate limiting | ✅ | ❌ | ✅ | ✅ | 75% |
| Incomplete error messages | ✅ | ✅ | ❌ | ❌ | 50% |
| TypeScript `any` usage | ✅ | ❌ | ❌ | ❌ | 25% |

---

## Actionable Recommendations (Prioritized by Consensus)

### 🔴 MUST FIX (Unanimous Critical Issues)
1. **Add input validation** (Issue #1) - All reviewers agree this is critical
2. **Implement async error handling** (Issue #2) - All reviewers agree this is critical

### 🟠 SHOULD FIX (Strong Consensus Issues)
3. **Fix N+1 query** (Issue #3) - 3/4 reviewers flagged
4. **Strengthen password hashing** (Issue #4) - 3/4 reviewers flagged
5. **Add rate limiting** (Issue #5) - 3/4 reviewers flagged

### 🟡 CONSIDER FIXING (Majority Issues)
6. **Improve error messages** (Issue #6) - 2/4 reviewers flagged
7. **Add request timeout handling** (Issue #7) - 2/4 reviewers flagged

### ⚪ OPTIONAL (Divergent Issues)
8. **Review TypeScript `any` usage** (Issue #10) - 1 reviewer flagged
9. **Add JSDoc comments** (Issue #11) - 1 reviewer flagged

---

## Summary

**Overall Assessment**: Code is functional but has 2 critical security/error handling issues that MUST be addressed before merge. The unanimous agreement from all reviewers on these issues gives very high confidence they are real problems.

**Next Steps**:
1. Fix 2 unanimous critical issues (input validation + error handling)
2. Consider fixing 3 strong consensus issues (N+1 query, password hashing, rate limiting)
3. Re-run review after fixes to verify resolution

**Review Cost**: $0.53 (external models) + FREE (embedded)

---

## Individual Review Files

For detailed analysis from each reviewer:
- [Claude Sonnet Review](./code-review-local.md)
- [Grok Review](./code-review-grok.md)
- [Gemini Flash Review](./code-review-gemini-flash.md)
- [DeepSeek Review](./code-review-deepseek.md)
```

**Update TodoWrite**: Mark PHASE 4 tasks as completed, mark PHASE 5 as in_progress.

---

### PHASE 5: Present Results

#### Step 5.1: Generate User Summary

Create a brief, actionable summary for the user (NOT the full consolidated report):

```markdown
## 🎯 Multi-Model Code Review Complete

**Reviewers**: 4 AI models (1 embedded + 3 external)
- ✅ Claude Sonnet 4.5 (embedded)
- ✅ x-ai/grok-code-fast-1
- ✅ google/gemini-2.5-flash
- ✅ deepseek/deepseek-chat

**Total Cost**: $0.53 (external models)

---

## 📊 Results Summary

**Overall Verdict**: ⚠️ REQUIRES IMPROVEMENT

**Issues Found**:
- 🔴 Critical: 4 (2 unanimous, 2 strong consensus)
- 🟠 Medium: 7 (1 unanimous, 3 strong consensus, 3 majority)
- 🟡 Low: 9 (4 majority, 5 divergent)

**High-Confidence Issues** (flagged by multiple reviewers):
- Unanimous (100%): 3 issues
- Strong Consensus (67-99%): 6 issues

---

## 🚨 Top 5 Most Important Issues (by consensus)

### 1. Missing Input Validation on User Registration [CRITICAL]
- **Flagged by**: ALL 4 reviewers (100% agreement)
- **Location**: src/services/userService.ts:45-67
- **Impact**: Security vulnerability - SQL injection risk
- **Fix**: Add Zod schema validation before database operations

### 2. Async Error Handling Not Implemented [CRITICAL]
- **Flagged by**: ALL 4 reviewers (100% agreement)
- **Location**: src/controllers/userController.ts:23-45
- **Impact**: Unhandled promise rejections crash application
- **Fix**: Wrap async operations in try-catch blocks

### 3. Inefficient Database Query (N+1 Problem) [CRITICAL]
- **Flagged by**: 3/4 reviewers (75% agreement)
- **Location**: src/services/postService.ts:89-102
- **Impact**: Performance degradation with large datasets
- **Fix**: Use batch query instead of loop with individual queries

### 4. Weak Password Hashing Configuration [CRITICAL]
- **Flagged by**: 3/4 reviewers (75% agreement)
- **Location**: src/utils/crypto.ts:12-18
- **Impact**: Passwords easier to crack with low bcrypt rounds
- **Fix**: Increase bcrypt rounds to 12+ for production

### 5. Missing Rate Limiting on Auth Endpoints [CRITICAL]
- **Flagged by**: 3/4 reviewers (75% agreement)
- **Location**: src/routes/auth.routes.ts:15-45
- **Impact**: Brute force attack vulnerability
- **Fix**: Add rate limiting middleware (e.g., 5 attempts per 15 min)

---

## ✅ Code Strengths

The reviewers acknowledged these positive aspects:
- ✅ Clean layered architecture
- ✅ Comprehensive test coverage (87%)
- ✅ Good use of TypeScript strict mode
- ✅ Clear naming conventions

---

## 📄 Detailed Reports

**Consolidated Report**: [ai-docs/code-review-consolidated.md](file://ai-docs/code-review-consolidated.md)
- Full issue analysis with consensus levels
- Model agreement matrix
- Actionable recommendations prioritized by consensus
- Individual reviewer perspectives

**Individual Reviews**:
- [Claude Sonnet Review](file://ai-docs/code-review-local.md)
- [Grok Review](file://ai-docs/code-review-grok.md)
- [Gemini Flash Review](file://ai-docs/code-review-gemini-flash.md)
- [DeepSeek Review](file://ai-docs/code-review-deepseek.md)

---

## 💡 Recommendation

**Fix the 2 unanimous critical issues first** (input validation + error handling).

These have 100% reviewer agreement, so confidence is very high they are real problems.

After fixing, consider addressing the 3 strong consensus issues (N+1 query, password hashing, rate limiting).

**Want to re-run review after fixes?**
```
/review
```

---

**Review Complete** ✨
```

**Update TodoWrite**: Mark PHASE 5 as completed. All phases complete.

---

## Agent Delegation Patterns

### When to Use senior-code-reviewer Agent

**Always delegate to senior-code-reviewer for**:
1. **Embedded (local) review** - No PROXY_MODE, direct invocation
2. **External model review** - With PROXY_MODE: {model_id} directive

**Never do reviews yourself** - You are an orchestrator, not a reviewer.

### Proxy Mode Integration Pattern

**For external model reviews**, use this delegation pattern:

```
Task: senior-code-reviewer

PROXY_MODE: {model_id}

Review the code changes via {model_name} model.

INPUT FILE (read yourself):
- ai-docs/code-review-context.md

OUTPUT FILE (write review here):
- ai-docs/code-review-{model_sanitized_name}.md

RETURN: Brief verdict only (use template from your agent configuration).
```

**How Proxy Mode Works**:
1. senior-code-reviewer agent sees `PROXY_MODE: {model_id}` directive
2. Agent reads the review context file itself
3. Agent constructs prompt for external AI
4. Agent calls Claudish CLI: `printf '%s' "$PROMPT" | npx claudish --stdin --model {model_id} --quiet`
5. Claudish routes request to OpenRouter API
6. External AI generates review
7. Agent writes review to specified file
8. Agent returns brief verdict to orchestrator

**Why This Works**:
- Clean separation: Orchestrator coordinates, agent handles proxy logic
- Reusable: Same agent handles both embedded and external reviews
- Testable: Can test proxy mode independently
- Maintainable: Proxy logic in one place (senior-code-reviewer agent)

### Parallel Execution Pattern

**To run multiple external reviews in parallel**:

```markdown
[Single message to Claude Code with multiple Task invocations]

Task: senior-code-reviewer
PROXY_MODE: model-1
[... task details ...]

---

Task: senior-code-reviewer
PROXY_MODE: model-2
[... task details ...]

---

Task: senior-code-reviewer
PROXY_MODE: model-3
[... task details ...]
```

**Claude Code will**:
- Parse all Task invocations from the message
- Launch all tasks in parallel
- Wait for all to complete
- Return results together

**This achieves 3-5x speedup** compared to sequential execution.

---

## Multi-Select Question Formats

### Model Selection Question

Use `AskUserQuestion` for interactive model selection:

```javascript
AskUserQuestion({
  question: `
🤖 Select AI Models for Code Review

You can select up to 9 external models + 1 embedded reviewer.

**Recommended Models** (enter numbers, comma-separated):

External Models (via OpenRouter):
1. x-ai/grok-code-fast-1 - xAI Grok (fast coding) [$0.15-0.30]
2. google/gemini-2.5-flash - Gemini Flash (fast & affordable) [$0.10-0.20]
3. google/gemini-2.5-pro - Gemini Pro (advanced reasoning) [$0.25-0.45]
4. deepseek/deepseek-chat - DeepSeek (reasoning specialist) [$0.10-0.20]
5. openai/gpt-5-codex - GPT-5 Codex (advanced analysis) [$0.30-0.50]
6. anthropic/claude-sonnet-4.5 - Claude (different perspective) [$0.35-0.55]
7. Custom model ID (type OpenRouter format: provider/model)

Embedded Reviewer (local, no cost):
8. Claude Sonnet 4.5 (embedded) - Senior code reviewer [FREE]

**Default**: 8 only (embedded, if you just hit Enter)

**Examples**:
- "1,2,8" = Grok + Gemini Flash + Embedded
- "1,2,3,4,5,8" = All external + Embedded
- "8" or just Enter = Embedded only

Enter your selections:
  `,
  allowEmpty: true // Allow Enter for default
});
```

**Parse Response**:
```javascript
function parseModelSelection(response) {
  if (!response || response.trim() === '') {
    return {
      embedded: true,
      external: []
    };
  }

  const selections = response.split(',').map(s => s.trim());
  const models = {
    embedded: false,
    external: []
  };

  const modelMap = {
    '1': 'x-ai/grok-code-fast-1',
    '2': 'google/gemini-2.5-flash',
    '3': 'google/gemini-2.5-pro',
    '4': 'deepseek/deepseek-chat',
    '5': 'openai/gpt-5-codex',
    '6': 'anthropic/claude-sonnet-4.5'
  };

  for (const sel of selections) {
    if (sel === '8') {
      models.embedded = true;
    } else if (sel === '7') {
      // Ask for custom model ID
      const customId = await AskUserQuestion({
        question: 'Enter custom OpenRouter model ID (format: provider/model-name):'
      });
      models.external.push(customId);
    } else if (modelMap[sel]) {
      models.external.push(modelMap[sel]);
    }
  }

  return models;
}
```

### Review Target Question

```javascript
AskUserQuestion({
  question: `
What would you like to review?

1. All unstaged changes (default) - Review uncommitted changes
2. Specific files/directories - Review selected files
3. Recent commits - Review changes in commit range

Select 1, 2, or 3 (or just hit Enter for option 1):
  `,
  allowEmpty: true
});
```

### Cost Approval Question

```javascript
AskUserQuestion({
  question: `
💰 Estimated Review Costs

[... cost breakdown ...]

Total Estimated Cost: $0.53

Proceed with multi-model review?

Options:
- "yes" or "y" = Proceed with review
- "no" or "n" = Cancel review
- "change" = Change model selection

Your choice:
  `
});
```

---

## Consolidation Logic

### Unanimous Issues (100% Agreement)

**Definition**: ALL reviewers flagged the same issue

**Detection**:
```javascript
function findUnanimousIssues(consensusIssues, reviewerCount) {
  return consensusIssues.filter(issue => {
    return issue.flaggedBy.length === reviewerCount;
  });
}
```

**Presentation**:
```markdown
## 🚨 Unanimous Issues (100% Agreement - VERY HIGH CONFIDENCE)

### Issue 1: [Title]
**Flagged by**: ALL {count} reviewers
**Severity**: CRITICAL
**Category**: Security
**Confidence**: VERY HIGH (100% agreement)

[... detailed description with all perspectives ...]

**Priority**: 🔴 MUST FIX BEFORE MERGE
```

### Strong Consensus (67-99% Agreement)

**Definition**: More than 2/3 of reviewers flagged the issue

**Detection**:
```javascript
function findStrongConsensusIssues(consensusIssues, reviewerCount) {
  return consensusIssues.filter(issue => {
    const agreement = (issue.flaggedBy.length / reviewerCount) * 100;
    return agreement >= 67 && agreement < 100;
  });
}
```

**Presentation**:
```markdown
## ⚠️ Strong Consensus Issues (67-99% Agreement - HIGH CONFIDENCE)

### Issue 3: [Title]
**Flagged by**: {reviewer1}, {reviewer2}, {reviewer3} ({count}/{total} = {percent}%)
**Severity**: CRITICAL
**Confidence**: HIGH ({percent}% agreement)

[... description ...]

**Note**: {missing_reviewer} didn't flag this - [possible reason].

**Priority**: 🟠 RECOMMENDED TO FIX
```

### Majority Issues (50-66% Agreement)

**Definition**: More than half of reviewers flagged the issue

**Detection**:
```javascript
function findMajorityIssues(consensusIssues, reviewerCount) {
  return consensusIssues.filter(issue => {
    const agreement = (issue.flaggedBy.length / reviewerCount) * 100;
    return agreement >= 50 && agreement < 67;
  });
}
```

**Presentation**:
```markdown
## 💬 Majority Issues (50-66% Agreement - MEDIUM CONFIDENCE)

### Issue 7: [Title]
**Flagged by**: {reviewer1}, {reviewer2} ({count}/{total} = {percent}%)
**Severity**: MEDIUM
**Confidence**: MEDIUM ({percent}% agreement)

[... description ...]

**Priority**: 🟡 CONSIDER FIXING
```

### Divergent Issues (Single Reviewer)

**Definition**: Only ONE reviewer flagged the issue

**Detection**:
```javascript
function findDivergentIssues(consensusIssues, reviewerCount) {
  return consensusIssues.filter(issue => {
    return issue.flaggedBy.length === 1;
  });
}
```

**Presentation**:
```markdown
## 💭 Divergent Issues (Single Reviewer - LOW CONFIDENCE)

These issues were flagged by only one reviewer. They may be valid edge cases or model-specific concerns.

### Issue 10: [Title]
**Flagged by**: {reviewer} only ({count}/{total} = {percent}%)
**Severity**: LOW
**Confidence**: LOW (single reviewer)

[... description ...]

**Priority**: ⚪ OPTIONAL
```

### Deduplication Strategy

**Goal**: Merge issues that describe the same problem but with different wording

**Approach**:
1. **Normalize** issue descriptions (extract key concepts)
2. **Compare** normalized issues across reviewers
3. **Group** similar issues together
4. **Merge** grouped issues into single consensus issue

**Similarity Criteria**:
- Same category (Security/Performance/Type Safety/etc.)
- Same location (file, line range, function)
- Similar keywords (>60% overlap)

**Example**:
```
Reviewer 1: "Missing input validation leads to SQL injection risk"
Reviewer 2: "No validation before database query - SQL injection vulnerability"
Reviewer 3: "Input not sanitized, exposing SQL injection attack vector"

→ Merge into single issue:
Title: "Missing Input Validation (SQL Injection Risk)"
Flagged by: Reviewer 1, Reviewer 2, Reviewer 3 (100% agreement)
Consensus: UNANIMOUS
```

### Model Agreement Matrix

**Purpose**: Visualize which models agree on which issues

**Format**:
```markdown
## Model Agreement Matrix

| Issue | Claude | Grok | Gemini | DeepSeek | Agreement |
|-------|--------|------|--------|----------|-----------|
| Missing validation | ✅ | ✅ | ✅ | ✅ | 100% |
| Async errors | ✅ | ✅ | ✅ | ✅ | 100% |
| N+1 query | ✅ | ✅ | ❌ | ✅ | 75% |
| TypeScript `any` | ✅ | ❌ | ❌ | ❌ | 25% |
```

**Insights**:
- Quickly see which issues have high agreement
- Identify model-specific biases (e.g., Claude flags type issues more)
- Understand confidence levels at a glance

---

## Error Handling

### Error Type 1: No Changes Found

**Scenario**: User selects "All unstaged changes" but working directory is clean

**Handling**:
```markdown
ℹ️ No unstaged changes found.

Your working directory has no uncommitted changes.

**Options**:
1. Review recent commits instead? (I can review HEAD~3..HEAD)
2. Review specific files? (Provide file paths)
3. Exit review workflow

What would you like to do? [1/2/3]
```

**Exit gracefully** if user chooses option 3.

### Error Type 2: Claudish Not Available

**Scenario**: User wants external models but Claudish CLI not found

**Handling**:
```markdown
ℹ️ Claudish CLI Not Found

Multi-model code review requires Claudish CLI for external AI model integration.

**Installation Options**:

1. **Use npx** (no install required):
   ```bash
   # Claudish works via npx automatically
   npx claudish --version
   ```

2. **Install globally** (optional):
   ```bash
   npm install -g claudish
   ```

**Or proceed with embedded Claude Sonnet reviewer only** (single model, no external costs).

What would you like to do?
- "install" = Install Claudish globally
- "npx" = Use npx (recommended, no install needed)
- "embedded" = Proceed with embedded reviewer only
- "cancel" = Cancel review

Your choice:
```

### Error Type 3: OPENROUTER_API_KEY Not Set

**Scenario**: Claudish available but API key not configured

**Handling**:
```markdown
⚠️ OpenRouter API Key Not Set

To use external AI models, you need an OpenRouter API key.

**Setup Instructions**:

1. **Get API key** from: https://openrouter.ai/keys

2. **Set environment variable**:
   ```bash
   export OPENROUTER_API_KEY='sk-or-v1-your-key-here'
   ```

3. **Or add to project .env**:
   ```bash
   echo 'OPENROUTER_API_KEY=sk-or-v1-your-key-here' >> .env
   ```

4. **Verify**:
   ```bash
   echo $OPENROUTER_API_KEY
   ```

**Options**:
- "setup" = I'll wait while you set the key (then retry)
- "embedded" = Proceed with embedded reviewer only
- "cancel" = Cancel review

Your choice:
```

### Error Type 4: External Model Review Fails

**Scenario**: One or more external model reviews fail (timeout, API error, etc.)

**Handling**:
```markdown
⚠️ Review Status Update

✅ Embedded (Claude Sonnet): Complete
✅ x-ai/grok-code-fast-1: Complete
❌ google/gemini-2.5-flash: Failed (timeout after 120s)
✅ deepseek/deepseek-chat: Complete

**Note**: Proceeding with 3/4 reviews. The failed review will be noted in the consolidated report.

Continuing...
```

**In consolidation report**:
```markdown
## ⚠️ Review Execution Notes

**Models Attempted**: 4
**Successful Reviews**: 3
**Failed Reviews**: 1
- google/gemini-2.5-flash: Timeout after 120 seconds

**Impact**: Consolidation based on 3 reviewers instead of 4. Confidence levels adjusted accordingly.
```

**Don't block workflow** - continue with available reviews.

### Error Type 5: Invalid Custom Model ID

**Scenario**: User provides custom model ID that doesn't match OpenRouter format

**Handling**:
```markdown
❌ Invalid Model ID Format

The model ID "invalid-model" doesn't match OpenRouter format.

**Expected format**: provider/model-name

**Examples**:
- x-ai/grok-code-fast-1
- openai/gpt-5-codex
- google/gemini-2.5-flash

**See full list**: https://openrouter.ai/models

Please enter a valid model ID (or "cancel" to skip):
```

**Validation**:
```javascript
function validateModelId(modelId) {
  // Basic format check: provider/model-name
  const pattern = /^[\w-]+\/[\w.-]+$/;
  return pattern.test(modelId);
}
```

### Error Type 6: All Reviewers Fail

**Scenario**: ALL reviews fail (embedded + external)

**Handling**:
```markdown
❌ Review Workflow Failed

All code reviews failed to complete. This is unexpected.

**Failure Details**:
- Embedded (Claude Sonnet): [error message]
- x-ai/grok-code-fast-1: [error message]
- google/gemini-2.5-flash: [error message]

**Possible Causes**:
- Network connectivity issues
- API rate limits reached
- Invalid review context
- Claudish configuration issues

**Troubleshooting**:
1. Check internet connection
2. Verify OPENROUTER_API_KEY is valid
3. Check OpenRouter account status
4. Try again in a few minutes (rate limits)

**Review context saved**: ai-docs/code-review-context.md

You can manually review this file or try the command again later.
```

**Exit gracefully** - don't leave user hanging.

---

## Success Criteria and Quality Gates

### Phase 1 Success Criteria

✅ **Phase 1 Complete When**:
- User selected review target (unstaged/files/commits)
- Review context gathered successfully (git diff or file contents)
- Review context file written to `ai-docs/code-review-context.md`
- User confirmed review target (if changes were found)

❌ **Phase 1 Fails If**:
- No changes found AND user chooses to exit
- Invalid file paths provided AND user chooses to exit
- Git command fails AND user chooses to exit

### Phase 2 Success Criteria

✅ **Phase 2 Complete When**:
- Claudish availability checked (available or not - both OK)
- API key checked (set or not - both OK)
- User selected at least 1 model (embedded or external)
- If external models selected, cost estimate shown and user approved

❌ **Phase 2 Fails If**:
- User cancels at model selection
- User rejects cost estimate
- No models selected (neither embedded nor external)

### Phase 3 Success Criteria

✅ **Phase 3 Complete When**:
- Embedded review completed successfully (if selected)
- ALL external reviews attempted (success or failure tracked)
- At least 1 review completed successfully (embedded OR external)
- All review files written to `ai-docs/code-review-*.md`

❌ **Phase 3 Fails If**:
- ALL reviews fail (embedded + all external)
- No review files generated

**Partial Success OK**: If 3/4 reviews succeed, proceed with 3.

### Phase 4 Success Criteria

✅ **Phase 4 Complete When**:
- All review files read successfully
- Issues parsed and normalized from each review
- Consensus analysis completed (grouped by agreement level)
- Consolidated report written to `ai-docs/code-review-consolidated.md`
- Consolidated report is comprehensive and actionable

❌ **Phase 4 Fails If**:
- Cannot read review files
- Cannot parse issues from reviews
- Consolidation logic fails

### Phase 5 Success Criteria

✅ **Phase 5 Complete When**:
- User summary generated (brief, actionable)
- Summary includes top 5 issues prioritized by consensus
- Summary includes cost breakdown
- Summary includes links to detailed reports
- User receives clear next steps

❌ **Phase 5 Never Fails**: Always present something to user, even if limited.

### Overall Success Criteria

✅ **Command Succeeds When**:
- All 5 phases complete successfully
- At least 1 review completed (embedded or external)
- Consolidated report generated
- User receives actionable feedback

⚠️ **Partial Success When**:
- Some external reviews fail but at least 1 succeeds
- User opts for embedded only (no external models)

❌ **Command Fails When**:
- User cancels at approval gates
- All reviews fail
- Cannot gather review context

---

## XML Structure Example

Here's the complete command structure in XML format:

```markdown
---
description: Multi-model code review orchestrator with parallel execution and consensus analysis
allowed-tools: Task, AskUserQuestion, Bash, Read, TodoWrite, Glob, Grep
---

<mission>
  Orchestrate comprehensive multi-model code review workflow with parallel execution,
  consensus analysis, and actionable insights prioritized by reviewer agreement.
</mission>

<user_request>
  $ARGUMENTS
</user_request>

<instructions>
  <critical_constraints>
    <orchestrator_role>
      You are an ORCHESTRATOR, not an IMPLEMENTER or REVIEWER.

      **✅ You MUST:**
      - Use Task tool to delegate ALL reviews to senior-code-reviewer agent
      - Use Bash to run git commands (status, diff, log)
      - Use Read/Glob/Grep to understand context
      - Use TodoWrite to track workflow progress (all 5 phases)
      - Use AskUserQuestion for user approval gates
      - Execute external reviews in PARALLEL (single message, multiple Task calls)

      **❌ You MUST NOT:**
      - Write or edit ANY code files directly
      - Perform reviews yourself
      - Write review files yourself (delegate to senior-code-reviewer)
      - Run reviews sequentially (always parallel for external models)
    </orchestrator_role>

    <cost_transparency>
      Before running external models, MUST show estimated costs and get user approval.
      Display cost breakdown per model and total estimated cost.
    </cost_transparency>

    <graceful_degradation>
      If Claudish unavailable or no external models selected, proceed with embedded
      Claude Sonnet reviewer only. Command must always provide value.
    </graceful_degradation>

    <parallel_execution>
      CRITICAL: Execute ALL external model reviews in parallel using multiple Task
      invocations in a SINGLE message. This achieves 3-5x speedup vs sequential.

      Example:
      [One message with:]
      Task: senior-code-reviewer PROXY_MODE: model-1 ...
      ---
      Task: senior-code-reviewer PROXY_MODE: model-2 ...
      ---
      Task: senior-code-reviewer PROXY_MODE: model-3 ...
    </parallel_execution>
  </critical_constraints>

  <workflow>
    <step number="0">Initialize TodoWrite with 5 phases before starting</step>
    <step number="1">PHASE 1: Determine review target and gather context</step>
    <step number="2">PHASE 2: Select AI models and show cost estimate</step>
    <step number="3">PHASE 3: Execute ALL reviews in parallel</step>
    <step number="4">PHASE 4: Consolidate reviews with consensus analysis</step>
    <step number="5">PHASE 5: Present consolidated results</step>
  </workflow>
</instructions>

<orchestration>
  <allowed_tools>
    - Task (delegate to senior-code-reviewer agent)
    - Bash (git commands, Claudish availability checks)
    - Read (read review files)
    - Glob (expand file patterns)
    - Grep (search for patterns)
    - TodoWrite (track workflow progress)
    - AskUserQuestion (user approval gates)
  </allowed_tools>

  <forbidden_tools>
    - Write (reviewers write files, not orchestrator)
    - Edit (reviewers edit files, not orchestrator)
  </forbidden_tools>

  <delegation_rules>
    <rule scope="embedded_review">
      Embedded (local) review → senior-code-reviewer agent (NO PROXY_MODE)
    </rule>
    <rule scope="external_review">
      External model review → senior-code-reviewer agent (WITH PROXY_MODE: {model_id})
    </rule>
    <rule scope="consolidation">
      Orchestrator performs consolidation (reads files, analyzes consensus, writes report)
    </rule>
  </delegation_rules>

  <phases>
    <phase number="1" name="Review Target Selection">
      <objective>
        Determine what code to review (unstaged/files/commits) and gather review context
      </objective>
      <steps>
        <step>Ask user what to review (3 options)</step>
        <step>Gather review target (git diff or file contents)</step>
        <step>Summarize changes and get user confirmation</step>
        <step>Write review context to ai-docs/code-review-context.md</step>
      </steps>
      <quality_gate>
        User confirmed review target, context file written successfully
      </quality_gate>
      <error_handling>
        If no changes found, offer alternatives (commits/files) or exit gracefully
      </error_handling>
    </phase>

    <phase number="2" name="Model Selection and Cost Approval">
      <objective>
        Select AI models for review and show estimated costs
      </objective>
      <steps>
        <step>Check Claudish CLI availability</step>
        <step>Check OPENROUTER_API_KEY (if Claudish available)</step>
        <step>Present model selection (up to 9 external + 1 embedded)</step>
        <step>Calculate and display estimated costs (if external models selected)</step>
        <step>Get user approval to proceed</step>
      </steps>
      <quality_gate>
        At least 1 model selected, user approved costs (if applicable)
      </quality_gate>
      <error_handling>
        If Claudish unavailable, offer embedded only. If API key missing, show setup
        instructions. If user rejects cost, offer to change selection or cancel.
      </error_handling>
    </phase>

    <phase number="3" name="Parallel Multi-Model Review">
      <objective>
        Execute ALL reviews in parallel (embedded + external)
      </objective>
      <steps>
        <step>Launch embedded review (if selected) via Task → senior-code-reviewer</step>
        <step>
          Launch ALL external reviews in PARALLEL via multiple Task invocations
          in SINGLE message, each with PROXY_MODE: {model_id}
        </step>
        <step>Track progress (show completion status for each reviewer)</step>
        <step>Handle failures gracefully (log and continue with successful reviews)</step>
      </steps>
      <quality_gate>
        At least 1 review completed successfully (embedded OR external)
      </quality_gate>
      <error_handling>
        If some reviews fail, continue with successful ones. If ALL fail, show
        detailed error message and exit gracefully.
      </error_handling>
    </phase>

    <phase number="4" name="Consolidate Reviews">
      <objective>
        Analyze all reviews, identify consensus, create consolidated report
      </objective>
      <steps>
        <step>Read all review files (ai-docs/code-review-*.md)</step>
        <step>Parse issues from each review (critical/medium/low)</step>
        <step>Normalize issue descriptions for comparison</step>
        <step>Group similar issues across reviewers</step>
        <step>Calculate consensus levels (unanimous/strong/majority/divergent)</step>
        <step>Create model agreement matrix</step>
        <step>Generate actionable recommendations prioritized by consensus</step>
        <step>Write consolidated report to ai-docs/code-review-consolidated.md</step>
      </steps>
      <quality_gate>
        Consolidated report written with consensus analysis and priorities
      </quality_gate>
      <error_handling>
        If cannot read review files, log error and show what's available
      </error_handling>
    </phase>

    <phase number="5" name="Present Results">
      <objective>
        Present consolidated results to user with actionable next steps
      </objective>
      <steps>
        <step>Generate brief user summary (top 5 issues, verdict, costs)</step>
        <step>Show high-confidence issues (unanimous + strong consensus)</step>
        <step>Link to detailed consolidated report</step>
        <step>Provide clear next steps and recommendations</step>
      </steps>
      <quality_gate>
        User receives clear, actionable summary with prioritized issues
      </quality_gate>
      <error_handling>
        Always present something to user, even if limited
      </error_handling>
    </phase>
  </phases>
</orchestration>

<examples>
  <example>
    <scenario>User wants to review unstaged changes with 3 external models</scenario>
    <user_request>/review</user_request>
    <execution>
      PHASE 1:
      - Ask: "What to review?" → User: "1" (unstaged changes)
      - Run: git status, git diff
      - Summarize: 5 files changed, +160 -38 lines
      - Ask: "Proceed?" → User: "Yes"
      - Write: ai-docs/code-review-context.md

      PHASE 2:
      - Check: Claudish available ✅, API key set ✅
      - Ask: "Select models" → User: "1,2,4,8" (Grok, Gemini Flash, DeepSeek, Embedded)
      - Calculate: $0.53 estimated cost
      - Ask: "Proceed?" → User: "Yes"

      PHASE 3:
      - Launch embedded review → Task: senior-code-reviewer (NO PROXY_MODE)
      - Launch 3 external reviews IN PARALLEL (single message, 3 Tasks):
        - Task: senior-code-reviewer PROXY_MODE: x-ai/grok-code-fast-1
        - Task: senior-code-reviewer PROXY_MODE: google/gemini-2.5-flash
        - Task: senior-code-reviewer PROXY_MODE: deepseek/deepseek-chat
      - Track: ✅✅✅✅ All complete (~5 min for parallel)

      PHASE 4:
      - Read: 4 review files
      - Parse: Issues from each review
      - Analyze: 2 unanimous critical, 3 strong consensus critical, etc.
      - Write: ai-docs/code-review-consolidated.md

      PHASE 5:
      - Present: Top 5 issues (2 unanimous, 3 strong consensus)
      - Show: Model agreement matrix
      - Link: Detailed reports
      - Recommend: Fix 2 unanimous issues first
    </execution>
  </example>

  <example>
    <scenario>Claudish not available, user opts for embedded only</scenario>
    <user_request>/review specific files src/services/*.ts</user_request>
    <execution>
      PHASE 1:
      - User specified: specific files src/services/*.ts
      - Glob: Find matching files (5 files)
      - Read: File contents
      - Write: ai-docs/code-review-context.md

      PHASE 2:
      - Check: Claudish not available ❌
      - Show: "Claudish not found. Options: Install / Embedded Only / Cancel"
      - User: "Embedded Only"
      - Selected: Embedded reviewer only (no cost)

      PHASE 3:
      - Launch embedded review → Task: senior-code-reviewer
      - Complete: ✅

      PHASE 4:
      - Read: 1 review file (embedded only)
      - Note: "Single reviewer (embedded only). Consensus N/A."
      - Write: ai-docs/code-review-consolidated.md (simpler format)

      PHASE 5:
      - Present: Issues from embedded review
      - Note: "Single reviewer. For multi-model validation, install Claudish."
      - Link: Detailed report
    </execution>
  </example>

  <example>
    <scenario>No unstaged changes, user switches to recent commits</scenario>
    <user_request>/review</user_request>
    <execution>
      PHASE 1:
      - Ask: "What to review?" → User: "1" (unstaged)
      - Run: git status → No changes
      - Show: "No unstaged changes. Options: Recent commits / Files / Exit"
      - User: "Recent commits"
      - Ask: "Commit range?" → User: "HEAD~3..HEAD"
      - Run: git diff HEAD~3..HEAD
      - Summarize: 8 files changed across 3 commits
      - Ask: "Proceed?" → User: "Yes"
      - Write: ai-docs/code-review-context.md

      [... PHASE 2-5 continue normally ...]
    </execution>
  </example>
</examples>

<error_recovery>
  <strategy>
    <scenario>No changes found</scenario>
    <recovery>
      Offer alternatives (review commits/files) or exit gracefully. Don't fail.
    </recovery>
  </strategy>

  <strategy>
    <scenario>Claudish not available</scenario>
    <recovery>
      Show setup instructions, offer embedded-only option, don't block workflow.
    </recovery>
  </strategy>

  <strategy>
    <scenario>API key not set</scenario>
    <recovery>
      Show setup instructions, wait for user to set key, or offer embedded-only.
    </recovery>
  </strategy>

  <strategy>
    <scenario>Some external reviews fail</scenario>
    <recovery>
      Continue with successful reviews, note failures in consolidated report.
    </recovery>
  </strategy>

  <strategy>
    <scenario>All reviews fail</scenario>
    <recovery>
      Show detailed error message, save context file for manual review, exit gracefully.
    </recovery>
  </strategy>

  <strategy>
    <scenario>User cancels at approval gate</scenario>
    <recovery>
      Exit gracefully with message explaining where user can restart if needed.
    </recovery>
  </strategy>
</error_recovery>

<success_criteria>
  <criterion>✅ At least 1 review completed (embedded or external)</criterion>
  <criterion>✅ Consolidated report generated with consensus analysis</criterion>
  <criterion>✅ User receives actionable feedback prioritized by confidence</criterion>
  <criterion>✅ Cost transparency maintained (show estimates before charging)</criterion>
  <criterion>✅ Parallel execution for 3-5x speedup on external reviews</criterion>
  <criterion>✅ Graceful degradation (works without Claudish/external models)</criterion>
  <criterion>✅ Clear error messages and recovery options</criterion>
</success_criteria>

<formatting>
  <communication_style>
    - Be clear and concise in user-facing messages
    - Use emojis for visual clarity (🎯 🚨 ⚠️ ✅ ❌)
    - Show progress indicators for long-running operations
    - Provide context and rationale for recommendations
    - Make costs and trade-offs transparent
  </communication_style>

  <deliverables>
    <file name="ai-docs/code-review-context.md">
      Review context with diff/files and instructions for reviewers
    </file>
    <file name="ai-docs/code-review-local.md">
      Embedded Claude Sonnet review (if embedded selected)
    </file>
    <file name="ai-docs/code-review-{model}.md">
      External model review (one file per external model)
    </file>
    <file name="ai-docs/code-review-consolidated.md">
      Consolidated report with consensus analysis, priorities, and recommendations
    </file>
  </deliverables>

  <user_summary_format>
    Present brief summary (under 50 lines) with:
    - Reviewer count and models used
    - Overall verdict
    - Top 5 most important issues (by consensus)
    - Code strengths acknowledged by reviewers
    - Links to detailed reports
    - Clear next steps
    - Cost breakdown (if external models used)
  </user_summary_format>
</formatting>
```

---

## Key Design Decisions

### 1. Parallel Execution for Speed

**Decision**: Execute ALL external reviews in parallel using multiple Task invocations in a single message.

**Rationale**:
- Sequential execution: 5 min × 3 models = 15 minutes
- Parallel execution: max(5, 5, 5) = 5 minutes
- 3x speedup with no downside

**Trade-offs**:
- More complex orchestration logic
- But user experience dramatically improved

### 2. Consensus-Based Prioritization

**Decision**: Prioritize issues by how many reviewers flagged them (unanimous > strong consensus > majority > divergent).

**Rationale**:
- Issues flagged by multiple models = higher confidence
- Reduces false positives from model-specific biases
- Users trust unanimous issues more than single-reviewer issues

**Trade-offs**:
- Some valid edge cases might be deprioritized (divergent issues)
- But false positives are reduced significantly

### 3. Cost Transparency Before Execution

**Decision**: Show estimated costs and require user approval before running external models.

**Rationale**:
- External models cost money (OpenRouter charges)
- Users should know costs upfront, not after
- Builds trust and prevents surprises

**Trade-offs**:
- Extra approval gate (slight friction)
- But prevents unexpected charges

### 4. Graceful Degradation

**Decision**: Command works with embedded reviewer only if Claudish unavailable.

**Rationale**:
- Not all users have Claudish installed
- Not all users want to pay for external models
- Command should provide value regardless

**Trade-offs**:
- Embedded-only reviews lack multi-model perspective
- But command is still useful

### 5. File-Based Output

**Decision**: Reviews written to files, not returned in messages.

**Rationale**:
- Full reviews are 500-2000 lines (too large for messages)
- File-based preserves content without token bloat
- Users can read/edit/share review files

**Trade-offs**:
- Orchestrator must read files for consolidation
- But token efficiency is dramatically improved

---

## Implementation Roadmap

### Phase 1: Core Command Structure (MVP)
- [ ] Create `/review` command file
- [ ] Implement PHASE 0 (TodoWrite initialization)
- [ ] Implement PHASE 1 (review target selection)
- [ ] Implement PHASE 2 (model selection, embedded only)
- [ ] Implement PHASE 3 (embedded review execution)
- [ ] Implement PHASE 5 (present embedded review results)
- **Milestone**: Basic review workflow with embedded reviewer only

### Phase 2: External Model Integration
- [ ] Add Claudish availability check
- [ ] Add OPENROUTER_API_KEY check
- [ ] Implement cost estimation logic
- [ ] Add external model selection to PHASE 2
- [ ] Implement external review execution (sequential)
- [ ] Test with 1-2 external models
- **Milestone**: External models working sequentially

### Phase 3: Parallel Execution
- [ ] Refactor PHASE 3 to use parallel Task invocations
- [ ] Test with 3+ external models in parallel
- [ ] Verify speedup (3-5x expected)
- [ ] Add progress tracking for parallel operations
- **Milestone**: Parallel execution working

### Phase 4: Consolidation Logic
- [ ] Implement PHASE 4 (read all review files)
- [ ] Implement issue parsing and normalization
- [ ] Implement consensus detection algorithm
- [ ] Implement issue deduplication
- [ ] Create consolidated report format
- [ ] Test with diverse reviews (unanimous, divergent, etc.)
- **Milestone**: Consolidation working

### Phase 5: Error Handling
- [ ] Implement all error scenarios (see Error Handling section)
- [ ] Add graceful degradation for each error type
- [ ] Test edge cases (no changes, all reviews fail, etc.)
- **Milestone**: Robust error handling

### Phase 6: Polish and Testing
- [ ] Add cost breakdown display
- [ ] Add progress indicators
- [ ] Add model agreement matrix
- [ ] Test full workflow end-to-end
- [ ] Optimize user experience
- **Milestone**: Production-ready command

---

## Testing Strategy

### Unit Tests (Manual Verification)

1. **Review Target Selection**
   - Test: Unstaged changes (with changes, without changes)
   - Test: Specific files (valid paths, invalid paths, globs)
   - Test: Recent commits (valid range, invalid range)

2. **Model Selection**
   - Test: Embedded only
   - Test: 1 external model
   - Test: 3 external models
   - Test: 9 external models
   - Test: Custom model ID (valid, invalid format)

3. **Cost Estimation**
   - Test: Small codebase (~100 lines)
   - Test: Medium codebase (~500 lines)
   - Test: Large codebase (~2000 lines)
   - Verify: Costs match OpenRouter pricing

4. **Parallel Execution**
   - Test: 3 external models execute in parallel
   - Verify: Completion time ≈ slowest model (not sum)
   - Test: Progress tracking shows all models

5. **Consensus Detection**
   - Test: All reviewers agree (unanimous)
   - Test: 3/4 reviewers agree (strong consensus)
   - Test: 2/4 reviewers agree (majority)
   - Test: 1/4 reviewers agree (divergent)

### Integration Tests (End-to-End)

1. **Happy Path: Multi-Model Review**
   - Input: /review → unstaged changes → 3 external models + embedded
   - Expected: All phases complete, consolidated report generated
   - Verify: Costs shown, parallel execution, consensus analysis

2. **Edge Case: No Changes**
   - Input: /review → unstaged changes (but none exist)
   - Expected: Offer alternatives, exit gracefully

3. **Edge Case: Claudish Not Available**
   - Input: /review → external models selected
   - Expected: Show message, offer embedded only

4. **Edge Case: Some Reviews Fail**
   - Input: /review → 4 models (1 fails)
   - Expected: Continue with 3, note failure in report

5. **Edge Case: User Cancels**
   - Input: /review → cancel at cost approval
   - Expected: Exit gracefully with clear message

### Acceptance Criteria

✅ **Command succeeds when**:
- At least 1 review completes
- Consolidated report generated
- User receives actionable feedback

✅ **Parallel execution verified when**:
- 3 external models complete in ~5 min (not 15 min)
- Progress tracking shows parallel operations

✅ **Consensus analysis verified when**:
- Unanimous issues highlighted (100% agreement)
- Model agreement matrix accurate

✅ **Error handling verified when**:
- No changes → offers alternatives
- Claudish unavailable → offers embedded only
- Some reviews fail → continues with successful ones

---

## Summary

The `/review` command orchestrates a comprehensive, multi-model code review workflow with these key innovations:

1. **Parallel Execution** - 3-5x speedup by running external reviews simultaneously
2. **Consensus Analysis** - Prioritizes issues by reviewer agreement (unanimous > strong > majority > divergent)
3. **Cost Transparency** - Shows estimated costs before charging users
4. **Graceful Degradation** - Works with embedded reviewer only if external models unavailable
5. **Actionable Insights** - Presents top 5 issues with clear priorities and recommendations

The command provides maximum value with minimal friction, making multi-model code review accessible and efficient for all developers.

---

**Design Version**: 1.0.0
**Last Updated**: 2025-11-14
**Author**: Claude Sonnet 4.5 (agent-architect)
