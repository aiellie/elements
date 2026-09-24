"use client"

import * as React from "react"
import {
  DropboxIcon,
  FigmaIcon,
  Github01Icon,
  GoogleDriveIcon,
  Notion01Icon,
  SlackIcon,
} from "@hugeicons/core-free-icons"

import type { ChatAttachment } from "@/registry/aiellie/blocks/chat/components/chat-attachments"
import { ChatComposer } from "@/registry/aiellie/blocks/chat/components/chat-composer"
import { ChatHeader } from "@/registry/aiellie/blocks/chat/components/chat-header"
import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"
import { ChatNavHistory } from "@/registry/aiellie/blocks/chat/components/chat-nav-history"
import { ChatSidebar } from "@/registry/aiellie/blocks/chat/components/chat-sidebar"
import { ChatThread } from "@/registry/aiellie/blocks/chat/components/chat-thread"
import type { ComposerStatus } from "@/registry/aiellie/components/composer"
import { Panels } from "@/registry/aiellie/components/panels"
import type { PluginOption } from "@/registry/aiellie/components/plugin-selector"
import type { ProjectOption } from "@/registry/aiellie/components/project-selector"
import type { User } from "@/registry/aiellie/components/user-menu"
import { MODELS } from "@/registry/aiellie/lib/models"
import { SidebarProvider } from "@/registry/aiellie/ui/sidebar"
import { cn } from "@/lib/utils"

type Conversation = {
  id: string
  title: string
  pinned?: boolean
  /** Kept out of the sidebar, and gone once the page is left. */
  temporary?: boolean
  messages: ChatMessage[]
}

// Sample chats. Load your own history in their place.
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

// Sample signed-in person. Pass your own.
const SAMPLE_USER: User = { name: "Ada Lovelace", plan: "Pro" }

// Sample projects and plugins. Pass your own; the preview only shows which
// are connected, and nothing reads a project or calls a plugin.
const SAMPLE_PROJECTS: ProjectOption[] = [
  { id: "website", name: "Website redesign" },
  { id: "planning", name: "Q3 planning" },
  { id: "onboarding", name: "Onboarding docs" },
]

const SAMPLE_PLUGINS: PluginOption[] = [
  { id: "github", name: "GitHub", icon: Github01Icon },
  { id: "drive", name: "Google Drive", icon: GoogleDriveIcon },
  { id: "slack", name: "Slack", icon: SlackIcon },
  { id: "notion", name: "Notion", icon: Notion01Icon },
  { id: "figma", name: "Figma", icon: FigmaIcon },
  { id: "dropbox", name: "Dropbox", icon: DropboxIcon },
]

// There is no model behind the preview. Replace `stream` below with your
// model's response and the rest of the page works as it is.
const PREVIEW_REPLY =
  "This is a preview, so there's no model behind it. In your app, this is where the reply streams in, word by word, while the send button turns into stop.\n\nSwap the fake stream in the chat component for your model's response, and the rest of the page works as it is."

const FIRST_WORD_DELAY = 500
const WORD_DELAY = 35

// The chats opened so far, stepped through like browser history. Null is a
// new chat.
type History = { entries: (string | null)[]; index: number }

function visit(history: History, id: string | null): History {
  if (history.entries[history.index] === id) return history
  const entries = [...history.entries.slice(0, history.index + 1), id]
  return { entries, index: entries.length - 1 }
}

// Also drops any step that, without the deleted chat, would only repeat the
// one before.
function forget(history: History, id: string): History {
  const entries: (string | null)[] = []
  let index = 0
  history.entries.forEach((entry, i) => {
    if (entry !== id && entries.at(-1) !== entry) entries.push(entry)
    if (i <= history.index) index = Math.max(entries.length - 1, 0)
  })
  return entries.length > 0 ? { entries, index } : { entries: [null], index: 0 }
}

// Most browsers keep ⌘N and ⌘⇧N for their own windows, so those two reach the
// page only in a desktop shell.
function Chat({
  onQuickChat,
  onSearch,
  onActivity,
  onProjects,
  className,
}: {
  onQuickChat?: () => void
  onSearch?: () => void
  /** Called with the new state each time the bell is pressed. */
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
  // Whether the new chat, once sent, is kept out of history.
  const [temporaryDraft, setTemporaryDraft] = React.useState(false)
  const [activityOpen, setActivityOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [model, setModel] = React.useState(MODELS[0].id)
  const [project, setProject] = React.useState<string | null>(null)
  const [plugins, setPlugins] = React.useState<string[]>([])
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
  const temporary = active ? Boolean(active.temporary) : temporaryDraft
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

  const send = (text: string, attachments: ChatAttachment[] = []) => {
    stop()
    const question: ChatMessage = {
      id: makeId("message"),
      role: "user",
      content: text,
      attachments: attachments.length > 0 ? attachments : undefined,
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
      const about = text || attachments[0]?.name || "New chat"
      const title =
        about.length > 40 ? `${about.slice(0, 40).trimEnd()}…` : about
      setConversations((all) => [
        { id, title, temporary: temporaryDraft, messages: [question, reply] },
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

  const edit = (content: string) => {
    setDraft(content)
    inputRef.current?.focus()
  }

  const select = (id: string) => {
    if (id !== activeId) stop()
    setTemporaryDraft(false)
    setHistory((current) => visit(current, id))
  }

  const startNewChat = () => {
    stop()
    setTemporaryDraft(false)
    setHistory((current) => visit(current, null))
  }

  // A temporary chat that has started can't be made permanent, so turning it
  // off leaves it for a new chat.
  const setTemporary = (next: boolean) => {
    if (active) startNewChat()
    else setTemporaryDraft(next)
  }

  const toggleActivity = () => {
    const open = !activityOpen
    setActivityOpen(open)
    onActivity?.(open)
  }

  const canGoBack = history.index > 0
  const canGoForward = history.index < history.entries.length - 1

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
      {/* Held open, since the panels are what fold the sidebar away. */}
      <SidebarProvider open className="h-full min-h-0">
        <Panels
          defaultOpen={{ left: true }}
          className="h-full"
          left={
            <ChatSidebar
              chats={conversations.filter(
                (conversation) => !conversation.temporary
              )}
              activeId={activeId}
              user={SAMPLE_USER}
              usage="72% left"
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
          headerBorder={{ left: false }}
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
                title={
                  active?.title ?? (temporary ? "Temporary chat" : "New chat")
                }
                temporary={temporary}
                onTemporaryChange={
                  !active || active.temporary ? setTemporary : undefined
                }
                onNewChat={startNewChat}
                onDelete={active ? () => remove(active.id) : undefined}
              />
            ),
          }}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* Keyed so opening another chat starts at its newest message. */}
            <ChatThread
              key={activeId ?? "new"}
              messages={active?.messages ?? []}
              temporary={temporary}
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
              projects={SAMPLE_PROJECTS}
              project={project}
              onProjectChange={setProject}
              plugins={SAMPLE_PLUGINS}
              activePlugins={plugins}
              onPluginsChange={setPlugins}
              inputRef={inputRef}
            />
          </div>
        </Panels>
      </SidebarProvider>
    </div>
  )
}

export { Chat }
