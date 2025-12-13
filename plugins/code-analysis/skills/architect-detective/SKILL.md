---
name: architect-detective
description: "⚡ PRIMARY TOOL for: 'what's the architecture', 'system design', 'how are layers organized', 'find design patterns', 'audit structure', 'map dependencies'. REPLACES grep/glob for architecture analysis. Uses claudemem INDEXED MEMORY exclusively. GREP/FIND/GLOB ARE FORBIDDEN."
allowed-tools: Bash, Task, Read, AskUserQuestion
---

# ⛔⛔⛔ CRITICAL: INDEXED MEMORY ONLY ⛔⛔⛔

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   🧠 THIS SKILL USES INDEXED MEMORY (claudemem) EXCLUSIVELY                  ║
║                                                                              ║
║   ❌ GREP IS FORBIDDEN                                                       ║
║   ❌ FIND IS FORBIDDEN                                                       ║
║   ❌ GLOB IS FORBIDDEN                                                       ║
║   ❌ Grep tool IS FORBIDDEN                                                  ║
║   ❌ Glob tool IS FORBIDDEN                                                  ║
║                                                                              ║
║   ✅ claudemem search "query" IS THE ONLY WAY                               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

# Architect Detective Skill

**Version:** 1.1.0
**Role:** Software Architect
**Purpose:** Deep architectural investigation using INDEXED MEMORY (claudemem)

## Role Context

You are investigating this codebase as a **Software Architect**. Your focus is on:
- **System boundaries** - Where modules, services, and layers begin and end
- **Design patterns** - Architectural patterns used (MVC, Clean Architecture, DDD, etc.)
- **Dependency flow** - How components depend on each other
- **Abstraction layers** - Interfaces, contracts, and abstractions
- **Scalability patterns** - Caching, queuing, microservices boundaries

## Claudemem Integration

<skill name="claudemem" version="0.1">
<purpose>
Semantic code search using vector embeddings.
Finds code by MEANING, not just text matching.
Use INSTEAD of grep/find for: architecture discovery, pattern matching, understanding codebases.
</purpose>

<capabilities>
INDEXING: Parse code → chunk by AST (functions/classes/methods) → embed → store in LanceDB
SEARCH: Natural language → vector similarity + BM25 keyword → ranked results with file:line
AUTO-INDEX: Changed files re-indexed automatically before search
</capabilities>

<tools>
CLI:
  claudemem index [path] [-f]      # Index codebase (force with -f)
  claudemem search "query" [-n N]  # Search (auto-indexes changes)
  claudemem status                 # Show index info
  claudemem clear                  # Remove index
  claudemem ai <role>              # Get role instructions

MCP (Claude Code integration):
  search_code        query, limit?, language?, autoIndex?
  index_codebase     path?, force?, model?
  get_status         path?
  clear_index        path?
  list_embedding_models  freeOnly?
</tools>
</skill>

## Architecture-Focused Search Patterns

### Layer Discovery
```bash
# Find service layer implementations
claudemem search "service layer business logic domain operations"

# Find repository/data access layer
claudemem search "repository pattern data access database query"

# Find controller/handler layer
claudemem search "controller handler endpoint request response"

# Find presentation layer
claudemem search "view component template rendering UI display"
```

### Pattern Detection
```bash
# Find dependency injection setup
claudemem search "dependency injection container provider factory"

# Find factory patterns
claudemem search "factory creation pattern object instantiation"

# Find observer/event patterns
claudemem search "event emitter observer pattern publish subscribe"

# Find strategy patterns
claudemem search "strategy pattern algorithm selection behavior"

# Find adapter patterns
claudemem search "adapter wrapper converter external integration"
```

### Boundary Analysis
```bash
# Find module boundaries
claudemem search "module export public interface boundary"

# Find API boundaries
claudemem search "API endpoint contract interface external"

# Find domain boundaries
claudemem search "domain model entity aggregate bounded context"
```

### Configuration Architecture
```bash
# Find configuration loading
claudemem search "configuration environment variables settings initialization"

# Find feature flags
claudemem search "feature flag toggle conditional enablement"

# Find plugin/extension points
claudemem search "plugin extension hook customization point"
```

## Workflow: Architecture Discovery

### Phase 1: Index and Overview
```bash
# 1. Check/create index
claudemem status || claudemem index -y

# 2. Find entry points
claudemem search "main entry point application bootstrap initialization" -n 10

# 3. Map high-level structure
claudemem search "module definition export public interface" -n 15
```

