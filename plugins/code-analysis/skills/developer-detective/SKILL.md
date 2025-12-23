---
name: developer-detective
description: "⚡ PRIMARY TOOL for: 'how does X work', 'find implementation of', 'trace data flow', 'where is X defined', 'audit integrations', 'find all usages'. Uses claudemem v0.3.0 AST with callers/callees analysis. GREP/FIND/GLOB ARE FORBIDDEN."
allowed-tools: Bash, Task, Read, AskUserQuestion
---

# ⛔⛔⛔ CRITICAL: AST STRUCTURAL ANALYSIS ONLY ⛔⛔⛔

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   🧠 THIS SKILL USES claudemem v0.3.0 AST ANALYSIS EXCLUSIVELY               ║
║                                                                              ║
║   ❌ GREP IS FORBIDDEN                                                       ║
║   ❌ FIND IS FORBIDDEN                                                       ║
║   ❌ GLOB IS FORBIDDEN                                                       ║
║                                                                              ║
║   ✅ claudemem --nologo callers <name> --raw FOR USAGE ANALYSIS             ║
║   ✅ claudemem --nologo callees <name> --raw FOR DEPENDENCY TRACING         ║
║   ✅ claudemem --nologo context <name> --raw FOR FULL UNDERSTANDING         ║
║                                                                              ║
║   ⭐ v0.3.0: callers/callees show exact data flow and dependencies          ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

# Developer Detective Skill

**Version:** 3.1.0
**Role:** Software Developer
**Purpose:** Implementation investigation using AST callers/callees and impact analysis

## Role Context

You are investigating this codebase as a **Software Developer**. Your focus is on:
- **Implementation details** - How code actually works
- **Data flow** - How data moves through the system (via callees)
- **Usage patterns** - How code is used (via callers)
- **Dependencies** - What a function needs to work
- **Impact analysis** - What breaks if you change something

## Why callers/callees is Perfect for Development

The `callers` and `callees` commands show you:
- **callers** = Every place that calls this code (impact of changes)
- **callees** = Every function this code calls (its dependencies)
- **Exact file:line** = Precise locations for reading/editing
- **Call kinds** = call, import, extends, implements

## Developer-Focused Commands (v0.3.0)

### Find Implementation

```bash
# Find where a function is defined
claudemem --nologo symbol processPayment --raw

# Get full context with callers and callees
claudemem --nologo context processPayment --raw
```

### Trace Data Flow

```bash
# What does this function call? (data flows OUT)
claudemem --nologo callees processPayment --raw

# Follow the chain
claudemem --nologo callees validateCard --raw
claudemem --nologo callees chargeStripe --raw
```

### Find All Usages

```bash
# Who calls this function? (usage patterns)
claudemem --nologo callers processPayment --raw

# This shows EVERY place that uses this code
```

### Impact Analysis (v0.4.0+ Required)

```bash
# Before modifying ANY code, check full impact
claudemem --nologo impact functionToChange --raw

# Output shows ALL transitive callers:
# direct_callers:
#   - LoginController.authenticate:34
#   - SessionMiddleware.validate:12
# transitive_callers (depth 2):
#   - AppRouter.handleRequest:45
#   - TestSuite.runAuth:89
```

**Why impact matters**:
- `callers` shows only direct callers (1 level)
- `impact` shows ALL transitive callers (full tree)
- Critical for refactoring decisions

**Handling Empty Results:**
```bash
IMPACT=$(claudemem --nologo impact functionToChange --raw)
if echo "$IMPACT" | grep -q "No callers"; then
  echo "No callers found. This is either:"
  echo "  1. An entry point (API handler, main function) - expected"
  echo "  2. Dead code - verify with: claudemem dead-code"
  echo "  3. Dynamically called - check for import(), reflection"
fi
```

### Impact Analysis (BEFORE Modifying)

```bash
# Quick check - direct callers only (v0.3.0)
claudemem --nologo callers functionToChange --raw

# Deep check - ALL transitive callers (v0.4.0+ Required)
IMPACT=$(claudemem --nologo impact functionToChange --raw)

# Handle results
if [ -z "$IMPACT" ] || echo "$IMPACT" | grep -q "No callers"; then
  echo "No static callers found - verify dynamic usage patterns"
else
  echo "$IMPACT"
  echo ""
  echo "This tells you:"
  echo "- Direct callers (immediate impact)"
  echo "- Transitive callers (ripple effects)"
  echo "- Grouped by file (for systematic updates)"
fi
```

