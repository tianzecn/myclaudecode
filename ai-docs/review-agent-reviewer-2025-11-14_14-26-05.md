# Agent Review: agent-reviewer

**Reviewed**: 2025-11-14 14:26:05
**Reviewer**: Claude Sonnet 4.5
**File**: `.claude/agents/agent-reviewer.md`
**Type**: Review Agent

## Executive Summary

**Overall Status**: FAIL

**Issue Count**:
- CRITICAL: 1
- HIGH: 1
- MEDIUM: 2
- LOW: 0

**Recommendation**: Must fix critical issue before use. The agent violates its own design principle by lacking the Write tool needed to create review documents as specified in its instructions.

**Top 3 Issues**:
1. [CRITICAL] Missing Write tool - Agent cannot create review documents
2. [HIGH] Contradictory constraint about Write tool usage
3. [MEDIUM] No examples demonstrate TodoWrite usage in review context

---

## Detailed Review

### CRITICAL Issues

#### Issue 1: Missing Write Tool for Review Documents
- **Category**: Tools / Completeness
- **Description**: The agent's tools list (line 6) is `TodoWrite, Read, Glob, Grep, Bash` but lacks the `Write` tool. However, the agent's core functionality requires creating review documents in `ai-docs/review-{name}-{timestamp}.md` as specified in:
  - Lines 99-109: `<feedback_output_requirement>` section explicitly states "Create review document: ai-docs/review-{agent-name}-{timestamp}.md"
  - Lines 328: Workflow Phase 10, Step 1: "Write complete review to ai-docs/review-{name}-{timestamp}.md"
  - Lines 857-866: `<review_document_requirement>` "ALWAYS create detailed review document in ai-docs/ directory"
- **Impact**: Agent cannot fulfill its core function. It would fail when trying to create the required review document. This is a fundamental design flaw that makes the agent non-functional.
- **Fix**: Add `Write` to the tools list in frontmatter (line 6). Change from:
  ```yaml
  tools: TodoWrite, Read, Glob, Grep, Bash
  ```
  to:
  ```yaml
  tools: TodoWrite, Read, Write, Glob, Grep, Bash
  ```
- **Location**: Line 6 (frontmatter tools), Lines 99-109, 328, 857-866 (requirements)

---

### HIGH Priority Issues

