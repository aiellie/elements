"use client"

import { BubbleChatTemporaryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  TooltipIconButton,
  type TooltipIconButtonProps,
} from "@/registry/aiellie/components/tooltip-icon-button"
import { cn } from "@/lib/utils"

function TemporaryChatToggle({
  pressed,
  onPressedChange,
  tooltip = "Temporary chat",
  pressedTooltip = "Turn off temporary chat",
  className,
  ...props
}: Omit<
  TooltipIconButtonProps,
  "tooltip" | "children" | "onClick" | "aria-pressed"
> & {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  tooltip?: string
  pressedTooltip?: string
}) {
  return (
    <TooltipIconButton
      data-slot="temporary-chat-toggle"
      tooltip={pressed ? pressedTooltip : tooltip}
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "size-7 p-1.5 aria-pressed:bg-muted aria-pressed:[&_svg]:text-foreground",
        className
      )}
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={BubbleChatTemporaryIcon} />
    </TooltipIconButton>
  )
}

export { TemporaryChatToggle }
