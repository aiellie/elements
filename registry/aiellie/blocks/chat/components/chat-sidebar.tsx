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
import { usePanels } from "@/registry/aiellie/components/panels"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/aiellie/ui/sidebar"

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
 * The sidebar's header: the way to a new chat. On a phone the sidebar is a
 * sheet over the chat, so starting one puts the sheet away too.
 */
function ChatSidebarHeader({ onNewChat }: { onNewChat: () => void }) {
  const { closeSheet } = usePanels()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        onNewChat()
        closeSheet()
      }}
    >
      <HugeiconsIcon icon={PencilEdit02Icon} />
      New chat
    </Button>
  )
}

/**
 * Your chats, newest first, with the open one marked. Each row has a menu for
 * renaming or deleting it. The menu stays out of the way until the row is
 * pointed at, except on touch screens, where there is no pointing.
 *
 * It fills whatever panel the chat puts it in, which folds it away and makes
 * it a sheet on a phone, so it never collapses by itself. The provider is only
 * there because the sidebar's rows read from it; it is held open for them.
 */
function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onRename,
  onDelete,
}: {
  conversations: { id: string; title: string }[]
  activeId: string | null
  onSelect: (id: string) => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}) {
  const [renamingId, setRenamingId] = React.useState<string | null>(null)
  // On a phone the sidebar is a sheet over the chat, so picking a chat is also
  // done with the sheet.
  const { closeSheet } = usePanels()

  return (
    <SidebarProvider open className="h-full min-h-0">
      <Sidebar collapsible="none" className="w-full bg-background">
        <SidebarContent role="navigation" aria-label="Chats">
          <SidebarGroup>
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
                          closeSheet()
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
    </SidebarProvider>
  )
}

export { ChatSidebar, ChatSidebarHeader }
