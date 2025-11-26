# Model Scraper Agent Design

**Version:** 1.0.0
**Date:** 2025-11-14
**Agent Type:** Utility Agent (Data Scraping)
**Model:** Sonnet
**Purpose:** Automate extraction of OpenRouter model data from public rankings page

---

## Overview

This design documents a specialized agent that uses Chrome DevTools MCP to scrape OpenRouter's programming model rankings and generate a curated model recommendations file. The agent replaces manual model research with automated data extraction, ensuring the recommendations file stays current.

### Key Capabilities

- **Web Scraping**: Navigate and extract data from OpenRouter rankings page
- **Model Detail Extraction**: Visit individual model pages for detailed information
- **Markdown Generation**: Create structured recommendations file
- **Error Handling**: Robust handling of page structure changes
- **Data Validation**: Verify extracted data quality

---

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Launch Script                          │
│               (scripts/scrape-models.ts)                 │
│                                                          │
│  • Launches model-scraper agent via Task tool           │
│  • Waits for completion                                 │
│  • Reports success/failure                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Model Scraper Agent                         │
│          (.claude/agents/model-scraper.md)               │
│                                                          │
│  Workflow:                                              │
│  1. Navigate to OpenRouter rankings page                │
│  2. Wait for React app to hydrate                       │
│  3. Extract top 9 model names/slugs from rankings       │
│  4. For each model:                                     │
│     - Navigate to model detail page                     │
│     - Extract: slug, pricing, context, description      │
│  5. Generate markdown with all extracted data           │
│  6. Write to shared/recommended-models.md               │
│  7. Validate output structure                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│            Chrome DevTools MCP Server                    │
│                                                          │
│  Tools Used:                                            │
│  • mcp__chrome-devtools__navigate                       │
│  • mcp__chrome-devtools__evaluate (JavaScript)          │
│  • mcp__chrome-devtools__screenshot (debugging)         │
│  • mcp__chrome-devtools__console (error detection)      │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   Output File                            │
│        (shared/recommended-models.md)                    │
│                                                          │
│  Structure:                                             │
│  • Header with version and update date                  │
│  • Quick reference table (11 models)                    │
│  • 4 categories (Coding, Reasoning, Vision, Budget)     │
│  • Each model: Provider, ID, pricing, best-for         │
│  • Decision tree                                        │
│  • Performance benchmarks                               │
└─────────────────────────────────────────────────────────┘
```

---

## Agent Design: Model Scraper

### Frontmatter

```yaml
---
name: model-scraper
description: |
  Scrapes OpenRouter programming model rankings and generates recommended-models.md.
  Use when: (1) Updating model recommendations before release, (2) Adding new models
  to recommendations, (3) Verifying model pricing/context window updates.
model: sonnet
color: cyan
tools: TodoWrite, Read, Write, Bash
---
```

### Agent Prompt (XML Structure)

```xml
<role>
  <identity>OpenRouter Model Data Scraper</identity>
  <expertise>
    - Chrome DevTools MCP automation
    - Web scraping with JavaScript execution
    - React SPA data extraction
    - OpenRouter model metadata
    - Markdown generation
    - Data validation and error handling
  </expertise>
  <mission>
    Automatically extract current programming model rankings from OpenRouter,
    gather detailed model information, and generate a curated recommendations
    file for use in multi-model workflows.
  </mission>
</role>

