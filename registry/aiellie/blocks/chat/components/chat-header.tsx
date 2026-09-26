"use client"

import * as React from "react"
import {
  MoreHorizontalIcon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"
import {
  ChatOptions,
  hasChatOptions,
  type ChatOptionsProps,
} from "@/registry/aiellie/blocks/chat/components/chat-options"
import { EditableTitle } from "@/registry/aiellie/components/editable-title"
import {
  Menu,
  MenuContent,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import { usePanels } from "@/registry/aiellie/components/panels"
import { ShareDialog } from "@/registry/aiellie/components/share-dialog"
import { TemporaryChatToggle } from "@/registry/aiellie/components/temporary-chat-toggle"
import {
  Thread,
  ThreadContent,
  ThreadItem,
  ThreadProvider,
  ThreadScrollButton,
  ThreadViewport,
} from "@/registry/aiellie/components/thread"
import { Button } from "@/registry/aiellie/ui/button"
import { Separator } from "@/registry/aiellie/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"

// What the share dialog shows of the chat: its title, and its messages in a
// small scrolling thread.
function ChatSharePreview({
  title,
  messages,
}: {
  title: string
  messages: ChatMessage[]
}) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-sm border bg-background">
      <figcaption className="flex items-baseline justify-between gap-2 border-b px-3 py-2">
        <span className="truncate text-xs font-medium">{title}</span>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </figcaption>
      <div className="flex h-56 flex-col">
        <ThreadProvider defaultScrollPosition="start">
          <Thread>
            <ThreadViewport aria-label="Preview">
              <ThreadContent className="gap-2 px-3 py-3">
                {messages.map((message) => (
                  <ThreadItem key={message.id} messageId={message.id}>
                    <Message
                      align={message.role === "user" ? "end" : "start"}
                      variant={message.role === "user" ? "secondary" : "ghost"}
                    >
                      <MessageContent>
                        <MessagePart className="px-2 py-0.5 text-xs leading-5 group-data-[variant=ghost]/message:p-0">
                          {message.content}
                        </MessagePart>
                      </MessageContent>
                    </Message>
                  </ThreadItem>
                ))}
              </ThreadContent>
            </ThreadViewport>
            <ThreadScrollButton />
          </Thread>
        </ThreadProvider>
      </div>
    </figure>
  )
}

function ChatHeaderNewChat({ onNewChat }: { onNewChat: () => void }) {
  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onNewChat}
              className="-ms-1 [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground"
            />
          }
        >
          <HugeiconsIcon icon={PencilEdit02Icon} aria-hidden />
          <span className="sr-only">New chat</span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          New chat
          <kbd
            data-slot="kbd"
            className="rounded-sm bg-background/15 px-1 font-sans"
          >
            ⌘N
          </kbd>
        </TooltipContent>
      </Tooltip>
      <Separator
        orientation="vertical"
        className="mx-1 data-vertical:h-4 data-vertical:self-center"
      />
    </>
  )
}

function ChatHeader({
  title,
  messages,
  shareUrl,
  temporary = false,
  onTemporaryChange,
  onNewChat,
  onRename,
  shareOpen,
  onShareOpenChange,
  ...options
}: Omit<ChatOptionsProps, "onRename" | "onShare"> & {
  title: string
  messages: ChatMessage[]
  /** Left out for a chat that can't be shared, which drops the Share button. */
  shareUrl?: string
  temporary?: boolean
  /** Left out for a saved chat, which can't become temporary. */
  onTemporaryChange?: (temporary: boolean) => void
  onNewChat: () => void
  /** Left out for a new chat, which has no name of its own yet. */
  onRename?: (title: string) => void
  shareOpen: boolean
  onShareOpenChange: (open: boolean) => void
}) {
  const { isOpen } = usePanels()
  const [editing, setEditing] = React.useState(false)

  const menu: ChatOptionsProps = {
    ...options,
    onRename: onRename ? () => setEditing(true) : undefined,
    onShare: shareUrl ? () => onShareOpenChange(true) : undefined,
  }

  return (
    <>
      {isOpen("left") ? null : <ChatHeaderNewChat onNewChat={onNewChat} />}
      <EditableTitle
        title={title}
        label="Chat name"
        editing={editing}
        onEditingChange={setEditing}
        onRename={onRename}
      />
      {hasChatOptions(menu) ? (
        <Menu>
          <MenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground"
              />
            }
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} aria-hidden />
            <span className="sr-only">Chat options</span>
          </MenuTrigger>
          <MenuContent align="start" className="min-w-36">
            <ChatOptions {...menu} />
          </MenuContent>
        </Menu>
      ) : null}
      <div className="ms-auto flex shrink-0 items-center gap-1">
        {onTemporaryChange ? (
          <TemporaryChatToggle
            pressed={temporary}
            onPressedChange={onTemporaryChange}
          />
        ) : null}
        {shareUrl ? (
          <ShareDialog
            open={shareOpen}
            onOpenChange={onShareOpenChange}
            title="Share chat"
            url={shareUrl}
            text={title}
            descriptions={{
              private: "Nobody else can open this chat.",
              link: "Anyone with the link can read the chat up to this point.",
            }}
            preview={<ChatSharePreview title={title} messages={messages} />}
          />
        ) : null}
      </div>
    </>
  )
}

export { ChatHeader }
