"use client"

import * as React from "react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/aiellie/components/composer"
import { EffortMenu } from "@/registry/aiellie/components/effort-menu"

export default function InComposer() {
  const [effort, setEffort] = React.useState("medium")

  return (
    <Composer onSubmit={() => {}} className="max-w-md">
      <ComposerInput />
      <ComposerFooter>
        <EffortMenu
          value={effort}
          onValueChange={setEffort}
          className="me-auto"
        />
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}
