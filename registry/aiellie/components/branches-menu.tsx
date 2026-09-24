"use client"

import * as React from "react"
import { GitBranchIcon, GitBranchPlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"

function BranchesMenu({
  branches,
  value,
  onValueChange,
  onCreate,
  label = "Branch",
  side,
  align,
  render = <Button variant="ghost" size="sm" />,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children" | "value"> & {
  branches: string[]
  /** The branch checked out. */
  value: string
  onValueChange: (value: string) => void
  /** Called with the name typed into the search, to create that branch and check it out. */
  onCreate: (name: string) => void
  /** What is being chosen, read out ahead of the branch's name. */
  label?: string
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  return (
    <Menu>
      <MenuTrigger data-slot="branches-menu" render={render} {...props}>
        <HugeiconsIcon aria-hidden icon={GitBranchIcon} />
        <span className="sr-only">{label}: </span>
        {value}
      </MenuTrigger>
      <MenuContent
        side={side}
        align={align}
        showSearch
        searchPlaceholder="Search or name a branch"
        emptyMessage="No branches match"
        className="max-h-80 min-w-64"
        footer={(query) => {
          const name = query.trim()
          // An existing name would check out, not create, so it gets no row.
          const taken = branches.includes(name)
          return (
            <MenuItem
              disabled={name === "" || taken}
              onClick={() => onCreate(name)}
            >
              <HugeiconsIcon aria-hidden icon={GitBranchPlusIcon} />
              <span className="truncate">
                {name && !taken
                  ? `Create and check out “${name}”`
                  : "Create and check out new branch"}
              </span>
            </MenuItem>
          )
        }}
      >
        <MenuRadioGroup
          value={value}
          onValueChange={(next: string) => onValueChange(next)}
        >
          {branches.map((branch) => (
            <MenuRadioItem key={branch} value={branch} closeOnClick>
              <HugeiconsIcon aria-hidden icon={GitBranchIcon} />
              <span className="truncate font-mono">{branch}</span>
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

export { BranchesMenu }
