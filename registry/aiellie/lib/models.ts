import type { ModelIconName } from "@/registry/aiellie/icons/model-icons"

/**
 * One model on offer. `vendor` does two jobs — it picks the mark the row wears
 * and the group the row is listed under — so a model is filed by saying whose
 * it is, rather than by being written into the right list.
 */
interface ModelOption {
  /** What `value` holds while this model is the chosen one. */
  id: string
  /** What the row says, and what the trigger says once this is chosen. */
  name: string
  /** Whose model it is, as a key of `modelIcons`. */
  vendor: ModelIconName
  /** Listed, but not choosable — a model the current plan does not include. */
  disabled?: boolean
}

/**
 * The heading over each vendor's rows. These name the company rather than the
 * product: a row already says "Claude" or "Gemini" in its own name, and a
 * heading that says it again tells the reader nothing the row did not.
 *
 * Typed against the set's keys, so a mark added to `model-icons` stops the
 * type check here until it has a name, instead of heading its group with
 * nothing. That check is the reason this is a plain type import — the marks
 * decide which vendors exist, and nothing here is allowed to disagree.
 */
const VENDOR_NAMES: Record<ModelIconName, string> = {
  claude: "Anthropic",
  openai: "OpenAI",
  gemini: "Google",
  grok: "xAI",
  deepseek: "DeepSeek",
  mistral: "Mistral",
  v0: "Vercel",
}

/**
 * The models, gathered by vendor. A group sits where its first model was and
 * rows keep the order they came in, so a menu reads the way the list was
 * written without anyone sorting it by vendor first.
 */
function groupByVendor(models: ModelOption[]) {
  const groups = new Map<ModelIconName, ModelOption[]>()

  for (const model of models) {
    const group = groups.get(model.vendor)
    if (group) group.push(model)
    else groups.set(model.vendor, [model])
  }

  return [...groups]
}

/**
 * A list to start from: one model from every vendor the marks cover, in the
 * order a product might have added them rather than sorted by vendor. Claude
 * Haiku comes after Grok and still lists under Anthropic, because a group sits
 * where its first model was. Mistral Large is the one the plan leaves out.
 *
 * Kept here rather than inside the selector because it is the part every
 * project replaces — the models you actually serve are yours, and the element
 * only ever takes them as data.
 */
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
