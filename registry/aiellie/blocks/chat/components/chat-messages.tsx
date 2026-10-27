"use client"

import * as React from "react"
import { Globe02Icon } from "@hugeicons/core-free-icons"

import {
  ChatAttachments,
  type ChatAttachment,
} from "@/registry/aiellie/blocks/chat/components/chat-attachments"
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
} from "@/registry/aiellie/components/status"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/registry/aiellie/components/reasoning"
import {
  Source,
  Sources,
  type SourcePreview,
} from "@/registry/aiellie/components/sources"
import { ThinkingIndicator } from "@/registry/aiellie/components/thinking-indicator"
import {
  ToolCall,
  ToolCallCode,
  ToolCallContent,
  ToolCallSection,
  ToolCallTrigger,
} from "@/registry/aiellie/components/tool-call"
import {
  DateDivider,
  isSameDay,
} from "@/registry/aiellie/components/date-divider"
import { ThreadItem } from "@/registry/aiellie/components/thread"

type ChatSource = {
  url: string
  title?: string
}

type ChatToolCall = {
  id: string
  /** What it says on its row, like "Searched the web". */
  name: string
  kind: "search" | "tool"
  status: "running" | "done" | "error"
  /** The query, for a search. */
  summary?: string
  input?: unknown
  output?: unknown
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: ChatAttachment[]
  /** Left out once a reply has finished. */
  status?: "streaming" | "stopped" | "failed"
  /** Why a failed reply failed. */
  error?: string
  /** What the model thought before replying, for a model that shows it. */
  reasoning?: string
  /** Seconds from asking to the reply's first word. */
  reasoningDuration?: number
  /** What a streaming reply is doing while no words come, like "Searching the web". */
  activity?: string
  /** Pages a search turned up for the reply. */
  sources?: ChatSource[]
  /** The tools the reply called, in order. */
  tools?: ChatToolCall[]
  createdAt?: Date
}

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

function ChatToolCalls({ tools }: { tools: ChatToolCall[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      {tools.map((tool) => (
        <ToolCall key={tool.id} status={tool.status}>
          <ToolCallTrigger
            icon={tool.kind === "search" ? Globe02Icon : undefined}
            name={tool.name}
            summary={tool.summary ? `“${tool.summary}”` : undefined}
          />
          <ToolCallContent>
            {tool.input !== undefined ? (
              <ToolCallSection title="Input">
                <ToolCallCode value={tool.input} />
              </ToolCallSection>
            ) : null}
            {tool.output !== undefined ? (
              <ToolCallSection title="Output">
                <ToolCallCode value={tool.output} />
              </ToolCallSection>
            ) : null}
          </ToolCallContent>
        </ToolCall>
      ))}
    </div>
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
    const working = streaming && !message.content
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
              {message.reasoning ? (
                <Reasoning
                  streaming={working}
                  duration={message.reasoningDuration}
                  startedAt={message.createdAt}
                >
                  <ReasoningTrigger label={message.activity} />
                  <ReasoningContent>{message.reasoning}</ReasoningContent>
                </Reasoning>
              ) : null}
              {message.tools?.length ? (
                <ChatToolCalls tools={message.tools} />
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
export type { ChatMessage, ChatSource, ChatToolCall }
