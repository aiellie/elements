"use client"

import * as React from "react"
import { FolderLibraryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"

type ProjectOption = {
  id: string
  name: string
}

/**
 * The project rows alone, for a menu of your own, like a submenu of an add
 * menu. A function rather than a component, so a menu's search sees the rows.
 */
function projectSelectorItems({
  projects,
  value,
  onValueChange,
}: {
  projects: ProjectOption[]
  value: string | null
  onValueChange: (value: string | null) => void
}) {
  // Ticked rather than picked, so pressing the current project again takes
  // it off.
  return projects.map((project) => (
    <MenuCheckboxItem
      key={project.id}
      checked={project.id === value}
      onCheckedChange={(checked) => onValueChange(checked ? project.id : null)}
      closeOnClick
    >
      <HugeiconsIcon aria-hidden icon={FolderLibraryIcon} />
      {project.name}
    </MenuCheckboxItem>
  ))
}

function ProjectSelector({
  projects,
  value,
  onValueChange,
  label = "Project",
  placeholder = "Choose a project",
  side,
  align,
  render = <Button variant="ghost" size="sm" />,
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
      </MenuTrigger>
      <MenuContent
        side={side}
        align={align}
        showSearch
        searchPlaceholder="Search projects"
        emptyMessage="No projects match"
        className="min-w-56"
      >
        {projectSelectorItems({ projects, value, onValueChange })}
      </MenuContent>
    </Menu>
  )
}

export { ProjectSelector, projectSelectorItems }
export type { ProjectOption }
