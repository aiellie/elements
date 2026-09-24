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
import { MODELS } from "@/registry/aiellie/lib/models"
import { Button } from "@/registry/aiellie/ui/button"

export default function ComposerDemo() {
  const [model, setModel] = React.useState("claude-opus")
  const [status, setStatus] = React.useState<ComposerStatus>("ready")
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  return (
    <Composer
      status={status}
      onSubmit={() => {
        setStatus("streaming")
        timer.current = setTimeout(() => setStatus("ready"), 2500)
      }}
      onStop={() => {
        if (timer.current) clearTimeout(timer.current)
        setStatus("ready")
      }}
      className="max-w-md"
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
          <MenuItem>
            <HugeiconsIcon aria-hidden icon={Camera01Icon} />
            Take a photo
          </MenuItem>
        </AddMenu>
        <ModelSelector
          models={MODELS}
          value={model}
          onValueChange={setModel}
          side="top"
          render={<Button variant="ghost" size="sm" />}
        />
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}
