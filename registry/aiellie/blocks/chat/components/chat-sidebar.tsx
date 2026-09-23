"use client"

import {
  ChatNavPinned,
  ChatNavRecents,
  type ChatNavProps,
} from "@/registry/aiellie/blocks/chat/components/chat-nav-chats"
import { ChatNavMain } from "@/registry/aiellie/blocks/chat/components/chat-nav-main"
import { usePanels } from "@/registry/aiellie/components/panels"
import { UserMenu, type User } from "@/registry/aiellie/components/user-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"

/**
 * The sidebar's header: the app's name, which takes you back to a new chat.
 * It sits in the panel's own header, beside the toggle, rather than in the
 * sidebar under it. Until the app has a mark, the name is set in type alone.
 */
function ChatSidebarHeader({ onNewChat }: { onNewChat: () => void }) {
  const { closeSheet } = usePanels()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => {
            onNewChat()
            closeSheet()
          }}
          className="w-fit font-medium text-md"
        >
          <span>Chatle</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

/**
 * The chat's sidebar, top to bottom: where to start something, the pinned
 * chats, the recent ones, and who is signed in.
 *
 * It fills whatever panel the chat puts it in, which folds it away and makes
 * it a sheet on a phone, so it never collapses by itself. Its rows need a
 * `SidebarProvider` above them, which the chat holds open around the panels.
 */
function ChatSidebar({
  user,
  onNewChat,
  onProjects,
  ...chats
}: ChatNavProps & {
  user: User
  onNewChat: () => void
  onProjects?: () => void
}) {
  return (
    <Sidebar collapsible="none" className="w-full bg-background">
      <SidebarContent role="navigation" aria-label="Chats">
        <ChatNavMain onNewChat={onNewChat} onProjects={onProjects} />
        <ChatNavPinned {...chats} />
        <ChatNavRecents {...chats} />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

export { ChatSidebar, ChatSidebarHeader }
