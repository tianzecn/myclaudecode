---
description: Implement UI components from scratch with design reference, intelligent validation, and adaptive agent switching
allowed-tools: Task, AskUserQuestion, Bash, Read, TodoWrite, Glob, Grep
---

## Mission

Implement new UI components from scratch based on a design reference (Figma, screenshot, mockup) using specialized UI development agents with intelligent validation and adaptive agent switching for optimal results.

## CRITICAL: Orchestrator Constraints

**You are an ORCHESTRATOR, not an IMPLEMENTER.**

**✅ You MUST:**
- Use Task tool to delegate ALL work to agents
- Use Bash to run git commands (status, diff)
- Use Read/Glob/Grep to understand context
- Use TodoWrite to track workflow progress
- Use AskUserQuestion to gather inputs and preferences
- Coordinate agent workflows with smart switching logic

**❌ You MUST NOT:**
- Write or edit ANY code files directly (no Write, no Edit tools)
- Implement UI components yourself
- Fix issues yourself
- Create new files yourself
- Modify existing code yourself

**Delegation Rules:**
- ALL UI implementation → ui-developer agent
- ALL design validation → designer agent
- OPTIONAL expert fixes → ui-developer-codex agent (smart switching)

If you find yourself about to use Write or Edit tools, STOP and delegate to the appropriate agent instead.

## User Inputs

The command starts by gathering the following information from the user.

## Multi-Agent Orchestration Workflow

### PRELIMINARY: Check for Code Analysis Tools (Recommended)

**Before starting UI implementation, check if the code-analysis plugin is available:**

Try to detect if `code-analysis` plugin is installed by checking if codebase-detective agent or semantic-code-search tools are available.

**If code-analysis plugin is NOT available:**

Inform the user with this message:

```
💡 Recommendation: Install Code Analysis Plugin

For optimal UI component integration and finding existing design patterns,
we recommend installing the code-analysis plugin.

Benefits:
- 🔍 Find existing UI components and patterns to match your design system
- 🕵️ Discover styling conventions (Tailwind classes, color schemes, spacing)
- 📊 Locate similar components to maintain consistency
- 🎯 Identify where to place new components in the project structure

Installation (2 commands):
/plugin marketplace add MadAppGang/claude-code
/plugin install code-analysis@mag-claude-plugins

Repository: https://github.com/MadAppGang/claude-code

You can continue without it, but investigation of existing UI patterns will be less efficient.
```

**If code-analysis plugin IS available:**

Great! You can use the codebase-detective agent to investigate existing UI components,
styling patterns, and the best location for the new component.

**Then proceed with the UI implementation workflow regardless of plugin availability.**

---

### PHASE 0: Initialize Workflow Todo List (MANDATORY FIRST STEP)

**BEFORE** starting, create a global workflow todo list using TodoWrite:

```
TodoWrite with the following items:
- content: "PHASE 1: Gather user inputs (design reference, component description, preferences)"
  status: "in_progress"
  activeForm: "PHASE 1: Gathering user inputs"
- content: "PHASE 1: Validate inputs and find target location for implementation"
  status: "pending"
  activeForm: "PHASE 1: Validating inputs"
- content: "PHASE 2: Launch UI Developer for initial implementation from scratch"
  status: "pending"
  activeForm: "PHASE 2: Initial UI implementation"
- content: "PHASE 3: Start validation and iterative fixing loop (max 10 iterations)"
  status: "pending"
  activeForm: "PHASE 3: Validation and fixing loop"
- content: "PHASE 3: Quality gate - ensure design fidelity achieved"
  status: "pending"
  activeForm: "PHASE 3: Design fidelity quality gate"
- content: "PHASE 4: Generate final implementation report"
  status: "pending"
  activeForm: "PHASE 4: Generating final report"
- content: "PHASE 4: Present results and complete handoff"
  status: "pending"
  activeForm: "PHASE 4: Presenting results"
```

**Update this global todo list** as you progress through each phase.

### PHASE 1: Gather User Inputs

**Step 1: Ask for Design Reference**

Use AskUserQuestion or simple text prompt to ask:

```
Please provide the design reference for the UI component you want to implement:

Options:
1. Figma URL (e.g., https://figma.com/design/abc123.../node-id=136-5051)
2. Screenshot file path (local file on your machine)
3. Remote URL (live design reference at a URL)

What is your design reference?
```

Store the user's response as `design_reference`.

**Step 2: Ask for Component Description**

