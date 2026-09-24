"use client"

import * as React from "react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import {
  TooltipIconButton,
  type TooltipIconButtonProps,
} from "@/registry/aiellie/components/tooltip-icon-button"
import { cn } from "@/lib/utils"

function AddMenu({
  tooltip = "Add",
  side = "top",
  align = "start",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "render" | "children"> & {
  tooltip?: string
  /** Where both the menu and the tooltip open. */
  side?: TooltipIconButtonProps["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
  children: React.ReactNode
}) {
  return (
    <Menu>
      <MenuTrigger
        data-slot="add-menu"
        render={
          <TooltipIconButton
            tooltip={tooltip}
            side={side}
            className={cn(
              "size-7 shrink-0 rounded-full p-1.5 data-popup-open:bg-accent data-popup-open:[&_svg]:text-foreground",
              "[&>svg]:transition-transform [&>svg]:duration-150 [&>svg]:ease-out aria-expanded:[&>svg]:rotate-45 motion-reduce:[&>svg]:transition-none",
              className
            )}
          />
        }
        {...props}
      >
        <HugeiconsIcon aria-hidden icon={PlusSignIcon} strokeWidth={2} />
      </MenuTrigger>
      <MenuContent side={side} align={align}>
        {children}
      </MenuContent>
    </Menu>
  )
}

export { AddMenu }
