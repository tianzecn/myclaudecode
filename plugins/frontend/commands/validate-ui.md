---
description: Multi-agent orchestrated UI design validation with iterative fixes and optional Codex expert review
---

## Task

**Multi-agent orchestration command** - coordinate between designer agent (reviews UI fidelity), ui-developer agent (fixes UI issues), and optional ui-developer-codex agent (expert third-party review) to iteratively validate and fix UI implementation against design references.

### Phase 1: Gather User Inputs

Ask the user directly for the following information:

**Ask user to provide:**

1. **Design reference** (Figma URL, local file path, or remote URL)
   - Example Figma: `https://figma.com/design/abc123/...?node-id=136-5051`
   - Example remote: `http://localhost:5173/users`
   - Example local: `/Users/you/Downloads/design.png`

2. **Component description** (what are you validating?)
   - Example: "user profile page", "main dashboard", "product card component"

3. **Use Codex agent helper?** (yes or no)
   - "yes" to enable Codex expert review on each iteration
   - "no" to skip third-party review

**Auto-detect reference type from user's input:**
- Contains "figma.com" → Figma design
- Starts with "http://localhost" or "http://127.0.0.1" → Remote URL (live component)
- Otherwise → Local file path (screenshot)

### Phase 2: Parse Inputs and Find Implementation

