import {
  BrainIcon,
  ChatIcon,
  CheckListIcon,
  InputTextIcon,
  Layers01Icon,
  LayoutTwoColumnIcon,
  Message01Icon,
  Notification03Icon,
  PencilEdit02Icon,
  SlidersHorizontalIcon,
  SourceCodeIcon,
  ThreadIcon,
  TouchInteraction01Icon,
  VoiceIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import registry from "@/registry.json"

/**
 * What the gallery pages are divided by, in the order the sections run down a
 * page. Each id is also what an item lists under `categories` in
 * registry.json, so the registry and the gallery file an item under the same
 * word. The chat categories hold `registry:component` items and show on
 * /components; the design ones hold `registry:ui` items and show on /design.
 */
export const CATEGORIES = {
  /** The scrolling conversation and its markers. */
  thread: { name: "Thread", icon: ThreadIcon },
  /** One message and what hangs off it. */
  messages: { name: "Messages", icon: Message01Icon },
  /** What a reply shows: its words, its thinking and what it drew on. */
  replies: { name: "Replies", icon: BrainIcon },
  /** Where a message is written, and what goes in with it. */
  composer: { name: "Composer", icon: PencilEdit02Icon },
  /** What a chat runs with: the model, its effort, its mode and its place. */
  options: { name: "Options", icon: SlidersHorizontalIcon },
  /** An agent's work, and where a person steps in: plans, approvals, runs. */
  agents: { name: "Agents", icon: CheckListIcon },
  /** What a model wrote or ran: code, diffs and commands. */
  code: { name: "Code", icon: SourceCodeIcon },
  /** Talking to the assistant: what it hears, says and plays back. */
  voice: { name: "Voice", icon: VoiceIcon },
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
  /** Whole pages. */
  chat: { name: "Chat", icon: ChatIcon },
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
// and the pager. Empty while every item has a card.
export const HIDDEN_ITEMS = new Set<string>([])
