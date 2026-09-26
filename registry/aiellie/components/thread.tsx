"use client"

import * as React from "react"
import { ArrowDown02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MessageScroller as ThreadPrimitive,
  useMessageScroller as useThread,
  useMessageScrollerScrollable as useThreadScrollable,
  useMessageScrollerVisibility as useThreadVisibility,
} from "@shadcn/react/message-scroller"

import { Button } from "@/registry/aiellie/ui/button"
import { cn } from "@/lib/utils"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function ThreadProvider(
  props: React.ComponentProps<typeof ThreadPrimitive.Provider>
) {
  return <ThreadPrimitive.Provider {...props} />
}

function Thread({
  className,
  ...props
}: React.ComponentProps<typeof ThreadPrimitive.Root>) {
  return (
    <ThreadPrimitive.Root
      data-slot="thread"
      className={cn(
        "group/thread relative flex min-h-0 flex-1 flex-col overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function ThreadViewport({
  className,
  ...props
}: React.ComponentProps<typeof ThreadPrimitive.Viewport>) {
  return (
    <ThreadPrimitive.Viewport
      data-slot="thread-viewport"
      className={cn(
        "scroll-fade-size-6 size-full min-h-0 min-w-0 scroll-fade-b [scrollbar-width:thin] [scrollbar-gutter:stable] overflow-y-auto overscroll-contain border border-transparent contain-content outline-none data-autoscrolling:[scrollbar-color:transparent_transparent] data-pending-scroll:invisible",
        className
      )}
      {...props}
    />
  )
}

function ThreadContent({
  className,
  ...props
}: React.ComponentProps<typeof ThreadPrimitive.Content>) {
  return (
    <ThreadPrimitive.Content
      data-slot="thread-content"
      className={cn(
        "mx-auto flex h-max min-h-full w-full max-w-2xl flex-col gap-6 px-4 py-6",
        className
      )}
      {...props}
    />
  )
}

function ThreadItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof ThreadPrimitive.Item>) {
  return (
    <ThreadPrimitive.Item
      data-slot="thread-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className
      )}
      {...props}
    />
  )
}

function ThreadScrollButton({
  direction = "end",
  behavior,
  className,
  children,
  render,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof ThreadPrimitive.Button> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  // The primitive scrolls smoothly from JavaScript, which the CSS
  // reduced-motion rule can't reach.
  const reducedMotion = React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )

  return (
    <ThreadPrimitive.Button
      data-slot="thread-scroll-button"
      data-direction={direction}
      direction={direction}
      behavior={reducedMotion ? "auto" : behavior}
      className={cn(
        "absolute start-1/2 -translate-x-1/2 rounded-full bg-popover shadow-md backdrop-blur-xs supports-[backdrop-filter]:bg-background/60 rtl:translate-x-1/2",
        "transition-[opacity,translate,scale] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        "data-[active=false]:pointer-events-none data-[active=false]:opacity-0 data-[active=false]:ease-[cubic-bezier(0.4,0,1,1)]",
        "data-[direction=end]:bottom-3 data-[direction=end]:data-[active=false]:translate-y-2 data-[direction=start]:top-3 data-[direction=start]:data-[active=false]:-translate-y-2 data-[direction=start]:[&_svg]:rotate-180",
        className
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <HugeiconsIcon icon={ArrowDown02Icon} strokeWidth={2} aria-hidden />
          <span className="sr-only">
            {direction === "end" ? "Jump to latest" : "Jump to start"}
          </span>
        </>
      )}
    </ThreadPrimitive.Button>
  )
}

export {
  Thread,
  ThreadContent,
  ThreadItem,
  ThreadProvider,
  ThreadScrollButton,
  ThreadViewport,
  useThread,
  useThreadScrollable,
  useThreadVisibility,
}
