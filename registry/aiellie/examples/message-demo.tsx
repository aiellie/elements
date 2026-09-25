"use client"

import {
  Copy01Icon,
  RepeatIcon,
  SparklesIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
  MessagePart,
  MessageReactions,
  MessageTime,
} from "@/registry/aiellie/components/message"

export default function MessageDemo() {
  return (
    <MessageGroup className="w-full max-w-md gap-4">
      <Message align="end">
        <MessageContent>
          <MessagePart>Can you split this into two messages?</MessagePart>
          <MessagePart className="mb-2">
            Like a quick follow-up.
            <MessageReactions>👍</MessageReactions>
          </MessagePart>
          <MessageFooter>
            <MessageTime dateTime="2026-09-25T09:41">09:41</MessageTime>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message variant="ghost">
        <MessageAvatar>
          <HugeiconsIcon icon={SparklesIcon} aria-hidden />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Assistant</MessageHeader>
          <MessagePart>
            Parts that follow each other stack tightly, and only the last one
            gets the tail. Hover this reply to see its actions.
          </MessagePart>
          <MessageFooter>
            <MessageTime dateTime="2026-09-25T09:42">09:42</MessageTime>
            <MessageActions>
              <MessageAction tooltip="Copy">
                <HugeiconsIcon icon={Copy01Icon} />
              </MessageAction>
              <MessageAction tooltip="Good reply">
                <HugeiconsIcon icon={ThumbsUpIcon} />
              </MessageAction>
              <MessageAction tooltip="Retry">
                <HugeiconsIcon icon={RepeatIcon} />
              </MessageAction>
            </MessageActions>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message variant="ghost" streaming>
        <MessageAvatar>
          <HugeiconsIcon icon={SparklesIcon} aria-hidden />
        </MessageAvatar>
        <MessageContent>
          <MessagePart>And while a reply is still being written</MessagePart>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
