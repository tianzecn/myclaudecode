# Review: Multi-Model Orchestration Pattern Design (Claudish Skill)

Reviewer: agent-architect (Claude Code agent)
Date: 2025-11-19
Target file: `shared/skills/claudish-usage/SKILL.md`
Design doc: `ai-docs/skill-design-claudish-multi-model.md`

---

## Overall Assessment

The design is very strong: it clearly understands the Claudish + Claude Code environment, emphasizes the most failure-prone concept (label → model ID mapping), and presents a well-structured universal pattern with rich examples.

However, some of the examples as written are not actually runnable in a Claude Code agent context without adaptation, and a few implementation details are underspecified or slightly inconsistent. There are also a couple of places where the design could better clarify lifecycle responsibilities (who creates workspaces, who runs claudish, where code actually lives).

Below is detailed feedback by topic with severity levels.

---

## 1. Content Completeness

**Assessment:** Very good coverage but missing a few operational details.

- **Strengths**
  - Covers full lifecycle: model discovery → selection + pricing → parallel execution → workspace isolation → synthesis → cost reporting.
  - Includes both core pattern and advanced patterns (adaptive selection, weighted consensus, fallback, progressive disclosure, specialized assignment).
  - Explicit success criteria and review checklist make this implementable and testable.
  - Clear connection to existing patterns (file-based sub-agent, sub-agent delegation, cost tracking).

- **Gaps / Issues**
  - **MEDIUM:** The design assumes functions like `Task`, `AskUserQuestion`, `Read`, `Write`, `Bash` are available directly in TypeScript, but in the skill file they will be *descriptive patterns* for the Claude agent, not literally compiled TS. Many snippets read like executable TS modules rather than “how to think / what to do” examples. This is mostly a documentation–vs–runnable-code mismatch, but it affects clarity.
  - **MEDIUM:** No explicit mention of the Claudish `--stdin` and `--quiet` flags in the core step examples (they appear conceptually in earlier project docs, but the main 5-step pattern is the critical teaching surface). Step 3 / full example should consistently show the canonical invocation, e.g. `claudish --stdin --model {id} --quiet`.
  - **MEDIUM:** It is not fully explicit that the *outer* orchestrating agent should **not** itself call `claudish`; instead, it delegates to sub-agents that then use Claudish in their own shell. The examples are mostly consistent with this, but some code comments are ambiguous and could lead to mixed patterns.
  - **LOW:** Troubleshooting is mentioned in checklist items but there is no dedicated “Troubleshooting” subsection (timeouts, model unavailability, invalid ID errors, permission issues running `npx claudish`, etc.).

**Verdict:** Good overall, but the skill section should explicitly frame the TS snippets as patterns/pseudocode and tighten responsibility boundaries around who runs claudish.

Severity summary:
- MEDIUM: Clarify execution model / environment and Claudish flags usage
- LOW: Add brief troubleshooting guidance

---

## 2. Label → ID Mapping Emphasis

**Assessment:** Excellent emphasis; might border on overkill but correctly reflects how critical this is.

- **Strengths**
  - Marked as CRITICAL in the outline and reiterated in multiple sections (Step 2, Critical Rules, Key Points, Success Criteria).
  - Multiple concrete snippets:
    - `modelOptions` with `label` vs `modelId`.
    - Explicit WRONG vs RIGHT examples for passing labels to claudish.
  - UX perspective is called out: friendly labels for users, exact IDs for claudish.

- **Minor Issues**
  - **LOW:** Example labels use both `m.name` and extended strings with pricing/context. It might help to explicitly show that the mapping must still store the **raw `m.id`** separately and never attempt to reverse-parse it from the label. The design already does this, but a one-line warning (“Never attempt to parse IDs from labels”) would close a common foot-gun.
  - **LOW:** The recommendations section references “Real model IDs from OpenRouter are used” as a checklist item. It might be worth listing a small, explicit table of 4–5 canonical IDs at the top of the section to anchor expectations (Grok, GPT-5, Gemini, DeepSeek, Claude Sonnet).

**Verdict:** Strong; only small clarity tweaks recommended.

Severity summary:
- LOW: Add explicit warning against parsing IDs from labels
- LOW: Add a tiny canonical ID table

---

## 3. 5-Step Pattern Clarity

**Assessment:** Clear and actionable, but a bit conflated with the longer architecture-review example.

- **Strengths**
  - Each step is well-defined and mapped to code:
    - Step 1: Model discovery and filtering.
    - Step 2: Presentation with pricing and mapping.
    - Step 3: Parallel sub-agent launch.
    - Step 4: Workspace communication structure.
    - Step 5: Synthesis.
  - Explains *why* parallel execution matters (explicit 3–5x speedup comparison).
  - Good, concise “Core Principle” bullets under Step 3 and Step 4.

