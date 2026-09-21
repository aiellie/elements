import {
  BubbleChatIcon,
  InputTextIcon,
  Layers01Icon,
  Notification03Icon,
  TouchInteraction01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

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
  /** Things that float over the page. */
  overlays: { name: "Overlays", icon: Layers01Icon },
  /** Things that report state: running, done, failed. */
  feedback: { name: "Feedback", icon: Notification03Icon },
  /** The pieces of a conversation. */
  chat: { name: "Chat", icon: BubbleChatIcon },
} satisfies Record<string, { name: string; icon: IconSvgElement }>

export type Category = keyof typeof CATEGORIES
