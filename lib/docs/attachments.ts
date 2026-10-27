import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Attachments is the row of files on a message: square thumbnails for pictures, chips with an icon, a name and a size for everything else. The row scrolls sideways when it runs out of room, fading at whichever edge has more. Each item can open, to a [File preview](/components/file-preview), and be removed while the message is still a draft.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Lay out the files",
        body: [
          "`AttachmentImage` takes a `src`, often an object URL; `AttachmentFile` takes a Hugeicons glyph and a short description.",
        ],
        code: {
          title: "components/message-files.tsx",
          code: `import { File02Icon } from "@hugeicons/core-free-icons"

import {
  AttachmentFile,
  AttachmentImage,
  Attachments,
} from "@/components/aiellie/attachments"

export function MessageFiles() {
  return (
    <Attachments>
      <AttachmentImage src="/mockup.png" name="mockup.png" />
      <AttachmentFile
        icon={File02Icon}
        name="report.pdf"
        description="PDF · 1.2 MB"
      />
    </Attachments>
  )
}`,
        },
      },
      {
        title: "Open and remove",
        body: [
          "`onOpen` makes the whole item a button; `onRemove` adds a small cross in its corner. Leave `onRemove` off once the message is sent.",
        ],
        code: {
          code: `<AttachmentFile
  icon={File02Icon}
  name={file.name}
  description={describe(item)}
  onOpen={() => preview(item)}
  onRemove={() => remove(item)}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="attachments" data-size="default"> {/* scrolls sideways, snapping */}
  <div data-slot="attachment-image"> {/* a 56px square */}
    <img />
    <button data-slot="attachment-open" /> {/* only with onOpen, covering it */}
    <button data-slot="attachment-remove" /> {/* only with onRemove */}
  </div>
  <div data-slot="attachment-file"> {/* 56px tall, up to 224px wide */}
    <span><svg /></span> {/* the icon on a muted square */}
    <span>{name}<span>{description}</span></span>
  </div>
</div>`,
    body: [
      'The remove button shows on hover and focus, and always on a touch screen, so it never covers a thumbnail someone is only looking at. Its label names the file: "Remove report.pdf". Pressing an item that opens shrinks it a little. The edges fade only while there is more to scroll that way, with a mask, so the row works on any background.',
      '`size="sm"` makes items 40px, for a composer where room is tight.',
    ],
  },
  examples: [
    {
      title: "From a file input",
      body: ["Add some files: pictures get thumbnails, the rest get chips."],
      sample: "attachments/from-input",
    },
  ],
  api: [
    {
      title: "Attachments",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`size`",
          '`"default" | "sm"`',
          '`"default"`',
          "56px squares and chips, or 40px where room is tight.",
        ],
        ["`className`", "`string`", "", "Merged onto the row."],
      ],
      after: ["All other `div` props are forwarded to the row."],
    },
    {
      title: "AttachmentImage",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`src`", "`string`", "required", "The picture."],
        [
          "`name`",
          "`string`",
          "required",
          "Read out in place of the picture, which shows no name of its own.",
        ],
        ["`onOpen`", "`() => void`", "", "Makes it a button that opens it."],
        ["`onRemove`", "`() => void`", "", "Adds a remove button."],
      ],
    },
    {
      title: "AttachmentFile",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`icon`",
          "`IconSvgElement`",
          "required",
          "A Hugeicons glyph for its kind.",
        ],
        ["`name`", "`string`", "required", "The file's name."],
        [
          "`description`",
          "`string`",
          "",
          "Its kind and size, like `PDF · 1.2 MB`.",
        ],
        ["`onOpen`", "`() => void`", "", "Makes it a button that opens it."],
        ["`onRemove`", "`() => void`", "", "Adds a remove button."],
      ],
    },
  ],
}

export default doc
