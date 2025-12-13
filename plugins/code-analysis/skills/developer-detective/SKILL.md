---
name: developer-detective
description: "⚡ PRIMARY TOOL for: 'how does X work', 'find implementation of', 'trace data flow', 'where is X defined', 'audit integrations', 'find all usages'. REPLACES grep/glob for code understanding. Uses claudemem INDEXED MEMORY exclusively. GREP/FIND/GLOB ARE FORBIDDEN."
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

# Developer Detective Skill

**Version:** 1.1.0
**Role:** Software Developer
**Purpose:** Implementation investigation using INDEXED MEMORY (claudemem)

## Role Context

You are investigating this codebase as a **Software Developer**. Your focus is on:
- **Implementation details** - How code actually works
- **Data flow** - How data moves through the system
- **Function signatures** - APIs, parameters, return types
- **Error handling** - How errors are caught and propagated
- **Side effects** - Database writes, API calls, file operations

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

## Developer-Focused Search Patterns

### Finding Implementations
```bash
# Find function/method implementation
claudemem search "function implementation create user account"

# Find class implementation
claudemem search "class UserService implementation methods"

# Find interface implementations
claudemem search "implements interface repository save"

# Find specific logic
claudemem search "calculate price discount percentage logic"
```

### Data Flow Tracing
```bash
# Find where data is created
claudemem search "create new user object entity instantiation"

# Find where data is transformed
claudemem search "map transform convert request to response"

# Find where data is persisted
claudemem search "save insert update database persist"

# Find where data is retrieved
claudemem search "find get fetch load query database"
```

### API and Endpoint Discovery
```bash
# Find HTTP endpoints
claudemem search "POST endpoint handler create resource"

# Find GraphQL resolvers
claudemem search "resolver mutation query GraphQL"

# Find WebSocket handlers
claudemem search "websocket socket message handler event"

# Find middleware processing
claudemem search "middleware request processing next"
```

### Error Handling
```bash
# Find error handling patterns
claudemem search "try catch error handling exception"

# Find custom error classes
claudemem search "class extends Error custom exception"

# Find error responses
claudemem search "error response status code message"

# Find validation errors
claudemem search "validation error invalid input check"
```

### Side Effects
```bash
# Find database operations
claudemem search "transaction commit rollback database"

# Find external API calls
claudemem search "fetch axios http external API call"

# Find file operations
claudemem search "read write file filesystem"

# Find event emissions
claudemem search "emit publish event notification"
```

## Workflow: Implementation Discovery

### Phase 1: Find Entry Point
```bash
# 1. Ensure index exists
claudemem status || claudemem index -y

# 2. Find where the feature starts
claudemem search "route handler endpoint [feature]" -n 5

# 3. Identify the controller/handler
claudemem search "controller handle process [feature]" -n 5
```

### Phase 2: Trace the Flow
```bash
# Follow the call chain
claudemem search "[controller] calls [service]" -n 5
claudemem search "[service] method implementation" -n 10
claudemem search "[service] uses [repository]" -n 5
```

### Phase 3: Understand Data Transformations
```bash
# Find DTOs and mappings
claudemem search "DTO data transfer object [entity]" -n 5
claudemem search "mapper convert transform [entity]" -n 5
```

### Phase 4: Identify Side Effects
```bash
# Find what the code writes/affects
claudemem search "save update delete [entity]" -n 5
claudemem search "emit event after [action]" -n 5
claudemem search "call external service API" -n 5
```

## Output Format: Implementation Report

### 1. Entry Point
```
📍 Entry Point: src/controllers/user.controller.ts:45
   └── POST /api/users → createUser()
   └── Validates: CreateUserDto
   └── Returns: UserResponse
```

### 2. Call Chain
```
createUser() [controller]
   │
   ├── validate(dto) [validator]
   │      └── check email format, password strength
   │
   ├── userService.create(dto) [service]
   │      │
   │      ├── hashPassword(dto.password) [utility]
   │      │      └── bcrypt.hash()
   │      │
   │      ├── userRepository.save(user) [repository]
   │      │      └── database.insert()
   │      │
   │      └── eventEmitter.emit('user.created') [event]
   │
   └── return UserResponse.from(user) [mapper]
```

### 3. Data Transformations
```
Input: CreateUserDto
   │
   └── { email, password, name }
          │
          ▼
Internal: User Entity
   │
   └── { id, email, passwordHash, name, createdAt }
          │
          ▼
Output: UserResponse
   │
   └── { id, email, name, createdAt }
```

### 4. Side Effects
```
| Action              | Location                  | Effect                    |
|---------------------|---------------------------|---------------------------|
| Database INSERT     | userRepository.save:34    | users table               |
| Event emission      | userService.create:67     | 'user.created' event      |
| Email notification  | userCreatedHandler:12     | Welcome email sent        |
```

### 5. Error Paths
```
❌ Validation Error (400)
   └── Invalid email format → ValidationError
   └── Weak password → ValidationError

❌ Conflict Error (409)
   └── Email exists → DuplicateEmailError

❌ Server Error (500)
   └── Database failure → DatabaseError
   └── Email service down → EmailServiceError
```

## Integration with Detective Agent

When using the codebase-detective agent with this skill:

```typescript
Task({
  subagent_type: "code-analysis:detective",
  description: "Implementation investigation",
  prompt: `
## Developer Investigation

Use claudemem with implementation-focused queries to:
1. Find where [feature] is implemented
2. Trace the data flow from input to output
3. Identify all side effects (database, APIs, events)
4. Map the error handling paths

Focus on HOW the code works, not just WHAT it does.

Generate an Implementation Report with:
- Entry point and function signatures
- Complete call chain
- Data transformations
- Side effects catalog
- Error handling paths
  `
})
```

## Best Practices for Implementation Discovery

1. **Start at the boundary**
   - Find the API endpoint or UI handler first
   - Work inward from user-facing to internal

2. **Follow the data**
   - Track how input transforms to output
   - Note where data is validated, transformed, persisted

3. **Catalog side effects**
   - Database operations (CRUD)
   - External API calls
   - Event emissions
   - File operations

4. **Map error paths**
   - What can fail?
   - How are errors handled?
   - What does the user see?

5. **Note patterns**
   - Reusable utilities
   - Common validation patterns
   - Shared error handling

## Practical Search Examples

### Example: "How does user login work?"
```bash
# 1. Find login endpoint
claudemem search "login endpoint POST session authentication"

# 2. Find auth service
claudemem search "authenticate user password verification"

# 3. Find token generation
claudemem search "generate JWT token session create"

# 4. Find password verification
claudemem search "compare hash password bcrypt verify"
```

### Example: "Where is the payment processed?"
```bash
# 1. Find payment entry
claudemem search "payment process charge handler"

# 2. Find payment service
claudemem search "PaymentService process charge create"

# 3. Find Stripe/payment gateway integration
claudemem search "stripe charge payment gateway API"

# 4. Find transaction recording
claudemem search "transaction record payment database save"
```

### Example: "How are files uploaded?"
```bash
# 1. Find upload endpoint
claudemem search "file upload handler multipart form"

# 2. Find storage logic
claudemem search "file storage S3 disk save"

# 3. Find validation
claudemem search "file validation size type extension"

# 4. Find metadata recording
claudemem search "file metadata record database save"
```

## Notes

- Requires claudemem CLI installed and configured
- Works best on indexed codebases (run `claudemem index` first)
- Focuses on implementation over architecture
- Pairs well with architect-detective for structural context

---

**Maintained by:** MadAppGang
**Plugin:** code-analysis
**Last Updated:** December 2025
