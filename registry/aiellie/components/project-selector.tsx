"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  Cancel01Icon,
  FolderLibraryIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"

type ProjectOption = {
  id: string
  name: string
}

/** The project rows alone, for a menu of your own, like a submenu of an add menu. */
function ProjectSelectorItems({
  projects,
  value,
  onValueChange,
}: {
  projects: ProjectOption[]
  value: string | null
  onValueChange: (value: string | null) => void
}) {
  return (
    <MenuRadioGroup
      value={value ?? ""}
      onValueChange={(next: string) => onValueChange(next)}
    >
      {projects.map((project) => (
        <MenuRadioItem key={project.id} value={project.id} closeOnClick>
          <HugeiconsIcon aria-hidden icon={FolderLibraryIcon} />
          {project.name}
        </MenuRadioItem>
      ))}
    </MenuRadioGroup>
  )
}

function ProjectSelector({
  projects,
  value,
  onValueChange,
  label = "Project",
  placeholder = "Choose a project",
  side,
  align,
  render = <Button variant="outline" size="xs" />,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children" | "value"> & {
  projects: ProjectOption[]
  /** Null when the chat has no project. */
  value: string | null
  onValueChange: (value: string | null) => void
  /** What is being chosen, read out ahead of the project's name. */
  label?: string
  placeholder?: string
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  const selected = projects.find((project) => project.id === value)

  return (
    <Menu>
      <MenuTrigger data-slot="project-selector" render={render} {...props}>
        <HugeiconsIcon aria-hidden icon={FolderLibraryIcon} />
        <span className="sr-only">{label}: </span>
        {selected ? selected.name : placeholder}
        <HugeiconsIcon
          aria-hidden
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="transition-transform duration-150 group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
        />
      </MenuTrigger>
      <MenuContent side={side} align={align} className="min-w-48">
        <MenuGroup>
          <MenuGroupLabel>Projects</MenuGroupLabel>
          <ProjectSelectorItems
            projects={projects}
            value={value}
            onValueChange={onValueChange}
          />
        </MenuGroup>
        {value ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={() => onValueChange(null)}>
              <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
              Remove project
            </MenuItem>
          </>
        ) : null}
      </MenuContent>
    </Menu>
  )
}

export { ProjectSelector, ProjectSelectorItems }
export type { ProjectOption }
