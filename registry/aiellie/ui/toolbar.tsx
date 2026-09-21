"use client"

import * as React from "react"
import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"
import { cn } from "@/lib/utils"

/**
 * A row of controls that the keyboard treats as one stop. Tab reaches the
 * toolbar, the arrows walk it, and Tab again leaves — so a composer with eight
 * buttons on it costs one tab to pass rather than eight.
 *
 * The surface is the kit's: a glass pill the page shows through, sized to
 * its contents rather than stretched, so it can sit under a field or float
 * over a canvas without being told which.
 */
function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn(
        "flex w-fit max-w-full min-w-0 items-center gap-1 rounded-xl border border-border/40 bg-background/70 p-1 dark:bg-background/70",
        // Vertical is the same row turned, so the gap and the padding hold and
        // only the direction changes.
        "data-[orientation=vertical]:w-fit data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

/**
 * Controls that belong together, kept together. A group is one arrow-key
 * neighbourhood rather than a new tab stop, so it changes what the row looks
 * like without changing how it is walked.
 */
function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props) {
  return (
    <ToolbarPrimitive.Group
      data-slot="toolbar-group"
      className={cn(
        "flex items-center gap-0.5",
        "data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

/**
 * One control. The pressed look answers to `aria-pressed`, so a toggle says it
 * is on through the same attribute a screen reader reads it from rather than
 * through a second piece of state kept beside it.
 */
const toolbarButton = cn(
  "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground/55 transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none select-none",
  "hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-1 focus-visible:ring-foreground/5 active:scale-[0.94]",
  "aria-pressed:bg-foreground/[0.06] aria-pressed:text-foreground",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "motion-reduce:transition-none dark:hover:bg-foreground/[0.09] dark:aria-pressed:bg-foreground/[0.09]",
  "[&_svg:not([class*='size-'])]:size-3.5"
)

function ToolbarButton({
  className,
  tooltip,
  tooltipSide = "top",
  ...props
}: ToolbarPrimitive.Button.Props & {
  /** The button's name, shown on a hover. A glyph alone never says it. */
  tooltip?: React.ReactNode
  tooltipSide?: "top" | "bottom" | "left" | "right"
}) {
  const button = (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      className={cn(toolbarButton, className)}
      {...props}
    />
  )

  if (!tooltip) return button

  // `render` hands the trigger to the button that is already there rather than
  // wrapping it: a span around a toolbar item would sit between the row and
  // the control it is walking to.
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

/** The same control as a real link, so modified clicks keep working. */
function ToolbarLink({ className, ...props }: ToolbarPrimitive.Link.Props) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      className={cn(toolbarButton, className)}
      {...props}
    />
  )
}

/**
 * A field that lives in the row without trapping the arrows: Base UI hands the
 * caret the left and right keys while it is focused and gives them back to the
 * toolbar at either end of the text.
 */
function ToolbarInput({ className, ...props }: ToolbarPrimitive.Input.Props) {
  return (
    <ToolbarPrimitive.Input
      data-slot="toolbar-input"
      className={cn(
        "h-7 w-28 min-w-0 rounded-lg bg-background/70 px-2 text-xs text-foreground transition-colors outline-none",
        "placeholder:text-muted-foreground/70 hover:bg-background focus-visible:bg-background/70 focus-visible:ring-1 focus-visible:ring-foreground/5",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "motion-reduce:transition-none dark:hover:bg-foreground/[0.09] dark:focus-visible:bg-foreground/[0.09]",
        className
      )}
      {...props}
    />
  )
}

/**
 * The rule between two runs of controls. It turns with the toolbar, so a
 * vertical row gets a horizontal rule without being told twice.
 */
function ToolbarSeparator({
  className,
  ...props
}: ToolbarPrimitive.Separator.Props) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn(
        "shrink-0 bg-border",
        "data-[orientation=vertical]:mx-0.5 data-[orientation=vertical]:h-4 data-[orientation=vertical]:w-px",
        "data-[orientation=horizontal]:my-0.5 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        className
      )}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
  toolbarButton,
}