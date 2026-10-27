"use client"

import * as React from "react"
import {
  Alert02Icon,
  ArrowDown01Icon,
  Cancel01Icon,
  RotateLeft01Icon,
  Undo02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"

type CompactionState = "compacting" | "compacted" | "failed"

type CompactionItemKind = "decision" | "task" | "file"

type CompactionItem = {
  id: string
  kind: CompactionItemKind
  label: string
  /** A finished task. It stays listed, struck, so it can't come back as new work. */
  done?: boolean
}

const GROUPS: { kind: CompactionItemKind; label: string }[] = [
  { kind: "decision", label: "Decisions" },
  { kind: "task", label: "Tasks" },
  { kind: "file", label: "Files" },
]

/** 48213 → "48.2k", 6100 → "6.1k", 940 → "940". */
function formatTokens(count: number) {
  if (!Number.isFinite(count) || count <= 0) return "0"
  const trim = (value: number) => value.toFixed(1).replace(/\.0$/, "")
  if (count < 1000) return String(Math.round(count))
  if (count < 1_000_000) {
    const k = count / 1000
    return `${k < 100 ? trim(k) : Math.round(k)}k`
  }
  return `${trim(count / 1_000_000)}M`
}

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Counts from `from` down to `to` once `run` turns on.
function useSettlingNumber(to: number, from: number, run: boolean) {
  const [value, setValue] = React.useState(from)

  React.useEffect(() => {
    if (!run) return
    const duration = reducedMotion() ? 0 : 700
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1
      setValue(from + (to - from) * (1 - (1 - t) ** 3))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [to, from, run])

  return run ? value : to
}

// A hairline with a live segment travelling toward the label while it compacts.
function Rule({
  sweeping,
  toward,
  progress,
}: {
  sweeping: boolean
  toward: "end" | "start"
  progress?: number
}) {
  const segment = React.useRef<HTMLSpanElement>(null)
  const determinate = progress !== undefined

  React.useEffect(() => {
    const element = segment.current
    if (!element || !sweeping || determinate || reducedMotion()) return
    const frames =
      toward === "end"
        ? [{ translate: "-100% 0" }, { translate: "300% 0" }]
        : [{ translate: "300% 0" }, { translate: "-100% 0" }]
    const animation = element.animate(frames, {
      duration: 1400,
      iterations: Infinity,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
    })
    return () => animation.cancel()
  }, [sweeping, toward, determinate])

  return (
    <span
      aria-hidden
      className={cn(
        "relative flex h-px min-w-6 flex-1 overflow-hidden bg-border",
        toward === "start" && "justify-end"
      )}
    >
      {sweeping ? (
        determinate ? (
          <span
            className="h-full bg-live transition-[width] duration-280 motion-reduce:transition-none"
            style={{
              width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%`,
            }}
          />
        ) : (
          <span
            ref={segment}
            className="absolute inset-y-0 start-0 w-1/3 bg-live motion-reduce:w-full motion-reduce:opacity-40"
          />
        )
      ) : null}
    </span>
  )
}

function CompactionMarker({
  state,
  tokensBefore,
  tokensAfter,
  items = [],
  progress,
  dropped,
  defaultDropped,
  onDroppedChange,
  open,
  defaultOpen = false,
  onOpenChange,
  onRetry,
  readOnly = false,
  className,
  ...props
}: Omit<
  React.ComponentProps<"div">,
  "children" | "onChange" | "defaultValue" | "value"
> & {
  state: CompactionState
  /** Tokens in the context before compacting. */
  tokensBefore: number
  /** Tokens left after. Needed once `state` is `compacted`. */
  tokensAfter?: number
  /** What the summary carries into the next turn. */
  items?: readonly CompactionItem[]
  /** From 0 to 1 while compacting. Leave it out for a sweep. */
  progress?: number
  /** The ids of items left out of the next turn, to control them. */
  dropped?: readonly string[]
  defaultDropped?: readonly string[]
  onDroppedChange?: (dropped: string[]) => void
  /** Whether the list of what was kept is open, to control it. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Adds Retry when compacting failed. */
  onRetry?: () => void
  /** Hides the buttons that drop and keep items. */
  readOnly?: boolean
}) {
  const panelId = React.useId()
  const [openState, setOpenState] = React.useState(defaultOpen)
  const isOpen = open ?? openState
  const setOpen = (next: boolean) => {
    if (open === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  const [droppedState, setDroppedState] = React.useState<readonly string[]>(
    defaultDropped ?? []
  )
  const droppedIds = dropped ?? droppedState
  const toggleDropped = (id: string) => {
    const next = droppedIds.includes(id)
      ? droppedIds.filter((entry) => entry !== id)
      : [...droppedIds, id]
    if (dropped === undefined) setDroppedState(next)
    onDroppedChange?.(next)
  }

  // Counts down only when it watched the compaction finish, not when a thread
  // loads with it already done.
  const [watchedFinish, setWatchedFinish] = React.useState(false)
  const [previousState, setPreviousState] = React.useState(state)
  if (previousState !== state) {
    setPreviousState(state)
    if (previousState === "compacting" && state === "compacted") {
      setWatchedFinish(true)
    }
  }

  const after = tokensAfter ?? tokensBefore
  const shown = useSettlingNumber(after, tokensBefore, watchedFinish)
  const keptShare = tokensBefore > 0 ? Math.min(1, after / tokensBefore) : 1
  const freed = Math.round((1 - keptShare) * 100)
  const droppedCount = items.filter((item) =>
    droppedIds.includes(item.id)
  ).length

  const announcement =
    state === "compacting"
      ? "Compacting context"
      : state === "failed"
        ? "Couldn't compact. Full history kept."
        : `Context compacted from ${formatTokens(tokensBefore)} to ${formatTokens(after)} tokens`

  return (
    <div
      role="group"
      aria-label="Context compaction"
      data-slot="compaction-marker"
      data-state={state}
      className={cn("flex w-full max-w-sm flex-col", className)}
      {...props}
    >
      <span role="status" className="sr-only">
        {announcement}
      </span>

      <div className="flex items-center gap-2.5 py-1">
        <Rule
          sweeping={state === "compacting"}
          toward="end"
          progress={progress}
        />

        {state === "compacting" ? (
          <span className="flex shrink-0 items-baseline gap-2 text-xs text-muted-foreground">
            <span className="shimmer motion-reduce:shimmer-none">
              Compacting context
            </span>
            <span className="tabular-nums">{formatTokens(tokensBefore)}</span>
          </span>
        ) : state === "failed" ? (
          <span className="flex shrink-0 items-center gap-2 text-xs">
            <HugeiconsIcon
              aria-hidden
              icon={Alert02Icon}
              className="size-3.5 text-destructive"
            />
            Couldn&apos;t compact
            <span className="text-muted-foreground">full history kept</span>
            {onRetry ? (
              <Button
                variant="ghost"
                size="xs"
                data-slot="compaction-marker-retry"
                onClick={onRetry}
                className="text-muted-foreground focus-visible:border-ring"
              >
                <HugeiconsIcon aria-hidden icon={RotateLeft01Icon} />
                Retry
              </Button>
            ) : null}
          </span>
        ) : (
          <button
            type="button"
            data-slot="compaction-marker-trigger"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setOpen(!isOpen)}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-transparent px-2 py-0.5 text-xs transition-colors duration-80 outline-none hover:bg-muted focus-visible:border-ring motion-reduce:transition-none"
          >
            Context compacted
            <span className="text-muted-foreground tabular-nums">
              {formatTokens(tokensBefore)}
              <span aria-hidden className="px-1 text-muted-foreground/60">
                →
              </span>
              <span className="sr-only"> to </span>
              {formatTokens(shown)}
            </span>
            <HugeiconsIcon
              aria-hidden
              icon={ArrowDown01Icon}
              className={cn(
                "size-3 text-muted-foreground transition-[rotate] duration-150 motion-reduce:transition-none",
                isOpen && "rotate-180"
              )}
            />
          </button>
        )}

        <Rule
          sweeping={state === "compacting"}
          toward="start"
          progress={progress}
        />
      </div>

      {state === "compacted" ? (
        <div
          id={panelId}
          data-slot="compaction-marker-panel"
          data-open={isOpen || undefined}
          inert={!isOpen}
          className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-280 ease-out motion-reduce:transition-none data-open:grid-rows-[1fr] data-open:opacity-100"
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-2 flex flex-col gap-2.5 rounded-xl bg-muted p-2.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between text-muted-foreground tabular-nums">
                  <span>
                    Kept {formatTokens(after)} of {formatTokens(tokensBefore)}
                  </span>
                  <span>{freed}% freed</span>
                </div>
                <span
                  aria-hidden
                  className="flex h-1 overflow-hidden rounded-full bg-foreground/10"
                >
                  <span
                    className="h-full rounded-full bg-foreground/70 transition-[width] delay-150 duration-700 ease-out motion-reduce:transition-none"
                    style={{
                      width: `${isOpen ? Math.max(2, keptShare * 100) : 100}%`,
                    }}
                  />
                </span>
              </div>

              {GROUPS.map((group) => {
                const grouped = items.filter((item) => item.kind === group.kind)
                if (grouped.length === 0) return null
                return (
                  <div key={group.kind} className="flex flex-col gap-0.5">
                    <p className="text-muted-foreground">{group.label}</p>
                    <ul className="flex flex-col">
                      {grouped.map((item) => {
                        const isDropped = droppedIds.includes(item.id)
                        return (
                          <li
                            key={item.id}
                            data-dropped={isDropped || undefined}
                            data-done={item.done || undefined}
                            className="group/item flex min-h-6 items-center gap-2"
                          >
                            <span
                              title={item.label}
                              className={cn(
                                "min-w-0 flex-1 truncate transition-colors duration-150 motion-reduce:transition-none",
                                (isDropped || item.done) &&
                                  "text-muted-foreground line-through decoration-muted-foreground/50"
                              )}
                            >
                              {item.label}
                            </span>
                            {item.done ? (
                              <span className="text-muted-foreground">
                                done
                              </span>
                            ) : null}
                            {isDropped ? (
                              <span className="text-muted-foreground">
                                dropped
                              </span>
                            ) : null}
                            {readOnly ? null : (
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                aria-pressed={isDropped}
                                aria-label={
                                  isDropped
                                    ? `Keep “${item.label}”`
                                    : `Drop “${item.label}”`
                                }
                                onClick={() => toggleDropped(item.id)}
                                className={cn(
                                  "size-5 text-muted-foreground opacity-0 group-hover/item:opacity-100 focus-visible:border-ring focus-visible:opacity-100 pointer-coarse:opacity-100",
                                  isDropped && "opacity-100"
                                )}
                              >
                                <HugeiconsIcon
                                  aria-hidden
                                  icon={isDropped ? Undo02Icon : Cancel01Icon}
                                />
                              </Button>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}

              <p className="text-muted-foreground" aria-live="polite">
                {droppedCount > 0
                  ? `${droppedCount} ${droppedCount === 1 ? "item" : "items"} left out of the next turn`
                  : "All of it carries into the next turn"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { CompactionMarker, formatTokens }
export type { CompactionItem, CompactionItemKind, CompactionState }
