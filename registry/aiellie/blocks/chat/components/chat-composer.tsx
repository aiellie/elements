"use client"

import * as React from "react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
  type ComposerStatus,
} from "@/registry/aiellie/components/composer"
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
