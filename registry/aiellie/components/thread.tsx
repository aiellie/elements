"use client"

import * as React from "react"
import { ArrowDown02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/aiellie/ui/button"
import { cn } from "@/lib/utils"

/**
 * How close to the end still counts as being at it, so a pixel of rounding or
 * a small nudge doesn't let go of the newest message.
 */
const END_THRESHOLD = 32

type ThreadContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>
  atEnd: boolean
  setAtEnd: (atEnd: boolean) => void
  /** Whether new content should pull the view down with it. */
  followRef: React.RefObject<boolean>
  /** A jump to the end is under way, so passing scroll events don't count. */
  jumpingRef: React.RefObject<boolean>
  scrollToEnd: () => void
}

const ThreadContext = React.createContext<ThreadContextValue | null>(null)

function useThread() {
  const context = React.useContext(ThreadContext)
  if (!context) throw new Error("Thread parts must be used inside <Thread>.")
  return context
}

/**
 * The scrolling part of a conversation. It keeps to the newest message while a
 * reply streams in, lets go the moment someone scrolls up to read, and offers
 * a way back to the end until they return to it.
 */
function Thread({ className, ...props }: React.ComponentProps<"div">) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const followRef = React.useRef(true)
  const jumpingRef = React.useRef(false)
  const [atEnd, setAtEnd] = React.useState(true)

  const scrollToEnd = React.useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    followRef.current = true
    jumpingRef.current = true
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: still ? "auto" : "smooth",
    })
  }, [])

  return (
    <ThreadContext.Provider
      value={{
        viewportRef,
        atEnd,
        setAtEnd,
        followRef,
        jumpingRef,
        scrollToEnd,
      }}
    >
      <div
        data-slot="thread"
        className={cn("relative flex min-h-0 flex-1 flex-col", className)}
        {...props}
      />
    </ThreadContext.Provider>
  )
}

/**
 * The column the messages sit in, inside the area that scrolls. The column is
 * what gets watched: when it grows while the view is following, the view moves
 * to its end, so a streaming reply stays in sight without anyone scrolling.
 */
function ThreadContent({ className, ...props }: React.ComponentProps<"div">) {
  const { viewportRef, setAtEnd, followRef, jumpingRef } = useThread()
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return

    const measure = () => {
      const distance =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
      const atEnd = distance <= END_THRESHOLD
      if (atEnd) jumpingRef.current = false
      // A smooth jump passes through the middle of the thread on its way down,
      // and those in-between positions must not read as someone scrolling up.
      if (!jumpingRef.current) followRef.current = atEnd
      setAtEnd(atEnd)
    }

    const observer = new ResizeObserver(() => {
      if (followRef.current) viewport.scrollTop = viewport.scrollHeight
      measure()
    })

    viewport.addEventListener("scroll", measure, { passive: true })
    observer.observe(content)
    return () => {
      viewport.removeEventListener("scroll", measure)
      observer.disconnect()
    }
  }, [viewportRef, setAtEnd, followRef, jumpingRef])

  return (
    <div
      ref={viewportRef}
      data-slot="thread-viewport"
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
    >
      <div
        ref={contentRef}
        data-slot="thread-content"
        role="log"
        className={cn(
          "mx-auto flex min-h-full w-full max-w-2xl flex-col gap-6 px-4 py-6",
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * The way back to the newest message. It fades out rather than unmounting, and
 * is inert while hidden, so it can't be tabbed to when there is nowhere to go.
 */
function ThreadScrollButton({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children">) {
  const { atEnd, scrollToEnd } = useThread()

  return (
    <Button
      data-slot="thread-scroll-button"
      type="button"
      variant="outline"
      size="icon-sm"
      inert={atEnd}
      data-hidden={atEnd || undefined}
      onClick={scrollToEnd}
      className={cn(
        "absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-popover shadow-md backdrop-blur-xs supports-[backdrop-filter]:bg-background/60",
        "transition-opacity duration-150 data-hidden:pointer-events-none data-hidden:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowDown02Icon} strokeWidth={2} />
      <span className="sr-only">Jump to latest</span>
    </Button>
  )
}

export { Thread, ThreadContent, ThreadScrollButton }
