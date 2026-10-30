"use client"

import * as React from "react"
import {
  Brain02Icon,
  Globe02Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ChatAttachments } from "@/registry/aiellie/blocks/chat/components/chat-attachments"
import type {
  ChatMessage,
  ChatSource,
} from "@/registry/aiellie/blocks/chat/lib/chat-types"
import { InlineCitation } from "@/registry/aiellie/components/inline-citation"
import {
  Message,
  MessageActions,
  MessageContent,
  MessageFooter,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  MessageCopyAction,
  MessageEditAction,
  MessageRetryAction,
} from "@/registry/aiellie/components/message-actions"
import { Response } from "@/registry/aiellie/components/response"
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/registry/aiellie/ui/status"
import {
  Source,
  Sources,
  type SourcePreview,
} from "@/registry/aiellie/components/sources"
import {
  ThinkingIndicator,
  formatDuration,
} from "@/registry/aiellie/components/thinking-indicator"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/aiellie/ui/trace"
import {
  DateDivider,
  isSameDay,
} from "@/registry/aiellie/components/date-divider"
import { ThreadItem } from "@/registry/aiellie/components/thread"

// A browser can't read another site's page, so the block's own route does,
// and hands back its title, description, image and icon.
async function loadLinkPreview(href: string): Promise<SourcePreview | null> {
  const response = await fetch(
    `/api/link-preview?url=${encodeURIComponent(href)}`
  )
  return response.ok ? response.json() : null
}

// Above the first message, and wherever the chat picks up on a later day.
function dividerDate(messages: ChatMessage[], index: number) {
  const date = messages[index].createdAt
  if (!date) return null
  const previous = messages.slice(0, index).findLast((m) => m.createdAt)
  return previous?.createdAt && isSameDay(previous.createdAt, date)
    ? null
    : date
}

// A link the reply makes to a page it found becomes that page's number.
function citeSources(sources: ChatSource[] | undefined) {
  if (!sources?.length) return undefined
  return {
    a({ href, children }: React.ComponentProps<"a">) {
      const index = sources.findIndex((source) => source.url === href)
      if (index === -1) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )
      }
      return (
        <InlineCitation
          href={sources[index].url}
          index={index + 1}
          title={sources[index].title}
        />
      )
    },
  }
}

