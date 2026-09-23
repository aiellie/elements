"use client"

import {
  BookOpen01Icon,
  HelpCircleIcon,
  KeyboardIcon,
  Shield01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"

/**
 * Where to go for help: a question-mark button, named by its tooltip, that
 * opens a menu of the app's help and policy pages. It sits beside the user
 * menu at the foot of a sidebar, so the menu opens upward by default.
 *
 * Each item calls its handler; one left out still shows, doing nothing, so
 * the menu keeps its shape while the app is wired up.
 */
function HelpMenu({
  onPrivacy,
  onHelp,
  onShortcuts,
  onWhatsNew,
  side = "top",
}: {
  onPrivacy?: () => void
  onHelp?: () => void
  onShortcuts?: () => void
  onWhatsNew?: () => void
  side?: "top" | "bottom"
}) {
  return (
    <Menu>
      {/* One button is both: the tooltip names it, the menu is what it opens. */}
      <Tooltip>
        <TooltipTrigger
          render={
            <MenuTrigger
              render={
                <Button
                  data-slot="help-menu"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:text-foreground data-popup-open:text-foreground"
                />
              }
            />
          }
        >
          <HugeiconsIcon icon={HelpCircleIcon} aria-hidden />
          <span className="sr-only">Help</span>
        </TooltipTrigger>
        <TooltipContent side={side}>Help</TooltipContent>
      </Tooltip>
      <MenuContent side={side} align="end" className="min-w-48">
        <MenuItem onClick={onHelp}>
          <HugeiconsIcon icon={BookOpen01Icon} aria-hidden />
          Help
        </MenuItem>
        <MenuItem onClick={onShortcuts}>
          <HugeiconsIcon icon={KeyboardIcon} aria-hidden />
          Keyboard shortcuts
        </MenuItem>
        <MenuItem onClick={onWhatsNew}>
          <HugeiconsIcon icon={SparklesIcon} aria-hidden />
          What&apos;s new
        </MenuItem>
        <MenuSeparator />
        <MenuItem onClick={onPrivacy}>
          <HugeiconsIcon icon={Shield01Icon} aria-hidden />
          Privacy Center
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

export { HelpMenu }
