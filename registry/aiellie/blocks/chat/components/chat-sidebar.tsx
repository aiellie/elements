"use client"

import { BellDotIcon, BellIcon, Search01Icon } from "@hugeicons/core-free-icons"
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
import { cn } from "@/lib/utils"

/**
 * Lit in the theme's live colour, or Tailwind's blue where a project has no
 * `--live`: this block can be installed without the aiellie theme. The fill is
 * the status formula, 4% at rest and 7% under the pointer. Written out whole,
 * since Tailwind only finds classes it can read as they are.
 */
const liveOn =
  "bg-[color-mix(in_oklab,var(--live,var(--color-blue-500))_4%,transparent)] [&_svg]:text-[color:var(--live,var(--color-blue-500))] hover:bg-[color-mix(in_oklab,var(--live,var(--color-blue-500))_7%,transparent)] hover:[&_svg]:text-[color:var(--live,var(--color-blue-500))]"

/**
 * The top of the sidebar: the app's name, which takes you back to a new chat,
 * and search and activity at the other end. Until the app has a mark, the name
 * is set in type alone.
 */
function ChatSidebarHeader({
  onNewChat,
  onSearch,
  activityOpen,
  onActivity,
}: {
  onNewChat: () => void
  onSearch?: () => void
  /** Whether activity is up, which lights the bell and gives it a dot. */
  activityOpen: boolean
  onActivity: () => void
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
            <span>Chat</span>
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
          aria-pressed={activityOpen}
          onClick={onActivity}
          className={cn("size-7", activityOpen && liveOn)}
        >
          <HugeiconsIcon icon={activityOpen ? BellDotIcon : BellIcon} />
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
  onQuickChat,
  onProjects,
  onSearch,
  activityOpen,
  onActivity,
  ...chats
}: ChatNavProps & {
  user: User
  onNewChat: () => void
  onQuickChat?: () => void
  onProjects?: () => void
  onSearch?: () => void
  activityOpen: boolean
  onActivity: () => void
}) {
  return (
    <Sidebar collapsible="none" className="w-full bg-background">
      <ChatSidebarHeader
        onNewChat={onNewChat}
        onSearch={onSearch}
        activityOpen={activityOpen}
        onActivity={onActivity}
      />
      <SidebarContent role="navigation" aria-label="Chats">
        <ChatNavMain
          newChatOpen={chats.activeId === null}
          onNewChat={onNewChat}
          onQuickChat={onQuickChat}
          onProjects={onProjects}
        />
        <ChatNavPinned {...chats} />
        <ChatNavRecents {...chats} />
      </SidebarContent>
      <SidebarFooter className="flex-row items-center gap-1 border-t border-border/50">
        <div className="min-w-0 flex-1">
          <UserMenu user={user} />
        </div>
        <HelpMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

export { ChatSidebar }
