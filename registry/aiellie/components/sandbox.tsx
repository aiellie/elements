"use client"

import * as React from "react"
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
  type CodeEditorProps,
  type PreviewProps,
  type SandpackFiles,
  type SandpackLayoutProps,
  type SandpackProviderProps,
  type SandpackTheme,
} from "@codesandbox/sandpack-react"
import {
  AppWindowIcon,
  ArrowReloadHorizontalIcon,
  ArrowTurnBackwardIcon,
  CodeIcon,
  Copy01Icon,
  Download01Icon,
  FileDownloadIcon,
  FileIcon,
  FloppyDiskIcon,
  SidebarLeft01Icon,
  Tick02Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { codeIconOf } from "@/registry/aiellie/components/code-block"
import {
  FileTree,
  type FileNode,
} from "@/registry/aiellie/components/file-tree"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/aiellie/ui/tabs"

type SandboxFiles = SandpackFiles
type SandboxView = "preview" | "code" | "console"

// The chrome reads the theme's own variables, so it follows light and dark
// by itself. Syntax colours are GitHub's, as in a code block.
const chrome: Omit<SandpackTheme, "syntax"> = {
  colors: {
    surface1: "var(--background)",
    surface2: "var(--border)",
    surface3: "var(--muted)",
    disabled: "var(--muted-foreground)",
    base: "var(--muted-foreground)",
    clickable: "var(--muted-foreground)",
    hover: "var(--foreground)",
    accent: "var(--foreground)",
    error: "var(--destructive)",
    errorSurface:
      "color-mix(in oklch, var(--destructive) 4%, var(--background))",
  },
  font: {
    body: "var(--font-sans)",
    mono: "var(--font-mono)",
    size: "12px",
    lineHeight: "20px",
  },
}

const syntax = {
  light: {
    plain: "var(--foreground)",
    comment: { color: "#6a737d", fontStyle: "normal" },
    keyword: "#d73a49",
    definition: "#6f42c1",
    punctuation: "var(--foreground)",
    property: "#005cc5",
    tag: "#22863a",
    static: "#005cc5",
    string: "#032f62",
  },
  dark: {
    plain: "var(--foreground)",
    comment: { color: "#6a737d", fontStyle: "normal" },
    keyword: "#f97583",
    definition: "#b392f0",
    punctuation: "var(--foreground)",
    property: "#79b8ff",
    tag: "#85e89d",
    static: "#79b8ff",
    string: "#9ecbff",
  },
} satisfies Record<string, SandpackTheme["syntax"]>

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

// Read off the `dark` class rather than a theme library, so it works in any app.
function useDarkClass() {
  return React.useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false
  )
}

function codeOf(file: SandboxFiles[string] | undefined) {
  if (file === undefined) return undefined
  return typeof file === "string" ? file : file.code
}

function snapshot(files: SandboxFiles) {
  return Object.fromEntries(
    Object.entries(files).map(([path, file]) => [path, codeOf(file) ?? ""])
  )
}

function useSandboxChanges() {
  const { sandpack } = useSandpack()
  const [saved, setSaved] = React.useState(() => snapshot(sandpack.files))

  const hasChanges = Object.entries(sandpack.files).some(
    ([path, file]) => saved[path] !== file.code
  )

  const save = React.useCallback(() => {
    const files = snapshot(sandpack.files)
    setSaved(files)
    return files
  }, [sandpack.files])

  const reset = React.useCallback(() => {
    sandpack.resetAllFiles()
    // What it resets to is what it started with, which is saved again.
    setSaved(snapshot(sandpack.files))
  }, [sandpack])

  return { hasChanges, save, reset }
}

