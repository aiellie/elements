"use client"

import type { ReactNode } from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/registry/aiellie/ui/sheet"
import { cn } from "@/lib/utils"

/**
 * A side panel on mobile, where its minimum width does not fit beside the
 * content: it slides in over the page instead, the way `Sidebar` in
 * components/ui/sidebar.tsx presents itself there. The shell puts the panel's
 * own header inside, toggle included, so the sheet's close button is dropped
 * rather than stacked on top of it.
 *
 * Painted `bg-background` like the rails, with the panel's own surfaces on
 * top: the light theme's `--sidebar` is translucent, which reads as white on
 * the white rail but as a murky overlay straight on the dimmed page.
 */
function PanelSheet({
  side,
  title,
  open,
  onOpenChange,
  className,
  children,
}: {
  side: "left" | "right"
  /** Accessible name of the sheet; the visible title is the panel header's. */
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  children: ReactNode
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        showCloseButton={false}
        className={cn("bg-background text-foreground", className)}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            The panel slides over the page on small screens.
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export { PanelSheet }