### Phase 2: Layer Mapping
```bash
# Map each architectural layer
claudemem search "controller handler route endpoint" -n 10    # Presentation
claudemem search "service business logic domain" -n 10         # Business
claudemem search "repository database query persistence" -n 10 # Data
claudemem search "entity model schema type definition" -n 10   # Domain
```

### Phase 3: Dependency Analysis
```bash
# Find dependency injection
claudemem search "inject dependency container provider" -n 10

# Find imports between layers
claudemem search "import from service repository controller" -n 15

# Find circular dependency risks
claudemem search "circular import bidirectional dependency" -n 5
```

### Phase 4: Design Pattern Identification
```bash
# Search for common patterns
claudemem search "singleton instance global state" -n 5
claudemem search "factory create new instance builder" -n 5
claudemem search "strategy algorithm policy selection" -n 5
claudemem search "decorator wrapper middleware enhance" -n 5
claudemem search "observer listener event subscriber" -n 5
```

## Output Format: Architecture Report

### 1. System Overview
```
┌─────────────────────────────────────────────────────────┐
│                    SYSTEM ARCHITECTURE                   │
├─────────────────────────────────────────────────────────┤
│  Entry Point: src/index.ts                              │
│  Architecture Style: Clean Architecture / Hexagonal    │
│  Primary Patterns: Repository, Factory, Strategy       │
└─────────────────────────────────────────────────────────┘
```

### 2. Layer Map
```
┌─────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER (src/controllers/, src/handlers/)   │
│   └── HTTP Controllers, GraphQL Resolvers, CLI         │
├─────────────────────────────────────────────────────────┤
│ APPLICATION LAYER (src/services/, src/use-cases/)      │
│   └── Business Logic, Orchestration, Commands          │
├─────────────────────────────────────────────────────────┤
│ DOMAIN LAYER (src/domain/, src/entities/)              │
│   └── Entities, Value Objects, Domain Services         │
├─────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE LAYER (src/repositories/, src/adapters/)│
│   └── Database, External APIs, File System             │
└─────────────────────────────────────────────────────────┘
```

### 3. Dependency Flow
```
Controller → Service → Repository → Database
     ↓           ↓           ↓
  Validator   Domain     External API
                ↓
            Events → Queue
```

### 4. Design Patterns Detected
```
| Pattern      | Location                    | Purpose               |
|--------------|-----------------------------|-----------------------|
| Repository   | src/repositories/*.ts       | Data access abstraction|
| Factory      | src/factories/*.ts          | Object creation       |
| Strategy     | src/strategies/*.ts         | Algorithm selection   |
| Middleware   | src/middleware/*.ts         | Request processing    |
| Observer     | src/events/*.ts             | Event-driven decoupling|
```

### 5. Recommendations
```
[Architecture Observations]
✓ Good: Clear separation between layers
✓ Good: Repository pattern for data access
⚠ Consider: Some controllers contain business logic
⚠ Consider: Missing explicit domain events
✗ Issue: Circular dependency between auth and user services
```

## Integration with Detective Agent

When using the codebase-detective agent with this skill:

```typescript
Task({
  subagent_type: "code-analysis:detective",
  description: "Architecture investigation",
  prompt: `
## Architect Investigation

Use claudemem with architecture-focused queries to:
1. Map system layers and boundaries
2. Identify design patterns in use
3. Analyze dependency flow
4. Find abstraction points and interfaces

Focus on STRUCTURE and DESIGN, not implementation details.

Generate an Architecture Report with:
- System overview diagram
- Layer map
- Dependency flow
- Pattern catalog
- Architecture recommendations
  `
})
```

## Best Practices for Architecture Discovery

1. **Start broad, then narrow**
   - Begin with entry points and main modules
   - Drill into specific layers and patterns

2. **Follow the dependencies**
   - Trace imports to understand coupling
   - Map dependency direction (always down the layers)

3. **Look for abstractions**
   - Interfaces and abstract classes define contracts
   - Find where behavior varies (strategy/factory patterns)

4. **Identify boundaries**
   - Clear boundaries = good architecture
   - Fuzzy boundaries = potential refactoring targets

5. **Document patterns**
   - Name the patterns you find
   - Note deviations from standard patterns

## Notes

- Requires claudemem CLI installed and configured
- Works best on indexed codebases (run `claudemem index` first)
- Focuses on structure over implementation
- Pairs well with developer-detective for implementation details

---

**Maintained by:** MadAppGang
**Plugin:** code-analysis
**Last Updated:** December 2025
