"use client"

import * as React from "react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
  type ComposerStatus,
} from "@/registry/aiellie/components/composer"

/**
 * Sending pretends a reply is on its way for a couple of seconds, so the send
 * button can be seen turning into stop and back again.
 */
export default function ComposerDemo() {
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
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}
