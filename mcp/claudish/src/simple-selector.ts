import { createInterface } from "readline";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { OpenRouterModel } from "./types.js";
import { loadModelInfo, getAvailableModels } from "./model-loader.js";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache paths
const ALL_MODELS_JSON_PATH = join(__dirname, "../all-models.json");
const CACHE_MAX_AGE_DAYS = 2;

// Options for model selector
export interface ModelSelectorOptions {
  freeOnly?: boolean;
}

interface EnhancedModelData {
  id: string;
  name: string;
  description: string;
  provider: string;
  pricing?: {
    input: string;
    output: string;
    average: string;
  };
  context?: string;
  supportsTools?: boolean;
  supportsReasoning?: boolean;
  supportsVision?: boolean;
}

/**
 * Load enhanced model data from recommended-models.json
 */
function loadEnhancedModels(): EnhancedModelData[] {
  const jsonPath = join(__dirname, "../recommended-models.json");

  if (existsSync(jsonPath)) {
    try {
      const jsonContent = readFileSync(jsonPath, "utf-8");
      const data = JSON.parse(jsonContent);
      return data.models || [];
    } catch {
      return [];
    }
  }
  return [];
}

// Curated list of well-known providers for free models
const TRUSTED_FREE_PROVIDERS = [
  "google",
  "openai",
  "x-ai",
  "deepseek",
  "qwen",
  "alibaba",
  "meta-llama",
  "microsoft",
  "mistralai",
  "nvidia",
  "cohere",
];

/**
 * Load free models from OpenRouter (from cache or fetch)
 * Only includes models from well-known, trusted providers
 */
async function loadFreeModels(): Promise<EnhancedModelData[]> {
  let allModels: any[] = [];

  // Try to load from cache first
  if (existsSync(ALL_MODELS_JSON_PATH)) {
    try {
      const cacheData = JSON.parse(readFileSync(ALL_MODELS_JSON_PATH, "utf-8"));
      const lastUpdated = new Date(cacheData.lastUpdated);
      const now = new Date();
      const ageInDays = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

      if (ageInDays <= CACHE_MAX_AGE_DAYS) {
        allModels = cacheData.models;
      }
    } catch {
      // Cache error, will fetch
    }
  }

  // Fetch if no cache or stale
  if (allModels.length === 0) {
    console.error("🔄 Fetching models from OpenRouter...");
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models");
      if (!response.ok) throw new Error(`API returned ${response.status}`);

      const data = await response.json();
      allModels = data.data;

      // Cache result
      writeFileSync(ALL_MODELS_JSON_PATH, JSON.stringify({
        lastUpdated: new Date().toISOString(),
        models: allModels
      }), "utf-8");

      console.error(`✅ Cached ${allModels.length} models`);
    } catch (error) {
      console.error(`❌ Failed to fetch models: ${error}`);
      return [];
    }
  }

  // Filter for FREE models from TRUSTED providers only
  const freeModels = allModels.filter(model => {
    const promptPrice = parseFloat(model.pricing?.prompt || "0");
    const completionPrice = parseFloat(model.pricing?.completion || "0");
    const isFree = promptPrice === 0 && completionPrice === 0;

    if (!isFree) return false;

    // Check if provider is in trusted list
    const provider = model.id.split('/')[0].toLowerCase();
    return TRUSTED_FREE_PROVIDERS.includes(provider);
  });

  // Sort by context window size (largest first)
  freeModels.sort((a, b) => {
    const contextA = a.context_length || a.top_provider?.context_length || 0;
    const contextB = b.context_length || b.top_provider?.context_length || 0;
    return contextB - contextA;
  });

  // Dedupe: prefer non-:free variant, remove duplicates
  const seenBase = new Set<string>();
  const dedupedModels = freeModels.filter(model => {
    // Get base model ID (without :free suffix)
    const baseId = model.id.replace(/:free$/, '');
    if (seenBase.has(baseId)) {
      return false;
    }
    seenBase.add(baseId);
    return true;
  });

  // Limit to top 15 models
  const topModels = dedupedModels.slice(0, 15);

  // Convert to EnhancedModelData format
  return topModels.map(model => {
    const provider = model.id.split('/')[0];
    const contextLen = model.context_length || model.top_provider?.context_length || 0;

    return {
      id: model.id,
      name: model.name || model.id,
      description: model.description || '',
      provider: provider.charAt(0).toUpperCase() + provider.slice(1),
      pricing: {
        input: "FREE",
        output: "FREE",
        average: "FREE"
      },
      context: contextLen > 0 ? `${Math.round(contextLen/1000)}K` : "N/A",
      supportsTools: (model.supported_parameters || []).includes("tools"),
      supportsReasoning: (model.supported_parameters || []).includes("reasoning"),
      supportsVision: (model.architecture?.input_modalities || []).includes("image")
    };
  });
}