function useCopied() {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return [copied, setCopied] as const
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

// `/src/App.js` to `src/App.js`, as the tree and a zip both want it.
const relative = (path: string) => path.replace(/^\//, "")

function SandboxProvider({
  className,
  theme,
  ...props
}: SandpackProviderProps) {
  const dark = useDarkClass()

  return (
    <SandpackProvider
      className={cn("size-full! max-h-none!", className)}
      theme={theme ?? { ...chrome, syntax: dark ? syntax.dark : syntax.light }}
      {...props}
    />
  )
}

function SandboxLayout({ className, ...props }: SandpackLayoutProps) {
  return (
    <SandpackLayout
      className={cn(
        "h-full! rounded-none! border-none! bg-transparent!",
        className
      )}
      {...props}
    />
  )
}

type SandboxContextValue = {
  view: string
  consoleIssues: boolean
}

const SandboxContext = React.createContext<SandboxContextValue | null>(null)

function useSandbox() {
  const context = React.useContext(SandboxContext)
  if (!context) throw new Error("useSandbox must be used in SandboxTabs.")
  return context
}

function SandboxTabs({
  defaultValue = "preview",
  value,
  onValueChange,
  title,
  showToolbar = true,
  showSaveReset = false,
  onSave,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "title"> & {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  title?: string
  showToolbar?: boolean
  /** Shows Reset, and Save, once a file has been edited. */
  showSaveReset?: boolean
  /** Given every file's code when Save is pressed. */
  onSave?: (files: Record<string, string>) => void
}) {
  const { listen } = useSandpack()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const view = value ?? uncontrolled
  const [consoleIssues, setConsoleIssues] = React.useState(false)

  // An error or a warning while the console is out of sight marks its tab.
  React.useEffect(
    () =>
      listen((message) => {
        if (message.type !== "console") return
        if (
          message.log.some(
            (entry) => entry.method === "error" || entry.method === "warn"
          )
        ) {
          setConsoleIssues(true)
        }
      }),
    [listen]
  )

  const select = (next: string) => {
    if (next === "console") setConsoleIssues(false)
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <SandboxContext.Provider
      value={{ view, consoleIssues: consoleIssues && view !== "console" }}
    >
      <Tabs
        data-slot="sandbox"
        value={view}
        onValueChange={(next) => select(String(next))}
        className={cn(
          "@container/sandbox flex size-full min-w-0 flex-col gap-0 overflow-hidden bg-background text-sm",
          className
        )}
        {...(props as Omit<React.ComponentProps<typeof Tabs>, "value">)}
      >
        {showToolbar ? (
          <SandboxToolbar
            title={title}
            showSaveReset={showSaveReset}
            onSave={onSave}
          />
        ) : null}
        {children}
      </Tabs>
    </SandboxContext.Provider>
  )
}

const views = [
  { value: "preview", label: "Preview", icon: AppWindowIcon },
  { value: "code", label: "Code", icon: CodeIcon },
  { value: "console", label: "Console", icon: TerminalIcon },
] as const

function SandboxToolbar({
  title,
  showSaveReset,
  onSave,
}: {
  title?: string
  showSaveReset: boolean
  onSave?: (files: Record<string, string>) => void
}) {
  return (
    <div
      data-slot="sandbox-toolbar"
      className="flex h-10 shrink-0 items-center gap-2 border-b border-border/60 ps-1.5 pe-1.5"
    >
      <SandboxTabsList>
        {views.map((view) => (
          <SandboxTabsTrigger key={view.value} value={view.value}>
            <HugeiconsIcon aria-hidden icon={view.icon} />
            <span className="sr-only @md/sandbox:not-sr-only">
              {view.label}
            </span>
          </SandboxTabsTrigger>
        ))}
      </SandboxTabsList>
      {title ? (
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          {title}
        </span>
      ) : null}
      <div className="ms-auto flex shrink-0 items-center gap-0.5">
        {showSaveReset ? <SandboxSaveReset onSave={onSave} /> : null}
        <SandboxDownloadAll title={title} />
        <SandboxRefresh />
      </div>
    </div>
  )
}

function SandboxTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      data-slot="sandbox-tabs-list"
      className={cn("h-7! shrink-0", className)}
      {...props}
    />
  )
}

function SandboxTabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsTrigger> & { value: string }) {
  const { consoleIssues } = useSandbox()
  const flagged = value === "console" && consoleIssues

  return (
    <TabsTrigger
      data-slot="sandbox-tabs-trigger"
      value={value}
      className={cn("gap-1.5 px-2 text-xs [&_svg]:size-3.5", className)}
      {...props}
    >
      {children}
      {flagged ? (
        <>
          <span
            aria-hidden
            className="absolute end-1 top-1 size-1.5 rounded-full bg-destructive"
          />
          <span className="sr-only">, has errors</span>
        </>
      ) : null}
    </TabsTrigger>
  )
}

function SandboxTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsContent>) {
  return (
    <TabsContent
      data-slot="sandbox-tabs-content"
      // Kept mounted, so the preview doesn't reload whenever you look away.
      keepMounted
      className={cn(
        "relative flex min-h-0 flex-1 text-xs data-hidden:hidden",
        className
      )}
      {...props}
    />
  )
}