Ask:
```
What UI component(s) do you want to implement from this design?

Examples:
- "User profile card component"
- "Navigation header with mobile menu"
- "Product listing grid with filters"
- "Dashboard layout with widgets"

What component(s) should I implement?
```

Store the user's response as `component_description`.

**Step 3: Ask for Target Location**

Ask:
```
Where should I create this component?

Options:
1. Provide a specific directory path (e.g., "src/components/profile/")
2. Let me suggest based on component type
3. I'll tell you after seeing the component structure

Where should I create the component files?
```

Store the user's response as `target_location`.

**Step 4: Ask for Application URL**

Ask:
```
What is the URL where I can preview the implementation?

Examples:
- http://localhost:5173 (Vite default)
- http://localhost:3000 (Next.js/CRA default)
- https://staging.yourapp.com

What is the preview URL?
```

Store the user's response as `app_url`.

**Step 5: Ask for UI Developer Codex Preference**

Use AskUserQuestion:
```
Would you like to enable UI Developer Codex for intelligent agent switching?

When enabled:
- If UI Developer struggles (2 consecutive failures), switches to UI Developer Codex
- If UI Developer Codex struggles (2 consecutive failures), switches back to UI Developer
- Provides adaptive fixing with both agents for best results

Enable UI Developer Codex for intelligent switching?
```

Options:
- "Yes - Enable intelligent agent switching with Codex"
- "No - Use only UI Developer agent"

Store the user's choice as `codex_enabled` (boolean).

**Step 6: Validate Inputs**

- **Update TodoWrite**: Mark "PHASE 1: Gather user inputs" as completed
- **Update TodoWrite**: Mark "PHASE 1: Validate inputs" as in_progress

**Validate Design Reference:**
- If contains "figma.com" → Figma design
- If starts with "http://" or "https://" → Remote URL
- If starts with "/" or "~/" → Local file path
- Verify format is valid

**Validate Component Description:**
- Must not be empty
- Should describe what to implement

**Validate Target Location:**
- If path provided, verify directory exists or can be created
- If "suggest", analyze project structure and suggest location
- If "tell me later", defer until after seeing component

**Validate Application URL:**
- Must be valid URL format
- Should be accessible (optional check)

If any validation fails, re-ask for that specific input.

- **Update TodoWrite**: Mark "PHASE 1: Validate inputs" as completed

### PHASE 2: Initial Implementation from Scratch

**Step 1: Launch UI Developer for Initial Implementation**

- **Update TodoWrite**: Mark "PHASE 2: Launch UI Developer for initial implementation" as in_progress

Use Task tool with `subagent_type: frontend:ui-developer`:

```
Implement the following UI component(s) from scratch based on the design reference.

**Design Reference**: [design_reference - Figma URL, file path, or remote URL]
**Component Description**: [component_description]
**Target Location**: [target_location or suggested path]
**Application URL**: [app_url]

**Your Task:**

1. **Analyze the design reference:**
   - If Figma: Use Figma MCP to fetch the design screenshot and inspect design specs
   - If Remote URL: Use Chrome DevTools MCP to capture screenshot
   - If Local file: Read the file to view the design

2. **Plan the component structure:**
   - Determine component hierarchy (parent/children)
   - Identify reusable sub-components
   - Plan file structure based on atomic design principles

3. **Implement the UI components from scratch using modern best practices:**
   - React 19 with TypeScript
   - Tailwind CSS 4 (utility-first, no @apply, static classes only)
   - Mobile-first responsive design
   - Accessibility (WCAG 2.1 AA, ARIA attributes)
   - Use existing design system components if available (shadcn/ui, etc.)

4. **Match the design reference exactly:**
   - Colors (use Tailwind theme colors or exact hex values)
   - Typography (font families, sizes, weights, line heights)
   - Spacing (padding, margins, gaps using Tailwind scale)
   - Layout (flexbox, grid, alignment)
   - Visual elements (borders, shadows, border-radius)
   - Interactive states (hover, focus, active, disabled)

5. **Create component files in target location:**
   - Use Write tool to create new files
   - Follow project conventions for naming and structure
   - Include proper TypeScript types
   - Add JSDoc comments for exported components

6. **Ensure code quality:**
   - Run typecheck: `npx tsc --noEmit`
   - Run linter: `npm run lint`
   - Run build: `npm run build`
   - Fix any errors before finishing

7. **Provide implementation summary:**
   - Files created (paths and purpose)
   - Components implemented
   - Key decisions made
   - Any assumptions or notes

**Important:**
- This is a brand new implementation from scratch
- Do NOT edit existing files unless integrating with existing components
- Follow the project's existing patterns and conventions
- Ensure the component is accessible and responsive
- Use modern React/TypeScript/Tailwind best practices (2025)

Return a detailed implementation summary when complete.
```

