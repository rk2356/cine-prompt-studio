import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Film, Settings, Upload, FileText, Users, UserPlus, Palette,
  Sparkles, Copy, Check, Download, Trash2, Plus, Loader2,
  ChevronDown, ChevronUp, Camera, Clapperboard, Eye, EyeOff,
  Zap, AlertCircle, X, Move, Target, Video, RefreshCw
} from 'lucide-react';

/* ─────────────────────── TYPES ─────────────────────── */

interface Character {
  id: string;
  name: string;
  description: string;
}

interface Shot {
  shotNumber: number;
  shotType: string;
  cameraAngle: string;
  cameraMovement: string;
  description: string;
  imagePrompt: string;
}

interface Scene {
  sceneNumber: number;
  sceneTitle: string;
  shots: Shot[];
}

interface ModelOption {
  id: string;
  name: string;
  desc: string;
}

interface Provider {
  id: string;
  name: string;
  icon: string;
  apiKeyUrl: string;
  apiKeyPlaceholder: string;
  models: ModelOption[];
  badge: string;
}

/* ─────────────────────── PROVIDERS ─────────────────────── */

const PROVIDERS: Provider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '🔷',
    apiKeyUrl: 'https://aistudio.google.com/apikey',
    apiKeyPlaceholder: 'AIzaSy...',
    badge: 'Free Tier',
    models: [
      { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash Preview', desc: 'Latest & Smartest' },
      { id: 'gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro Preview', desc: 'Most Capable' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', desc: 'Fast & Free' },
      { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite', desc: 'Ultra Fast' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Balanced' },
      { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash 8B', desc: 'Lightweight' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Powerful' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: '🐋',
    apiKeyUrl: 'https://platform.deepseek.com/api_keys',
    apiKeyPlaceholder: 'sk-...',
    badge: 'Very Affordable',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3 (Chat)', desc: 'Best Value' },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1 (Reasoner)', desc: 'Deep Reasoning' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '🟤',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    apiKeyPlaceholder: 'sk-ant-...',
    badge: 'Premium Quality',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', desc: 'Latest & Best' },
      { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', desc: 'Most Powerful' },
      { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', desc: 'Extended Thinking' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet v2', desc: 'Fast & Smart' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', desc: 'Ultra Fast' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', desc: 'Previous Best' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', desc: 'Budget Fast' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🟢',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    apiKeyPlaceholder: 'sk-...',
    badge: 'Premium',
    models: [
      { id: 'gpt-4.1', name: 'GPT-4.1', desc: 'Latest Flagship' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', desc: 'Fast & Smart' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', desc: 'Ultra Fast' },
      { id: 'gpt-4o', name: 'GPT-4o', desc: 'Multimodal' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'Budget Smart' },
      { id: 'o4-mini', name: 'O4 Mini', desc: 'Reasoning Latest' },
      { id: 'o3', name: 'O3', desc: 'Deep Reasoning' },
      { id: 'o3-mini', name: 'O3 Mini', desc: 'Fast Reasoning' },
      { id: 'o1', name: 'O1', desc: 'Advanced Reasoning' },
      { id: 'o1-mini', name: 'O1 Mini', desc: 'Light Reasoning' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', desc: 'Previous Gen' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: 'Budget' },
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    icon: '🔍',
    apiKeyUrl: 'https://www.perplexity.ai/settings/api',
    apiKeyPlaceholder: 'pplx-...',
    badge: 'Search + AI',
    models: [
      { id: 'sonar-pro', name: 'Sonar Pro', desc: 'Best Quality + Search' },
      { id: 'sonar', name: 'Sonar', desc: 'Fast + Search' },
      { id: 'sonar-deep-research', name: 'Sonar Deep Research', desc: 'Deep Analysis' },
      { id: 'sonar-reasoning-pro', name: 'Sonar Reasoning Pro', desc: 'Advanced Reasoning' },
      { id: 'sonar-reasoning', name: 'Sonar Reasoning', desc: 'Reasoning' },
      { id: 'r1-1776', name: 'R1-1776', desc: 'Offline Reasoning' },
    ],
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    icon: '🚀',
    apiKeyUrl: 'https://console.x.ai/',
    apiKeyPlaceholder: 'xai-...',
    badge: 'Elon\'s AI',
    models: [
      { id: 'grok-3', name: 'Grok 3', desc: 'Most Powerful' },
      { id: 'grok-3-fast', name: 'Grok 3 Fast', desc: 'Speed Optimized' },
      { id: 'grok-3-mini', name: 'Grok 3 Mini', desc: 'Lightweight' },
      { id: 'grok-3-mini-fast', name: 'Grok 3 Mini Fast', desc: 'Ultra Fast' },
      { id: 'grok-2', name: 'Grok 2', desc: 'Previous Gen' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: '⚡',
    apiKeyUrl: 'https://console.groq.com/keys',
    apiKeyPlaceholder: 'gsk_...',
    badge: 'Ultra Fast & Free',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', desc: 'Versatile' },
      { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', desc: 'Previous Gen' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', desc: 'Instant' },
      { id: 'llama3-70b-8192', name: 'Llama 3 70B', desc: 'Classic' },
      { id: 'llama3-8b-8192', name: 'Llama 3 8B', desc: 'Light' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', desc: 'MoE' },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', desc: 'Google' },
      { id: 'qwen-qwq-32b', name: 'Qwen QwQ 32B', desc: 'Reasoning' },
      { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B', desc: 'Reasoning' },
    ],
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌀',
    apiKeyUrl: 'https://console.mistral.ai/api-keys/',
    apiKeyPlaceholder: 'sk-...',
    badge: 'European AI',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large 2', desc: 'Most Capable' },
      { id: 'mistral-medium-latest', name: 'Mistral Medium', desc: 'Balanced' },
      { id: 'mistral-small-latest', name: 'Mistral Small 3.1', desc: 'Fast & Efficient' },
      { id: 'codestral-latest', name: 'Codestral', desc: 'Code Expert' },
      { id: 'open-mistral-nemo', name: 'Mistral Nemo', desc: 'Open 12B' },
      { id: 'open-mixtral-8x22b', name: 'Mixtral 8x22B', desc: 'Large MoE' },
      { id: 'open-mixtral-8x7b', name: 'Mixtral 8x7B', desc: 'Small MoE' },
      { id: 'pixtral-large-latest', name: 'Pixtral Large', desc: 'Vision Model' },
    ],
  },
  {
    id: 'together',
    name: 'Together AI',
    icon: '🤝',
    apiKeyUrl: 'https://api.together.xyz/settings/api-keys',
    apiKeyPlaceholder: 'sk-...',
    badge: 'Open Source Hub',
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', name: 'Llama 3.3 70B Turbo', desc: 'Best Open' },
      { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B Turbo', desc: 'Largest' },
      { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B Turbo', desc: 'Fast' },
      { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: 'Llama 3.1 8B Turbo', desc: 'Instant' },
      { id: 'deepseek-ai/DeepSeek-R1', name: 'DeepSeek R1', desc: 'Reasoning' },
      { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3', desc: 'Chat' },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', name: 'Qwen 2.5 72B Turbo', desc: 'Alibaba' },
      { id: 'mistralai/Mixtral-8x22B-Instruct-v0.1', name: 'Mixtral 8x22B', desc: 'MoE' },
      { id: 'google/gemma-2-27b-it', name: 'Gemma 2 27B', desc: 'Google' },
    ],
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    icon: '🎆',
    apiKeyUrl: 'https://fireworks.ai/api-keys',
    apiKeyPlaceholder: 'fw_...',
    badge: 'Fast Inference',
    models: [
      { id: 'accounts/fireworks/models/llama-v3p3-70b-instruct', name: 'Llama 3.3 70B', desc: 'Best Open' },
      { id: 'accounts/fireworks/models/llama-v3p1-405b-instruct', name: 'Llama 3.1 405B', desc: 'Largest' },
      { id: 'accounts/fireworks/models/llama-v3p1-70b-instruct', name: 'Llama 3.1 70B', desc: 'Balanced' },
      { id: 'accounts/fireworks/models/llama-v3p1-8b-instruct', name: 'Llama 3.1 8B', desc: 'Fast' },
      { id: 'accounts/fireworks/models/deepseek-v3', name: 'DeepSeek V3', desc: 'Chat' },
      { id: 'accounts/fireworks/models/deepseek-r1', name: 'DeepSeek R1', desc: 'Reasoning' },
      { id: 'accounts/fireworks/models/qwen2p5-72b-instruct', name: 'Qwen 2.5 72B', desc: 'Alibaba' },
      { id: 'accounts/fireworks/models/mixtral-8x22b-instruct', name: 'Mixtral 8x22B', desc: 'MoE' },
    ],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🔶',
    apiKeyUrl: 'https://dashboard.cohere.com/api-keys',
    apiKeyPlaceholder: 'co-...',
    badge: 'Enterprise AI',
    models: [
      { id: 'command-a-03-2025', name: 'Command A', desc: 'Latest & Best' },
      { id: 'command-r-plus-08-2024', name: 'Command R+', desc: 'Most Capable' },
      { id: 'command-r-08-2024', name: 'Command R', desc: 'Balanced' },
      { id: 'command-r7b-12-2024', name: 'Command R7B', desc: 'Fast & Light' },
      { id: 'command-light', name: 'Command Light', desc: 'Budget' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: '🔀',
    apiKeyUrl: 'https://openrouter.ai/keys',
    apiKeyPlaceholder: 'sk-or-...',
    badge: 'All Models in One',
    models: [
      // Free Models
      { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)', desc: '🆓 Free' },
      { id: 'google/gemini-2.5-flash-preview:free', name: 'Gemini 2.5 Flash (Free)', desc: '🆓 Free' },
      { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3 (Free)', desc: '🆓 Free' },
      { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)', desc: '🆓 Free' },
      { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)', desc: '🆓 Free' },
      { id: 'qwen/qwen3-235b-a22b:free', name: 'Qwen 3 235B (Free)', desc: '🆓 Free' },
      { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 (Free)', desc: '🆓 Free' },
      // Claude Models
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', desc: '💰 Anthropic' },
      { id: 'anthropic/claude-opus-4', name: 'Claude Opus 4', desc: '💰 Anthropic' },
      { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', desc: '💰 Anthropic' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', desc: '💰 Anthropic' },
      { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', desc: '💰 Anthropic' },
      // OpenAI Models
      { id: 'openai/gpt-4.1', name: 'GPT-4.1', desc: '💰 OpenAI' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', desc: '💰 OpenAI' },
      { id: 'openai/o3', name: 'O3', desc: '💰 OpenAI' },
      { id: 'openai/o4-mini', name: 'O4 Mini', desc: '💰 OpenAI' },
      // Google
      { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro', desc: '💰 Google' },
      // xAI
      { id: 'x-ai/grok-3', name: 'Grok 3', desc: '💰 xAI' },
      { id: 'x-ai/grok-3-mini', name: 'Grok 3 Mini', desc: '💰 xAI' },
      // Perplexity
      { id: 'perplexity/sonar-pro', name: 'Sonar Pro', desc: '💰 Perplexity' },
      { id: 'perplexity/sonar', name: 'Sonar', desc: '💰 Perplexity' },
    ],
  },
];

/* ─────────────────────── API HELPERS ─────────────────────── */

function getApiConfig(providerId: string, apiKey: string, model: string) {
  switch (providerId) {
    case 'gemini':
      return {
        testUrl: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        testBody: {
          contents: [{ parts: [{ text: 'Reply with exactly one word: OK' }] }],
          generationConfig: { maxOutputTokens: 10, temperature: 0 },
        },
        testHeaders: { 'Content-Type': 'application/json' } as Record<string, string>,
        extractTestResult: (data: any) => {
          if (data.error) throw new Error(data.error.message);
          return true; // if no error, key works
        },
        generateUrl: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        buildGenBody: (prompt: string) => ({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.75,
            maxOutputTokens: 65536,
          },
        }),
        generateHeaders: { 'Content-Type': 'application/json' } as Record<string, string>,
        extractGenResult: (data: any) => {
          if (data.error) throw new Error(data.error.message);
          if (!data.candidates || data.candidates.length === 0) {
            const br = data.promptFeedback?.blockReason;
            throw new Error(br ? `Blocked by safety: ${br}` : 'No response from AI');
          }
          const c = data.candidates[0];
          if (c.finishReason === 'SAFETY') throw new Error('Response blocked by safety filters.');
          const text = c.content?.parts?.[0]?.text;
          if (!text) throw new Error('Empty AI response');
          return text;
        },
      };

    case 'anthropic':
      return buildAnthropicConfig(apiKey, model);

    case 'cohere':
      return buildCohereConfig(apiKey, model);

    case 'deepseek':
      return buildOpenAICompatibleConfig(
        'https://api.deepseek.com/v1',
        apiKey, model
      );

    case 'openai':
      return buildOpenAICompatibleConfig(
        'https://api.openai.com/v1',
        apiKey, model
      );

    case 'perplexity':
      return buildOpenAICompatibleConfig(
        'https://api.perplexity.ai',
        apiKey, model
      );

    case 'xai':
      return buildOpenAICompatibleConfig(
        'https://api.x.ai/v1',
        apiKey, model
      );

    case 'groq':
      return buildOpenAICompatibleConfig(
        'https://api.groq.com/openai/v1',
        apiKey, model
      );

    case 'mistral':
      return buildOpenAICompatibleConfig(
        'https://api.mistral.ai/v1',
        apiKey, model
      );

    case 'together':
      return buildOpenAICompatibleConfig(
        'https://api.together.xyz/v1',
        apiKey, model
      );

    case 'fireworks':
      return buildOpenAICompatibleConfig(
        'https://api.fireworks.ai/inference/v1',
        apiKey, model
      );

    case 'openrouter':
      return buildOpenAICompatibleConfig(
        'https://openrouter.ai/api/v1',
        apiKey, model,
        { 'HTTP-Referer': window.location.href, 'X-Title': 'CinePrompt Studio' }
      );

    default:
      throw new Error('Unknown provider');
  }
}

function buildAnthropicConfig(apiKey: string, model: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  };

  return {
    testUrl: 'https://api.anthropic.com/v1/messages',
    testBody: {
      model,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Reply with exactly one word: OK' }],
    },
    testHeaders: headers,
    extractTestResult: (data: any) => {
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      if (data.content) return true;
      throw new Error('Unexpected response');
    },
    generateUrl: 'https://api.anthropic.com/v1/messages',
    buildGenBody: (prompt: string) => ({
      model,
      max_tokens: 16384,
      system: 'You are an expert cinematographer and AI image prompt engineer. You respond ONLY with valid JSON arrays. No markdown, no code blocks, no explanations.',
      messages: [{ role: 'user', content: prompt }],
    }),
    generateHeaders: headers,
    extractGenResult: (data: any) => {
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      if (!data.content || data.content.length === 0) throw new Error('No response from Claude');
      const text = data.content.find((c: any) => c.type === 'text')?.text;
      if (!text) throw new Error('Empty Claude response');
      return text;
    },
  };
}

function buildCohereConfig(apiKey: string, model: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  return {
    testUrl: 'https://api.cohere.com/v2/chat',
    testBody: {
      model,
      messages: [{ role: 'user', content: 'Reply with exactly one word: OK' }],
      max_tokens: 10,
    },
    testHeaders: headers,
    extractTestResult: (data: any) => {
      if (data.message && !data.id) throw new Error(data.message);
      return true;
    },
    generateUrl: 'https://api.cohere.com/v2/chat',
    buildGenBody: (prompt: string) => ({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert cinematographer and AI image prompt engineer. You respond ONLY with valid JSON arrays. No markdown, no code blocks, no explanations.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 16384,
      temperature: 0.75,
    }),
    generateHeaders: headers,
    extractGenResult: (data: any) => {
      if (data.message && !data.id) throw new Error(data.message);
      const text = data.message?.content?.[0]?.text;
      if (!text) throw new Error('Empty Cohere response');
      return text;
    },
  };
}

function buildOpenAICompatibleConfig(
  baseUrl: string,
  apiKey: string,
  model: string,
  extraHeaders: Record<string, string> = {}
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    ...extraHeaders,
  };

  return {
    testUrl: `${baseUrl}/chat/completions`,
    testBody: {
      model,
      messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
      max_tokens: 5,
      temperature: 0,
    },
    testHeaders: headers,
    extractTestResult: (data: any) => {
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      if (data.choices && data.choices.length > 0) return true;
      throw new Error('Unexpected response format');
    },
    generateUrl: `${baseUrl}/chat/completions`,
    buildGenBody: (prompt: string) => ({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert cinematographer and AI image prompt engineer. You respond ONLY with valid JSON arrays. No markdown, no code blocks, no explanations.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 16384,
      temperature: 0.75,
    }),
    generateHeaders: headers,
    extractGenResult: (data: any) => {
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      if (!data.choices || data.choices.length === 0) throw new Error('No response from AI');
      const text = data.choices[0].message?.content;
      if (!text) throw new Error('Empty AI response');
      return text;
    },
  };
}

/* ─────────────────────── CONSTANTS ─────────────────────── */

const LOADING_MESSAGES = [
  "📖 Reading your story...",
  "🎬 Breaking down scenes...",
  "📸 Planning camera angles...",
  "🎨 Crafting image prompts...",
  "✨ Adding cinematic details...",
  "🎭 Ensuring character consistency...",
  "🎥 Finalizing shot compositions...",
  "🌟 Polishing visual descriptions...",
];

/* ─────────────────── MAIN APP ──────────────────── */

export default function App() {
  // API Config
  const [providerId, setProviderId] = useState(() => localStorage.getItem('cp_provider') || 'gemini');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cp_apikey_' + (localStorage.getItem('cp_provider') || 'gemini')) || '');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('cp_model_' + (localStorage.getItem('cp_provider') || 'gemini')) || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [connectionMsg, setConnectionMsg] = useState('');

  // Story
  const [storyContent, setStoryContent] = useState('');
  const [storyFileName, setStoryFileName] = useState('');

  // Characters
  const [characters, setCharacters] = useState<Character[]>([]);
  const [newCharName, setNewCharName] = useState('');
  const [newCharDesc, setNewCharDesc] = useState('');

  // Reference Prompts
  const [referencePrompts, setReferencePrompts] = useState<string[]>([]);
  const [newRefPrompt, setNewRefPrompt] = useState('');
  const [expandedPromptIndex, setExpandedPromptIndex] = useState<number | null>(null);

  // Generation
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [expandedScenes, setExpandedScenes] = useState<Set<number>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const currentProvider = PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0];

  // When provider changes, load saved key & model for that provider
  const handleProviderChange = useCallback((newProviderId: string) => {
    setProviderId(newProviderId);
    localStorage.setItem('cp_provider', newProviderId);
    const savedKey = localStorage.getItem('cp_apikey_' + newProviderId) || '';
    const prov = PROVIDERS.find(p => p.id === newProviderId);
    const savedModel = localStorage.getItem('cp_model_' + newProviderId) || prov?.models[0]?.id || '';
    setApiKey(savedKey);
    setSelectedModel(savedModel);
    setConnectionStatus('idle');
    setConnectionMsg('');
    setError('');
  }, []);

  // Persist API key & model per provider
  useEffect(() => {
    localStorage.setItem('cp_apikey_' + providerId, apiKey);
  }, [apiKey, providerId]);

  useEffect(() => {
    localStorage.setItem('cp_model_' + providerId, selectedModel);
  }, [selectedModel, providerId]);

  // Set default model if none selected
  useEffect(() => {
    if (!selectedModel && currentProvider.models.length > 0) {
      setSelectedModel(currentProvider.models[0].id);
    }
  }, [selectedModel, currentProvider]);

  // Loading message cycling
  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Expand all scenes when results arrive
  useEffect(() => {
    if (scenes.length > 0) {
      setExpandedScenes(new Set(scenes.map(s => s.sceneNumber)));
    }
  }, [scenes]);

  /* ─────── File Upload ─────── */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setStoryContent(ev.target?.result as string);
      setStoryFileName(file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  /* ─────── Characters ─────── */
  const addCharacter = () => {
    if (!newCharName.trim() || !newCharDesc.trim()) return;
    setCharacters(prev => [...prev, {
      id: Date.now().toString(),
      name: newCharName.trim(),
      description: newCharDesc.trim()
    }]);
    setNewCharName('');
    setNewCharDesc('');
  };

  const removeCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  /* ─────── Reference Prompts ─────── */
  const addRefPrompt = () => {
    if (!newRefPrompt.trim()) return;
    setReferencePrompts(prev => [...prev, newRefPrompt.trim()]);
    setNewRefPrompt('');
  };

  const removeRefPrompt = (index: number) => {
    setReferencePrompts(prev => prev.filter((_, i) => i !== index));
    if (expandedPromptIndex === index) setExpandedPromptIndex(null);
  };

  /* ─────── Copy ─────── */
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  /* ─────── Test Connection ─────── */
  const testConnection = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your API key first');
      return;
    }
    setConnectionStatus('testing');
    setConnectionMsg('');
    setError('');

    try {
      const config = getApiConfig(providerId, apiKey.trim(), selectedModel);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(config.testUrl, {
        method: 'POST',
        headers: config.testHeaders,
        body: JSON.stringify(config.testBody),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error?.message || data?.error?.code || `HTTP ${res.status}`;
        if (res.status === 401 || res.status === 403) {
          throw new Error(`Invalid API key. Please check your ${currentProvider.name} API key.`);
        }
        if (res.status === 404) {
          throw new Error(`Model "${selectedModel}" not found. Try a different model.`);
        }
        if (res.status === 429) {
          throw new Error('Rate limited. Your key is valid but you hit the rate limit. Wait and try again.');
        }
        throw new Error(errMsg);
      }

      config.extractTestResult(data);

      setConnectionStatus('connected');
      setConnectionMsg(`✅ Connected to ${currentProvider.name} — ${selectedModel}`);
      setTimeout(() => {
        setConnectionStatus('idle');
        setConnectionMsg('');
      }, 5000);

    } catch (err: any) {
      setConnectionStatus('error');
      if (err.name === 'AbortError') {
        setConnectionMsg('⏱️ Connection timed out. Check your internet & API key.');
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError') || err.message?.includes('fetch')) {
        setConnectionMsg(`❌ Network error. Cannot reach ${currentProvider.name} servers. Check internet or try a different provider.`);
      } else {
        setConnectionMsg(`❌ ${err.message}`);
      }
      setTimeout(() => {
        setConnectionStatus('idle');
      }, 8000);
    }
  };

  /* ─────── Build AI Prompt ─────── */
  const buildPrompt = (): string => {
    let prompt = `You are an elite cinematographer, award-winning film director, and expert AI image generation prompt engineer. Your expertise encompasses Hollywood blockbusters, indie films, art house cinema, and visual storytelling at the highest level.

## YOUR MISSION
Analyze the provided story/screenplay with extreme attention to detail. Break it down into individual scenes, and for each scene, plan the optimal shots that a world-class director would use. Then generate a detailed, production-ready image prompt for each shot.

## KEY PRINCIPLES
1. **Visual Storytelling**: Every shot must serve the narrative and advance the story
2. **Emotional Impact**: Use camera angles, lighting, and composition to amplify emotion
3. **Continuity**: Maintain visual consistency across all shots in a scene
4. **Cinematic Quality**: Think like Roger Deakins, Emmanuel Lubezki, or Janusz Kamiński
5. **Production Value**: Each prompt should produce a frame worthy of a theatrical release

## CAMERA ANGLES & SHOT TYPES TO USE
- Extreme Wide Shot (EWS): Establishing scale and environment
- Wide Shot (WS): Full scene context, geography
- Medium Wide Shot (MWS): Characters within environment
- Medium Shot (MS): Waist-up, standard dialogue coverage
- Medium Close-Up (MCU): Chest-up, emotional dialogue
- Close-Up (CU): Face/object detail, peak emotion
- Extreme Close-Up (ECU): Eyes, hands, critical details
- Over-the-Shoulder (OTS): Conversation perspective
- Two-Shot: Two characters in frame
- Point of View (POV): Character's direct perspective
- Bird's Eye View: Directly overhead
- Low Angle: Power, dominance, heroism
- High Angle: Vulnerability, smallness
- Dutch Angle/Tilt: Tension, psychological unease
- Tracking/Dolly Shot: Following movement smoothly
- Crane Shot: Sweeping, epic reveals
- Steadicam: Immersive following
- Whip Pan: Energetic transition
- Rack Focus: Shifting attention between foreground/background
- Silhouette Shot: Dramatic backlit framing`;

    if (referencePrompts.length > 0) {
      prompt += `\n\n## REFERENCE PROMPT STYLE
Study these reference prompts with extreme care. Your generated prompts MUST match their exact style, structure, level of detail, terminology, and artistic approach:\n\n`;
      referencePrompts.forEach((p, i) => {
        prompt += `### Reference Prompt ${i + 1}:\n${p}\n\n`;
      });
      prompt += `CRITICAL: Match the above prompt style exactly. Use similar formatting, similar level of detail, similar descriptive language, and similar technical terminology.\n`;
    } else {
      prompt += `\n\n## PROMPT STYLE GUIDELINES
Generate highly detailed, vivid image prompts suitable for AI image generation tools (Midjourney, DALL-E, Stable Diffusion, Flux). Each prompt should include:
- Detailed subject/character description
- Environment and setting details
- Lighting conditions (direction, quality, color temperature)
- Mood and atmosphere
- Color palette and tone
- Camera angle and lens information
- Composition details (rule of thirds, leading lines, etc.)
- Style references (cinematic, photorealistic, etc.)
- Technical details (depth of field, film grain, etc.)\n`;
    }

    if (characters.length > 0) {
      prompt += `\n## CHARACTER DESCRIPTIONS — ABSOLUTE CONSISTENCY REQUIRED
These are the exact character descriptions you MUST use in EVERY shot where the character appears. NEVER change, modify, or deviate from these descriptions. Character consistency is CRITICAL.\n\n`;
      characters.forEach(c => {
        prompt += `### ${c.name}\n${c.description}\n\n`;
      });
      prompt += `IMPORTANT: When a character appears in a shot, always include their FULL description from above to maintain visual consistency across all generated images.\n`;
    }

    prompt += `\n## OUTPUT FORMAT
Return ONLY a valid JSON array. No markdown code blocks, no backticks, no explanatory text before or after the JSON.

The exact JSON structure must be:
[
  {
    "sceneNumber": 1,
    "sceneTitle": "Descriptive scene title",
    "shots": [
      {
        "shotNumber": 1,
        "shotType": "Wide Shot / Establishing",
        "cameraAngle": "Eye Level Wide Angle",
        "cameraMovement": "Slow dolly forward",
        "description": "Brief narrative description of what this shot shows and its purpose",
        "imagePrompt": "The complete, detailed image generation prompt with all visual details, lighting, composition, character descriptions, environment, mood, camera specs, and style..."
      }
    ]
  }
]

## IMPORTANT RULES
1. Generate shots for EVERY scene in the story
2. Include establishing shots, dialogue coverage, reaction shots, insert shots, and transition shots
3. Each image prompt should be self-contained (include all necessary details)
4. Maintain character description consistency across ALL shots
5. Return ONLY valid JSON — no other text, no markdown code blocks

## STORY/SCREENPLAY TO ANALYZE

${storyContent}`;

    return prompt;
  };

  /* ─────── Generate Prompts ─────── */
  const generatePrompts = async () => {
    if (!apiKey.trim()) {
      setError('⚠️ Please set your API key in the API Configuration section');
      return;
    }
    if (!storyContent.trim()) {
      setError('⚠️ Please upload or paste your story/screenplay first');
      return;
    }

    setIsGenerating(true);
    setError('');
    setScenes([]);
    setLoadingMsgIndex(0);

    try {
      const prompt = buildPrompt();
      const config = getApiConfig(providerId, apiKey.trim(), selectedModel);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000); // 2 min timeout

      const res = await fetch(config.generateUrl, {
        method: 'POST',
        headers: config.generateHeaders,
        body: JSON.stringify(config.buildGenBody(prompt)),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errMsg);
      }

      let text = config.extractGenResult(data);

      // Clean markdown code blocks if present
      text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

      let parsed: Scene[];

      try {
        const directParse = JSON.parse(text);
        if (Array.isArray(directParse)) {
          parsed = directParse;
        } else if (directParse && Array.isArray(directParse.scenes)) {
          parsed = directParse.scenes;
        } else {
          throw new Error('Not an array');
        }
      } catch {
        // Fallback: extract JSON array from text
        const startIdx = text.indexOf('[');
        const endIdx = text.lastIndexOf(']');
        if (startIdx === -1 || endIdx === -1) {
          console.error('Raw AI response:', text);
          throw new Error('AI response did not contain valid JSON. Check console for raw output. Please try again.');
        }
        try {
          parsed = JSON.parse(text.substring(startIdx, endIdx + 1));
        } catch {
          console.error('Raw AI response:', text);
          throw new Error('Failed to parse AI response JSON. Please try again.');
        }
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('AI returned empty results. Please try again with more story detail.');
      }

      setScenes(parsed);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out after 2 minutes. Try a shorter story or faster model.');
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError(`Network error: Cannot reach ${currentProvider.name}. Check your internet connection.`);
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  /* ─────── Export ─────── */
  const exportPrompts = () => {
    let content = `╔══════════════════════════════════════════════════════════╗\n`;
    content += `║         CINEPROMPT STUDIO — Shot Prompt Export          ║\n`;
    content += `╚══════════════════════════════════════════════════════════╝\n\n`;
    content += `Story: ${storyFileName || 'Untitled'}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Provider: ${currentProvider.name}\n`;
    content += `Model: ${selectedModel}\n`;
    content += `Total Scenes: ${scenes.length}\n`;
    content += `Total Shots: ${scenes.reduce((a, s) => a + s.shots.length, 0)}\n`;

    if (characters.length > 0) {
      content += `\n${'─'.repeat(55)}\n`;
      content += `CHARACTERS\n`;
      content += `${'─'.repeat(55)}\n\n`;
      characters.forEach(c => {
        content += `${c.name}:\n${c.description}\n\n`;
      });
    }

    content += `\n${'═'.repeat(55)}\n`;
    content += `SHOT PROMPTS\n`;
    content += `${'═'.repeat(55)}\n`;

    scenes.forEach(scene => {
      content += `\n\n${'━'.repeat(55)}\n`;
      content += `SCENE ${scene.sceneNumber}: ${scene.sceneTitle}\n`;
      content += `${'━'.repeat(55)}\n`;

      scene.shots.forEach(shot => {
        content += `\n┌─ Shot ${shot.shotNumber} ─────────────────────────\n`;
        content += `│ Type: ${shot.shotType}\n`;
        content += `│ Camera: ${shot.cameraAngle}\n`;
        content += `│ Movement: ${shot.cameraMovement}\n`;
        content += `│ Description: ${shot.description}\n`;
        content += `├──────────────────────────────────\n`;
        content += `│ IMAGE PROMPT:\n│\n`;
        const lines = shot.imagePrompt.match(/.{1,70}/g) || [shot.imagePrompt];
        lines.forEach(line => {
          content += `│ ${line}\n`;
        });
        content += `└──────────────────────────────────\n`;
      });
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cineprompt-shots-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ─────── Scene Toggle ─────── */
  const toggleScene = (sceneNum: number) => {
    setExpandedScenes(prev => {
      const next = new Set(prev);
      if (next.has(sceneNum)) next.delete(sceneNum);
      else next.add(sceneNum);
      return next;
    });
  };

  /* ─────── Stats ─────── */
  const totalShots = scenes.reduce((acc, s) => acc + s.shots.length, 0);

  /* ════════════════════════ RENDER ════════════════════════ */

  return (
    <div className="min-h-screen bg-[#08090f]">

      {/* ══════════ HEADER ══════════ */}
      <header className="relative border-b border-[#1a1f35] bg-gradient-to-r from-[#0c0f1a] via-[#10142a] to-[#0c0f1a]">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                CinePrompt <span className="text-amber-400">Studio</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium tracking-wide">
                Story → Shot Prompt Generator
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141829] border border-[#1e2540] text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200 text-sm"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">API Settings</span>
            {showApiConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      </header>

      {/* ══════════ API CONFIG ══════════ */}
      {showApiConfig && (
        <div className="border-b border-[#1a1f35] bg-[#0a0d18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-gray-300">API Configuration</h3>
            </div>

            {/* Provider Selection */}
            <div className="mb-4">
              <label className="block text-[10px] text-gray-500 mb-2 uppercase tracking-wider">Select AI Provider</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleProviderChange(p.id)}
                    className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200 text-center
                      ${providerId === p.id
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                        : 'bg-[#0c0f1a] border-[#1a1f35] hover:border-[#2a3050] hover:bg-[#0e1220]'
                      }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span className={`text-xs font-semibold ${providerId === p.id ? 'text-amber-400' : 'text-gray-400'}`}>
                      {p.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      providerId === p.id
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-[#141829] text-gray-600'
                    }`}>
                      {p.badge}
                    </span>
                    {providerId === p.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Model + API Key Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              {/* Model Selector */}
              <div className="flex-shrink-0 sm:min-w-[220px]">
                <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#141829] border border-[#1e2540] rounded-lg px-3 py-2.5 text-sm text-gray-300 cursor-pointer hover:border-amber-500/30 transition-colors"
                >
                  {currentProvider.models.map(m => (
                    <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
                  ))}
                </select>
              </div>

              {/* API Key */}
              <div className="flex-1">
                <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider">
                  {currentProvider.name} API Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={currentProvider.apiKeyPlaceholder}
                    className="w-full bg-[#141829] border border-[#1e2540] rounded-lg pl-3 pr-10 py-2.5 text-sm text-gray-300 placeholder-gray-600 font-mono"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Test Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={testConnection}
                  disabled={connectionStatus === 'testing'}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${connectionStatus === 'connected'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : connectionStatus === 'error'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 hover:from-amber-500/30 hover:to-orange-500/30'
                    }`}
                >
                  {connectionStatus === 'testing' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : connectionStatus === 'connected' ? (
                    <Check className="w-4 h-4" />
                  ) : connectionStatus === 'error' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {connectionStatus === 'testing' ? 'Testing...'
                    : connectionStatus === 'connected' ? 'Connected!'
                    : connectionStatus === 'error' ? 'Failed'
                    : 'Test Connection'}
                </button>
              </div>
            </div>

            {/* Status Message */}
            {connectionMsg && (
              <div className={`mt-3 text-xs px-3 py-2 rounded-lg ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {connectionMsg}
              </div>
            )}

            <p className="mt-3 text-[11px] text-gray-600">
              Get your API key →{' '}
              <a href={currentProvider.apiKeyUrl} target="_blank" rel="noopener noreferrer" className="text-amber-500/70 hover:text-amber-400 underline underline-offset-2">
                {currentProvider.apiKeyUrl.replace('https://', '')}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ────── 3-Column Grid ────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

          {/* ══════ STORY UPLOAD ══════ */}
          <div className="glass-card rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Upload Story / Screenplay</h2>
                <p className="text-[10px] text-gray-500">Upload .md or .txt file or paste directly</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.txt,.markdown"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[#1e2540] hover:border-amber-500/40 bg-[#0c0f1a] hover:bg-amber-500/[0.03] text-gray-400 hover:text-amber-400 transition-all duration-200"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">
                {storyFileName ? storyFileName : 'Click to upload .md file'}
              </span>
            </button>

            {storyFileName && (
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {storyFileName} loaded
                </span>
                <button
                  onClick={() => { setStoryContent(''); setStoryFileName(''); }}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <textarea
              value={storyContent}
              onChange={(e) => { setStoryContent(e.target.value); if (!storyFileName) setStoryFileName(''); }}
              placeholder={"Or paste your story / screenplay here...\n\nSupports markdown format.\n\nINT. COFFEE SHOP - DAY\n\nSARAH sits at a corner table, nervously tapping her fingers..."}
              className="flex-1 min-h-[180px] bg-[#0c0f1a] border border-[#1a1f35] rounded-lg p-3 text-sm text-gray-300 placeholder-gray-600 resize-none font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-gray-600">
                {storyContent.length > 0 ? `${storyContent.length.toLocaleString()} chars` : 'No content'}
              </span>
              {storyContent && (
                <span className="text-[10px] text-emerald-500/60">✓ Ready</span>
              )}
            </div>
          </div>

          {/* ══════ CHARACTERS ══════ */}
          <div className="glass-card rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Character Descriptions</h2>
                <p className="text-[10px] text-gray-500">Add characters for visual consistency</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <input
                type="text"
                value={newCharName}
                onChange={(e) => setNewCharName(e.target.value)}
                placeholder="Character name (e.g., Sarah)"
                className="w-full bg-[#0c0f1a] border border-[#1a1f35] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600"
              />
              <textarea
                value={newCharDesc}
                onChange={(e) => setNewCharDesc(e.target.value)}
                placeholder={"Visual description...\ne.g., A 28-year-old woman with long black hair, brown eyes, wearing a red leather jacket..."}
                className="w-full bg-[#0c0f1a] border border-[#1a1f35] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 resize-none h-[72px]"
              />
              <button
                onClick={addCharacter}
                disabled={!newCharName.trim() || !newCharDesc.trim()}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Character
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[200px] pr-1">
              {characters.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">No characters added yet</p>
                  <p className="text-[10px] text-gray-700 mt-1">Add characters for consistent prompts</p>
                </div>
              ) : (
                characters.map(char => (
                  <div
                    key={char.id}
                    className="group bg-[#0c0f1a] border border-[#1a1f35] rounded-lg p-3 hover:border-purple-500/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-purple-300 mb-0.5">{char.name}</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3">{char.description}</p>
                      </div>
                      <button
                        onClick={() => removeCharacter(char.id)}
                        className="flex-shrink-0 p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {characters.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#1a1f35]">
                <span className="text-[10px] text-gray-600">{characters.length} character{characters.length !== 1 ? 's' : ''} added</span>
              </div>
            )}
          </div>

          {/* ══════ PROMPT STYLE ══════ */}
          <div className="glass-card rounded-xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Palette className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Upload Your Prompt Style</h2>
                <p className="text-[10px] text-gray-500">Add reference prompts to match your style</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <textarea
                value={newRefPrompt}
                onChange={(e) => setNewRefPrompt(e.target.value)}
                placeholder={"Paste a reference image prompt here...\n\ne.g., Cinematic shot of a lone warrior standing on a cliff edge, golden hour lighting, dramatic clouds, shot with Arri Alexa, 35mm lens, shallow depth of field..."}
                className="w-full bg-[#0c0f1a] border border-[#1a1f35] rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 resize-none h-[100px]"
              />
              <button
                onClick={addRefPrompt}
                disabled={!newRefPrompt.trim()}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Reference Prompt
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[200px] pr-1">
              {referencePrompts.length === 0 ? (
                <div className="text-center py-6">
                  <Palette className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">No reference prompts yet</p>
                  <p className="text-[10px] text-gray-700 mt-1">AI will use default cinematic style</p>
                </div>
              ) : (
                referencePrompts.map((prompt, idx) => (
                  <div
                    key={idx}
                    className="group bg-[#0c0f1a] border border-[#1a1f35] rounded-lg overflow-hidden hover:border-amber-500/20 transition-colors"
                  >
                    <div
                      className="flex items-start justify-between gap-2 p-3 cursor-pointer"
                      onClick={() => setExpandedPromptIndex(expandedPromptIndex === idx ? null : idx)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-medium">
                            Ref #{idx + 1}
                          </span>
                          {expandedPromptIndex === idx ? (
                            <ChevronUp className="w-3 h-3 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-gray-500" />
                          )}
                        </div>
                        <p className={`text-[11px] text-gray-500 leading-relaxed ${expandedPromptIndex === idx ? '' : 'line-clamp-2'}`}>
                          {prompt}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeRefPrompt(idx); }}
                        className="flex-shrink-0 p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {referencePrompts.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#1a1f35]">
                <span className="text-[10px] text-gray-600">{referencePrompts.length} reference{referencePrompts.length !== 1 ? 's' : ''} added</span>
              </div>
            )}
          </div>
        </div>

        {/* ────── GENERATE BUTTON ────── */}
        <div className="mb-6">
          <button
            onClick={generatePrompts}
            disabled={isGenerating}
            className={`w-full relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-base font-bold transition-all duration-300
              ${isGenerating
                ? 'bg-[#141829] border-2 border-amber-500/30 text-amber-400 cursor-wait'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99]'
              }`}
          >
            <span className="relative flex items-center gap-3">
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{LOADING_MESSAGES[loadingMsgIndex]}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Story & Generate Shot Prompts</span>
                  <Camera className="w-5 h-5" />
                </>
              )}
            </span>
          </button>

          {/* Quick Status */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[11px] text-gray-600">
            <span className={storyContent ? 'text-emerald-500/60' : 'text-red-500/60'}>
              {storyContent ? '✓' : '✗'} Story
            </span>
            <span className="text-gray-700">|</span>
            <span className={characters.length > 0 ? 'text-emerald-500/60' : 'text-gray-500/40'}>
              {characters.length > 0 ? '✓' : '○'} {characters.length} Characters
            </span>
            <span className="text-gray-700">|</span>
            <span className={referencePrompts.length > 0 ? 'text-emerald-500/60' : 'text-gray-500/40'}>
              {referencePrompts.length > 0 ? '✓' : '○'} {referencePrompts.length} Ref Prompts
            </span>
            <span className="text-gray-700">|</span>
            <span className={apiKey ? 'text-emerald-500/60' : 'text-red-500/60'}>
              {apiKey ? '✓' : '✗'} {currentProvider.name}
            </span>
          </div>
        </div>

        {/* ────── ERROR ────── */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/[0.07] border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-400/50 hover:text-red-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ══════════ RESULTS ══════════ */}
        <div ref={resultsRef}>
          {scenes.length > 0 && (
            <div>
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/20">
                    <Clapperboard className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Generated Shot Prompts</h2>
                    <p className="text-xs text-gray-500">
                      {scenes.length} Scene{scenes.length !== 1 ? 's' : ''} · {totalShots} Shot{totalShots !== 1 ? 's' : ''} · {currentProvider.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allPrompts = scenes.flatMap(s => s.shots.map(sh => sh.imagePrompt)).join('\n\n---\n\n');
                      copyToClipboard(allPrompts, 'all');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141829] border border-[#1e2540] text-gray-400 hover:text-white hover:border-gray-500/30 transition-all text-xs font-medium"
                  >
                    {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'all' ? 'Copied!' : 'Copy All'}
                  </button>
                  <button
                    onClick={exportPrompts}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30 transition-all text-xs font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export .txt
                  </button>
                </div>
              </div>

              {/* Scene List */}
              <div className="space-y-5">
                {scenes.map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className="rounded-xl border border-[#1a1f35] overflow-hidden bg-[#0b0e18]"
                  >
                    {/* Scene Header */}
                    <button
                      onClick={() => toggleScene(scene.sceneNumber)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#0f1320] to-[#111627] hover:from-[#121730] hover:to-[#141a33] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                          <span className="text-sm font-bold text-amber-400">{scene.sceneNumber}</span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-white">{scene.sceneTitle}</h3>
                          <p className="text-[11px] text-gray-500">
                            {scene.shots.length} shot{scene.shots.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-1 rounded-md bg-[#141829] text-gray-500 border border-[#1e2540]">
                          Scene {scene.sceneNumber}
                        </span>
                        {expandedScenes.has(scene.sceneNumber) ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {/* Shots */}
                    {expandedScenes.has(scene.sceneNumber) && (
                      <div className="p-4 pt-2 space-y-3">
                        {scene.shots.map((shot) => (
                          <div
                            key={`${scene.sceneNumber}-${shot.shotNumber}`}
                            className="shot-card group rounded-xl bg-[#0d1019] border border-[#161c30] hover:border-[#1e2848] transition-all duration-200"
                          >
                            {/* Shot Header */}
                            <div className="flex flex-wrap items-center gap-2 p-4 pb-2">
                              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/15 font-semibold">
                                <Video className="w-3 h-3" />
                                Shot {shot.shotNumber}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                                <Camera className="w-3 h-3" />
                                {shot.shotType}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/15">
                                <Target className="w-3 h-3" />
                                {shot.cameraAngle}
                              </span>
                              {shot.cameraMovement && shot.cameraMovement !== 'Static' && shot.cameraMovement !== 'None' && (
                                <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                                  <Move className="w-3 h-3" />
                                  {shot.cameraMovement}
                                </span>
                              )}
                            </div>

                            {/* Shot Description */}
                            <div className="px-4 pb-2">
                              <p className="text-xs text-gray-500 italic">{shot.description}</p>
                            </div>

                            {/* Image Prompt */}
                            <div className="mx-4 mb-4 relative">
                              <div className="bg-[#080a12] rounded-lg border border-[#141929] p-4 pr-12">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Sparkles className="w-3 h-3 text-amber-400/60" />
                                  <span className="text-[10px] text-amber-400/60 font-medium uppercase tracking-wider">Image Prompt</span>
                                </div>
                                <p className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">
                                  {shot.imagePrompt}
                                </p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(shot.imagePrompt, `${scene.sceneNumber}-${shot.shotNumber}`)}
                                className="absolute top-3 right-3 p-2 rounded-lg bg-[#141829] border border-[#1e2540] text-gray-500 hover:text-amber-400 hover:border-amber-500/30 transition-all opacity-0 group-hover:opacity-100"
                                title="Copy prompt"
                              >
                                {copiedId === `${scene.sceneNumber}-${shot.shotNumber}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Summary */}
              <div className="mt-6 text-center py-6 border-t border-[#1a1f35]">
                <p className="text-xs text-gray-600">
                  Generated {totalShots} shot prompt{totalShots !== 1 ? 's' : ''} across {scenes.length} scene{scenes.length !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <button
                    onClick={generatePrompts}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#141829] border border-[#1e2540] text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-all text-xs font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                  <button
                    onClick={exportPrompts}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30 transition-all text-xs font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export All Prompts
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {scenes.length === 0 && !isGenerating && !error && (
            <div className="text-center py-16 opacity-40">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0f1219] border border-[#1a1f35] mb-4">
                <Camera className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">No shots generated yet</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Upload your story, add character descriptions, set your prompt style, and click
                "Analyze Story & Generate Shot Prompts" to get started.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="border-t border-[#111827] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <p className="text-[10px] text-gray-700">
            CinePrompt Studio — Story to Shot Prompt Generator
          </p>
          <p className="text-[10px] text-gray-700">
            Multi-AI Powered
          </p>
        </div>
      </footer>
    </div>
  );
}
