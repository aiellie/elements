"use client"

import * as React from "react"

import {
  Message,
  MessageContent,
  MessageHeader,
  MessagePart,
} from "@/registry/aiellie/components/message"

const CHOICES = ["Keep the menu", "Use a sheet instead", "Show me both"]

export default function ClickablePart() {
  const [picked, setPicked] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Message variant="outline">
        <MessageContent>
          <MessageHeader>Pick one to carry on</MessageHeader>
          {CHOICES.map((choice) => (
            <MessagePart
              key={choice}
              render={<button type="button" />}
              onClick={() => setPicked(choice)}
            >
              {choice}
            </MessagePart>
          ))}
        </MessageContent>
      </Message>
      {picked ? (
        <Message align="end">
          <MessageContent>
            <MessagePart>{picked}</MessagePart>
          </MessageContent>
        </Message>
      ) : null}
    </div>
  )
}
