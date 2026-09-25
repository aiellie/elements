"use client"

import * as React from "react"

import {
  NavBars,
  type NavBarsItem,
  type NavBarsVariant,
} from "@/registry/aiellie/components/nav-bars"
import {
  useThread,
  useThreadVisibility,
} from "@/registry/aiellie/components/thread"
import { cn } from "@/lib/utils"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function ThreadTranscript({
  items,
  variant = "list",
  className,
  ...props
}: Omit<React.ComponentProps<typeof NavBars>, "active" | "onSelect"> & {
  /** One per turn. Each `id` is the `messageId` of the thread item it jumps to. */
  items: NavBarsItem[]
  variant?: NavBarsVariant
}) {
  const { scrollToMessage } = useThread()
  const { visibleMessageIds, currentAnchorId } = useThreadVisibility()
  // The primitive scrolls smoothly from JavaScript, which the CSS
  // reduced-motion rule can't reach.
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )

  return (
    <NavBars
      data-slot="thread-transcript"
      aria-label="Transcript"
      items={items}
      variant={variant}
      active={items
        .map((item) => item.id)
        .filter(
          (id) => visibleMessageIds.includes(id) || currentAnchorId === id
        )}
      onSelect={(id) =>
        scrollToMessage(id, {
          align: "start",
          behavior: reducedMotion ? "auto" : "smooth",
        })
      }
      className={cn(
        "absolute start-2 top-1/2 z-10 -translate-y-1/2 pointer-coarse:hidden",
        className
      )}
      {...props}
    />
  )
}

export { ThreadTranscript }
