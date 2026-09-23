"use client"

import * as React from "react"
import type { CSSProperties, ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BrowserIcon,
  Cancel01Icon,
  LayoutBottomIcon,
  LayoutLeftIcon,
  LayoutRightIcon,
} from "@hugeicons/core-free-icons"
import type { Layout, LayoutChangedMeta } from "react-resizable-panels"
import { usePanelRef } from "react-resizable-panels"

import { PanelSheet } from "./panel-sheet"
import {
  BottomPanelToggle,
  LeftPanelToggle,
  RightPanelToggle,
} from "./panel-toggles"
import { PanelsProvider, usePanels } from "./panels"
import {
  RightPanelProvider,
  useRightPanel,
} from "./right-panel"
import { Button } from "@/registry/aiellie/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/aiellie/ui/resizable"
import { SidebarProvider, useSidebar } from "@/registry/aiellie/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/registry/aiellie/ui/tabs"
import { Toaster } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const LEFT_PANEL_DEFAULT_SIZE = "18rem"
const LEFT_PANEL_MIN_SIZE = "12rem"
const LEFT_PANEL_MAX_SIZE = "28rem"

const RIGHT_PANEL_DEFAULT_SIZE = "24rem"
const RIGHT_PANEL_MIN_SIZE = "16rem"
const RIGHT_PANEL_MAX_SIZE = "42rem"

const BOTTOM_PANEL_DEFAULT_SIZE = "16rem"
const BOTTOM_PANEL_MIN_SIZE = "8rem"
const BOTTOM_PANEL_MAX_SIZE = "70%"

// Panel ids double as the keys of the group's `Layout` object.
const LEFT_PANEL_ID = "panel-left"
const RIGHT_PANEL_ID = "panel-right"
const BOTTOM_PANEL_ID = "panel-bottom"

// The glyph on each panel's tab. One frame throughout with the edge that panel
// occupies picked out, so the set reads as the layout itself; the main panel
// gets the page instead, being what the other three sit around. `data-icon`
// tightens the tab's padding on the icon's side (see components/ui/tabs.tsx).
const LEFT_PANEL_ICON = (
  <HugeiconsIcon
    icon={LayoutLeftIcon}
    strokeWidth={1.75}
    data-icon="inline-start"
    className="size-3.5!"
  />
)
const MAIN_PANEL_ICON = (
  <HugeiconsIcon
    icon={BrowserIcon}
    strokeWidth={1.75}
    data-icon="inline-start"
    className="size-3.5!"
  />
)
const RIGHT_PANEL_ICON = (
  <HugeiconsIcon
    icon={LayoutRightIcon}
    strokeWidth={1.75}
    data-icon="inline-start"
    className="size-3.5!"
  />
)
const BOTTOM_PANEL_ICON = (
  <HugeiconsIcon
    icon={LayoutBottomIcon}
    strokeWidth={1.75}
    data-icon="inline-start"
    className="size-3.5!"
  />
)

/**
 * The right panel's icon: whatever the page filling it registered, and the
 * panel's own once nothing has — the same fallback its title makes.
 */
function rightPanelIcon(icon: HugeiconsIcon | null) {
  // aria-hidden: a brand mark carries its own <title>, which the tab would
  // otherwise read out ahead of the name right beside it.
  return icon ? (
    <HugeiconsIcon icon={icon as any} aria-hidden className="size-3.5!" />
  ) : (
    RIGHT_PANEL_ICON
  )
}

/** A collapsible panel sits at exactly 0% once it has snapped shut. */
function isExpanded(size: number | undefined) {
  return (size ?? 0) > 0
}

/** The grip only shows up once the handle is hovered, dragged or focused. */
const handleClassName = cn(
  "[&>div]:opacity-0 [&>div]:transition-opacity",
  "hover:[&>div]:opacity-100",
  "active:[&>div]:opacity-100",
  "focus-visible:[&>div]:opacity-100"
)

/** Each header holds a single tab, so they can all name it the same thing. */
const PANEL_TAB_VALUE = "panel"

/**
 * Fixed-height header pinned to the top of every panel. The panel's name is a
 * tab rather than a plain title — one tab for now, and the shape to grow into
 * once a panel holds more than one thing. `start` renders before it (the left
 * toggle lives there); `end` is pushed to the far edge (the right and bottom
 * toggles).
 */
