"use client"

import {
  Delete01Icon,
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
import { TemporaryChatToggle } from "@/registry/aiellie/components/temporary-chat-toggle"
import { Button } from "@/registry/aiellie/ui/button"

function ChatHeader({
  title,
  temporary = false,
  onTemporaryChange,
  onNewChat,
  onDelete,
}: {
  title: string
  temporary?: boolean
  /** Left out for a saved chat, which can't become temporary. */
  onTemporaryChange?: (temporary: boolean) => void
  onNewChat: () => void
  /** Left out for a new chat, which has nothing to delete yet. */
  onDelete?: () => void
}) {
  return (
    <>
      <h1 className="min-w-0 truncate px-1 text-sm font-medium">{title}</h1>
      <div className="ms-auto flex items-center gap-1">
        {onTemporaryChange ? (
          <TemporaryChatToggle
            pressed={temporary}
            onPressedChange={onTemporaryChange}
          />
        ) : null}
        <Menu>
          <MenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
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
                  <HugeiconsIcon icon={Delete01Icon} />
                  Delete chat
                </MenuItem>
              </>
            ) : null}
          </MenuContent>
        </Menu>
      </div>
    </>
  )
}

export { ChatHeader }
