"use client"

import * as React from "react"
import { Cancel01Icon, FolderLibraryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { Button } from "@/registry/aiellie/ui/button"
import { cn } from "@/lib/utils"

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
  removeLabel = "Remove project",
  side,
  align,
  className,
}: {
  projects: ProjectOption[]
  /** Null when the chat has no project. */
  value: string | null
  onValueChange: (value: string | null) => void
  /** What is being chosen, read out ahead of the project's name. */
  label?: string
  placeholder?: string
  removeLabel?: string
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
  /** Set the hover fill here when the selector sits on a fill of its own. */
  className?: string
}) {
  const selected = projects.find((project) => project.id === value)

  return (
    <div
      data-slot="project-selector"
      className={cn(
        "group/project inline-flex h-7 items-center rounded-[min(var(--radius-md),12px)] transition-colors hover:bg-muted has-aria-expanded:bg-muted motion-reduce:transition-none",
        className
      )}
    >
      {/* The mark doubles as the way to take the project off, which only a
          hover or keyboard focus reveals. */}
      {selected ? (
        <TooltipIconButton
          tooltip={removeLabel}
          side="top"
          onClick={() => onValueChange(null)}
          className="group/remove size-7 rounded-[inherit] p-1.5 hover:bg-transparent dark:hover:bg-transparent [&_svg]:text-foreground"
        >
          <HugeiconsIcon
            aria-hidden
            icon={FolderLibraryIcon}
            className="group-hover/project:hidden group-focus-visible/remove:hidden"
          />
          <HugeiconsIcon
            aria-hidden
            icon={Cancel01Icon}
            className="hidden group-hover/project:block group-focus-visible/remove:block"
          />
        </TooltipIconButton>
      ) : (
        <span className="flex size-7 items-center justify-center">
          <HugeiconsIcon
            aria-hidden
            icon={FolderLibraryIcon}
            className="size-4 text-muted-foreground"
          />
        </span>
      )}
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="ps-0.5 hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent"
            />
          }
        >
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
    </div>
  )
}

export { ProjectSelector, projectSelectorItems }
export type { ProjectOption }