/**
 * Prompt user for OpenRouter API key interactively
 * Uses readline with proper stdin cleanup
 */
export async function promptForApiKey(): Promise<string> {
  return new Promise((resolve) => {
    console.log("\n\x1b[1m\x1b[36mOpenRouter API Key Required\x1b[0m\n");
    console.log("\x1b[2mGet your free API key from: https://openrouter.ai/keys\x1b[0m\n");
    console.log("Enter your OpenRouter API key:");
    console.log("\x1b[2m(it will not be saved, only used for this session)\x1b[0m\n");

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false, // CRITICAL: Don't use terminal mode to avoid stdin interference
    });

    let apiKey: string | null = null;

    rl.on("line", (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        console.log("\x1b[31mError: API key cannot be empty\x1b[0m");
        return;
      }

      // Basic validation: should start with sk-or-v1- (OpenRouter format)
      if (!trimmed.startsWith("sk-or-v1-")) {
        console.log("\x1b[33mWarning: OpenRouter API keys usually start with 'sk-or-v1-'\x1b[0m");
        console.log("\x1b[2mContinuing anyway...\x1b[0m");
      }

      apiKey = trimmed;
      rl.close();
    });

    rl.on("close", () => {
      // CRITICAL: Only resolve AFTER readline has fully closed
      if (apiKey) {
        // Force stdin to clean state
        process.stdin.pause();
        process.stdin.removeAllListeners("data");
        process.stdin.removeAllListeners("end");
        process.stdin.removeAllListeners("error");
        process.stdin.removeAllListeners("readable");

        // Ensure not in raw mode
        if (process.stdin.isTTY && process.stdin.setRawMode) {
          process.stdin.setRawMode(false);
        }

        // Wait for stdin to fully detach
        setTimeout(() => {
          resolve(apiKey);
        }, 200);
      } else {
        console.error("\x1b[31mError: API key is required\x1b[0m");
        process.exit(1);
      }
    });
  });
}

/**
 * Simple console-based model selector (no Ink/React)
 * Uses readline which properly cleans up stdin
 */
