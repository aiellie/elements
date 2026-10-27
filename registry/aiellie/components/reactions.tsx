"use client"

import * as React from "react"
import { SmileIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"

type Reaction = {
  emoji: string
  count: number
  /** Whether you are one of the count. */
  reacted?: boolean
  /** Who else reacted, for the tooltip. */
  people?: readonly string[]
}

function describeReaction({ emoji, count, reacted, people }: Reaction) {
  if (people?.length) {
    return `${[...(reacted ? ["You"] : []), ...people].join(", ")} reacted with ${emoji}`
  }
  if (!reacted) return `${count} reacted with ${emoji}`
  if (count === 1) return `You reacted with ${emoji}`
  return `You and ${count - 1} ${count === 2 ? "other" : "others"} reacted with ${emoji}`
}

/** The list with one emoji added or taken back, as pressing it should leave it. */
function toggleReaction(
  reactions: readonly Reaction[],
  emoji: string
): Reaction[] {
  const existing = reactions.find((reaction) => reaction.emoji === emoji)
  if (!existing) return [...reactions, { emoji, count: 1, reacted: true }]
  const count = existing.count + (existing.reacted ? -1 : 1)
  if (count <= 0) return reactions.filter((reaction) => reaction !== existing)
  return reactions.map((reaction) =>
    reaction === existing
      ? { ...reaction, count, reacted: !reaction.reacted }
      : reaction
  )
}

const reactionChip =
  "flex h-6 cursor-pointer items-center gap-1 rounded-full border border-border/60 bg-background px-2 text-xs transition-[background-color,border-color,scale] duration-80 outline-none select-none hover:bg-muted focus-visible:border-ring active:scale-95 motion-reduce:transition-none"

function Reactions({
  reactions,
  onToggle,
  onAdd,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "onToggle"> & {
  reactions: readonly Reaction[]
  onToggle?: (emoji: string) => void
  /** Adds a button at the end for an emoji that isn't on the row yet. */
  onAdd?: () => void
}) {
  if (reactions.length === 0 && !onAdd) return null

  return (
    <TooltipProvider>
      <div
        data-slot="reactions"
        role="group"
        aria-label="Reactions"
        className={cn("flex flex-wrap items-center gap-1", className)}
        {...props}
      >
        {reactions.map((reaction) => (
          <Tooltip key={reaction.emoji}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  data-slot="reaction"
                  data-reacted={reaction.reacted || undefined}
                  aria-pressed={Boolean(reaction.reacted)}
                  aria-label={describeReaction(reaction)}
                  onClick={() => onToggle?.(reaction.emoji)}
                  className={cn(
                    reactionChip,
                    "group data-reacted:border-live/20 data-reacted:bg-live/4 data-reacted:hover:bg-live/7 dark:data-reacted:bg-live/10 dark:data-reacted:hover:bg-live/15"
                  )}
                />
              }
            >
              <span aria-hidden>{reaction.emoji}</span>
              <span
                aria-hidden
                className="text-muted-foreground tabular-nums group-data-reacted:text-live"
              >
                {reaction.count}
              </span>
            </TooltipTrigger>
            <TooltipContent>{describeReaction(reaction)}</TooltipContent>
          </Tooltip>
        ))}
        {onAdd ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  data-slot="reactions-add"
                  onClick={onAdd}
                  className={cn(
                    reactionChip,
                    "w-7 justify-center px-0 text-muted-foreground hover:text-foreground"
                  )}
                />
              }
            >
              <HugeiconsIcon
                aria-hidden
                icon={SmileIcon}
                className="size-3.5"
              />
              <span className="sr-only">Add a reaction</span>
            </TooltipTrigger>
            <TooltipContent>Add a reaction</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </TooltipProvider>
  )
}

export { Reactions, toggleReaction }
export type { Reaction }