function SandboxRefresh() {
  const { dispatch } = useSandpack()

  return (
    <TooltipIconButton
      tooltip="Reload preview"
      onClick={() => dispatch({ type: "refresh" })}
    >
      <HugeiconsIcon aria-hidden icon={ArrowReloadHorizontalIcon} />
    </TooltipIconButton>
  )
}

function SandboxDownloadAll({ title }: { title?: string }) {
  const { sandpack } = useSandpack()
  const [busy, setBusy] = React.useState(false)

  const save = async () => {
    setBusy(true)
    try {
      // Loaded on first use, so the zip library stays out of the page until then.
      const { default: JSZip } = await import("jszip")
      const zip = new JSZip()
      for (const [path, file] of Object.entries(sandpack.files)) {
        zip.file(relative(path), file.code)
      }
      const name = title
        ? `${title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")}.zip`
        : "sandbox.zip"
      download(await zip.generateAsync({ type: "blob" }), name)
    } finally {
      setBusy(false)
    }
  }

  return (
    <TooltipIconButton
      tooltip={busy ? "Zipping…" : "Download all files"}
      disabled={busy}
      onClick={save}
    >
      <HugeiconsIcon aria-hidden icon={Download01Icon} />
    </TooltipIconButton>
  )
}

function SandboxSaveReset({
  onSave,
}: {
  onSave?: (files: Record<string, string>) => void
}) {
  const { hasChanges, save, reset } = useSandboxChanges()
  const [saved, setSaved] = useCopied()

  return (
    <>
      {hasChanges ? (
        <span className="me-1 text-xs text-muted-foreground">Edited</span>
      ) : null}
      <TooltipIconButton
        tooltip="Reset to the original"
        disabled={!hasChanges}
        onClick={reset}
      >
        <HugeiconsIcon aria-hidden icon={ArrowTurnBackwardIcon} />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip={saved ? "Saved" : "Save"}
        disabled={!hasChanges && !saved}
        onClick={() => {
          onSave?.(save())
          setSaved(true)
        }}
      >
        <HugeiconsIcon aria-hidden icon={saved ? Tick02Icon : FloppyDiskIcon} />
      </TooltipIconButton>
    </>
  )
}

function toNodes(paths: readonly string[]): FileNode[] {
  const root: FileNode[] = []
  for (const path of paths) {
    let level = root
    const parts = relative(path).split("/")
    parts.forEach((name, index) => {
      const file = index === parts.length - 1
      let node = level.find((entry) => entry.name === name)
      if (!node) {
        node = file ? { name } : { name, children: [] }
        level.push(node)
      }
      if (!file) level = node.children ?? (node.children = [])
    })
  }
  const sort = (nodes: FileNode[]): FileNode[] =>
    [...nodes]
      .sort(
        (a, b) =>
          Number(!a.children) - Number(!b.children) ||
          a.name.localeCompare(b.name)
      )
      .map((node) =>
        node.children ? { ...node, children: sort(node.children) } : node
      )
  return sort(root)
}

