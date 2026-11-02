"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ArrowTurnBackwardIcon,
  Cancel01Icon,
  CheckListIcon,
  GripVerticalIcon,
  PlusSignIcon,
  Tick02Icon,
  Undo02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

/* Surfaces, matched to the assistant-ui element kit so this file stands alone. */
const paper = "bg-background border border-border/60 dark:bg-popover";
const field =
  "bg-foreground/[0.04] forced-colors:border dark:bg-foreground/[0.06]";
const ghostButton =
  "flex items-center justify-center rounded-full text-muted-foreground outline-hidden transition-[background-color,color,scale] duration-150 hover:bg-foreground/[0.06] hover:text-foreground/90 active:scale-[0.96] focus-visible:ring-1 focus-visible:ring-foreground/20 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-foreground/[0.09]";
const inkButton =
  "bg-foreground text-background transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:opacity-90 active:scale-[0.96] motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40 forced-colors:border";
const mono = "font-mono text-[11px] tracking-tight";

export interface PlanStep {
  id: string;
  label: string;
}

/** A step as the user is shaping it: added steps are new, removed ones stay listed until the decision. */
export interface PlanDraftStep extends PlanStep {
  added?: boolean | undefined;
  removed?: boolean | undefined;
  /** Set when the reader moved this step, so it, not its neighbors, reads as moved. */
  moved?: boolean | undefined;
}

export interface PlanEdits {
  moved: string[];
  rewritten: string[];
  added: string[];
  removed: string[];
}

/** What the agent gets back: the steps to run, in order, and exactly what changed. */
export interface PlanDecision {
  steps: PlanStep[];
  removed: PlanStep[];
  edits: PlanEdits;
}

export type PlanReviewState = "review" | "approved" | "revising";

export const draftFromSteps = (steps: readonly PlanStep[]): PlanDraftStep[] =>
  steps.map(({ id, label }) => ({ id, label }));

/**
 * Indices of the longest strictly increasing run in `values`. Between equally
 * long runs it keeps the one with fewer `touched` entries, then the one with
 * smaller values, so the step that was actually moved reads as moved rather
 * than everything it jumped over.
 */
function longestIncreasing(
  values: readonly number[],
  touched: readonly boolean[] = [],
): Set<number> {
  type Run = { length: number; untouched: number; last: number };
  const better = (a: Run, b: Run) =>
    a.length !== b.length
      ? a.length > b.length
      : a.untouched !== b.untouched
        ? a.untouched > b.untouched
        : a.last < b.last;
  const runs: Run[] = values.map((value, i) => ({
    length: 1,
    untouched: touched[i] ? 0 : 1,
    last: value,
  }));
  const previous = values.map(() => -1);
  let best = -1;
  for (let i = 0; i < values.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (values[j]! >= values[i]!) continue;
      const candidate: Run = {
        length: runs[j]!.length + 1,
        untouched: runs[j]!.untouched + (touched[i] ? 0 : 1),
        last: values[i]!,
      };
      const prior = previous[i]!;
      const current = runs[i]!;
      const tie =
        candidate.length === current.length &&
        candidate.untouched === current.untouched;
      if (
        prior === -1 ||
        better(candidate, current) ||
        (tie && values[j]! < values[prior]!)
      ) {
        runs[i] = candidate;
        previous[i] = j;
      }
    }
    if (best === -1 || better(runs[i]!, runs[best]!)) best = i;
  }
  const kept = new Set<number>();
  for (let i = best; i !== -1; i = previous[i]!) kept.add(i);
  return kept;
}

