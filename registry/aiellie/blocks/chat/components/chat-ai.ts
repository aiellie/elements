"use client"

import * as React from "react"
import {
  DefaultChatTransport,
  getToolOrDynamicToolName,
  isToolUIPart,
  readUIMessageStream,
  type UIMessage,
} from "ai"

import { toUIMessages } from "@/registry/aiellie/blocks/chat/components/chat-files"
import type {
  ChatMessage,
  ChatSource,
} from "@/registry/aiellie/blocks/chat/components/chat-messages"
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

const transport = new DefaultChatTransport({ api: API })

type ReplySoFar = {
  text: string
  /** What the model thought, for a model that shows its thinking. */
  reasoning: string
  /** What it's doing while no words are coming, like "Searching the web". */
  activity?: string
  /** Pages a search turned up. */
  sources: ChatSource[]
}

const record = (value: unknown) =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {}

// Where a search tool keeps its query: in its input, or for OpenAI's, in what
// it reports back.
function queryOf(input: unknown, output: unknown) {
  const query = record(input).query ?? record(record(output).action).query
  const first = Array.isArray(query) ? query[0] : query
  return typeof first === "string" && first.trim() ? first.trim() : undefined
}

// Each search tool reports its finds in its own shape: as a list, or as one
// under `results` or `sources`.
function sourcesOf(output: unknown): ChatSource[] {
  const found = record(output)
  const list = Array.isArray(output)
    ? output
    : Array.isArray(found.results)
      ? found.results
      : Array.isArray(found.sources)
        ? found.sources
        : []
  return list.flatMap((item) => {
    const { url, title } = record(item)
    return typeof url === "string"
      ? [{ url, title: typeof title === "string" ? title : undefined }]
      : []
  })
}

// Reads the activity off the latest part: a search still waiting on its
// results, or anything but words.
function readReply(message: UIMessage): ReplySoFar {
  const text: string[] = []
  const reasoning: string[] = []
  const sources = new Map<string, ChatSource>()
  let activity: string | undefined = "Thinking"

  for (const part of message.parts) {
    if (part.type === "text") {
      text.push(part.text)
      if (part.text.trim()) activity = undefined
    } else if (part.type === "reasoning") {
      reasoning.push(part.text)
      activity = "Thinking"
    } else if (part.type === "source-url") {
      sources.set(part.url, { url: part.url, title: part.title })
    } else if (isToolUIPart(part)) {
      const running =
        part.state === "input-streaming" || part.state === "input-available"
      const search = getToolOrDynamicToolName(part).includes("search")
      if (!running) {
        activity = "Thinking"
        if (search) {
          for (const source of sourcesOf(part.output)) {
            if (!sources.has(source.url)) sources.set(source.url, source)
          }
        }
      } else if (search) {
        const query = queryOf(part.input, part.output)
        activity = query ? `Searching for “${query}”` : "Searching the web"
      } else {
        activity = "Working"
      }
    }
  }

  return {
    text: text.join(""),
    reasoning: reasoning.join("\n\n").trim(),
    activity,
    sources: [...sources.values()],
  }
}

// Calls `onUpdate` with the whole reply so far, each time more of it arrives.
async function streamReply({
  chatId,
  model,
  keys,
  messages,
  signal,
  onUpdate,
}: {
  chatId: string
  model: ModelOption
  keys: ProviderKeys
  /** The chat up to the reply, oldest first. */
  messages: ChatMessage[]
  signal: AbortSignal
  onUpdate: (reply: ReplySoFar) => void
}) {
  const route = routeOf(model, keys)
  if (!route) throw new Error("No key reaches this model. Add one in Settings.")

  const waiting = (activity: string) =>
    onUpdate({ text: "", reasoning: "", activity, sources: [] })

  const question = messages.findLast((message) => message.role === "user")
  if (question?.attachments?.length) waiting("Reading files")
  const uiMessages = await toUIMessages(messages)
  waiting("Thinking")

  const stream = await transport.sendMessages({
    trigger: "submit-message",
    chatId,
    messageId: undefined,
    messages: uiMessages,
    abortSignal: signal,
    headers: { Authorization: `Bearer ${route.key}` },
    body: { provider: route.provider, model: route.model },
  })

  for await (const message of readUIMessageStream({
    stream,
    terminateOnError: true,
  })) {
    onUpdate(readReply(message))
  }
}

function errorText(error: unknown) {
  return error instanceof Error && error.message
    ? error.message
    : "Something went wrong."
}

export { errorText, streamReply, useProviderKeys }
