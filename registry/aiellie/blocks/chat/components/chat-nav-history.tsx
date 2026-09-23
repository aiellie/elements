"use client"

import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"

/**
 * Back and forward through the chats you have opened, the way a browser steps
 * through pages. Each is off while there is nowhere further to go that way.
 * The chat binds ⌘[ and ⌘] to the same moves.
 */
function ChatNavHistory({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
}: {
  canGoBack: boolean
  canGoForward: boolean
  onBack: () => void
  onForward: () => void
}) {
  return (
    <div className="flex items-center gap-0.5">
      <TooltipIconButton
        tooltip="Back"
        shortcut="⌘["
        disabled={!canGoBack}
        onClick={onBack}
        className="size-7"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} className="rtl:-scale-x-100" />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip="Forward"
        shortcut="⌘]"
        disabled={!canGoForward}
        onClick={onForward}
        className="size-7"
      >
          <HugeiconsIcon icon={ArrowRight02Icon} className="rtl:-scale-x-100" />
      </TooltipIconButton>
    </div>
  )
}

export { ChatNavHistory }
