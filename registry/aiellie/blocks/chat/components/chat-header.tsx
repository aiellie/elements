"use client"

import {
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit02Icon,
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

/**
 * What the main panel's header shows: what this chat is called, and what can
 * be done to it. The panels draw the header itself and put the sidebar's
 * toggle beside this.
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
  return (
    <>
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
    </>
  )
}

export { ChatHeader }
