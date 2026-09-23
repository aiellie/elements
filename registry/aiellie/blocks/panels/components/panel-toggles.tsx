"use client"

import type { ComponentProps } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  LayoutAlignBottomIcon,
  LayoutAlignLeftIcon,
  LayoutAlignRightIcon,
  SidebarBottomIcon,
  SidebarLeftIcon,
  SidebarRightIcon,
} from "@hugeicons/core-free-icons"

import {
  BOTTOM_PANEL_KEYBOARD_SHORTCUT,
  RIGHT_PANEL_KEYBOARD_SHORTCUT,
  usePanels,
} from "./panels"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { useSidebar } from "@/registry/aiellie/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type HugeIcon = ComponentProps<typeof HugeiconsIcon>["icon"]

type PanelToggleProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size" | "children"
> & {
  /** Whether the panel this button drives is currently open. */
  open: boolean
  onToggle: () => void
  /** Human name used in the tooltip and the accessible label, e.g. "left panel". */
  label: string
  /** Keyboard shortcut rendered in the tooltip, e.g. "⌘B". */
  shortcut: string
  openIcon: HugeIcon
  closedIcon: HugeIcon
  /**
   * Drawn as a close button instead: ghost with a cancel glyph, for places
   * where the panel is always open when the button is seen, such as its own
   * header or its sheet. The tooltip and the shortcut stay the same.
   */
  close?: boolean
}

/**
 * Icon button that opens and closes one panel. Closed: ghost + LayoutAlign
 * icon (an outline of where the panel would go). Open: secondary + Sidebar
 * icon. With `close`, a ghost cancel button. The tooltip names the action and
 * shows its keyboard shortcut.
 */
function PanelToggle({
  open,
  onToggle,
  label,
  shortcut,
  openIcon,
  closedIcon,
  close = false,
  onClick,
  className,
  ...props
}: PanelToggleProps) {
  const action = open ? "Hide" : "Show"
  const icon = close ? Cancel01Icon : open ? openIcon : closedIcon

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            data-slot="panel-toggle"
            data-state={open ? "open" : "closed"}
            variant={open && !close ? "secondary" : "ghost"}
            size="icon-sm"
            // A close button only ever closes, so it isn't a pressed toggle.
            aria-pressed={close ? undefined : open}
            className={className}
            onClick={(event) => {
              onClick?.(event)
              onToggle()
            }}
            {...props}
          />
        }
      >
        {/* Keyed by state so the icon swap remounts the <svg> and plays the
            panel-toggle-icon-in animation (see app/animations.css). */}
        <HugeiconsIcon
          key={open ? "open" : "closed"}
          icon={icon}
          className={open && !close ? undefined : "text-muted-foreground"}
        />
        <span className="sr-only">
          {action} {label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {action} {label}
        <Kbd>{shortcut}</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}

type SideToggleProps = Omit<
  PanelToggleProps,
  "open" | "onToggle" | "label" | "shortcut" | "openIcon" | "closedIcon"
>

/** Toggles the left panel; `useSidebar` owns its state and its ⌘B shortcut. */
function LeftPanelToggle(props: SideToggleProps) {
  const { state, isMobile, openMobile, toggleSidebar } = useSidebar()

  return (
    <PanelToggle
      // On mobile the shell keeps the rail shut and opens the panel as a sheet
      // instead; `openMobile` tracks that one, and `toggleSidebar` already
      // drives whichever applies.
      open={isMobile ? openMobile : state !== "collapsed"}
      onToggle={toggleSidebar}
      label="left panel"
      // Mirrors SIDEBAR_KEYBOARD_SHORTCUT in components/ui/sidebar.tsx.
      shortcut="⌘B"
      openIcon={SidebarLeftIcon}
      closedIcon={LayoutAlignLeftIcon}
      {...props}
    />
  )
}

function RightPanelToggle(props: SideToggleProps) {
  const { isMobile } = useSidebar()
  const { rightOpen, rightOpenMobile, toggleRight } = usePanels()

  return (
    <PanelToggle
      // Same split as the left toggle: rail on desktop, sheet on mobile.
      open={isMobile ? rightOpenMobile : rightOpen}
      onToggle={toggleRight}
      label="right panel"
      shortcut={`⌘${RIGHT_PANEL_KEYBOARD_SHORTCUT.toUpperCase()}`}
      openIcon={SidebarRightIcon}
      closedIcon={LayoutAlignRightIcon}
      {...props}
    />
  )
}

function BottomPanelToggle(props: SideToggleProps) {
  const { bottomOpen, toggleBottom } = usePanels()

  return (
    <PanelToggle
      open={bottomOpen}
      onToggle={toggleBottom}
      label="bottom panel"
      shortcut={`⌘${BOTTOM_PANEL_KEYBOARD_SHORTCUT.toUpperCase()}`}
      openIcon={SidebarBottomIcon}
      closedIcon={LayoutAlignBottomIcon}
      {...props}
    />
  )
}

export { PanelToggle, LeftPanelToggle, RightPanelToggle, BottomPanelToggle }