### Understanding Complex Code

```bash
# Get full picture: definition + callers + callees
claudemem --nologo context complexFunction --raw
```

## Workflow: Implementation Investigation (v0.3.0)

### Phase 1: Map the Area

```bash
# Get overview of the feature area
claudemem --nologo map "payment processing" --raw
```

### Phase 2: Find the Entry Point

```bash
# Locate the main function (highest PageRank in area)
claudemem --nologo symbol PaymentService --raw
```

### Phase 3: Trace the Flow

```bash
# What does PaymentService call?
claudemem --nologo callees PaymentService --raw

# For each major callee, trace further
claudemem --nologo callees validatePayment --raw
claudemem --nologo callees processCharge --raw
claudemem --nologo callees saveTransaction --raw
```

### Phase 4: Understand Usage

```bash
# Who uses PaymentService?
claudemem --nologo callers PaymentService --raw

# This shows the entry points
```

### Phase 5: Read Specific Code

```bash
# Now read ONLY the relevant file:line ranges from results
# DON'T read whole files
```

## Output Format: Implementation Report

### 1. Symbol Overview

```
┌─────────────────────────────────────────────────────────┐
│              IMPLEMENTATION ANALYSIS                     │
├─────────────────────────────────────────────────────────┤
│  Symbol: processPayment                                  │
│  Location: src/services/payment.ts:45-89                │
│  Kind: function                                          │
│  PageRank: 0.034                                         │
│  Search Method: claudemem v0.3.0 (AST analysis)         │
└─────────────────────────────────────────────────────────┘
```

### 2. Data Flow (Callees)

```
processPayment
  ├── validateCard (src/validators/card.ts:12)
  ├── getCustomer (src/services/customer.ts:34)
  ├── chargeStripe (src/integrations/stripe.ts:56)
  │     └── stripe.charges.create (external)
  └── saveTransaction (src/repositories/transaction.ts:78)
        └── database.insert (src/db/index.ts:23)
```

### 3. Usage (Callers)

```
processPayment is called by:
  ├── CheckoutController.submit (src/controllers/checkout.ts:45)
  ├── SubscriptionService.renew (src/services/subscription.ts:89)
  └── RetryQueue.processPayment (src/workers/retry.ts:23)
```

### 4. Impact Analysis

```
⚠️ IMPACT: Changing processPayment will affect:
  - 3 direct callers (shown above)
  - Checkout flow (user-facing)
  - Subscription renewals (automated)
  - Payment retry logic (background)
```

## Scenarios

### Scenario: "How does X work?"

```bash
# Step 1: Find X
claudemem --nologo symbol X --raw

# Step 2: See what X does
claudemem --nologo callees X --raw

# Step 3: See how X is used
claudemem --nologo callers X --raw

# Step 4: Read the specific code
# Use Read tool on exact file:line from results
```

### Scenario: Refactoring

```bash
# Step 1: Find ALL usages (callers)
claudemem --nologo callers oldFunction --raw

# Step 2: Document each caller location
# Step 3: Update each caller systematically
```

### Scenario: Adding to Existing Code

```bash
# Step 1: Find where to add
claudemem --nologo symbol targetModule --raw

# Step 2: Understand dependencies
claudemem --nologo callees targetModule --raw

# Step 3: Check existing patterns
claudemem --nologo callers targetModule --raw
```

## Anti-Patterns

| Anti-Pattern | Why Wrong | Correct Approach |
|--------------|-----------|------------------|
| `grep -r "function"` | No call relationships | `claudemem --nologo callees func --raw` |
| Modify without callers | Breaking changes | ALWAYS check `callers` first |
| Read whole files | Token waste | Read specific file:line from results |
| Guess dependencies | Miss connections | Use `callees` for exact deps |

## Notes

- **`callers` is essential before any modification** - Know your impact
- **`callees` traces data flow** - Follow the execution path
- **`context` gives complete picture** - Symbol + callers + callees
- Always read specific file:line ranges, not whole files
- Works best with TypeScript, Go, Python, Rust codebases

---

**Maintained by:** MadAppGang
**Plugin:** code-analysis v2.6.0
**Last Updated:** December 2025 (v0.4.0 impact analysis support)
