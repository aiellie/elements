"use client"

import * as React from "react"
import {
  AiMagicIcon,
  PencilEdit02Icon,
  SquareUnlock01Icon,
  TaskDaily01Icon,
  Touch01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"

type ApprovalMode = {
  id: string
  name: string
  /** What the agent may do without asking, under the name. */
  description: string
  icon: IconSvgElement
  /** Set apart under a rule and in the destructive ink, for a mode that never asks. */
  destructive?: boolean
}

// A list to start from. Pass your own to rename, reorder or drop modes.
const APPROVAL_MODES: ApprovalMode[] = [
  {
    id: "auto",
    name: "Auto",
    description: "Decides for itself, and asks when an action looks risky.",
    icon: AiMagicIcon,
  },
  {
    id: "manual",
    name: "Manual",
    description: "Asks before every action.",
    icon: Touch01Icon,
  },
  {
    id: "accept-edits",
    name: "Accept edits",
    description: "Edits files without asking. Everything else still asks.",
    icon: PencilEdit02Icon,
  },
  {
    id: "plan",
    name: "Plan",
    description: "Reads and proposes, and changes nothing until you agree.",
    icon: TaskDaily01Icon,
  },
  {
    id: "full-access",
    name: "Full access",
    description: "Never asks. Every command and edit runs unattended.",
    icon: SquareUnlock01Icon,
    destructive: true,
  },
]

function ApprovalModeItem({ mode }: { mode: ApprovalMode }) {
  return (
    <MenuRadioItem
      value={mode.id}
      closeOnClick
      className={cn(
        "items-start py-2",
        mode.destructive &&
          "text-destructive data-highlighted:bg-destructive/5 data-highlighted:text-destructive dark:data-highlighted:bg-destructive/15"
      )}
    >
      <HugeiconsIcon aria-hidden icon={mode.icon} className="mt-px shrink-0" />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span>{mode.name}</span>
        <span className="font-normal text-foreground/70">
          {mode.description}
        </span>
      </span>
    </MenuRadioItem>
  )
}

function ApprovalModeMenu({
  modes = APPROVAL_MODES,
  value,
  onValueChange,
  label = "Approvals",
  side,
  align,
  render = <Button variant="ghost" size="sm" />,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children" | "value"> & {
  modes?: ApprovalMode[]
  value: string
  onValueChange: (value: string) => void
  /** What is being chosen, read out ahead of the mode's name. */
  label?: string
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  const selected = modes.find((mode) => mode.id === value)
  const everyday = modes.filter((mode) => !mode.destructive)
  const risky = modes.filter((mode) => mode.destructive)

  return (
    <Menu>
      <MenuTrigger
        data-slot="approval-mode-menu"
        data-destructive={selected?.destructive || undefined}
        render={render}
        className="data-destructive:text-destructive"
        {...props}
      >
        <HugeiconsIcon aria-hidden icon={selected?.icon ?? Touch01Icon} />
        <span className="sr-only">{label}: </span>
        {selected?.name ?? label}
      </MenuTrigger>
      <MenuContent side={side} align={align} className="w-72">
        <MenuRadioGroup
          value={value}
          onValueChange={(next: string) => onValueChange(next)}
        >
          <MenuGroup>
            <MenuGroupLabel>{label}</MenuGroupLabel>
            {everyday.map((mode) => (
              <ApprovalModeItem key={mode.id} mode={mode} />
            ))}
          </MenuGroup>
          {risky.length > 0 ? (
            <>
              <MenuSeparator />
              {risky.map((mode) => (
                <ApprovalModeItem key={mode.id} mode={mode} />
              ))}
            </>
          ) : null}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

export { APPROVAL_MODES, ApprovalModeMenu }
export type { ApprovalMode }
