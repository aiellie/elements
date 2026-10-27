"use client"

import * as React from "react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
  type ComposerStatus,
} from "@/registry/aiellie/components/composer"

export default function Stop() {
  const [status, setStatus] = React.useState<ComposerStatus>("ready")
  const [last, setLast] = React.useState<string | null>(null)
  const timer = React.useRef<number>(undefined)

  const stop = () => {
    window.clearTimeout(timer.current)
    setStatus("ready")
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Composer
        status={status}
        onStop={stop}
        onSubmit={(text) => {
          setLast(text)
          setStatus("streaming")
          timer.current = window.setTimeout(() => setStatus("ready"), 4000)
        }}
      >
        <ComposerInput />
        <ComposerFooter>
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
      <p className="text-caption text-muted-foreground">
        {status === "streaming"
          ? `Replying to “${last}”. Press stop to cut it short.`
          : "Send something, then stop the reply."}
      </p>
    </div>
  )
}
