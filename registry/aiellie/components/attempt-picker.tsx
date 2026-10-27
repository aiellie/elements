"use client"

import * as React from "react"
import {
  Cancel01Icon,
  Layers01Icon,
  Loading03Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"

type AttemptState = "running" | "done" | "failed"

type Attempt = {
  id: string
  /** Usually the model or the approach: "Opus 5", "Smaller patch". */
  label: string
  state: AttemptState
  /** From 0 to 1 while running. */
  progress?: number
  /** What this attempt did, in a sentence. */
  summary?: string
  additions?: number
  deletions?: number
  files?: number
  tests?: { passed: number; total: number }
  /** Already formatted, like "$0.42". */
  cost?: string
  seconds?: number
}

function clock(seconds: number) {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

/**
 * The attempt to suggest: most tests passing, then the smallest change. None
 * while any attempt still runs, so an early finisher isn't suggested over
 * ones that haven't reported.
 */
function suggestAttempt(attempts: readonly Attempt[]) {
  if (attempts.some((attempt) => attempt.state === "running")) return undefined
  const done = attempts.filter((attempt) => attempt.state === "done")
  if (done.length === 0) return undefined
  const passRate = (attempt: Attempt) =>
    attempt.tests && attempt.tests.total > 0
      ? attempt.tests.passed / attempt.tests.total
      : 0
  const size = (attempt: Attempt) =>
    (attempt.additions ?? 0) + (attempt.deletions ?? 0)
  return [...done].sort(
    (a, b) => passRate(b) - passRate(a) || size(a) - size(b)
  )[0].id
}

function AttemptPicker({
  task,
  attempts,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  suggested,
  applied,
  onApply,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The task every attempt was given. */
  task: string
  attempts: readonly Attempt[]
  selected?: string
  defaultSelected?: string
  onSelectedChange?: (id: string) => void
  /** The attempt marked as suggested. Defaults to `suggestAttempt(attempts)`; `null` for none. */
  suggested?: string | null
  /** Set once an attempt is applied. The others show as discarded. */
  applied?: string
  /** Adds Apply. Fires with the chosen attempt. */
  onApply?: (id: string) => void
}) {
  const titleId = React.useId()
  const groupRef = React.useRef<HTMLDivElement>(null)
  const suggestedId =
    suggested === null ? undefined : (suggested ?? suggestAttempt(attempts))

  const [uncontrolled, setUncontrolled] = React.useState(
    defaultSelected ?? attempts[0]?.id
  )
  const selectedId = applied ?? selectedProp ?? uncontrolled
  const select = (id: string) => {
    if (applied) return
    if (selectedProp === undefined) setUncontrolled(id)
    onSelectedChange?.(id)
  }

  const finished = attempts.filter(
    (attempt) => attempt.state !== "running"
  ).length
  const chosen = attempts.find((attempt) => attempt.id === selectedId)
  const canApply = chosen?.state === "done" && !applied
  const others = attempts.length - 1

  // Arrows move the selection, as in any radio group.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const forward = ["ArrowDown", "ArrowRight"]
    const back = ["ArrowUp", "ArrowLeft"]
    if (![...forward, ...back].includes(event.key) || applied) return
    event.preventDefault()
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    let step = forward.includes(event.key) ? 1 : -1
    if (rtl && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      step = -step
    }
    const index = attempts.findIndex((attempt) => attempt.id === selectedId)
    const next = attempts[(index + step + attempts.length) % attempts.length]
    if (!next) return
    select(next.id)
    groupRef.current
      ?.querySelector<HTMLElement>(`[data-attempt="${CSS.escape(next.id)}"]`)
      ?.focus()
  }

  const announcement = applied
    ? `Applied ${chosen?.label}. ${others} other ${others === 1 ? "attempt" : "attempts"} discarded.`
    : ""

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      data-slot="attempt-picker"
      data-state={
        applied ? "applied" : finished < attempts.length ? "running" : "ready"
      }
      className={cn(
        "flex w-full max-w-sm flex-col gap-2.5 rounded-2xl border border-border/60 bg-background p-3",
        className
      )}
      {...props}
    >
      <span role="status" className="sr-only">
        {announcement}
      </span>

      <div
        data-slot="attempt-picker-header"
        className="flex h-6 items-center gap-2 px-1"
      >
        <HugeiconsIcon
          aria-hidden
          icon={Layers01Icon}
          className="size-4 shrink-0 text-muted-foreground"
        />
        <p id={titleId} className="min-w-0 flex-1 truncate text-sm font-medium">
          {task}
        </p>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {applied
            ? "Applied"
            : finished < attempts.length
              ? `${finished} of ${attempts.length} done`
              : `${attempts.length} attempts`}
        </span>
      </div>

      <div
        ref={groupRef}
        role="radiogroup"
        aria-label="Attempts"
        aria-readonly={applied ? true : undefined}
        onKeyDown={onKeyDown}
        className="@container flex flex-col gap-1"
      >
        {attempts.map((attempt) => (
          <AttemptRow
            key={attempt.id}
            attempt={attempt}
            selected={attempt.id === selectedId}
            discarded={Boolean(applied) && attempt.id !== applied}
            suggested={attempt.id === suggestedId && !applied}
            onSelect={() => select(attempt.id)}
          />
        ))}
      </div>

      {applied ? (
        <p className="flex min-h-7 animate-in items-center gap-2 text-xs text-muted-foreground duration-280 fade-in motion-reduce:animate-none">
          <HugeiconsIcon
            aria-hidden
            icon={Tick02Icon}
            className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
          />
          <span className="truncate">
            Applied {chosen?.label}. The other{" "}
            {others === 1 ? "one was" : `${others} were`} discarded.
          </span>
        </p>
      ) : onApply ? (
        <div className="flex min-h-7 items-center justify-between gap-3">
          <span className="truncate text-xs text-muted-foreground">
            {chosen?.state === "running"
              ? "Still running"
              : chosen?.state === "failed"
                ? "This one failed"
                : `Drops the other ${others}`}
          </span>
          <Button
            data-slot="attempt-picker-apply"
            disabled={!canApply}
            onClick={() => chosen && onApply(chosen.id)}
            className="shrink-0"
          >
            Apply {chosen?.label}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function AttemptRow({
  attempt,
  selected,
  discarded,
  suggested,
  onSelect,
}: {
  attempt: Attempt
  selected: boolean
  discarded: boolean
  suggested: boolean
  onSelect: () => void
}) {
  const details = [
    attempt.files !== undefined
      ? `${attempt.files} ${attempt.files === 1 ? "file" : "files"}`
      : null,
    attempt.cost ?? null,
    attempt.seconds !== undefined ? clock(attempt.seconds) : null,
  ].filter(Boolean)
  const testsPassing =
    attempt.tests !== undefined && attempt.tests.passed === attempt.tests.total
  const percent = Math.round((attempt.progress ?? 0) * 100)

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-disabled={discarded || undefined}
      tabIndex={selected ? 0 : -1}
      data-slot="attempt-picker-attempt"
      data-attempt={attempt.id}
      data-state={discarded ? "discarded" : attempt.state}
      data-selected={selected || undefined}
      onClick={onSelect}
      className="flex cursor-pointer flex-col rounded-lg border border-transparent px-2.5 py-2 transition-[background-color,border-color,opacity] duration-150 outline-none hover:bg-muted/60 focus-visible:border-ring data-[state=discarded]:cursor-default data-[state=discarded]:opacity-50 motion-reduce:transition-none data-selected:bg-muted"
    >
      <div className="flex h-5 items-center gap-2">
        <span
          aria-hidden
          className="flex size-3.5 shrink-0 items-center justify-center"
        >
          {attempt.state === "running" ? (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-3.5 animate-spin text-muted-foreground motion-reduce:animate-none"
            />
          ) : attempt.state === "failed" ? (
            <HugeiconsIcon
              icon={Cancel01Icon}
              className="size-3.5 text-destructive"
            />
          ) : (
            <span
              className={cn(
                "size-2 rounded-full border transition-colors duration-150 motion-reduce:transition-none",
                selected
                  ? "border-foreground bg-foreground"
                  : "border-foreground/30"
              )}
            />
          )}
        </span>
        <span
          className={cn(
            "min-w-0 truncate text-sm",
            discarded && "line-through decoration-muted-foreground/50"
          )}
        >
          {attempt.label}
          {suggested ? <span className="sr-only">, suggested</span> : null}
        </span>
        {suggested ? (
          <span
            aria-hidden
            className="hidden shrink-0 rounded-sm bg-live/8 px-1.5 text-[11px] leading-4 text-live @[18rem]:inline dark:bg-live/15"
          >
            Suggested
          </span>
        ) : null}
        <span className="flex-1" />
        {attempt.state === "done" ? (
          <span className="shrink-0 text-xs tabular-nums">
            {attempt.additions !== undefined ? (
              <>
                <span className="text-emerald-600 dark:text-emerald-400">
                  +{attempt.additions}
                </span>{" "}
                <span className="text-destructive">
                  −{attempt.deletions ?? 0}
                </span>
              </>
            ) : null}
            {attempt.additions !== undefined && attempt.tests ? (
              <span className="text-muted-foreground/50"> · </span>
            ) : null}
            {attempt.tests ? (
              <span
                className={
                  testsPassing ? "text-muted-foreground" : "text-destructive"
                }
              >
                {attempt.tests.passed}/{attempt.tests.total}
                <span className="sr-only"> tests passing</span>
              </span>
            ) : null}
          </span>
        ) : attempt.state === "failed" ? (
          <span className="shrink-0 text-xs text-destructive">Failed</span>
        ) : (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {percent}%
          </span>
        )}
      </div>

      {attempt.state === "running" ? (
        <div
          role="progressbar"
          aria-label={`${attempt.label} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="ms-5.5 mt-1.5 mb-0.5 h-1 overflow-hidden rounded-full bg-foreground/8"
        >
          <span
            className="block h-full rounded-full bg-live transition-[width] duration-280 ease-out motion-reduce:transition-none"
            style={{ width: `${Math.max(4, percent)}%` }}
          />
        </div>
      ) : (
        // The selected attempt opens to its summary; the rest stay one line.
        <div
          data-open={(selected && !discarded) || undefined}
          className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-280 ease-out motion-reduce:transition-none data-open:grid-rows-[1fr] data-open:opacity-100"
        >
          <div className="ms-5.5 min-h-0 overflow-hidden">
            {attempt.summary ? (
              <p className="line-clamp-2 pt-1 text-xs leading-relaxed text-muted-foreground">
                {attempt.summary}
              </p>
            ) : null}
            {details.length > 0 ? (
              <p className="truncate pt-0.5 text-[11px] text-muted-foreground/70 tabular-nums">
                {details.join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export { AttemptPicker, suggestAttempt }
export type { Attempt, AttemptState }
