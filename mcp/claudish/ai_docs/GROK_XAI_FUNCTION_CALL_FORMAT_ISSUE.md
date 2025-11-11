# Critical Issue: Grok Outputting xAI Function Call Format as Text

**Discovered**: 2025-11-11 (15:45)
**Severity**: CRITICAL - Breaks tool calling entirely
**Model Affected**: x-ai/grok-code-fast-1
**Status**: Model behavior issue - Grok uses xAI format instead of OpenAI format

---

## 🔴 The Problem

### What User Experienced

UI shows:
- "Reviewing package configuration"
- Package.json update text
- Then literally: `<xai:function_call name="Read">`
- "Assistant:"
- Another malformed: `<xai:function_call name="Read">xai:function_call`
- System stuck, waiting

### Root Cause: Incompatible Function Call Format

**Grok is outputting xAI's XML-style function calls as TEXT:**

```
<xai:function_call name="Read"></xai:function_call>
```

**Instead of OpenAI's JSON-style tool calls:**

```json
{
  "tool_calls": [{
    "id": "call_abc123",
    "type": "function",
    "function": {
      "name": "Read",
      "arguments": "{\"file_path\":\"/path/to/file\"}"
    }
  }]
}
```

---

## 📊 Evidence from Logs

### From logs/claudish_2025-11-11_04-30-31.log

**Timeline 04:45:09:**

```
[2025-11-11T04:45:09.636Z] Encrypted reasoning detected
[2025-11-11T04:45:09.636Z] Sending content delta: <x
[2025-11-11T04:45:09.636Z] Sending content delta: ai
[2025-11-11T04:45:09.636Z] Sending content delta: :function
[2025-11-11T04:45:09.637Z] Sending content delta: _call
[2025-11-11T04:45:09.637Z] Sending content delta: >
[2025-11-11T04:45:09.661Z] finish_reason: "stop"
[2025-11-11T04:45:09.691Z] Stream closed properly
```

**Key observations:**
1. Grok sent `<xai:function_call>` as regular `delta.content` (text)
2. NOT sent as `delta.tool_calls` (proper tool call)
3. Immediately finished with `finish_reason: "stop"`
4. Our proxy correctly forwarded it as text (not our bug!)

---

## 🎯 Why This Happens

### xAI's Native Format vs OpenRouter

**xAI's Grok models have TWO function calling modes:**

1. **Native xAI format** (XML-style):
   ```xml
   <xai:function_call name="Read">
     <xai:parameter name="file_path">/path/to/file</xai:parameter>
   </xai:function_call>
   ```

2. **OpenAI-compatible format** (JSON in `tool_calls` field):
   ```json
   {
     "tool_calls": [{
       "function": {"name": "Read", "arguments": "{...}"}
     }]
   }
   ```

**The Problem:** When Grok is used through OpenRouter, it should use OpenAI format, but sometimes it:
- Gets confused about which format to use
- Outputs xAI XML format as text instead of proper tool calls
- This breaks Claude Code's tool execution

---

## 🔍 Related xAI Documentation & Research Findings

### From Official xAI Documentation

**docs.x.ai/docs/guides/function-calling:**
- xAI enables connecting models to external tools and systems
- Function calling enables LLMs to use external tools via RPC-style calls
- Grok 4 includes native tool use and real-time search integration
- Supports up to 128 functions per request
- Uses OpenAI-compatible API format externally

### From Internet Research (2025)

**CONFIRMED ISSUES WITH GROK + OPENROUTER:**

1. **Missing "created" Field** (Multiple reports):
   - Tool call responses from Grok via OpenRouter missing "created" field
   - Causes parsing errors in clients (Zed editor, Cline, others)
   - Error: "missing field `created`" when using grok-code-fast-1
   - Reported in Zed Issue #37022, #36994, #34185

2. **Tool Calls Don't Work** (Widespread):
   - Grok Code Fast 1 won't answer anything unless using "Minimal" mode
   - Tool calling completely broken with OpenRouter
   - Multiple platforms affected (Zed, VAPI, Home Assistant)

3. **"Invalid Grammar Request" Errors**:
   - xAI sometimes rejects structured output requests
   - Returns 502 status with "Upstream error from xAI: undefined"
   - Related to grammar/structured output incompatibilities

4. **Internal XML Format**:
   - Grok uses XML-inspired format internally: `<xai:function_call>`
   - Should convert to JSON for OpenAI-compatible API
   - Conversion sometimes fails, outputting XML as text

5. **Multiple Function Call Limitations**:
   - Report: "XAI cannot invoke multiple function calls"
   - May have issues with parallel tool execution

**Possible causes:**
1. OpenRouter not properly translating Claude tool definitions to xAI format
2. Grok getting confused by the tool schema
3. Grok defaulting to XML output when tool calling fails
4. xAI API returning errors without proper "created" field
5. Grammar/structured output requests being rejected by xAI
6. Context window or prompt causing model confusion

---

## 💡 Possible Solutions

### Option 1: Detect and Parse xAI XML Format (Proxy Fix)

Add XML parser to detect xAI function calls in text content:

