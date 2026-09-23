"use client"

import * as React from "react"

import { ChatComposer } from "@/registry/aiellie/blocks/chat/components/chat-composer"
import { ChatHeader } from "@/registry/aiellie/blocks/chat/components/chat-header"
import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"
import { ChatNavHistory } from "@/registry/aiellie/blocks/chat/components/chat-nav-history"
import { ChatSidebar } from "@/registry/aiellie/blocks/chat/components/chat-sidebar"
import { ChatThread } from "@/registry/aiellie/blocks/chat/components/chat-thread"
import type { ComposerStatus } from "@/registry/aiellie/components/composer"
import { Panels } from "@/registry/aiellie/components/panels"
import type { User } from "@/registry/aiellie/components/user-menu"
import { MODELS } from "@/registry/aiellie/lib/models"
import { SidebarProvider } from "@/registry/aiellie/ui/sidebar"
import { cn } from "@/lib/utils"

type Conversation = {
  id: string
  title: string
  /** Kept in the sidebar's pinned list, above the recent chats. */
  pinned?: boolean
  messages: ChatMessage[]
}

/**
 * The chats the page starts with. They are here to be replaced: load your own
 * history in their place.
 */
const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "tokens",
    title: "Custom colors in Tailwind v4",
    pinned: true,
    messages: [
      {
        id: "tokens-1",
        role: "user",
        content: "How do I add a custom color in Tailwind v4?",
      },
      {
        id: "tokens-2",
        role: "assistant",
        content:
          "In v4 the theme lives in your CSS rather than in a config file. Add the color under @theme:\n\n@theme {\n  --color-brand: oklch(0.62 0.21 260);\n}\n\nThat gives you bg-brand, text-brand, border-brand and the rest, and opacity modifiers like bg-brand/10 work with nothing else to set up.",
      },
    ],
  },
  {
    id: "debounce",
    title: "Debouncing a search field",
    messages: [
      {
        id: "debounce-1",
        role: "user",
        content: "What's a simple way to debounce a search field in React?",
      },
      {
        id: "debounce-2",
        role: "assistant",
        content:
          "Keep what's typed in state, and copy it to a second value only once typing pauses. An effect that sets a timeout on every change, and clears the one before it, does that in a few lines.\n\nThen search on the second value. The field stays responsive, and the search only runs when someone stops typing.",
      },
      {
        id: "debounce-3",
        role: "user",
        content: "How long should the pause be?",
      },
      {
        id: "debounce-4",
        role: "assistant",
        content:
          "Somewhere around 200 to 300 milliseconds. Any shorter and it fires mid-word; much longer and the results feel like they're lagging behind.",
      },
    ],
  },
  {
    id: "names",
    title: "Names for a design system",
    messages: [
      {
        id: "names-1",
        role: "user",
        content: "Give me three names for a quiet, monochrome design system.",
      },
      {
        id: "names-2",
        role: "assistant",
        content:
          "Graphite, for the pencil gray it lives in.\n\nHairline, after the borders that do most of its work.\n\nStill, because nothing in it moves unless you ask it to.",
      },
    ],
  },
  {
    id: "notes",
    title: "Summarize the release notes",
    messages: [
      {
        id: "notes-1",
        role: "user",
        content: "Summarize these release notes in three bullet points.",
      },
      { id: "notes-2", role: "assistant", content: "", status: "failed" },
    ],
  },
]

/** Who the preview is signed in as. Pass your own signed-in person instead. */
const SAMPLE_USER: User = { name: "Ada Lovelace", plan: "Pro" }

/**
 * What the preview answers with, since there is no model behind it. Replace
 * `stream` below with your model's response and the rest of the page works as
 * it is.
 */
const PREVIEW_REPLY =
  "This is a preview, so there's no model behind it. In your app, this is where the reply streams in, word by word, while the send button turns into stop.\n\nSwap the fake stream in the chat component for your model's response, and the rest of the page works as it is."

/** How long the preview takes to start answering, then to write each word. */
const FIRST_WORD_DELAY = 500
const WORD_DELAY = 35

/**
 * The chats opened so far, in order, and which one is on screen. Null is a new
 * chat. Back and forward move through it the way a browser moves through
 * pages.
 */
type History = { entries: (string | null)[]; index: number }

/** Opens a chat as the next step, dropping whatever was ahead of this one. */
function visit(history: History, id: string | null): History {
  if (history.entries[history.index] === id) return history
  const entries = [...history.entries.slice(0, history.index + 1), id]
  return { entries, index: entries.length - 1 }
}

/**
 * Forgets a deleted chat, along with any step that, without it, would only
 * repeat the one before.
 */
