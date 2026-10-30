"use client"

import * as React from "react"
import { Slider } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/aiellie/ui/popover"

type EffortOption = {
  id: string
  name: string
  /** What the level is for, shown while it's chosen. */
  description: string
}

// The AI SDK's own reasoning levels, so the chosen id can be handed straight
// to `streamText({ reasoning })`.
const EFFORT_OPTIONS: EffortOption[] = [
  {
    id: "none",
    name: "Off",
    description: "Answers straight away, without thinking first.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A glance before answering. For lookups and rewording.",
  },
  {
    id: "low",
    name: "Low",
    description: "A little thought. For quick questions with one step.",
  },
  {
    id: "medium",
    name: "Medium",
    description: "A moment's thought first. Right for most questions.",
  },
  {
    id: "high",
    name: "High",
    description: "Works the problem through before writing the answer.",
  },
  {
    id: "xhigh",
    name: "Max",
    description:
      "Everything the model has. Slower, for when being wrong costs more.",
  },
]

function EffortBars({
  level,
  count,
  className,
}: {
  /** How many bars are filled, from 0. */
  level: number
  count: number
  className?: string
}) {
  const bars = Math.max(1, count - 1)

  return (
    <span
      aria-hidden
      data-slot="effort-bars"
      className={cn("flex h-3.5 items-end gap-0.5", className)}
    >
      {Array.from({ length: bars }, (_, index) => (
        <span
          key={index}
          style={{ height: `${((index + 1) / bars) * 100}%` }}
          className={cn(
            "w-0.75 rounded-full bg-current/25 transition-colors duration-150 motion-reduce:transition-none",
            index < level && "bg-current"
          )}
        />
      ))}
    </span>
  )
}

function EffortMenu({
  options = EFFORT_OPTIONS,
  value,
  onValueChange,
  label = "Effort",
  side = "top",
  align = "start",
  render = <Button variant="ghost" size="sm" />,
  ...props
}: Omit<React.ComponentProps<typeof PopoverTrigger>, "children" | "value"> & {
  options?: EffortOption[]
  value: string
  onValueChange: (value: string) => void
  /** What is being chosen, read out ahead of the level's name. */
  label?: string
  side?: React.ComponentProps<typeof PopoverContent>["side"]
  align?: React.ComponentProps<typeof PopoverContent>["align"]
}) {
  const found = options.findIndex((option) => option.id === value)
  const index = Math.max(0, found)
  const selected = options[index]

  return (
    <Popover>
      <PopoverTrigger data-slot="effort-menu" render={render} {...props}>
        <EffortBars level={index} count={options.length} />
        <span className="sr-only">{label}: </span>
      </PopoverTrigger>
      <PopoverContent
        data-slot="effort-menu-content"
        side={side}
        align={align}
        sideOffset={6}
        className="w-64 gap-3 p-3"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-medium">{label}</span>
          <span className="text-xs">{selected?.name}</span>
        </div>
        <Slider.Root
          value={index}
          min={0}
          max={options.length - 1}
          step={1}
          onValueChange={(next) => {
            const option = options[next as number]
            if (option) onValueChange(option.id)
          }}
          className="flex flex-col gap-1.5"
        >
          <Slider.Control className="relative flex h-5 w-full touch-none items-center select-none">
            <Slider.Track className="relative h-1 w-full rounded-full bg-muted">
              <Slider.Indicator className="rounded-full bg-foreground" />
              {options.map((option, at) => (
                <span
                  key={option.id}
                  aria-hidden
                  style={{
                    insetInlineStart: `${(at / (options.length - 1)) * 100}%`,
                  }}
                  className={cn(
                    "absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/40 rtl:translate-x-1/2",
                    at <= index && "bg-background/60"
                  )}
                />
              ))}
              <Slider.Thumb
                getAriaValueText={(_, next) => options[next]?.name ?? ""}
                aria-label={label}
                className="size-3.5 rounded-full border border-border bg-background shadow-md outline-none has-[:focus-visible]:border-ring"
              />
            </Slider.Track>
          </Slider.Control>
          <div
            aria-hidden
            className="flex justify-between text-[0.6875rem] text-muted-foreground"
          >
            <span>{options[0]?.name}</span>
            <span>{options.at(-1)?.name}</span>
          </div>
        </Slider.Root>
        <p className="text-xs text-foreground">{selected?.description}</p>
      </PopoverContent>
    </Popover>
  )
}

export { EFFORT_OPTIONS, EffortBars, EffortMenu }
export type { EffortOption }
