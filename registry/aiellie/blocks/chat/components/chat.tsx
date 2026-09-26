"use client"

import * as React from "react"

import {
  errorText,
  streamReply,
  useProviderKeys,
} from "@/registry/aiellie/blocks/chat/components/chat-ai"
import {
  ChatAttachments,
  type ChatAttachment,
} from "@/registry/aiellie/blocks/chat/components/chat-attachments"
import { ChatComposer } from "@/registry/aiellie/blocks/chat/components/chat-composer"
import {
  DISCLAIMER,
  PREVIEW_REASONING,
  PREVIEW_REPLY,
  SAMPLE_BRANCHES,
  SAMPLE_CONVERSATIONS,
  SAMPLE_PLUGINS,
  SAMPLE_PROJECTS,
  SAMPLE_USAGE,
  SAMPLE_USER,
  shareUrlOf,
  type Conversation,
  type ConversationStatus,
} from "@/registry/aiellie/blocks/chat/components/chat-data"
import { ChatHeader } from "@/registry/aiellie/blocks/chat/components/chat-header"
import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"
import { ChatNavHistory } from "@/registry/aiellie/blocks/chat/components/chat-nav-history"
import { ChatSearch } from "@/registry/aiellie/blocks/chat/components/chat-search"
import { ChatSidebar } from "@/registry/aiellie/blocks/chat/components/chat-sidebar"
import type { ChatMode } from "@/registry/aiellie/blocks/chat/components/chat-switcher"
import { ChatThread } from "@/registry/aiellie/blocks/chat/components/chat-thread"
import type { ComposerStatus } from "@/registry/aiellie/components/composer"
import { Panels } from "@/registry/aiellie/components/panels"
import {
  QuickChat,
  type QuickChatMessage,
} from "@/registry/aiellie/components/quick-chat"
import type { SettingsSection } from "@/registry/aiellie/components/settings-dialog"
import { MODELS, PROVIDERS, routeOf } from "@/registry/aiellie/lib/models"
import { SidebarProvider } from "@/registry/aiellie/ui/sidebar"
import { cn } from "@/lib/utils"

const FIRST_WORD_DELAY = 500
const WORD_DELAY = 35
const THOUGHT_DELAY = 80
const QUICK_REASONING =
  "A quick question, so a short answer. It shouldn't pull them away from the chat they're in."
const QUICK_REPLY =
  "This stays separate from your main conversation, so you can handle a quick question without losing your place."

const secondsSince = (time?: Date | number) =>
  time === undefined ? undefined : (Date.now() - Number(time)) / 1000

