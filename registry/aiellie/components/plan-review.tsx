"use client"

import * as React from "react"
import {
  ArrowTurnBackwardIcon,
  Cancel01Icon,
  CheckListIcon,
  DragDropVerticalIcon,
  PlusSignIcon,
  Tick02Icon,
  Undo02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"
import { Input } from "@/registry/aiellie/ui/input"
import { Textarea } from "@/registry/aiellie/ui/textarea"

type PlanStep = { id: string; label: string }

/** A step as it's being edited. Removed steps stay listed until the decision. */
type PlanDraftStep = PlanStep & {
  added?: boolean
  removed?: boolean
  /** Set on the step that was dragged, so it reads as moved rather than its neighbours. */
  moved?: boolean
}

type PlanEdits = {
  moved: string[]
  rewritten: string[]
  added: string[]
  removed: string[]
}

/** What the agent gets back: the steps to run, in order, and what changed. */
type PlanDecision = {
  steps: PlanStep[]
  removed: PlanStep[]
  edits: PlanEdits
}

type PlanReviewState = "review" | "approved" | "revising"

const draftFromSteps = (steps: readonly PlanStep[]): PlanDraftStep[] =>
  steps.map(({ id, label }) => ({ id, label }))

// Indices of the longest increasing run. Between runs as long, it keeps the
// one with fewer touched entries, then smaller values, so the step that was
// dragged reads as moved rather than everything it jumped over.
function longestIncreasing(
  values: readonly number[],
  touched: readonly boolean[] = []
) {
  type Run = { length: number; untouched: number; last: number }
  const better = (a: Run, b: Run) =>
    a.length !== b.length
      ? a.length > b.length
      : a.untouched !== b.untouched
        ? a.untouched > b.untouched
        : a.last < b.last
  const runs: Run[] = values.map((value, i) => ({
    length: 1,
    untouched: touched[i] ? 0 : 1,
    last: value,
  }))
  const previous = values.map(() => -1)
  let best = -1
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < i; j++) {
      if (values[j] >= values[i]) continue
      const candidate = {
        length: runs[j].length + 1,
        untouched: runs[j].untouched + (touched[i] ? 0 : 1),
        last: values[i],
      }
      const prior = previous[i]
      const tie =
        candidate.length === runs[i].length &&
        candidate.untouched === runs[i].untouched
      if (
        prior === -1 ||
        better(candidate, runs[i]) ||
        (tie && values[j] < values[prior])
      ) {
        runs[i] = candidate
        previous[i] = j
      }
    }
    if (best === -1 || better(runs[i], runs[best])) best = i
  }
  const kept = new Set<number>()
  for (let i = best; i !== -1; i = previous[i]) kept.add(i)
  return kept
}

/** Compares a draft with the proposal. A step counts as moved only if it left the longest run still in order. */
function decidePlan(
  proposed: readonly PlanStep[],
  draft: readonly PlanDraftStep[]
): PlanDecision {
  const original = new Map(proposed.map((step) => [step.id, step]))
  const rank = new Map(proposed.map((step, index) => [step.id, index]))
  const kept = draft.filter((step) => !step.removed)
  const removed = draft
    .filter((step) => step.removed && original.has(step.id))
    .map((step) => ({ id: step.id, label: original.get(step.id)!.label }))
  const keptOriginal = kept.filter((step) => original.has(step.id))
  const inOrder = longestIncreasing(
    keptOriginal.map((step) => rank.get(step.id)!),
    keptOriginal.map((step) => Boolean(step.moved))
  )

  return {
    steps: kept.map(({ id, label }) => ({ id, label })),
    removed,
    edits: {
      moved: keptOriginal
        .filter((_, index) => !inOrder.has(index))
        .map((step) => step.id),
      rewritten: keptOriginal
        .filter((step) => original.get(step.id)!.label !== step.label)
        .map((step) => step.id),
      added: kept
        .filter((step) => !original.has(step.id))
        .map((step) => step.id),
      removed: removed.map((step) => step.id),
    },
  }
}

const editCountOf = (edits: PlanEdits) =>
  edits.moved.length +
  edits.rewritten.length +
  edits.added.length +
  edits.removed.length

function editSummary(edits: PlanEdits) {
  return (
    [
      [edits.moved.length, "moved"],
      [edits.rewritten.length, "rewritten"],
      [edits.added.length, "added"],
      [edits.removed.length, "removed"],
    ] as const
  )
    .filter(([count]) => count > 0)
    .map(([count, label]) => `${count} ${label}`)
    .join(" · ")
}

