"use client"

import * as React from "react"
import { Attachment01Icon, FolderLibraryIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AddMenu } from "@/registry/aiellie/components/add-menu"
import {
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from "@/registry/aiellie/ui/menu"
import {
  projectSelectorItems,
  type ProjectOption,
} from "@/registry/aiellie/components/project-selector"

const PROJECTS: ProjectOption[] = [
  { id: "website", name: "Website redesign" },
  { id: "planning", name: "Q3 planning" },
]

export default function Submenu() {
  const [project, setProject] = React.useState<string | null>(null)

  return (
    <div className="flex items-center gap-3">
      <AddMenu side="bottom">
        <MenuItem>
          <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
          Upload files
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <HugeiconsIcon aria-hidden icon={FolderLibraryIcon} />
            Add to project
          </MenuSubTrigger>
          <MenuSubContent>
            {projectSelectorItems({
              projects: PROJECTS,
              value: project,
              onValueChange: setProject,
            })}
          </MenuSubContent>
        </MenuSub>
      </AddMenu>
      <span className="text-sm text-muted-foreground">
        {PROJECTS.find((each) => each.id === project)?.name ?? "No project"}
      </span>
    </div>
  )
}
