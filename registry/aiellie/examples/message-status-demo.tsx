"use client"

import * as React from "react"

import {
  Message,
  MessageContent,
  MessageFooter,
  MessagePart,
} from "@/registry/aiellie/components/message"
import {
  MessageStatus,
  type MessageStatusValue,
} from "@/registry/aiellie/components/message-status"

const FLOW: MessageStatusValue[] = ["sending", "sent", "delivered", "read"]

export default function MessageStatusDemo() {
  const [step, setStep] = React.useState(0)
  const [failed, setFailed] = React.useState(true)

  React.useEffect(() => {
    const timer = setInterval(
      () => setStep((current) => (current + 1) % (FLOW.length + 2)),
      1000
    )
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Message align="end">
        <MessageContent>
          <MessagePart>Running five minutes late</MessagePart>
          <MessageFooter>
            <MessageStatus
              status={FLOW[Math.min(step, FLOW.length - 1)]}
              showLabel
            />
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <MessagePart>Start without me</MessagePart>
          <MessageFooter>
            <MessageStatus
              status={failed ? "failed" : "sent"}
              showLabel
              onRetry={() => setFailed(false)}
            />
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}
