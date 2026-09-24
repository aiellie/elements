import type { ModelIconName } from "@/registry/aiellie/icons/model-icons"

interface ModelOption {
  /** What `value` holds while this model is the chosen one. */
  id: string
  /** What the row says, and what the trigger says once this is chosen. */
  name: string
  vendor: ModelIconName
  /** Listed, but not choosable — a model the current plan does not include. */
  disabled?: boolean
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

// Sample models. Replace them with the ones you serve.
const MODELS: ModelOption[] = [
  { id: "claude-opus", name: "Claude Opus", vendor: "claude" },
  { id: "claude-sonnet", name: "Claude Sonnet", vendor: "claude" },
  { id: "gpt", name: "GPT", vendor: "openai" },
  { id: "gemini-pro", name: "Gemini Pro", vendor: "gemini" },
  { id: "grok", name: "Grok", vendor: "grok" },
  { id: "claude-haiku", name: "Claude Haiku", vendor: "claude" },
  { id: "deepseek-chat", name: "DeepSeek Chat", vendor: "deepseek" },
  {
    id: "mistral-large",
    name: "Mistral Large",
    vendor: "mistral",
    disabled: true,
  },
  { id: "v0-md", name: "v0 md", vendor: "v0" },
]

export { VENDOR_NAMES, groupByVendor, MODELS }
export type { ModelOption }
