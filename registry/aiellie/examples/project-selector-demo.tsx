"use client"

import * as React from "react"

import {
  ProjectSelector,
  type ProjectOption,
} from "@/registry/aiellie/components/project-selector"

const PROJECTS: ProjectOption[] = [
  { id: "website", name: "Website redesign" },
  { id: "planning", name: "Q3 planning" },
  { id: "onboarding", name: "Onboarding docs" },
]

export default function ProjectSelectorDemo() {
  const [project, setProject] = React.useState<string | null>("website")

  return (
    <ProjectSelector
      projects={PROJECTS}
      value={project}
      onValueChange={setProject}
    />
  )
}