- **Issues**
  - **MEDIUM:** The narrative 5-step pattern and the later **Complete Example** drift into a 7-step flow (model selection, approval, workspace creation, execution, read outputs, synthesize, report). That’s correct for real workflows, but the design should reconcile the “5-step” branding with the extended steps so readers aren’t confused. A simple note that Steps 3–5 in the universal pattern internally expand into sub-steps in the full example would help.
  - **MEDIUM:** The responsibilities for each step (outer command vs sub-agent vs claudish CLI process) aren’t always labeled at the top of each step. Without the broader repo context, a new contributor might assume the top-level agent calls claudish directly in Step 3 instead of delegating.

**Verdict:** Methodology is solid and teachable; needs a short clarifying note about the 5 vs 7 steps and agent/CLI responsibility boundaries.

Severity summary:
- MEDIUM: Clarify mapping between the concise 5 steps and the expanded example
- MEDIUM: Label who does what in each step (orchestrator vs sub-agent vs claudish)

---

## 4. Code Examples (Completeness, Correctness, Runnability)

**Assessment:** Very comprehensive but **not fully runnable** as-is; several missing imports, type definitions, and environment/context mismatches.

### 4.1 Structural / Environment Issues

- **CRITICAL:** Many examples call `Task({ ... })`, `Bash({ ... })`, `Read({ ... })`, `Write({ ... })`, `AskUserQuestion({ ... })` directly as async functions returning values (`const { stdout } = await Bash({ ... })`, `const results = await Promise.all(tasks.map(task => Task(task)));`). In the actual Claude Code skill context, these are *tools invoked by the host*, not imported TS functions. When this content is moved into `SKILL.md`, these snippets should be framed as **pseudocode / agent instructions**, not literally compiled TS.
  - Risk: Future contributors may copy-paste these into real TS files without the right tool glue and be confused by missing symbols.
  - Recommendation: Add an explicit preamble line in this section: “These code blocks are *patterns* written in TypeScript-like pseudocode showing how to sequence Task / Bash / Read / Write. They are not meant to be compiled as-is.”

- **HIGH:** Missing imports and type definitions:
  - Functions reference `fs`, `Model`, `TokenEstimate`, `Issue`, `Review`, `allIssues`, `parseSection`, `parseIssueSection`, `isSimilar`, `countUniqueIssues`, `estimateDepth`, `combineAspectReviews`, etc., which are not defined anywhere in the design.
  - For an architecture/design doc that explicitly claims “complete and runnable” examples, this is a mismatch.
  - Suggestion: Either (a) label these helper functions and types as “omitted for brevity” and clearly mark them as such, or (b) provide minimal interface definitions and stub implementations so the snippets can at least type-check in isolation.

- **MEDIUM:** `Read({ file_path: reviewFile });` is used as if it returns `string`, but in real tools it returns a structured object or file contents with line numbers. Given this is skill-level guidance, you probably want to describe the pattern instead of assuming a specific return shape, or call out that “Read returns the raw file content string in this example.”

### 4.2 Specific Logic Issues

- **HIGH:** `findStrongConsensusIssues` uses `models.push(otherIssues[0].modelName)` when building the `models` array. That effectively attaches the **first** issue’s modelName for all matches, which is logically wrong. You need a mapping from `Issue` to `modelName` or to pass the `reviews` list into this helper, similar to the later `findWeightedConsensus` which relies on `reviews`.

- **HIGH:** `findWeightedConsensus(reviews: Review[]): Issue[]` references `allIssues` but takes only `reviews` as a parameter. Either `allIssues` must be computed in the function or passed in explicitly. As written, it is not even pseudocode-correct and will confuse implementers.

- **MEDIUM:** Cleanup logic in `reviewArchitectureWithMultipleModels`:
  - `reviews.forEach(r => { Bash(rm ${workspaceDir}/${r.modelId.replace(/\//g, '-')}-review.md); });`
    - This calls `Bash` without `await` and without awaiting `Promise.all`, which is a race and error-swallower. If left as a pattern, it should explicitly mention that cleanup should be awaited or scheduled.

- **MEDIUM:** Use of emojis (e.g., `console.log("📋 Step 1...")`) is consistent with the existing skill tone, but the surrounding pattern should confirm whether this is recommended or optional; currently it’s implicit.

### 4.3 Runnability vs Intent

- **MEDIUM:** The design claims in multiple places that examples should be “complete and runnable”, but they’re better treated as **didactic pseudocode** demonstrating orchestration logic. Aligning the language in Section 6 (“Code examples need to be complete and runnable”) with Section 4’s actual state is important.