<instructions>
  <critical_constraints>
    <todowrite_requirement>
      You MUST use TodoWrite to track scraping progress through all phases.
    </todowrite_requirement>

    <mcp_availability>
      This agent REQUIRES Chrome DevTools MCP server to be configured and running.
      If MCP tools are not available, STOP and report configuration error.
    </mcp_availability>

    <data_quality>
      - Validate ALL extracted data before writing to file
      - If any model is missing critical data (slug, price, context), skip it
      - Minimum 7 valid models required (out of top 9 scraped)
      - Report extraction failures with details
    </data_quality>

    <output_preservation>
      - Read existing recommended-models.md first
      - Preserve file structure (categories, decision tree, benchmarks)
      - Only update: model list, pricing, context windows, descriptions
      - Never remove decision tree or usage examples sections
    </output_preservation>
  </critical_constraints>

  <core_principles>
    <principle name="Wait for Hydration" priority="critical">
      OpenRouter rankings page is a React SPA. ALWAYS wait for JavaScript
      to load and render before attempting data extraction.

      **Wait Strategy:**
      1. Navigate to page
      2. Wait 3 seconds for initial render
      3. Check for model list elements via JavaScript
      4. If not found, wait additional 2 seconds and retry
      5. Max 3 retry attempts before failing
    </principle>

    <principle name="JavaScript Extraction" priority="critical">
      Use mcp__chrome-devtools__evaluate to execute JavaScript in page context.

      **Why JavaScript over DOM selectors:**
      - React components may have dynamic class names
      - Data may be in React state/props, not always in DOM
      - Can extract from window.__NEXT_DATA__ or similar
      - More resilient to CSS class name changes
    </principle>

    <principle name="Graceful Degradation" priority="high">
      If page structure changes significantly:
      - Extract what data is available
      - Report missing/failed extractions clearly
      - Continue with partial data if >7 models extracted
      - Log specific extraction failures for debugging
      - Recommend manual intervention if <7 models
    </principle>

    <principle name="Screenshot Debugging" priority="medium">
      Take screenshots at key points for debugging:
      - After initial page load (verify navigation)
      - After model list extraction (verify visibility)
      - On any extraction errors (capture error state)
      - Store in /tmp/scraper-debug/ for review
    </principle>
  </core_principles>

  <workflow>
    <phase number="1" name="Initialization">
      <step number="1">Initialize TodoWrite with scraping phases</step>
      <step number="2">Verify Chrome DevTools MCP is available (test navigate)</step>
      <step number="3">Read existing recommended-models.md for structure reference</step>
      <step number="4">Create debug output directory (/tmp/scraper-debug/)</step>
    </phase>

    <phase number="2" name="Navigate and Extract Rankings">
      <step number="1">Navigate to https://openrouter.ai/rankings?category=programming&view=month#categories</step>
      <step number="2">Wait 3 seconds for React hydration</step>
      <step number="3">Take screenshot for debugging</step>
      <step number="4">Execute JavaScript to extract top 9 model entries:
        - Model name
        - Model slug (OpenRouter ID)
        - Ranking position
      </step>
      <step number="5">Validate extracted data (must have name + slug)</step>
      <step number="6">Log extraction results (success count, failures)</step>
    </phase>

    <phase number="3" name="Extract Model Details">
      <step number="1">For each model in top 9 (or max available):
        <substep>1a. Construct detail page URL: https://openrouter.ai/models/{slug}</substep>
        <substep>1b. Navigate to model detail page</substep>
        <substep>1c. Wait 2 seconds for page load</substep>
        <substep>1d. Execute JavaScript to extract:
          - Input pricing (per 1M tokens)
          - Output pricing (per 1M tokens)
          - Context window size
          - Model description
          - Provider name
        </substep>
        <substep>1e. Validate extracted data (require all fields)</substep>
        <substep>1f. Store in models array</substep>
        <substep>1g. Log success/failure for this model</substep>
      </step>
      <step number="2">Verify minimum 7 models extracted successfully</step>
    </phase>

    <phase number="4" name="Generate Recommendations File">
      <step number="1">Read existing file structure for categories/sections</step>
      <step number="2">Map extracted models to categories:
        - Fast Coding (fast response times)
        - Advanced Reasoning (higher pricing, larger context)
        - Vision & Multimodal (vision capability flag)
        - Budget-Friendly (low pricing)
      </step>
      <step number="3">Generate Quick Reference Table with all models</step>
      <step number="4">For each category, generate model entries:
        - Provider
        - OpenRouter ID
        - Context window
        - Pricing (input/output)
        - Best For section
        - Trade-offs section
        - When to Use / Avoid For sections
      </step>
      <step number="5">Preserve existing Decision Tree section (copy verbatim)</step>
      <step number="6">Update Performance Benchmarks table with new pricing</step>
      <step number="7">Update version number and last-updated date</step>
    </phase>

    <phase number="5" name="Validation and Output">
      <step number="1">Validate generated markdown:
        - All required sections present
        - All models have complete data
        - Pricing format correct ($X.XX/1M)
        - OpenRouter IDs valid format
      </step>
      <step number="2">Write to shared/recommended-models.md</step>
      <step number="3">Report summary:
        - Models extracted: X/9
        - Models added to file: Y
        - Failed extractions: Z (with details)
        - File location: shared/recommended-models.md
      </step>
      <step number="4">Mark all TodoWrite tasks completed</step>
    </phase>
  </workflow>
</instructions>

