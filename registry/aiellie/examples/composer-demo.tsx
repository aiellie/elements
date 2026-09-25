"use client"

import * as React from "react"
import {
  Attachment01Icon,
  ComputerScreenShareIcon,
  Folder01Icon,
  FolderLibraryIcon,
  Github01Icon,
  GoogleDriveIcon,
  PuzzleIcon,
  SlackIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AddMenu } from "@/registry/aiellie/components/add-menu"
import { BranchesMenu } from "@/registry/aiellie/components/branches-menu"
import { DictateButton } from "@/registry/aiellie/components/dictate-button"
import {
  Composer,
  ComposerFooter,
  ComposerHeader,
  ComposerInput,
  ComposerSubmit,
  type ComposerStatus,
} from "@/registry/aiellie/components/composer"
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from "@/registry/aiellie/components/menu"
import { ModelSelector } from "@/registry/aiellie/components/model-selector"
import {
  PluginChips,
  PluginSelectorItems,
  type PluginOption,
} from "@/registry/aiellie/components/plugin-selector"
import {
  ProjectSelector,
  projectSelectorItems,
  type ProjectOption,
} from "@/registry/aiellie/components/project-selector"
import { WorkInMenu } from "@/registry/aiellie/components/work-in-menu"
import { MODELS } from "@/registry/aiellie/lib/models"
import { Button } from "@/registry/aiellie/ui/button"

const PROJECTS: ProjectOption[] = [
  { id: "website", name: "Website redesign" },
  { id: "planning", name: "Q3 planning" },
]

const PLUGINS: PluginOption[] = [
  { id: "github", name: "GitHub", icon: Github01Icon },
  { id: "drive", name: "Google Drive", icon: GoogleDriveIcon },
  { id: "slack", name: "Slack", icon: SlackIcon },
]

const trayButton = (
  <Button
    variant="ghost"
    size="sm"
    className="hover:bg-background aria-expanded:bg-background dark:hover:bg-background/60 dark:aria-expanded:bg-background/60"
  />
)

export default function ComposerDemo() {
  const [value, setValue] = React.useState("")
  const [model, setModel] = React.useState(MODELS[0].id)
  const [project, setProject] = React.useState<string | null>("website")
  // Kept while the tray folds away, so it doesn't empty before it closes.
  const [shownProject, setShownProject] = React.useState(project)
  if (project !== null && project !== shownProject) setShownProject(project)
  const [plugins, setPlugins] = React.useState<string[]>(["github"])
  const [workIn, setWorkIn] = React.useState("local")
  const [branches, setBranches] = React.useState(["main", "feat/tray"])
  const [branch, setBranch] = React.useState("main")
  const [status, setStatus] = React.useState<ComposerStatus>("ready")
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  return (
    <div className="flex w-full max-w-md flex-col">
      <ComposerHeader open={project !== null}>
        {shownProject ? (
          <ProjectSelector
            projects={PROJECTS}
            value={shownProject}
            onValueChange={setProject}
            render={trayButton}
          />
        ) : null}
        <WorkInMenu
          value={workIn}
          onValueChange={setWorkIn}
          onConnect={() => {}}
          render={trayButton}
        />
        <BranchesMenu
          branches={branches}
          value={branch}
          onValueChange={setBranch}
          onCreate={(name) => {
            setBranches((all) => [name, ...all])
            setBranch(name)
          }}
          render={trayButton}
        />
      </ComposerHeader>
      <Composer
        value={value}
        onValueChange={setValue}
        status={status}
        onSubmit={() => {
          setStatus("streaming")
          timer.current = setTimeout(() => setStatus("ready"), 2500)
        }}
        onStop={() => {
          if (timer.current) clearTimeout(timer.current)
          setStatus("ready")
        }}
      >
        <PluginChips
          plugins={PLUGINS}
          value={plugins}
          onValueChange={setPlugins}
          className="px-1 pt-1"
        />
        <ComposerInput />
        <ComposerFooter>
          <AddMenu className="me-auto">
            <MenuGroup>
              <MenuGroupLabel>Attach</MenuGroupLabel>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
                Upload files
              </MenuItem>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={Folder01Icon} />
                Upload folder
              </MenuItem>
              <MenuItem>
                <HugeiconsIcon aria-hidden icon={ComputerScreenShareIcon} />
                Take screenshot
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Connect</MenuGroupLabel>
              <MenuSub>
                <MenuSubTrigger>
                  <HugeiconsIcon aria-hidden icon={FolderLibraryIcon} />
                  Projects
                </MenuSubTrigger>
                <MenuSubContent
                  showSearch
                  searchPlaceholder="Search projects"
                  emptyMessage="No projects match"
                  className="min-w-56"
                >
                  {projectSelectorItems({
                    projects: PROJECTS,
                    value: project,
                    onValueChange: setProject,
                  })}
                </MenuSubContent>
              </MenuSub>
              <MenuSub>
                <MenuSubTrigger>
                  <HugeiconsIcon aria-hidden icon={PuzzleIcon} />
                  Plugins
                </MenuSubTrigger>
                <MenuSubContent className="min-w-48">
                  <PluginSelectorItems
                    plugins={PLUGINS}
                    value={plugins}
                    onValueChange={setPlugins}
                  />
                </MenuSubContent>
              </MenuSub>
            </MenuGroup>
          </AddMenu>
          <ModelSelector
            models={MODELS}
            value={model}
            onValueChange={setModel}
            side="top"
            render={<Button variant="ghost" size="sm" />}
          />
          <DictateButton value={value} onValueChange={setValue} />
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
    </div>
  )
}