```typescript
// In streaming handler, after sending text_delta
const xaiCallMatch = accumulatedText.match(/<xai:function_call name="([^"]+)">(.*?)<\/xai:function_call>/s);

if (xaiCallMatch) {
  const [fullMatch, toolName, xmlParams] = xaiCallMatch;

  // Parse XML parameters to JSON
  const params = parseXaiParameters(xmlParams);

  // Create synthetic tool call
  const syntheticToolCall = {
    id: `synthetic_${Date.now()}`,
    name: toolName,
    arguments: JSON.stringify(params)
  };

  // Send as proper tool_use block
  sendSSE("content_block_start", {
    index: currentBlockIndex++,
    content_block: {
      type: "tool_use",
      id: syntheticToolCall.id,
      name: syntheticToolCall.name
    }
  });

  // Send tool input
  sendSSE("content_block_delta", {
    index: currentBlockIndex - 1,
    delta: {
      type: "input_json_delta",
      partial_json: syntheticToolCall.arguments
    }
  });

  // Close tool block
  sendSSE("content_block_stop", {
    index: currentBlockIndex - 1
  });
}
```

**Pros:**
- Works around Grok's behavior
- Translates xAI format to Claude format
- No model changes needed

**Cons:**
- Complex parsing logic
- May have edge cases (nested XML, escaped content)
- Feels like a hack
- Doesn't fix root cause

### Option 2: Force OpenAI Tool Format (Request Modification)

Modify requests to Grok to force OpenAI tool calling:

```typescript
// In proxy-server.ts, before sending to OpenRouter
if (model.includes("grok")) {
  // Add system message forcing OpenAI format
  claudeRequest.messages.unshift({
    role: "system",
    content: "IMPORTANT: Use OpenAI-compatible tool calling format with tool_calls field. Do NOT use <xai:function_call> XML format."
  });
}
```

**Pros:**
- Simple to implement
- Addresses root cause
- Clean solution

**Cons:**
- May not work if model ignores instruction
- Adds tokens to every request
- Needs testing

### Option 3: Switch Model Recommendation

**Remove Grok from recommended models** until tool calling is fixed:

- Current: `x-ai/grok-code-fast-1` is top recommendation
- Change to: Use `openai/gpt-5-codex` or `minimax/minimax-m2` instead
- Add warning: "Grok has known tool calling issues with Claude Code"

**Pros:**
- Immediate fix for users
- No code changes needed
- Honest about limitations

**Cons:**
- Loses Grok's benefits (speed, cost)
- Doesn't fix underlying issue
- Users can still select Grok manually

### Option 4: Report to xAI/OpenRouter

**File bug reports:**

1. **To xAI:** Grok outputting XML format when OpenAI format expected
2. **To OpenRouter:** Tool calling translation issues with Grok

**Pros:**
- Gets issue fixed at source
- Benefits all users
- Professional approach

**Cons:**
- Takes time
- Out of our control
- May not be prioritized

---

## 🧪 Testing the Issue

### Reproduce

```bash
./dist/index.js --model x-ai/grok-code-fast-1 --debug

# Then in Claude Code, trigger any tool use
# Example: "Read package.json"
```

**Expected behavior:** See `<xai:function_call>` in output, UI stuck

### Test Fix (if implemented)

```bash
# After implementing Option 1 or 2
./dist/index.js --model x-ai/grok-code-fast-1

# Verify:
1. Tool calls work properly
2. No xAI XML in output
3. Claude Code executes tools
```

---

## 📝 Recommended Action

**Short term (Immediate):**
1. **Option 3**: Update README to warn about Grok tool calling issues
2. Move Grok lower in recommended model list
3. Suggest alternative models for tool-heavy workflows

**Medium term (This week):**
1. **Option 4**: File bug reports with xAI and OpenRouter
2. **Option 2**: Try forcing OpenAI format via system message
3. Test if fix works

**Long term (If no upstream fix):**
1. **Option 1**: Implement xAI XML parser as fallback
2. Add comprehensive tests
3. Document as "xAI compatibility layer"

---

## 🔗 Related Issues

- GROK_REASONING_PROTOCOL_ISSUE.md - Visible reasoning field
- GROK_ENCRYPTED_REASONING_ISSUE.md - Encrypted reasoning freezing

**Pattern:** Grok has multiple xAI-specific behaviors that need translation:
1. Reasoning in separate field ✅ Fixed
2. Encrypted reasoning ✅ Fixed
3. XML function calls ❌ NOT FIXED (this issue)

---

## 📈 Impact

**Severity:** CRITICAL
- Grok completely unusable for tool-heavy workflows
- Affects any task requiring Read, Write, Edit, Grep, etc.
- UI appears stuck, confusing user experience

**Affected Users:**
- Anyone using `x-ai/grok-code-fast-1` with Claude Code
- Especially impacts users following our "recommended models" list

**Workaround:**
- Switch to different model: `openai/gpt-5-codex`, `minimax/minimax-m2`, etc.
- Use Anthropic Claude directly (not through Claudish)

---

**Status**: Documented, awaiting fix strategy decision
**Priority**: CRITICAL (blocks Grok usage entirely)
**Next Steps**: Update README, file bug reports, test Option 2
