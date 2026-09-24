"use client"

import * as React from "react"
import {
  Attachment01Icon,
  FolderLibraryIcon,
  Github01Icon,
  GoogleDriveIcon,
  Image01Icon,
  PuzzleIcon,
  SlackIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AddMenu } from "@/registry/aiellie/components/add-menu"
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
  PluginSelector,
  PluginSelectorItems,
  type PluginOption,
} from "@/registry/aiellie/components/plugin-selector"
import {
  ProjectSelector,
  ProjectSelectorItems,
  type ProjectOption,
} from "@/registry/aiellie/components/project-selector"
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
  const [model, setModel] = React.useState("claude-opus")
  const [project, setProject] = React.useState<string | null>("website")
  const [plugins, setPlugins] = React.useState<string[]>([])
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
      {project || plugins.length > 0 ? (
        <ComposerHeader>
          {project ? (
            <ProjectSelector
              projects={PROJECTS}
              value={project}
              onValueChange={setProject}
              render={trayButton}
            />
          ) : null}
          {plugins.length > 0 ? (
            <PluginSelector
              plugins={PLUGINS}
              value={plugins}
              onValueChange={setPlugins}
              render={trayButton}
            />
          ) : null}
        </ComposerHeader>
      ) : null}
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
        <ComposerInput />
        <ComposerFooter>
          <AddMenu className="me-auto">
            <MenuItem>
              <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
              Upload files
            </MenuItem>
            <MenuItem>
              <HugeiconsIcon aria-hidden icon={Image01Icon} />
              Add photos
            </MenuItem>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>Connect</MenuGroupLabel>
              <MenuSub>
                <MenuSubTrigger>
                  <HugeiconsIcon aria-hidden icon={FolderLibraryIcon} />
                  Projects
                </MenuSubTrigger>
                <MenuSubContent className="min-w-48">
                  <ProjectSelectorItems
                    projects={PROJECTS}
                    value={project}
                    onValueChange={setProject}
                  />
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
