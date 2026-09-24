"use client"

import * as React from "react"
import {
  CloudIcon,
  GitForkIcon,
  LaptopAddIcon,
  LaptopIcon,
  Link04Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"

type WorkInOption = {
  id: string
  name: string
  icon: IconSvgElement
}

// A list to start from. Pass your own to rename or reorder them.
const WORK_IN_OPTIONS: WorkInOption[] = [
  { id: "local", name: "Local", icon: LaptopIcon },
  { id: "new-local", name: "New local", icon: LaptopAddIcon },
  { id: "worktree", name: "Worktree", icon: GitForkIcon },
  { id: "cloud", name: "Cloud", icon: CloudIcon },
]

function WorkInMenu({
  options = WORK_IN_OPTIONS,
  value,
  onValueChange,
  onConnect,
  connectLabel = "Connect Claude Code on the web",
  label = "Work in",
  side,
  align,
  render = <Button variant="ghost" size="sm" />,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children" | "value"> & {
  options?: WorkInOption[]
  value: string
  onValueChange: (value: string) => void
  /** Shows a row under the options that links an account. Left out, the row is too. */
  onConnect?: () => void
  connectLabel?: string
  /** What is being chosen, read out ahead of the option's name. */
  label?: string
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  const selected = options.find((option) => option.id === value)

  return (
    <Menu>
      <MenuTrigger data-slot="work-in-menu" render={render} {...props}>
        <HugeiconsIcon aria-hidden icon={selected?.icon ?? LaptopIcon} />
        <span className="sr-only">{label}: </span>
        {selected?.name ?? label}
      </MenuTrigger>
      <MenuContent side={side} align={align} className="min-w-48">
        <MenuRadioGroup
          value={value}
          onValueChange={(next: string) => onValueChange(next)}
        >
          {options.map((option) => (
            <MenuRadioItem key={option.id} value={option.id} closeOnClick>
              <HugeiconsIcon aria-hidden icon={option.icon} />
              {option.name}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
        {onConnect ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={onConnect}>
              <HugeiconsIcon aria-hidden icon={Link04Icon} />
              {connectLabel}
            </MenuItem>
          </>
        ) : null}
      </MenuContent>
    </Menu>
  )
}

export { WORK_IN_OPTIONS, WorkInMenu }
export type { WorkInOption }
