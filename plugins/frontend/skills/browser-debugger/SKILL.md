---
name: browser-debugger
description: Systematically tests UI functionality, monitors console output, tracks network requests, and provides debugging reports using Chrome DevTools. Use after implementing UI features, when investigating console errors, for regression testing, or when user mentions testing, browser bugs, console errors, or UI verification.
allowed-tools: Task
---

# Browser Debugger

This Skill provides comprehensive browser-based UI testing and debugging capabilities using the tester agent and Chrome DevTools MCP server.

## When to use this Skill

Claude should invoke this Skill when:

- User has just implemented a UI feature and needs verification
- User reports console errors or warnings
- User wants to test form validation or user interactions
- User asks to verify API integration works in the browser
- After making significant code changes (regression testing)
- Before committing or deploying code
- User mentions: "test in browser", "check console", "verify UI", "does it work?"
- User describes UI bugs that need reproduction

## Instructions

### Phase 1: Understand Testing Scope

First, determine what needs to be tested:

1. **Default URL**: `http://localhost:5173` (caremaster-tenant-frontend dev server)
2. **Specific page**: If user mentions a route (e.g., "/users"), test that page
3. **Specific feature**: Focus testing on the mentioned feature
4. **Specific elements**: If user mentions buttons, forms, tables, test those

### Phase 2: Invoke tester Agent

Use the Task tool to launch the tester agent with comprehensive instructions:

```
Use Task tool with:
- subagent_type: "tester"
- prompt: [Detailed testing instructions below]
```

**Prompt structure for tester**:

```markdown
# Browser UI Testing Task

## Target
- URL: [http://localhost:5173 or specific page]
- Feature: [what to test]
- Goal: [verify functionality, check console, reproduce bug, etc.]

## Testing Steps

### Phase 1: Initial Assessment
1. Navigate to the URL using mcp__chrome-devtools__navigate_page or mcp__chrome-devtools__new_page
2. Take page snapshot using mcp__chrome-devtools__take_snapshot to see all interactive elements
3. Take screenshot using mcp__chrome-devtools__take_screenshot
4. Check baseline console state using mcp__chrome-devtools__list_console_messages
5. Check initial network activity using mcp__chrome-devtools__list_network_requests

### Phase 2: Systematic Interaction Testing

[If specific steps provided by user, list them here]
[Otherwise: Discovery mode - identify and test all interactive elements]

For each interaction:

**Before Interaction:**
1. Take screenshot: mcp__chrome-devtools__take_screenshot
2. Note current console message count
3. Identify element UID from snapshot

**Perform Interaction:**
- Click: mcp__chrome-devtools__click with element UID
- Fill: mcp__chrome-devtools__fill with element UID and value
- Hover: mcp__chrome-devtools__hover with element UID

**After Interaction:**
1. Wait 1-2 seconds for animations/transitions
2. Take screenshot: mcp__chrome-devtools__take_screenshot
3. Check console: mcp__chrome-devtools__list_console_messages
4. Check network: mcp__chrome-devtools__list_network_requests
5. Get details of any errors: mcp__chrome-devtools__get_console_message
6. Get details of failed requests: mcp__chrome-devtools__get_network_request

**Visual Analysis:**
Compare before/after screenshots:
- Did expected UI changes occur?
- Did modals appear/disappear?
- Did form submit successfully?
- Did error messages display?
- Did loading states show?
- Did content update?

### Phase 3: Console and Network Analysis

**Console Monitoring:**
1. List all console messages: mcp__chrome-devtools__list_console_messages
2. Categorize:
   - Errors (critical - must fix)
   - Warnings (should review)
   - Info/debug messages
3. For each error:
   - Get full details: mcp__chrome-devtools__get_console_message
   - Note stack trace
   - Identify which interaction triggered it
   - Assess impact on functionality

**Network Monitoring:**
1. List all network requests: mcp__chrome-devtools__list_network_requests
2. Identify failed requests (4xx, 5xx status codes)
3. For each failure:
   - Get request details: mcp__chrome-devtools__get_network_request
   - Note request method, URL, status code
   - Examine request/response payloads
   - Determine cause (CORS, auth, validation, server error)

### Phase 4: Edge Case Testing

Test common failure scenarios:

**Form Validation:**
- Submit with empty required fields
- Submit with invalid data (bad email, short password)
- Verify error messages appear
- Verify form doesn't submit

**Error Handling:**
- Trigger known error conditions
- Verify error states display properly
- Check that app doesn't crash

**Loading States:**
- Verify loading indicators during async operations
- Check UI is disabled during loading
- Ensure loading clears after completion

**Console Cleanliness:**
- No React errors (missing keys, hook violations)
- No network errors (CORS, 404s, 500s)
- No deprecation warnings
- No unhandled promise rejections

## Required Output Format

Provide a comprehensive test report with this exact structure:

# Browser Debug Report

## Test Summary
- **Status**: [PASS / FAIL / PARTIAL]
- **URL Tested**: [url]
- **Test Duration**: [time in seconds]
- **Total Interactions**: [count]
- **Console Errors**: [count]
- **Console Warnings**: [count]
- **Failed Network Requests**: [count]

## Test Execution Details

### Step 1: [Action Description]
- **Action**: [What was done - e.g., "Clicked Create User button (UID: abc123)"]
- **Expected Result**: [What should happen]
- **Actual Result**: [What you observed in screenshots]
- **Visual Changes**: [Describe UI changes in detail]
- **Console Output**:
  ```
  [New console messages, if any]
  ```
- **Network Activity**: [API calls triggered, if any]
- **Status**: ✓ PASS / ✗ FAIL

[Repeat for each test step]

## Console Analysis

### Critical Errors
[List each error with full details, stack trace, and impact assessment]
Or: ✓ No console errors detected

### Warnings
[List each warning with context and whether it should be fixed]
Or: ✓ No console warnings detected

### Info/Debug Messages
[Relevant informational output that helps understand behavior]

## Network Analysis

### Failed Requests
[For each failed request: method, URL, status, error message, payloads]
Or: ✓ All network requests successful

### Request Timeline
[List significant API calls with status codes and timing]

### Suspicious Activity
[Slow requests, repeated calls, unexpected endpoints]

## Visual Inspection Results

### UI Components Tested
- [Component 1]: ✓ Works as expected / ✗ Issue: [description]
- [Component 2]: ✓ Works as expected / ✗ Issue: [description]
[etc.]

### Visual Issues Found
[Layout problems, styling issues, alignment, broken images, responsive issues]
Or: ✓ No visual issues detected

## Issues Found

[If issues exist:]

### Critical Issues (Fix Immediately)
1. **[Issue Title]**
   - **Description**: [Detailed description]
   - **Steps to Reproduce**:
     1. [Step 1]
     2. [Step 2]
   - **Expected**: [Expected behavior]
   - **Actual**: [Actual behavior]
   - **Error Messages**: [Console/network errors]
   - **Impact**: [How this affects users]
   - **Recommendation**: [How to fix]

### Minor Issues (Should Fix)
[Less critical but still important issues]

### Improvements (Nice to Have)
[Suggestions for better UX, performance, etc.]

[If no issues:]
✓ No issues found - all functionality working as expected

## Performance Notes
- Page load time: [if measured]
- Interaction responsiveness: [smooth / laggy / specific issues]
- Performance concerns: [any observations]

## Overall Assessment

[2-3 sentence summary of test results]

**Recommendation**: [DEPLOY / FIX CRITICAL ISSUES / NEEDS MORE WORK]

---

## Important Requirements

1. **Always analyze screenshots yourself** - describe what you see in detail
2. **Never return screenshots to the user** - only text descriptions
3. **Be specific** - "Modal appeared with title 'Create User'" not "Something happened"
4. **Document reproduction steps** for all issues
5. **Distinguish critical bugs from minor issues**
6. **Check console after EVERY interaction**
7. **Use exact element UIDs from snapshots**
8. **Wait for animations/transitions before checking results**
```

