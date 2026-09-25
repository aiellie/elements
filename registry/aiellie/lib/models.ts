import type { ModelIconName } from "@/registry/aiellie/icons/model-icons"

interface ModelOption {
  /**
   * What `value` holds while this model is the chosen one: its Vercel AI
   * Gateway id, `vendor/model`.
   */
  id: string
  /** What the row says, and what the trigger says once this is chosen. */
  name: string
  vendor: ModelIconName
  /** Its id at the vendor's own API, where that isn't the part of `id` after the slash. */
  vendorId?: string
  /** Listed, but not choosable — a model the current plan does not include. */
  disabled?: boolean
}

type ModelProvider = "gateway" | "openai" | "anthropic" | "google"

interface ModelProviderOption {
  id: ModelProvider
  name: string
  /** The vendor whose models a key for it reaches. The gateway reaches them all. */
  vendor?: ModelIconName
  /** Which models its key reaches, in a few words. */
  description: string
  /** Where a key for it is made. */
  keysUrl: string
  /** How its keys begin, shown in an empty field. */
  placeholder: string
}

const VENDOR_NAMES: Record<ModelIconName, string> = {
  claude: "Anthropic",
  openai: "OpenAI",
  gemini: "Google",
  grok: "xAI",
  deepseek: "DeepSeek",
  mistral: "Mistral",
  v0: "Vercel",
}

// A group sits where its first model was, so the list needs no sorting.
function groupByVendor(models: ModelOption[]) {
  const groups = new Map<ModelIconName, ModelOption[]>()

  for (const model of models) {
    const group = groups.get(model.vendor)
    if (group) group.push(model)
    else groups.set(model.vendor, [model])
  }

  return [...groups]
}

// Replace them with the ones you serve. Any id on the Vercel AI Gateway works.
const MODELS: ModelOption[] = [
  {
    id: "anthropic/claude-opus-5.5",
    name: "Claude Opus 5.5",
    vendor: "claude",
    vendorId: "claude-opus-5-5",
  },
  {
    id: "anthropic/claude-sonnet-5",
    name: "Claude Sonnet 5",
    vendor: "claude",
  },
  { id: "openai/gpt-6-sol", name: "GPT-6 Sol", vendor: "openai" },
  {
    id: "google/gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro",
    vendor: "gemini",
  },
  { id: "spacexai/grok-4.7", name: "Grok 4.7", vendor: "grok" },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    vendor: "claude",
    vendorId: "claude-haiku-4-5",
  },
  {
    id: "deepseek/deepseek-v4.1-flash",
    name: "DeepSeek V4.1 Flash",
    vendor: "deepseek",
  },
  {
    id: "mistral/mistral-large-3",
    name: "Mistral Large 3",
    vendor: "mistral",
    disabled: true,
  },
]

const PROVIDERS: ModelProviderOption[] = [
  {
    id: "gateway",
    name: "Vercel AI Gateway",
    description: "One key for every model in the list.",
    keysUrl:
      "https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys&title=AI+Gateway+API+Keys",
    placeholder: "vck_…",
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT models.",
    vendor: "openai",
    keysUrl: "https://platform.openai.com/api-keys",
    placeholder: "sk-…",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models.",
    vendor: "claude",
    keysUrl: "https://platform.claude.com/settings/keys",
    placeholder: "sk-ant-…",
  },
  {
    id: "google",
    name: "Google",
    description: "Gemini models.",
    vendor: "gemini",
    keysUrl: "https://aistudio.google.com/apikey",
    placeholder: "AIza…",
  },
]

type ProviderKeys = Partial<Record<ModelProvider, string>>

// The vendor's own key when there is one, since it skips a hop; otherwise the
// gateway, which reaches every model.
function routeOf(model: ModelOption, keys: ProviderKeys) {
  const own = PROVIDERS.find((provider) => provider.vendor === model.vendor)
  if (own && keys[own.id]) {
    return {
      provider: own.id,
      model: model.vendorId ?? model.id.slice(model.id.indexOf("/") + 1),
      key: keys[own.id]!,
    }
  }
  if (keys.gateway) {
    return { provider: "gateway" as const, model: model.id, key: keys.gateway }
  }
  return null
}

export { VENDOR_NAMES, groupByVendor, MODELS, PROVIDERS, routeOf }
export type { ModelOption, ModelProvider, ModelProviderOption, ProviderKeys }
