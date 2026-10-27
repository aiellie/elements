import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Sandbox runs code in the page with Sandpack. One toolbar switches between the live preview, the code and the console, reloads the preview and downloads every file as a zip. The editor has the file tree beside it, and the console's tab is marked when an error or a warning lands out of sight.",
    "Everything around the code is ours rather than Sandpack's: a live bar sweeps along the top while the bundler starts, its progress shows in the middle, and a runtime error docks at the bottom of the preview. The editor has file tabs like Code Workspace, and the console lists messages the way Web Preview's does. It's drawn in the theme's own colours, so it matches the page in light and dark without being told which is on.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Drop in the whole thing",
        body: [
          "`SimpleSandbox` takes the files and a Sandpack template and lays out all three views. Paths start with a slash, as Sandpack has them.",
        ],
        code: {
          title: "components/counter-sandbox.tsx",
          code: `"use client"

import { SimpleSandbox } from "@/components/aiellie/sandbox"

const FILES = {
  "/App.js": \`export default function App() {
  return <h1>Hello</h1>
}\`,
}

export function CounterSandbox() {
  return <SimpleSandbox files={FILES} title="Hello" height={420} />
}`,
        },
      },
      {
        title: "Let people keep their edits",
        body: [
          "With `showSaveReset`, an edited file shows Edited in the toolbar, with Reset to go back to the original and Save. `onSave` gets every file's code, to keep wherever you like.",
        ],
      },
    ],
  },
  anatomy: {
    code: `<SandboxProvider>
  <SandboxTabs>
    {/* toolbar: views, title, save and reset, download, reload */}
    <SandboxTabsContent value="preview">
      <SandboxPreview />
    </SandboxTabsContent>
    <SandboxTabsContent value="code">
      <SandboxCodeEditor />
    </SandboxTabsContent>
    <SandboxTabsContent value="console">
      <SandboxConsole />
    </SandboxTabsContent>
  </SandboxTabs>
</SandboxProvider>`,
    body: [
      "Every view stays mounted while hidden, so the preview doesn't reload each time you look at the code.",
      "`SandboxCodeEditor` puts `SandboxFileExplorer`, a `FileTree` over the sandbox's files, beside Sandpack's editor, with copy and download for the open file. The tree folds away from its header.",
      "Sandpack bundles and runs the code on CodeSandbox's servers, so the preview needs a network connection.",
    ],
  },
  examples: [
    {
      title: "Composed by hand",
      body: [
        "Build it from the parts to choose the views. This one opens on the code, leaves out the tree, and notes when it was saved.",
      ],
      sample: "sandbox/composed",
    },
  ],
  api: [
    {
      title: "SimpleSandbox",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`files`", "`SandboxFiles`", "required", ""],
        ["`template`", "`SandpackPredefinedTemplate`", '`"react"`', ""],
        ["`title`", "`string`", "", "Shown in the toolbar and names the zip."],
        ["`defaultTab`", '`"preview" | "code" | "console"`', '`"preview"`', ""],
        ["`showSaveReset`", "`boolean`", "`false`", ""],
        ["`onSave`", "`(files: Record<string, string>) => void`", "", ""],
        ["`height`", "`number | string`", "`500`", ""],
      ],
    },
    {
      title: "SandboxTabs",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`defaultValue`", "`string`", '`"preview"`', ""],
        ["`value`", "`string`", "", "Makes the view controlled."],
        ["`onValueChange`", "`(value: string) => void`", "", ""],
        ["`title`", "`string`", "", ""],
        ["`showToolbar`", "`boolean`", "`true`", ""],
        [
          "`showSaveReset`",
          "`boolean`",
          "`false`",
          "Shows Reset and Save once a file is edited.",
        ],
        [
          "`onSave`",
          "`(files: Record<string, string>) => void`",
          "",
          "Given every file's code when Save is pressed.",
        ],
      ],
    },
    {
      title: "SandboxCodeEditor",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`showHeader`", "`boolean`", "`true`", "The tabs and actions."],
        ["`showFileTree`", "`boolean`", "`true`", ""],
        [
          "`showTabs`",
          "`boolean`",
          "`true`",
          "A tab for each open file. Off, the header names the active one.",
        ],
        ["`showLineNumbers`", "`boolean`", "`true`", ""],
      ],
      after: ["All other props go to Sandpack's `SandpackCodeEditor`."],
    },
    {
      title: "SandboxFileExplorer",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`autoHiddenFiles`",
          "`boolean`",
          "`true`",
          "Leaves out files marked `hidden`.",
        ],
      ],
    },
    {
      title: "SandboxProvider, SandboxPreview, SandboxConsole, SandboxLayout",
      head: ["Part", "Description"],
      rows: [
        [
          "`SandboxProvider`",
          "Sandpack's provider, themed from the page unless you pass `theme`.",
        ],
        [
          "`SandboxPreview`",
          "Sandpack's preview in our chrome: a loading bar and progress instead of its cube, Try again if the bundler times out, and runtime errors docked at the bottom. Its own buttons are off, since the toolbar has them.",
        ],
        [
          "`SandboxConsole`",
          "The preview's logs as rows, with error and warning counts and Clear. `resetOnPreviewRestart` (default `true`) clears it on a restart.",
        ],
        ["`SandboxLayout`", "Sandpack's layout, without its frame."],
      ],
    },
    {
      title: "useSandboxChanges",
      head: ["Field", "Type", "Description"],
      rows: [
        ["`hasChanges`", "`boolean`", "A file differs from the last save."],
        ["`save`", "`() => Record<string, string>`", "Marks the files saved."],
        ["`reset`", "`() => void`", "Puts every file back as it began."],
      ],
    },
  ],
}

export default doc
