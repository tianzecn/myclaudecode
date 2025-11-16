// AUTO-GENERATED from shared/recommended-models.md
// DO NOT EDIT MANUALLY - Run 'bun run extract-models' to regenerate

import type { OpenRouterModel } from "./types.js";

export const DEFAULT_MODEL: OpenRouterModel = "x-ai/grok-code-fast-1";
export const DEFAULT_PORT_RANGE = { start: 3000, end: 9000 };

// Model metadata for validation and display
export const MODEL_INFO: Record<
  OpenRouterModel,
  { name: string; description: string; priority: number; provider: string }
> = {
  "x-ai/grok-code-fast-1": {
    name: "Ultra-fast coding",
    description: "Ultra-fast coding",
    priority: 1,
    provider: "xAI",
  },
  "minimax/minimax-m2": {
    name: "Compact high-efficiency",
    description: "Compact high-efficiency",
    priority: 2,
    provider: "MiniMax",
  },
  "z-ai/glm-4.6": {
    name: "Enhanced coding capabilities",
    description: "Enhanced coding capabilities",
    priority: 3,
    provider: "Zhipu AI",
  },
  "openai/gpt-5.1-codex": {
    name: "Specialized software engineering",
    description: "Specialized software engineering",
    priority: 4,
    provider: "OpenAI",
  },
  "google/gemini-2.5-flash": {
    name: "Advanced reasoning with built-in thinking",
    description: "Advanced reasoning with built-in thinking",
    priority: 5,
    provider: "Google",
  },
  "google/gemini-2.5-pro": {
    name: "State-of-the-art reasoning",
    description: "State-of-the-art reasoning",
    priority: 6,
    provider: "Google",
  },
  "qwen/qwen3-vl-235b-a22b-instruct": {
    name: "Multimodal vision-language",
    description: "Multimodal vision-language",
    priority: 7,
    provider: "Alibaba",
  },
  "google/gemini-2.0-flash-001": {
    name: "Faster TTFT, multimodal",
    description: "Faster TTFT, multimodal",
    priority: 8,
    provider: "Google",
  },
  "google/gemini-2.5-flash-lite": {
    name: "Ultra-low latency",
    description: "Ultra-low latency",
    priority: 9,
    provider: "Google",
  },
  "deepseek/deepseek-chat-v3-0324": {
    name: "685B parameter MoE",
    description: "685B parameter MoE",
    priority: 10,
    provider: "DeepSeek",
  },
  "openai/gpt-4o-mini": {
    name: "Compact multimodal",
    description: "Compact multimodal",
    priority: 11,
    provider: "OpenAI",
  },
  "custom": {
    name: "Custom Model",
    description: "Enter any OpenRouter model ID manually",
    priority: 999,
    provider: "Custom",
  },
};

// Environment variable names
export const ENV = {
  OPENROUTER_API_KEY: "OPENROUTER_API_KEY",
  CLAUDISH_MODEL: "CLAUDISH_MODEL",
  CLAUDISH_PORT: "CLAUDISH_PORT",
  CLAUDISH_ACTIVE_MODEL_NAME: "CLAUDISH_ACTIVE_MODEL_NAME", // Set by claudish to show active model in status line
  ANTHROPIC_MODEL: "ANTHROPIC_MODEL", // Claude Code standard env var for model selection
  ANTHROPIC_SMALL_FAST_MODEL: "ANTHROPIC_SMALL_FAST_MODEL", // Claude Code standard env var for fast model
} as const;

// OpenRouter API Configuration
export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_HEADERS = {
  "HTTP-Referer": "https://github.com/MadAppGang/claude-code",
  "X-Title": "Claudish - OpenRouter Proxy",
} as const;