function PanelHeader({
  icon,
  title,
  onClose,
  start,
  end,
  className,
}: {
  /** Sits inside the tab, ahead of the title. */
  icon?: ReactNode
  title: string
  /** Given one, the icon turns into a close button while the tab is hovered. */
  onClose?: () => void
  start?: ReactNode
  end?: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        "flex h-8 shrink-0 items-center gap-2 border-b px-2",
        className
      )}
    >
      {start}
      {/* The tab is sized off the header rather than off itself: `h-full!`
          beats the list's own `h-8`, which overhangs a header that spends one
          of its 8 pixels on the bottom border. The list is `w-fit`, so a long
          title would otherwise run straight past the panel — `max-w-full` here
          and `min-w-0` on either side of it are what make it truncate instead,
          leaving the toggles where they are. */}
      <Tabs defaultValue={PANEL_TAB_VALUE} className="h-full min-w-0">
        <TabsList
          variant="default"
          className="h-full! max-w-full cursor-pointer"
        >
          <TabsTrigger
            value={PANEL_TAB_VALUE}
            // A button inside a button is invalid HTML, so a tab that carries
            // one isn't rendered as one. Base UI puts the tab's role, focus
            // and keyboard handling on whatever element it is given.
            render={onClose ? <div /> : undefined}
            className="group/panel-tab min-w-0 text-xs text-muted-foreground"
          >
            {onClose ? (
              // The button covers the icon rather than displacing it, so the
              // swap doesn't shift the title on its way past: `-inset-1` grows
              // it from the icon's 14px out to the tab's own height, which is
              // the hit target a 14px button would be too small to give. It
              // stays up wherever hover isn't a thing — a touch screen, or the
              // panel's mobile sheet.
              <span className="relative flex size-3.5 shrink-0 items-center justify-center">
                <span className="transition-opacity group-hover/panel-tab:opacity-0">
                  {icon}
                </span>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Close"
                        onClick={onClose}
                        className="absolute -inset-1 size-auto opacity-0 transition-opacity group-hover/panel-tab:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
                      />
                    }
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      strokeWidth={2}
                      className="size-3.5!"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Close</TooltipContent>
                </Tooltip>
              </span>
            ) : (
              icon
            )}
            <span className="truncate">{title}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {end ? (
        <div className="ms-auto flex shrink-0 items-center gap-1">{end}</div>
      ) : null}
    </header>
  )
}

/**
 * Drives a panel from the header toggles. The panel stays mounted and collapses
 * to zero instead of unmounting: an unmounting panel hands its space to
 * whichever sibling has slack, which is how closing one side rail ends up
 * inflating the other one to its max width.
 */
function useCollapsiblePanel(open: boolean, size: string) {
  const panelRef = usePanelRef()

  // Last state both sides agree on, so dragging the handle shut doesn't get
  // echoed back as an expand. It starts `null` so the first pass runs on mount
  // as well: an open panel is otherwise free to soak up the group's leftover
  // space, which parks the left rail at its max width on load.
  const syncedRef = React.useRef<boolean | null>(null)

  React.useEffect(() => {
    const panel = panelRef.current
    if (!panel || syncedRef.current === open) {
      return
    }

    syncedRef.current = open
    if (open) {
      // Always reopen at the panel's own width, whatever a drag left behind.
      panel.resize(size)
    } else {
      panel.collapse()
    }
  }, [open, panelRef, size])

  return panelRef
}

/**
 * The application shell: resizable panels on the left, right and bottom around
 * the main content. Each panel carries a fixed header with its toggle; the
 * body below it is yours to fill — `left` renders inside the left panel (the
 * app sidebar lives there), `children` is the page in the main panel. On
 * mobile the left and right panels open as sheets over the page instead of
 * rails beside it, and `left` moves into the sheet.
 */
export function PanelShell({
  left,
  children,
}: Readonly<{ left?: ReactNode; children: ReactNode }>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as CSSProperties
      }
    >
      <PanelsProvider>
        <RightPanelProvider>
          <PanelShellBody left={left}>{children}</PanelShellBody>
          <PanelSheets left={left} />
        </RightPanelProvider>
      </PanelsProvider>
      <Toaster />
    </SidebarProvider>
  )
}