/** Compares a draft with the proposal. A step counts as moved only if it left the longest run still in proposed order. */
export function decidePlan(
  proposed: readonly PlanStep[],
  draft: readonly PlanDraftStep[],
): PlanDecision {
  const original = new Map(proposed.map((step) => [step.id, step]));
  const rank = new Map(proposed.map((step, index) => [step.id, index]));
  const kept = draft.filter((step) => !step.removed);
  const removed = draft
    .filter((step) => step.removed && original.has(step.id))
    .map((step) => ({
      id: step.id,
      label: original.get(step.id)!.label,
    }));
  const keptOriginal = kept.filter((step) => original.has(step.id));
  const inOrder = longestIncreasing(
    keptOriginal.map((step) => rank.get(step.id)!),
    keptOriginal.map((step) => Boolean(step.moved)),
  );

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
  };
}

const editCountOf = (edits: PlanEdits) =>
  edits.moved.length +
  edits.rewritten.length +
  edits.added.length +
  edits.removed.length;

function editSummary(edits: PlanEdits): string {
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
    .join(" · ");
}

function tagFor(step: PlanDraftStep, edits: PlanEdits): string | null {
  if (step.removed) return "removed";
  if (edits.added.includes(step.id)) return "new";
  if (edits.rewritten.includes(step.id)) return "edited";
  if (edits.moved.includes(step.id)) return "moved";
  return null;
}

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Drag = {
  id: string;
  row: HTMLElement;
  startY: number;
  startTop: number;
  lastY: number;
};

