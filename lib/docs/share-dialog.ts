import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Share dialog shares a chat or a document by link. It brings its own Share button; the dialog inside chooses who can open it, only you or anyone with the link, copies the link, and posts it to X, LinkedIn or Reddit. While it's private there's no link to copy.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Give it the link",
        body: [
          "It renders its own trigger, so it goes where the Share button should be. `open` is still yours, to open it from elsewhere too.",
        ],
        code: {
          title: "components/chat-header.tsx",
          code: `"use client"

import * as React from "react"

import { ShareDialog } from "@/components/aiellie/share-dialog"

export function ChatShare({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <ShareDialog
      open={open}
      onOpenChange={setOpen}
      title="Share chat"
      url={\`https://example.com/c/\${id}\`}
      text={title}
    />
  )
}`,
        },
      },
      {
        title: "Save who can open it",
        body: [
          "`onVisibilityChange` fires when the choice changes. Make the link work, or stop it working, on the server.",
        ],
        code: {
          code: `<ShareDialog
  defaultVisibility={chat.shared ? "link" : "private"}
  onVisibilityChange={(visibility) => setShared(chat.id, visibility === "link")}
  {...props}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="dialog-trigger" /> {/* Share, a small ghost button */}

<div data-slot="share-dialog"> {/* DialogContent, 448px wide at most */}
  <div data-slot="dialog-header">
    <h2 data-slot="dialog-title">{title}</h2>
    <p data-slot="dialog-description" /> {/* what the current choice means */}
  </div>
  {preview}
  <button data-slot="menu-trigger" /> {/* Only you / Anyone with the link */}
  <div>
    <input readonly /> {/* the link, selected on focus */}
    <button /> {/* Copy link */}
  </div>
  <div data-slot="dialog-footer">
    <a /> <a /> <a /> {/* X, LinkedIn, Reddit */}
  </div>
</div>`,
    body: [
      "The description follows the choice, so it always says what is shared right now. While private, the link field is empty and disabled along with Copy and the posts. `text` goes with the post to X and Reddit as its words or title.",
    ],
  },
  examples: [
    {
      title: "Private until shared",
      body: [
        "Start private and say what sharing means for this kind of thing with `descriptions`.",
      ],
      sample: "share-dialog/private-by-default",
    },
    {
      title: "A preview of what's shared",
      body: [
        "`preview` shows above the controls, like a glimpse of the document.",
      ],
      code: {
        code: `<ShareDialog
  preview={
    <div className="rounded-sm border px-3 py-2">
      <p className="text-xs font-medium">Launch checklist</p>
      <p className="text-xs text-muted-foreground">12 items, 9 done</p>
    </div>
  }
  {...props}
/>`,
      },
    },
  ],
  api: [
    {
      title: "ShareDialog",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`open`", "`boolean`", "required", "Whether the dialog is open."],
        [
          "`onOpenChange`",
          "`(open: boolean) => void`",
          "required",
          "Called when the Share button or Escape opens or closes it.",
        ],
        ["`url`", "`string`", "required", "The link to share."],
        [
          "`text`",
          "`string`",
          "",
          "What a post to X or Reddit says alongside the link, like the page's title.",
        ],
        ["`title`", "`string`", '`"Share"`', "The dialog's title."],
        [
          "`descriptions`",
          "`{ private?: string; link?: string }`",
          "",
          "What each choice means for what's shared, in place of the general wording.",
        ],
        [
          "`preview`",
          "`ReactNode`",
          "",
          "Shown above the controls, like a glimpse of what's being shared.",
        ],
        [
          "`defaultVisibility`",
          '`"private" | "link"`',
          '`"link"`',
          "Who can open it when the dialog first renders.",
        ],
        [
          "`onVisibilityChange`",
          '`(visibility: "private" | "link") => void`',
          "",
          "Called when the choice changes.",
        ],
      ],
    },
  ],
}

export default doc