Parse the user's text responses:
- Extract design reference (user's answer to question 1)
- Extract component description (user's answer to question 2)
- Extract Codex preference (user's answer to question 3: "yes" or "no")

Auto-detect reference type from the reference string:
- Contains "figma.com" → Figma design
- Starts with "http://localhost" or "http://127.0.0.1" → Remote URL (live component)
- Otherwise → Local file path (screenshot)

Validate inputs:
- Check reference is not empty
- Check component description is not empty
- If either is empty: Ask user to provide that information

Validate reference:
- If Figma detected: Parse URL to extract fileKey and nodeId, verify format
- If Remote URL detected: Verify URL format is valid
- If Local file detected: Verify file path exists and is readable

Find implementation files based on description:
- Use the description to search for relevant files in the codebase
- Search strategies:
  - Convert description to likely component names (e.g., "user profile page" → "UserProfile", "UserProfilePage")
  - Search for matching files in src/components/, src/routes/, src/pages/
  - Use Glob to find files like `**/User*Profile*.tsx`, `**/user*profile*.tsx`
  - Use Grep to search for component exports matching the description
- If multiple files found: Choose most relevant or ask user to clarify
- If no files found: Ask user to provide file path manually

Store the found implementation file(s) for use in validation loop.

If any validation fails, re-ask for that specific input with clarification.

### Phase 3: Multi-Agent Iteration Loop

Run up to **10 iterations** of the following sequence:

#### Step 3.1: Launch Designer Agent

Pass inputs to designer agent using the Task tool:

```
Review the [Component Name] implementation against the design reference and provide a detailed design fidelity report.

**Design Reference**: [Figma URL | file path | remote URL]
**Component Description**: [user description, e.g., "user profile page"]
**Implementation File(s)**: [found file paths, e.g., "src/components/UserProfile.tsx"]
**Application URL**: [e.g., "http://localhost:5173" or staging URL]

**Your Tasks:**
1. Fetch the design reference:
   - If Figma: Use Figma MCP to fetch the design screenshot
   - If Remote URL: Use chrome-devtools MCP to take screenshot of the URL
   - If Local file: Read the provided file path

2. Capture implementation screenshot:
   - Navigate to application URL
   - Use Chrome DevTools MCP to capture implementation screenshot
   - Use same viewport size as reference for fair comparison

3. Read implementation files to understand code structure

4. Perform comprehensive design review comparing:
   - Colors & theming
   - Typography
   - Spacing & layout
   - Visual elements (borders, shadows, icons)
   - Responsive design
   - Accessibility (WCAG 2.1 AA)
   - Interactive states

5. Document ALL discrepancies with specific values
6. Categorize issues by severity (CRITICAL/MEDIUM/LOW)
7. Provide actionable fixes with code snippets
8. Calculate design fidelity score

Return detailed design review report.
```

Wait for designer agent to return design review report.

#### Step 3.2: Optional Codex Expert Review (if enabled)

If user selected "Yes" for Codex review:

Use Task tool with `subagent_type: frontend:ui-developer-codex` (proxy agent):

```
You are an expert UI/UX developer reviewing a React TypeScript component.

DESIGN CONTEXT:
- Component: [Component Name]
- Design Reference: [URL or path to design screenshot]
- Implementation: [Implementation file paths]

DESIGNER FEEDBACK (Design Fidelity Review):
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

Wait for ui-developer-codex agent to return expert review.

#### Step 3.3: Launch UI Developer Agent to Apply Fixes

Use Task tool with `subagent_type: frontend:ui-developer`:

```
Fix the UI implementation issues identified in the design review.

**Component**: [Component Name]
**Implementation File(s)**: [found file paths, e.g., "src/components/UserProfile.tsx"]

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

Wait for ui-developer agent to return summary of applied changes.

#### Step 3.4: Check Loop Status

After ui-developer agent completes:
- Increment iteration count
- If iteration < 10: Go back to Step 3.1 (re-run designer agent)
- If iteration = 10: Exit loop and proceed to Phase 4

Track and display progress: "Iteration X/10 complete"

### Phase 4: Generate Final Report

After loop completes (10 iterations OR designer reports no issues):

1. Create temp directory: `/tmp/ui-validation-[timestamp]/`

2. Save iteration history to `report.md`:
   ```markdown
   # UI Validation Report

   ## Validating: [user description, e.g., "user profile page"]
   ## Implementation: [file path(s)]
   ## Iterations: [count]/10
   ## Third-Party Review: [Enabled/Disabled]

   ## Iteration History:

   ### Iteration 1
   **Designer Review Report:**
   [issues found]

   [If Codex enabled:]
   **Codex Expert Review:**
   [expert opinion]

   **UI Developer Changes:**
   [fixes applied]

   ### Iteration 2
   ...

   ## Final Status:
   [Success - No issues remaining | Needs Review - X issues remain]

   ## Summary:
   - Total issues found: X
   - Total issues fixed: Y
   - Remaining issues: Z
   ```

3. Save final screenshots:
   - `reference.png` (original design)
   - `implementation-final.png` (final implementation)

4. Generate `comparison.html` with side-by-side view

### Phase 5: Present Results to User

Display summary:
- Total iterations run
- Final status (success/needs review)
- Path to detailed report
- Link to comparison HTML

Ask user for next action:
- "View detailed report" → Open report directory
- "Continue with 10 more iterations" → Restart Phase 3
- "Accept changes" → Show git diff, offer to commit
- "Manual review needed" → Exit

### Implementation Notes

**Command Responsibilities (Orchestration Only):**
- Ask user for 3 pieces of information (text prompts)
  1. Design reference (Figma URL, remote URL, or local file path)
  2. Component description
  3. Use Codex helper? (yes/no)
- Parse user's text responses
- Auto-detect reference type (Figma/Remote URL/Local file)
- Validate reference (file exists, URL format)
- Find implementation files from description using Glob/Grep
- Track iteration count (1-10)
- Orchestrate the multi-agent loop:
  - Launch designer agent
  - Optionally launch ui-developer-codex proxy for expert review
  - Launch ui-developer agent
  - Repeat up to 10 times
- Generate final report with iteration history
- Save screenshots and comparison HTML
- Present results to user
- Handle next action choice

**Designer Agent Responsibilities:**
- Fetch design reference screenshot (Figma MCP or Chrome DevTools)
- Capture implementation screenshot via Chrome DevTools
- Read implementation files to understand code structure
- Perform comprehensive design review:
  - Colors & theming
  - Typography
  - Spacing & layout
  - Visual elements
  - Responsive design
  - Accessibility (WCAG 2.1 AA)
  - Interactive states
- Return detailed design review report with:
  - Specific issues found with exact values
  - Actionable fixes with code snippets
  - Severity categorization (CRITICAL/MEDIUM/LOW)
  - File paths and line numbers
  - Design fidelity score
- **DOES NOT apply fixes - only reviews and reports**

**UI Developer Codex Agent Responsibilities (Optional Proxy):**
- Receive designer's review report from orchestrator
- Forward complete prompt to Codex AI via mcp__codex-cli__ask-codex
- Return Codex's expert analysis verbatim
- Provides independent third-party validation
- **Does NOT do any preparation - pure proxy**

**UI Developer Agent Responsibilities:**
- Receive designer feedback (and optional Codex review)
- Read implementation files
- Apply fixes using modern React/TypeScript/Tailwind best practices:
  - Fix colors with correct Tailwind classes
  - Fix spacing with proper scale
  - Fix typography
  - Fix layout issues
  - Fix accessibility issues
  - Fix responsive design
- Use Edit tool to modify files
- Run quality checks (typecheck, lint, build)
- Provide implementation summary
- **DOES NOT re-validate - only implements fixes**

**Key Principles:**
1. Command orchestrates the loop, does NOT do the work
2. Designer ONLY reviews design fidelity and reports, does NOT fix
3. UI Developer ONLY implements fixes, does NOT validate
4. UI Developer Codex (optional) provides expert third-party review
5. Loop continues until 10 iterations OR designer reports no issues (PASS)

### Example User Flow

```
User: /validate-ui

Command: "Please provide the following information:"

Command: "1. Design reference (Figma URL, local file path, or remote URL):"
User: "https://figma.com/design/abc123.../node-id=136-5051"

Command: "2. Component description (what are you validating?):"
User: "user profile page"

Command: "3. Use Codex agent helper? (yes/no):"
User: "yes"

Command: [Parses responses]
Command: [Auto-detects: Figma design ✓]
Command: [Searches codebase for "user profile page"]
Command: [Finds: src/components/UserProfile.tsx]
Command: "✓ Reference type: Figma (auto-detected)"
Command: "✓ Component: user profile page"
Command: "✓ Found implementation: src/components/UserProfile.tsx"
Command: "✓ Codex agent helper: Enabled"
Command: "Starting validation loop (max 10 iterations)..."

━━━ Iteration 1/10 ━━━

Command: [Launches designer agent]
Designer: [Performs design review, returns report with 5 issues]

Command: [Launches ui-developer-codex proxy]
Codex: [Provides expert recommendations via proxy]

Command: [Launches ui-developer agent]
UI Developer: [Applies fixes, returns summary]

Command: "Iteration 1/10 complete. 5 issues addressed."

━━━ Iteration 2/10 ━━━

Command: [Re-runs designer agent]
Designer: [Finds 2 remaining issues]

Command: [Launches ui-developer-codex]
Codex: [Provides recommendations]

Command: [Launches ui-developer]
UI Developer: [Applies fixes]

Command: "Iteration 2/10 complete. 2 more issues addressed."

━━━ Iteration 3/10 ━━━

Command: [Re-runs designer agent]
Designer: [Reports: "Assessment: PASS - No issues found, implementation matches design"]

Command: "Validation successful! No issues remaining."
Command: [Exits loop early - only 3 iterations needed]

━━━ Final Report ━━━

Command: [Creates /tmp/ui-validation-20251104-235623/]
Command: [Saves report.md, screenshots, comparison.html]

Command: [Displays summary]
"✓ Validation complete after 3 iterations
  Total issues found: 7
  Total issues fixed: 7
  Remaining issues: 0

  Report: /tmp/ui-validation-20251104-235623/report.md
  Comparison: /tmp/ui-validation-20251104-235623/comparison.html"

Command: [Asks for next action]
```

### Arguments

$ARGUMENTS - Optional: Can provide design reference path, Figma URL, or component name directly to skip some questions

### Quick Reference

**Command does (Orchestration):**
- ✅ Ask user 3 questions via text prompts
- ✅ Parse responses and auto-detect reference type
- ✅ Find implementation files from description
- ✅ Track iteration count (1-10)
- ✅ Launch designer agent (each iteration)
- ✅ Launch ui-developer-codex proxy (if enabled)
- ✅ Launch ui-developer agent (each iteration)
- ✅ Generate final report
- ✅ Present results

**Designer Agent does:**
- ✅ Fetch design reference screenshots (Figma/remote/local)
- ✅ Capture implementation screenshots
- ✅ Perform comprehensive design review
- ✅ Compare and identify all UI discrepancies
- ✅ Categorize by severity (CRITICAL/MEDIUM/LOW)
- ✅ Calculate design fidelity score
- ✅ Provide actionable fixes with code snippets
- ✅ Return detailed design review report
- ❌ Does NOT apply fixes

**UI Developer Codex Agent does (Optional Proxy):**
- ✅ Receive complete prompt from orchestrator
- ✅ Forward to Codex AI via mcp__codex-cli__ask-codex
- ✅ Return Codex's expert analysis verbatim
- ✅ Provide third-party validation
- ❌ Does NOT prepare context (pure proxy)

**UI Developer Agent does:**
- ✅ Receive designer feedback (+ optional Codex review)
- ✅ Apply fixes using React/TypeScript/Tailwind best practices
- ✅ Fix colors, spacing, typography, layout, accessibility
- ✅ Update Tailwind CSS classes
- ✅ Run quality checks (typecheck, lint, build)
- ✅ Return implementation summary
- ❌ Does NOT re-validate

**Loop Flow:**
```
1. Designer → Design Review Report
2. (Optional) UI Developer Codex → Expert Opinion (via Codex AI)
3. UI Developer → Apply Fixes
4. Repeat steps 1-3 up to 10 times
5. Generate final report
```

### Important Details

**Early Exit:**
- If designer reports "Assessment: PASS" at any iteration, exit loop immediately
- Display total iterations used (e.g., "Complete after 3/10 iterations")

**Error Handling:**
- If agent fails 3 times consecutively: Exit loop and report to user
- Log errors but continue iterations when possible

**MCP Usage:**
- Figma MCP: Fetch design screenshots (once at start)
- Chrome DevTools MCP: Capture implementation screenshots (every iteration)
- Codex CLI MCP: Expert review (every iteration if enabled)

**Best Practices:**
- Keep validator reports concise but specific
- Include file paths and line numbers
- Prioritize issues by severity
- Track issues found vs fixed in final report
