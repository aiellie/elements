"use client"

import * as React from "react"
import {
  Delete01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"
import { cn } from "@/lib/utils"

/**
 * A chat's name, being changed in place. Enter or clicking away keeps the new
 * name and Escape puts the old one back. An empty name is taken to mean "never
 * mind" rather than a chat called nothing.
 */
function RenameField({
  title,
  onDone,
}: {
  title: string
  /** Called with the new name, or with nothing if the old one stays. */
  onDone: (title?: string) => void
}) {
  const [value, setValue] = React.useState(title)
  const inputRef = React.useRef<HTMLInputElement>(null)
  // Escape ends the edit by removing the field, and some browsers report that
  // as a blur, which would otherwise save the name Escape meant to throw away.
  const cancelledRef = React.useRef(false)

  React.useEffect(() => {
    // A frame late on purpose: the menu this was opened from hands focus back
    // to its trigger as it closes, and focus taken before then is lost again.
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <input
      ref={inputRef}
      value={value}
      aria-label="Chat name"
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => {
        if (!cancelledRef.current) onDone(value.trim() || undefined)
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          event.currentTarget.blur()
        } else if (event.key === "Escape") {
          event.preventDefault()
          cancelledRef.current = true
          onDone()
        }
      }}
      className="h-8 w-full min-w-0 rounded-lg border border-sidebar-ring bg-background px-2 text-sm outline-none"
    />
  )
}

/**
 * Your chats, newest first, with the open one marked. Each row has a menu for
 * renaming or deleting it. The menu stays out of the way until the row is
 * pointed at, except on touch screens, where there is no pointing.
 */
function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
  className,
}: {
  conversations: { id: string; title: string }[]
  activeId: string | null
  onSelect: (id: string) => void
  onNewChat: () => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
  className?: string
}) {
  const [renamingId, setRenamingId] = React.useState<string | null>(null)

  return (
    <div
      data-slot="chat-sidebar"
      className={cn(
        "flex h-full flex-col bg-background text-sidebar-foreground",
        className
      )}
    >
      <div className="flex h-12 shrink-0 items-center px-2">
        <Button variant="ghost" size="sm" onClick={onNewChat}>
          <HugeiconsIcon icon={PencilEdit02Icon} />
          New chat
        </Button>
      </div>
      <nav
        aria-label="Chats"
        className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2"
      >
        {conversations.length > 0 ? (
          <p className="px-2 pt-1 pb-1.5 text-xs text-muted-foreground">
            Recent
          </p>
        ) : null}
        {conversations.map((conversation) =>
          conversation.id === renamingId ? (
            <RenameField
              key={conversation.id}
              title={conversation.title}
              onDone={(title) => {
                if (title) onRename(conversation.id, title)
                setRenamingId(null)
              }}
            />
          ) : (
            <div
              key={conversation.id}
              className="group/row relative flex items-center"
            >
              <button
                type="button"
                aria-current={conversation.id === activeId ? "page" : undefined}
                onClick={() => onSelect(conversation.id)}
                className="flex h-8 w-full min-w-0 items-center rounded-lg border border-transparent px-2 pe-8 text-start text-sm transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:border-sidebar-ring aria-[current=page]:bg-sidebar-accent aria-[current=page]:text-sidebar-accent-foreground"
              >
                <span className="truncate">{conversation.title}</span>
              </button>
              <Menu>
                <MenuTrigger
                  render={<Button variant="ghost" size="icon-xs" />}
                  className="absolute end-1 text-muted-foreground transition-opacity motion-reduce:transition-none pointer-fine:opacity-0 pointer-fine:group-hover/row:opacity-100 pointer-fine:focus-visible:opacity-100 pointer-fine:aria-expanded:opacity-100"
                >
                  <HugeiconsIcon icon={MoreHorizontalIcon} />
                  <span className="sr-only">
                    Options for {conversation.title}
                  </span>
                </MenuTrigger>
                <MenuContent align="start" className="min-w-36">
                  <MenuItem onClick={() => setRenamingId(conversation.id)}>
                    <HugeiconsIcon icon={PencilEdit01Icon} />
                    Rename
                  </MenuItem>
                  <MenuItem
                    variant="destructive"
                    onClick={() => onDelete(conversation.id)}
                  >
                    <HugeiconsIcon icon={Delete01Icon} />
                    Delete
                  </MenuItem>
                </MenuContent>
              </Menu>
            </div>
          )
        )}
      </nav>
    </div>
  )
}

export { ChatSidebar }
