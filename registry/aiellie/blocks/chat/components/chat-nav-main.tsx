"use client"

import {
  Folder01Icon,
  PencilEdit02Icon,
  BubbleChatAddIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { usePanels } from "@/registry/aiellie/components/panels"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"

const kbd = "rounded-sm bg-background/15 px-1 font-sans"

function ChatNavMain({
  newChatOpen,
  onNewChat,
  onQuickChat,
  onProjects,
}: {
  newChatOpen: boolean
  onNewChat: () => void
  /** Left out, the button is there but does nothing. */
  onQuickChat?: () => void
  /** Where the projects live. Left out, the row is there but goes nowhere. */
  onProjects?: () => void
}) {
  const { closeSheet } = usePanels()

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-0.5">
        <SidebarMenuItem className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <SidebarMenuButton
                  isActive={newChatOpen}
                  aria-current={newChatOpen ? "page" : undefined}
                  aria-keyshortcuts="Meta+N"
                  onClick={() => {
                    onNewChat()
                    closeSheet()
                  }}
                  className="min-w-0 flex-1"
                />
              }
            >
              <HugeiconsIcon icon={PencilEdit02Icon} aria-hidden />
              <span>New chat</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              New chat
              <kbd data-slot="kbd" className={kbd}>
                ⌘N
              </kbd>
            </TooltipContent>
          </Tooltip>
          <TooltipIconButton
            tooltip="Quick chat"
            shortcut="⌘⇧N"
            aria-keyshortcuts="Meta+Shift+N"
            onClick={() => {
              onQuickChat?.()
              closeSheet()
            }}
            className="size-7.5 shrink-0"
          >
            <HugeiconsIcon icon={BubbleChatAddIcon} />
          </TooltipIconButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onProjects}>
            <HugeiconsIcon icon={Folder01Icon} aria-hidden />
            <span>Projects</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export { ChatNavMain }
