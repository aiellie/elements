"use client"

import * as React from "react"
import { DefaultChatTransport, readUIMessageStream, type UIMessage } from "ai"

import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"
import {
  routeOf,
  type ModelOption,
  type ProviderKeys,
} from "@/registry/aiellie/lib/models"

// Where `route.ts` installs.
const API = "/api/chat"
const STORAGE_KEY = "aiellie.provider-keys"
const NO_KEYS: ProviderKeys = {}

// Keys live in this browser only, and go out with each request to your own
// route and nowhere else. Held in memory too, for when storage is blocked.
const listeners = new Set<() => void>()
let memory: string | null = null
let cache: { raw: string | null; keys: ProviderKeys } = {
  raw: null,
  keys: NO_KEYS,
}

function readKeys() {
  let raw = memory
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {}
  if (raw === cache.raw) return cache.keys
  let keys = NO_KEYS
  try {
    if (raw) keys = JSON.parse(raw) as ProviderKeys
  } catch {}
  cache = { raw, keys }
  return keys
}

function writeKeys(keys: ProviderKeys) {
  const kept = Object.entries(keys).flatMap(([provider, key]) =>
    key?.trim() ? [[provider, key.trim()]] : []
  )
  memory = kept.length > 0 ? JSON.stringify(Object.fromEntries(kept)) : null
  try {
    if (memory) localStorage.setItem(STORAGE_KEY, memory)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {}
  listeners.forEach((listener) => listener())
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange()
  }
  listeners.add(onChange)
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onStorage)
  }
}

function useProviderKeys() {
  const keys = React.useSyncExternalStore(subscribe, readKeys, () => NO_KEYS)
  return [keys, writeKeys] as const
}

// Attachments go by name for now, so the model at least knows they're there.
function toUIMessages(messages: ChatMessage[]): UIMessage[] {
  return messages.flatMap((message) => {
    const names = message.attachments?.map((attachment) => attachment.name)
    const text = [
      message.content,
      names?.length && `Attached: ${names.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n\n")
    if (!text || message.status === "failed") return []
    return {
      id: message.id,
      role: message.role,
      parts: [{ type: "text", text }],
    }
  })
}

const transport = new DefaultChatTransport({ api: API })

// Calls `onText` with the whole reply so far, each time more of it arrives.
async function streamReply({
  chatId,
  model,
  keys,
  messages,
  signal,
  onText,
}: {
  chatId: string
  model: ModelOption
  keys: ProviderKeys
  /** The chat up to the reply, oldest first. */
  messages: ChatMessage[]
  signal: AbortSignal
  onText: (text: string) => void
}) {
  const route = routeOf(model, keys)
  if (!route) throw new Error("No key reaches this model. Add one in Settings.")

  const stream = await transport.sendMessages({
    trigger: "submit-message",
    chatId,
    messageId: undefined,
    messages: toUIMessages(messages),
    abortSignal: signal,
    headers: { Authorization: `Bearer ${route.key}` },
    body: { provider: route.provider, model: route.model },
  })

  for await (const message of readUIMessageStream({
    stream,
    terminateOnError: true,
  })) {
    onText(
      message.parts
        .flatMap((part) => (part.type === "text" ? [part.text] : []))
        .join("")
    )
  }
}

function errorText(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : "Something went wrong."
}

export { errorText, streamReply, useProviderKeys }