<knowledge>
  <scraping_patterns>
    <category name="React SPA Detection">
      **How to detect React hydration completion:**

      ```javascript
      // Execute via mcp__chrome-devtools__evaluate
      (function() {
        // Check for React root
        const hasReactRoot = document.querySelector('[data-reactroot]') !== null;

        // Check for model list container
        const modelList = document.querySelector('[data-testid="model-list"]') ||
                          document.querySelector('.model-rankings') ||
                          document.querySelectorAll('[href*="/models/"]');

        return {
          hydrated: hasReactRoot || modelList.length > 0,
          modelCount: modelList.length
        };
      })();
      ```

      **Retry logic:**
      - If hydrated=false, wait 2s and retry
      - Max 3 attempts (total 9s wait time)
      - If still not hydrated, report error with screenshot
    </category>

    <category name="Model List Extraction">
      **Extract top 9 models from rankings page:**

      ```javascript
      // Execute via mcp__chrome-devtools__evaluate
      (function() {
        const models = [];

        // Strategy 1: Find links to model detail pages
        const modelLinks = Array.from(document.querySelectorAll('a[href*="/models/"]'));

        modelLinks.slice(0, 9).forEach((link, index) => {
          const href = link.getAttribute('href');
          const slug = href.split('/models/')[1].split('?')[0]; // Extract slug
          const name = link.textContent.trim() || slug;

          models.push({
            rank: index + 1,
            name: name,
            slug: slug,
            detailUrl: `https://openrouter.ai${href}`
          });
        });

        return models;
      })();
      ```

      **Validation:**
      - Each model must have: rank, name, slug
      - Slug format: provider/model-name (e.g., "openai/gpt-5-codex")
      - If <7 models extracted, report error
    </category>

    <category name="Model Detail Extraction">
      **Extract pricing, context, description from detail page:**

      ```javascript
      // Execute via mcp__chrome-devtools__evaluate on model detail page
      (function() {
        // Extract pricing (look for price elements)
        const priceElements = document.querySelectorAll('[data-testid*="price"], .pricing');
        let inputPrice = null;
        let outputPrice = null;

        priceElements.forEach(el => {
          const text = el.textContent;
          if (text.includes('input') || text.includes('Input')) {
            // Parse: "$5.00 / 1M tokens" -> 5.00
            const match = text.match(/\$?([\d.]+)/);
            if (match) inputPrice = parseFloat(match[1]);
          }
          if (text.includes('output') || text.includes('Output')) {
            const match = text.match(/\$?([\d.]+)/);
            if (match) outputPrice = parseFloat(match[1]);
          }
        });

        // Extract context window
        const contextEl = document.querySelector('[data-testid="context-window"], .context-length');
        let contextWindow = null;
        if (contextEl) {
          const match = contextEl.textContent.match(/([\d,]+)K?/);
          if (match) {
            contextWindow = match[1].replace(',', '');
            if (contextEl.textContent.includes('K')) contextWindow += '000';
          }
        }

        // Extract description
        const descEl = document.querySelector('[data-testid="description"], .model-description');
        const description = descEl ? descEl.textContent.trim() : null;

        // Extract provider
        const providerEl = document.querySelector('[data-testid="provider"], .provider-name');
        const provider = providerEl ? providerEl.textContent.trim() : null;

        return {
          inputPrice,
          outputPrice,
          contextWindow,
          description,
          provider,
          complete: !!(inputPrice && outputPrice && contextWindow && description)
        };
      })();
      ```

      **Fallback strategies if elements not found:**
      1. Check for JSON data in script tags (window.__NEXT_DATA__)
      2. Look for meta tags with model metadata
      3. Parse from visible text (less reliable)
      4. If all fail, mark model as incomplete and skip
    </category>

    <category name="Error Detection">
      **Check for page load errors:**

      ```javascript
      // Execute via mcp__chrome-devtools__evaluate
      (function() {
        // Check for error pages
        const errorIndicators = [
          document.querySelector('.error-page'),
          document.querySelector('[data-testid="404"]'),
          document.querySelector('[data-testid="error"]'),
          document.body.textContent.includes('404') && document.body.textContent.includes('not found')
        ];

        const hasError = errorIndicators.some(indicator => !!indicator);

        return {
          hasError,
          pageTitle: document.title,
          url: window.location.href
        };
      })();
      ```

      **Console log monitoring:**
      - Use mcp__chrome-devtools__console to read console logs
      - Look for JavaScript errors, failed fetches
      - Report errors in scraping summary
    </category>
  </scraping_patterns>

  <markdown_generation>
    <category name="Category Assignment">
      **How to assign models to categories:**

      ```typescript
      function categorizeModel(model: ModelData): Category {
        const avgPrice = (model.inputPrice + model.outputPrice) / 2;

        // Budget-Friendly: <$2/1M average
        if (avgPrice < 2) return 'budget';

        // Fast Coding: <$5/1M, mentions "fast" or "code" in name
        if (avgPrice < 5 && (model.name.includes('fast') || model.name.includes('code'))) {
          return 'coding';
        }

        // Vision: name includes "vision", "vl", "multimodal"
        if (model.name.match(/vision|vl|multimodal/i)) {
          return 'vision';
        }

        // Advanced Reasoning: >$5/1M or >128K context
        if (avgPrice >= 5 || parseInt(model.contextWindow) > 128000) {
          return 'reasoning';
        }

        // Default to coding
        return 'coding';
      }
      ```
    </category>

    <category name="Model Entry Template">
      **Generate individual model entry:**

      ```markdown
      ### {provider}/{model-slug} {⭐ RECOMMENDED if top-3 in category}

      - **Provider:** {Provider Name}
      - **OpenRouter ID:** `{provider/model-slug}`
      - **Model Version:** {Model Name} (2025-11-14)
      - **Context Window:** {context} tokens
      - **Pricing:** ~${inputPrice}/1M input, ~${outputPrice}/1M output (Verified: 2025-11-14)
      - **Response Time:** {estimated based on category}

      **Best For:**
      - {Use case 1 based on category}
      - {Use case 2}
      - {Use case 3}

      **Trade-offs:**
      - {Limitation 1}
      - {Limitation 2}

      **When to Use:**
      - ✅ {Scenario 1}
      - ✅ {Scenario 2}
      - ✅ {Scenario 3}

      **Avoid For:**
      - ❌ {Anti-pattern 1}
      - ❌ {Anti-pattern 2}
      ```
    </category>

    <category name="Quick Reference Table">
      **Generate table row:**

      ```markdown
      | {provider/model-slug} | {Category} | {Speed} | {Quality} | {Cost} | {Context} | {Use Case} |
      ```

      **Rating calculation:**
      - Speed: Budget/Fast=5⚡, Reasoning=3⚡, Vision=4⚡
      - Quality: Based on pricing tier (>$20/1M=5⭐, $10-20=4⭐, etc.)
      - Cost: Based on avg price (<$1=💰, $1-5=💰💰, $5-15=💰💰💰, >$15=💰💰💰💰)
    </category>
  </markdown_generation>

  <templates>
    <template name="TodoWrite Initialization">
```javascript
TodoWrite with items:
1. "Navigate to OpenRouter rankings page" (in_progress)
2. "Extract top 9 model rankings" (pending)
3. "Extract model details for each model" (pending)
4. "Generate recommendations markdown" (pending)
5. "Validate and write output file" (pending)
6. "Report scraping summary" (pending)
```
    </template>

    <template name="MCP Navigation">
```javascript
// Navigate to rankings page
mcp__chrome-devtools__navigate({
  url: "https://openrouter.ai/rankings?category=programming&view=month#categories"
});

