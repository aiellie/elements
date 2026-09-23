import {
  AiElementsIcon,
  AiSwapIcon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons"

import type { PageMeta } from "@/components/pages/page-hero"
import type { NavPage } from "@/components/shared/nav-button"

export const ORG_URL = "https://aiellie.dev"
export const BASE_URL = "https://aiellie.app"
export const CLOUD_URL = "https://cloud.aiellie.app"
export const STATUS_URL = "https://status.aiellie.app"

export const CONTAINER = "mx-auto w-full max-w-7xl px-6 sm:px-10"

/**
 * Each section page's opening copy, keyed by its path. The nav is built from
 * the same entries, so its label and icon are always the page's own.
 */
export const PAGES = {
  "/": {
    eyebrow: "Blocks",
    title: "Whole pages, ready to install",
    icon: DashboardSquare01Icon,
    description:
      "Complete pages built from the components and primitives on this site. Start a new app with one, or add it to the app you have.",
  },
  "/components": {
    eyebrow: "Components",
    title: "AI-native components",
    icon: AiElementsIcon,
    description:
      "Everything designed here, from menus and toolbars to the pieces of a conversation. Each one installs on its own, into components/aiellie.",
  },
  "/ui": {
    eyebrow: "UI",
    title: "Restyled primitives",
    icon: AiSwapIcon,
    description:
      "shadcn's components in this system's style. Each one installs over your own copy in components/ui, and every call site keeps working.",
  },
} satisfies Record<string, PageMeta>

// The nav lists what is finished — a stub in it costs more than a short nav.
// Home isn't in it: the logo is the way back there.
export const NAV_PAGES: NavPage[] = (["/components", "/ui"] as const).map(
  (href) => ({ href, label: PAGES[href].eyebrow, icon: PAGES[href].icon })
)