**Verdict:** Excellent breadth, but not actually runnable; needs clear framing as pseudocode plus a few logic fixes.

Severity summary:
- CRITICAL: Clarify that these are patterns/pseudocode, not drop-in compiled TS; adjust skill text accordingly
- HIGH: Fix helper-function and `findStrongConsensusIssues` / `findWeightedConsensus` logic
- MEDIUM: Tighten cleanup logic and `Read` semantics; reconcile “runnable” claim

---

## 5. Integration with Existing Claudish Skill Content

**Assessment:** Integration points are thoughtfully specified and consistent with the existing architecture.

- **Strengths**
  - Explicit cross-references to:
    - File-Based Sub-Agent Pattern
    - Sub-Agent Delegation Pattern
    - Agent Selection Guide
  - Placement rationale (after Quick Start, before deeper patterns) matches onboarding flow: baseline → advanced multi-model concept → implementation details.
  - Reuses the same workspace isolation paradigm and cost tracking concepts already present in the skill.

- **Issues**
  - **LOW:** References to line numbers (e.g., “line 285”, “line 437”) will drift as the skill evolves. The design doc is fine, but the final SKILL content should avoid hard-coded line references and instead use section titles (“see section ‘File-Based Sub-Agent Pattern’ below”).
  - **LOW:** The multi-model section leans heavily on code-review/architecture examples. It would help integration to call out, near the top, one short non-code example (e.g., API docs analysis or test strategy) to visually “break” the association that this is only about review/architecture.

**Verdict:** Integration is good; just avoid line-number references and consider a non-code top-level example.

Severity summary:
- LOW: Avoid referencing exact line numbers in the eventual skill text
- LOW: Add a non-review/non-architecture example call-out for balance

---

## 6. Universal Applicability Across Agent Types

**Assessment:** Clearly stated and mostly well supported.

- **Strengths**
  - Dedicated “Supported Agent Types” table with concrete examples and when-to-use guidance.
  - Repeated “Universal Pattern” language and explanation that only `subagent_type` changes.
  - Advanced patterns show non-trivial extension of the base pattern (specialized aspects, testing focus, etc.).

- **Issues**
  - **MEDIUM:** The **complete example** and the majority of specific snippets are architecture/code-review centric. While the table lists many agent types, there isn’t a fully-walked-through example for, say, a **test-architect** or **api-documentation-analyst**. For a reader skimming, this risks encoding “multi-model = review-only”.
  - **LOW:** `specializedReview` uses `subagent_type: "senior-code-reviewer"` for all aspects, which is consistent with the rule “don’t mix agent types,” but for cases like security vs testing vs architecture, the design might want to explicitly say that *if* there are specialized agents (e.g., `security-reviewer` in future), then it’s preferable to keep multi-model within a given specialty.

**Verdict:** Universal intent is clear; a small additional worked example for a non-review agent would cement it.

Severity summary:
- MEDIUM: Add at least one non-review, non-architecture worked mini-example
- LOW: Clarify interaction between “don’t mix agent types” and specialized agents per concern

---

## 7. Cost Transparency Pattern

**Assessment:** Very strong and close to production-ready.

- **Strengths**
  - Separately tracks input vs output costs with clear formulae.
  - Introduces a confidence range (±20%) and explains why.
  - Provides both a generic helper (`displayCostEstimate`) and simpler inline estimation examples.
  - Explicit approval gate (`yesno`) before execution.

- **Issues**
  - **MEDIUM:** The design assumes pricing is in **USD per 1M tokens**; if OpenRouter pricing format ever changes, this will drift. The skill text should call this out as “based on current OpenRouter JSON schema (USD per 1M tokens) – verify pricing schema if this changes.”
  - **LOW:** There is some duplication between `estimateCost` in Step 2 and `displayCostEstimate` in the Cost Transparency section. The design could recommend a single canonical helper pattern to avoid divergence in real implementations.
  - **LOW:** Token estimation (`estimateTokens`) is necessarily heuristic. That’s fine, but it might be worth one sentence that encourages **conservatively overestimating** to avoid user surprise (e.g., recommend using 1.2x multiplier on expected tokens).

**Verdict:** Pattern is essentially production-ready with minor caveats about schema assumptions and duplication.

Severity summary:
- MEDIUM: Explicitly document assumption about OpenRouter pricing format
- LOW: Suggest single canonical helper pattern; recommend conservative overestimation

---

## 8. Synthesis / Consensus–Divergence Methodology

**Assessment:** Conceptually excellent; implementation details need a bit more rigor.