### Phase 3: Summarize Findings

After receiving the tester report:

1. **Present the test summary** to the user
2. **Highlight critical issues** that need immediate attention
3. **List console errors** with file locations
4. **Note failed network requests** with status codes
5. **Provide actionable recommendations** for fixes
6. **Suggest next steps** (fix bugs, commit code, deploy, etc.)

## Expected Test Report Structure

The tester will provide a detailed markdown report. Present it to the user in a clear, organized way:

```markdown
## 🧪 Browser Test Results

**Status**: [PASS/FAIL/PARTIAL] | **URL**: [url] | **Duration**: [time]

### Summary
- Total tests: [count]
- Console errors: [count]
- Failed requests: [count]

### Test Steps

[Summarized step-by-step results]

### Issues Found

**Critical** 🔴
- [Issue 1 with reproduction steps]

**Minor** 🟡
- [Issue 2]

### Console Errors

[List errors with file locations]

### Network Issues

[List failed requests with status codes]

### Recommendation

[DEPLOY / FIX FIRST / NEEDS WORK]
```

## Common Testing Scenarios

### Scenario 1: After Implementing Feature

User: "I just added user management"

**Your response:**
1. Invoke this Skill (automatically)
2. Test URL: http://localhost:5173/users
3. Test all CRUD operations
4. Verify console is clean
5. Check network requests succeed
6. Report results

### Scenario 2: Console Errors Reported

User: "I'm seeing errors in the console"

**Your response:**
1. Invoke this Skill
2. Navigate to the page
3. Capture all console messages
4. Get full error details with stack traces
5. Identify which interactions trigger errors
6. Provide detailed error analysis

### Scenario 3: Form Validation

User: "Test if the user form validation works"

**Your response:**
1. Invoke this Skill
2. Test empty form submission
3. Test invalid email format
4. Test short passwords
5. Test all validation rules
6. Verify error messages display correctly

### Scenario 4: Regression Testing

User: "I refactored the code, make sure nothing broke"

**Your response:**
1. Invoke this Skill
2. Test all major features
3. Check console for new errors
4. Verify all interactions still work
5. Compare with expected behavior

### Scenario 5: Pre-Commit Verification

User: "Ready to commit, verify everything works"

