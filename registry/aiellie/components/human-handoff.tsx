"use client"

import * as React from "react"
import {
  CustomerSupportIcon,
  Moon02Icon,
  PencilEdit02Icon,
  Tick02Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/aiellie/ui/avatar"
import { Button } from "@/registry/aiellie/ui/button"
import { Input } from "@/registry/aiellie/ui/input"
import { Textarea } from "@/registry/aiellie/ui/textarea"

type HandoffState =
  "offered" | "connecting" | "connected" | "unavailable" | "ended"

type HandoffAgent = {
  name: string
  role?: string
  image?: string
}

type HandoffDetail = {
  label: string
  value: string
}

function ordinal(n: number) {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = n % 100
  return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? "th"}`
}

/** 1 → "Next in line", 3 → "3rd in line". */
function queueLabel(position: number) {
  return position <= 1 ? "Next in line" : `${ordinal(position)} in line`
}

function clock(seconds: number) {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function minutesText(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60))
  return `about ${minutes} ${minutes === 1 ? "minute" : "minutes"}`
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

// Ticks a wait estimate down once a second from whatever the service last said.
function useCountdown(seconds: number | undefined, active: boolean) {
  const [elapsed, setElapsed] = React.useState(0)
  const [previousSeconds, setPreviousSeconds] = React.useState(seconds)
  if (seconds !== previousSeconds) {
    setPreviousSeconds(seconds)
    setElapsed(0)
  }

  React.useEffect(() => {
    if (!active || seconds === undefined) return
    const started = Date.now()
    const timer = setInterval(
      () => setElapsed((Date.now() - started) / 1000),
      1000
    )
    return () => clearInterval(timer)
  }, [seconds, active])

  return Math.max(0, (seconds ?? 0) - elapsed)
}

// The people ahead as dots. The one who just left shrinks out rather than
// vanishing.
function QueueDots({ ahead }: { ahead: number }) {
  const [shown, setShown] = React.useState(ahead)
  if (ahead > shown) setShown(ahead)
  const leaving = shown > ahead

  React.useEffect(() => {
    if (!leaving) return
    const timer = setTimeout(() => setShown(ahead), 280)
    return () => clearTimeout(timer)
  }, [ahead, leaving])

  const visible = Math.min(shown, 5)
  return (
    <span aria-hidden className="flex items-center gap-1.5">
      {Array.from({ length: visible }, (_, index) => (
        <span
          key={shown - index}
          className={cn(
            "size-2 rounded-full bg-foreground/20 transition-[scale,opacity] duration-280 ease-out motion-reduce:transition-none",
            leaving && index === 0 && "scale-0 opacity-0"
          )}
        />
      ))}
      {shown > 5 ? (
        <span className="text-[11px] text-muted-foreground tabular-nums">
          +{shown - 5}
        </span>
      ) : null}
      <span className="size-2.5 rounded-full bg-live shadow-[0_0_0_4px] shadow-live/15" />
      <span className="ms-0.5 text-[11px] text-muted-foreground">you</span>
    </span>
  )
}

function HumanHandoff({
  state,
  reason,
  summary = "",
  details = [],
  queuePosition = 1,
  waitSeconds,
  agent,
  hours,
  onConnect,
  onDismiss,
  onCancel,
  onLeaveContact,
  onEnd,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  state: HandoffState
  /** Why a person is offered, shown under the title. */
  reason?: string
  /** What the person sees first. The user can edit it before connecting. */
  summary?: string
  /** Facts carried across with the summary: an order number, what was tried. */
  details?: readonly HandoffDetail[]
  /** 1 means next in line. */
  queuePosition?: number
  /** The service's wait estimate. The card counts it down. */
  waitSeconds?: number
  /** Who joined, once connected. */
  agent?: HandoffAgent
  /** When support is back, while unavailable. */
  hours?: string
  /** Fires with the summary as the user left it. */
  onConnect?: (summary: string) => void
  onDismiss?: () => void
  onCancel?: () => void
  onLeaveContact?: (contact: string) => void
  onEnd?: () => void
}) {
  const titleId = React.useId()
  const summaryId = React.useId()
  const editorRef = React.useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = React.useState(summary)
  const [previousSummary, setPreviousSummary] = React.useState(summary)
  if (summary !== previousSummary) {
    setPreviousSummary(summary)
    setDraft(summary)
  }
  const [editing, setEditing] = React.useState(false)
  const [contact, setContact] = React.useState("")
  const [leftContact, setLeftContact] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (editing) editorRef.current?.focus()
  }, [editing])

  const left = useCountdown(waitSeconds, state === "connecting")
  const ahead = Math.max(0, queuePosition - 1)
  const name = agent?.name ?? "Support"

  // Announces the position and whole minutes, not every tick of the clock.
  const announcement =
    state === "connecting"
      ? `${queueLabel(queuePosition)}${waitSeconds !== undefined ? `, ${minutesText(left)}` : ""}`
      : state === "connected"
        ? `${agent?.name ?? "Someone from support"} joined the chat`
        : state === "unavailable"
          ? "No one is available right now"
          : state === "ended"
            ? "Back to the assistant"
            : ""

  const person = state === "connected" || state === "ended"
  const title =
    state === "connecting"
      ? "Connecting you to support"
      : state === "connected"
        ? `${name} joined`
        : state === "ended"
          ? `${name} left the chat`
          : state === "unavailable"
            ? "No one's available right now"
            : "Talk to a person"
  const subtitle =
    state === "connecting"
      ? queueLabel(queuePosition)
      : state === "connected"
        ? (agent?.role ?? "Support")
        : state === "ended"
          ? "Back to the assistant"
          : state === "unavailable"
            ? (hours ?? "Leave a way to reach you")
            : (reason ?? "A teammate can take it from here")

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      data-slot="human-handoff"
      data-state={state}
      className={cn(
        "flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border/60 bg-background p-3",
        className
      )}
      {...props}
    >
      <span role="status" className="sr-only">
        {announcement}
      </span>

      <div data-slot="human-handoff-header" className="flex items-center gap-3">
        {person ? (
          <Avatar className={cn(state === "ended" && "opacity-60")}>
            {agent?.image ? <AvatarImage src={agent.image} alt="" /> : null}
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        ) : (
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          >
            <HugeiconsIcon
              icon={state === "unavailable" ? Moon02Icon : CustomerSupportIcon}
              className="size-4"
            />
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <p id={titleId} className="truncate text-sm font-medium">
            {title}
          </p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {state === "connecting" && waitSeconds !== undefined ? (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            ~{clock(left)}
          </span>
        ) : null}
        {state === "connected" ? (
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-live" />
            Live
          </span>
        ) : null}
      </div>

      {state === "offered" ? (
        <>
          <div className="flex flex-col gap-1.5">
            <div className="flex min-h-6 items-center justify-between">
              <span id={summaryId} className="text-xs text-muted-foreground">
                What they&apos;ll see
              </span>
              {onConnect && !editing ? (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setEditing(true)}
                  className="text-muted-foreground focus-visible:border-ring"
                >
                  <HugeiconsIcon aria-hidden icon={PencilEdit02Icon} />
                  Edit
                </Button>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-muted p-2.5">
              {editing ? (
                <Textarea
                  ref={editorRef}
                  rows={3}
                  value={draft}
                  aria-labelledby={summaryId}
                  onChange={(event) => setDraft(event.target.value)}
                  onBlur={() => setEditing(false)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setDraft(summary)
                      setEditing(false)
                    }
                  }}
                  className="-m-1 min-h-0 w-auto resize-none bg-background px-1.5 py-1 text-xs leading-relaxed dark:bg-input/30"
                />
              ) : (
                <p
                  aria-labelledby={summaryId}
                  className="text-xs leading-relaxed"
                >
                  {draft}
                </p>
              )}
              {details.length > 0 ? (
                <dl className="flex flex-col gap-0.5">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 text-xs"
                    >
                      <dt className="text-muted-foreground">{detail.label}</dt>
                      <dd className="truncate">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>
          {onDismiss || onConnect ? (
            <div className="flex min-h-7 items-center justify-end gap-1.5">
              {onDismiss ? (
                <Button variant="ghost" onClick={onDismiss}>
                  Keep chatting
                </Button>
              ) : null}
              {onConnect ? (
                <Button
                  data-slot="human-handoff-connect"
                  disabled={!draft.trim()}
                  onClick={() => onConnect(draft.trim())}
                >
                  Connect
                </Button>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}

      {state === "connecting" ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <QueueDots ahead={ahead} />
            {waitSeconds !== undefined ? (
              <span className="text-xs text-muted-foreground">
                {minutesText(left)}
              </span>
            ) : null}
          </div>
          {draft ? (
            <div className="rounded-lg bg-muted px-2.5 py-2">
              <p className="text-xs text-muted-foreground">Sent with you</p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed">
                {draft}
              </p>
            </div>
          ) : null}
          {onCancel ? (
            <div className="flex min-h-7 items-center justify-end">
              <Button variant="ghost" onClick={onCancel}>
                Leave queue
              </Button>
            </div>
          ) : null}
        </>
      ) : null}

      {state === "connected" ? (
        <div className="flex items-end justify-between gap-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            The assistant steps back while {agent?.name ?? "they"} is here.
            Everything you shared came along.
          </p>
          {onEnd ? (
            <Button variant="ghost" onClick={onEnd} className="shrink-0">
              End chat
            </Button>
          ) : null}
        </div>
      ) : null}

      {state === "unavailable" ? (
        leftContact ? (
          <p
            role="status"
            className="flex min-h-8 animate-in items-center gap-2 text-xs text-muted-foreground duration-280 fade-in motion-reduce:animate-none"
          >
            <HugeiconsIcon
              aria-hidden
              icon={Tick02Icon}
              className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <span className="min-w-0 truncate">
              We&apos;ll reach you at {leftContact} when someone&apos;s back.
            </span>
          </p>
        ) : onLeaveContact ? (
          <form
            className="flex items-center gap-1.5"
            onSubmit={(event) => {
              event.preventDefault()
              const value = contact.trim()
              if (!value) return
              setLeftContact(value)
              onLeaveContact(value)
            }}
          >
            <Input
              type="email"
              required
              value={contact}
              placeholder="you@company.com"
              aria-label="Email to reach you at"
              onChange={(event) => setContact(event.target.value)}
              className="h-7 min-w-0 flex-1 text-xs"
            />
            <Button type="submit" className="shrink-0">
              Notify me
            </Button>
          </form>
        ) : null
      ) : null}

      {state === "ended" ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <HugeiconsIcon
            aria-hidden
            icon={UserCheck01Icon}
            className="size-3.5 shrink-0"
          />
          The assistant picks up with what was resolved.
        </p>
      ) : null}
    </div>
  )
}

export { HumanHandoff, queueLabel }
export type { HandoffAgent, HandoffDetail, HandoffState }
