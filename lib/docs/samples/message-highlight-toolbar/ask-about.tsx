"use client"

import * as React from "react"
import { MessageQuestionIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/aiellie/components/composer"
import {
  MessageHighlight,
  MessageHighlightAction,
  MessageHighlightToolbar,
} from "@/registry/aiellie/components/message-highlight-toolbar"

export default function AskAbout() {
  const [draft, setDraft] = React.useState("")

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <MessageHighlight className="pt-10 text-sm leading-6">
        <p>
          Select a phrase, then ask about it. The words go into the composer as
          a quote, ready for a question.
        </p>
        <MessageHighlightToolbar>
          <MessageHighlightAction
            tooltip="Ask about this"
            onAction={(text) => setDraft(`> ${text}\n\n`)}
          >
            <HugeiconsIcon aria-hidden icon={MessageQuestionIcon} />
          </MessageHighlightAction>
        </MessageHighlightToolbar>
      </MessageHighlight>
      <Composer value={draft} onValueChange={setDraft} onSubmit={() => {}}>
        <ComposerInput />
        <ComposerFooter>
          <ComposerSubmit />
        </ComposerFooter>
      </Composer>
    </div>
  )
}
