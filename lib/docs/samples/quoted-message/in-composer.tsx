"use client"

import * as React from "react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/aiellie/components/composer"
import {
  QuotedMessage,
  QuotedMessageAuthor,
  QuotedMessageContent,
  QuotedMessageDismiss,
  QuotedMessageText,
} from "@/registry/aiellie/components/quoted-message"

export default function InComposer() {
  const [quote, setQuote] = React.useState<string | null>(
    "Set the parent as a container, then style its children by its width."
  )

  return (
    <Composer onSubmit={() => setQuote(null)} className="max-w-md">
      {quote ? (
        <QuotedMessage className="mx-1 mt-1 w-auto">
          <QuotedMessageContent lines={1}>
            <QuotedMessageAuthor>Replying to Assistant</QuotedMessageAuthor>
            <QuotedMessageText>{quote}</QuotedMessageText>
          </QuotedMessageContent>
          <QuotedMessageDismiss onClick={() => setQuote(null)} />
        </QuotedMessage>
      ) : null}
      <ComposerInput placeholder={quote ? "Ask about this" : "Ask anything"} />
      <ComposerFooter>
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}
