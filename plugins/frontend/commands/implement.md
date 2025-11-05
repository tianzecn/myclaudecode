---
description: Full-cycle feature implementation with multi-agent orchestration and quality gates
allowed-tools: Task, AskUserQuestion, Bash, Read, TodoWrite, Glob, Grep
---

## Mission

Orchestrate a complete feature implementation workflow using specialized agents with built-in quality gates and feedback loops. This command manages the entire lifecycle from architecture planning through implementation, code review, testing, user approval, and project cleanup.

## CRITICAL: Orchestrator Constraints

**You are an ORCHESTRATOR, not an IMPLEMENTER.**

**✅ You MUST:**
- Use Task tool to delegate ALL implementation work to agents
- Use Bash to run git commands (status, diff, log)
- Use Read/Glob/Grep to understand context
- Use TodoWrite to track workflow progress
- Use AskUserQuestion for user approval gates
- Coordinate agent workflows and feedback loops

**❌ You MUST NOT:**
- Write or edit ANY code files directly (no Write, no Edit tools)
- Implement features yourself
- Fix bugs yourself
- Create new files yourself
- Modify existing code yourself
- "Quickly fix" small issues - always delegate to developer

**Delegation Rules:**
- ALL code changes → developer agent
- ALL planning → architect agent
- ALL design reviews (UI fidelity) → designer agent
- ALL UI implementation/fixes → ui-developer agent
- ALL code reviews → reviewer + codex-reviewer agents
- ALL testing → test-architect agent
- ALL cleanup → cleaner agent
- OPTIONAL Codex UI expert review → ui-developer-codex agent

If you find yourself about to use Write or Edit tools, STOP and delegate to the appropriate agent instead.

## Feature Request

$ARGUMENTS

## Multi-Agent Orchestration Workflow

### PRELIMINARY: Check for Code Analysis Tools (Recommended)

**Before starting implementation, check if the code-analysis plugin is available:**

Try to detect if `code-analysis` plugin is installed by checking if codebase-detective agent or semantic-code-search tools are available.

**If code-analysis plugin is NOT available:**

Inform the user with this message:

```
💡 Recommendation: Install Code Analysis Plugin

For best results investigating existing code patterns, components, and architecture,
we recommend installing the code-analysis plugin.

Benefits:
- 🔍 Semantic code search (find components by functionality, not just name)
- 🕵️ Codebase detective agent (understand existing patterns)
- 📊 40% faster codebase investigation
- 🎯 Better understanding of where to integrate new features

Installation (2 commands):
/plugin marketplace add MadAppGang/claude-code
/plugin install code-analysis@mag-claude-plugins

Repository: https://github.com/MadAppGang/claude-code

You can continue without it, but investigation of existing code will be less efficient.
```

**If code-analysis plugin IS available:**

Great! You can use the codebase-detective agent and semantic-code-search skill during
architecture planning to investigate existing patterns and find the best integration points.

**Then proceed with the implementation workflow regardless of plugin availability.**

---

### STEP 0: Initialize Global Workflow Todo List (MANDATORY FIRST STEP)

**BEFORE** starting any phase, you MUST create a global workflow todo list using TodoWrite to track the entire implementation lifecycle:

```
TodoWrite with the following items:
- content: "PHASE 1: Launch architect for architecture planning"
  status: "in_progress"
  activeForm: "PHASE 1: Launching architect for architecture planning"
- content: "PHASE 1: User approval gate - wait for plan approval"
  status: "pending"
  activeForm: "PHASE 1: Waiting for user approval of architecture plan"
- content: "PHASE 2: Launch developer for implementation"
  status: "pending"
  activeForm: "PHASE 2: Launching developer for implementation"
- content: "PHASE 2: Get manual testing instructions from implementation agent"
  status: "pending"
  activeForm: "PHASE 2: Getting manual testing instructions from implementation agent"
- content: "PHASE 2.5: Detect Figma design links in feature request and plan"
  status: "pending"
  activeForm: "PHASE 2.5: Detecting Figma design links"
- content: "PHASE 2.5: Run design fidelity validation for UI components (if Figma links found)"
  status: "pending"
  activeForm: "PHASE 2.5: Running design fidelity validation"
- content: "PHASE 2.5: Quality gate - ensure UI matches design specifications"
  status: "pending"
  activeForm: "PHASE 2.5: Ensuring UI matches design specifications"
- content: "PHASE 3: Launch ALL THREE reviewers in parallel (code + codex + UI testing)"
  status: "pending"
  activeForm: "PHASE 3: Launching all three reviewers in parallel"
- content: "PHASE 3: Analyze triple review results and determine if fixes needed"
  status: "pending"
  activeForm: "PHASE 3: Analyzing triple review results"
- content: "PHASE 3: Quality gate - ensure all three reviewers approved"
  status: "pending"
  activeForm: "PHASE 3: Ensuring all three reviewers approved"
- content: "PHASE 4: Launch test-architect for test implementation"
  status: "pending"
  activeForm: "PHASE 4: Launching test-architect for test implementation"
- content: "PHASE 4: Quality gate - ensure all tests pass"
  status: "pending"
  activeForm: "PHASE 4: Ensuring all tests pass"
- content: "PHASE 5: User approval gate - present implementation for final review"
  status: "pending"
  activeForm: "PHASE 5: Presenting implementation for user final review"
- content: "PHASE 5: Launch cleaner to clean up temporary artifacts"
  status: "pending"
  activeForm: "PHASE 5: Launching cleaner to clean up temporary artifacts"
- content: "PHASE 6: Generate comprehensive final summary"
  status: "pending"
  activeForm: "PHASE 6: Generating comprehensive final summary"
- content: "PHASE 6: Present summary and complete user handoff"
  status: "pending"
  activeForm: "PHASE 6: Presenting summary and completing user handoff"
```

