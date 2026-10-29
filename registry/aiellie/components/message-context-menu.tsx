"use client"

import * as React from "react"
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"
import { MenuContent } from "@/registry/aiellie/ui/menu"

const DEFAULT_REACTIONS = ["👍", "❤️", "😂", "🎉", "👀", "🙏"]

function MessageContextMenu(props: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root {...props} />
}

// Opens on right click and on a long press. Fits its message, so a right
// click in the empty half of the thread opens nothing.
function MessageContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="message-context-menu-trigger"
      className={cn(
        "w-fit max-w-full min-w-0 rounded-xl transition-opacity duration-150 data-popup-open:opacity-80 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function MessageContextMenuContent({
  sideOffset = 2,
  className,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  return (
    <MenuContent
      data-slot="message-context-menu-content"
      sideOffset={sideOffset}
      className={cn("w-56", className)}
      {...props}
    />
  )
}

function MessageReactionPicker({
  reactions = DEFAULT_REACTIONS,
  value = null,
  onValueChange,
  className,
  "aria-label": label = "React",
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  reactions?: readonly string[]
  /** The reaction you gave, if any. */
  value?: string | null
  /** Called with `null` when you take your reaction back. */
  onValueChange?: (value: string | null) => void
}) {
  return (
    <div
      data-slot="message-reaction-picker"
      role="group"
      aria-label={label}
      className={cn("flex items-center justify-between p-0.5", className)}
      {...props}
    >
      {reactions.map((reaction) => {
        const picked = value === reaction
        return (
          <MenuPrimitive.CheckboxItem
            key={reaction}
            data-slot="message-reaction"
            checked={picked}
            // Base UI keeps a checkbox row's menu open, but a reaction is done once picked.
            closeOnClick
            onCheckedChange={() => onValueChange?.(picked ? null : reaction)}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full text-base leading-none transition-[background-color,scale] duration-80 outline-none select-none active:scale-90 data-highlighted:bg-foreground/[0.06] motion-reduce:transition-none dark:data-highlighted:bg-foreground/[0.09] data-checked:bg-live/10 dark:data-checked:bg-live/20"
          >
            {reaction}
          </MenuPrimitive.CheckboxItem>
        )
      })}
    </div>
  )
}

export {
  DEFAULT_REACTIONS,
  MessageContextMenu,
  MessageContextMenuContent,
  MessageContextMenuTrigger,
  MessageReactionPicker,
}