function ChatToolValue({ title, value }: { title: string; value: unknown }) {
  return (
    <section className="flex min-w-0 flex-col gap-1">
      <h4 className="text-xs font-medium">{title}</h4>
      <pre
        dir="ltr"
        tabIndex={0}
        className="max-h-48 min-w-0 overflow-auto rounded-md bg-muted px-3 py-2 font-mono text-xs leading-5 text-foreground outline-none"
      >
        {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
      </pre>
    </section>
  )
}

// Opens while the model thinks and folds shut once it's done, unless the
// person has opened or shut it themselves, which it then leaves alone.
function ChatTraceReasoning({ message }: { message: ChatMessage }) {
  const working = message.status === "streaming" && !message.content
  const [open, setOpen] = React.useState(working)
  const [chosen, setChosen] = React.useState(false)
  const [wasWorking, setWasWorking] = React.useState(working)
  if (working !== wasWorking) {
    setWasWorking(working)
    if (!chosen) setOpen(working)
  }

  return (
    <TraceCollapsible
      open={open}
      onOpenChange={(next) => {
        setChosen(true)
        setOpen(next)
      }}
    >
      <TraceCollapsibleTrigger>
        {working ? (
          <ThinkingIndicator startedAt={message.createdAt}>
            {message.activity ?? "Thinking"}
          </ThinkingIndicator>
        ) : (
          <TraceLine>
            <TraceIcon>
              <HugeiconsIcon icon={Brain02Icon} />
            </TraceIcon>
            <TraceTitle>
              {message.reasoningDuration === undefined
                ? "Worked for a moment"
                : `Worked for ${formatDuration(message.reasoningDuration)}`}
            </TraceTitle>
          </TraceLine>
        )}
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {message.reasoning}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function ChatTrace({ message }: { message: ChatMessage }) {
  return (
    <Trace>
      {message.reasoning ? <ChatTraceReasoning message={message} /> : null}
      {message.tools?.map((tool) => (
        <TraceCollapsible key={tool.id}>
          <TraceCollapsibleTrigger>
            <TraceLine
              status={tool.status === "done" ? undefined : tool.status}
            >
              <TraceIcon>
                <HugeiconsIcon
                  icon={tool.kind === "search" ? Globe02Icon : Wrench01Icon}
                />
              </TraceIcon>
              <TraceTitle className="shrink-0">{tool.name}</TraceTitle>
              {tool.summary ? (
                <TraceDescription>“{tool.summary}”</TraceDescription>
              ) : null}
              {tool.status === "done" ? null : (
                <span className="sr-only">
                  , {tool.status === "error" ? "Failed" : "Running"}
                </span>
              )}
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent className="flex flex-col gap-3">
            {tool.input !== undefined ? (
              <ChatToolValue title="Input" value={tool.input} />
            ) : null}
            {tool.output !== undefined ? (
              <ChatToolValue title="Output" value={tool.output} />
            ) : null}
          </TraceCollapsibleContent>
        </TraceCollapsible>
      ))}
    </Trace>
  )
}

function ChatMessages({
  messages,
  onRetry,
  onEdit,
}: {
  messages: ChatMessage[]
  onRetry: (id: string) => void
  onEdit: (content: string) => void
}) {
  return messages.map((message, index) => {
    const streaming = message.status === "streaming"
    // Until the words start, the reasoning row, or failing that the thinking
    // indicator, says what the reply is doing. A search partway through the
    // words shows the indicator after them.
    const indicator =
      streaming && (message.content ? message.activity : !message.reasoning)
    const divider = dividerDate(messages, index)

    return (
      <React.Fragment key={message.id}>
        {divider ? (
          <ThreadItem>
            <DateDivider date={divider} className="py-2" />
          </ThreadItem>
        ) : null}
        <ThreadItem
          messageId={message.id}
          scrollAnchor={message.role === "user"}
        >
          <Message
            align={message.role === "user" ? "end" : "start"}
            variant={message.role === "user" ? "secondary" : "ghost"}
            streaming={streaming}
          >
            <MessageContent>
              {message.reasoning || message.tools?.length ? (
                <ChatTrace message={message} />
              ) : null}
              {message.attachments ? (
                <ChatAttachments
                  attachments={message.attachments}
                  className="group-data-[align=end]/message:self-end"
                />
              ) : null}
              {message.content ? (
                <MessagePart>
                  {message.role === "assistant" ? (
                    <Response
                      streaming={streaming && !message.activity}
                      components={citeSources(message.sources)}
                    >
                      {message.content}
                    </Response>
                  ) : (
                    message.content
                  )}
                </MessagePart>
              ) : null}
              {indicator ? (
                <ThinkingIndicator startedAt={message.createdAt}>
                  {message.activity ?? "Thinking"}
                </ThinkingIndicator>
              ) : null}
              {message.sources?.length ? (
                <Sources loadPreview={loadLinkPreview}>
                  {message.sources.map((source) => (
                    <Source
                      key={source.url}
                      href={source.url}
                      title={source.title}
                    />
                  ))}
                </Sources>
              ) : null}
              {message.status === "failed" ? (
                <MessageFooter>
                  <Status variant="destructive" className="shrink-0">
                    <StatusIndicator />
                    <StatusLabel>Failed</StatusLabel>
                  </Status>
                  {message.error ? (
                    <span className="min-w-0">{message.error}</span>
                  ) : null}
                  <MessageRetryAction onClick={() => onRetry(message.id)} />
                </MessageFooter>
              ) : streaming || !message.content ? null : (
                <MessageFooter>
                  <MessageActions>
                    <MessageCopyAction text={message.content} />
                    {message.role === "assistant" ? (
                      <MessageRetryAction onClick={() => onRetry(message.id)} />
                    ) : (
                      <MessageEditAction
                        onClick={() => onEdit(message.content)}
                      />
                    )}
                  </MessageActions>
                </MessageFooter>
              )}
            </MessageContent>
          </Message>
        </ThreadItem>
      </React.Fragment>
    )
  })
}

export { ChatMessages }