#### Issue 1: Contradictory Constraint About Write Tool
- **Category**: Instructions / Clarity
- **Description**: Lines 90-97 contain a `<reviewer_constraints>` section that states "Use Read tool to analyze files (NEVER Write or Edit)" and "Provide feedback only, do NOT make changes". This directly contradicts the requirement to create review documents using the Write tool. While the intent is clear (don't modify the files being reviewed), the constraint is too broad and creates confusion.
- **Impact**: Creates ambiguity about when Write tool can be used. Could confuse the AI into not creating review documents even if Write tool is added. Violates the principle of clear, unambiguous instructions.
- **Fix**: Clarify the constraint to be more specific:
  ```xml
  <reviewer_constraints>
    - You are a REVIEWER, not an IMPLEMENTER
    - Use Read tool to analyze files being reviewed (NEVER modify them)
    - NEVER use Write or Edit on files being reviewed
    - DO use Write tool to create review documents in ai-docs/
    - Provide feedback only, do NOT make changes to reviewed files
    - Be specific and actionable in feedback
    - Use severity levels consistently
    - Focus on standards compliance and quality
  </reviewer_constraints>
  ```
- **Location**: Lines 90-97

---

### MEDIUM Priority Issues

#### Issue 1: No Examples Demonstrate TodoWrite Usage in Review Context
- **Category**: Examples / TodoWrite Integration
- **Description**: The agent has excellent TodoWrite integration in critical_constraints (lines 74-88) and workflow (lines 248-333), but none of the three examples (lines 728-809) demonstrate how TodoWrite is used during a review. The examples show review outcomes but not the process of tracking review tasks.
- **Impact**: While TodoWrite is well-documented in instructions, users and the AI would benefit from seeing a concrete example of TodoWrite in action during a review workflow. This is especially important since this is a complex multi-phase review process.
- **Fix**: Add a fourth example or modify one existing example to show TodoWrite usage:
  ```xml
  <example name="Review Process with TodoWrite">
    <scenario>Starting a review of a new backend agent</scenario>
    <user_request>Review plugins/bun/agents/backend-developer.md for quality</user_request>
    <correct_approach>
      1. Create TodoWrite list with all review phases:
         - Read agent file
         - Validate YAML frontmatter
         - Validate XML structure
         - Check completeness
         - Review examples
         - Check TodoWrite integration
         - Generate feedback document
         - Present results
      
      2. Mark "Read agent file" as in_progress
      3. Read the file
      4. Mark "Read agent file" as completed
      5. Mark "Validate YAML frontmatter" as in_progress
      6. Continue systematically through each phase
      7. Update TodoWrite as each phase completes
      8. Present final review with all todos completed
    </correct_approach>
    <why_this_matters>
      TodoWrite provides visibility into review progress and ensures no review area is skipped.
    </why_this_matters>
  </example>
  ```
- **Location**: Lines 728-809 (examples section)

#### Issue 2: Tool Appropriateness Guidance Contradicts Agent's Own Needs
- **Category**: Knowledge / Consistency
- **Description**: Lines 227-230 state that "Review Agents: Should have: TodoWrite, Read / Often have: Glob, Grep, Bash / Should NOT have: Write, Edit". This guidance is included in the agent's own knowledge base, yet the agent itself needs the Write tool to create review documents. This creates a contradiction.
- **Impact**: The agent is giving guidance that doesn't apply to itself. This could confuse future agent creators who read this agent as a reference. It also highlights the unique nature of this reviewer agent vs typical review agents.
- **Fix**: Update the guidance to acknowledge this special case:
  ```xml
  **Review Agents:**
  - Should have: TodoWrite, Read
  - Often have: Glob, Grep, Bash
  - Should NOT have: Write, Edit (for reviewing code)
  - **Exception**: agent-reviewer needs Write to create review documents in ai-docs/
  ```
  Or add a note explaining the distinction:
  ```xml
  **Review Agents:**
  - Should have: TodoWrite, Read
  - Often have: Glob, Grep, Bash
  - Should NOT have: Write, Edit
  
  **Note**: The agent-reviewer is a special case that needs Write to create
  review documents, but should still NEVER modify files being reviewed.
  ```
- **Location**: Lines 227-230

---

## Quality Scores

| Area | Weight | Score | Status |
|------|--------|-------|--------|
| YAML Frontmatter | 20% | 7/10 | CRITICAL ISSUE |
| XML Structure | 20% | 10/10 | PASS |
| Completeness | 15% | 9/10 | PASS |
| Example Quality | 15% | 8/10 | GOOD |
| TodoWrite Integration | 10% | 9/10 | EXCELLENT |
| Tool Appropriateness | 10% | 3/10 | CRITICAL ISSUE |
| Clarity & Usability | 5% | 7/10 | NEEDS IMPROVEMENT |
| Proxy Mode | 5% | 10/10 | EXCELLENT |
| Security & Safety | BLOCKER | 10/10 | PASS |
| **TOTAL** | **100%** | **7.8/10** | **FAIL** |

---

## Approval Decision

**Status**: FAIL

**Rationale**: The agent has a critical design flaw - it cannot create review documents because it lacks the Write tool. This violates its own core functionality as specified in three separate locations in the instructions. Additionally, there is a contradictory constraint that forbids using Write tool while simultaneously requiring it. These issues must be fixed before the agent can be used.

The agent is otherwise very well-designed with:
- Excellent XML structure
- Comprehensive workflow (10 phases)
- Strong TodoWrite integration
- Well-implemented proxy mode
- Clear review criteria and focus areas
- Good examples (though could add TodoWrite example)

However, the missing Write tool is a blocker that prevents the agent from functioning as designed.

**Required Fixes**:
1. CRITICAL: Add Write to tools list in frontmatter
2. HIGH: Clarify reviewer_constraints to allow Write for review docs (not reviewed files)
3. MEDIUM: Add example showing TodoWrite usage during review
4. MEDIUM: Update tool appropriateness guidance to acknowledge agent-reviewer exception

**Next Steps**:
1. Add Write tool to frontmatter
2. Clarify constraints about Write tool usage
3. Test agent with a sample review task
4. Verify review document is created successfully

---

## Positive Highlights

- **Exceptional XML structure**: All tags properly nested and closed, excellent hierarchical organization
- **Comprehensive workflow**: 10 well-defined phases covering all aspects of review
- **Outstanding TodoWrite integration**: Clear requirements, workflow integration, and tracking guidance
- **Excellent proxy mode implementation**: Properly checks for PROXY_MODE directive, correct Claudish command format, attribution, STOP directive, and fallback to local
- **Strong review criteria**: 9 focus areas with clear priorities, weights, and check items
- **Detailed feedback format**: Comprehensive template for review documents with severity levels
- **Good example quality**: 3 concrete examples showing different review outcomes (PASS, FAIL, CONDITIONAL)
- **Complete knowledge base**: XML standards reference, approval criteria, common issues catalog
- **Clear success criteria**: Well-defined checklist for successful review completion
- **Professional formatting guidelines**: Communication style and completion message template
- **No security issues**: Safe file operations, no arbitrary command execution, proper handling of external integrations
- **Appropriate model selection**: Sonnet is appropriate for complex review tasks
- **Good color choice**: Cyan is appropriate for review agents

The core design is excellent. Once the Write tool is added and constraints clarified, this will be a production-ready review agent.

---

## Additional Observations

### Strengths
1. **Self-documenting**: The agent serves as an excellent reference for how review agents should be structured
2. **Modular design**: Each review area is clearly separated and can be evaluated independently
3. **Severity-based feedback**: Clear guidance on what constitutes CRITICAL vs HIGH vs MEDIUM vs LOW issues
4. **Scoring system**: Weighted scores provide objective assessment
5. **Approval criteria**: Clear thresholds for PASS/CONDITIONAL/FAIL decisions

### Potential Enhancements (Not Required)
1. Could add a "quick review" mode for simple checks (optional flag)
2. Could include code samples of common XML violations in knowledge base
3. Could add a validation check that runs XML through a parser
4. Could include metrics on review document (word count, issue density, etc.)

---

*Review generated by: agent-reviewer (meta-review - reviewing itself)*
*Model: Claude Sonnet 4.5*
*Standards: XML_TAG_STANDARDS.md v1.0.0*