**Update this global todo list** as you progress through each phase:
- Mark items as "completed" immediately after finishing each step
- Mark the next item as "in_progress" before starting it
- Add additional items for feedback loops (e.g., "PHASE 3 - Iteration 2: Re-run reviewers after fixes")
- Track the number of review cycles and test cycles by adding iteration tasks

**IMPORTANT**: This global todo list provides high-level workflow tracking. Each agent will also maintain its own internal todo list for detailed task tracking.

### PHASE 1: Architecture Planning (architect)

1. **Launch Planning Agent**:
   - **Update TodoWrite**: Ensure "PHASE 1: Launch architect" is marked as in_progress
   - Use Task tool with `subagent_type: architect`
   - Provide the feature request: $ARGUMENTS
   - Agent will perform gap analysis and ask clarifying questions
   - Agent will create comprehensive plan in AI-DOCS/
   - **Update TodoWrite**: Mark "PHASE 1: Launch architect" as completed

2. **User Approval Gate**:
   - **Update TodoWrite**: Mark "PHASE 1: User approval gate" as in_progress
   - Present the plan to the user clearly
   - Use AskUserQuestion to ask: "Are you satisfied with this architecture plan?"
   - Options: "Yes, proceed to implementation" / "No, I have feedback"

3. **Feedback Loop**:
   - IF user not satisfied:
     * Collect specific feedback
     * **Update TodoWrite**: Add "PHASE 1 - Iteration X: Re-run planner with feedback" task
     * Re-run architect with feedback
     * Repeat approval gate
   - IF user satisfied:
     * **Update TodoWrite**: Mark "PHASE 1: User approval gate" as completed
     * Proceed to Phase 2
   - **DO NOT proceed without user approval**

### PHASE 2: Implementation (developer)

1. **Launch Implementation Agent**:
   - **Update TodoWrite**: Mark "PHASE 2: Launch developer" as in_progress
   - Use Task tool with `subagent_type: developer`
   - Provide:
     * Path to approved plan documentation in AI-DOCS/
     * Clear instruction to follow the plan step-by-step
     * Guidance to write proper documentation
     * Instruction to ask for advice if obstacles are encountered

2. **Implementation Monitoring**:
   - Agent implements features following the plan
   - Agent should document decisions and patterns used
   - If agent encounters blocking issues, it should report them and request guidance
   - **Update TodoWrite**: Mark "PHASE 2: Launch developer" as completed when implementation is done

3. **Get Manual Testing Instructions** (NEW STEP):
   - **Update TodoWrite**: Mark "PHASE 2: Get manual testing instructions from implementation agent" as in_progress
   - **Launch developer agent** using Task tool with:
     * Context: "Implementation is complete. Now prepare manual UI testing instructions."
     * Request: "Create comprehensive, step-by-step manual testing instructions for the implemented features."
     * Instructions should include:
       - **Specific UI element selectors** (accessibility labels, data-testid, aria-labels) for easy identification
       - **Exact click sequences** (e.g., "Click button with aria-label='Add User'")
       - **Expected visual outcomes** (what should appear/change)
       - **Expected console output** (including any debug logs to verify)
       - **Test data to use** (specific values to enter in forms)
       - **Success criteria** (what indicates the feature works correctly)
     * Format: Clear numbered steps that a manual tester can follow without deep page analysis
   - Agent returns structured testing guide
   - **Update TodoWrite**: Mark "PHASE 2: Get manual testing instructions" as completed
   - Save testing instructions for use by tester agent

### PHASE 2.5: Design Fidelity Validation (Conditional - Only if Figma Links Present)

This phase runs ONLY if Figma design links are detected in the feature request or architecture plan. It ensures pixel-perfect UI implementation before code review.

