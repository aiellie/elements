"use client"

import * as React from "react"
import {
  Copy01Icon,
  GlobalIcon,
  Linkedin01Icon,
  LockIcon,
  NewTwitterIcon,
  RedditIcon,
  Share08Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"
import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { Button } from "@/registry/aiellie/ui/button"
import { Input } from "@/registry/aiellie/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/aiellie/ui/popover"

type ChatShareVisibility = "private" | "link"

const VISIBILITY = {
  private: {
    icon: LockIcon,
    label: "Only you",
    description: "Nobody else can open this chat.",
  },
  link: {
    icon: GlobalIcon,
    label: "Anyone with the link",
    description: "Anyone with the link can read the chat up to this point.",
  },
} as const

const PREVIEW_MESSAGES = 4

function ChatSharePreview({
  title,
  messages,
}: {
  title: string
  messages: ChatMessage[]
}) {
  return (
    <figure
      aria-label="Preview"
      className="flex flex-col gap-2 overflow-hidden rounded-sm border bg-background p-3"
    >
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="truncate text-xs font-medium">{title}</span>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </figcaption>
      <div className="flex max-h-36 flex-col gap-2 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_calc(100%-1.5rem),transparent)]">
        {messages.slice(0, PREVIEW_MESSAGES).map((message) => (
          <Message
            key={message.id}
            align={message.role === "user" ? "end" : "start"}
            variant={message.role === "user" ? "secondary" : "ghost"}
          >
            <MessageContent>
              <MessagePart className="px-2 py-0.5 text-xs leading-5 group-data-[variant=ghost]/message:p-0">
                {message.content}
              </MessagePart>
            </MessageContent>
          </Message>
        ))}
      </div>
    </figure>
  )
}

function ChatShareLink({ url, disabled }: { url: string; disabled: boolean }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <div className="flex items-center gap-2">
      <Input
        readOnly
        value={disabled ? "" : url}
        placeholder="No link while the chat is private"
        disabled={disabled}
        aria-label="Share link"
        onFocus={(event) => event.currentTarget.select()}
        className="h-7 text-xs"
      />
      <Button
        size="sm"
        disabled={disabled}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
          } catch {
            // Refused, so there is nothing to confirm.
          }
        }}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          data-icon="inline-start"
          aria-hidden
        />
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  )
}

function ChatShare({
  open,
  onOpenChange,
  title,
  url,
  messages,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  url: string
  messages: ChatMessage[]
}) {
  const [visibility, setVisibility] =
    React.useState<ChatShareVisibility>("link")
  const current = VISIBILITY[visibility]
  const shared = visibility === "link"

  const targets = [
    {
      label: "Share to X",
      icon: NewTwitterIcon,
      href: `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "Share to LinkedIn",
      icon: Linkedin01Icon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share to Reddit",
      icon: RedditIcon,
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
  ]

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={<Button variant="ghost" size="sm" />}>
        <HugeiconsIcon
          icon={Share08Icon}
          data-icon="inline-start"
          aria-hidden
        />
        Share
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Share chat</PopoverTitle>
          <PopoverDescription className="text-xs">
            {current.description}
          </PopoverDescription>
        </PopoverHeader>
        <ChatSharePreview title={title} messages={messages} />
        <Menu>
          <MenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              />
            }
          >
            <HugeiconsIcon
              icon={current.icon}
              data-icon="inline-start"
              aria-hidden
            />
            {current.label}
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              aria-hidden
              className="ms-auto text-muted-foreground"
            />
          </MenuTrigger>
          <MenuContent variant="solid" align="start" className="w-72">
            <MenuRadioGroup
              value={visibility}
              onValueChange={(value) =>
                setVisibility(value as ChatShareVisibility)
              }
            >
              {(Object.keys(VISIBILITY) as ChatShareVisibility[]).map((key) => (
                <MenuRadioItem key={key} value={key}>
                  <HugeiconsIcon icon={VISIBILITY[key].icon} />
                  {VISIBILITY[key].label}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
        <ChatShareLink url={url} disabled={!shared} />
        <div className="flex items-center gap-1 border-t pt-3">
          <span className="me-auto text-xs text-muted-foreground">
            Post it to
          </span>
          {targets.map((target) => (
            <TooltipIconButton
              key={target.label}
              tooltip={target.label}
              disabled={!shared}
              onClick={() =>
                window.open(target.href, "_blank", "noopener,noreferrer")
              }
              className="size-7"
            >
              <HugeiconsIcon icon={target.icon} aria-hidden />
            </TooltipIconButton>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { ChatShare }
