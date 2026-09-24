"use client"

import * as React from "react"
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Delete01Icon,
  Loading03Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  PinIcon,
  PinOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"
import { cn } from "@/lib/utils"

type ChatNavStatus = "running" | "completed" | "failed"

type ChatNavChat = {
  id: string
  title: string
  pinned?: boolean
  status?: ChatNavStatus
}

type ChatNavProps = {
  chats: ChatNavChat[]
  activeId: string | null
  /** Shows where each chat's latest run stands. */
  activity?: boolean
  onSelect: (id: string) => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}

// Fall back to Tailwind's own shades where the theme has no `--live` or
// `--success`.
const STATUS: Record<
  ChatNavStatus,
  { label: string; icon: IconSvgElement; className: string }
> = {
  running: {
    label: "Running",
    icon: Loading03Icon,
    className:
      "text-[color:var(--live,var(--color-blue-500))] [&_svg]:animate-spin motion-reduce:[&_svg]:animate-none",
  },
  completed: {
    label: "Completed",
    icon: CheckmarkCircle02Icon,
    className: "text-[color:var(--success,var(--color-emerald-600))]",
  },
  failed: {
    label: "Failed",
    icon: Alert02Icon,
    className: "text-destructive",
  },
}

// Sits where the options button appears, so it gives way whenever that does.
// On a touch screen the button never hides, so the mark moves in beside it.
function ChatNavStatusMark({ status }: { status: ChatNavStatus }) {
  const { label, icon, className } = STATUS[status]

  return (
    <SidebarMenuBadge
      className={cn(
        "min-w-5 px-0 transition-opacity duration-80 group-focus-within/menu-item:opacity-0 group-hover/menu-item:opacity-0 group-has-aria-expanded/menu-item:opacity-0 motion-reduce:transition-none pointer-coarse:end-7 pointer-coarse:opacity-100! [&_svg]:size-4",
        className
      )}
    >
      <HugeiconsIcon icon={icon} aria-hidden />
      <span className="sr-only">{label}</span>
    </SidebarMenuBadge>
  )
}

// An empty name keeps the old one rather than naming the chat nothing.
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

function ChatNavItem({
  chat,
  activeId,
  activity,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: Omit<ChatNavProps, "chats"> & { chat: ChatNavChat }) {
  const [renaming, setRenaming] = React.useState(false)
  const { closeSheet } = usePanels()
  const active = chat.id === activeId
  const status = activity ? chat.status : undefined

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
            className={cn(status && "pointer-coarse:pe-14")}
          >
            <span>{chat.title}</span>
          </SidebarMenuButton>
          {status ? <ChatNavStatusMark status={status} /> : null}
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

function ChatNavGroup({
  label,
  chats,
  ...props
}: ChatNavProps & { label: string }) {
  if (chats.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground/50">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {chats.map((chat) => (
          <ChatNavItem key={chat.id} chat={chat} {...props} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function ChatNavPinned({ chats, ...props }: ChatNavProps) {
  return (
    <ChatNavGroup
      label="Pinned"
      chats={chats.filter((chat) => chat.pinned)}
      {...props}
    />
  )
}

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
export type { ChatNavProps, ChatNavStatus }
