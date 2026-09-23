"use client"

import * as React from "react"
import {
  Delete01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  PinIcon,
  PinOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { usePanels } from "@/registry/aiellie/components/panels"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"

type ChatNavChat = { id: string; title: string; pinned?: boolean }

/** What both lists are handed: every chat, and what can be done to one. */
type ChatNavProps = {
  chats: ChatNavChat[]
  activeId: string | null
  onSelect: (id: string) => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}

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
    <SidebarInput
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
      className="rounded-lg border-sidebar-ring px-2 dark:bg-background"
    />
  )
}

/**
 * One chat in a list, marked when it is the open one. Its menu renames, pins
 * or deletes it, and stays out of the way until the row is pointed at, except
 * on touch screens, where there is no pointing.
 */
function ChatNavItem({
  chat,
  activeId,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: Omit<ChatNavProps, "chats"> & { chat: ChatNavChat }) {
  const [renaming, setRenaming] = React.useState(false)
  // On a phone the sidebar is a sheet over the chat, so picking a chat is also
  // done with the sheet.
  const { closeSheet } = usePanels()
  const active = chat.id === activeId

  return (
    <SidebarMenuItem>
      {renaming ? (
        <RenameField
          title={chat.title}
          onDone={(title) => {
            if (title) onRename(chat.id, title)
            setRenaming(false)
          }}
        />
      ) : (
        <>
          <SidebarMenuButton
            isActive={active}
            aria-current={active ? "page" : undefined}
            onClick={() => {
              onSelect(chat.id)
              closeSheet()
            }}
          >
            <span>{chat.title}</span>
          </SidebarMenuButton>
          <Menu>
            <MenuTrigger
              render={
                <SidebarMenuAction
                  showOnHover
                  className="text-muted-foreground pointer-coarse:opacity-100"
                />
              }
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} />
              <span className="sr-only">Options for {chat.title}</span>
            </MenuTrigger>
            <MenuContent align="start" className="min-w-36">
              <MenuItem onClick={() => onTogglePin(chat.id)}>
                <HugeiconsIcon icon={chat.pinned ? PinOffIcon : PinIcon} />
                {chat.pinned ? "Unpin" : "Pin"}
              </MenuItem>
              <MenuItem onClick={() => setRenaming(true)}>
                <HugeiconsIcon icon={PencilEdit01Icon} />
                Rename
              </MenuItem>
              <MenuSeparator />
              <MenuItem variant="destructive" onClick={() => onDelete(chat.id)}>
                <HugeiconsIcon icon={Delete01Icon} />
                Delete
              </MenuItem>
            </MenuContent>
          </Menu>
        </>
      )}
    </SidebarMenuItem>
  )
}

/** A labelled run of chats, gone altogether while it has none. */
function ChatNavGroup({
  label,
  chats,
  ...props
}: ChatNavProps & { label: string }) {
  if (chats.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {chats.map((chat) => (
          <ChatNavItem key={chat.id} chat={chat} {...props} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

/** The chats kept at the top, whatever came after them. */
function ChatNavPinned({ chats, ...props }: ChatNavProps) {
  return (
    <ChatNavGroup
      label="Pinned"
      chats={chats.filter((chat) => chat.pinned)}
      {...props}
    />
  )
}

/** Every other chat, newest first. */
function ChatNavRecents({ chats, ...props }: ChatNavProps) {
  return (
    <ChatNavGroup
      label="Recents"
      chats={chats.filter((chat) => !chat.pinned)}
      {...props}
    />
  )
}

export { ChatNavPinned, ChatNavRecents }
export type { ChatNavProps }
