"use client"

import * as React from "react"
import {
  Attachment01Icon,
  ComputerScreenShareIcon,
  Folder01Icon,
  FolderLibraryIcon,
  PuzzleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatAttachments,
  toAttachments,
  type ChatAttachment,
} from "@/registry/aiellie/blocks/chat/components/chat-attachments"
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
import type { ModelOption } from "@/registry/aiellie/lib/models"
import { Button } from "@/registry/aiellie/ui/button"

// Ghost buttons, lifted onto the page's ground on hover, since the tray is
// already the muted fill a ghost button hovers to.
const trayButton = (
  <Button
    variant="ghost"
    size="sm"
    className="hover:bg-background aria-expanded:bg-background dark:hover:bg-background/60 dark:aria-expanded:bg-background/60"
  />
)

// Asks to share a screen, window or tab, keeps one frame of it, and stops
// sharing straight away. Null when sharing is refused or not supported.
async function takeScreenshot(): Promise<File | null> {
  if (!navigator.mediaDevices?.getDisplayMedia) return null

  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
  } catch {
    return null
  }

  try {
    const video = document.createElement("video")
    video.srcObject = stream
    video.muted = true
    await video.play()

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d")?.drawImage(video, 0, 0)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    )
    if (!blob) return null

    const stamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " at ")
      .replaceAll(":", ".")
    return new File([blob], `Screenshot ${stamp}.png`, { type: "image/png" })
  } finally {
    stream.getTracks().forEach((track) => track.stop())
  }
}

function ChatComposer({
  value,
  onValueChange,
  onSend,
  onStop,
  status,
  models,
  model,
  onModelChange,
  projects,
  project,
  onProjectChange,
  plugins,
  activePlugins,
  onPluginsChange,
  workIn,
  onWorkInChange,
  branches,
  branch,
  onBranchChange,
  onBranchCreate,
  inputRef,
}: {
  value: string
  onValueChange: (value: string) => void
  /** The text is empty when only files are sent. */
  onSend: (text: string, attachments: ChatAttachment[]) => void
  onStop: () => void
  status: ComposerStatus
  models: ModelOption[]
  model: string
  onModelChange: (model: string) => void
  projects: ProjectOption[]
  project: string | null
  onProjectChange: (project: string | null) => void
  plugins: PluginOption[]
  /** The ids of the plugins turned on. */
  activePlugins: string[]
  onPluginsChange: (plugins: string[]) => void
  workIn: string
  onWorkInChange: (workIn: string) => void
  branches: string[]
  branch: string
  onBranchChange: (branch: string) => void
  onBranchCreate: (name: string) => void
  inputRef?: React.Ref<HTMLTextAreaElement>
}) {
  const [attachments, setAttachments] = React.useState<ChatAttachment[]>([])
  const filesInput = React.useRef<HTMLInputElement>(null)
  const folderInput = React.useRef<HTMLInputElement>(null)

  // The last project stays in the tray while it folds away, so it doesn't
  // empty before it closes.
  const [shownProject, setShownProject] = React.useState(project)
  if (project !== null && project !== shownProject) setShownProject(project)

  const add = (files: File[]) =>
    setAttachments((current) => [...current, ...toAttachments(files)])

  const remove = (id: string) =>
    setAttachments((current) =>
      current.filter((attachment) => {
        if (attachment.id !== id) return true
        if (attachment.url) URL.revokeObjectURL(attachment.url)
        return false
      })
    )

  const pick = (event: React.ChangeEvent<HTMLInputElement>) => {
    add(Array.from(event.target.files ?? []))
    // Cleared so picking the same file again still counts as a change.
    event.target.value = ""
  }

  return (
    <div className="mx-auto w-full max-w-2xl shrink-0 px-4 pb-4">
      <input ref={filesInput} type="file" multiple hidden onChange={pick} />
      {/* React has no prop for picking a folder, so the attribute goes in as is. */}
      <input
        ref={folderInput}
        type="file"
        hidden
        onChange={pick}
        {...{ webkitdirectory: "" }}
      />
      <ComposerHeader open={project !== null}>
        {shownProject ? (
          <>
            <ProjectSelector
              projects={projects}
              value={shownProject}
              onValueChange={onProjectChange}
              className="hover:bg-background has-aria-expanded:bg-background dark:hover:bg-background/60 dark:has-aria-expanded:bg-background/60"
            />
            <WorkInMenu
              value={workIn}
              onValueChange={onWorkInChange}
              // A placeholder: the preview has no account to link.
              onConnect={() => {}}
              render={trayButton}
            />
            <BranchesMenu
              branches={branches}
              value={branch}
              onValueChange={onBranchChange}
              onCreate={onBranchCreate}
              render={trayButton}
            />
          </>
        ) : null}
      </ComposerHeader>
      <Composer
        value={value}
        onValueChange={onValueChange}
        onSubmit={(text) => {
          onSend(text, attachments)
          setAttachments([])
        }}
        onStop={onStop}
        status={status}
        hasAttachments={attachments.length > 0}
        onFilesAdd={add}
      >
        <PluginChips
          plugins={plugins}
          value={activePlugins}
          onValueChange={onPluginsChange}
          className="px-1 pt-1"
        />
        <ChatAttachments attachments={attachments} onRemove={remove} />
        <ComposerInput ref={inputRef} />
        <ComposerFooter>
          <AddMenu className="me-auto">
            <MenuGroup>
              <MenuGroupLabel>Attach</MenuGroupLabel>
              <MenuItem onClick={() => filesInput.current?.click()}>
                <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
                Upload files
              </MenuItem>
              <MenuItem onClick={() => folderInput.current?.click()}>
                <HugeiconsIcon aria-hidden icon={Folder01Icon} />
                Upload folder
              </MenuItem>
              <MenuItem
                onClick={async () => {
                  const screenshot = await takeScreenshot()
                  if (screenshot) add([screenshot])
                }}
              >
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
                    projects,
                    value: project,
                    onValueChange: onProjectChange,
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
                    plugins={plugins}
                    value={activePlugins}
                    onValueChange={onPluginsChange}
                  />
                </MenuSubContent>
              </MenuSub>
            </MenuGroup>
          </AddMenu>
          <ModelSelector
            models={models}
            value={model}
            onValueChange={onModelChange}
            side="top"
            render={<Button variant="ghost" size="sm" />}
          />
          <DictateButton value={value} onValueChange={onValueChange} />
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
    </div>
  )
}

export { ChatComposer }