function tagFor(step: PlanDraftStep, edits: PlanEdits) {
  if (step.removed) return "removed"
  if (edits.added.includes(step.id)) return "new"
  if (edits.rewritten.includes(step.id)) return "edited"
  if (edits.moved.includes(step.id)) return "moved"
  return null
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

type Drag = {
  id: string
  row: HTMLElement
  startY: number
  startTop: number
  lastY: number
}

const rowsKeyOf = (rows: readonly PlanDraftStep[]) =>
  rows.map((step) => `${step.id}:${step.label}:${step.removed ?? ""}`).join("|")

function PlanReview({
  steps,
  draft: draftProp,
  onDraftChange,
  state = "review",
  decision,
  note,
  title = "Proposed plan",
  subtitle = "Nothing runs until you approve",
  approveLabel = "Run plan",
  reviseLabel = "Keep planning",
  onApprove,
  onRevise,
  readOnly = false,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "title"> & {
  /** The plan as the agent proposed it. */
  steps: readonly PlanStep[]
  /** The plan as edited so far, to control it. */
  draft?: readonly PlanDraftStep[]
  onDraftChange?: (draft: PlanDraftStep[]) => void
  state?: PlanReviewState
  /** A stored decision, to show what was decided after a reload. */
  decision?: PlanDecision
  /** The note sent back with Keep planning. */
  note?: string
  title?: string
  subtitle?: string
  approveLabel?: string
  reviseLabel?: string
  onApprove?: (decision: PlanDecision) => void
  onRevise?: (note: string, decision: PlanDecision) => void
  /** Shows the plan without editing, like while it is still streaming in. */
  readOnly?: boolean
}) {
  const titleId = React.useId()
  const hintId = React.useId()
  const idPrefix = React.useId()
  const addedCount = React.useRef(0)

  const stepsKey = steps.map((step) => `${step.id}:${step.label}`).join("|")
  const [draftState, setDraftState] = React.useState(() =>
    draftFromSteps(steps)
  )
  const [draftFor, setDraftFor] = React.useState(stepsKey)
  if (draftFor !== stepsKey) {
    setDraftFor(stepsKey)
    setDraftState(draftFromSteps(steps))
  }
  const draft = draftProp ?? draftState
  const setDraft = (next: PlanDraftStep[]) => {
    if (draftProp === undefined) setDraftState(next)
    onDraftChange?.(next)
  }

  const reviewing = state === "review"
  const editable = reviewing && !readOnly
  const live = decidePlan(steps, draft)
  const shown = decision ?? live
  const rows: readonly PlanDraftStep[] =
    decision && !reviewing
      ? [
          ...decision.steps,
          ...decision.removed.map((step) => ({ ...step, removed: true })),
        ]
      : draft
  const editCount = editCountOf(shown.edits)
  const keptCount = rows.filter((step) => !step.removed).length

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editValue, setEditValue] = React.useState("")
  const [composing, setComposing] = React.useState(false)
  const [noteDraft, setNoteDraft] = React.useState("")
  const [announcement, setAnnouncement] = React.useState("")
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [flashIds, setFlashIds] = React.useState<readonly string[]>([])
  const [touched, setTouched] = React.useState<string | null>(null)

  // The newest change lands in the live ink and settles, whoever made it. For
  // a reorder only the step that travelled flashes, not the ones it passed.
  const rowsKey = rowsKeyOf(rows)
  const [previous, setPrevious] = React.useState({ key: rowsKey, rows })
  if (previous.key !== rowsKey) {
    setPrevious({ key: rowsKey, rows })
    setTouched(null)
    if (!draggingId) {
      const before = new Map(
        previous.rows.map((step, index) => [step.id, { step, index }])
      )
      const changed = new Set<string>()
      let travelled: { id: string; distance: number } | null = null
      rows.forEach((step, index) => {
        const prior = before.get(step.id)
        if (
          !prior ||
          prior.step.label !== step.label ||
          prior.step.removed !== step.removed
        ) {
          changed.add(step.id)
        }
        const distance = prior ? Math.abs(prior.index - index) : 0
        if (distance > 0 && (!travelled || distance > travelled.distance)) {
          travelled = { id: step.id, distance }
        }
      })
      const mover = touched ?? (travelled as { id: string } | null)?.id
      if (mover) changed.add(mover)
      if (changed.size > 0) setFlashIds([...changed])
    }
  }

  React.useEffect(() => {
    if (flashIds.length === 0) return
    const timer = setTimeout(() => setFlashIds([]), 900)
    return () => clearTimeout(timer)
  }, [flashIds])

  const listRef = React.useRef<HTMLOListElement>(null)
  const receiptRef = React.useRef<HTMLDivElement>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const positions = React.useRef(new Map<string, number>())
  const drag = React.useRef<Drag | null>(null)

  // Rows that changed place glide from where they were.
  React.useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const next = new Map<string, number>()
    const still = reducedMotion()
    for (const row of list.querySelectorAll<HTMLElement>("[data-step-id]")) {
      const id = row.dataset.stepId!
      const top = row.offsetTop
      next.set(id, top)
      const active = drag.current
      if (active?.id === id) {
        row.style.translate = `0 ${active.lastY - active.startY - (top - active.startTop)}px`
        continue
      }
      const prior = positions.current.get(id)
      if (prior !== undefined && prior !== top && !still) {
        row.animate(
          [{ translate: `0 ${prior - top}px` }, { translate: "0 0" }],
          { duration: 280, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
        )
      }
    }
    positions.current = next
  })

  // A decision takes the controls away, so focus moves to what was decided.
  const focusWasInside = React.useRef(false)
  React.useEffect(() => {
    if (!reviewing && focusWasInside.current) {
      receiptRef.current?.focus({ preventScroll: true })
      focusWasInside.current = false
    }
  }, [reviewing])

  const positionOf = (id: string, list: readonly PlanDraftStep[]) =>
    list.filter((step) => !step.removed).findIndex((step) => step.id === id) + 1

  const moveTo = (id: string, target: number) => {
    const from = draft.findIndex((step) => step.id === id)
    const to = Math.max(0, Math.min(draft.length - 1, target))
    if (from === -1 || from === to) return null
    const next = [...draft]
    const [step] = next.splice(from, 1)
    next.splice(to, 0, { ...step, moved: true })
    setTouched(id)
    setDraft(next)
    return next
  }

  const announceMove = (id: string, list: readonly PlanDraftStep[]) => {
    const step = list.find((entry) => entry.id === id)
    if (!step) return
    const count = list.filter((entry) => !entry.removed).length
    setAnnouncement(
      `Moved “${step.label}” to step ${positionOf(id, list)} of ${count}`
    )
  }

  const onHandleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    id: string
  ) => {
    const index = draft.findIndex((step) => step.id === id)
    const target =
      event.key === "ArrowUp"
        ? index - 1
        : event.key === "ArrowDown"
          ? index + 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? draft.length - 1
              : null
    if (target === null) return
    event.preventDefault()
    const next = moveTo(id, target)
    if (next) announceMove(id, next)
  }

  const onHandlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    id: string
  ) => {
    if (event.button !== 0) return
    const row = event.currentTarget.closest<HTMLElement>("[data-step-id]")
    if (!row) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = {
      id,
      row,
      startY: event.clientY,
      startTop: row.offsetTop,
      lastY: event.clientY,
    }
    setDraggingId(id)
  }

  const onHandlePointerMove = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    const active = drag.current
    const list = listRef.current
    if (!active || !list) return
    active.lastY = event.clientY
    const { row } = active
    const center =
      active.startTop + row.offsetHeight / 2 + (event.clientY - active.startY)
    const target = [...list.querySelectorAll<HTMLElement>("[data-step-id]")]
      .filter((entry) => entry !== row)
      .filter(
        (entry) => entry.offsetTop + entry.offsetHeight / 2 < center
      ).length
    row.style.translate = `0 ${event.clientY - active.startY - (row.offsetTop - active.startTop)}px`
    moveTo(active.id, target)
  }

  const endDrag = () => {
    const active = drag.current
    if (!active) return
    drag.current = null
    const { row } = active
    const offset = row.style.translate
    row.style.translate = ""
    if (offset && offset !== "0 0px" && !reducedMotion()) {
      row.animate([{ translate: offset }, { translate: "0 0" }], {
        duration: 150,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      })
    }
    setDraggingId(null)
    announceMove(active.id, draft)
  }

  const commitEdit = (id: string) => {
    const value = editValue.trim()
    const step = draft.find((entry) => entry.id === id)
    setEditingId(null)
    if (!step) return
    if (!value) {
      if (step.added) setDraft(draft.filter((entry) => entry.id !== id))
      return
    }
    if (value !== step.label) {
      setDraft(
        draft.map((entry) =>
          entry.id === id ? { ...entry, label: value } : entry
        )
      )
    }
  }

  const cancelEdit = (id: string) => {
    const step = draft.find((entry) => entry.id === id)
    setEditingId(null)
    if (step?.added && !step.label) {
      setDraft(draft.filter((entry) => entry.id !== id))
    }
  }

  const setRemoved = (step: PlanDraftStep, removed: boolean) => {
    if (removed && step.added) {
      setDraft(draft.filter((entry) => entry.id !== step.id))
    } else {
      setDraft(
        draft.map((entry) =>
          entry.id === step.id ? { ...entry, removed } : entry
        )
      )
    }
    setAnnouncement(`${removed ? "Removed" : "Restored"} “${step.label}”`)
  }

  const addStep = () => {
    addedCount.current += 1
    const id = `${idPrefix}added-${addedCount.current}`
    setDraft([...draft, { id, label: "", added: true }])
    setEditingId(id)
    setEditValue("")
  }

  const decide = (run: () => void) => {
    focusWasInside.current =
      rootRef.current?.contains(document.activeElement) ?? false
    run()
  }

  return (
    <div
      ref={rootRef}
      role="group"
      aria-labelledby={titleId}
      data-slot="plan-review"
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
      <span id={hintId} className="sr-only">
        Press arrow up or arrow down to move the step.
      </span>

      <div data-slot="plan-review-header" className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
        >
          <HugeiconsIcon icon={CheckListIcon} className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p id={titleId} className="truncate text-sm font-medium">
            {title}
          </p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {plural(keptCount, "step")}
        </span>
      </div>

      <ol
        ref={listRef}
        aria-label="Plan steps"
        className="relative flex flex-col"
      >
        {rows.map((step) => {
          const position = positionOf(step.id, rows)
          const tag = tagFor(step, shown.edits)
          const editing = editable && editingId === step.id
          const flashing = flashIds.includes(step.id)
          const dragging = draggingId === step.id

          return (
            <li
              key={step.id}
              data-slot="plan-review-step"
              data-step-id={step.id}
              data-removed={step.removed || undefined}
              data-dragging={dragging || undefined}
              data-flashing={flashing || undefined}
              className="group/step relative flex h-8 items-center gap-1 rounded-lg pe-1 transition-[background-color,box-shadow] duration-280 data-dragging:z-10 data-dragging:bg-background data-dragging:shadow-md data-dragging:ring-1 data-dragging:ring-border data-flashing:bg-muted data-flashing:duration-80 motion-reduce:transition-none"
            >
              {editable && !step.removed ? (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Reorder “${step.label || "new step"}”`}
                  aria-describedby={hintId}
                  onKeyDown={(event) => onHandleKeyDown(event, step.id)}
                  onPointerDown={(event) => onHandlePointerDown(event, step.id)}
                  onPointerMove={onHandlePointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className="cursor-grab touch-none text-muted-foreground focus-visible:border-ring active:cursor-grabbing"
                >
                  <HugeiconsIcon aria-hidden icon={DragDropVerticalIcon} />
                </Button>
              ) : (
                <span aria-hidden className="size-6 shrink-0" />
              )}

              <span className="w-4 shrink-0 text-end text-xs text-muted-foreground tabular-nums">
                {step.removed ? "–" : position}
              </span>

              {editing ? (
                <Input
                  autoFocus
                  value={editValue}
                  aria-label={`Step ${position}`}
                  placeholder="Describe the step"
                  onChange={(event) => setEditValue(event.target.value)}
                  onBlur={() => commitEdit(step.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      commitEdit(step.id)
                    } else if (event.key === "Escape") {
                      event.preventDefault()
                      cancelEdit(step.id)
                    }
                  }}
                  className="ms-1 h-7 min-w-0 flex-1 px-1.5 text-sm"
                />
              ) : editable && !step.removed ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(step.id)
                    setEditValue(step.label)
                  }}
                  aria-label={`Edit step ${position}: ${step.label}`}
                  title={step.label}
                  className="ms-1 min-w-0 flex-1 cursor-text truncate rounded-md border border-transparent px-1.5 py-0.5 text-start text-sm transition-colors duration-80 outline-none hover:bg-muted focus-visible:border-ring motion-reduce:transition-none"
                >
                  {step.label}
                </button>
              ) : (
                <span
                  title={step.label}
                  className={cn(
                    "ms-1 min-w-0 flex-1 truncate px-1.5 text-sm",
                    step.removed &&
                      "text-muted-foreground line-through decoration-muted-foreground/50"
                  )}
                >
                  {step.label}
                </span>
              )}

              {tag && !editing ? (
                <span className="shrink-0 ps-1 text-xs text-muted-foreground">
                  {tag}
                </span>
              ) : null}

              {editable && !editing ? (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={
                    step.removed
                      ? `Restore “${step.label}”`
                      : `Remove “${step.label}”`
                  }
                  onClick={() => setRemoved(step, !step.removed)}
                  className={cn(
                    "text-muted-foreground opacity-0 group-focus-within/step:opacity-100 group-hover/step:opacity-100 focus-visible:border-ring focus-visible:opacity-100 pointer-coarse:opacity-100",
                    step.removed && "opacity-100"
                  )}
                >
                  <HugeiconsIcon
                    aria-hidden
                    icon={step.removed ? Undo02Icon : Cancel01Icon}
                  />
                </Button>
              ) : null}
            </li>
          )
        })}
      </ol>

      {editable && !composing ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={addStep}
          className="-mt-1.5 w-fit text-muted-foreground focus-visible:border-ring"
        >
          <HugeiconsIcon aria-hidden icon={PlusSignIcon} />
          Add step
        </Button>
      ) : null}

      {editable && composing ? (
        <div className="flex flex-col gap-2">
          <Textarea
            autoFocus
            rows={2}
            value={noteDraft}
            aria-label="What should change?"
            placeholder="What should change?"
            onChange={(event) => setNoteDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setComposing(false)
            }}
            className="min-h-0 resize-none text-sm"
          />
          <div className="flex justify-end gap-1.5">
            <Button variant="ghost" onClick={() => setComposing(false)}>
              Cancel
            </Button>
            <Button
              disabled={!noteDraft.trim()}
              onClick={() =>
                decide(() => {
                  setComposing(false)
                  onRevise?.(noteDraft.trim(), live)
                })
              }
            >
              Send back
            </Button>
          </div>
        </div>
      ) : null}

      {reviewing ? (
        composing ? null : (
          <div className="flex min-h-7 items-center justify-between gap-2">
            <span
              className="text-xs text-muted-foreground tabular-nums"
              aria-live="polite"
            >
              {editCount === 0 ? "As proposed" : plural(editCount, "edit")}
            </span>
            <div className="flex items-center gap-1.5">
              {onRevise ? (
                <Button
                  variant="ghost"
                  data-slot="plan-review-revise"
                  onClick={() => setComposing(true)}
                >
                  {reviseLabel}
                </Button>
              ) : null}
              {onApprove ? (
                <Button
                  data-slot="plan-review-approve"
                  disabled={keptCount === 0}
                  onClick={() => decide(() => onApprove(live))}
                >
                  {approveLabel}
                </Button>
              ) : null}
            </div>
          </div>
        )
      ) : (
        <div
          key={state}
          ref={receiptRef}
          tabIndex={-1}
          role="status"
          data-slot="plan-review-receipt"
          className="flex animate-in flex-col gap-2 duration-280 outline-none fade-in motion-reduce:animate-none"
        >
          <div className="flex min-h-7 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <HugeiconsIcon
              aria-hidden
              icon={state === "approved" ? Tick02Icon : ArrowTurnBackwardIcon}
              className={cn(
                "size-3.5",
                state === "approved" && "text-emerald-600 dark:text-emerald-400"
              )}
            />
            <span>
              {state === "approved"
                ? editCount === 0
                  ? "Approved as proposed"
                  : `Approved with ${plural(editCount, "edit")}`
                : "Sent back to keep planning"}
            </span>
            {editCount > 0 ? (
              <span className="ms-auto whitespace-nowrap tabular-nums">
                {editSummary(shown.edits)}
              </span>
            ) : null}
          </div>
          {state === "revising" && note ? (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm">{note}</p>
          ) : null}
        </div>
      )}
    </div>
  )
}

export { PlanReview, decidePlan, draftFromSteps }
export type {
  PlanDecision,
  PlanDraftStep,
  PlanEdits,
  PlanReviewState,
  PlanStep,
}