Wait for ui-developer to complete initial implementation.

**Step 2: Review Implementation Summary**

- Document files created
- Document components implemented
- Note any issues reported by ui-developer

- **Update TodoWrite**: Mark "PHASE 2: Launch UI Developer for initial implementation" as completed

### PHASE 3: Validation and Adaptive Fixing Loop

**Initialize Loop Variables:**
```
iteration_count = 0
max_iterations = 10
previous_issues_count = None
current_issues_count = None
last_agent_used = None
ui_developer_consecutive_failures = 0
codex_consecutive_failures = 0
design_fidelity_achieved = false
iteration_history = []
```

- **Update TodoWrite**: Mark "PHASE 3: Start validation and iterative fixing loop" as in_progress

**Loop: While iteration_count < max_iterations AND NOT design_fidelity_achieved**

**Step 3.1: Launch Designer Agent for Validation**

Use Task tool with `subagent_type: frontend:designer`:

```
Review the implemented UI component against the design reference and provide a detailed design fidelity report.

**Iteration**: [iteration_count + 1] / [max_iterations]
**Design Reference**: [design_reference]
**Component Description**: [component_description]
**Implementation File(s)**: [List of files created in Phase 2 or updated in fixes]
**Application URL**: [app_url]

**Your Task:**

1. Fetch the design reference screenshot (Figma MCP / Chrome DevTools / Read file)
2. Capture the implementation screenshot at [app_url]
3. Perform comprehensive design review:
   - Colors & theming
   - Typography
   - Spacing & layout
   - Visual elements
   - Responsive design
   - Accessibility (WCAG 2.1 AA)
   - Interactive states

4. Document ALL discrepancies with specific values
5. Categorize issues by severity (CRITICAL/MEDIUM/LOW)
6. Provide actionable fixes with code snippets
7. Calculate design fidelity score (X/60)

8. **Provide overall assessment:**
   - PASS ✅ (implementation matches design, score >= 54/60)
   - NEEDS IMPROVEMENT ⚠️ (some issues, score 40-53/60)
   - FAIL ❌ (significant issues, score < 40/60)

Return detailed design review report with issue count and assessment.
```

Wait for designer agent to complete validation.

**Step 3.2: Extract Results from Designer Report**

Extract from designer's report:
- Overall assessment: PASS / NEEDS IMPROVEMENT / FAIL
- Issue count (CRITICAL + MEDIUM + LOW)
- Design fidelity score
- List of issues found

Set `current_issues_count` = issue count from designer report.

**Step 3.3: Check if Design Fidelity Achieved**

IF designer assessment is "PASS":
- Set `design_fidelity_achieved = true`
- Log: "✅ Design fidelity achieved! Component matches design reference."
- **Update TodoWrite**: Mark "PHASE 3: Quality gate - ensure design fidelity achieved" as completed
- **Exit loop** (success)

**Step 3.4: Determine Fixing Agent (Smart Switching Logic)**

IF `design_fidelity_achieved` is false (still have issues):

**Determine which agent to use for fixes:**

```python
def determine_fixing_agent():
    # If Codex not enabled, always use UI Developer
    if not codex_enabled:
        return "ui-developer"

    # Smart switching based on consecutive failures
    if ui_developer_consecutive_failures >= 2:
        # UI Developer struggling (failed 2+ times in a row)
        # Switch to UI Developer Codex
        return "ui-developer-codex"

    if codex_consecutive_failures >= 2:
        # Codex struggling (failed 2+ times in a row)
        # Switch back to UI Developer
        return "ui-developer"

    # Default: Use UI Developer (or continue with last successful agent)
    if last_agent_used is None:
        return "ui-developer"

    # If no consecutive failures, continue with same agent
    return last_agent_used
```

Determine `fixing_agent` using the logic above.

Log agent selection:
- "Using [fixing_agent] to apply fixes (Iteration [iteration_count + 1])"
- If switched: "Switched to [fixing_agent] due to [previous_agent] consecutive failures"

**Step 3.5: Launch Fixing Agent**

**IF fixing_agent == "ui-developer":**

