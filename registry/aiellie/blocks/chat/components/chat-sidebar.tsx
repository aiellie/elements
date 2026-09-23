"use client"

import { Notification03Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatNavPinned,
  ChatNavRecents,
  type ChatNavProps,
} from "@/registry/aiellie/blocks/chat/components/chat-nav-chats"
import { ChatNavMain } from "@/registry/aiellie/blocks/chat/components/chat-nav-main"
import { HelpMenu } from "@/registry/aiellie/components/help-menu"
import { usePanels } from "@/registry/aiellie/components/panels"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { UserMenu, type User } from "@/registry/aiellie/components/user-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"

/**
 * The top of the sidebar: the app's name, which takes you back to a new chat,
 * and search and activity at the other end. Until the app has a mark, the name
 * is set in type alone.
 */
function ChatSidebarHeader({
  onNewChat,
  onSearch,
  onActivity,
}: {
  onNewChat: () => void
  onSearch?: () => void
  onActivity?: () => void
}) {
  const { closeSheet } = usePanels()

  return (
    <SidebarHeader className="flex-row items-center gap-1 py-0">
      <SidebarMenu className="w-fit">
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              onNewChat()
              closeSheet()
            }}
            className="text-md w-fit font-medium"
          >
            <span>Chatle</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <div className="ms-auto flex items-center gap-0.5">
        <TooltipIconButton
          tooltip="Search"
          shortcut="⌘K"
          onClick={onSearch}
          className="size-7"
        >
          <HugeiconsIcon icon={Search01Icon} />
        </TooltipIconButton>
        <TooltipIconButton
          tooltip="Activity"
          shortcut="⌘⇧U"
          onClick={onActivity}
          className="size-7"
        >
          <HugeiconsIcon icon={Notification03Icon} />
        </TooltipIconButton>
      </div>
    </SidebarHeader>
  )
}

/**
 * The chat's sidebar, top to bottom: the app's name with search and activity,
 * where to start something, the pinned chats, the recent ones, and who is
 * signed in, with help beside them.
 *
 * It fills whatever panel the chat puts it in, which folds it away and makes
 * it a sheet on a phone, so it never collapses by itself. Its rows need a
 * `SidebarProvider` above them, which the chat holds open around the panels.
 */
function ChatSidebar({
  user,
  onNewChat,
  onProjects,
  onSearch,
  onActivity,
  ...chats
}: ChatNavProps & {
  user: User
  onNewChat: () => void
  onProjects?: () => void
  onSearch?: () => void
  onActivity?: () => void
}) {
  return (
    <Sidebar collapsible="none" className="w-full bg-background">
      <ChatSidebarHeader
        onNewChat={onNewChat}
        onSearch={onSearch}
        onActivity={onActivity}
      />
      <SidebarContent role="navigation" aria-label="Chats">
        <ChatNavMain onNewChat={onNewChat} onProjects={onProjects} />
        <ChatNavPinned {...chats} />
        <ChatNavRecents {...chats} />
      </SidebarContent>
      <SidebarFooter className="flex-row items-center gap-1">
        <div className="min-w-0 flex-1">
          <UserMenu user={user} />
        </div>
        <HelpMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

export { ChatSidebar }
