"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Transcript({ className, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)

  // Follows new lines while the reader is at the bottom, and lets them be
  // once they scroll up to reread.
  React.useLayoutEffect(() => {
    const region = ref.current
    if (!region) return
    const follow = () => {
      const distance =
        region.scrollHeight - region.scrollTop - region.clientHeight
      if (distance < 80) region.scrollTop = region.scrollHeight
    }
    follow()
    const observer = new MutationObserver(follow)
    observer.observe(region, {
      childList: true,
      subtree: true,
      characterData: true,
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-slot="transcript"
      role="log"
      aria-live="polite"
      tabIndex={0}
      className={cn(
        "flex max-h-64 w-full min-w-0 flex-col gap-2 overflow-y-auto overscroll-contain rounded-lg border border-transparent outline-none focus-visible:border-ring",
        className
      )}
      {...props}
    />
  )
}

function TranscriptSegment({
  speaker,
  interim = false,
  className,
  children,
  ...props
}: React.ComponentProps<"p"> & {
  /** Who said it. Leave it out for dictation. */
  speaker?: string
  /** Still a guess that may change: it shimmers, and screen readers skip it until it settles. */
  interim?: boolean
}) {
  return (
    <p
      data-slot="transcript-segment"
      data-interim={interim || undefined}
      aria-hidden={interim || undefined}
      className={cn("text-sm leading-6", className)}
      {...props}
    >
      {speaker ? (
        <span
          data-slot="transcript-speaker"
          className="me-2 text-xs font-medium text-muted-foreground"
        >
          {speaker}
        </span>
      ) : null}
      <span
        className={cn(
          interim && "shimmer text-muted-foreground motion-reduce:animate-none"
        )}
      >
        {children}
      </span>
    </p>
  )
}

export { Transcript, TranscriptSegment }
