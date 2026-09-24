"use client"

import { BellDotIcon, BellIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatNavPinned,
  ChatNavRecents,
  type ChatNavProps,
} from "@/registry/aiellie/blocks/chat/components/chat-nav-chats"
import { ChatNavMain } from "@/registry/aiellie/blocks/chat/components/chat-nav-main"
import {
  ChatSwitcher,
  type ChatMode,
} from "@/registry/aiellie/blocks/chat/components/chat-switcher"
import { HelpMenu } from "@/registry/aiellie/components/help-menu"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { UserMenu, type User } from "@/registry/aiellie/components/user-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"
import { cn } from "@/lib/utils"

// Falls back to Tailwind's blue where the theme has no `--live`. Written out
// whole, since Tailwind only finds classes it can read as they are.
const liveOn =
  "bg-[color-mix(in_oklab,var(--live,var(--color-blue-500))_4%,transparent)] [&_svg]:text-[color:var(--live,var(--color-blue-500))] hover:bg-[color-mix(in_oklab,var(--live,var(--color-blue-500))_7%,transparent)] hover:[&_svg]:text-[color:var(--live,var(--color-blue-500))]"

function ChatSidebarHeader({
  mode,
  onModeChange,
  onSearch,
  activityOpen,
  onActivity,
}: {
  mode: ChatMode
  onModeChange: (mode: ChatMode) => void
  onSearch?: () => void
  activityOpen: boolean
  onActivity: () => void
}) {
  return (
    <SidebarHeader className="flex-row items-center gap-1 py-0">
      <SidebarMenu className="w-fit">
        <SidebarMenuItem>
          <ChatSwitcher value={mode} onValueChange={onModeChange} />
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

function ChatSidebar({
  user,
  usage,
  mode,
  onModeChange,
  onNewChat,
  onQuickChat,
  onProjects,
  onSearch,
  activityOpen,
  onActivity,
  ...chats
}: ChatNavProps & {
  user: User
  /** How much of the plan is left, e.g. "72% left". */
  usage?: string
  mode: ChatMode
  onModeChange: (mode: ChatMode) => void
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
        mode={mode}
        onModeChange={onModeChange}
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
        <ChatNavPinned {...chats} activity={activityOpen} />
        <ChatNavRecents {...chats} activity={activityOpen} />
      </SidebarContent>
      <SidebarFooter className="flex-row items-center gap-1 border-t border-border/50">
        <div className="min-w-0 flex-1">
          <UserMenu user={user} usage={usage} />
        </div>
        <HelpMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

export { ChatSidebar }
