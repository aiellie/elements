type ChatNavStatus = "running" | "completed" | "failed"

/** A chat as the sidebar, search and stored list know it. */
type ChatNavChat = {
  id: string
  title: string
  pinned?: boolean
  status?: ChatNavStatus
  /** While it's running, when the reply it's waiting on was asked for. */
  startedAt?: number
  /** Finished while it wasn't open, and not opened since. */
  unread?: boolean
}

export type { ChatNavChat, ChatNavStatus }