Use Task tool with `subagent_type: frontend:ui-developer`:

```
Fix the UI implementation issues identified in the design review.

**Iteration**: [iteration_count + 1] / [max_iterations]
**Component**: [component_description]
**Implementation File(s)**: [List of files]

**DESIGNER FEEDBACK** (Design Fidelity Review):
[Paste complete designer review report here]

**Your Task:**
1. Read all implementation files
2. Address CRITICAL issues first, then MEDIUM, then LOW
3. Apply fixes using modern React/TypeScript/Tailwind best practices:
   - Fix colors using correct Tailwind classes or hex values
   - Fix spacing using proper Tailwind scale (p-4, p-6, etc.)
   - Fix typography (font sizes, weights, line heights)
   - Fix layout issues (max-width, alignment, grid/flex)
   - Fix accessibility (ARIA, contrast, keyboard nav)
   - Fix responsive design (mobile-first breakpoints)
4. Use Edit tool to modify files
5. Run quality checks (typecheck, lint, build)
6. Provide implementation summary with:
   - Issues addressed
   - Changes made (file by file)
   - Any remaining concerns

DO NOT re-validate. Only apply the fixes.

Return detailed fix summary when complete.
```

**IF fixing_agent == "ui-developer-codex":**

Use Task tool with `subagent_type: frontend:ui-developer-codex` (proxy):

First, prepare the complete prompt for Codex:

```
You are an expert UI/UX developer reviewing and fixing a React TypeScript component implementation.

ITERATION: [iteration_count + 1] / [max_iterations]

DESIGN CONTEXT:
- Component: [component_description]
- Design Reference: [design_reference]
- Implementation Files: [List of file paths]

DESIGNER FEEDBACK (Design Fidelity Review):
[Paste complete designer review report here]

CURRENT IMPLEMENTATION CODE:
[Use Read tool to gather all component files and paste code here]

TECH STACK:
- React 19 with TypeScript
- Tailwind CSS 4
- [Design system if applicable: shadcn/ui, etc.]

REVIEW STANDARDS:
1. Design Fidelity: Match design reference exactly
2. React Best Practices: Modern patterns, component composition
3. Tailwind CSS Best Practices: Proper utilities, responsive, no dynamic classes
4. Accessibility: WCAG 2.1 AA, ARIA, keyboard navigation, contrast
5. Responsive Design: Mobile-first, all breakpoints
6. Code Quality: TypeScript types, maintainability

INSTRUCTIONS:
Analyze the designer feedback and current implementation.

Provide a comprehensive fix plan with:

1. **Root Cause Analysis**: Why do these issues exist?
2. **Fix Strategy**: How to address each issue category
3. **Specific Code Changes**: Exact changes needed for each file
   - File path
   - Current code
   - Fixed code
   - Explanation

4. **Priority Order**: Which fixes to apply first (CRITICAL → MEDIUM → LOW)

Focus on providing actionable, copy-paste ready code fixes that the UI Developer can apply.

DO NOT re-validate. Only provide the fix plan and code changes.
```

Then launch the proxy agent with this complete prompt.

Wait for fixing agent to complete.

**Step 3.6: Update Loop Metrics**

Set `last_agent_used` = `fixing_agent`

**Determine if progress was made:**

```python
def check_progress():
    # First iteration - we don't have previous count yet
    if previous_issues_count is None:
        # Assume no progress yet (we just implemented, haven't fixed)
        return False

    # Compare current vs previous issue count
    if current_issues_count < previous_issues_count:
        # Improvement! Issues decreased
        return True
    else:
        # No improvement or got worse
        return False
```

`progress_made` = result of check_progress()

**Update consecutive failure tracking:**

```python
if progress_made:
    # Success! Reset all failure counters
    ui_developer_consecutive_failures = 0
    codex_consecutive_failures = 0
    log("✅ Progress made! Issue count decreased.")
else:
    # No progress - increment failure counter for agent that was used
    if last_agent_used == "ui-developer":
        ui_developer_consecutive_failures += 1
        log(f"⚠️ UI Developer did not make progress. Consecutive failures: {ui_developer_consecutive_failures}")
    elif last_agent_used == "ui-developer-codex":
        codex_consecutive_failures += 1
        log(f"⚠️ UI Developer Codex did not make progress. Consecutive failures: {codex_consecutive_failures}")
```

**Record iteration history:**