**Your response:**
1. Invoke this Skill
2. Run comprehensive smoke test
3. Check all features modified
4. Ensure console is clean
5. Verify no network failures
6. Give go/no-go recommendation

## Quality Checklist

Before completing testing, ensure:

- ✅ Tested all user-specified features
- ✅ Checked console for errors and warnings
- ✅ Monitored network requests
- ✅ Analyzed before/after screenshots
- ✅ Provided reproduction steps for issues
- ✅ Gave clear pass/fail status
- ✅ Made actionable recommendations
- ✅ Documented all findings clearly

## Chrome DevTools Integration

The tester agent has access to these Chrome DevTools MCP tools:

**Navigation:**
- `mcp__chrome-devtools__navigate_page` - Load URL
- `mcp__chrome-devtools__navigate_page_history` - Back/forward
- `mcp__chrome-devtools__new_page` - Open new page

**Inspection:**
- `mcp__chrome-devtools__take_snapshot` - Get page structure with UIDs
- `mcp__chrome-devtools__take_screenshot` - Capture visual state
- `mcp__chrome-devtools__list_pages` - List all open pages

**Interaction:**
- `mcp__chrome-devtools__click` - Click element by UID
- `mcp__chrome-devtools__fill` - Type into input by UID
- `mcp__chrome-devtools__fill_form` - Fill multiple fields at once
- `mcp__chrome-devtools__hover` - Hover over element
- `mcp__chrome-devtools__drag` - Drag and drop
- `mcp__chrome-devtools__wait_for` - Wait for text to appear

**Console:**
- `mcp__chrome-devtools__list_console_messages` - Get all console output
- `mcp__chrome-devtools__get_console_message` - Get detailed message

**Network:**
- `mcp__chrome-devtools__list_network_requests` - Get all requests
- `mcp__chrome-devtools__get_network_request` - Get request details

**Advanced:**
- `mcp__chrome-devtools__evaluate_script` - Run JavaScript
- `mcp__chrome-devtools__handle_dialog` - Handle alerts/confirms
- `mcp__chrome-devtools__performance_start_trace` - Start perf trace
- `mcp__chrome-devtools__performance_stop_trace` - Stop perf trace

## Project-Specific Considerations

### Tech Stack Awareness

**React 19 + TanStack Router:**
- Watch for React errors (missing keys, hook violations)
- Check for routing issues (404s, incorrect navigation)

**TanStack Query:**
- Monitor query cache invalidation
- Check for stale data issues
- Verify loading states

**Tailwind CSS:**
- Check responsive design
- Verify styling at different screen sizes

**Biome:**
- No impact on browser testing, but note code quality

### Common Issues to Watch For

**User Management:**
- CRUD operations work correctly
- Validation errors display
- Optimistic updates function
- Toast notifications appear

**API Integration:**
- Mock vs real API behavior differences
- Authentication token handling
- CORS issues
- 400/401/404 error handling

**Forms:**
- React Hook Form validation
- Submit button states
- Error message display
- Success feedback

## Tips for Effective Testing

1. **Be systematic**: Test one feature at a time
2. **Check console first**: Before AND after interactions
3. **Analyze screenshots carefully**: Describe what you see
4. **Get error details**: Don't just count errors, understand them
5. **Track network**: API failures are common issues
6. **Test edge cases**: Empty forms, invalid data
7. **Verify error states**: Errors should display gracefully
8. **Check loading states**: Async operations should show feedback
9. **Document clearly**: Reproduction steps are critical
10. **Prioritize issues**: Critical vs minor vs improvements

## Example Invocation

When user says: "I just implemented the user creation dialog"

**Your internal process:**
1. Recognize this needs browser testing (invoke browser-debugger Skill)
2. Determine test scope: user creation dialog functionality
3. Prepare comprehensive test instructions
4. Invoke tester agent via Task tool
5. Provide instructions to:
   - Navigate to users page
   - Click "Create User" button
   - Take before/after screenshots
   - Fill in form fields
   - Test validation (empty, invalid)
   - Submit form
   - Verify user appears in table
   - Check console for errors
   - Check network for API call
   - Report all findings
6. Receive detailed report from agent
7. Summarize findings for user
8. Recommend next steps

**Your response to user:**

"I'll test the user creation dialog functionality in the browser to verify everything works correctly and check for any console errors or issues."

[Invoke tester via Task tool with detailed instructions]

[After receiving report:]

"✅ Browser test completed successfully! The user creation dialog is working correctly. Here's what I verified:

**What Worked:**
- Create User button opens the dialog
- Form validation displays errors for empty fields
- Invalid email format is caught
- Successful submission adds user to table
- Success toast notification appears

**Console Check:**
- No errors detected
- No warnings present

**Network Check:**
- POST /api/users: 201 Created
- Response time: 145ms

**Recommendation**: Ready to commit! The feature is working as expected with no console errors or network issues."

## Notes

- Always check if dev server is running before testing
- Default to localhost:5173 for caremaster-tenant-frontend
- Provide actionable, specific findings
- Distinguish between critical bugs and minor issues
- Give clear recommendations (DEPLOY / FIX / NEEDS WORK)
- Be proactive: suggest testing after implementing features
