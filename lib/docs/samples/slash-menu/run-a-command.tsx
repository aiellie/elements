"use client"

import * as React from "react"
import { Delete02Icon, TextAlignLeftIcon } from "@hugeicons/core-free-icons"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/aiellie/components/composer"
import {
  SlashMenu,
  type SlashCommand,
} from "@/registry/aiellie/components/slash-menu"

const COMMANDS: SlashCommand[] = [
  { id: "clear", description: "Start a new chat", icon: Delete02Icon },
  {
    id: "summarize",
    description: "Sum up the thread",
    icon: TextAlignLeftIcon,
  },
]

export default function RunACommand() {
  const [value, setValue] = React.useState("")
  const [ran, setRan] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-3 pt-24">
      <Composer value={value} onValueChange={setValue} onSubmit={() => {}}>
        <SlashMenu
          commands={COMMANDS}
          onSelect={(command) => {
            setRan(command.id)
            setValue("")
          }}
        >
          <ComposerInput placeholder="Type /clear or /summarize" />
        </SlashMenu>
        <ComposerFooter>
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
      <p className="text-xs text-muted-foreground">
        {ran ? `Ran /${ran}.` : "Pick a command to run it straight away."}
      </p>
    </div>
  )
}