export async function selectModelInteractively(options: ModelSelectorOptions = {}): Promise<OpenRouterModel | string> {
  const { freeOnly = false } = options;

  // Load models based on mode
  let displayModels: string[];
  let enhancedMap: Map<string, EnhancedModelData>;

  if (freeOnly) {
    // Load free models from OpenRouter
    const freeModels = await loadFreeModels();

    if (freeModels.length === 0) {
      console.error("❌ No free models found or failed to fetch models");
      process.exit(1);
    }

    displayModels = freeModels.map(m => m.id);
    enhancedMap = new Map<string, EnhancedModelData>();
    for (const m of freeModels) {
      enhancedMap.set(m.id, m);
    }
  } else {
    // Load recommended models (default behavior)
    displayModels = getAvailableModels();
    const enhancedModels = loadEnhancedModels();
    enhancedMap = new Map<string, EnhancedModelData>();
    for (const m of enhancedModels) {
      enhancedMap.set(m.id, m);
    }
  }

  // Add custom option only for non-free mode
  const models = freeOnly ? displayModels : displayModels;

  return new Promise((resolve) => {
    // ANSI color codes
    const RESET = "\x1b[0m";
    const BOLD = "\x1b[1m";
    const DIM = "\x1b[2m";
    const CYAN = "\x1b[36m";
    const GREEN = "\x1b[32m";
    const YELLOW = "\x1b[33m";
    const MAGENTA = "\x1b[35m";

    // Helper to pad text (truncate if needed)
    const pad = (text: string, width: number) => {
      if (text.length > width) return text.slice(0, width - 3) + "...";
      return text + " ".repeat(width - text.length);
    };

    // Print header
    const headerText = freeOnly ? "Select a FREE OpenRouter Model" : "Select an OpenRouter Model";
    const headerPadding = " ".repeat(82 - 4 - headerText.length); // 82 total - 4 for borders/spacing
    console.log("");
    console.log(`${DIM}╭${"─".repeat(82)}╮${RESET}`);
    console.log(`${DIM}│${RESET}  ${BOLD}${CYAN}${headerText}${RESET}${headerPadding}${DIM}│${RESET}`);
    console.log(`${DIM}├${"─".repeat(82)}┤${RESET}`);

    // Column headers (74 chars content + 4 padding + 2 border = 80)
    console.log(`${DIM}│${RESET}  ${DIM}#   Model                             Provider   Pricing   Context  Caps${RESET}      ${DIM}│${RESET}`);
    console.log(`${DIM}├${"─".repeat(82)}┤${RESET}`);

    // Display models - each row should be 82 chars inner content
    models.forEach((modelId, index) => {
      const num = (index + 1).toString().padStart(2);
      const enhanced = enhancedMap.get(modelId);

      if (modelId === "custom") {
        // Custom model entry: 2+2+36 = 40 chars, need 80-40 = 40 padding
        console.log(`${DIM}│${RESET}  ${YELLOW}${num}${RESET}  ${DIM}Enter custom OpenRouter model ID...${RESET}${" ".repeat(40)}${DIM}│${RESET}`);
      } else if (enhanced) {
        // Enhanced model with full info
        const shortId = pad(modelId, 33);
        const provider = pad(enhanced.provider || "N/A", 10);
        const pricing = pad(enhanced.pricing?.average || "N/A", 9);
        const context = pad(enhanced.context || "N/A", 7);

        // Capability indicators
        const tools = enhanced.supportsTools ? "✓" : "·";
        const reasoning = enhanced.supportsReasoning ? "✓" : "·";
        const vision = enhanced.supportsVision ? "✓" : "·";

        // Content: 2+2+33+1+10+1+9+1+7+1+5 = 72 chars, need 80-72 = 8 padding
        console.log(`${DIM}│${RESET}  ${GREEN}${num}${RESET}  ${BOLD}${shortId}${RESET} ${CYAN}${provider}${RESET} ${MAGENTA}${pricing}${RESET} ${context} ${tools} ${reasoning} ${vision}      ${DIM}│${RESET}`);
      } else {
        // Fallback for models without enhanced data
        const shortId = pad(modelId, 33);
        console.log(`${DIM}│${RESET}  ${GREEN}${num}${RESET}  ${shortId} ${DIM}${pad("N/A", 10)} ${pad("N/A", 9)} ${pad("N/A", 7)}${RESET} · · ·      ${DIM}│${RESET}`);
      }
    });

    // Footer with legend: 36 chars content, need 80-36 = 44 padding
    console.log(`${DIM}├${"─".repeat(82)}┤${RESET}`);
    console.log(`${DIM}│${RESET}  ${DIM}Caps: ✓/· = Tools, Reasoning, Vision${RESET}${" ".repeat(44)}${DIM}│${RESET}`);
    console.log(`${DIM}╰${"─".repeat(82)}╯${RESET}`);
    console.log("");
    console.log(`${DIM}Enter number (1-${models.length}) or 'q' to quit:${RESET}`);

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false, // CRITICAL: Don't use terminal mode to avoid stdin interference
    });

    let selectedModel: string | null = null;

    rl.on("line", (input) => {
      const trimmed = input.trim();

      // Handle quit
      if (trimmed.toLowerCase() === "q") {
        rl.close();
        process.exit(0);
      }

      // Parse selection
      const selection = parseInt(trimmed, 10);
      if (isNaN(selection) || selection < 1 || selection > models.length) {
        console.log(`\x1b[31mInvalid selection. Please enter 1-${models.length}\x1b[0m`);
        return;
      }

      const model = models[selection - 1];

      // Handle custom model
      if (model === "custom") {
        rl.close();

        console.log("\n\x1b[1m\x1b[36mEnter custom OpenRouter model ID:\x1b[0m");
        const customRl = createInterface({
          input: process.stdin,
          output: process.stdout,
          terminal: false,
        });

        let customModel: string | null = null;

        customRl.on("line", (customInput) => {
          customModel = customInput.trim();
          customRl.close();
        });

        customRl.on("close", () => {
          // CRITICAL: Wait for readline to fully detach before resolving
          // Force stdin to clean state
          process.stdin.pause();
          process.stdin.removeAllListeners("data");
          process.stdin.removeAllListeners("end");
          process.stdin.removeAllListeners("error");
          process.stdin.removeAllListeners("readable");

          if (process.stdin.isTTY && process.stdin.setRawMode) {
            process.stdin.setRawMode(false);
          }

          setTimeout(() => {
            if (customModel) {
              resolve(customModel);
            } else {
              console.error("\x1b[31mError: Model ID cannot be empty\x1b[0m");
              process.exit(1);
            }
          }, 200);
        });
      } else {
        selectedModel = model;
        rl.close();
      }
    });

    rl.on("close", () => {
      // CRITICAL: Only resolve AFTER readline has fully closed
      // This ensures stdin is completely detached before spawning Claude Code
      if (selectedModel) {
        // Force stdin to clean state
        // Pause to stop all event processing
        process.stdin.pause();

        // Remove ALL readline-related listeners
        process.stdin.removeAllListeners("data");
        process.stdin.removeAllListeners("end");
        process.stdin.removeAllListeners("error");
        process.stdin.removeAllListeners("readable");

        // Ensure not in raw mode
        if (process.stdin.isTTY && process.stdin.setRawMode) {
          process.stdin.setRawMode(false);
        }

        // Wait for stdin to fully detach (longer delay)
        setTimeout(() => {
          resolve(selectedModel);
        }, 200); // 200ms delay for complete cleanup
      }
    });
  });
}