function forget(history: History, id: string): History {
  const entries: (string | null)[] = []
  let index = 0
  history.entries.forEach((entry, i) => {
    if (entry !== id && entries.at(-1) !== entry) entries.push(entry)
    if (i <= history.index) index = Math.max(entries.length - 1, 0)
  })
  return entries.length > 0 ? { entries, index } : { entries: [null], index: 0 }
}

/**
 * The chat page: your chats down the side, the open one in the middle, and the
 * composer underneath.
 *
 * The layout is `Panels`: the sidebar is its left panel, open to start with,
 * and the thread is the main one. Dragging the sidebar's edge resizes it, and
 * its toggle, or ⌘B, folds it away. On a phone there is no room beside the
 * thread, so the toggle opens the sidebar over the page in a sheet instead.
 *
 * ⌘N starts a new chat, and ⌘[ and ⌘] step back and forward through the
 * chats you have opened. ⌘⇧U turns activity on and off, lighting the bell;
 * what it shows is yours to supply. ⌘⇧N and ⌘K open quick chat and search,
 * also yours: the page has neither, so their buttons and keys do nothing
 * until you pass them. Most browsers keep ⌘N and ⌘⇧N for their own windows,
 * so those two reach the page only in a desktop shell.
 */
function Chat({
  onQuickChat,
  onSearch,
  onActivity,
  onProjects,
  className,
}: {
  onQuickChat?: () => void
  onSearch?: () => void
  /** Told whether activity is now up, each time the bell is pressed. */
  onActivity?: (open: boolean) => void
  onProjects?: () => void
  className?: string
}) {
  const [conversations, setConversations] = React.useState(SAMPLE_CONVERSATIONS)
  // Null is a new chat. Nothing is saved until its first message is sent.
  const [history, setHistory] = React.useState<History>({
    entries: [null],
    index: 0,
  })
  const activeId = history.entries[history.index]
  // Whether activity is up. The bell shows it either way; what opens is yours.
  const [activityOpen, setActivityOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [model, setModel] = React.useState(MODELS[0].id)
  // The chat a reply is being written into, which is not always the open one.
  const [streamingId, setStreamingId] = React.useState<string | null>(null)

  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const streamRef = React.useRef<{
    conversationId: string
    messageId: string
  } | null>(null)
  const nextId = React.useRef(0)

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const active = conversations.find(
    (conversation) => conversation.id === activeId
  )
  const status: ComposerStatus =
    streamingId !== null && streamingId === activeId ? "streaming" : "ready"

  const makeId = (kind: "chat" | "message") => `${kind}-${++nextId.current}`

  const updateMessages = (
    conversationId: string,
    update: (messages: ChatMessage[]) => ChatMessage[]
  ) =>
    setConversations((all) =>
      all.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: update(conversation.messages) }
          : conversation
      )
    )

  /** Ends the reply being written, keeping whatever it had got to. */
  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    const current = streamRef.current
    streamRef.current = null
    setStreamingId(null)
    if (!current) return

    // A reply stopped before its first word has nothing worth keeping.
    updateMessages(current.conversationId, (messages) =>
      messages.flatMap((message): ChatMessage[] => {
        if (message.id !== current.messageId) return [message]
        return message.content ? [{ ...message, status: "stopped" }] : []
      })
    )
  }

  /** The stand-in for a model: writes the preview reply out a word at a time. */
  const stream = (conversationId: string, messageId: string) => {
    const words = PREVIEW_REPLY.split(/(?<=\s)/)
    let shown = 0
    streamRef.current = { conversationId, messageId }
    setStreamingId(conversationId)

    const tick = () => {
      shown += 1
      const done = shown >= words.length
      updateMessages(conversationId, (messages) =>
        messages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                content: words.slice(0, shown).join(""),
                status: done ? undefined : "streaming",
              }
            : message
        )
      )
      if (done) {
        timerRef.current = null
        streamRef.current = null
        setStreamingId(null)
      } else {
        timerRef.current = setTimeout(tick, WORD_DELAY)
      }
    }

    timerRef.current = setTimeout(tick, FIRST_WORD_DELAY)
  }

  const send = (text: string) => {
    stop()
    const question: ChatMessage = {
      id: makeId("message"),
      role: "user",
      content: text,
    }
    const reply: ChatMessage = {
      id: makeId("message"),
      role: "assistant",
      content: "",
      status: "streaming",
    }

    if (activeId === null) {
      // The first message is what the chat is about, so it names the chat.
      const id = makeId("chat")
      const title = text.length > 40 ? `${text.slice(0, 40).trimEnd()}…` : text
      setConversations((all) => [
        { id, title, messages: [question, reply] },
        ...all,
      ])
      setHistory((current) => ({
        ...current,
        entries: current.entries.map((entry, i) =>
          i === current.index ? id : entry
        ),
      }))
      stream(id, reply.id)
    } else {
      updateMessages(activeId, (messages) => [...messages, question, reply])
      stream(activeId, reply.id)
    }
  }

  const retry = (messageId: string) => {
    if (activeId === null) return
    stop()
    updateMessages(activeId, (messages) =>
      messages.map((message) =>
        message.id === messageId
          ? { ...message, content: "", status: "streaming" }
          : message
      )
    )
    stream(activeId, messageId)
  }

  /** Puts an old message back in the composer to be changed and sent again. */
  const edit = (content: string) => {
    setDraft(content)
    inputRef.current?.focus()
  }

  const select = (id: string) => {
    if (id !== activeId) stop()
    setHistory((current) => visit(current, id))
  }

  const startNewChat = () => {
    stop()
    setHistory((current) => visit(current, null))
  }

  const toggleActivity = () => {
    const open = !activityOpen
    setActivityOpen(open)
    onActivity?.(open)
  }

  const canGoBack = history.index > 0
  const canGoForward = history.index < history.entries.length - 1

  /** One step back (-1) or forward (1) through the chats opened so far. */
  const go = (step: -1 | 1) => {
    const index = history.index + step
    if (index < 0 || index >= history.entries.length) return
    stop()
    setHistory({ ...history, index })
  }

  // Read fresh on every key, so the listener below never sees an old history.
  const onShortcut = React.useEffectEvent((event: KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey) return
    const key = event.key.toLowerCase()
    const action = event.shiftKey
      ? { n: onQuickChat, u: toggleActivity }[key]
      : {
          n: startNewChat,
          "[": () => go(-1),
          "]": () => go(1),
          k: onSearch,
        }[key]
    // A key with nothing behind it is left to the browser.
    if (!action) return
    event.preventDefault()
    action()
  })

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => onShortcut(event)
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const rename = (id: string, title: string) =>
    setConversations((all) =>
      all.map((conversation) =>
        conversation.id === id ? { ...conversation, title } : conversation
      )
    )

  const togglePin = (id: string) =>
    setConversations((all) =>
      all.map((conversation) =>
        conversation.id === id
          ? { ...conversation, pinned: !conversation.pinned }
          : conversation
      )
    )

  const remove = (id: string) => {
    if (streamRef.current?.conversationId === id) stop()
    setConversations((all) =>
      all.filter((conversation) => conversation.id !== id)
    )
    setHistory((current) => {
      const next = forget(current, id)
      // Deleting the open chat leaves a new one in its place.
      return current.entries[current.index] === id ? visit(next, null) : next
    })
  }

  return (
    <div
      data-slot="chat"
      className={cn(
        "flex h-full min-h-0 w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      {/* The sidebar's rows, and the header's name, read from this. It is
          held open, since the panels are what fold the sidebar away. */}
      <SidebarProvider open className="h-full min-h-0">
        <Panels
          defaultOpen={{ left: true }}
          className="h-full"
          left={
            <ChatSidebar
              chats={conversations}
              activeId={activeId}
              user={SAMPLE_USER}
              onNewChat={startNewChat}
              onQuickChat={onQuickChat}
              onProjects={onProjects}
              onSearch={onSearch}
              activityOpen={activityOpen}
              onActivity={toggleActivity}
              onSelect={select}
              onRename={rename}
              onTogglePin={togglePin}
              onDelete={remove}
            />
          }
          // The sidebar's header runs straight into its list.
          headerBorder={{ left: false }}
          // The toggle leads the sidebar's header, ahead of back and forward,
          // in the same corner as when the sidebar is shut.
          toggleAt={{ left: "start" }}
          headers={{
            left: (
              <ChatNavHistory
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                onBack={() => go(-1)}
                onForward={() => go(1)}
              />
            ),
            main: (
              <ChatHeader
                title={active?.title ?? "New chat"}
                onNewChat={startNewChat}
                onDelete={active ? () => remove(active.id) : undefined}
              />
            ),
          }}
        >
          {/* Fills the panel, so the thread scrolls and the composer stays down. */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Keyed by chat, so opening another one starts at its newest
                message instead of wherever the last one was scrolled to. */}
            <ChatThread
              key={activeId ?? "new"}
              messages={active?.messages ?? []}
              onSend={send}
              onRetry={retry}
              onEdit={edit}
            />
            <ChatComposer
              value={draft}
              onValueChange={setDraft}
              onSend={send}
              onStop={stop}
              status={status}
              models={MODELS}
              model={model}
              onModelChange={setModel}
              inputRef={inputRef}
            />
          </div>
        </Panels>
      </SidebarProvider>
    </div>
  )
}

export { Chat }
