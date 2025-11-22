# Architecture Decision: Skills-Only vs Hybrid with Orchestrator Agent

**Critical Decision Point:** November 22, 2025
**Impact:** Determines v1.0 and future scalability
**Timeline:** MUST DECIDE before Phase 1 begins

---

## Decision Context

The orchestration plugin design proposes two possible architectures:

### Option A: Skills-Only (Current Design)
```
orchestration plugin
├── skills/
│   ├── multi-agent-coordination/
│   ├── multi-model-validation/
│   ├── quality-gates/
│   └── todowrite-orchestration/
└── [NO agents, NO commands]
```

**How It Works:**
- Skills provide patterns + guidance
- Plugins (frontend, bun, code-analysis) implement orchestration in commands
- Knowledge is shared via skill references, not via agents

### Option B: Hybrid (Skills + Minimal Orchestrator Agent)
```
orchestration plugin
├── skills/
│   ├── multi-agent-coordination/
│   ├── multi-model-validation/
│   ├── quality-gates/
│   └── todowrite-orchestration/
└── agents/
    └── orchestration-coordinator/
        Purpose: State management + complex workflow execution
        Scope: Non-primary orchestration (fallback/optional)
```

**How It Works:**
- Skills provide patterns + best practices (same as Option A)
- Orchestrator agent provides execution + state management
- Complex workflows can delegate to agent, simpler workflows use skills
- Optional: Plugins can reference agent for sophisticated patterns

---

## Detailed Comparison

### Dimension 1: Scope and Purpose

| Dimension | Option A (Skills-Only) | Option B (Hybrid) |
|-----------|---|---|
| **Plugin Purpose** | Provide knowledge/patterns only | Provide knowledge + optional execution |
| **Skill Role** | Primary source of truth | Primary source (skills are still first choice) |
| **Agent Role** | N/A | Optional fallback for complex scenarios |
| **Target Use Cases** | Patterns for custom agents/commands | Patterns + pre-built execution for quick start |

**Verdict:** Both approaches are valid philosophically

---

### Dimension 2: Implementation Scope (Phase 1)

