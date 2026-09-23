"use client"

import * as React from "react"
import {
  usePanelRef,
  type PanelImperativeHandle,
  type PanelProps,
  type PanelSize,
} from "react-resizable-panels"

import { ChatComposer } from "@/registry/aiellie/blocks/chat/components/chat-composer"
import { ChatHeader } from "@/registry/aiellie/blocks/chat/components/chat-header"
import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"
import { ChatSidebar } from "@/registry/aiellie/blocks/chat/components/chat-sidebar"
import { ChatThread } from "@/registry/aiellie/blocks/chat/components/chat-thread"
import type { ComposerStatus } from "@/registry/aiellie/components/composer"
import { MODELS } from "@/registry/aiellie/lib/models"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/aiellie/ui/resizable"
import { SidebarProvider, useSidebar } from "@/registry/aiellie/ui/sidebar"
import { cn } from "@/lib/utils"

type Conversation = {
  id: string
  title: string
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
 * The sidebar's width in pixels: where it starts, and how far it can be
 * dragged either way. Dragging it well past the narrowest folds it away.
 */
const SIDEBAR_MIN = 200
const SIDEBAR_DEFAULT = 240
const SIDEBAR_MAX = 400

/** How long the sidebar takes to fold away or come back, in milliseconds. */
const SIDEBAR_DURATION = 280

/**
 * The sidebar, wherever there is room for it. Beside the thread it sits in a
 * panel whose edge can be dragged. On a phone there is no room beside the
 * thread, so the sidebar leaves the panels and opens over the page as a sheet.
 *
 * The panel's width is what animates as it folds away. The sidebar inside
 * keeps its own width throughout, so its rows slide out of view instead of
 * squeezing, and it is inert while folded, so nothing hidden can be tabbed to.
 */
function ChatSidebarPanel({
  panelRef,
  animating,
  width,
  onResize,
  ...sidebar
}: React.ComponentProps<typeof ChatSidebar> & {
  panelRef: React.Ref<PanelImperativeHandle | null>
  /** True while the width is animating, when the sidebar holds `width`. */
  animating: boolean
  width: number
  onResize: PanelProps["onResize"]
}) {
  const { isMobile, open } = useSidebar()

  if (isMobile) return <ChatSidebar {...sidebar} />

  return (
    <>
      <ResizablePanel
        id="sidebar"
        panelRef={panelRef}
        collapsible
        defaultSize={SIDEBAR_DEFAULT}
        minSize={SIDEBAR_MIN}
        maxSize={SIDEBAR_MAX}
        groupResizeBehavior="preserve-pixel-size"
        onResize={onResize}
        style={{ overflow: "hidden" }}
      >
        <div
          inert={!open}
          className="h-full"
          style={{ width: open && !animating ? "100%" : width }}
        >
          <ChatSidebar collapsible="none" className="w-full" {...sidebar} />
        </div>
      </ResizablePanel>
      {/* Folded away, the line goes too, but the handle stays where it was
          so the sidebar can be dragged back out. */}
      <ResizableHandle withHandle className={cn(!open && "bg-transparent")} />
    </>
  )
}

/**
 * The chat page: your chats down the side, the open one in the middle, and the
 * composer underneath.
 *
 * On a wide screen the sidebar sits beside the thread. Its edge can be dragged
 * to resize it, and the header's toggle, or ⌘B, folds it away. On a narrow one
 * there is no room beside the thread, so the toggle opens the sidebar over the
 * page in a sheet instead.
 */
function Chat({ className }: { className?: string }) {
  const [conversations, setConversations] = React.useState(SAMPLE_CONVERSATIONS)
  // Null is a new chat. Nothing is saved until its first message is sent.
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [draft, setDraft] = React.useState("")
  const [model, setModel] = React.useState(MODELS[0].id)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  // True while the toggle is folding the sidebar away or bringing it back, the
  // only time its width animates. A drag has to follow the pointer exactly.
  const [sidebarAnimating, setSidebarAnimating] = React.useState(false)
  // The sidebar's width before it was last folded, which it keeps while it
  // folds and while it comes back.
  const [sidebarWidth, setSidebarWidth] = React.useState(SIDEBAR_DEFAULT)
  // The chat a reply is being written into, which is not always the open one.
  const [streamingId, setStreamingId] = React.useState<string | null>(null)

  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const sidebarRef = usePanelRef()
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const sidebarTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const streamRef = React.useRef<{
    conversationId: string
    messageId: string
  } | null>(null)
  const nextId = React.useRef(0)

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current)
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
      setActiveId(id)
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
    setActiveId(id)
  }

  const startNewChat = () => {
    stop()
    setActiveId(null)
  }

  const rename = (id: string, title: string) =>
    setConversations((all) =>
      all.map((conversation) =>
        conversation.id === id ? { ...conversation, title } : conversation
      )
    )

  const remove = (id: string) => {
    if (streamRef.current?.conversationId === id) stop()
    setConversations((all) =>
      all.filter((conversation) => conversation.id !== id)
    )
    if (id === activeId) setActiveId(null)
  }

  /**
   * Where the sidebar's toggle and shortcut land on a wide screen: the panel
   * folds away or comes back, animated.
   */
  const setSidebar = (open: boolean) => {
    const panel = sidebarRef.current
    if (!panel || open === !panel.isCollapsed()) return
    if (sidebarTimerRef.current) clearTimeout(sidebarTimerRef.current)
    setSidebarAnimating(true)
    if (open) {
      setSidebarOpen(true)
      panel.expand()
    } else {
      setSidebarWidth(panel.getSize().inPixels)
      setSidebarOpen(false)
      panel.collapse()
    }
    sidebarTimerRef.current = setTimeout(() => {
      sidebarTimerRef.current = null
      setSidebarAnimating(false)
    }, SIDEBAR_DURATION)
  }

  // A drag can fold the sidebar away too, so whether it is open is read back
  // from the panel rather than kept only by the toggle. The panel reports its
  // measured width on every frame of the toggle's animation, so the toggle
  // speaks for itself until it is done.
  const onSidebarResize = (
    _size: PanelSize,
    _id?: unknown,
    prev?: PanelSize
  ) => {
    const panel = sidebarRef.current
    if (!panel || sidebarTimerRef.current) return
    const open = !panel.isCollapsed()
    setSidebarOpen(open)
    if (!open && prev && prev.inPixels > 0) setSidebarWidth(prev.inPixels)
  }

  const sidebarProps = {
    conversations,
    activeId,
    onSelect: select,
    onNewChat: startNewChat,
    onRename: rename,
    onDelete: remove,
  }

  return (
    <div
      data-slot="chat"
      className={cn(
        "flex h-full min-h-0 w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      {/* The provider keeps whether the sidebar is open, for the header's
          toggle and for ⌘B. The panel animates only while the toggle is at
          work, since a drag has to follow the pointer exactly. */}
      <SidebarProvider
        open={sidebarOpen}
        onOpenChange={setSidebar}
        className="min-h-0"
      >
        <ResizablePanelGroup
          data-animating={sidebarAnimating || undefined}
          className="data-animating:*:transition-[flex-grow] data-animating:*:duration-280 data-animating:*:ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:*:transition-none"
        >
          {/* Always the first child, so the thread's panel after it stays
              mounted when the sidebar moves between the panels and a sheet. */}
          <ChatSidebarPanel
            panelRef={sidebarRef}
            animating={sidebarAnimating}
            width={sidebarWidth}
            onResize={onSidebarResize}
            {...sidebarProps}
          />
          <ResizablePanel
            id="main"
            className="flex min-w-0 flex-col"
            style={{ overflow: "hidden" }}
          >
            <ChatHeader
              title={active?.title ?? "New chat"}
              onNewChat={startNewChat}
              onDelete={active ? () => remove(active.id) : undefined}
            />
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </div>
  )
}

export { Chat }
