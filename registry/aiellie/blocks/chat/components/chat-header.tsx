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
import { ChatShare } from "@/registry/aiellie/blocks/chat/components/chat-share"
import { ChatTitle } from "@/registry/aiellie/blocks/chat/components/chat-title"
import {
  Menu,
  MenuContent,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { usePanels } from "@/registry/aiellie/components/panels"
import { TemporaryChatToggle } from "@/registry/aiellie/components/temporary-chat-toggle"
import { Button } from "@/registry/aiellie/ui/button"
import { Separator } from "@/registry/aiellie/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"

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
      <ChatTitle
        title={title}
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
          <ChatShare
            open={shareOpen}
            onOpenChange={onShareOpenChange}
            title={title}
            url={shareUrl}
            messages={messages}
          />
        ) : null}
      </div>
    </>
  )
}

export { ChatHeader }
