import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Composer is the box a message is written in. It's a form that holds the text, sends it on Enter and keeps Shift+Enter for a new line, turns its send button into stop while a reply comes in, and catches files dropped or pasted onto it. Its parts lay out the box, so whatever else a chat puts in it, a model selector or an add menu, goes in the footer beside the send button.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Lay out the box",
        body: [
          "`Composer` holds the text and hands it to `onSubmit`, trimmed, then empties itself. Leave out `value` and it keeps the text on its own.",
        ],
        code: {
          title: "components/chat-input.tsx",
          code: `"use client"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/components/aiellie/composer"

export function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  return (
    <Composer onSubmit={onSend}>
      <ComposerInput />
      <ComposerFooter>
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}`,
        },
      },
      {
        title: "Hook it up to the AI SDK",
        body: [
          "`status` takes the AI SDK's `useChat` status as it is. While it's `submitted` or `streaming`, Enter does nothing and the send button becomes stop, which calls `onStop`.",
        ],
        code: {
          title: "components/chat-input.tsx",
          code: `"use client"

import { useChat } from "@ai-sdk/react"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/components/aiellie/composer"

export function ChatInput() {
  const { sendMessage, status, stop } = useChat()

  return (
    <Composer
      status={status}
      onStop={stop}
      onSubmit={(text) => sendMessage({ text })}
    >
      <ComposerInput />
      <ComposerFooter>
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="composer-header" data-open /> {/* optional tray, just before the box */}
<form data-slot="composer" data-status="ready" data-dragging>
  <textarea data-slot="composer-input" />
  <div data-slot="composer-footer">
    {/* anything else: a model selector, an add menu, dictation */}
    <button data-slot="composer-submit" />
  </div>
</form>`,
    body: [
      "`data-status` repeats `status`, and `data-dragging` is set while files are dragged over a box that has `onFilesAdd`, which dashes its border. The box takes the ring color while the input has focus, rather than drawing a ring of its own.",
      "`ComposerHeader` sits on top of the box rather than inside it, so it goes just before `Composer` in the same wrapper. It stays mounted while closed, so it folds away instead of vanishing, and it's inert while folded.",
    ],
  },
  examples: [
    {
      title: "Stop a reply",
      body: [
        "Hand `onStop` in and the button stops the reply while `status` is busy. Without it the button stays disabled until the reply is done.",
      ],
      sample: "composer/stop",
    },
    {
      title: "Drop and paste files",
      body: [
        "`onFilesAdd` gets the files dropped or pasted onto the box. Show them in a `ComposerHeader` with `Attachments`, and set `hasAttachments` so a message of files alone can be sent. A dropped folder is left out, because the browser hands it over as an empty file. A paste that carries text as well as a picture of it pastes the text.",
      ],
      sample: "composer/drop-files",
    },
    {
      title: "Hold the text yourself",
      body: [
        "Pass `value` and `onValueChange` when something else needs the text, like a suggestion that fills it in or a draft kept between chats.",
      ],
      code: {
        code: `const [draft, setDraft] = React.useState("")

<Composer value={draft} onValueChange={setDraft} onSubmit={send}>
  <ComposerInput />
  <ComposerFooter>
    <ComposerSubmit />
  </ComposerFooter>
</Composer>`,
      },
    },
  ],
  api: [
    {
      title: "Composer",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`onSubmit`",
          "`(value: string) => void`",
          "required",
          "Called with the trimmed text, which is empty only when `hasAttachments` is set. The box empties itself afterwards.",
        ],
        ["`value`", "`string`", "", "The text, when you hold it yourself."],
        [
          "`defaultValue`",
          "`string`",
          '`""`',
          "The text it starts with when it holds the text itself.",
        ],
        [
          "`onValueChange`",
          "`(value: string) => void`",
          "",
          "Called as the text changes.",
        ],
        [
          "`status`",
          '`"ready" | "submitted" | "streaming" | "error"`',
          '`"ready"`',
          "The AI SDK's `useChat` status. `submitted` and `streaming` hold sending and turn the button into stop.",
        ],
        [
          "`onStop`",
          "`() => void`",
          "",
          "Called by the stop button. Without it, stop stays disabled.",
        ],
        [
          "`disabled`",
          "`boolean`",
          "`false`",
          "Turns off the input and sending.",
        ],
        [
          "`hasAttachments`",
          "`boolean`",
          "`false`",
          "Lets a message with no text be sent, because files go with it.",
        ],
        [
          "`onFilesAdd`",
          "`(files: File[]) => void`",
          "",
          "Called with files dropped or pasted onto the box. Without it, neither is caught.",
        ],
        ["`className`", "`string`", "", "Merged onto the `form`."],
      ],
      after: ["All other `form` props are forwarded."],
    },
    {
      title: "ComposerInput",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`placeholder`",
          "`string`",
          '`"Ask anything"`',
          "Also its accessible name, unless you pass `aria-label`.",
        ],
        [
          "`onKeyDown`",
          "`KeyboardEventHandler`",
          "",
          "Runs before Enter sends. Call `preventDefault()` to keep Enter for yourself, like a mention list does.",
        ],
        ["`className`", "`string`", "", "Merged onto the `textarea`."],
      ],
      after: [
        "Takes every `Textarea` prop but `value`, `defaultValue` and `onChange`, which the composer owns. It grows with its text up to 12rem, then scrolls.",
      ],
    },
    {
      title: "ComposerHeader",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`open`",
          "`boolean`",
          "`true`",
          "Whether the tray shows. Closed, it folds away and is inert.",
        ],
        ["`className`", "`string`", "", "Merged onto the tray's inner row."],
      ],
    },
    {
      title: "ComposerFooter",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`className`",
          "`string`",
          "",
          "Merged onto the row. It packs its children at the end; put `me-auto` on one to push it to the start.",
        ],
      ],
    },
    {
      title: "ComposerSubmit",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`className`",
          "`string`",
          "",
          "Merged onto the button. It's send while ready and stop while busy.",
        ],
      ],
      after: [
        "Takes every `Button` prop but `type` and `children`. It's disabled while there's nothing to send.",
      ],
    },
  ],
}

export default doc