**1. Detect Figma Design Links**:
   - **Update TodoWrite**: Mark "PHASE 2.5: Detect Figma design links" as in_progress
   - Use Grep to search for Figma URLs in:
     * Original feature request (`$ARGUMENTS`)
     * Architecture plan files (AI-DOCS/*.md)
   - Figma URL pattern: `https://(?:www\.)?figma\.com/(?:file|design)/[a-zA-Z0-9]+/[^\s?]+(?:\?[^\s]*)?(?:node-id=[0-9-]+)?`
   - **Update TodoWrite**: Mark "PHASE 2.5: Detect Figma design links" as completed

**2. Skip Phase if No Figma Links**:
   - IF no Figma URLs found:
     * Log: "No Figma design references found. Skipping PHASE 2.5 (Design Fidelity Validation)."
     * **Update TodoWrite**: Mark "PHASE 2.5: Run design fidelity validation" as completed with note "Skipped - no design references"
     * **Update TodoWrite**: Mark "PHASE 2.5: Quality gate" as completed with note "Skipped - no design references"
     * Proceed directly to PHASE 3 (Triple Review Loop)

**3. Parse Design References** (if Figma links found):
   - Extract all unique Figma URLs from search results
   - For each Figma URL, identify:
     * Component/screen name (from URL text or surrounding context)
     * Node ID (if present in URL query parameter)
   - Match each design reference to implementation file(s):
     * Use component name to search for files (Glob/Grep)
     * If user provided explicit component list in plan, use that
     * Create mapping: `[Figma URL] → [Component Name] → [Implementation File Path(s)]`
   - Document the mapping for use in validation loop

**4. Ask User for Codex Review Preference**:
   - Use AskUserQuestion to ask: "Figma design references detected for UI components. Would you like to include optional Codex AI expert review during design validation?"
   - Options:
     * "Yes - Include Codex AI review for expert validation"
     * "No - Use only designer agent for validation"
   - Store user's choice for use in validation loop

**5. Run Iterative Design Fidelity Validation Loop**:
   - **Update TodoWrite**: Mark "PHASE 2.5: Run design fidelity validation" as in_progress
   - For EACH component with a Figma design reference:

   **Loop (max 3 iterations per component):**

   **Step 5.1: Launch Designer Agent**
   - Use Task tool with `subagent_type: designer`
   - Provide complete context:
     ```
     Review the [Component Name] implementation against the Figma design reference.

     **Design Reference**: [Figma URL]
     **Component Description**: [e.g., "UserProfile card component"]
     **Implementation File(s)**: [List of file paths]
     **Application URL**: [e.g., "http://localhost:5173" or staging URL]

     **Your Task:**
     1. Use Figma MCP to fetch the design reference screenshot
     2. Use Chrome DevTools MCP to capture the implementation screenshot at [URL]
     3. Perform comprehensive design review comparing:
        - Colors & theming
        - Typography
        - Spacing & layout
        - Visual elements (borders, shadows, icons)
        - Responsive design
        - Accessibility (WCAG 2.1 AA)
        - Interactive states
     4. Document ALL discrepancies with specific values
     5. Categorize issues by severity (CRITICAL/MEDIUM/LOW)
     6. Provide actionable fixes with code snippets
     7. Calculate design fidelity score

     Return detailed design review report.
     ```
   - Wait for designer agent to complete and return review report

   **Step 5.2: Analyze Designer Review Results**
   - Extract overall assessment from designer report (PASS / NEEDS IMPROVEMENT / FAIL)
   - Extract design fidelity score
   - Document issues found by severity

   **Step 5.3: Optional Codex Expert Review** (if user enabled)
   - IF user chose "Yes" for Codex review:
     * Use Task tool with `subagent_type: ui-developer-codex`
     * Provide complete prompt (orchestrator prepares):
       ```
       You are an expert UI/UX developer reviewing a React TypeScript component.

       DESIGN CONTEXT:
       - Component: [Component Name]
       - Design Reference: [Figma URL - captured screenshot]
       - Implementation: [Implementation file paths]

       DESIGNER FEEDBACK:
       [Paste complete designer review report here]

       CURRENT IMPLEMENTATION CODE:
       [Use Read tool to gather component code and paste here]

       TECH STACK:
       - React 19 with TypeScript
       - Tailwind CSS 4
       - [Design system if applicable: shadcn/ui, etc.]

       REVIEW STANDARDS:
       1. Design Fidelity: Does implementation match design reference?
       2. React Best Practices: Modern patterns, component composition
       3. Tailwind CSS Best Practices: Proper utilities, responsive, no dynamic classes
       4. Accessibility: WCAG 2.1 AA, ARIA, keyboard navigation, contrast
       5. Responsive Design: Mobile-first, all breakpoints
       6. Code Quality: TypeScript types, maintainability

       INSTRUCTIONS:
       Provide expert review with findings categorized as CRITICAL/MEDIUM/MINOR.
       For each finding provide:
       - Category (design/accessibility/responsive/code-quality)
       - Severity
       - Specific issue description
       - File path and line number
       - Current vs recommended implementation
       - Code example
       - Rationale

       Focus on actionable feedback with code examples.
       ```
     * Wait for Codex review results
   - IF user chose "No": Skip Codex review

   **Step 5.4: Determine if Fixes Needed**
   - IF designer assessment is "PASS" AND (no Codex review OR Codex found no critical issues):
     * Log: "[Component Name] passes design fidelity validation"
     * Move to next component
   - IF designer found issues OR Codex found critical/medium issues:
     * Proceed to Step 5.5 (Apply Fixes)

   **Step 5.5: Launch UI Developer to Apply Fixes**
   - Use Task tool with `subagent_type: ui-developer`
   - Provide complete context:
     ```
     Fix the UI implementation issues identified in the design review.

     **Component**: [Component Name]
     **Implementation File(s)**: [List of file paths]

     **DESIGNER FEEDBACK** (Visual Design Review):
     [Paste complete designer review report]

     [If Codex review was done:]
     **CODEX EXPERT REVIEW** (Code Quality & Best Practices):
     [Paste complete Codex review results]

     **Your Task:**
     1. Read all implementation files
     2. Address CRITICAL issues first, then MEDIUM, then LOW
     3. Apply fixes using modern React/TypeScript/Tailwind best practices:
        - Fix colors using correct Tailwind classes
        - Fix spacing using proper Tailwind scale (p-4, p-6, etc.)
        - Fix typography (font sizes, weights, line heights)
        - Fix layout issues (max-width, alignment, grid/flex)
        - Fix accessibility (ARIA, contrast, keyboard nav)
        - Fix responsive design (mobile-first breakpoints)
     4. Use Edit tool to modify files
     5. Run quality checks (typecheck, lint, build)
     6. Provide implementation summary

     DO NOT re-validate. Only apply the fixes.
     ```
   - Wait for ui-developer to complete fixes

   **Step 5.6: Check Loop Status**
   - Increment iteration count for this component
   - IF iteration < 3:
     * Loop back to Step 5.1 (re-run designer agent)
   - IF iteration = 3 AND issues still remain:
     * Ask user: "Component [Name] still has design issues after 3 iterations. How would you like to proceed?"
     * Options:
       - "Continue with current implementation (accept minor deviations)"
       - "Run 3 more iterations to refine further"
       - "Manual intervention needed"
     * Act based on user choice

   **End of Loop for Current Component**

   - Track metrics for each component:
     * Iterations used
     * Issues found and fixed
     * Final design fidelity score
     * Final assessment (PASS/NEEDS IMPROVEMENT)

**6. Quality Gate - All Components Validated**:
   - **Update TodoWrite**: Mark "PHASE 2.5: Run design fidelity validation" as completed
   - **Update TodoWrite**: Mark "PHASE 2.5: Quality gate - ensure UI matches design" as in_progress
   - IF all components passed design validation (PASS assessment):
     * Log: "✅ All UI components match design specifications"
     * **Update TodoWrite**: Mark quality gate as completed
     * Proceed to PHASE 3
   - IF any component has FAIL assessment after max iterations:
     * Document which components failed
     * Ask user: "Some components failed design validation. Proceed anyway or iterate more?"
     * Act based on user choice
   - **Update TodoWrite**: Mark "PHASE 2.5: Quality gate" as completed

**Design Fidelity Validation Summary** (to be included in final report):
```markdown
## PHASE 2.5: Design Fidelity Validation Results

**Figma References Found**: [Number]
**Components Validated**: [Number]
**Codex Expert Review**: [Enabled/Disabled]

### Validation Results by Component:

**[Component 1 Name]**:
- Design Reference: [Figma URL]
- Iterations: [X/3]
- Issues Found: [Total count]
  - Critical: [Count] - All Fixed ✅
  - Medium: [Count] - All Fixed ✅
  - Low: [Count] - [Fixed/Accepted]
- Final Design Fidelity Score: [X/60]
- Assessment: [PASS ✅ / NEEDS IMPROVEMENT ⚠️]

**[Component 2 Name]**:
...

### Overall Design Validation:
- Total Issues Found: [Number]
- Total Issues Fixed: [Number]
- Average Design Fidelity Score: [X/60]
- All Components Pass: [Yes ✅ / No ❌]
```

**REMINDER**: You are orchestrating. You do NOT implement fixes yourself. Always use Task to delegate to designer and ui-developer agents.

### PHASE 3: Triple Review Loop (Code + Code AI + Manual UI Testing)

1. **Prepare Review Context**:
   - **Update TodoWrite**: Mark "PHASE 3: Launch all three reviewers in parallel" as in_progress
   - Run `git status` to identify all unstaged changes
   - Run `git diff` to capture the COMPLETE implementation changes
   - Read planning documentation from AI-DOCS folder to get 2-3 sentence summary
   - Retrieve the manual testing instructions from Step 3 of Phase 2
   - Prepare this context for all three reviewers

2. **Launch ALL THREE Reviewers in Parallel**:
   - **CRITICAL**: Use a single message with THREE Task tool calls to run all reviews in parallel

   **Parallel Execution Example**:
   ```
   Send a single message with THREE Task calls:

   Task 1: Launch reviewer
   Task 2: Launch codex-reviewer
   Task 3: Launch tester
   ```

   - **Reviewer 1 - Senior Code Reviewer (Human-Focused Review)**:
     * Use Task tool with `subagent_type: reviewer`
     * Provide context:
       - "Review all unstaged git changes from the current implementation"
       - Path to the original plan for reference (AI-DOCS/...)
       - Request comprehensive review against:
         * Simplicity principles
         * OWASP security standards
         * React and TypeScript best practices
         * Code quality and maintainability
         * Alignment with the approved plan

   - **Reviewer 2 - Codex Code Analyzer (Automated AI Review)**:
     * Use Task tool with `subagent_type: codex-reviewer`
     * **IMPORTANT**: This agent is a PROXY to Codex AI. Prepare a COMPLETE prompt with all context.
     * Provide a fully prepared prompt containing:
       ```
       You are an expert code reviewer analyzing a TypeScript/React implementation.

       PLANNING CONTEXT:
       [2-3 sentence summary from AI-DOCS planning files]

       TECH STACK:
       - TypeScript, Vite, Vitest
       - TanStack Router, TanStack Query
       - React, shadcn/ui components

       REVIEW STANDARDS:
       - KISS principle (simplicity above all)
       - OWASP security best practices
       - TypeScript and React best practices
       - Code quality and maintainability
       - Performance considerations

       CODE TO REVIEW (complete git diff output):
       [Paste COMPLETE git diff output here]

       INSTRUCTIONS:
       Analyze this code and categorize ALL findings as:
       - CRITICAL: Security vulnerabilities, breaking bugs, must fix immediately
       - MEDIUM: Code quality issues, performance concerns, should fix soon
       - MINOR: Style issues, documentation improvements, nice to have

       For EACH finding provide:
       1. Severity level (CRITICAL/MEDIUM/MINOR)
       2. File path and line number
       3. Clear description of the issue
       4. Specific recommendation to fix it
       5. Example of correct implementation (if applicable)

       Provide a comprehensive review with actionable feedback.
       ```
     * The agent will forward this complete prompt to Codex AI and return the results

   - **Reviewer 3 - UI Manual Tester (Real Browser Testing)**:
     * Use Task tool with `subagent_type: tester`
     * Provide context:
       - **Manual testing instructions** from Phase 2 Step 3 (the structured guide from developer)
       - Application URL (e.g., http://localhost:5173 or staging URL)
       - Feature being tested (e.g., "User Management Feature")
       - Planning context from AI-DOCS for understanding expected behavior
     * The agent will:
       - Follow the step-by-step testing instructions provided
       - Use specific UI selectors (aria-labels, data-testid) mentioned in instructions
       - Verify expected visual outcomes
       - Check console output against expected logs
       - Validate with provided test data
       - Report any discrepancies, UI bugs, console errors, or unexpected behavior
     * Testing should be efficient and focused (no excessive screenshots or deep analysis)
     * Results should include:
       - ✅ Steps that passed with expected outcomes
       - ❌ Steps that failed with actual vs expected outcomes
       - Console errors or warnings found
       - UI/UX issues discovered
       - Overall assessment: PASS / FAIL / PARTIAL

3. **Collect and Analyze Triple Review Results**:
   - Wait for ALL THREE reviewers to complete
   - **Update TodoWrite**: Mark "PHASE 3: Launch all three reviewers" as completed
   - **Update TodoWrite**: Mark "PHASE 3: Analyze triple review results" as in_progress
   - **Senior Code Reviewer Feedback**: Document all findings and recommendations
   - **Codex Analysis Feedback**: Document all automated findings
   - **UI Manual Tester Feedback**: Document all testing results, UI bugs, and console errors
   - **Combined Analysis**:
     * Merge and deduplicate issues from all three sources
     * Categorize by severity (critical, major, minor)
     * Identify overlapping concerns (higher confidence when multiple reviewers find the same issue)
     * Note unique findings from each reviewer:
       - Code review findings (logic, security, quality)
       - Automated analysis findings (patterns, best practices)
       - UI testing findings (runtime behavior, user experience, console errors)
     * Cross-reference: UI bugs may reveal code issues, console errors may indicate missing error handling
   - **Update TodoWrite**: Mark "PHASE 3: Analyze triple review results" as completed

4. **Triple Review Feedback Loop**:
   - **Update TodoWrite**: Mark "PHASE 3: Quality gate - ensure all three reviewers approved" as in_progress
   - IF **ANY** reviewer identifies issues:
     * Document all feedback clearly from ALL THREE reviewers
     * Categorize and prioritize the combined feedback:
       - **Code issues** (from reviewer and codex)
       - **UI/runtime issues** (from tester)
       - **Console errors** (from tester)
     * **Update TodoWrite**: Add "PHASE 3 - Iteration X: Fix issues and re-run all reviewers" task
     * **CRITICAL**: Do NOT fix issues yourself - delegate to developer agent
     * **Launch developer agent** using Task tool with:
       - Original plan reference (path to AI-DOCS)
       - Combined feedback from ALL THREE reviewers:
         * Code review feedback (logic, security, quality issues)
         * Automated analysis feedback (patterns, best practices)
         * UI testing feedback (runtime bugs, console errors, UX issues)
       - Clear instruction: "Fix all issues identified by reviewers and testers"
       - Priority order for fixes (Critical first, then Medium, then Minor)
       - Note: Some UI bugs may require code changes, console errors may indicate missing error handling
       - Instruction to run quality checks after fixes
     * After developer completes fixes:
       - **IMPORTANT**: Request updated manual testing instructions if implementation changed significantly
       - Re-run ALL THREE reviewers in parallel (loop back to step 2)
     * Repeat until ALL THREE reviewers approve
   - IF **ALL THREE** reviewers approve:
     * Document that triple review passed (code review + automated analysis + manual UI testing)
     * **Update TodoWrite**: Mark "PHASE 3: Quality gate - ensure all three reviewers approved" as completed
     * Proceed to Phase 4
   - **Track loop iterations** (document how many review cycles occurred and feedback from each reviewer/tester)

   **REMINDER**: You are orchestrating. You do NOT fix code yourself. Always use Task to delegate to developer.

### PHASE 4: Testing Loop (test-architect)

1. **Launch Testing Agent**:
   - **Update TodoWrite**: Mark "PHASE 4: Launch test-architect" as in_progress
   - Use Task tool with `subagent_type: test-architect`
   - Provide:
     * Implemented code (reference to files)
     * Original plan requirements
     * Instruction to create comprehensive test coverage
     * Instruction to run all tests

2. **Test Results Analysis**:
   - Agent writes tests and executes them
   - Analyzes test results
   - **Update TodoWrite**: Mark "PHASE 4: Launch test-architect" as completed
   - **Update TodoWrite**: Mark "PHASE 4: Quality gate - ensure all tests pass" as in_progress

3. **Test Feedback Loop** (Inner Loop):
   - IF tests fail due to implementation bugs:
     * **Update TodoWrite**: Add "PHASE 4 - Iteration X: Fix implementation bugs and re-test" task
     * Document the test failures and root cause analysis
     * **CRITICAL**: Do NOT fix bugs yourself - delegate to developer agent
     * **Launch developer agent** using Task tool with:
       - Test failure details (which tests failed, error messages, stack traces)
       - Root cause analysis from test architect
       - Instruction: "Fix implementation bugs causing test failures"
       - Original plan reference
       - Instruction to run quality checks after fixes
     * After developer completes fixes, re-run BOTH reviewers in parallel (Loop back to Phase 3)
     * After code review approval, re-run test-architect
     * Repeat until all tests pass
   - IF tests fail due to test issues (not implementation):
     * **Update TodoWrite**: Add "PHASE 4 - Iteration X: Fix test issues" task
     * **Launch test-architect agent** using Task tool to fix the test code
     * Re-run tests after test fixes
   - IF all tests pass:
     * **Update TodoWrite**: Mark "PHASE 4: Quality gate - ensure all tests pass" as completed
     * Proceed to Phase 5
   - **Track loop iterations** (document how many test-fix cycles occurred)

   **REMINDER**: You are orchestrating. You do NOT fix implementation bugs yourself. Always use Task to delegate to developer.

### PHASE 5: User Review & Project Cleanup

1. **User Final Review Gate**:
   - **Update TodoWrite**: Mark "PHASE 5: User approval gate - present implementation for final review" as in_progress
   - Present the completed implementation to the user:
     * Summary of what was implemented
     * All code review approvals received (reviewer + codex)
     * Manual UI testing passed (tester)
     * All automated tests passing confirmation (vitest)
     * Key files created/modified
   - Use AskUserQuestion to ask: "Are you satisfied with this implementation? All code has been reviewed, UI tested manually, and automated tests pass."
   - Options: "Yes, proceed to cleanup and finalization" / "No, I need changes"

2. **User Feedback Loop**:
   - IF user not satisfied:
     * Collect specific feedback on what needs to change
     * **Update TodoWrite**: Add "PHASE 5 - Iteration X: Address user feedback" task
     * **CRITICAL**: Do NOT make changes yourself - delegate to appropriate agent
     * Determine which agent to use based on feedback type:
       - If architectural changes needed: **Launch architect** (Loop back to Phase 1)
       - If implementation changes needed: **Launch developer** with user feedback (Loop back to Phase 2)
       - If only test changes needed: **Launch test-architect** (Loop back to Phase 4)
     * After agent addresses feedback, go through subsequent phases again
     * Repeat until user is satisfied
   - IF user satisfied:
     * **Update TodoWrite**: Mark "PHASE 5: User approval gate - present implementation for final review" as completed
     * Proceed to cleanup
   - **DO NOT proceed to cleanup without user approval**

   **REMINDER**: You are orchestrating. You do NOT implement user feedback yourself. Always use Task to delegate to the appropriate agent.

3. **Launch Project Cleanup**:
   - **Update TodoWrite**: Mark "PHASE 5: Launch cleaner to clean up temporary artifacts" as in_progress
   - Use Task tool with `subagent_type: cleaner`
   - Provide context:
     * The implementation is complete and user-approved
     * Request cleanup of:
       - Temporary test files
       - Development artifacts
       - Intermediate documentation
       - Any scaffolding or setup scripts
     * Preserve:
       - Final implementation code
       - Final tests
       - User-facing documentation
       - Configuration files

4. **Cleanup Completion**:
   - Agent removes temporary files and provides cleanup summary
   - **Update TodoWrite**: Mark "PHASE 5: Launch cleaner to clean up temporary artifacts" as completed
   - Proceed to Phase 6 for final summary

### PHASE 6: Final Summary & Completion

1. **Generate Comprehensive Summary**:
   - **Update TodoWrite**: Mark "PHASE 6: Generate comprehensive final summary" as in_progress
   Create a detailed summary including:

   **Implementation Summary:**
   - Features implemented (reference plan sections)
   - Files created/modified (list with brief description)
   - Key architectural decisions made
   - Patterns and components used

   **Quality Assurance:**
   - Design Fidelity Validation (PHASE 2.5):
     * Figma references found: [Number or "N/A"]
     * Components validated against design: [Number or "N/A"]
     * Design fidelity iterations: [Number or "N/A"]
     * Issues found and fixed: [Number or "N/A"]
     * Average design fidelity score: [X/60 or "N/A"]
     * Codex UI expert review: [Enabled/Disabled or "N/A"]
     * All components match design: [Yes ✅ / No ❌ / "N/A"]
   - Number of triple review cycles completed (code + codex + UI testing)
   - Senior Code Reviewer feedback summary
   - Codex Analyzer feedback summary
   - UI Manual Tester results summary:
     * Manual test steps executed
     * UI bugs found and fixed
     * Console errors found and resolved
     * Final assessment: PASS
   - Number of automated test-fix cycles completed
   - Test coverage achieved
   - All automated tests passing confirmation

   **How to Test:**
   - Step-by-step manual testing instructions
   - Key user flows to verify
   - Expected behavior descriptions

   **How to Run:**
   - Commands to run the application
   - Any environment setup needed
   - How to access the new feature

   **Outstanding Items:**
   - Minor issues flagged by dual review (if any)
   - Future enhancements suggested
   - Technical debt considerations
   - Documentation that should be updated

   **Metrics:**
   - Total time/iterations
   - Design fidelity cycles: [number or "N/A - no Figma references"]
   - Components validated against design: [number or "N/A"]
   - Design issues found and fixed: [number or "N/A"]
   - Average design fidelity score: [X/60 or "N/A"]
   - Triple review cycles: [number] (code + codex + UI testing)
   - Manual UI test steps: [number executed]
   - UI bugs found and fixed: [number]
   - Console errors found and resolved: [number]
   - Automated test-fix cycles: [number]
   - User feedback iterations: [number]
   - Files changed: [number]
   - Lines added/removed: [from git diff --stat]
   - Files cleaned up by cleaner: [number]

   - **Update TodoWrite**: Mark "PHASE 6: Generate comprehensive final summary" as completed

2. **User Handoff**:
   - **Update TodoWrite**: Mark "PHASE 6: Present summary and complete user handoff" as in_progress
   - Present summary clearly
   - Provide next steps or recommendations
   - Offer to address any remaining concerns
   - **Update TodoWrite**: Mark "PHASE 6: Present summary and complete user handoff" as completed
   - **Congratulations! All workflow phases completed successfully!**

## Orchestration Rules

### Agent Communication:
- Each agent receives context from previous phases
- Document decisions and rationale throughout
- Maintain a workflow log showing agent transitions

### Loop Prevention:
- Maximum 3 design fidelity iterations per component before escalating to user
- Maximum 3 triple review cycles (code + codex + UI testing) before escalating to user
- Maximum 5 automated test-fix cycles before escalating to user
- If loops exceed limits, ask user for guidance

### Error Handling:
- If any agent encounters blocking errors, pause and ask user for guidance
- Document all blockers clearly with context
- Provide options for resolution

### Git Hygiene:
- All work happens on unstaged changes until final approval
- Do not commit during the workflow
- Preserve git state for review analysis

### Quality Gates:
- User approval required after Phase 1 (architecture plan)
- ALL UI components must match design specifications (Phase 2.5 gate - if Figma links present)
- **ALL THREE** reviewer approvals required before Phase 4 (reviewer AND Codex AND tester)
- All automated tests must pass before Phase 5
- User approval required after Phase 5 (final implementation review)
- Each gate is mandatory - no skipping

## Success Criteria

The command is complete when:
1. ✅ User approved the architecture plan (Phase 1 gate)
2. ✅ Implementation follows the approved plan
3. ✅ Manual testing instructions generated by implementation agent
4. ✅ ALL UI components match design specifications (Phase 2.5 gate - if applicable)
5. ✅ **ALL THREE** reviewers approved the implementation (Phase 3 gate: reviewer AND Codex AND tester)
6. ✅ Manual UI testing passed with no critical issues
7. ✅ All automated tests written and passing (Phase 4 gate)
8. ✅ User approved the final implementation (Phase 5 gate)
9. ✅ Project cleanup completed successfully
10. ✅ Comprehensive summary provided
11. ✅ User acknowledges completion

## Examples: Correct vs Incorrect Orchestrator Behavior

### ❌ INCORRECT: Orchestrator Trying to Fix Code Directly

```
Scenario: Code reviewer finds a TypeScript type error

WRONG BEHAVIOR:
> I see the reviewer found a type error in src/api/mockUserApi.ts.
> Let me quickly fix that.
>
> Edit(file_path: "src/api/mockUserApi.ts", old_string: "...", new_string: "...")
>
> Fixed! Now re-running reviewers...
```

**Why this is wrong**: The orchestrator used Edit tool to fix code directly instead of delegating to developer agent.

### ✅ CORRECT: Orchestrator Delegating to Agent

```
Scenario: Code reviewer finds a TypeScript type error

CORRECT BEHAVIOR:
> I see the reviewer found a type error in src/api/mockUserApi.ts.
> I need to delegate this fix to the developer agent.
>
> Task(
>   subagent_type: "developer",
>   prompt: "Fix the TypeScript type error identified by code reviewer:
>
>   File: src/api/mockUserApi.ts
>   Issue: Return type of getUsers() should be Promise<User[]> not Promise<any>
>
>   Please fix this type error and run quality checks."
> )
```

**Why this is correct**: The orchestrator delegated the fix to developer agent using the Task tool.

### ❌ INCORRECT: Orchestrator Creating New Files

```
Scenario: Need to create a new utility file

WRONG BEHAVIOR:
> I'll create a new utility file for date formatting.
>
> Write(
>   file_path: "src/lib/dateUtils.ts",
>   content: "export function formatDate(date: Date) { ... }"
> )
```

**Why this is wrong**: The orchestrator created a file directly instead of delegating to developer agent.

### ✅ CORRECT: Orchestrator Delegating File Creation

```
Scenario: Need to create a new utility file

CORRECT BEHAVIOR:
> I need a new utility file for date formatting.
> I'll delegate this to the developer agent.
>
> Task(
>   subagent_type: "developer",
>   prompt: "Create a new utility file src/lib/dateUtils.ts with date formatting functions.
>
>   Include:
>   - formatDate(date: Date): string - format to YYYY-MM-DD
>   - formatDateTime(date: Date): string - format to YYYY-MM-DD HH:mm:ss
>
>   Follow existing project patterns and run quality checks."
> )
```

**Why this is correct**: The orchestrator delegated file creation to developer agent.

### ❌ INCORRECT: Orchestrator Analyzing and Fixing Test Failures

```
Scenario: Tests are failing

WRONG BEHAVIOR:
> Tests are failing in UserForm.test.ts. Let me read the test file
> and the implementation to understand the issue.
>
> Read(file_path: "src/components/users/UserForm.test.ts")
> Read(file_path: "src/components/users/UserForm.tsx")
>
> I see the problem - the onChange handler expects a different signature.
> Let me fix it:
>
> Edit(file_path: "src/components/users/UserForm.tsx", ...)
```

**Why this is wrong**: The orchestrator analyzed the issue and fixed it directly instead of delegating to developer agent.

### ✅ CORRECT: Orchestrator Delegating Test Failure Resolution

```
Scenario: Tests are failing

CORRECT BEHAVIOR:
> Tests are failing in UserForm component. The test-architect
> has identified that the onChange handler signature is incorrect.
>
> I'll delegate this implementation bug fix to developer.
>
> Task(
>   subagent_type: "developer",
>   prompt: "Fix implementation bugs causing test failures:
>
>   Test File: src/components/users/UserForm.test.ts
>   Implementation: src/components/users/UserForm.tsx
>
>   Issue: onChange handler signature mismatch
>   Expected: (field: string, value: string) => void
>   Actual: (value: string) => void
>
>   Please fix the implementation and ensure all tests pass."
> )
```

**Why this is correct**: The orchestrator delegated the bug fix to developer agent with clear context.

### Summary of Orchestrator Role

**YOU ARE**: A workflow coordinator who launches agents and manages quality gates
**YOU ARE NOT**: An implementer who writes or fixes code

**YOUR JOB**:
- Run git commands to understand changes
- Read planning docs to gather context
- Launch agents with Task tool
- Track progress with TodoWrite
- Manage quality gates with AskUserQuestion
- Present summaries and results to user

**NOT YOUR JOB**:
- Write code
- Edit code
- Fix bugs
- Create files
- Refactor code
- Analyze implementation details

**When in doubt**: Use Task to delegate to an agent!

## Notes

- This is a long-running orchestration - expect multiple agent invocations
- **PHASE 2.5 (Design Fidelity Validation)** is conditional:
  * Only runs if Figma design links are detected in feature request or architecture plan
  * Uses designer agent to review implementation vs design reference
  * Uses ui-developer agent to fix visual/UX discrepancies
  * Optional ui-developer-codex agent provides third-party expert review
  * Maximum 3 iterations per component before escalating to user
  * Ensures pixel-perfect implementation before code review phase
- **CRITICAL**: Always run all three reviewers in parallel using THREE Task tool calls in a single message:
  * Task 1: `subagent_type: reviewer` (human-focused code review using Sonnet)
  * Task 2: `subagent_type: codex-reviewer` (automated AI code review using Codex via mcp__codex-cli__ask-codex)
  * Task 3: `subagent_type: tester` (real browser manual UI testing with Chrome DevTools)
  * All THREE Task calls must be in the SAME message for true parallel execution
- Before running tester, ensure you have manual testing instructions from the implementation agent
- Maintain clear communication with user at each quality gate (Plan, Implementation, Triple Review, Tests, Final Implementation)
- Document all decisions and iterations from all three reviewers
- Be transparent about any compromises or trade-offs made
- If anything is unclear during execution, ask the user rather than making assumptions
- The triple-review system provides comprehensive validation through three independent perspectives:
  * **reviewer**: Traditional human-style review with 15+ years experience perspective (code quality, architecture, security)
  * **codex-reviewer**: Automated AI analysis using Codex models for pattern detection (best practices, potential bugs)
  * **tester**: Real browser testing with manual interaction (runtime behavior, UI/UX, console errors)
- The tester follows specific testing instructions with accessibility selectors, making tests efficient and reproducible
- UI testing catches runtime issues that static code review cannot detect (event handlers, state management, API integration)
- Console errors found during UI testing often reveal missing error handling or race conditions in the code
- The cleaner agent runs only after user approval to ensure no important artifacts are removed prematurely
- User approval gates ensure the user stays in control of the implementation direction and final deliverable
