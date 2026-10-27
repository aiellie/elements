"use client"

import * as React from "react"
import {
  ArrowUpRight01Icon,
  InboxIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"

type WaitKind = "approval" | "question" | "blocked"

type WaitingItem = {
  id: string
  /** The thread or task the agent is working on. */
  thread: string
  kind: WaitKind
  /** What the agent needs, as a question. */
  prompt: string
  /** The command, file or value in question, shown in mono. */
  detail?: string
  /** The choices for a question. */
  options?: readonly string[]
  /** How long it had been waiting when the list was built. */
  waitingSeconds: number
}

type WaitingAnswer =
  { kind: "approval"; approved: boolean } | { kind: "question"; answer: string }

/** "now", "45s", "12m", "3h". */
function formatWait(seconds: number) {
  if (seconds < 10) return "now"
  if (seconds < 60) return `${Math.floor(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  return `${Math.floor(seconds / 3600)}h`
}

// Ticks once a second after mount, so the server and the first client render
// agree.
function useElapsed() {
  const [elapsed, setElapsed] = React.useState(0)
  React.useEffect(() => {
    const started = Date.now()
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),
      1000
    )
    return () => clearInterval(timer)
  }, [])
  return elapsed
}

const EXIT_MS = 280

function NeedsYou({
  items,
  onAnswer,
  onOpen,
  staleAfter = 600,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  items: readonly WaitingItem[]
  /** Fires with the decision. Take the item out of `items` once it's sent. */
  onAnswer?: (id: string, answer: WaitingAnswer) => void
  /** Adds Open to each item, for anything that needs the whole thread. */
  onOpen?: (id: string) => void
  /** Seconds after which a wait is marked as overdue. */
  staleAfter?: number
}) {
  const titleId = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const elapsed = useElapsed()

  const sorted = [...items].sort((a, b) => b.waitingSeconds - a.waitingSeconds)
  const ids = sorted.map((item) => item.id).join()

  // Items that leave `items` fold away from where they were rather than
  // vanishing, whoever took them out.
  const [leaving, setLeaving] = React.useState<
    { item: WaitingItem; index: number }[]
  >([])
  const [previous, setPrevious] = React.useState({ ids, sorted })
  if (previous.ids !== ids) {
    const gone = previous.sorted
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !items.some((current) => current.id === item.id))
    if (gone.length > 0) setLeaving((current) => [...current, ...gone])
    setPrevious({ ids, sorted })
  }
  React.useEffect(() => {
    if (leaving.length === 0) return
    const timer = setTimeout(() => setLeaving([]), EXIT_MS)
    return () => clearTimeout(timer)
  }, [leaving])

  const [announcement, setAnnouncement] = React.useState("")

  const rows = sorted.map((item) => ({ item, leaving: false }))
  for (const entry of leaving) {
    if (items.some((item) => item.id === entry.item.id)) continue
    rows.splice(Math.min(entry.index, rows.length), 0, {
      item: entry.item,
      leaving: true,
    })
  }
  const oldest = sorted[0]

  const answer = (item: WaitingItem, value: WaitingAnswer) => {
    const index = sorted.findIndex((entry) => entry.id === item.id)
    setAnnouncement(
      value.kind === "approval"
        ? `${value.approved ? "Approved" : "Denied"}. ${item.thread} can continue.`
        : `Answered “${value.answer}”. ${item.thread} can continue.`
    )
    onAnswer?.(item.id, value)

    // Keeps focus in the list, on the item that takes this one's place.
    requestAnimationFrame(() => {
      const next = sorted[index + 1] ?? sorted[index - 1]
      const target = next
        ? listRef.current?.querySelector<HTMLElement>(
            `[data-item="${CSS.escape(next.id)}"] button`
          )
        : rootRef.current
      target?.focus()
    })
  }

  return (
    <div
      ref={rootRef}
      role="region"
      aria-labelledby={titleId}
      tabIndex={-1}
      data-slot="needs-you"
      data-empty={items.length === 0 || undefined}
      className={cn(
        "flex max-h-full min-h-0 w-full max-w-sm flex-col gap-1 rounded-2xl border border-border/60 bg-background p-3 outline-none",
        className
      )}
      {...props}
    >
      <span role="status" className="sr-only">
        {announcement}
      </span>

      <div
        data-slot="needs-you-header"
        className="flex h-6 items-center gap-2 px-1 pb-1"
      >
        <HugeiconsIcon
          aria-hidden
          icon={InboxIcon}
          className="size-4 shrink-0 text-muted-foreground"
        />
        <p id={titleId} className="flex-1 truncate text-sm font-medium">
          Needs you
          {items.length > 0 ? (
            <span className="ms-1.5 font-normal text-muted-foreground tabular-nums">
              {items.length}
            </span>
          ) : null}
        </p>
        {oldest ? (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            Oldest {formatWait(oldest.waitingSeconds + elapsed)}
          </span>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <p className="flex min-h-16 animate-in items-center justify-center gap-2 text-xs text-muted-foreground duration-280 fade-in motion-reduce:animate-none">
          <HugeiconsIcon
            aria-hidden
            icon={Tick02Icon}
            className="size-3.5 text-emerald-600 dark:text-emerald-400"
          />
          Nothing is waiting on you.
        </p>
      ) : (
        <ul
          ref={listRef}
          className="-mx-1 flex min-h-0 [scrollbar-width:thin] flex-col overflow-y-auto overscroll-contain px-1"
        >
          {rows.map(({ item, leaving: isLeaving }) => (
            <li
              key={item.id}
              data-item={item.id}
              data-leaving={isLeaving || undefined}
              aria-hidden={isLeaving || undefined}
              className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-280 ease-out data-leaving:pointer-events-none data-leaving:grid-rows-[0fr] data-leaving:opacity-0 motion-reduce:transition-none"
            >
              <div className="min-h-0 overflow-hidden">
                <Item
                  item={item}
                  waited={item.waitingSeconds + elapsed}
                  stale={item.waitingSeconds + elapsed >= staleAfter}
                  inert={isLeaving}
                  onAnswer={
                    onAnswer ? (value) => answer(item, value) : undefined
                  }
                  onOpen={onOpen ? () => onOpen(item.id) : undefined}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Item({
  item,
  waited,
  stale,
  inert,
  onAnswer,
  onOpen,
}: {
  item: WaitingItem
  waited: number
  stale: boolean
  inert: boolean
  onAnswer?: (answer: WaitingAnswer) => void
  onOpen?: () => void
}) {
  const promptId = React.useId()

  return (
    <div
      role="group"
      aria-labelledby={promptId}
      data-slot="needs-you-item"
      data-kind={item.kind}
      data-stale={stale || undefined}
      inert={inert}
      className="flex flex-col gap-1 border-t border-border/60 px-1 py-2.5"
    >
      <div className="flex h-5 items-center gap-2">
        {onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Open ${item.thread}`}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-1 rounded-sm border border-transparent text-start text-xs text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:border-ring motion-reduce:transition-none"
          >
            <span className="truncate">{item.thread}</span>
            <HugeiconsIcon
              aria-hidden
              icon={ArrowUpRight01Icon}
              className="size-3 shrink-0 rtl:-scale-x-100"
            />
          </button>
        ) : (
          <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
            {item.thread}
          </span>
        )}
        <span
          className={cn(
            "shrink-0 text-xs tabular-nums",
            stale ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <span className="sr-only">Waiting </span>
          {formatWait(waited)}
          {stale ? <span className="ms-1">overdue</span> : null}
        </span>
      </div>
      <p id={promptId} className="text-sm leading-snug">
        {item.prompt}
      </p>

      <div
        className={cn(
          "flex items-center gap-1.5 pt-1",
          item.kind === "question" && "flex-wrap justify-end"
        )}
      >
        {item.detail ? (
          <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-2 py-1 font-mono text-[11px]">
            {item.detail}
          </code>
        ) : (
          <span className="flex-1" />
        )}
        {item.kind === "approval" && onAnswer ? (
          <>
            <Button
              variant="ghost"
              onClick={() => onAnswer({ kind: "approval", approved: false })}
              className="shrink-0"
            >
              Deny
            </Button>
            <Button
              onClick={() => onAnswer({ kind: "approval", approved: true })}
              className="shrink-0"
            >
              Approve
            </Button>
          </>
        ) : null}
        {item.kind === "question" && onAnswer
          ? item.options?.map((option) => (
              <Button
                key={option}
                variant="outline"
                onClick={() => onAnswer({ kind: "question", answer: option })}
                className="shrink-0"
              >
                {option}
              </Button>
            ))
          : null}
        {item.kind === "blocked" && onOpen ? (
          <Button onClick={onOpen} className="shrink-0">
            Open
            <HugeiconsIcon
              aria-hidden
              icon={ArrowUpRight01Icon}
              data-icon="inline-end"
              className="rtl:-scale-x-100"
            />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export { NeedsYou, formatWait }
export type { WaitKind, WaitingAnswer, WaitingItem }