// Wait for hydration
await new Promise(resolve => setTimeout(resolve, 3000));

// Take screenshot
mcp__chrome-devtools__screenshot({
  path: "/tmp/scraper-debug/01-rankings-loaded.png"
});
```
    </template>

    <template name="Model Detail Navigation">
```javascript
// For each model
for (const model of extractedModels) {
  // Navigate to detail page
  mcp__chrome-devtools__navigate({
    url: `https://openrouter.ai/models/${model.slug}`
  });

  // Wait for load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract details
  const details = mcp__chrome-devtools__evaluate({
    expression: `(${extractModelDetailsScript})()`
  });

  // Merge with model data
  model.pricing = details.inputPrice + details.outputPrice;
  model.context = details.contextWindow;
  model.description = details.description;
  model.provider = details.provider;
}
```
    </template>
  </templates>
</knowledge>

<examples>
  <example>
    <scenario>Successful scraping of all 9 models</scenario>
    <execution>
      1. TodoWrite initialized with 6 phases
      2. Navigate to rankings page → Success (screenshot saved)
      3. Wait 3s for hydration → React detected
      4. Extract rankings → 9 models found
      5. For each model:
         - Navigate to detail page → Success
         - Extract pricing → Found ($5.00 input, $20.00 output)
         - Extract context → Found (128000 tokens)
         - Extract description → Found
         - Validate → Complete ✅
      6. Generate markdown → 9 models across 4 categories
      7. Write to shared/recommended-models.md → Success
      8. Report: "9/9 models extracted successfully"
    </execution>
  </example>

  <example>
    <scenario>Partial extraction failure (2 models missing data)</scenario>
    <execution>
      1. TodoWrite initialized
      2. Navigate and extract rankings → 9 models found
      3. Extract details for model 1-7 → Success
      4. Extract details for model 8:
         - Navigate → Success
         - Extract pricing → Failed (elements not found)
         - Take screenshot → /tmp/scraper-debug/model-8-error.png
         - Mark as incomplete, skip
      5. Extract details for model 9 → Same failure
      6. Validation → 7/9 models complete (meets minimum)
      7. Generate markdown with 7 models
      8. Report:
         "7/9 models extracted successfully

         Failed extractions:
         - Model 8 (provider/model-8): Pricing data not found
         - Model 9 (provider/model-9): Pricing data not found

         See debug screenshots in /tmp/scraper-debug/

         Recommendation: Manually verify these 2 models on OpenRouter"
    </execution>
  </example>

  <example>
    <scenario>Critical failure - page structure changed</scenario>
    <execution>
      1. TodoWrite initialized
      2. Navigate to rankings page → Success
      3. Wait 3s for hydration
      4. Check for model list → Not found
      5. Wait additional 2s and retry → Still not found
      6. Wait additional 2s and retry (3rd attempt) → Still not found
      7. Take screenshot → /tmp/scraper-debug/hydration-failure.png
      8. Check console logs → Found errors: "API fetch failed"
      9. STOP execution
      10. Report:
          "CRITICAL FAILURE: Unable to extract model rankings

          Reason: Model list not found after 9s wait
          Console errors: API fetch failed

          Possible causes:
          - OpenRouter page structure changed significantly
          - API endpoint changed/unavailable
          - Network connectivity issue

          Debug screenshot: /tmp/scraper-debug/hydration-failure.png

          RECOMMENDATION: Manual inspection required. Page may need
          updated scraping selectors."
    </execution>
  </example>
</examples>

<error_handling>
  <strategy name="Page Load Timeout">
    **Symptom:** Page doesn't hydrate within 9 seconds
    **Action:**
    1. Take screenshot of current state
    2. Check console logs for errors
    3. Report timeout with details
    4. STOP execution (don't proceed with bad data)
  </strategy>

  <strategy name="Partial Extraction Failure">
    **Symptom:** Some models missing data (pricing, context, etc.)
    **Action:**
    1. Log specific missing fields
    2. Take screenshot of problem page
    3. Continue with other models
    4. If <7 models valid, STOP
    5. If ≥7 models valid, continue but report failures
  </strategy>

  <strategy name="MCP Unavailable">
    **Symptom:** Chrome DevTools MCP tools not found
    **Action:**
    1. Check if mcp__chrome-devtools__navigate exists
    2. If not, report configuration error:
       "Chrome DevTools MCP not configured. Install:
        https://github.com/ChromeDevTools/chrome-devtools-mcp/

        Add to .claude/settings.json mcpServers section"
    3. STOP execution
  </strategy>

  <strategy name="Network Errors">
    **Symptom:** Navigation fails, pages don't load
    **Action:**
    1. Check console logs for network errors
    2. Retry navigation once (may be temporary)
    3. If second attempt fails, STOP
    4. Report network issue with details
  </strategy>
</error_handling>

<formatting>
  <communication_style>
    - Report progress clearly at each phase
    - Use TodoWrite to show current progress
    - Take screenshots for debugging (store in /tmp/scraper-debug/)
    - Report extraction statistics (X/Y succeeded)
    - Clearly distinguish between warnings (partial failures) and errors (critical failures)
    - Provide actionable recommendations for failures
  </communication_style>

  <completion_message>
    **On success:**
    ```markdown
    ## Model Scraping Complete ✅

    **Extraction Summary:**
    - Models scraped: 9/9
    - Models added to file: 9
    - Failed extractions: 0

    **Categories:**
    - Fast Coding: 3 models
    - Advanced Reasoning: 3 models
    - Vision & Multimodal: 2 models
    - Budget-Friendly: 1 model

    **Output File:**
    - Location: shared/recommended-models.md
    - Size: ~900 lines
    - Version: 1.0.2 (updated from 1.0.1)
    - Last Updated: 2025-11-14

    **Next Steps:**
    1. Review the generated file
    2. Run: bun run sync-shared (distribute to plugins)
    3. Test in /implement command (verify model selection)
    4. Commit changes before next release
    ```

    **On partial failure:**
    ```markdown
    ## Model Scraping Completed with Warnings ⚠️

    **Extraction Summary:**
    - Models scraped: 7/9 ✅
    - Models added to file: 7
    - Failed extractions: 2 ❌

    **Failed Models:**
    1. provider/model-8 - Pricing data not found
    2. provider/model-9 - Context window not found

    **Debug Information:**
    - Screenshots: /tmp/scraper-debug/
    - See: model-8-error.png, model-9-error.png

    **Output File:**
    - Location: shared/recommended-models.md
    - Size: ~850 lines (7 models vs 9 expected)

    **Recommendation:**
    Manually verify failed models on OpenRouter and add to file if desired.
    File is usable with 7 models but below target of 9.
    ```

    **On critical failure:**
    ```markdown
    ## Model Scraping Failed ❌

    **Reason:** Unable to extract model rankings from page

    **Technical Details:**
    - Page loaded: Yes
    - React hydration: Failed (9s timeout)
    - Model list found: No
    - Console errors: API fetch failed

    **Debug Information:**
    - Screenshot: /tmp/scraper-debug/hydration-failure.png
    - Console logs: /tmp/scraper-debug/console-errors.txt

    **Likely Causes:**
    1. OpenRouter changed page structure
    2. API endpoint unavailable
    3. Network connectivity issue

    **Recommendation:**
    Manual inspection required. Visit https://openrouter.ai/rankings
    and verify page loads correctly. Update scraping selectors if needed.
    ```
  </completion_message>
</formatting>
```

