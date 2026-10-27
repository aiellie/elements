"use client"

import * as React from "react"
import { File01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"
import { Textarea } from "@/registry/aiellie/ui/textarea"

type DocBlock = {
  id: string
  text: string
}

/** Where the agent's rewrite of the held block stands. */
type RewriteState = "idle" | "writing" | "ready" | "conflict"

const docText = "text-sm leading-relaxed"

function AgentCursor({
  title = "Untitled",
  blocks,
  onBlocksChange,
  agentName = "Assistant",
  target,
  base,
  draft = "",
  writing = false,
  onConflict,
  onKeepYours,
  onUseAgent,
  onMerge,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "title"> & {
  title?: string
  /** The document, one entry per paragraph. */
  blocks: readonly DocBlock[]
  /** Fires when the user edits any block, the held one included. */
  onBlocksChange?: (blocks: DocBlock[]) => void
  agentName?: string
  /** The id of the block the agent is rewriting. */
  target?: string
  /** The text the agent was given for that block. Left out, it's read as each rewrite starts. */
  base?: string
  /** The rewrite so far. Set it back to "" to start a new one. */
  draft?: string
  /** Whether the rewrite is still streaming. */
  writing?: boolean
  /** Fires once a rewrite when the user edits the held block after the agent started. Nothing is applied either way. */
  onConflict?: (yourText: string) => void
  /** Adds Discard, or Keep yours after a conflict. */
  onKeepYours?: () => void
  /** Adds Replace, or Use the agent's after a conflict. */
  onUseAgent?: (draft: string) => void
  /** Adds Merge after a conflict: ask the agent to redo the rewrite from your text. */
  onMerge?: (yourText: string) => void
}) {
  const statusId = React.useId()
  const held = blocks.find((block) => block.id === target)
  const heldIndex = blocks.findIndex((block) => block.id === target)

  // The text the agent started from. A new rewrite (another target, or the
  // draft set back to "") reads it again, so a merge starts from your edit.
  const [remembered, setRemembered] = React.useState(held?.text)
  const [previous, setPrevious] = React.useState({ target, draft })
  if (previous.target !== target || previous.draft !== draft) {
    if (previous.target !== target || (previous.draft !== "" && draft === "")) {
      setRemembered(held?.text)
    }
    setPrevious({ target, draft })
  }
  const baseline = base ?? remembered

  const edited =
    held !== undefined && baseline !== undefined && held.text !== baseline
  const state: RewriteState = !held
    ? "idle"
    : edited && draft.length > 0
      ? "conflict"
      : writing
        ? "writing"
        : draft.length > 0
          ? "ready"
          : "idle"

  // Tells the host once a rewrite, so it can pause the agent.
  const reported = React.useRef(false)
  React.useEffect(() => {
    if (state !== "conflict") {
      if (!edited) reported.current = false
      return
    }
    if (reported.current || !held) return
    reported.current = true
    onConflict?.(held.text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const paragraph = `paragraph ${heldIndex + 1}`
  const announcement =
    state === "writing"
      ? `${agentName} is rewriting ${paragraph}`
      : state === "ready"
        ? `${agentName}'s rewrite of ${paragraph} is ready`
        : state === "conflict"
          ? `You edited ${paragraph} after ${agentName} started rewriting it. Choose which version to keep.`
          : ""

  const update = (id: string, text: string) =>
    onBlocksChange?.(
      blocks.map((block) => (block.id === id ? { ...block, text } : block))
    )

  return (
    <div
      data-slot="agent-cursor"
      data-state={state}
      className={cn(
        "flex w-full max-w-md flex-col gap-2 rounded-2xl border border-border/60 bg-background p-3",
        className
      )}
      {...props}
    >
      <span id={statusId} role="status" className="sr-only">
        {announcement}
      </span>

      <div
        data-slot="agent-cursor-header"
        className="flex h-6 items-center gap-2 px-1.5"
      >
        <HugeiconsIcon
          aria-hidden
          icon={File01Icon}
          className="size-4 shrink-0 text-muted-foreground"
        />
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span
            aria-hidden
            data-writing={writing || undefined}
            className={cn(
              "size-1.5 rounded-full transition-colors duration-150 data-writing:bg-live motion-reduce:transition-none",
              state === "idle" ? "bg-foreground/20" : "bg-foreground/50"
            )}
          />
          {state === "writing" || (state === "conflict" && writing)
            ? `${agentName} editing`
            : state === "conflict"
              ? `${agentName} waiting`
              : state === "ready"
                ? `${agentName} done`
                : agentName}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {blocks.map((block, index) => {
          const isHeld = block.id === target && state !== "idle"
          return (
            <div key={block.id} className="flex flex-col">
              <div
                data-held={isHeld || undefined}
                data-writing={(isHeld && state === "writing") || undefined}
                className="relative rounded-lg transition-colors duration-280 data-held:bg-muted/60 data-writing:bg-live/4 motion-reduce:transition-none dark:data-writing:bg-live/8"
              >
                {isHeld ? (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-1 -start-1 w-0.5 rounded-full transition-colors duration-150 motion-reduce:transition-none",
                      state === "writing" ? "bg-live" : "bg-foreground/30"
                    )}
                  />
                ) : null}
                <Textarea
                  data-slot="agent-cursor-block"
                  aria-label={`Paragraph ${index + 1}`}
                  aria-describedby={isHeld ? statusId : undefined}
                  rows={1}
                  spellCheck
                  value={block.text}
                  readOnly={!onBlocksChange}
                  onChange={(event) => update(block.id, event.target.value)}
                  className={cn(
                    docText,
                    "min-h-0 resize-none rounded-md border-transparent bg-transparent px-1.5 py-0.5 dark:bg-transparent"
                  )}
                />
              </div>

              {isHeld ? (
                <Rewrite
                  state={state}
                  writing={writing}
                  agentName={agentName}
                  draft={draft}
                  onKeepYours={onKeepYours}
                  onUseAgent={onUseAgent ? () => onUseAgent(draft) : undefined}
                  onMerge={onMerge ? () => onMerge(block.text) : undefined}
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Rewrite({
  state,
  writing,
  agentName,
  draft,
  onKeepYours,
  onUseAgent,
  onMerge,
}: {
  state: RewriteState
  writing: boolean
  agentName: string
  draft: string
  onKeepYours?: () => void
  onUseAgent?: () => void
  onMerge?: () => void
}) {
  return (
    <div
      data-slot="agent-cursor-rewrite"
      className="mt-1 flex animate-in flex-col gap-1.5 rounded-lg bg-muted px-2.5 py-2 duration-150 fade-in motion-reduce:animate-none"
    >
      <p
        data-conflict={state === "conflict" || undefined}
        className="text-xs text-muted-foreground data-conflict:text-destructive"
      >
        {state === "conflict"
          ? `You changed this after ${agentName} started`
          : state === "writing"
            ? `${agentName} is rewriting this`
            : `${agentName}'s rewrite`}
      </p>
      <p
        className={cn(
          docText,
          "px-0.5 whitespace-pre-wrap",
          state === "conflict" && "text-muted-foreground"
        )}
      >
        {draft}
        {writing ? (
          <span
            aria-hidden
            data-slot="agent-cursor-caret"
            className="ms-px inline-block h-[1.1em] w-0.5 translate-y-[0.2em] rounded-full bg-live"
          />
        ) : null}
      </p>

      {state === "ready" && (onKeepYours || onUseAgent) ? (
        <div className="flex items-center justify-end gap-1.5">
          {onKeepYours ? (
            <Button variant="ghost" onClick={onKeepYours}>
              Discard
            </Button>
          ) : null}
          {onUseAgent ? (
            <Button data-slot="agent-cursor-replace" onClick={onUseAgent}>
              Replace
            </Button>
          ) : null}
        </div>
      ) : null}

      {state === "conflict" ? (
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {onKeepYours ? (
            <Button variant="ghost" onClick={onKeepYours}>
              Keep yours
            </Button>
          ) : null}
          {onUseAgent && !writing ? (
            <Button variant="ghost" onClick={onUseAgent}>
              Use {agentName}&apos;s
            </Button>
          ) : null}
          {onMerge ? (
            <Button data-slot="agent-cursor-merge" onClick={onMerge}>
              Merge
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { AgentCursor }
export type { DocBlock, RewriteState }
