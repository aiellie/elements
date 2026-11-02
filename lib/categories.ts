import {
  Add01Icon,
  BrainIcon,
  BubbleChatIcon,
  InputTextIcon,
  Layers01Icon,
  LayoutTwoColumnIcon,
  Notification03Icon,
  SourceCodeIcon,
  TouchInteraction01Icon,
  VoiceIcon,
  ChatIcon,
  CheckListIcon,
  Message01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import registry from "@/registry.json"

/**
 * What the gallery pages are divided by, in the order the sections run down a
 * page. Each id is also what an item lists under `categories` in
 * registry.json, so the registry and the gallery file an item under the same
 * word.
 */
export const CATEGORIES = {
  /** Things you think. */
  reasoning: { name: "Reasoning", icon: BrainIcon },
  /** Things you add. */
  composer: { name: "Composer", icon: Add01Icon },
  /** Things you press. */
  actions: { name: "Actions", icon: TouchInteraction01Icon },
  /** Things you type into or choose with. */
  inputs: { name: "Inputs", icon: InputTextIcon },
  /** Things that divide the page into regions. */
  layout: { name: "Layout", icon: LayoutTwoColumnIcon },
  /** Things that float over the page. */
  overlays: { name: "Overlays", icon: Layers01Icon },
  /** Things that report state: running, done, failed. */
  feedback: { name: "Feedback", icon: Notification03Icon },
  /** The pieces of a conversation. */
  messages: { name: "Messages", icon: Message01Icon },
  chat: { name: "Chat", icon: BubbleChatIcon },
  /** Talking to the assistant: what it hears, says and plays back. */
  voice: { name: "Voice", icon: VoiceIcon },
  /** An agent's work, and where a person steps in: plans, approvals, runs. */
  agents: { name: "Agents", icon: CheckListIcon },
  /** What a model wrote or ran: code, diffs and commands. */
  code: { name: "Code", icon: SourceCodeIcon },
  chatblock: { name: "Chat Block", icon: ChatIcon },
} satisfies Record<string, { name: string; icon: IconSvgElement }>

export type Category = keyof typeof CATEGORIES

/**
 * How many items of a registry type have a card: every one that names a
 * category does, and supporting items (lib, icons, hooks) don't. Read off
 * registry.json, so a page's count can't fall behind what it shows.
 */
export function cardCount(
  type: "registry:block" | "registry:ui" | "registry:component"
) {
  return registry.items.filter(
    (item) =>
      item.type === type && "categories" in item && !HIDDEN_ITEMS.has(item.name)
  ).length
}

// Still published and installable, but left out of the gallery, the sidebar
// and the pager. These are the parts the chat block no longer uses, kept for
// later.
export const HIDDEN_ITEMS = new Set<string>([
  "add-menu",
  "attachments",
  "branches-menu",
  "breadcrumb",
  "command",
  "dictate-button",
  "effort-menu",
  "empty",
  "file-preview",
  "marker",
  "nav-bars",
  "plugin-selector",
  "project-selector",
  "quick-chat",
  "settings-dialog",
  "share-dialog",
  "temporary-chat-toggle",
  "user-menu",
  "waveform",
  "work-in-menu",
])