function SandboxFileExplorer({
  autoHiddenFiles = true,
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof FileTree>,
  "nodes" | "selected" | "onSelect"
> & {
  /** Leaves out files marked `hidden`. */
  autoHiddenFiles?: boolean
}) {
  const { sandpack } = useSandpack()
  const nodes = React.useMemo(
    () =>
      toNodes(
        Object.entries(sandpack.files)
          .filter(([, file]) => !(autoHiddenFiles && file.hidden))
          .map(([path]) => path)
      ),
    [sandpack.files, autoHiddenFiles]
  )

  return (
    <FileTree
      data-slot="sandbox-file-explorer"
      nodes={nodes}
      selected={relative(sandpack.activeFile)}
      onSelect={(path) => sandpack.openFile(`/${path}`)}
      className={cn("rounded-none border-0 bg-transparent", className)}
      {...props}
    />
  )
}

function SandboxCodeEditor({
  showHeader = true,
  showFileTree = true,
  showTabs = false,
  showLineNumbers = true,
  className,
  ...props
}: CodeEditorProps & {
  showHeader?: boolean
  showFileTree?: boolean
}) {
  const { sandpack } = useSandpack()
  const [treeOpen, setTreeOpen] = React.useState(true)
  const [copied, setCopied] = useCopied()
  const path = relative(sandpack.activeFile)
  const name = path.split("/").pop() ?? path
  const code = sandpack.files[sandpack.activeFile]?.code ?? ""

  return (
    <div
      data-slot="sandbox-code-editor"
      className="flex min-h-0 min-w-0 flex-1"
    >
      {showFileTree ? (
        <div
          data-open={treeOpen || undefined}
          inert={!treeOpen}
          className="w-0 shrink-0 overflow-hidden border-border/60 transition-[width] duration-280 ease-out motion-reduce:transition-none data-open:w-44 data-open:border-e"
        >
          <SandboxFileExplorer className="h-full w-44 py-2" />
        </div>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {showHeader ? (
          <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-border/60 ps-1.5 pe-1.5">
            {showFileTree ? (
              <TooltipIconButton
                tooltip={treeOpen ? "Hide files" : "Show files"}
                aria-expanded={treeOpen}
                onClick={() => setTreeOpen((open) => !open)}
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={SidebarLeft01Icon}
                  className="rtl:-scale-x-100"
                />
              </TooltipIconButton>
            ) : null}
            <span
              title={path}
              className="flex min-w-0 items-center gap-1.5 ps-1 font-mono text-xs text-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0"
            >
              {codeIconOf(name) ?? (
                <HugeiconsIcon aria-hidden icon={FileIcon} />
              )}
              <span className="truncate">{path}</span>
            </span>
            <div className="ms-auto flex shrink-0 items-center gap-0.5">
              <TooltipIconButton
                tooltip={copied ? "Copied" : "Copy"}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(code)
                    setCopied(true)
                  } catch {
                    // Refused, so there is nothing to confirm.
                  }
                }}
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={copied ? Tick02Icon : Copy01Icon}
                />
              </TooltipIconButton>
              <TooltipIconButton
                tooltip={`Download ${name}`}
                onClick={() =>
                  download(new Blob([code], { type: "text/plain" }), name)
                }
              >
                <HugeiconsIcon aria-hidden icon={FileDownloadIcon} />
              </TooltipIconButton>
            </div>
          </div>
        ) : null}
        <SandpackCodeEditor
          showTabs={showTabs}
          showLineNumbers={showLineNumbers}
          className={cn("min-h-0 flex-1", className)}
          {...props}
        />
      </div>
    </div>
  )
}

function SandboxConsole({
  className,
  ...props
}: React.ComponentProps<typeof SandpackConsole>) {
  return (
    <SandpackConsole
      data-slot="sandbox-console"
      className={cn("min-h-0 flex-1", className)}
      {...props}
    />
  )
}

function SandboxPreview({
  className,
  showOpenInCodeSandbox = false,
  showRefreshButton = false,
  ...props
}: PreviewProps & { className?: string }) {
  return (
    <SandpackPreview
      data-slot="sandbox-preview"
      showOpenInCodeSandbox={showOpenInCodeSandbox}
      showRefreshButton={showRefreshButton}
      className={cn("min-h-0 flex-1", className)}
      {...props}
    />
  )
}

function SimpleSandbox({
  files,
  template = "react",
  title,
  defaultTab = "preview",
  showSaveReset = false,
  onSave,
  height = 500,
  className,
}: {
  files: SandboxFiles
  template?: SandpackProviderProps["template"]
  title?: string
  defaultTab?: SandboxView
  showSaveReset?: boolean
  onSave?: (files: Record<string, string>) => void
  height?: number | string
  className?: string
}) {
  return (
    <div
      data-slot="simple-sandbox"
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-xl border border-border/60 bg-background",
        className
      )}
      style={{ height }}
    >
      <SandboxProvider template={template} files={files}>
        <SandboxTabs
          defaultValue={defaultTab}
          title={title}
          showSaveReset={showSaveReset}
          onSave={onSave}
        >
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
      </SandboxProvider>
    </div>
  )
}

export {
  SandboxCodeEditor,
  SandboxConsole,
  SandboxFileExplorer,
  SandboxLayout,
  SandboxPreview,
  SandboxProvider,
  SandboxTabs,
  SandboxTabsContent,
  SandboxTabsList,
  SandboxTabsTrigger,
  SimpleSandbox,
  useSandboxChanges,
}
export type { SandboxFiles, SandboxView }
