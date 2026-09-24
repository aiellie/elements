"use client"

import * as React from "react"
import {
  Attachment01Icon,
  Camera01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AddMenu } from "@/registry/aiellie/components/add-menu"
import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
  type ComposerStatus,
} from "@/registry/aiellie/components/composer"
import { MenuItem } from "@/registry/aiellie/components/menu"
import { ModelSelector } from "@/registry/aiellie/components/model-selector"
import type { ModelOption } from "@/registry/aiellie/lib/models"
import { Button } from "@/registry/aiellie/ui/button"

function ChatComposer({
  value,
  onValueChange,
  onSend,
  onStop,
  status,
  models,
  model,
  onModelChange,
  inputRef,
}: {
  value: string
  onValueChange: (value: string) => void
  onSend: (text: string) => void
  onStop: () => void
  status: ComposerStatus
  models: ModelOption[]
  model: string
  onModelChange: (model: string) => void
  inputRef?: React.Ref<HTMLTextAreaElement>
}) {
  return (
    <div className="mx-auto w-full max-w-2xl shrink-0 px-4 pb-4">
      <Composer
        value={value}
        onValueChange={onValueChange}
        onSubmit={onSend}
        onStop={onStop}
        status={status}
      >
        <ComposerInput ref={inputRef} />
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
            <MenuItem>
              <HugeiconsIcon aria-hidden icon={Camera01Icon} />
              Take a photo
            </MenuItem>
          </AddMenu>
          <ModelSelector
            models={models}
            value={model}
            onValueChange={onModelChange}
            side="top"
            render={<Button variant="ghost" size="sm" />}
          />
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
    </div>
  )
}

export { ChatComposer }
