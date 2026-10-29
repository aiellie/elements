"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Toolbar, ToolbarButton } from "@/registry/aiellie/ui/toolbar"

type Highlight = {
  text: string
  /** Where the toolbar's bottom centre goes, inside the region. */
  x: number
  y: number
}

type MessageHighlightContextValue = {
  highlight: Highlight | null
  clear: () => void
}

const MessageHighlightContext =
  React.createContext<MessageHighlightContextValue>({
    highlight: null,
    clear: () => {},
  })

function useMessageHighlight() {
  return React.useContext(MessageHighlightContext)
}

// Keeps the toolbar this far from the region's sides and above the words.
const EDGE = 64
const GAP = 8

// Dismissed by a press somewhere else rather than by the selection going
// away: pressing a toolbar button collapses the selection before the button
// runs, so the words are captured when the selection is read.
function MessageHighlight({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const regionRef = React.useRef<HTMLDivElement>(null)
  const [highlight, setHighlight] = React.useState<Highlight | null>(null)

  const clear = React.useCallback(() => {
    setHighlight(null)
    document.getSelection()?.removeAllRanges()
  }, [])

  React.useEffect(() => {
    const region = regionRef.current
    if (!region) return

    const inToolbar = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("[data-slot=message-highlight-toolbar]"))

    const read = (event: Event) => {
      if (inToolbar(event.target)) return
      const selection = document.getSelection()
      const range =
        selection && !selection.isCollapsed && selection.rangeCount
          ? selection.getRangeAt(0)
          : null
      const text = selection?.toString().trim()
      if (!range || !text || !region.contains(range.commonAncestorContainer)) {
        setHighlight(null)
        return
      }
      const rect = range.getBoundingClientRect()
      const bounds = region.getBoundingClientRect()
      setHighlight({
        text,
        x: Math.min(
          Math.max(rect.left + rect.width / 2 - bounds.left, EDGE),
          Math.max(bounds.width - EDGE, EDGE)
        ),
        y: rect.top - bounds.top - GAP,
      })
    }

    const dismiss = (event: PointerEvent) => {
      if (!inToolbar(event.target)) setHighlight(null)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHighlight(null)
    }

    region.addEventListener("pointerup", read)
    region.addEventListener("keyup", read)
    document.addEventListener("pointerdown", dismiss)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      region.removeEventListener("pointerup", read)
      region.removeEventListener("keyup", read)
      document.removeEventListener("pointerdown", dismiss)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <MessageHighlightContext.Provider value={{ highlight, clear }}>
      <div
        ref={regionRef}
        data-slot="message-highlight"
        data-highlighted={highlight ? "" : undefined}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </MessageHighlightContext.Provider>
  )
}

function MessageHighlightToolbar({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Toolbar>) {
  const { highlight } = useMessageHighlight()
  if (!highlight) return null

  return (
    <Toolbar
      data-slot="message-highlight-toolbar"
      aria-label="Selected text"
      // Measured from the left edge, so placed from it in either direction.
      style={{ left: highlight.x, top: highlight.y, ...style }}
      className={cn(
        "absolute z-50 -translate-x-1/2 -translate-y-full gap-0.5 shadow-md backdrop-blur-xs",
        "animate-in duration-150 fade-in-0 zoom-in-95 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

function MessageHighlightAction({
  onAction,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof ToolbarButton>, "tooltip"> & {
  /** The button's name, shown on a hover. */
  tooltip: React.ReactNode
  /** Called with the selected words, after which the toolbar closes. */
  onAction?: (text: string) => void
}) {
  const { highlight, clear } = useMessageHighlight()

  return (
    <ToolbarButton
      data-slot="message-highlight-action"
      onClick={(event) => {
        onClick?.(event)
        if (highlight) onAction?.(highlight.text)
        clear()
      }}
      {...props}
    />
  )
}

export {
  MessageHighlight,
  MessageHighlightAction,
  MessageHighlightToolbar,
  useMessageHighlight,
}