export function PlanReview({
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
}: Omit<ComponentProps<"div">, "children" | "title"> & {
  /** The plan as the agent proposed it. */
  steps: readonly PlanStep[];
  /** The plan as edited so far (controlled). Defaults to `steps`. */
  draft?: readonly PlanDraftStep[] | undefined;
  onDraftChange?: ((draft: PlanDraftStep[]) => void) | undefined;
  state?: PlanReviewState | undefined;
  /** The recorded decision, for rendering a receipt from a stored result. */
  decision?: PlanDecision | undefined;
  /** The note sent back with "Keep planning". */
  note?: string | undefined;
  title?: string | undefined;
  subtitle?: string | undefined;
  approveLabel?: string | undefined;
  reviseLabel?: string | undefined;
  onApprove?: ((decision: PlanDecision) => void) | undefined;
  onRevise?: ((note: string, decision: PlanDecision) => void) | undefined;
  /** Shows the plan without editing, e.g. while its arguments still stream. */
  readOnly?: boolean | undefined;
}) {
  const titleId = useId();
  const hintId = useId();
  const idPrefix = useId();
  const addedCount = useRef(0);

  const stepsKey = steps.map((step) => `${step.id}:${step.label}`).join("|");
  const [draftState, setDraftState] = useState(() => draftFromSteps(steps));
  const [draftFor, setDraftFor] = useState(stepsKey);
  if (draftFor !== stepsKey) {
    setDraftFor(stepsKey);
    setDraftState(draftFromSteps(steps));
  }
  const draft = draftProp ?? draftState;
  const setDraft = (next: PlanDraftStep[]) => {
    if (draftProp === undefined) setDraftState(next);
    onDraftChange?.(next);
  };

  const reviewing = state === "review";
  const editable = reviewing && !readOnly;
  const live = decidePlan(steps, draft);
  const shown = decision ?? live;
  const rows: readonly PlanDraftStep[] =
    decision && !reviewing
      ? [
          ...decision.steps.map((step) => ({ ...step })),
          ...decision.removed.map((step) => ({ ...step, removed: true })),
        ]
      : draft;
  const editCount = editCountOf(shown.edits);
  const keptCount = rows.filter((step) => !step.removed).length;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [composing, setComposing] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [flashIds, setFlashIds] = useState<readonly string[]>([]);

  const listRef = useRef<HTMLOListElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, number>());
  const drag = useRef<Drag | null>(null);
  const previousRows = useRef(rows);

  // The newest change lands in blue and settles into ink, whoever made it. For
  // a reorder only the step that travelled flashes, not the ones it displaced.
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const touched = useRef<string | null>(null);
  useEffect(() => () => clearTimeout(flashTimer.current), []);
  useEffect(() => {
    const before = new Map(
      previousRows.current.map((step, index) => [step.id, { step, index }]),
    );
    previousRows.current = rows;
    if (draggingId) return;
    const changed = new Set<string>();
    let travelled: { id: string; distance: number } | null = null;
    rows.forEach((step, index) => {
      const prior = before.get(step.id);
      if (!prior) {
        changed.add(step.id);
        return;
      }
      if (
        prior.step.label !== step.label ||
        prior.step.removed !== step.removed
      ) {
        changed.add(step.id);
      }
      const distance = Math.abs(prior.index - index);
      if (distance > 0 && (!travelled || distance > travelled.distance)) {
        travelled = { id: step.id, distance };
      }
    });
    const mover = touched.current ?? (travelled as { id: string } | null)?.id;
    if (mover && (travelled || touched.current)) changed.add(mover);
    touched.current = null;
    if (changed.size === 0) return;
    setFlashIds([...changed]);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlashIds([]), 900);
  });

  // FLIP: rows that changed slot glide from where they were.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const next = new Map<string, number>();
    const still = reducedMotion();
    for (const row of list.querySelectorAll<HTMLElement>("[data-step-id]")) {
      const id = row.dataset.stepId!;
      const top = row.offsetTop;
      next.set(id, top);
      const active = drag.current;
      if (active?.id === id) {
        row.style.translate = `0 ${active.lastY - active.startY - (top - active.startTop)}px`;
        continue;
      }
      const prior = positions.current.get(id);
      if (prior !== undefined && prior !== top && !still) {
        row.animate(
          [{ translate: `0 ${prior - top}px` }, { translate: "0 0" }],
          { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
        );
      }
    }
    positions.current = next;
  });

  // A decision removes the controls; keep focus on the card's receipt.
  const focusWasInside = useRef(false);
  useEffect(() => {
    if (!reviewing && focusWasInside.current) {
      receiptRef.current?.focus({ preventScroll: true });
      focusWasInside.current = false;
    }
  }, [reviewing]);

  const positionOf = (id: string, list: readonly PlanDraftStep[]) =>
    list.filter((step) => !step.removed).findIndex((step) => step.id === id) +
    1;

  const moveTo = (id: string, target: number) => {
    const from = draft.findIndex((step) => step.id === id);
    const to = Math.max(0, Math.min(draft.length - 1, target));
    if (from === -1 || from === to) return null;
    const next = [...draft];
    const [step] = next.splice(from, 1);
    next.splice(to, 0, { ...step!, moved: true });
    touched.current = id;
    setDraft(next);
    return next;
  };

  const announceMove = (id: string, list: readonly PlanDraftStep[]) => {
    const step = list.find((entry) => entry.id === id);
    if (!step) return;
    setAnnouncement(
      `Moved “${step.label}” to step ${positionOf(id, list)} of ${list.filter((entry) => !entry.removed).length}`,
    );
  };

  const onHandleKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    id: string,
  ) => {
    const index = draft.findIndex((step) => step.id === id);
    let target: number | null = null;
    if (event.key === "ArrowUp") target = index - 1;
    if (event.key === "ArrowDown") target = index + 1;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = draft.length - 1;
    if (target === null) return;
    event.preventDefault();
    const next = moveTo(id, target);
    if (next) announceMove(id, next);
  };

  const onHandlePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (event.button !== 0) return;
    const row = event.currentTarget.closest<HTMLElement>("[data-step-id]");
    if (!row) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      id,
      row,
      startY: event.clientY,
      startTop: row.offsetTop,
      lastY: event.clientY,
    };
    setDraggingId(id);
  };

  const onHandlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const active = drag.current;
    const list = listRef.current;
    if (!active || !list) return;
    active.lastY = event.clientY;
    const { row } = active;
    const center =
      active.startTop + row.offsetHeight / 2 + (event.clientY - active.startY);
    const others = [
      ...list.querySelectorAll<HTMLElement>("[data-step-id]"),
    ].filter((entry) => entry !== row);
    const target = others.filter(
      (entry) => entry.offsetTop + entry.offsetHeight / 2 < center,
    ).length;
    row.style.translate = `0 ${event.clientY - active.startY - (row.offsetTop - active.startTop)}px`;
    moveTo(active.id, target);
  };

  const endDrag = () => {
    const active = drag.current;
    if (!active) return;
    drag.current = null;
    const { row } = active;
    const offset = row.style.translate;
    row.style.translate = "";
    if (offset && offset !== "0 0px" && !reducedMotion()) {
      row.animate([{ translate: offset }, { translate: "0 0" }], {
        duration: 180,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      });
    }
    setDraggingId(null);
    announceMove(active.id, draft);
  };

  const startEdit = (step: PlanDraftStep) => {
    setEditingId(step.id);
    setEditValue(step.label);
  };

  const commitEdit = (id: string) => {
    const value = editValue.trim();
    const step = draft.find((entry) => entry.id === id);
    setEditingId(null);
    if (!step) return;
    if (!value) {
      if (step.added) setDraft(draft.filter((entry) => entry.id !== id));
      return;
    }
    if (value !== step.label) {
      setDraft(
        draft.map((entry) =>
          entry.id === id ? { ...entry, label: value } : entry,
        ),
      );
    }
  };

  const cancelEdit = (id: string) => {
    const step = draft.find((entry) => entry.id === id);
    setEditingId(null);
    if (step?.added && !step.label) {
      setDraft(draft.filter((entry) => entry.id !== id));
    }
  };

  const setRemoved = (step: PlanDraftStep, removed: boolean) => {
    if (removed && step.added) {
      setDraft(draft.filter((entry) => entry.id !== step.id));
    } else {
      setDraft(
        draft.map((entry) =>
          entry.id === step.id ? { ...entry, removed } : entry,
        ),
      );
    }
    setAnnouncement(`${removed ? "Removed" : "Restored"} “${step.label}”`);
  };

  const addStep = () => {
    addedCount.current += 1;
    const id = `${idPrefix}added-${addedCount.current}`;
    setDraft([...draft, { id, label: "", added: true }]);
    setEditingId(id);
    setEditValue("");
  };

  const decide = (run: () => void) => {
    focusWasInside.current =
      rootRef.current?.contains(document.activeElement) ?? false;
    run();
  };

  return (
    <div
      {...props}
      ref={rootRef}
      role="group"
      aria-labelledby={titleId}
      data-slot="plan-review"
      data-state={state}
      className={cn(
        paper,
        "flex w-full max-w-sm flex-col gap-3 rounded-[20px] p-4",
        className,
      )}
    >
      <span role="status" className="sr-only">
        {announcement}
      </span>
      <span id={hintId} className="sr-only">
        Press arrow up or arrow down to move the step.
      </span>

      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="bg-foreground/[0.05] text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-xl"
        >
          <HugeiconsIcon aria-hidden icon={CheckListIcon} className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p id={titleId} className="truncate text-[13.5px] font-medium">
            {title}
          </p>
          <p className="text-muted-foreground truncate text-xs">{subtitle}</p>
        </div>
        <span
          className={cn(mono, "text-muted-foreground shrink-0 tabular-nums")}
        >
          {keptCount} {keptCount === 1 ? "step" : "steps"}
        </span>
      </div>

      <ol
        ref={listRef}
        aria-label="Plan steps"
        className="relative flex flex-col"
      >
        {rows.map((step) => {
          const position = positionOf(step.id, rows);
          const tag = tagFor(step, shown.edits);
          const editing = editable && editingId === step.id;
          const flashing = flashIds.includes(step.id);
          const dragging = draggingId === step.id;

          return (
            <li
              key={step.id}
              data-step-id={step.id}
              data-removed={step.removed || undefined}
              data-dragging={dragging || undefined}
              className={cn(
                "group/step relative flex h-8 items-center gap-1.5 rounded-lg pe-1 transition-[background-color,box-shadow] duration-700 motion-reduce:transition-none",
                dragging
                  ? "bg-background ring-border/80 z-10 shadow-lg ring-1 duration-150 dark:bg-popover"
                  : flashing
                    ? "bg-blue-500/[0.08] duration-150 dark:bg-blue-400/[0.1]"
                    : "bg-transparent",
              )}
            >
              {editable && !step.removed ? (
                <button
                  type="button"
                  aria-label={`Reorder “${step.label || "new step"}”`}
                  aria-describedby={hintId}
                  onKeyDown={(event) => onHandleKeyDown(event, step.id)}
                  onPointerDown={(event) => onHandlePointerDown(event, step.id)}
                  onPointerMove={onHandlePointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className={cn(
                    ghostButton,
                    "size-6 shrink-0 cursor-grab touch-none rounded-md active:cursor-grabbing",
                  )}
                >
                  <HugeiconsIcon
                    aria-hidden
                    icon={GripVerticalIcon}
                    className="size-3.5"
                  />
                </button>
              ) : (
                <span aria-hidden className="size-6 shrink-0" />
              )}

              <span
                className={cn(
                  mono,
                  "text-muted-foreground w-4 shrink-0 text-end tabular-nums",
                )}
              >
                {step.removed ? "–" : position}
              </span>

              {editing ? (
                <input
                  autoFocus
                  value={editValue}
                  aria-label={`Step ${position}`}
                  placeholder="Describe the step"
                  onChange={(event) => setEditValue(event.target.value)}
                  onBlur={() => commitEdit(step.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitEdit(step.id);
                    }
                    if (event.key === "Escape") {
                      event.preventDefault();
                      cancelEdit(step.id);
                    }
                  }}
                  className={cn(
                    field,
                    "placeholder:text-muted-foreground/70 focus-visible:ring-foreground/20 ms-1 h-6 min-w-0 flex-1 rounded-md px-1.5 text-[13px] outline-hidden focus-visible:ring-1",
                  )}
                />
              ) : editable && !step.removed ? (
                <button
                  type="button"
                  onClick={() => startEdit(step)}
                  aria-label={`Edit step ${position}: ${step.label}`}
                  title={step.label}
                  className="hover:bg-foreground/[0.04] focus-visible:ring-foreground/20 ms-1 min-w-0 flex-1 cursor-text truncate rounded-md px-1.5 py-0.5 text-start text-[13px] outline-hidden transition-colors focus-visible:ring-1 motion-reduce:transition-none"
                >
                  <span
                    className={cn(
                      "transition-colors duration-700 motion-reduce:transition-none",
                      flashing
                        ? "text-blue-600 duration-150 dark:text-blue-400"
                        : "text-foreground/90",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
              ) : (
                <span
                  title={step.label}
                  className={cn(
                    "ms-1 min-w-0 flex-1 truncate px-1.5 text-[13px]",
                    step.removed
                      ? "text-muted-foreground decoration-foreground/30 line-through"
                      : "text-foreground/90",
                  )}
                >
                  {step.label}
                </span>
              )}

              {tag && !editing ? (
                <span
                  className={cn(mono, "text-muted-foreground shrink-0 ps-1")}
                >
                  {tag}
                </span>
              ) : null}

              {editable && !editing ? (
                <button
                  type="button"
                  aria-label={
                    step.removed
                      ? `Restore “${step.label}”`
                      : `Remove “${step.label}”`
                  }
                  onClick={() => setRemoved(step, !step.removed)}
                  className={cn(
                    ghostButton,
                    "size-6 shrink-0 opacity-0 group-focus-within/step:opacity-100 group-hover/step:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100",
                    step.removed && "opacity-100",
                  )}
                >
                  {step.removed ? (
                    <HugeiconsIcon
                      aria-hidden
                      icon={Undo02Icon}
                      className="size-3"
                    />
                  ) : (
                    <HugeiconsIcon
                      aria-hidden
                      icon={Cancel01Icon}
                      className="size-3"
                    />
                  )}
                </button>
              ) : null}
            </li>
          );
        })}
      </ol>

      {editable && !composing ? (
        <button
          type="button"
          onClick={addStep}
          className={cn(
            ghostButton,
            "-mt-1.5 h-7 w-fit gap-1.5 rounded-lg ps-2 pe-2.5 text-xs",
          )}
        >
          <HugeiconsIcon
            aria-hidden
            icon={PlusSignIcon}
            className="size-3.5"
          />
          Add step
        </button>
      ) : null}

      {editable && composing ? (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            rows={2}
            value={noteDraft}
            aria-label="What should change?"
            placeholder="What should change?"
            onChange={(event) => setNoteDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setComposing(false);
            }}
            className={cn(
              field,
              "placeholder:text-muted-foreground/70 focus-visible:ring-foreground/20 resize-none rounded-xl px-3 py-2 text-[13px] outline-hidden focus-visible:ring-1",
            )}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setComposing(false)}
              className={cn(ghostButton, "h-8 px-3.5 text-xs font-medium")}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!noteDraft.trim()}
              onClick={() =>
                decide(() => {
                  setComposing(false);
                  onRevise?.(noteDraft.trim(), live);
                })
              }
              className={cn(
                inkButton,
                "flex h-8 items-center rounded-full px-3.5 text-xs font-medium",
              )}
            >
              Send back
            </button>
          </div>
        </div>
      ) : null}

      {reviewing ? (
        composing ? null : (
          <div className="flex min-h-8 items-center justify-between gap-2">
            <span
              className={cn(mono, "text-muted-foreground")}
              aria-live="polite"
            >
              {editCount === 0
                ? "as proposed"
                : `${editCount} ${editCount === 1 ? "edit" : "edits"}`}
            </span>
            <div className="flex items-center gap-2">
              {onRevise ? (
                <button
                  type="button"
                  data-slot="plan-review-revise"
                  onClick={() => setComposing(true)}
                  className={cn(
                    ghostButton,
                    "h-8 px-3.5 text-xs font-medium whitespace-nowrap",
                  )}
                >
                  {reviseLabel}
                </button>
              ) : null}
              {onApprove ? (
                <button
                  type="button"
                  data-slot="plan-review-approve"
                  disabled={keptCount === 0}
                  onClick={() => decide(() => onApprove(live))}
                  className={cn(
                    inkButton,
                    "flex h-8 items-center rounded-full px-3.5 text-xs font-medium whitespace-nowrap",
                  )}
                >
                  {approveLabel}
                </button>
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
          className="fade-in animate-in flex flex-col gap-2 outline-hidden duration-300 motion-reduce:animate-none"
        >
          <div className="text-muted-foreground flex min-h-8 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            {state === "approved" ? (
              <HugeiconsIcon
                aria-hidden
                icon={Tick02Icon}
                className="size-3.5"
              />
            ) : (
              <HugeiconsIcon
                aria-hidden
                icon={ArrowTurnBackwardIcon}
                className="size-3.5"
              />
            )}
            <span>
              {state === "approved"
                ? editCount === 0
                  ? "Approved as proposed"
                  : `Approved with ${editCount} ${editCount === 1 ? "edit" : "edits"}`
                : "Sent back to keep planning"}
            </span>
            {editCount > 0 ? (
              <span className={cn(mono, "ms-auto whitespace-nowrap")}>
                {editSummary(shown.edits)}
              </span>
            ) : null}
          </div>
          {state === "revising" && note ? (
            <p
              className={cn(
                field,
                "text-foreground/75 rounded-xl px-3 py-2 text-[13px]",
              )}
            >
              {note}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}