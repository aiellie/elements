type ChatAttachment = {
  id: string
  name: string
  kind: "file" | "image" | "folder"
  /** In bytes. Left out for a folder. */
  size?: number
  /** A link to the file made in the browser, for an image or a PDF to show. */
  url?: string
  /** One for a file or an image, every file inside for a folder. */
  files: File[]
}

type ChatSource = {
  url: string
  title?: string
}

type ChatToolCall = {
  id: string
  /** What it says on its row, like "Searched the web". */
  name: string
  kind: "search" | "tool"
  status: "running" | "done" | "error"
  /** The query, for a search. */
  summary?: string
  input?: unknown
  output?: unknown
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  attachments?: ChatAttachment[]
  /** Left out once a reply has finished. */
  status?: "streaming" | "stopped" | "failed"
  /** Why a failed reply failed. */
  error?: string
  /** What the model thought before replying, for a model that shows it. */
  reasoning?: string
  /** Seconds from asking to the reply's first word. */
  reasoningDuration?: number
  /** What a streaming reply is doing while no words come, like "Searching the web". */
  activity?: string
  /** Pages a search turned up for the reply. */
  sources?: ChatSource[]
  /** The tools the reply called, in order. */
  tools?: ChatToolCall[]
  createdAt?: Date
}

type ConversationStatus = "running" | "completed" | "failed"

type Conversation = {
  id: string
  title: string
  pinned?: boolean
  /** Kept out of the sidebar, but not deleted. */
  archived?: boolean
  /** Kept out of the sidebar, and gone once the page is left. */
  temporary?: boolean
  /** Where its latest run stands. */
  status?: ConversationStatus
  /** Finished while it wasn't open, and not opened since. */
  unread?: boolean
  messages: ChatMessage[]
}

export type {
  ChatAttachment,
  ChatSource,
  ChatToolCall,
  ChatMessage,
  ConversationStatus,
  Conversation,
}