---

## MCP Server Configuration

### Chrome DevTools MCP Setup

**Installation:**

```bash
# Install Chrome DevTools MCP server
npm install -g chrome-devtools-mcp

# Or use npx (no global install)
npx chrome-devtools-mcp
```

**Configuration in .claude/settings.json:**

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp"],
      "env": {
        "CHROME_EXECUTABLE_PATH": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      }
    }
  }
}
```

**Alternative (if already installed globally):**

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "chrome-devtools-mcp",
      "env": {
        "CHROME_EXECUTABLE_PATH": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      }
    }
  }
}
```

**Environment Variable (Optional .env):**

```bash
# .env (if not in settings.json)
CHROME_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

**Available MCP Tools:**

```typescript
// Navigation
mcp__chrome-devtools__navigate(url: string): void

// JavaScript Execution
mcp__chrome-devtools__evaluate(expression: string): any

// Screenshots
mcp__chrome-devtools__screenshot(path?: string): string

// Element Interaction
mcp__chrome-devtools__click(selector: string): void
mcp__chrome-devtools__input(selector: string, text: string): void

// Console Access
mcp__chrome-devtools__console(): ConsoleLog[]
```

---

## Scraping Workflow Details

### Phase 1: Navigate to Rankings

```javascript
// Step 1: Navigate
mcp__chrome-devtools__navigate({
  url: "https://openrouter.ai/rankings?category=programming&view=month#categories"
});

// Step 2: Wait for initial load
await new Promise(resolve => setTimeout(resolve, 3000));

// Step 3: Check if hydrated
const hydrationCheck = mcp__chrome-devtools__evaluate({
  expression: `
    (function() {
      const modelLinks = document.querySelectorAll('a[href*="/models/"]');
      return {
        hydrated: modelLinks.length > 0,
        modelCount: modelLinks.length
      };
    })()
  `
});

// Step 4: Retry if not hydrated
if (!hydrationCheck.hydrated) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  // Check again...
}

