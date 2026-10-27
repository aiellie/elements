"use client"

import * as React from "react"

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
} from "@/registry/aiellie/components/message-actions"

export default function YourTurn() {
  const [text, setText] = React.useState("How do container queries work?")
  const [editing, setEditing] = React.useState(false)

  return (
    <Message align="end" className="max-w-md">
      <MessageContent>
        {editing ? (
          <textarea
            autoFocus
            aria-label="Edit message"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onBlur={() => setEditing(false)}
            className="w-4/5 resize-none rounded-xl border border-input bg-background px-3 py-1 text-sm leading-6 outline-none focus-visible:border-ring"
          />
        ) : (
          <MessagePart>{text}</MessagePart>
        )}
        <MessageFooter>
          <MessageActions>
            <MessageCopyAction text={text} />
            <MessageEditAction onClick={() => setEditing(true)} />
          </MessageActions>
        </MessageFooter>
      </MessageContent>
    </Message>
  )
}