```python
iteration_history.append({
    "iteration": iteration_count + 1,
    "designer_assessment": assessment,
    "issues_count": current_issues_count,
    "design_fidelity_score": score,
    "fixing_agent_used": last_agent_used,
    "progress_made": progress_made,
    "ui_dev_failures": ui_developer_consecutive_failures,
    "codex_failures": codex_consecutive_failures
})
```

**Update for next iteration:**

```python
previous_issues_count = current_issues_count
iteration_count += 1
```

**Step 3.7: Check Loop Continuation**

IF `iteration_count >= max_iterations`:
- Log: "⚠️ Maximum iterations (10) reached."
- Ask user:
  ```
  Maximum iterations reached. Current status:
  - Issues remaining: [current_issues_count]
  - Design fidelity score: [score]/60
  - Assessment: [assessment]

  How would you like to proceed?
  ```
  Options:
  - "Continue with 10 more iterations"
  - "Accept current implementation (minor issues acceptable)"
  - "Manual review needed - stop here"

  Act based on user choice.

IF `iteration_count < max_iterations` AND NOT `design_fidelity_achieved`:
- Continue loop (go back to Step 3.1)

**End of Loop**

- **Update TodoWrite**: Mark "PHASE 3: Start validation and iterative fixing loop" as completed

### PHASE 4: Final Report & Completion

**Step 1: Generate Comprehensive Implementation Report**

- **Update TodoWrite**: Mark "PHASE 4: Generate final implementation report" as in_progress

Create a detailed summary including:

```markdown
# UI Implementation Report

## Component Information
- **Component Description**: [component_description]
- **Design Reference**: [design_reference]
- **Implementation Location**: [target_location]
- **Preview URL**: [app_url]

## Implementation Summary

**Files Created:**
[List all files created with their purposes]

**Components Implemented:**
[List components with descriptions]

## Validation Results

**Total Iterations**: [iteration_count] / [max_iterations]
**Final Status**: [PASS ✅ / NEEDS IMPROVEMENT ⚠️ / FAIL ❌]
**Final Design Fidelity Score**: [score] / 60
**Final Issues Count**: [current_issues_count]
  - CRITICAL: [count]
  - MEDIUM: [count]
  - LOW: [count]

**UI Developer Codex**: [Enabled / Disabled]

## Iteration History

### Iteration 1
- **Designer Assessment**: [assessment]
- **Issues Found**: [count]
- **Design Fidelity Score**: [score]/60
- **Fixing Agent**: [agent]
- **Progress**: [Made progress / No progress]

### Iteration 2
...

[Continue for all iterations]

## Agent Performance

**UI Developer:**
- Iterations used: [count]
- Successful iterations (made progress): [count]
- Maximum consecutive failures: [max]

[If Codex enabled:]
**UI Developer Codex:**
- Iterations used: [count]
- Successful iterations (made progress): [count]
- Maximum consecutive failures: [max]

**Agent Switches**: [count] times
- [List each switch with reason]

## Final Component Quality

**Design Fidelity**: [Pass/Needs Improvement/Fail]
**Accessibility**: [WCAG 2.1 AA compliance status]
**Responsive Design**: [Mobile/Tablet/Desktop support]
**Code Quality**: [TypeScript/Linting/Build status]

## How to Use

**Preview the component:**
```
npm run dev
# Visit [app_url]
```

**Component location:**
```
[List file paths]
```

**Example usage:**
```typescript
[Provide example import and usage]
```

## Outstanding Items

[If any issues remain:]
- [List remaining issues]
- [Suggested next steps]

[If no issues:]
- ✅ All design specifications met
- ✅ Accessibility compliant
- ✅ Responsive across all breakpoints
- ✅ Production ready

## Recommendations

[Any suggestions for improvement, enhancement, or next steps]
```

- **Update TodoWrite**: Mark "PHASE 4: Generate final implementation report" as completed

**Step 2: Present Results to User**

- **Update TodoWrite**: Mark "PHASE 4: Present results and complete handoff" as in_progress

Present the summary clearly and offer next actions:

```
UI Implementation Complete!

Summary:
- Component: [component_description]
- Iterations: [iteration_count] / [max_iterations]
- Final Status: [status with emoji]
- Design Fidelity Score: [score] / 60

Files created: [count]
[List key files]

Preview at: [app_url]

[If PASS:]
✅ Component matches design reference and is ready for use!

[If not PASS:]
⚠️ Some minor issues remain. Review the detailed report above.

Would you like to:
1. View git diff of changes
2. Continue with more iterations
3. Accept and commit changes
4. Review specific issues
```

