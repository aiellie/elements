import {
  AiElementsIcon,
  AiSwapIcon,
} from "@hugeicons/core-free-icons"
import type { NavPage } from "@/components/shared/nav-button"

  export const ORG_URL = "https://aiellie.dev"
  export const BASE_URL = "https://aiellie.app";
  export const CLOUD_URL = "https://cloud.aiellie.app";
  export const STATUS_URL = "https://status.aiellie.app";
  
  // The nav lists what is finished — a stub in it costs more than a short nav.
  export const CONTAINER = "mx-auto w-full max-w-7xl px-6 sm:px-10"

  export const NAV_PAGES: NavPage[] = [
    { href: "/components", label: "Components", icon: AiElementsIcon },
    { href: "/ui", label: "UI", icon: AiSwapIcon },
  ]