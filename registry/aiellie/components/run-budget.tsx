"use client"

import * as React from "react"
import { DashboardSpeed01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"

type RunBudgetState = "setting" | "running" | "stopped" | "done"

type RunBudgetFact = {
  label: string
  value: string
}

const formatters = new Map<string, Intl.NumberFormat>()

/** Spend always shows cents; a whole cap doesn't: "$5", "$4.18". */
function formatMoney(
  amount: number,
  currency = "USD",
  { cap = false }: { cap?: boolean } = {}
) {
  const digits = cap && Number.isInteger(amount) ? 0 : 2
  const key = `${currency}:${digits}`
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: 2,
    })
    formatters.set(key, formatter)
  }
  return formatter.format(amount)
}

function clock(seconds: number) {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function RunBudget({
  state,
  limit,
  spent = 0,
  options = [1, 5, 20],
  onLimitChange,
  onStart,
  turns,
  elapsedSeconds,
  warnAt = 0.8,
  raiseTo,
  onRaise,
  onKeep,
  kept = [],
  currency = "USD",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  state: RunBudgetState
  /** The cap, in `currency`. */
  limit: number
  /** Spend so far. It can pass `limit`: the step that crosses the cap still finishes. */
  spent?: number
  /** The caps offered while setting. */
  options?: readonly number[]
  onLimitChange?: (limit: number) => void
  /** Adds Start run while setting. */
  onStart?: () => void
  turns?: number
  elapsedSeconds?: number
  /** The share of the cap at which the meter warns. */
  warnAt?: number
  /** The cap offered once the run stops. Defaults to double. */
  raiseTo?: number
  onRaise?: (limit: number) => void
  onKeep?: () => void
  /** What the run finished before it stopped. */
  kept?: readonly RunBudgetFact[]
  currency?: string
}) {
  const titleId = React.useId()
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const money = (amount: number) => formatMoney(amount, currency)
  const capLabel = (amount: number) =>
    formatMoney(amount, currency, { cap: true })

  const share = limit > 0 ? spent / limit : 0
  const warning = state === "running" && share >= warnAt
  const over = Math.max(0, spent - limit)
  const nextLimit = raiseTo ?? limit * 2

  // Announces each change of state, and the warning once, not every tick of spend.
  const [announcement, setAnnouncement] = React.useState("")
  const [seen, setSeen] = React.useState({ state, warning })
  if (seen.state !== state || seen.warning !== warning) {
    setSeen({ state, warning })
    if (state === "stopped") {
      setAnnouncement(
        `Stopped at the ${capLabel(limit)} budget, ${money(spent)} spent`
      )
    } else if (state === "done") {
      setAnnouncement(`Finished at ${money(spent)} of ${capLabel(limit)}`)
    } else if (warning && !seen.warning) {
      setAnnouncement(
        `${Math.round(warnAt * 100)} percent of the ${capLabel(limit)} budget used`
      )
    }
  }

  const stats = [
    turns !== undefined ? `${turns} ${turns === 1 ? "turn" : "turns"}` : null,
    elapsedSeconds !== undefined ? clock(elapsedSeconds) : null,
  ]
    .filter(Boolean)
    .join(" · ")

  const subtitle =
    state === "setting"
      ? "Pick a cap for this run"
      : state === "running"
        ? stats || "Running"
        : state === "stopped"
          ? "Stopped at the cap"
          : "Finished under budget"

  const selectedIndex = Math.max(0, options.indexOf(limit))
  const onOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0
    if (!step) return
    event.preventDefault()
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const horizontal = event.key === "ArrowRight" || event.key === "ArrowLeft"
    const delta = rtl && horizontal ? -step : step
    const next = (selectedIndex + delta + options.length) % options.length
    onLimitChange?.(options[next])
    optionRefs.current[next]?.focus()
  }

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      data-slot="run-budget"
      data-state={state}
      data-warning={warning || undefined}
      className={cn(
        "flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-border/60 bg-background p-3",
        className
      )}
      {...props}
    >
      <span role="status" className="sr-only">
        {announcement}
      </span>

      <div data-slot="run-budget-header" className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
        >
          <HugeiconsIcon icon={DashboardSpeed01Icon} className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p id={titleId} className="truncate text-sm font-medium">
            Run budget
          </p>
          <p className="truncate text-xs text-muted-foreground tabular-nums">
            {subtitle}
          </p>
        </div>
        {state !== "setting" ? (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            <span className="text-foreground">{money(spent)}</span> /{" "}
            {capLabel(limit)}
          </span>
        ) : null}
      </div>

      {state === "setting" ? (
        <>
          <div
            role="radiogroup"
            aria-label="Spend cap for this run"
            className="flex rounded-lg bg-muted p-0.5"
          >
            {options.map((option, index) => {
              const selected = index === selectedIndex
              return (
                <button
                  key={option}
                  ref={(node) => {
                    optionRefs.current[index] = node
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onLimitChange?.(option)}
                  onKeyDown={onOptionKeyDown}
                  className="h-7 flex-1 cursor-pointer rounded-md border border-transparent text-xs font-medium text-muted-foreground tabular-nums transition-[background-color,color,box-shadow] duration-150 outline-none hover:text-foreground focus-visible:border-ring aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-sm motion-reduce:transition-none dark:aria-checked:bg-input/30"
                >
                  {capLabel(option)}
                </button>
              )
            })}
          </div>
          <div className="flex min-h-7 items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              Stops at the cap. Finished work is kept.
            </span>
            {onStart ? (
              <Button data-slot="run-budget-start" onClick={onStart}>
                Start run
              </Button>
            ) : null}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div
            role="meter"
            aria-label="Budget used"
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-valuenow={Math.min(spent, limit)}
            aria-valuetext={`${money(spent)} of ${capLabel(limit)}`}
            data-slot="run-budget-meter"
            className="relative h-1 overflow-hidden rounded-full bg-muted"
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-0 start-0 rounded-full transition-[width,background-color] duration-280 ease-out motion-reduce:transition-none",
                state === "running"
                  ? warning
                    ? "bg-destructive"
                    : "bg-live"
                  : "bg-foreground/70"
              )}
              style={{ width: `${Math.min(100, Math.max(1, share * 100))}%` }}
            />
            {state === "running" ? (
              <span
                aria-hidden
                className="absolute inset-y-0 w-0.5 bg-background"
                style={{ insetInlineStart: `${warnAt * 100}%` }}
              />
            ) : null}
          </div>
          <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground tabular-nums">
            <span>
              {state === "stopped" && over > 0
                ? `${money(over)} past the cap`
                : state === "done"
                  ? `${money(Math.max(0, limit - spent))} unused`
                  : `${money(Math.max(0, limit - spent))} left`}
            </span>
            <span className={cn(warning && "text-destructive")}>
              {state === "running"
                ? warning
                  ? "May finish over budget"
                  : `${Math.round(share * 100)}%`
                : stats}
            </span>
          </div>
        </div>
      )}

      {state === "stopped" ? (
        <div
          key={state}
          className="flex animate-in flex-col gap-3 duration-280 fade-in motion-reduce:animate-none"
        >
          {kept.length > 0 ? (
            <div className="flex flex-col gap-1 rounded-lg bg-muted px-3 py-2">
              <p className="text-xs text-muted-foreground">Kept</p>
              <dl className="flex flex-col gap-0.5">
                {kept.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-3 text-xs"
                  >
                    <dt className="text-muted-foreground">{fact.label}</dt>
                    <dd className="tabular-nums">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          {onKeep || onRaise ? (
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {onKeep ? (
                <Button variant="ghost" onClick={onKeep}>
                  Keep what&apos;s done
                </Button>
              ) : null}
              {onRaise ? (
                <Button
                  data-slot="run-budget-raise"
                  aria-label={`Raise the cap to ${capLabel(nextLimit)} and continue`}
                  onClick={() => onRaise(nextLimit)}
                >
                  Raise to {capLabel(nextLimit)}
                </Button>
              ) : null}
            </div>
          ) : (
            <p className="flex min-h-7 items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon
                aria-hidden
                icon={Tick02Icon}
                className="size-3.5"
              />
              Ended at the cap. Finished work is kept.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}

export { RunBudget, formatMoney }
export type { RunBudgetFact, RunBudgetState }
