"use client"

import * as React from "react"
import {
  Cancel01Icon,
  LayoutAlignBottomIcon,
  LayoutAlignLeftIcon,
  LayoutAlignRightIcon,
  SidebarBottomIcon,
  SidebarLeftIcon,
  SidebarRightIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Layout, LayoutChangedMeta } from "react-resizable-panels"
import { usePanelRef } from "react-resizable-panels"

import { useIsMobile } from "@/registry/aiellie/hooks/use-mobile"
import { Button } from "@/registry/aiellie/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/aiellie/ui/resizable"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/registry/aiellie/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"
import { cn } from "@/lib/utils"

type Side = "left" | "right" | "bottom"

/**
 * Everything that differs from one side to the next. Sizes are the panel's
 * default, smallest and largest, in any unit the library takes; the key is the
 * letter that toggles it with ⌘ or Ctrl.
 */
const PANELS = {
  left: {
    title: "Left",
    size: ["18rem", "12rem", "28rem"],
    key: "b",
    openIcon: SidebarLeftIcon,
    closedIcon: LayoutAlignLeftIcon,
  },
  right: {
    title: "Right",
    size: ["24rem", "16rem", "42rem"],
    key: "i",
    openIcon: SidebarRightIcon,
    closedIcon: LayoutAlignRightIcon,
  },
  bottom: {
    title: "Bottom",
    size: ["16rem", "8rem", "70%"],
    key: "j",
    openIcon: SidebarBottomIcon,
    closedIcon: LayoutAlignBottomIcon,
  },
} as const

type PanelsContextValue = {
  /** Whether each panel is on screen, its rail or, on a phone, its sheet. */
  isOpen: (side: Side) => boolean
  toggle: (side: Side) => void
  /**
   * Puts away whichever side panel is up as a sheet on a phone, and does
   * nothing on a wide screen, where the panel sits beside the page. For
   * content that is done once something in it is picked, like a list of
   * pages.
   */
  closeSheet: () => void
}

const PanelsContext = React.createContext<PanelsContextValue | null>(null)

function usePanels() {
  const context = React.useContext(PanelsContext)
  if (!context) throw new Error("usePanels must be used within <Panels>.")
  return context
}

/**
 * Opens and closes one panel, with a tooltip naming what it will do and the
 * key that does the same. With `close` it is a ghost × instead, for where the
 * panel is always open when the button is seen: its own header, or its sheet.
 */
function PanelToggle({ side, close = false }: { side: Side; close?: boolean }) {
  const { isOpen, toggle } = usePanels()
  const { title, key, openIcon, closedIcon } = PANELS[side]
  const open = isOpen(side)
  const label = `${open ? "Hide" : "Show"} ${title.toLowerCase()} panel`

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            data-slot="panel-toggle"
            variant={open && !close ? "secondary" : "ghost"}
            size="icon-sm"
            // A close button only ever closes, so it isn't a pressed toggle.
            aria-pressed={close ? undefined : open}
            onClick={() => toggle(side)}
          />
        }
      >
        {/* Keyed so the glyph remounts, and replays any entrance animation,
            as it swaps. */}
        <HugeiconsIcon
          key={String(open)}
          icon={close ? Cancel01Icon : open ? openIcon : closedIcon}
          aria-hidden
          className={cn(!(open && !close) && "text-muted-foreground")}
        />
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {label}
        <kbd
          data-slot="kbd"
          className="rounded-sm bg-background/15 px-1 font-sans"
        >
          ⌘{key.toUpperCase()}
        </kbd>
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * The bar across the top of a panel: its title, and its toggles at the end.
 * The title is the panel's name unless the page hands over a header of its
 * own, which gets the whole space between the toggles.
 */
function PanelHeader({
  title,
  start,
  end,
}: {
  title: React.ReactNode
  start?: React.ReactNode
  end?: React.ReactNode
}) {
  return (
    <header className="flex h-10 shrink-0 items-center gap-2 border-b bg-background px-2">
      {start}
      <div className="flex min-w-0 flex-1 items-center gap-1">
        {typeof title === "string" ? (
          <span className="min-w-0 truncate px-1 text-xs font-medium text-muted-foreground">
            {title}
          </span>
        ) : (
          title
        )}
      </div>
      {end ? (
        <div className="flex shrink-0 items-center gap-1">{end}</div>
      ) : null}
    </header>
  )
}

/**
 * One collapsible panel and the handle on its inner edge. It stays mounted and
 * collapses to nothing rather than unmounting, because an unmounted panel
 * hands its space to whichever neighbour has room, which can throw the other
 * side out to its largest size.
 *
 * While it is shut, its handle is disabled and hidden, so a closed panel opens
 * from its toggle and not by pulling its edge back out. The handle can't
 * simply go away: with no separator between two panels, the library lets the
 * gap between their edges be dragged instead.
 *
 * Its content never gets smaller than the panel's smallest size, so as the
 * panel folds away the content slides out of view instead of squeezing.
 */
