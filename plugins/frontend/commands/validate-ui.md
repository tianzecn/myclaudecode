---
description: Multi-agent orchestrated UI validation with iterative fixes and optional third-party review
---

## Task

**Multi-agent orchestration command** - coordinate between ui-validator agent and frontend developer agent with optional Codex third-party review to iteratively fix UI issues.

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

#### Step 3.1: Launch UI Validator Agent

Pass inputs to ui-validator agent using the Task tool:

```
Analyze the UI implementation against the design reference and provide a detailed comparison report.

**Design Reference Type**: [Screenshot file | Figma design | Live component]
**Design Reference**: [file path | Figma URL | localhost URL]
**What's being validated**: [user description, e.g., "user profile page"]
**Implementation File(s)**: [found file paths, e.g., "src/components/UserProfile.tsx"]

**Your Tasks:**
1. Fetch the design reference:
   - If Figma: Use Figma MCP to fetch the design screenshot
   - If Live: Use chrome-devtools MCP to take screenshot of the URL
   - If Screenshot: Read the provided file path

2. Take screenshot of current implementation:
   - Navigate to localhost URL (infer from implementation file if needed)
   - Use chrome-devtools MCP to capture implementation screenshot

3. Read and understand the implementation files and related dependencies

4. Compare design reference vs implementation screenshot:
   - Identify specific differences (spacing, colors, typography, layout, alignment, etc.)
   - Note what is correct
   - Note what needs fixing

5. Return detailed comparison report with:
   - List of all issues found with descriptions
   - Probable ways to fix each issue (CSS properties, component changes, etc.)
   - Severity of each issue (critical, moderate, minor)
   - Screenshots embedded in response for reference
   - Specific file paths and line numbers if applicable

DO NOT apply any fixes. Only analyze and report.
```

Wait for ui-validator agent to return comparison report.

#### Step 3.2: Optional Third-Party Review (if enabled)

If user selected "Yes" for Codex review:

Use `mcp__codex-cli__ask-codex` with the validator's report:

```
prompt: "I have a UI validation report comparing a design to a React implementation.
Please analyze the issues and provide expert recommendations on the best way to fix them.

[paste entire validator report here]

Provide:
1. Analysis of the root causes of each issue
2. Best practice recommendations for fixes
3. Suggested CSS/component changes with code examples
4. Priority order for addressing issues"

model: "gpt-5-codex"
sandbox: false
```

Wait for Codex to return expert opinion.

#### Step 3.3: Launch Frontend Developer Agent

Pass the validator report (and optional Codex opinion) to developer agent using the Task tool with subagent_type "frontend-development:typescript-frontend-dev":

```
Fix the UI issues identified in the validation report below.

**What's being validated**: [user description, e.g., "user profile page"]
**Implementation File(s)**: [found file paths, e.g., "src/components/UserProfile.tsx"]

**UI Validation Report**:
[paste validator report here]

[If Codex review enabled:]
**Third-Party Expert Opinion from Codex**:
[paste Codex recommendations here]

**Your Tasks:**
1. Read the implementation file(s)
2. Analyze the reported issues
3. Apply fixes to address each issue:
   - Update CSS/Tailwind classes
   - Adjust component structure if needed
   - Fix spacing, colors, typography, layout issues
4. Follow the expert recommendations if provided
5. Ensure changes follow project patterns
6. Return summary of changes made

DO NOT re-validate. Only apply the fixes.
```

Wait for developer agent to return summary of applied changes.

#### Step 3.4: Check Loop Status

After developer agent completes:
- Increment iteration count
- If iteration < 10: Go back to Step 3.1 (re-run validator)
- If iteration = 10: Exit loop and proceed to Phase 4

Track and display progress: "Iteration X/10 complete"

### Phase 4: Generate Final Report

After loop completes (10 iterations OR validator reports no issues):

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
   **Validator Report:**
   [issues found]

   [If Codex enabled:]
   **Codex Recommendations:**
   [expert opinion]

   **Developer Changes:**
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
  - Launch ui-validator agent
  - Optionally call Codex MCP for third-party review
  - Launch developer agent
  - Repeat up to 10 times
- Generate final report with iteration history
- Save screenshots and comparison HTML
- Present results to user
- Handle next action choice

**UI Validator Agent Responsibilities:**
- Fetch Figma screenshot (if Figma reference)
- Take implementation screenshot via chrome-devtools
- Read implementation files and dependencies
- Compare design reference vs implementation
- Identify all UI differences
- Return detailed comparison report with:
  - Specific issues found
  - Probable fixes for each issue
  - Severity levels
  - File paths and line numbers
- **DOES NOT apply fixes - only reports**

**Codex MCP Responsibilities (Optional):**
- Receive validator's comparison report
- Analyze root causes of issues
- Provide expert recommendations
- Suggest best practice fixes
- Prioritize issues
- Return third-party opinion

**Frontend Developer Agent Responsibilities:**
- Receive validator report (and optional Codex opinion)
- Read implementation files
- Apply fixes to address reported issues
- Update CSS/Tailwind classes
- Adjust component structure if needed
- Follow project patterns
- Return summary of changes made
- **DOES NOT re-validate - only implements fixes**

**Key Principles:**
1. Command orchestrates the loop, does NOT do the work
2. Validator ONLY validates and reports, does NOT fix
3. Developer ONLY fixes, does NOT validate
4. Codex provides optional expert opinion between validator and developer
5. Loop continues until 10 iterations OR validator reports no issues

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

Command: [Launches ui-validator agent]
Validator: [Performs validation, returns report with 5 issues]

Command: [Calls Codex MCP]
Codex: [Provides expert recommendations]

Command: [Launches developer agent]
Developer: [Applies fixes, returns summary]

Command: "Iteration 1/10 complete. 5 issues addressed."

━━━ Iteration 2/10 ━━━

Command: [Re-runs validator]
Validator: [Finds 2 remaining issues]

Command: [Calls Codex]
Codex: [Provides recommendations]

Command: [Launches developer]
Developer: [Applies fixes]

Command: "Iteration 2/10 complete. 2 more issues addressed."

━━━ Iteration 3/10 ━━━

Command: [Re-runs validator]
Validator: [Reports: "No issues found - implementation matches design"]

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
- ✅ Launch ui-validator agent (each iteration)
- ✅ Call Codex MCP (if enabled)
- ✅ Launch developer agent (each iteration)
- ✅ Generate final report
- ✅ Present results

**UI Validator Agent does:**
- ✅ Fetch design screenshots
- ✅ Take implementation screenshots
- ✅ Compare and identify differences
- ✅ Return detailed report
- ❌ Does NOT apply fixes

**Codex MCP does (Optional):**
- ✅ Analyze validator report
- ✅ Provide expert recommendations
- ✅ Return third-party opinion

**Developer Agent does:**
- ✅ Apply fixes to code
- ✅ Update CSS/components
- ✅ Return summary of changes
- ❌ Does NOT re-validate

**Loop Flow:**
```
1. Validator → Report
2. (Optional) Codex → Expert Opinion
3. Developer → Apply Fixes
4. Repeat steps 1-3 up to 10 times
5. Generate final report
```

### Important Details

**Early Exit:**
- If validator reports "No issues found" at any iteration, exit loop immediately
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