- **Strengths**
  - Clear conceptual framing: unanimous, strong consensus (majority), divergent insights.
  - Good example consolidated report with prioritized action items and model-comparison table.
  - Jaccard-based text similarity approach is reasonable as an illustrative method.
  - Emphasizes that users care more about “what everyone agrees on” and “what’s unique” than about raw per-model dumps.

- **Issues**
  - **HIGH:** As noted above, `findStrongConsensusIssues` and `findWeightedConsensus` have incomplete or inconsistent access to the data they need (especially mapping issues to models). For a design whose unique selling point is consensus analysis, these helpers should be logically correct, even if simplified.
  - **MEDIUM:** There is no mention of **deduplicating** issues across models before presenting counts. The examples imply this (via `isSimilarIssue`), but a short textual note that “final lists should be de-duplicated by location + similarity” would align expectations.
  - **LOW:** No discussion of **conflicting recommendations** (e.g., two models suggest different fixes for the same issue). This is more advanced, but a one-line note in the “Divergent Insights” section that such cases should be called out explicitly would improve guidance.

**Verdict:** Excellent conceptual methodology, but core helper pseudocode should be corrected and annotated to avoid confusion for implementers.

Severity summary:
- HIGH: Fix helper functions’ data access and model-mapping logic
- MEDIUM: Explicitly mention deduplication of issues in final lists
- LOW: Briefly mention handling of conflicting recommendations as a divergence pattern

---

## Summary of Severity-Categorized Issues

### CRITICAL
1. Code examples are written as if `Task`, `Bash`, `Read`, etc., are directly callable TS functions; the skill must clearly frame them as **pseudocode patterns** for the Claude agent rather than drop-in compiled code.

### HIGH
1. Several helper functions (`findStrongConsensusIssues`, `findWeightedConsensus`, others) have incomplete or incorrect logic / references (e.g., `allIssues` not defined, using `otherIssues[0].modelName` as a proxy for matching model names).
2. “Complete and runnable” claim does not currently match the actual snippets due to missing imports/types and environment assumptions.

### MEDIUM
1. 5-step pattern vs expanded 7-step example could confuse readers; clarify mapping and responsibilities.
2. Some examples blur responsibility boundaries between orchestrating command, sub-agents, and claudish CLI.
3. `Read` and `Bash` usages assume specific return shapes and ignore awaiting cleanup, which may mislead implementers.
4. Universal applicability is mostly demonstrated through review/architecture—add at least one non-review mini-example (e.g., test strategy or API-doc analysis).
5. Document pricing schema assumptions; encourage conservative token estimation; reduce helper duplication.
6. Explicitly call out deduplication of issues in synthesized results.

### LOW
1. Avoid line-number references in final SKILL content; anchor on section titles instead.
2. Add explicit warning not to parse model IDs from labels.
3. Provide a short canonical ID table for top models (Grok, GPT-5, Gemini, DeepSeek, Claude Sonnet).
4. Add a small troubleshooting subsection (invalid model IDs, timeouts, model unavailability, claudish not installed, etc.).
5. Clarify guidance on specialized agents vs “don’t mix agent types.”
6. Harmonize cost helper functions and add a note about emoji/logging style being optional but consistent with existing sections.

---

## Recommendations Before Implementation

1. **Reframe Code Blocks as Pseudocode** (CRITICAL)
   - Add a short preface to the section stating that all TS examples are high-level patterns showing how agents should use Task/Bash/Read/Write, not literal compiled code.
   - Optionally mark some helpers as `// pseudo-code` or `// implementation omitted for brevity`.

2. **Tighten Helper Logic** (HIGH)
   - Fix `findStrongConsensusIssues` and `findWeightedConsensus` signatures and internals so they:
     - Receive both `reviews` and `allIssues` or reconstruct the mapping internally.
     - Correctly attribute models to issues instead of using `otherIssues[0].modelName`.

3. **Clarify Orchestration Responsibilities** (MEDIUM)
   - In the 5-step pattern intro, add a short table: “Outer command vs sub-agent vs claudish CLI” responsibilities.
   - Update comments in code blocks to consistently show that claudish is invoked **inside sub-agents** using the workspace pattern, not from the top-level orchestrator.

4. **Align “Runnable” Claim with Reality** (HIGH/MEDIUM)
   - Either provide minimal type/interface stubs and imports for a subset of the examples, or downgrade the claim to “illustrative but not fully runnable” and mark missing pieces explicitly.

5. **Enhance Non-Review Examples and Troubleshooting** (MEDIUM/LOW)
   - Add at least one short example of multi-model orchestration for a non-review agent (e.g., test-architect designing a test suite with 3 models).
   - Add a small troubleshooting box for common failure modes.

Once these adjustments are made, the section will be ready to integrate into `SKILL.md` as a high-quality, production-ready guide to multi-model orchestration with Claudish.