function CollapsiblePanel({
  side,
  open,
  children,
}: {
  side: Side
  open: boolean
  children: React.ReactNode
}) {
  const panelRef = usePanelRef()
  const [defaultSize, minSize, maxSize] = PANELS[side].size

  // Only a change of `open` moves the panel, so a drag that closes it isn't
  // echoed back as an expand. The first pass runs on mount too, or an open
  // panel soaks up whatever space the group has left over.
  const syncedRef = React.useRef<boolean | null>(null)
  React.useEffect(() => {
    const panel = panelRef.current
    if (!panel || syncedRef.current === open) return
    syncedRef.current = open
    // Reopening always comes back at the default size, whatever a drag left.
    if (open) panel.resize(defaultSize)
    else panel.collapse()
  }, [open, panelRef, defaultSize])

  const handle = (
    <ResizableHandle
      withHandle
      disabled={!open}
      className={cn(!open && "pointer-events-none invisible")}
    />
  )

  // `defaultSize` and `minSize` are only read on mount, so they have to agree
  // with the first render, or a closed panel paints open once and claims its
  // minimum from a neighbour.
  const panel = (
    <ResizablePanel
      id={`panel-${side}`}
      panelRef={panelRef}
      // Shut, nothing in it can be tabbed to or read out, toggles included.
      inert={!open}
      collapsible
      collapsedSize={0}
      defaultSize={open ? defaultSize : 0}
      minSize={open ? minSize : 0}
      maxSize={maxSize}
      groupResizeBehavior="preserve-pixel-size"
      className="flex flex-col bg-background"
      style={{ overflow: "hidden" }}
    >
      <div
        className="flex min-h-0 flex-1 flex-col"
        style={
          side === "bottom" ? { minHeight: minSize } : { minWidth: minSize }
        }
      >
        {children}
      </div>
    </ResizablePanel>
  )

  return side === "left" ? (
    <>
      {panel}
      {handle}
    </>
  ) : (
    <>
      {handle}
      {panel}
    </>
  )
}

/** A panel's body, scrolling on its own under its header. */
function PanelBody({ children }: { children?: React.ReactNode }) {
  return <div className="min-h-0 flex-1 overflow-auto">{children}</div>
}

/**
 * On a phone the side panels don't fit beside the page, so they slide over it
 * as sheets instead, each with its own header and a × to close it.
 */
function PanelSheet({
  side,
  header,
  open,
  onOpenChange,
  children,
}: {
  side: "left" | "right"
  header?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) {
  const { title } = PANELS[side]
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        showCloseButton={false}
        className="gap-0 bg-background text-foreground"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{title} panel</SheetTitle>
          <SheetDescription>
            Slides over the page on small screens.
          </SheetDescription>
        </SheetHeader>
        <PanelHeader
          title={header ?? title}
          end={<PanelToggle side={side} close />}
        />
        <PanelBody>{children}</PanelBody>
      </SheetContent>
    </Sheet>
  )
}

/** How long a panel takes to open or close from its toggle, in milliseconds. */
const DURATION = 280

/**
 * While a toggle is at work, every panel eases to its new size. A drag has to
 * follow the pointer exactly, so the transition is only on for that long.
 */
const ANIMATING =
  "data-animating:*:transition-[flex-grow] data-animating:*:duration-280 data-animating:*:ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:*:transition-none"

/**
 * An app shell: the page in the middle, with a resizable panel on the left,
 * the right and along the bottom, each opened from the headers or with ⌘B, ⌘I
 * and ⌘J. Drag a panel's edge to resize it, or all the way in to close it.
 *
 * Only the panels given content are there, toggles and keys included, so a
 * page with a sidebar and nothing else passes `left` alone. Each header shows
 * the panel's name unless `headers` gives it something else, like the page's
 * title and its actions.
 *
 * It fills the window by default. Pass `className` to size it some other way,
 * e.g. `h-full` to fill a box.
 */
