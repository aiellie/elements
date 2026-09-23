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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/registry/aiellie/ui/sidebar"
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
 * Your chats, newest first, with the open one marked. Each row has a menu for
 * renaming or deleting it. The menu stays out of the way until the row is
 * pointed at, except on touch screens, where there is no pointing.
 *
 * It is the sidebar's own `Sidebar`, so it takes the same `collapsible`: the
 * chat passes `none` where it lays the sidebar out itself, and leaves the
 * default on a phone, where `Sidebar` becomes a sheet.
 */
function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
  collapsible,
  className,
}: {
  conversations: { id: string; title: string }[]
  activeId: string | null
  onSelect: (id: string) => void
  onNewChat: () => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
  collapsible?: React.ComponentProps<typeof Sidebar>["collapsible"]
  className?: string
}) {
  const [renamingId, setRenamingId] = React.useState<string | null>(null)
  // On a phone the sidebar is a sheet over the chat, so picking a chat, or
  // starting one, is also done with the sheet.
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar
      collapsible={collapsible}
      className={cn("bg-background", className)}
    >
      <SidebarHeader className="h-12 flex-row items-center py-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onNewChat()
            setOpenMobile(false)
          }}
        >
          <HugeiconsIcon icon={PencilEdit02Icon} />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarContent role="navigation" aria-label="Chats">
        <SidebarGroup className="pt-0">
          {conversations.length > 0 ? (
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
          ) : null}
          <SidebarMenu className="gap-0.5">
            {conversations.map((conversation) => (
              <SidebarMenuItem key={conversation.id}>
                {conversation.id === renamingId ? (
                  <RenameField
                    title={conversation.title}
                    onDone={(title) => {
                      if (title) onRename(conversation.id, title)
                      setRenamingId(null)
                    }}
                  />
                ) : (
                  <>
                    <SidebarMenuButton
                      isActive={conversation.id === activeId}
                      aria-current={
                        conversation.id === activeId ? "page" : undefined
                      }
                      onClick={() => {
                        onSelect(conversation.id)
                        setOpenMobile(false)
                      }}
                    >
                      <span>{conversation.title}</span>
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
                        <span className="sr-only">
                          Options for {conversation.title}
                        </span>
                      </MenuTrigger>
                      <MenuContent align="start" className="min-w-36">
                        <MenuItem
                          onClick={() => setRenamingId(conversation.id)}
                        >
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
                  </>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export { ChatSidebar }