function PanelShellBody({
  left,
  children,
}: Readonly<{ left?: ReactNode; children: ReactNode }>) {
  // The same state the header toggles drive: `useSidebar` owns the left panel,
  // `usePanels` the other two. The side rails stay shut on mobile, where
  // their minimum widths do not fit alongside the content — the panels open
  // as sheets over the page there instead (see PanelSheets below).
  const { state, isMobile, setOpen } = useSidebar()
  const { rightOpen, bottomOpen, setRightOpen, setBottomOpen } = usePanels()
  // Whatever the page has put in the right panel; the body below is where it
  // portals to, and it names the header while it is up.
  const {
    title: rightTitle,
    icon: rightIcon,
    onClose: rightOnClose,
    setRailNode,
  } = useRightPanel()
  const leftOpen = !isMobile && state !== "collapsed"
  const rightPanelOpen = !isMobile && rightOpen

  const leftRef = useCollapsiblePanel(leftOpen, LEFT_PANEL_DEFAULT_SIZE)
  const rightRef = useCollapsiblePanel(rightPanelOpen, RIGHT_PANEL_DEFAULT_SIZE)
  const bottomRef = useCollapsiblePanel(bottomOpen, BOTTOM_PANEL_DEFAULT_SIZE)

  // Dragging a handle all the way snaps a panel shut, and dragging a shut one
  // back out opens it. Mirror that into the open state so the toggles (and the
  // next programmatic sync) agree with what is on screen. Only user drags and
  // resize keys count — programmatic changes already originate from state.
  const syncSidesFromLayout = React.useCallback(
    (layout: Layout, { isUserInteraction }: LayoutChangedMeta) => {
      if (!isUserInteraction || isMobile) return
      setOpen(isExpanded(layout[LEFT_PANEL_ID]))
      setRightOpen(isExpanded(layout[RIGHT_PANEL_ID]))
    },
    [isMobile, setOpen, setRightOpen]
  )

  const syncBottomFromLayout = React.useCallback(
    (layout: Layout, { isUserInteraction }: LayoutChangedMeta) => {
      if (!isUserInteraction) return
      setBottomOpen(isExpanded(layout[BOTTOM_PANEL_ID]))
    },
    [setBottomOpen]
  )

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      onLayoutChanged={syncSidesFromLayout}
      // Nothing defines these yet — a `calc()` naming an undefined custom
      // property is invalid, and an invalid height is simply dropped, which
      // leaves the whole shell as tall as its content instead of the window.
      // The fallbacks keep it valid until a real header and footer set them.
      className="mt-[var(--header-height,0px)] mb-[var(--footer-height,0px)]"
      style={{
        height:
          "calc(100svh - var(--header-height, 0px) - var(--footer-height, 0px))",
      }}
    >
      {/* `defaultSize` is only read on mount, so it has to agree with the state
          of that first render — otherwise a closed panel paints open once. The
          matching `minSize` matters just as much: the group clamps a panel up
          to its minimum, and a shut panel that claims 12rem takes that space
          off whichever neighbour has slack. */}
      <ResizablePanel
        id={LEFT_PANEL_ID}
        panelRef={leftRef}
        collapsible
        collapsedSize={0}
        defaultSize={leftOpen ? LEFT_PANEL_DEFAULT_SIZE : 0}
        minSize={leftOpen ? LEFT_PANEL_MIN_SIZE : 0}
        maxSize={LEFT_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        className="bg-background"
      >
        <div className="flex h-full flex-col overflow-hidden">
          <PanelHeader
            icon={LEFT_PANEL_ICON}
            title="Left"
            start={leftOpen ? <LeftPanelToggle /> : null}
            className="border-b-0 bg-sidebar"
          />
          {/* On mobile `left` lives in the sheet instead (see PanelSheets);
              the rail never opens there, so don't mount it twice. */}
          <div className="min-h-0 flex-1 overflow-auto">
            {isMobile ? null : left}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className={handleClassName} />
      <ResizablePanel id="panel-content">
        {/* The bottom panel splits the content area, so it stops short of the
            left and right panels. */}
        <ResizablePanelGroup
          orientation="vertical"
          onLayoutChanged={syncBottomFromLayout}
        >
          {/* h-full, not min-h-full: the page measures itself against the space
              the panel actually has, so opening the bottom panel squeezes the
              content instead of pushing it out of sight. */}
          <ResizablePanel id="panel-main" style={{ overflow: "hidden" }}>
            <div className="flex h-full flex-col">
              {/* A toggle lives in its own panel's header while that panel is
                  open and falls back to the main header once it closes — at the
                  same screen corner either way. Collapsed panels stay mounted,
                  so the toggle must not be rendered in both places at once.
                  (The mobile sheets are modal, so their header can carry a
                  second one while the rail's is behind the backdrop.) */}
              <PanelHeader
                icon={MAIN_PANEL_ICON}
                title="Main"
                start={leftOpen ? null : <LeftPanelToggle />}
                end={
                  rightPanelOpen ? null : (
                    <>
                      <BottomPanelToggle />
                      <RightPanelToggle />
                    </>
                  )
                }
              />
              <main className="flex min-h-0 w-full flex-1 justify-center overflow-auto">
                <div className="container h-full">{children}</div>
              </main>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className={handleClassName} />
          <ResizablePanel
            id={BOTTOM_PANEL_ID}
            panelRef={bottomRef}
            collapsible
            collapsedSize={0}
            defaultSize={bottomOpen ? BOTTOM_PANEL_DEFAULT_SIZE : 0}
            minSize={bottomOpen ? BOTTOM_PANEL_MIN_SIZE : 0}
            maxSize={BOTTOM_PANEL_MAX_SIZE}
            groupResizeBehavior="preserve-pixel-size"
            className="bg-background"
          >
            <div className="flex h-full flex-col overflow-hidden">
              <PanelHeader icon={BOTTOM_PANEL_ICON} title="Bottom" />
              <div className="min-h-0 flex-1 overflow-auto" />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle className={handleClassName} />
      <ResizablePanel
        id={RIGHT_PANEL_ID}
        panelRef={rightRef}
        collapsible
        collapsedSize={0}
        defaultSize={rightPanelOpen ? RIGHT_PANEL_DEFAULT_SIZE : 0}
        minSize={rightPanelOpen ? RIGHT_PANEL_MIN_SIZE : 0}
        maxSize={RIGHT_PANEL_MAX_SIZE}
        groupResizeBehavior="preserve-pixel-size"
        // min-h-0: a flex item defaults to min-height:auto, which lets tall
        // panel content stretch the panel instead of scrolling inside it.
        className="min-h-0 overflow-hidden bg-background"
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <PanelHeader
            icon={rightPanelIcon(rightIcon)}
            title={rightTitle ?? "Right"}
            onClose={rightOnClose ?? undefined}
            end={
              rightPanelOpen ? (
                <>
                  <BottomPanelToggle />
                  <RightPanelToggle />
                </>
              ) : null
            }
          />
          <div ref={setRailNode} className="min-h-0 flex-1 overflow-auto" />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

/**
 * The left and right panels on mobile. The rails never open there — their
 * minimum widths do not fit beside the content — so the same two panels slide
 * over the page as sheets, the way the app sidebar does on its own. Each sheet
 * carries the same header as its rail, toggle included: the toggles in the
 * main header sit behind the modal backdrop while a sheet is up, so the one in
 * the sheet is what closes it, at the same corner. Sheet content only mounts
 * while open, and the rail skips `left` on mobile, so it is never mounted
 * twice.
 */
function PanelSheets({ left }: Readonly<{ left?: ReactNode }>) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()
  const { rightOpenMobile, setRightOpenMobile } = usePanels()
  const {
    title: rightTitle,
    icon: rightIcon,
    onClose: rightOnClose,
    setSheetNode,
  } = useRightPanel()

  // Growing past the mobile breakpoint drops the sheets; clear their state
  // too, or shrinking back would bring an open sheet straight back.
  React.useEffect(() => {
    if (isMobile) return
    setOpenMobile(false)
    setRightOpenMobile(false)
  }, [isMobile, setOpenMobile, setRightOpenMobile])

  if (!isMobile) return null

  return (
    <>
      <PanelSheet
        side="left"
        title="Left panel"
        open={openMobile}
        onOpenChange={setOpenMobile}
      >
        <PanelHeader
          icon={LEFT_PANEL_ICON}
          title="Left"
          start={<LeftPanelToggle />}
          className="border-b-0 bg-sidebar"
        />
        <div className="min-h-0 flex-1 overflow-auto">{left}</div>
      </PanelSheet>
      <PanelSheet
        side="right"
        title="Right panel"
        open={rightOpenMobile}
        onOpenChange={setRightOpenMobile}
      >
        {/* Unlike the rail's header, no bottom toggle next to this one: the
            bottom panel sits behind the backdrop while the sheet is up. */}
        <PanelHeader
          icon={rightPanelIcon(rightIcon)}
          title={rightTitle ?? "Right"}
          onClose={rightOnClose ?? undefined}
          end={<RightPanelToggle />}
        />
        <div ref={setSheetNode} className="min-h-0 flex-1 overflow-auto" />
      </PanelSheet>
    </>
  )
}