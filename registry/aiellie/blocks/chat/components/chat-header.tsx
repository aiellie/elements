"use client"

import {
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { Button } from "@/registry/aiellie/ui/button"
import { useSidebar } from "@/registry/aiellie/ui/sidebar"

/**
 * The top of the page: the way to the sidebar, what this chat is called, and
 * what can be done to it. The toggle is the sidebar's own, so it opens the
 * sheet on a phone and folds the sidebar away everywhere else.
 */
function ChatHeader({
  title,
  onNewChat,
  onDelete,
}: {
  title: string
  onNewChat: () => void
  /** Left out for a new chat, which has nothing to delete yet. */
  onDelete?: () => void
}) {
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar()
  const sidebarOpen = isMobile ? openMobile : open

  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-b px-2">
      <TooltipIconButton
        tooltip={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        aria-expanded={sidebarOpen}
        onClick={toggleSidebar}
        className="size-7"
      >
        <HugeiconsIcon icon={SidebarLeftIcon} className="rtl:-scale-x-100" />
      </TooltipIconButton>
      <h1 className="min-w-0 truncate px-1 text-sm font-medium">{title}</h1>
      <Menu>
        <MenuTrigger
          render={<Button variant="ghost" size="icon-sm" className="ms-auto" />}
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} />
          <span className="sr-only">Chat options</span>
        </MenuTrigger>
        <MenuContent align="end">
          <MenuItem onClick={onNewChat}>
            <HugeiconsIcon icon={PencilEdit02Icon} />
            New chat
          </MenuItem>
          {onDelete ? (
            <>
              <MenuSeparator />
              <MenuItem variant="destructive" onClick={onDelete}>
                <HugeiconsIcon icon={Delete02Icon} />
                Delete chat
              </MenuItem>
            </>
          ) : null}
        </MenuContent>
      </Menu>
    </header>
  )
}

export { ChatHeader }
