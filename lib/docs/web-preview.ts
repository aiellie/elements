import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Web Preview frames a page with the parts of a browser people reach for: back, forward and reload, an address bar, a console, and a menu with zoom and a phone-width view. It's for showing what an agent built, or a page someone is debugging, inside the app.",
    "The address bar shows the URL without its scheme and gives it back when you press Enter, so `localhost` keeps its `http://`. Enter reloads even when the URL didn't change, the way a real address bar does. The icon at its start opens the connection's details.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Frame a page",
        body: [
          "`WebPreview` holds the URL and the console's state. Put a navigation bar, the body and the console inside it.",
        ],
        code: {
          title: "components/preview.tsx",
          code: `import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewUrl,
} from "@/components/aiellie/web-preview"

export function Preview({ url }: { url: string }) {
  return (
    <WebPreview defaultUrl={url} className="h-[480px]">
      <WebPreviewNavigation>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody />
      <WebPreviewConsole />
    </WebPreview>
  )
}`,
        },
      },
      {
        title: "Add history",
        body: [
          "Control `url` to keep your own history, and wire it to navigation buttons. `useWebPreview` gives any part inside the preview its `reload`.",
        ],
        code: {
          title: "components/preview.tsx",
          code: `const [history, setHistory] = useState({ stack: [url], index: 0 })

<WebPreview
  url={history.stack[history.index]}
  onUrlChange={(next) =>
    setHistory(({ stack, index }) => ({
      stack: [...stack.slice(0, index + 1), next],
      index: index + 1,
    }))
  }
>
  <WebPreviewNavigation>
    <WebPreviewNavigationButton
      tooltip="Back"
      disabled={history.index === 0}
      onClick={() => setHistory((h) => ({ ...h, index: h.index - 1 }))}
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} />
    </WebPreviewNavigationButton>
    <WebPreviewUrl />
    <WebPreviewMenu zoom={zoom} onZoomChange={setZoom} />
  </WebPreviewNavigation>
  <WebPreviewBody zoom={zoom} />
</WebPreview>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="web-preview">
  <div data-slot="web-preview-navigation">
    <button data-slot="web-preview-navigation-button" />
    <div data-slot="web-preview-url" role="group">
      {/* connection popover, the address, open in a new tab */}
    </div>
    <button data-slot="web-preview-annotate-toggle" aria-pressed />
    {/* WebPreviewMenu */}
  </div>
  <div data-slot="web-preview-body" data-device>
    <iframe title="Preview" sandbox="…" />
  </div>
  <div data-slot="web-preview-console" data-open>
    <div role="log" />
  </div>
</div>`,
    body: [
      "A live bar sweeps along the top of the body until the frame loads. Reload remounts the frame, so it works without a handler. The console folds open, counts errors and warnings in its bar, and keeps to the bottom as logs arrive.",
      "Every menu entry stays disabled until you pass its handler. The password and cookie entries are labels only: nothing in the component reads or stores a credential.",
      "Many sites refuse to be framed. Preview pages you serve yourself, or pass `srcDoc`. The console only shows the logs you give it, so the framed page has to post them to you.",
    ],
  },
  examples: [
    {
      title: "A dev server's console",
      body: [
        "Pass `logs` to fill the console. Errors are tinted and counted in its bar.",
      ],
      sample: "web-preview/console-logs",
    },
  ],
  api: [
    {
      title: "WebPreview",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`url`, `defaultUrl`, `onUrlChange`", "`string`", '`""`', ""],
        [
          "`onReload`",
          "`() => void`",
          "",
          "Fires on every reload, including Enter on the same URL.",
        ],
        [
          "`consoleOpen`, `defaultConsoleOpen`, `onConsoleOpenChange`",
          "`boolean`",
          "`false`",
          "",
        ],
      ],
      after: ["All other `div` props are forwarded."],
    },
    {
      title: "WebPreviewNavigationButton",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`tooltip`", "`string`", "", "Its tooltip and accessible name."],
        ["`shortcut`", "`string`", "", "Keys shown after the tooltip."],
      ],
      after: ["All other `Button` props are forwarded."],
    },
    {
      title: "WebPreviewUrl",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`connectionContent`",
          "`ReactNode`",
          "`<WebPreviewConnection />`",
          "The connection popover's body.",
        ],
        [
          "`onOpenExternal`",
          "`(url: string) => void`",
          "",
          "Replaces opening the URL in a new tab.",
        ],
      ],
      after: ["All other `input` props are forwarded."],
    },
    {
      title: "WebPreviewBody",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`src`", "`string`", "the URL", ""],
        ["`srcDoc`", "`string`", "", "A page to render instead of a URL."],
        ["`zoom`", "`number`", "`100`", "In percent."],
        ["`device`", "`boolean`", "`false`", "A phone's width, centred."],
        [
          "`loading`",
          "`ReactNode`",
          "",
          "Shown over the frame. Left out, a bar sweeps while it loads.",
        ],
      ],
      after: ["All other `iframe` props are forwarded."],
    },
    {
      title: "WebPreviewConsole",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`logs`",
          '`{ level: "log" | "warn" | "error"; message: string; timestamp: Date }[]`',
          "`[]`",
          "",
        ],
        ["`onClear`", "`() => void`", "", "Adds Clear to its bar while open."],
      ],
    },
    {
      title: "WebPreviewAnnotateToggle",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`active`", "`boolean`", "`false`", ""],
        ["`onActiveChange`", "`(active: boolean) => void`", "", ""],
        [
          "`label`",
          "`string`",
          '`"Annotating"`',
          "Shown while active, and its name.",
        ],
      ],
    },
    {
      title: "WebPreviewMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`zoom`, `onZoomChange`",
          "`number`",
          "`100`",
          "Steps through Chrome's zoom levels, from 25 to 200.",
        ],
        ["`fullScreen`, `onFullScreenChange`", "`boolean`", "`false`", ""],
        [
          "`deviceToolbar`, `onDeviceToolbarChange`",
          "`boolean`",
          "`false`",
          "",
        ],
        [
          "`onFindInPage`, `onPrint`, `onScreenshot`, `onDownloads`, `onBrowserSettings`",
          "`() => void`",
          "",
          "Each enables its entry.",
        ],
        [
          "`onImportCookiesAndPasswords`, `onPasswordManager`, `onContactInfo`",
          "`() => void`",
          "",
          "Each enables its entry.",
        ],
        [
          "`onClearCookies`, `onClearCache`, `onDeleteDownloadHistory`",
          "`() => void`",
          "",
          "Each enables its entry in Clear browsing data.",
        ],
      ],
    },
  ],
}

export default doc
