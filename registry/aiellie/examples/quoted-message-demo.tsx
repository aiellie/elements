"use client"

import * as React from "react"

import {
  Message,
  MessageContent,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  QuotedMessage,
  QuotedMessageAuthor,
  QuotedMessageContent,
  QuotedMessageDismiss,
  QuotedMessageText,
} from "@/registry/aiellie/components/quoted-message"

const QUOTE =
  "Set the parent as a container, then style its children by the parent's width rather than the window's."

export default function QuotedMessageDemo() {
  const [quoting, setQuoting] = React.useState(true)

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Message align="end">
        <MessageContent>
          <QuotedMessage className="max-w-[80%]">
            <QuotedMessageContent render={<button type="button" />} lines={1}>
              <QuotedMessageText>{QUOTE}</QuotedMessageText>
            </QuotedMessageContent>
          </QuotedMessage>
          <MessagePart>Does that work inside a flex row?</MessagePart>
        </MessageContent>
      </Message>
      {quoting ? (
        <QuotedMessage className="rounded-e-lg bg-muted/60 py-1 pe-1">
          <QuotedMessageContent>
            <QuotedMessageAuthor>Assistant</QuotedMessageAuthor>
            <QuotedMessageText>{QUOTE}</QuotedMessageText>
          </QuotedMessageContent>
          <QuotedMessageDismiss onClick={() => setQuoting(false)} />
        </QuotedMessage>
      ) : (
        <button
          type="button"
          onClick={() => setQuoting(true)}
          className="self-start text-xs text-muted-foreground hover:text-foreground"
        >
          Quote it again
        </button>
      )}
    </div>
  )
}