- **Update TodoWrite**: Mark "PHASE 4: Present results and complete handoff" as completed

**Congratulations! UI implementation workflow completed successfully!**

## Orchestration Rules

### Agent Communication:
- Each agent receives complete context (design reference, previous feedback, etc.)
- Document all decisions and agent switches
- Maintain clear iteration history

### Smart Agent Switching:
- Track consecutive failures independently for each agent
- Switch agent after 2 consecutive failures (no progress)
- Reset counters when progress is made
- Log all switches with reasons
- Balance between UI Developer and UI Developer Codex for optimal results

### Loop Prevention:
- Maximum 10 iterations before escalating to user
- If iterations exceed limit, ask user for guidance
- Track progress at each iteration (issue count comparison)

### Error Handling:
- If any agent encounters blocking errors, pause and ask user for guidance
- Document all blockers clearly with context
- Provide options for resolution

### Quality Gates:
- Design fidelity score >= 54/60 for PASS
- Designer assessment must be PASS to complete
- All CRITICAL issues must be resolved

## Success Criteria

The command is complete when:
1. ✅ UI component implemented from scratch
2. ✅ Designer validated against design reference
3. ✅ Design fidelity score >= 54/60 (or user accepted lower score)
4. ✅ All CRITICAL issues resolved
5. ✅ Accessibility compliance verified (WCAG 2.1 AA)
6. ✅ Responsive design tested (mobile/tablet/desktop)
7. ✅ Code quality checks passed (typecheck/lint/build)
8. ✅ Comprehensive report provided
9. ✅ User acknowledges completion

## Smart Agent Switching Examples

### Example 1: UI Developer Struggling, Switch to Codex

```
Iteration 1:
- Designer: 8 issues found
- UI Developer applies fixes
- Designer: Still 8 issues (no progress)
- UI Developer failures: 1

Iteration 2:
- Designer: 9 issues (got worse!)
- UI Developer applies fixes
- Designer: Still 9 issues
- UI Developer failures: 2
- **Switch to UI Developer Codex**

Iteration 3:
- Designer: 4 issues (progress!)
- Codex applied better fixes
- Reset all failure counters
- Continue with Codex
```

### Example 2: Codex Struggling, Switch Back

```
Iteration 5:
- Designer: 3 issues
- UI Developer Codex applies fixes
- Designer: Still 3 issues
- Codex failures: 1

Iteration 6:
- Designer: 4 issues (got worse)
- UI Developer Codex applies fixes
- Designer: Still 4 issues
- Codex failures: 2
- **Switch back to UI Developer**

Iteration 7:
- Designer: 1 issue (progress!)
- UI Developer made progress
- Reset all failure counters
```

### Example 3: Alternating for Best Results

```
Iterations 1-2: UI Developer (no progress → 2 failures)
Iteration 3: Switch to Codex (makes progress → reset)
Iteration 4: Codex continues (makes progress)
Iteration 5: Codex (no progress → 1 failure)
Iteration 6: Codex (no progress → 2 failures)
Iteration 7: Switch to UI Developer (makes progress → reset)
Final: PASS ✅

Result: Both agents contributed to success through intelligent switching
```

## Notes

- This is an implementation-from-scratch command (different from /validate-ui which fixes existing code)
- Smart agent switching maximizes success by leveraging strengths of both agents
- UI Developer is fast and efficient for standard fixes
- UI Developer Codex provides expert analysis for complex issues
- Switching when an agent struggles prevents getting stuck
- Progress tracking ensures we don't waste iterations on ineffective approaches
- Maximum 10 iterations provides reasonable stopping point
- User always has final say on acceptable quality level
- All work happens on unstaged changes until user approves

## Quick Reference

**Command Purpose:**
- ✅ Implement UI components from scratch
- ✅ Validate against design reference
- ✅ Iterative fixing with intelligent agent switching
- ✅ Achieve pixel-perfect design fidelity

**Agents Used:**
- **ui-developer**: Implements and fixes UI (primary agent)
- **designer**: Validates design fidelity (every iteration)
- **ui-developer-codex**: Expert fixes when UI Developer struggles (optional, adaptive)

**Smart Switching:**
- 2 consecutive failures → Switch to other agent
- Progress made → Reset counters, continue
- Balances speed (UI Developer) with expertise (Codex)

**Success Metric:**
- Design fidelity score >= 54/60
- Designer assessment: PASS ✅
