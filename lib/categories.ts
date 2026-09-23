import {
  BubbleChatIcon,
  InputTextIcon,
  Layers01Icon,
  LayoutTwoColumnIcon,
  Notification03Icon,
  TouchInteraction01Icon,
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
  chat: { name: "Chat", icon: BubbleChatIcon },
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
    (item) => item.type === type && "categories" in item
  ).length
}