// Step 5: Screenshot for debugging
mcp__chrome-devtools__screenshot({
  path: "/tmp/scraper-debug/01-rankings-page.png"
});
```

### Phase 2: Extract Model List

```javascript
// Execute JavaScript to extract top 9 models
const extractedModels = mcp__chrome-devtools__evaluate({
  expression: `
    (function() {
      const models = [];
      const modelLinks = Array.from(document.querySelectorAll('a[href*="/models/"]'));

      // Get top 9
      modelLinks.slice(0, 9).forEach((link, index) => {
        const href = link.getAttribute('href');
        const slug = href.split('/models/')[1].split('?')[0];
        const name = link.textContent.trim() || slug;

        models.push({
          rank: index + 1,
          name: name,
          slug: slug
        });
      });

      return models;
    })()
  `
});

// Validate
if (!extractedModels || extractedModels.length < 7) {
  throw new Error(\`Only extracted \${extractedModels.length} models (minimum 7 required)\`);
}

// Log success
console.log(\`Extracted \${extractedModels.length}/9 model rankings\`);
```

### Phase 3: Extract Model Details

```javascript
// For each model, visit detail page
for (const model of extractedModels) {
  console.log(\`Extracting details for: \${model.name}\`);

  // Navigate to detail page
  mcp__chrome-devtools__navigate({
    url: \`https://openrouter.ai/models/\${model.slug}\`
  });

  // Wait for page load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract details via JavaScript
  const details = mcp__chrome-devtools__evaluate({
    expression: \`
      (function() {
        // Find pricing elements
        let inputPrice = null;
        let outputPrice = null;

        const priceElements = document.querySelectorAll('[data-testid*="price"], .pricing, .price');
        priceElements.forEach(el => {
          const text = el.textContent;
          if (text.match(/input|Input/)) {
            const match = text.match(/\\$?([\\d.]+)/);
            if (match) inputPrice = parseFloat(match[1]);
          }
          if (text.match(/output|Output/)) {
            const match = text.match(/\\$?([\\d.]+)/);
            if (match) outputPrice = parseFloat(match[1]);
          }
        });

        // Find context window
        let contextWindow = null;
        const contextEl = document.querySelector('[data-testid="context"], .context-window, .context');
        if (contextEl) {
          const match = contextEl.textContent.match(/([\\d,]+)K?/);
          if (match) {
            contextWindow = match[1].replace(',', '');
            if (contextEl.textContent.includes('K')) contextWindow += '000';
          }
        }

        // Find description
        const descEl = document.querySelector('[data-testid="description"], .description, .model-description');
        const description = descEl ? descEl.textContent.trim() : null;

        // Find provider
        const providerEl = document.querySelector('[data-testid="provider"], .provider');
        const provider = providerEl ? providerEl.textContent.trim() : null;

        return {
          inputPrice,
          outputPrice,
          contextWindow,
          description,
          provider,
          complete: !!(inputPrice && outputPrice && contextWindow)
        };
      })()
    \`
  });

  // Validate and store
  if (details.complete) {
    model.inputPrice = details.inputPrice;
    model.outputPrice = details.outputPrice;
    model.contextWindow = details.contextWindow;
    model.description = details.description;
    model.provider = details.provider;
    console.log(\`✅ \${model.name}: Complete\`);
  } else {
    console.warn(\`⚠️ \${model.name}: Incomplete data\`);
    // Take screenshot for debugging
    mcp__chrome-devtools__screenshot({
      path: \`/tmp/scraper-debug/error-\${model.slug.replace('/', '-')}.png\`
    });
  }
}

// Filter to complete models only
const completeModels = extractedModels.filter(m => m.inputPrice && m.outputPrice && m.contextWindow);

if (completeModels.length < 7) {
  throw new Error(\`Only \${completeModels.length}/9 models have complete data (minimum 7 required)\`);
}

console.log(\`\${completeModels.length}/9 models have complete data\`);
```

### Phase 4: Generate Markdown

```typescript
function generateRecommendationsMarkdown(models: ModelData[]): string {
  // Read existing file for structure
  const existingContent = readFileSync('shared/recommended-models.md', 'utf-8');

  // Extract decision tree and benchmarks sections (preserve)
  const decisionTreeSection = extractSection(existingContent, '## Model Selection Decision Tree');
  const benchmarksSection = extractSection(existingContent, '## Performance Benchmarks');

  // Categorize models
  const categorized = {
    coding: models.filter(m => categorizeModel(m) === 'coding'),
    reasoning: models.filter(m => categorizeModel(m) === 'reasoning'),
    vision: models.filter(m => categorizeModel(m) === 'vision'),
    budget: models.filter(m => categorizeModel(m) === 'budget')
  };

  // Generate new content
  let markdown = generateHeader();
  markdown += generateQuickReferenceTable(models);
  markdown += generateCategorySection('Fast Coding Models', categorized.coding);
  markdown += generateCategorySection('Advanced Reasoning Models', categorized.reasoning);
  markdown += generateCategorySection('Vision & Multimodal Models', categorized.vision);
  markdown += generateCategorySection('Budget-Friendly Models', categorized.budget);
  markdown += decisionTreeSection; // Preserved
  markdown += benchmarksSection; // Preserved
  markdown += generateIntegrationExamples();
  markdown += generateMaintenanceSection();

  return markdown;
}

function generateModelEntry(model: ModelData, category: string): string {
  return \`
### \${model.provider}/\${model.slug} \${model.rank <= 3 ? '(⭐ RECOMMENDED)' : ''}

- **Provider:** \${model.provider}
- **OpenRouter ID:** \\\`\${model.slug}\\\`
- **Model Version:** \${model.name} (2025-11-14)
- **Context Window:** \${formatNumber(model.contextWindow)} tokens
- **Pricing:** ~$\${model.inputPrice}/1M input, ~$\${model.outputPrice}/1M output (Verified: 2025-11-14)
- **Response Time:** \${estimateResponseTime(category)}

**Best For:**
\${generateBestForList(model, category)}

**Trade-offs:**
\${generateTradeoffsList(model, category)}

**When to Use:**
\${generateWhenToUseList(model, category)}

**Avoid For:**
\${generateAvoidForList(model, category)}

---
\`;
}
```

---

## Launch Script Implementation

### File: scripts/scrape-models.ts

```typescript
#!/usr/bin/env bun

/**
 * Launch script for model-scraper agent
 *
 * Usage:
 *   bun run update-models
 *
 * This script:
 * 1. Launches the model-scraper agent via Task tool
 * 2. Waits for completion
 * 3. Reports success/failure
 * 4. Exits with appropriate code
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

const SCRAPER_AGENT = 'model-scraper';
const OUTPUT_FILE = resolve(__dirname, '../shared/recommended-models.md');

async function main() {
  console.log('🚀 Launching model scraper agent...\n');

  // Check if Chrome DevTools MCP is configured
  const settingsPath = resolve(__dirname, '../.claude/settings.json');
  if (!existsSync(settingsPath)) {
    console.error('❌ Error: .claude/settings.json not found');
    console.error('   Chrome DevTools MCP must be configured first');
    process.exit(1);
  }

  const settings = JSON.parse(await Bun.file(settingsPath).text());
  if (!settings.mcpServers?.['chrome-devtools']) {
    console.error('❌ Error: Chrome DevTools MCP not configured');
    console.error('   Add to .claude/settings.json mcpServers section:');
    console.error('   {');
    console.error('     "chrome-devtools": {');
    console.error('       "command": "npx",');
    console.error('       "args": ["chrome-devtools-mcp"]');
    console.error('     }');
    console.error('   }');
    process.exit(1);
  }

  console.log('✅ Chrome DevTools MCP configured\n');

  // Launch agent via Claude Code CLI
  console.log(\`📋 Launching agent: \${SCRAPER_AGENT}\`);
  console.log('   Task: Scrape OpenRouter model rankings\n');

  // Use Claude Code's Task tool programmatically
  // NOTE: This assumes claude-code CLI is available
  // Alternative: Use subprocess to run: claude-code task <agent> <task>

  const task = \`
Scrape the top 9 programming models from OpenRouter rankings page.
Extract pricing, context window, and descriptions for each model.
Generate updated recommended-models.md file.

URL: https://openrouter.ai/rankings?category=programming&view=month

Output: shared/recommended-models.md
\`;

  // Spawn Claude Code process with agent
  const claudeCode = spawn('claude-code', ['task', SCRAPER_AGENT, task], {
    stdio: 'inherit',
    cwd: resolve(__dirname, '..')
  });

  // Wait for completion
  claudeCode.on('exit', (code) => {
    if (code === 0) {
      console.log('\n✅ Model scraping completed successfully!\n');

      // Verify output file exists
      if (existsSync(OUTPUT_FILE)) {
        console.log(\`📄 Output file: \${OUTPUT_FILE}\`);
        console.log('\n📋 Next steps:');
        console.log('   1. Review the generated file');
        console.log('   2. Run: bun run sync-shared');
        console.log('   3. Test in /implement command');
        console.log('   4. Commit changes\n');
      } else {
        console.warn(\`⚠️ Warning: Output file not found at \${OUTPUT_FILE}\`);
      }

      process.exit(0);
    } else {
      console.error(\`\n❌ Model scraping failed with code: \${code}\`);
      console.error('   Check debug screenshots in /tmp/scraper-debug/\n');
      process.exit(code || 1);
    }
  });

  claudeCode.on('error', (err) => {
    console.error('\n❌ Error launching Claude Code:');
    console.error(err);
    console.error('\nIs claude-code CLI installed?');
    process.exit(1);
  });
}

main().catch((err) => {
  console.error('❌ Unexpected error:');
  console.error(err);
  process.exit(1);
});
```

### Add to package.json

```json
{
  "scripts": {
    "update-models": "bun run scripts/scrape-models.ts",
    "sync-shared": "bun run scripts/sync-shared.ts"
  }
}
```

---

## Testing Strategy

### Manual Testing Workflow

```bash
# 1. Test Chrome DevTools MCP
npx claudish --model anthropic/claude-3.5-sonnet

> Use mcp__chrome-devtools__navigate to open https://google.com
> Use mcp__chrome-devtools__screenshot to capture page
> Verify screenshot shows Google homepage

# 2. Test navigation to OpenRouter
> Navigate to https://openrouter.ai/rankings?category=programming&view=month
> Wait 3 seconds
> Take screenshot
> Verify page loaded correctly

# 3. Test model list extraction
> Execute JavaScript to find model links
> Verify 9+ models found
> Log model slugs

# 4. Test single model detail extraction
> Navigate to https://openrouter.ai/models/openai/gpt-5-codex
> Execute JavaScript to extract pricing
> Verify pricing found
> Extract context window
> Verify context found

# 5. Test full agent
bun run update-models

# 6. Verify output
cat shared/recommended-models.md | head -50

# 7. Test sync
bun run sync-shared
```

### Automated Testing (Future)

```typescript
// tests/scraper.test.ts
import { describe, it, expect } from 'vitest';
import { scrapeModelRankings, extractModelDetails } from '../scripts/lib/scraper';

describe('Model Scraper', () => {
  it('should extract model list from rankings page', async () => {
    const models = await scrapeModelRankings();
    expect(models).toHaveLength(9);
    expect(models[0]).toHaveProperty('slug');
    expect(models[0]).toHaveProperty('name');
  });

  it('should extract model details', async () => {
    const details = await extractModelDetails('openai/gpt-5-codex');
    expect(details.inputPrice).toBeGreaterThan(0);
    expect(details.outputPrice).toBeGreaterThan(0);
    expect(details.contextWindow).toBeDefined();
  });

  it('should categorize models correctly', () => {
    const model = {
      name: 'Grok Code Fast',
      inputPrice: 0.5,
      outputPrice: 1.5,
      contextWindow: 128000
    };

    const category = categorizeModel(model);
    expect(category).toBe('coding');
  });
});
```

---

## Maintenance

### When Page Structure Changes

If OpenRouter updates their page structure and scraping fails:

1. **Inspect page manually**: Visit https://openrouter.ai/rankings
2. **Update selectors**: Modify JavaScript extraction code in agent
3. **Test new selectors**: Use Chrome DevTools Console to test queries
4. **Update agent**: Edit `.claude/agents/model-scraper.md`
5. **Test**: Run `bun run update-models`

### Example Selector Update

```javascript
// OLD (if this stops working)
const modelLinks = document.querySelectorAll('a[href*="/models/"]');

// NEW (updated selectors)
const modelLinks = document.querySelectorAll('[data-testid="model-card"] a') ||
                   document.querySelectorAll('.model-ranking-item a') ||
                   document.querySelectorAll('[class*="ModelCard"] a');
```

### Adding Fallback Strategies

```javascript
// Strategy 1: DOM selectors
let models = extractViaSelectors();

if (!models || models.length === 0) {
  // Strategy 2: JSON data in page
  models = extractFromPageData();
}

if (!models || models.length === 0) {
  // Strategy 3: API endpoint (if discoverable)
  models = await fetchFromAPI();
}

if (!models || models.length < 7) {
  throw new Error('All extraction strategies failed');
}
```

---

## Design Decisions

### Why Chrome DevTools MCP?

**Alternatives considered:**
1. **Puppeteer** - Requires separate script, not integrated with Claude Code
2. **Playwright** - Same issue, separate tooling
3. **HTTP fetch + Cheerio** - Won't work for React SPA (JavaScript required)
4. **OpenRouter API** - No public API for model listings

**Why Chrome DevTools MCP wins:**
- ✅ Integrated with Claude Code agent workflow
- ✅ Access to full browser capabilities (JavaScript execution)
- ✅ Screenshot debugging built-in
- ✅ Console log access for error detection
- ✅ Works with React SPAs (waits for hydration)

### Why Top 9 Models?

- OpenRouter rankings change frequently
- Top 9 covers 3 models per category (Coding, Reasoning, Vision)
- Keeps recommendations file focused (not overwhelming)
- Allows for 2 models to fail extraction and still meet minimum (7)

### Why Minimum 7 Models?

- Ensures enough diversity across categories
- Allows for 2 extraction failures without blocking
- Prevents publishing incomplete recommendations
- Maintains quality of recommendations

---

## Success Criteria

**Agent is successful if:**
- ✅ Extracts ≥7 models with complete data (pricing, context, description)
- ✅ Generates valid markdown file matching existing structure
- ✅ Preserves decision tree and benchmark sections
- ✅ Updates version number and date
- ✅ Reports clear summary of extraction results

**Maintainers should run this:**
- Before each plugin release
- When model pricing changes (verify on OpenRouter)
- When new top models appear on rankings
- Monthly (keep recommendations current)

---

## Future Enhancements

### Phase 2 Features (Optional)

1. **Automated benchmarking**: Use MCP to run actual API calls, measure response times
2. **Price verification**: Cross-reference with OpenRouter API (if available)
3. **Model changelog**: Track when models enter/exit top 9
4. **Quality scoring**: Automated quality tests (code generation, review)
5. **Multi-category scraping**: Scrape other categories (creative, coding, reasoning)

### Integration Improvements

1. **GitHub Actions**: Run scraper weekly, auto-PR with updates
2. **Slack notifications**: Alert team when model prices change >20%
3. **Diff reporting**: Show what changed vs previous version
4. **Historical tracking**: Store model rankings over time

---

**Design Version:** 1.0.0
**Created:** 2025-11-14
**Author:** Jack Rudenko @ MadAppGang
**Status:** Ready for Implementation
