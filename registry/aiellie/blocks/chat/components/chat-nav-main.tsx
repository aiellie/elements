"use client"

import { Folder01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { usePanels } from "@/registry/aiellie/components/panels"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"

/**
 * The top of the sidebar: where to start something. On a phone the sidebar is
 * a sheet over the chat, so starting a chat puts the sheet away too.
 */
function ChatNavMain({
  onNewChat,
  onProjects,
}: {
  onNewChat: () => void
  /** Where the projects live. Left out, the row is there but goes nowhere. */
  onProjects?: () => void
}) {
  const { closeSheet } = usePanels()

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-0.5">
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              onNewChat()
              closeSheet()
            }}
          >
            <HugeiconsIcon icon={PencilEdit02Icon} aria-hidden />
            <span>New chat</span>
          </SidebarMenuButton>
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