function Panels({
  left,
  right,
  bottom,
  headers = {},
  defaultOpen = { left: true, right: false, bottom: false },
  className,
  children,
}: {
  left?: React.ReactNode
  right?: React.ReactNode
  bottom?: React.ReactNode
  /** What each header shows in place of the panel's name. */
  headers?: Partial<Record<Side | "main", React.ReactNode>>
  defaultOpen?: Partial<Record<Side, boolean>>
  className?: string
  /** The page, in the main panel. */
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const hasLeft = left != null
  const hasRight = right != null
  const hasBottom = bottom != null
  const has = React.useMemo(
    () => ({ left: hasLeft, right: hasRight, bottom: hasBottom }),
    [hasLeft, hasRight, hasBottom]
  )
  // The rails, on a wide screen.
  const [open, setOpen] = React.useState({
    left: false,
    right: false,
    bottom: false,
    ...defaultOpen,
  })
  // The side sheet that is up, on a phone. It is separate from the rails so a
  // sheet never pops open by itself on the way down from a wide screen.
  const [sheet, setSheet] = React.useState<"left" | "right" | null>(null)
  const [animating, setAnimating] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(timerRef.current), [])

  const value = React.useMemo<PanelsContextValue>(
    () => ({
      isOpen: (side) =>
        isMobile && side !== "bottom" ? sheet === side : open[side],
      toggle: (side) => {
        if (isMobile && side !== "bottom") {
          setSheet((current) => (current === side ? null : side))
          return
        }
        clearTimeout(timerRef.current)
        setAnimating(true)
        timerRef.current = setTimeout(() => setAnimating(false), DURATION)
        setOpen((current) => ({ ...current, [side]: !current[side] }))
      },
      closeSheet: () => setSheet(null),
    }),
    [isMobile, open, sheet]
  )

  // Growing past a phone's width drops the sheets; forget them too, or
  // shrinking back would bring one straight back.
  if (!isMobile && sheet) setSheet(null)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey)
        return
      const side = (Object.keys(PANELS) as Side[]).find(
        (side) => has[side] && PANELS[side].key === event.key.toLowerCase()
      )
      if (!side) return
      event.preventDefault()
      value.toggle(side)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [value, has])

  // A drag or a resize key can close a panel, or open a closed one, so the
  // state follows the layout whenever the person, not the code, changed it.
  const syncFrom =
    (sides: Side[]) =>
    (layout: Layout, { isUserInteraction }: LayoutChangedMeta) => {
      if (!isUserInteraction) return
      setOpen((current) => {
        const next = { ...current }
        for (const side of sides) {
          if (has[side]) next[side] = (layout[`panel-${side}`] ?? 0) > 0
        }
        return next
      })
    }

  // The side rails stay shut on a phone, where the sheets stand in for them.
  const leftOpen = open.left && !isMobile
  const rightOpen = open.right && !isMobile
  const bottomToggle = has.bottom ? <PanelToggle side="bottom" /> : null

  return (
    <PanelsContext.Provider value={value}>
      <ResizablePanelGroup
        data-animating={animating || undefined}
        onLayoutChanged={syncFrom(isMobile ? [] : ["left", "right"])}
        className={cn("h-svh", ANIMATING, className)}
      >
        {has.left ? (
          <CollapsiblePanel side="left" open={leftOpen}>
            <PanelHeader
              title={headers.left ?? PANELS.left.title}
              end={<PanelToggle side="left" />}
            />
            {/* On a phone `left` is in its sheet, so it isn't mounted twice. */}
            <PanelBody>{isMobile ? null : left}</PanelBody>
          </CollapsiblePanel>
        ) : null}
        <ResizablePanel id="panel-content">
          <ResizablePanelGroup
            orientation="vertical"
            data-animating={animating || undefined}
            onLayoutChanged={syncFrom(["bottom"])}
            className={ANIMATING}
          >
            <ResizablePanel
              id="panel-main"
              className="flex flex-col"
              style={{ overflow: "hidden" }}
            >
              {/* A panel's toggle sits in its own header while it is open, and
                  falls back to this one, on the same side, once it closes. */}
              <PanelHeader
                title={headers.main ?? "Main"}
                start={
                  has.left && !leftOpen ? <PanelToggle side="left" /> : null
                }
                end={
                  rightOpen ? null : (
                    <>
                      {bottomToggle}
                      {has.right ? <PanelToggle side="right" /> : null}
                    </>
                  )
                }
              />
              <PanelBody>{children}</PanelBody>
            </ResizablePanel>
            {has.bottom ? (
              <CollapsiblePanel side="bottom" open={open.bottom}>
                <PanelHeader
                  title={headers.bottom ?? PANELS.bottom.title}
                  end={<PanelToggle side="bottom" close />}
                />
                <PanelBody>{bottom}</PanelBody>
              </CollapsiblePanel>
            ) : null}
          </ResizablePanelGroup>
        </ResizablePanel>
        {has.right ? (
          <CollapsiblePanel side="right" open={rightOpen}>
            <PanelHeader
              title={headers.right ?? PANELS.right.title}
              end={
                <>
                  {bottomToggle}
                  <PanelToggle side="right" />
                </>
              }
            />
            <PanelBody>{isMobile ? null : right}</PanelBody>
          </CollapsiblePanel>
        ) : null}
      </ResizablePanelGroup>

      {isMobile ? (
        <>
          {has.left ? (
            <PanelSheet
              side="left"
              header={headers.left}
              open={sheet === "left"}
              onOpenChange={(next) => setSheet(next ? "left" : null)}
            >
              {left}
            </PanelSheet>
          ) : null}
          {has.right ? (
            <PanelSheet
              side="right"
              header={headers.right}
              open={sheet === "right"}
              onOpenChange={(next) => setSheet(next ? "right" : null)}
            >
              {right}
            </PanelSheet>
          ) : null}
        </>
      ) : null}
    </PanelsContext.Provider>
  )
}

export { Panels, usePanels }
