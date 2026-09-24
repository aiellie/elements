"use client"

import * as React from "react"
import {
  Attachment01Icon,
  Folder01Icon,
  FolderLibraryIcon,
  Image01Icon,
  PuzzleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ChatAttachments,
  toAttachments,
  type ChatAttachment,
} from "@/registry/aiellie/blocks/chat/components/chat-attachments"
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
  inputRef?: React.Ref<HTMLTextAreaElement>
}) {
  const [attachments, setAttachments] = React.useState<ChatAttachment[]>([])
  const filesInput = React.useRef<HTMLInputElement>(null)
  const photosInput = React.useRef<HTMLInputElement>(null)
  const folderInput = React.useRef<HTMLInputElement>(null)

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
      <input
        ref={photosInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={pick}
      />
      {/* React has no prop for picking a folder, so the attribute goes in as is. */}
      <input
        ref={folderInput}
        type="file"
        hidden
        onChange={pick}
        {...{ webkitdirectory: "" }}
      />
      {project || activePlugins.length > 0 ? (
        <ComposerHeader>
          {project ? (
            <ProjectSelector
              projects={projects}
              value={project}
              onValueChange={onProjectChange}
              render={trayButton}
            />
          ) : null}
          {activePlugins.length > 0 ? (
            <PluginSelector
              plugins={plugins}
              value={activePlugins}
              onValueChange={onPluginsChange}
              render={trayButton}
            />
          ) : null}
        </ComposerHeader>
      ) : null}
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
        <ChatAttachments attachments={attachments} onRemove={remove} />
        <ComposerInput ref={inputRef} />
        <ComposerFooter>
          <AddMenu className="me-auto">
            <MenuItem onClick={() => filesInput.current?.click()}>
              <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
              Upload files
            </MenuItem>
            <MenuItem onClick={() => folderInput.current?.click()}>
              <HugeiconsIcon aria-hidden icon={Folder01Icon} />
              Upload folder
            </MenuItem>
            <MenuItem onClick={() => photosInput.current?.click()}>
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
                    projects={projects}
                    value={project}
                    onValueChange={onProjectChange}
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
