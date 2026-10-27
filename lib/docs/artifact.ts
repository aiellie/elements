import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Artifact is a panel for something a reply made, like a file, a document or a page, so it can be read and used beside the thread rather than inside it. A header names it, with a line about it, its actions and a close button, over a body that scrolls.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Wrap what was made",
        body: [
          "The body takes anything. Here it's a Code Block's content, which already scrolls sideways and numbers its lines.",
        ],
        code: {
          title: "components/generated-file.tsx",
          code: `import { Copy01Icon } from "@hugeicons/core-free-icons"

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/aiellie/artifact"
import { CodeBlockContent } from "@/components/aiellie/code-block"

export function GeneratedFile({ code, onClose }: { code: string; onClose: () => void }) {
  return (
    <Artifact className="h-full">
      <ArtifactHeader>
        <ArtifactTitle description="TypeScript">use-debounce.ts</ArtifactTitle>
        <ArtifactActions>
          <ArtifactAction
            tooltip="Copy"
            icon={Copy01Icon}
            onClick={() => navigator.clipboard.writeText(code)}
          />
          <ArtifactClose onClick={onClose} />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <CodeBlockContent code={code} language="ts" lineNumbers />
      </ArtifactContent>
    </Artifact>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<section data-slot="artifact">
  <header data-slot="artifact-header">
    <div data-slot="artifact-title" />
    <div data-slot="artifact-actions" role="group">
      <button data-slot="artifact-action" />
      <button data-slot="artifact-close" />
    </div>
  </header>
  <div data-slot="artifact-content" />
</section>`,
    body: [
      "The panel fills the height it's given and only the body scrolls, so give it a height, or a `max-h-*`, where it sits. Each action is an icon button with its own tooltip.",
    ],
  },
  examples: [
    {
      title: "A document",
      body: [
        "Pad the body yourself for prose. Leave out the close button for a panel that stays.",
      ],
      sample: "artifact/document",
    },
  ],
  api: [
    {
      title: "ArtifactTitle",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`children`", "`ReactNode`", "", "Its name."],
        ["`description`", "`ReactNode`", "", "A short line under the name."],
        ["`icon`", "`IconSvgElement`", "", "A mark before the name."],
      ],
    },
    {
      title: "ArtifactAction",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`tooltip`", "`string`", "required", "Also its accessible name."],
        ["`icon`", "`IconSvgElement`", "", "Or pass an icon as children."],
      ],
      after: ["All other `TooltipIconButton` props are forwarded."],
    },
    {
      title: "ArtifactClose",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [["`tooltip`", "`string`", '`"Close"`', ""]],
      after: [
        "`Artifact`, `ArtifactHeader`, `ArtifactActions` and `ArtifactContent` forward their element's props.",
      ],
    },
  ],
}

export default doc