type QuickMessage = QuickChatMessage & {
  files?: ChatAttachment[]
  /** Its content says why, and it's left out of what the model is sent. */
  failed?: boolean
}

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
  onActivity,
  onProjects,
  className,
}: {
  /** Called after the quick chat panel opens. */
  onQuickChat?: () => void
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
  // Read when a reply finishes, which can be long after the render that
  // started it.
  const activeIdRef = React.useRef(activeId)
  React.useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])
  // Whether the new chat, once sent, is kept out of history.
  const [temporaryDraft, setTemporaryDraft] = React.useState(false)
  const [mode, setMode] = React.useState<ChatMode>("chat")
  const [activityOpen, setActivityOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [shareOpen, setShareOpen] = React.useState(false)
  const [quickChatOpen, setQuickChatOpen] = React.useState(false)
  const [quickMessages, setQuickMessages] = React.useState<QuickMessage[]>([])
  const [quickStreaming, setQuickStreaming] = React.useState(false)
  const [quickComposerKey, setQuickComposerKey] = React.useState(0)
  const [quickDraft, setQuickDraft] = React.useState("")
  const [quickModel, setQuickModel] = React.useState(MODELS[0].id)
  const [quickProject, setQuickProject] = React.useState<string | null>(null)
  const [quickPlugins, setQuickPlugins] = React.useState<string[]>([])
  const [quickWorkIn, setQuickWorkIn] = React.useState("local")
  const [quickBranches, setQuickBranches] = React.useState(SAMPLE_BRANCHES)
  const [quickBranch, setQuickBranch] = React.useState(SAMPLE_BRANCHES[0])
  const [draft, setDraft] = React.useState("")
  const [model, setModel] = React.useState(MODELS[0].id)
  const [project, setProject] = React.useState<string | null>(null)
  const [plugins, setPlugins] = React.useState<string[]>([])
  const [workIn, setWorkIn] = React.useState("local")
  const [branches, setBranches] = React.useState(SAMPLE_BRANCHES)
  const [branch, setBranch] = React.useState(SAMPLE_BRANCHES[0])
  // The chat a reply is being written into, which is not always the open one.
  const [streamingId, setStreamingId] = React.useState<string | null>(null)
  const [keys, setKeys] = useProviderKeys()
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [settingsSection, setSettingsSection] =
    React.useState<SettingsSection>("general")

  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const quickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  // Whichever request a reply is coming from. A reply that finds it has been
  // replaced was stopped, or sent again, so it keeps quiet.
  const abortRef = React.useRef<AbortController | null>(null)
  const quickAbortRef = React.useRef<AbortController | null>(null)
  const streamRef = React.useRef<{
    conversationId: string
    messageId: string
  } | null>(null)
  const nextId = React.useRef(0)

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (quickTimerRef.current) clearTimeout(quickTimerRef.current)
      abortRef.current?.abort()
      quickAbortRef.current?.abort()
    },
    []
  )

  // Without a key, replies are samples. Once there's one, a model no key
  // reaches can't be chosen, and one that was chosen gives way to one that can.
  const live = Object.keys(keys).length > 0
  const models = React.useMemo(
    () =>
      live
        ? MODELS.map((option) =>
            routeOf(option, keys) ? option : { ...option, disabled: true }
          )
        : MODELS,
    [keys, live]
  )
  const reachable = (id: string) => {
    const chosen = models.find((option) => option.id === id)
    if (chosen && !chosen.disabled) return chosen
    return models.find((option) => !option.disabled) ?? chosen ?? MODELS[0]
  }
  const replyModel = reachable(model)
  const quickReplyModel = reachable(quickModel)

  const openSettings = (section: SettingsSection) => {
    setSettingsSection(section)
    setSettingsOpen(true)
  }

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

  const updateConversation = (
    conversationId: string,
    patch: Partial<Conversation>
  ) =>
    setConversations((all) =>
      all.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, ...patch }
          : conversation
      )
    )

  const setStatus = (conversationId: string, status?: ConversationStatus) =>
    updateConversation(conversationId, { status })

  const markRead = (conversationId: string | null) => {
    if (conversationId) updateConversation(conversationId, { unread: false })
  }

  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    abortRef.current?.abort()
    abortRef.current = null
    const current = streamRef.current
    streamRef.current = null
    setStreamingId(null)
    if (!current) return

    // A run that was stopped has neither finished nor failed.
    setStatus(current.conversationId, undefined)

    // A reply stopped before its first word or thought has nothing worth
    // keeping. One stopped while thinking thought until now.
    updateMessages(current.conversationId, (messages) =>
      messages.flatMap((message): ChatMessage[] => {
        if (message.id !== current.messageId) return [message]
        if (!message.content && !message.reasoning) return []
        const reasoningDuration =
          message.reasoning && message.reasoningDuration === undefined
            ? secondsSince(message.createdAt)
            : message.reasoningDuration
        return [
          {
            ...message,
            status: "stopped",
            reasoningDuration,
            activity: undefined,
          },
        ]
      })
    )
  }

  const streamSample = (
    conversationId: string,
    messageId: string,
    startedAt: Date
  ) => {
    const thoughts = PREVIEW_REASONING.split(/(?<=\s)/)
    const words = PREVIEW_REPLY.split(/(?<=\s)/)
    let shown = 0
    let reasoningDuration: number | undefined
    streamRef.current = { conversationId, messageId }
    setStreamingId(conversationId)
    setStatus(conversationId, "running")

    // The thoughts come first, then the reply, the way a reasoning model's do.
    const tick = () => {
      shown += 1
      const thinking = shown < thoughts.length
      const done = shown >= thoughts.length + words.length
      if (!thinking && reasoningDuration === undefined) {
        reasoningDuration = secondsSince(startedAt)
      }
      updateMessages(conversationId, (messages) =>
        messages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                reasoning: thoughts.slice(0, shown).join(""),
                reasoningDuration,
                content: words
                  .slice(0, Math.max(0, shown - thoughts.length))
                  .join(""),
                status: done ? undefined : "streaming",
              }
            : message
        )
      )
      if (done) {
        timerRef.current = null
        streamRef.current = null
        setStreamingId(null)
        // A reply that lands in a chat nobody is looking at waits as unread.
        updateConversation(conversationId, {
          status: "completed",
          unread: activeIdRef.current !== conversationId,
        })
      } else {
        timerRef.current = setTimeout(
          tick,
          thinking ? THOUGHT_DELAY : WORD_DELAY
        )
      }
    }

    timerRef.current = setTimeout(tick, FIRST_WORD_DELAY)
  }

  const streamLive = (
    conversationId: string,
    messageId: string,
    history: ChatMessage[],
    startedAt: Date
  ) => {
    const controller = new AbortController()
    abortRef.current = controller
    streamRef.current = { conversationId, messageId }
    setStreamingId(conversationId)
    setStatus(conversationId, "running")

    const current = () => abortRef.current === controller
    const patchReply = (patch: Partial<ChatMessage>) =>
      updateMessages(conversationId, (messages) =>
        messages.map((message) =>
          message.id === messageId ? { ...message, ...patch } : message
        )
      )
    const settle = (patch: Partial<ChatMessage>) => {
      if (!current()) return
      abortRef.current = null
      streamRef.current = null
      setStreamingId(null)
      patchReply({ ...patch, activity: undefined })
      updateConversation(conversationId, {
        status: patch.status === "failed" ? "failed" : "completed",
        unread: activeIdRef.current !== conversationId,
      })
    }

    // It thought for as long as the reply took to start.
    let content = ""
    let thought = ""
    let reasoningDuration: number | undefined
    const settleThinking = () =>
      thought && reasoningDuration === undefined
        ? { reasoningDuration: secondsSince(startedAt) }
        : {}

    streamReply({
      chatId: conversationId,
      model: replyModel,
      keys,
      messages: history,
      signal: controller.signal,
      onUpdate: ({ text, reasoning, activity, sources }) => {
        if (!current()) return
        content = text
        thought = reasoning
        if (reasoning && text && reasoningDuration === undefined) {
          reasoningDuration = secondsSince(startedAt)
        }
        patchReply({
          content: text,
          reasoning: reasoning || undefined,
          reasoningDuration,
          activity,
          sources: sources.length > 0 ? sources : undefined,
        })
      },
    }).then(
      () =>
        settle(
          content
            ? { status: undefined, ...settleThinking() }
            : { status: "failed", error: "The reply came back empty." }
        ),
      (error: unknown) =>
        settle({
          status: "failed",
          error: errorText(error),
          ...settleThinking(),
        })
    )
  }

  // `startedAt` is when the reply was asked for, which its thinking time
  // counts from.
  const stream = (
    conversationId: string,
    messageId: string,
    history: ChatMessage[],
    startedAt: Date
  ) =>
    live
      ? streamLive(conversationId, messageId, history, startedAt)
      : streamSample(conversationId, messageId, startedAt)

  const send = (text: string, attachments: ChatAttachment[] = []) => {
    stop()
    const createdAt = new Date()
    const question: ChatMessage = {
      id: makeId("message"),
      role: "user",
      content: text,
      attachments: attachments.length > 0 ? attachments : undefined,
      createdAt,
    }
    const reply: ChatMessage = {
      id: makeId("message"),
      role: "assistant",
      content: "",
      status: "streaming",
      createdAt,
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
      stream(id, reply.id, [question], createdAt)
    } else {
      // A sample chat can arrive mid-reply with nothing streaming it, so its
      // reply is left where it got to.
      updateMessages(activeId, (messages) => [
        ...messages.map((message) =>
          message.status === "streaming"
            ? { ...message, status: "stopped" as const }
            : message
        ),
        question,
        reply,
      ])
      stream(
        activeId,
        reply.id,
        [...(active?.messages ?? []), question],
        createdAt
      )
    }
  }

  const retry = (messageId: string) => {
    if (activeId === null) return
    stop()
    const messages = active?.messages ?? []
    const index = messages.findIndex((message) => message.id === messageId)
    const createdAt = new Date()
    updateMessages(activeId, (messages) =>
      messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              content: "",
              status: "streaming",
              error: undefined,
              reasoning: undefined,
              reasoningDuration: undefined,
              activity: undefined,
              sources: undefined,
              createdAt,
            }
          : message
      )
    )
    stream(
      activeId,
      messageId,
      messages.slice(0, Math.max(index, 0)),
      createdAt
    )
  }

  const edit = (content: string) => {
    setDraft(content)
    inputRef.current?.focus()
  }

  // Leaving a chat leaves its reply running, so it can finish in the
  // background and wait as unread. Only sending again stops it, since the
  // chat streams one reply at a time.
  const select = (id: string) => {
    markRead(id)
    setTemporaryDraft(false)
    setHistory((current) => visit(current, id))
  }

  const startNewChat = () => {
    setTemporaryDraft(false)
    setHistory((current) => visit(current, null))
  }

  // A temporary chat that has started can't be made permanent, so turning it
  // off leaves it for a new chat.
  const setTemporary = (next: boolean) => {
    if (active) startNewChat()
    else setTemporaryDraft(next)
  }

  const openQuickChat = () => {
    setQuickChatOpen(true)
    onQuickChat?.()
  }

  // A reply stopped before its first word has nothing worth keeping.
  const stopQuickChat = () => {
    if (quickTimerRef.current) clearTimeout(quickTimerRef.current)
    quickTimerRef.current = null
    quickAbortRef.current?.abort()
    quickAbortRef.current = null
    setQuickStreaming(false)
    setQuickMessages((all) =>
      all.flatMap((message) => {
        if (!message.streaming) return [message]
        if (!message.content && !message.reasoning) return []
        const reasoningDuration =
          message.reasoning && message.reasoningDuration === undefined
            ? secondsSince(message.startedAt)
            : message.reasoningDuration
        return [
          {
            ...message,
            streaming: false,
            reasoningDuration,
            activity: undefined,
          },
        ]
      })
    )
  }

  const startNewQuickChat = () => {
    stopQuickChat()
    setQuickMessages([])
    setQuickDraft("")
    setQuickComposerKey((key) => key + 1)
  }

  const streamQuickLive = (
    replyId: string,
    history: QuickMessage[],
    startedAt: Date
  ) => {
    const controller = new AbortController()
    quickAbortRef.current = controller
    const current = () => quickAbortRef.current === controller
    const patchReply = (patch: Partial<QuickMessage>) =>
      setQuickMessages((all) =>
        all.map((message) =>
          message.id === replyId ? { ...message, ...patch } : message
        )
      )
    const settle = (patch: Partial<QuickMessage>) => {
      if (!current()) return
      quickAbortRef.current = null
      setQuickStreaming(false)
      patchReply({ ...patch, streaming: false, activity: undefined })
    }

    let content = ""
    let thought = ""
    let reasoningDuration: number | undefined
    const settleThinking = () =>
      thought && reasoningDuration === undefined
        ? { reasoningDuration: secondsSince(startedAt) }
        : {}

    streamReply({
      chatId: "quick-chat",
      model: quickReplyModel,
      keys,
      messages: history.map((message) => ({
        id: message.id,
        role: message.from,
        content: message.content,
        attachments: message.files,
        status: message.failed ? "failed" : undefined,
      })),
      signal: controller.signal,
      onUpdate: ({ text, reasoning, activity }) => {
        if (!current()) return
        content = text
        thought = reasoning
        if (reasoning && text && reasoningDuration === undefined) {
          reasoningDuration = secondsSince(startedAt)
        }
        patchReply({
          content: text,
          reasoning: reasoning || undefined,
          reasoningDuration,
          activity,
        })
      },
    }).then(
      () =>
        settle(
          content
            ? settleThinking()
            : { content: "The reply came back empty.", failed: true }
        ),
      (error: unknown) =>
        settle({ content: errorText(error), failed: true, ...settleThinking() })
    )
  }

  const sendQuickChat = (
    content: string,
    attachments: ChatAttachment[] = []
  ) => {
    stopQuickChat()
    const question: QuickMessage = {
      id: makeId("message"),
      from: "user",
      content,
      files: attachments,
      attachments:
        attachments.length > 0 ? (
          <ChatAttachments attachments={attachments} size="sm" />
        ) : undefined,
    }
    const replyId = makeId("message")
    const startedAt = new Date()
    setQuickMessages((all) => [
      ...all,
      question,
      {
        id: replyId,
        from: "assistant",
        content: "",
        streaming: true,
        startedAt,
      },
    ])
    setQuickStreaming(true)
    if (live) {
      streamQuickLive(replyId, [...quickMessages, question], startedAt)
      return
    }

    // The sample thinks a word at a time, then answers.
    const thoughts = QUICK_REASONING.split(/(?<=\s)/)
    let shown = 0
    const patchReply = (patch: Partial<QuickMessage>) =>
      setQuickMessages((all) =>
        all.map((message) =>
          message.id === replyId ? { ...message, ...patch } : message
        )
      )
    const tick = () => {
      shown += 1
      if (shown <= thoughts.length) {
        patchReply({ reasoning: thoughts.slice(0, shown).join("") })
        quickTimerRef.current = setTimeout(tick, THOUGHT_DELAY)
        return
      }
      patchReply({
        content: QUICK_REPLY,
        streaming: false,
        reasoningDuration: secondsSince(startedAt),
      })
      setQuickStreaming(false)
      quickTimerRef.current = null
    }
    quickTimerRef.current = setTimeout(tick, FIRST_WORD_DELAY)
  }

  const toggleActivity = () => {
    const open = !activityOpen
    setActivityOpen(open)
    onActivity?.(open)
  }

  const openSaved = active && !active.temporary ? active : undefined

  const saved = conversations.filter(
    (conversation) => !conversation.temporary && !conversation.archived
  )

  const canGoBack = history.index > 0
  const canGoForward = history.index < history.entries.length - 1

  const go = (step: -1 | 1) => {
    const index = history.index + step
    if (index < 0 || index >= history.entries.length) return
    markRead(history.entries[index])
    setHistory({ ...history, index })
  }

  // Read fresh on every key, so the listener below never sees an old history.
  const onShortcut = React.useEffectEvent((event: KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey) return
    const key = event.key.toLowerCase()
    const action = event.shiftKey
      ? { n: openQuickChat, u: toggleActivity }[key]
      : {
          n: startNewChat,
          "[": () => go(-1),
          "]": () => go(1),
          k: () => setSearchOpen((open) => !open),
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

  const archive = (id: string) => {
    setConversations((all) =>
      all.map((conversation) =>
        conversation.id === id
          ? { ...conversation, archived: true }
          : conversation
      )
    )
    // Archiving the open chat leaves a new one in its place, as deleting does.
    if (id === activeId) startNewChat()
  }

  // A reply still streaming is copied as far as it has got.
  const fork = (id: string) => {
    const source = conversations.find((conversation) => conversation.id === id)
    if (!source) return
    const copy: Conversation = {
      id: makeId("chat"),
      title: `${source.title} (fork)`,
      messages: source.messages.map((message) => ({
        ...message,
        id: makeId("message"),
        status: message.status === "streaming" ? "stopped" : message.status,
      })),
    }
    setConversations((all) => [copy, ...all])
    select(copy.id)
  }

  const share = (id: string) => {
    if (id !== activeId) select(id)
    setShareOpen(true)
  }

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
        "relative flex h-full min-h-0 w-full overflow-hidden bg-background text-foreground",
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
              chats={saved}
              activeId={activeId}
              user={SAMPLE_USER}
              usage={SAMPLE_USAGE}
              userMenu={{
                settings: {
                  providers: PROVIDERS,
                  providerKeys: keys,
                  defaultSection: settingsSection,
                },
                settingsOpen,
                onSettingsOpenChange: (open) => {
                  setSettingsOpen(open)
                  if (!open) setSettingsSection("general")
                },
                onSettingsSave: (values) => setKeys(values.providerKeys),
              }}
              mode={mode}
              onModeChange={setMode}
              onNewChat={startNewChat}
              onQuickChat={openQuickChat}
              onProjects={onProjects}
              onSearch={() => setSearchOpen(true)}
              activityOpen={activityOpen}
              onActivity={toggleActivity}
              onSelect={select}
              onRename={rename}
              onTogglePin={togglePin}
              onArchive={archive}
              onShare={share}
              onFork={fork}
              onDelete={remove}
            />
          }
          headerBorder={{ left: false }}
          glassHeader
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
                messages={active?.messages ?? []}
                // A temporary chat can only be deleted: it has no place in the
                // sidebar to pin or archive into, and nothing to share.
                shareUrl={openSaved ? shareUrlOf(openSaved.id) : undefined}
                shareOpen={shareOpen}
                onShareOpenChange={setShareOpen}
                pinned={openSaved?.pinned}
                onRename={
                  openSaved ? (title) => rename(openSaved.id, title) : undefined
                }
                onTogglePin={
                  openSaved ? () => togglePin(openSaved.id) : undefined
                }
                onArchive={openSaved ? () => archive(openSaved.id) : undefined}
                onFork={openSaved ? () => fork(openSaved.id) : undefined}
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
              onAddKey={live ? undefined : () => openSettings("providers")}
            />
            <ChatComposer
              value={draft}
              onValueChange={setDraft}
              onSend={send}
              onStop={stop}
              status={status}
              models={models}
              model={replyModel.id}
              onModelChange={setModel}
              projects={SAMPLE_PROJECTS}
              project={project}
              onProjectChange={setProject}
              plugins={SAMPLE_PLUGINS}
              activePlugins={plugins}
              onPluginsChange={setPlugins}
              workIn={workIn}
              onWorkInChange={setWorkIn}
              branches={branches}
              branch={branch}
              onBranchChange={setBranch}
              onBranchCreate={(name) => {
                setBranches((all) => [name, ...all])
                setBranch(name)
              }}
              inputRef={inputRef}
              note={DISCLAIMER}
            />
          </div>
          <ChatSearch
            open={searchOpen}
            onOpenChange={setSearchOpen}
            chats={saved}
            onSelect={select}
          />
        </Panels>
      </SidebarProvider>
      <QuickChat
        open={quickChatOpen}
        onOpenChange={setQuickChatOpen}
        onNewChat={startNewQuickChat}
        messages={quickMessages}
        composer={
          <ChatComposer
            key={quickComposerKey}
            value={quickDraft}
            onValueChange={setQuickDraft}
            onSend={sendQuickChat}
            onStop={stopQuickChat}
            status={quickStreaming ? "streaming" : "ready"}
            models={models}
            model={quickReplyModel.id}
            onModelChange={setQuickModel}
            projects={SAMPLE_PROJECTS}
            project={quickProject}
            onProjectChange={setQuickProject}
            plugins={SAMPLE_PLUGINS}
            activePlugins={quickPlugins}
            onPluginsChange={setQuickPlugins}
            workIn={quickWorkIn}
            onWorkInChange={setQuickWorkIn}
            branches={quickBranches}
            branch={quickBranch}
            onBranchChange={setQuickBranch}
            onBranchCreate={(name) => {
              setQuickBranches((all) => [name, ...all])
              setQuickBranch(name)
            }}
          />
        }
        className="absolute"
      />
    </div>
  )
}

export { Chat }
