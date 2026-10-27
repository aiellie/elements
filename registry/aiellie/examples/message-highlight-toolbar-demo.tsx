"use client"

import * as React from "react"
import {
  Copy01Icon,
  Idea01Icon,
  QuoteDownIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  MessageHighlight,
  MessageHighlightAction,
  MessageHighlightToolbar,
} from "@/registry/aiellie/components/message-highlight-toolbar"
import {
  QuotedMessage,
  QuotedMessageContent,
  QuotedMessageDismiss,
  QuotedMessageText,
} from "@/registry/aiellie/components/quoted-message"

export default function MessageHighlightToolbarDemo() {
  const [quote, setQuote] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <MessageHighlight className="pt-10">
        <Message variant="ghost">
          <MessageContent>
            <MessagePart>
              Select any of these words. A container query styles an element by
              the width of its parent, so a card can lay itself out differently
              in a sidebar and in the main column.
            </MessagePart>
          </MessageContent>
        </Message>
        <MessageHighlightToolbar>
          <MessageHighlightAction tooltip="Quote" onAction={setQuote}>
            <HugeiconsIcon aria-hidden icon={QuoteDownIcon} />
          </MessageHighlightAction>
          <MessageHighlightAction
            tooltip="Explain"
            onAction={(text) => setQuote(`Explain: ${text}`)}
          >
            <HugeiconsIcon aria-hidden icon={Idea01Icon} />
          </MessageHighlightAction>
          <MessageHighlightAction
            tooltip="Copy"
            onAction={(text) => void navigator.clipboard.writeText(text)}
          >
            <HugeiconsIcon aria-hidden icon={Copy01Icon} />
          </MessageHighlightAction>
        </MessageHighlightToolbar>
      </MessageHighlight>
      {quote ? (
        <QuotedMessage>
          <QuotedMessageContent lines={1}>
            <QuotedMessageText>{quote}</QuotedMessageText>
          </QuotedMessageContent>
          <QuotedMessageDismiss onClick={() => setQuote(null)} />
        </QuotedMessage>
      ) : null}
    </div>
  )
}