| Aspect | Option A | Option B |
|--------|----------|----------|
| **Files to Create** | 4 skills only | 4 skills + 1 agent (5 files) |
| **Lines of Code** | ~2000 (4 × 500 lines) | ~2500 (4 × 500 + 500 agent) |
| **Complexity** | Low (documentation only) | Medium (documentation + agent code) |
| **Phase 1 Timeline** | 3-4 weeks | 4-5 weeks (+1 week for agent) |
| **Testing Required** | Skill loading + content verification | + Agent execution + state management |
| **Phase 1 Risk** | Low (skills can't break) | Medium (agent bugs possible) |

**Verdict:** Option A is faster to release (1 week sooner)

---

### Dimension 3: v1.0 Capabilities

| Feature | Option A | Option B |
|---------|----------|----------|
| **Basic pattern reference** | ✓ Yes | ✓ Yes |
| **Skill-based workflows** | ✓ Yes (plugins implement) | ✓ Yes (plugins implement) |
| **Pre-built orchestration agent** | ✗ No | ✓ Yes (optional) |
| **Automatic state management** | ✗ No | ✓ Yes (if using agent) |
| **Fallback orchestration** | ✗ No (skills fail → manual handling) | ✓ Yes (fallback to agent) |
| **Zero-setup orchestration** | ✗ No (plugins must build) | ✓ Yes (use agent directly) |

**Verdict:** Option B provides more v1.0 value, Option A requires plugins to do more work

---

### Dimension 4: Adoption and Discoverability

| Aspect | Option A | Option B |
|--------|----------|----------|
| **New Users** | Must learn to build orchestration | Can use agent immediately |
| **Skill Discovery** | 4 skills to find + combine | 4 skills + 1 agent (clearer entry point) |
| **Ease of Use** | Medium (skills are guides) | High (agent does orchestration) |
| **Plugin Author Effort** | High (implement orchestration) | Low (reference skill + use agent) |
| **Adoption Curve** | Gradual (need implementation experience) | Faster (can use out-of-box) |
| **Support Burden** | High ("how do I implement this?") | Medium ("which skills do I use?") |

**Verdict:** Option B has better UX for adoption

---

### Dimension 5: Future Scalability

| Roadmap | Option A | Option B |
|---------|----------|----------|
| **v1.1 (Workflow Templates)** | Skills as templates (limited) | Agent manages templates ✓ Better |
| **v1.2 (Error Recovery)** | Skills document patterns (insufficient) | Agent implements recovery ✓ Better |
| **v1.3 (Async Patterns)** | Skills guide async (plugins implement) | Agent manages async ✓ Better |
| **v2.0 (Auto-Loading)** | Auto-load correct skills | Auto-select agent or skills ✓ Same |
| **Complex Workflows** | Skills insufficient (plugins struggle) | Agent scales naturally ✓ Better |

**Verdict:** Option B scales better for ambitious roadmap

---

### Dimension 6: Maintenance Burden

| Task | Option A | Option B |
|------|----------|----------|
| **Updating patterns** | Edit skills (no deployment) | Edit skills + agent code |
| **Bug fixes** | Skill content updates (safe) | Skill + agent updates (more risky) |
| **Testing** | Skill loading + content checks | + Agent execution tests |
| **Version management** | Skills only (simple) | Skills + agent (more complex) |
| **Breaking changes** | Rare (documentation) | Possible (agent API changes) |
| **User impact of bugs** | Low (skills are reference) | High (agent bugs affect workflows) |

**Verdict:** Option A has lower maintenance burden

---

### Dimension 7: Alignment with Project Philosophy

**Frontend Plugin Design Philosophy:**
- Modular, context-efficient, reusable
- Skills as knowledge extraction mechanism
- Agents as specialized performers
- Clear separation of concerns

**Question:** Does orchestration plugin fit philosophy?

**Option A Alignment:**
- ✓ Skills are pure knowledge (fits philosophy)
- ✗ No agent means plugins must duplicate orchestration (conflicts with reuse)
- ✓ Clear separation (skills as knowledge)
- ✗ Context-inefficient for plugins (must load + implement orchestration)

**Option B Alignment:**
- ✓ Skills are pure knowledge (fits philosophy)
- ✓ Agent is specialized orchestrator (fits philosophy)
- ✓ Clear separation (skills teach, agent executes)
- ✓ Context-efficient for plugins (reference skill + use agent)
- ✓ Reusable (other plugins can use agent)

**Verdict:** Option B aligns better with project philosophy

---

## Recommendation Matrix

### Use Option A (Skills-Only) IF:
✓ You want minimal v1.0 scope (patterns only, no execution)
✓ You have limited Phase 1 time budget (3-4 weeks)
✓ You accept plugins will implement orchestration themselves
✓ You prefer documentation-based approach
✓ You want lowest possible risk for v1.0 release
✓ You plan to add agent in v1.1 (separate release)

**Risk:** Plugins struggle with orchestration complexity, adoption slower

### Use Option B (Hybrid) IF:
✓ You want complete v1.0 functionality (patterns + execution)
✓ You have Phase 1 time for additional agent design (4-5 weeks)
✓ You want plugins to reference orchestrator instead of implementing
✓ You want better adoption curve (easier to use)
✓ You align with project philosophy (reusable agents)
✓ You plan ambitious v1.1/v1.2 roadmap (workflow templates, error recovery)

**Advantage:** Faster adoption, better scalability, aligns with philosophy

---

## Recommendation: Choose Option B (Hybrid)

**Rationale:**
1. **Better Adoption** - Users can use orchestration immediately without implementation
2. **Aligns with Philosophy** - Matches frontend plugin's modular, reusable agent approach
3. **Future-Proof** - Scales naturally for v1.1 (workflow templates) and v1.2 (error recovery)
4. **Phase 1 Cost** - Only 1 additional week (acceptable for long-term gains)
5. **Reduced Support Burden** - Clear entry point (use agent) vs confusing pattern selection

**Mitigation for Hybrid Risk:**
- Keep agent MINIMAL (state management + orchestration only)
- Agent is OPTIONAL (plugins can still use skills alone)
- Skills are still PRIMARY source of truth
- Agent failures don't block skill usage
- Clear documentation of when to use each approach

**Proposed Orchestrator Agent:**
```
Agent: orchestration-coordinator
Description: Optional pre-built orchestrator for complex multi-phase workflows.
  Use when building /implement-style commands with >3 phases, parallel agents,
  quality gates, and iteration loops. For simpler workflows, use skills directly.
Status: v1.0 optional enhancement
Scope: Non-primary (plugins still own their own orchestration)
Size: ~500 lines (minimal)
Tools: Task, TodoWrite, AskUserQuestion, Bash, Read, Glob, Grep
Examples: /implement, /review, /validate-ui (patterns for implementation)
```

**Agent Responsibilities:**
- Workflow state management (phase tracking, progress)
- Complex decision logic (parallel vs sequential detection)
- Iteration loop management (feedback rounds, max iterations)
- Error recovery (fallback handling)
- Progress reporting (TodoWrite integration)

**Agent Non-Responsibilities:**
- Actual implementation (delegate to domain agents)
- Content creation (skills provide patterns)
- Command-specific logic (each command owns its workflow)

---

## Implementation Plan for Option B

### Phase 1a: Skills (Week 1-3)
- [ ] Write 4 skills (same as Option A)
- [ ] Create extraction map
- [ ] Add trigger words to descriptions
- [ ] Write 3 integration examples

### Phase 1b: Orchestrator Agent (Week 3-4)
- [ ] Design agent role and scope
- [ ] Write agent SKILL.md documentation
- [ ] Create 2-3 end-to-end examples
- [ ] Document when to use agent vs skills

### Phase 2: Integration Testing (Week 5)
- [ ] Test skills + agent together
- [ ] Verify backward compatibility
- [ ] Beta test with community

### Phase 3: Release (Week 6-8)
- [ ] Release orchestration v1.0.0
- [ ] Release frontend v3.7.0 with dependency
- [ ] Gather adoption metrics

---

## Decision Document

**DECISION:** Hybrid Architecture with Skills + Minimal Orchestrator Agent

**APPROVED BY:** [Name to be filled in]
**DECISION DATE:** November 22, 2025
**PHASE 1 ADJUSTMENT:** +1 week (3-4 weeks → 4-5 weeks for agent design)
**NEW TARGET:** Phase 1 complete by Week 4

**NEXT STEP:** Update design document with orchestrator agent specification

---

## Reference for Design Document Update

If Option B is chosen, update the design document:

**Section 1: Plugin Manifest**
```json
{
  "name": "orchestration",
  "version": "1.0.0",
  "skills": [
    "multi-agent-coordination",
    "multi-model-validation",
    "quality-gates",
    "todowrite-orchestration"
  ],
  "agents": [
    "orchestration-coordinator"  // NEW
  ]
}
```

**Section 8: Decision #1 Update**
```markdown
### Decision 1: Skills + Optional Orchestrator Agent (Hybrid)

**Rationale:**
- Provides patterns (skills) + optional execution (agent)
- Aligns with project philosophy of reusable, modular agents
- Scales naturally for v1.1+ roadmap
- Better adoption curve (easy entry point)
- Maintains backward compatibility (skills-only workflows still work)
```

---

## Conclusion

**Option B (Hybrid) is recommended** because it:
1. Provides better v1.0 value without significant additional effort
2. Aligns with project's modular, reusable agent philosophy
3. Scales better for ambitious v1.1+ roadmap
4. Has better adoption curve
5. Only requires 1 additional week in Phase 1

**Cost:** +1 week Phase 1 timeline
**Benefit:** 2-3x better adoption, natural scaling, philosophy alignment
**Risk:** Manageable with minimal agent scope

**Action:** Get team approval, then update design document and proceed with Phase 1.

---

**Decision Matrix Created:** November 22, 2025
**For:** Orchestration Plugin Architecture Review
**Status:** Ready for Team Discussion
