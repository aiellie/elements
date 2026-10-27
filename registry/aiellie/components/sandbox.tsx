"use client"

import * as React from "react"
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useErrorMessage,
  useSandpack,
  useSandpackConsole,
  useSandpackNavigation,
  useSandpackPreviewProgress,
  type CodeEditorProps,
  type PreviewProps,
  type SandpackFiles,
  type SandpackLayoutProps,
  type SandpackProviderProps,
  type SandpackTheme,
} from "@codesandbox/sandpack-react"
import {
  Alert02Icon,
  AppWindowIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowReloadHorizontalIcon,
  ArrowTurnBackwardIcon,
  Cancel01Icon,
  CodeIcon,
  Copy01Icon,
  Download01Icon,
  FileDownloadIcon,
  FileIcon,
  FloppyDiskIcon,
  LinkSquare02Icon,
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
import { Button } from "@/registry/aiellie/ui/button"
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

  // Hidden files aren't the user's to edit, so the host can change them.
  const hasChanges = Object.entries(sandpack.files).some(
    ([path, file]) => !file.hidden && saved[path] !== file.code
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

function FileTab({
  path,
  active,
  onSelect,
  onClose,
}: {
  path: string
  active: boolean
  onSelect: () => void
  onClose?: () => void
}) {
  const name = path.split("/").pop() ?? path

  return (
    <div
      data-slot="sandbox-tab"
      data-active={active || undefined}
      className="group/tab flex h-7 max-w-44 shrink-0 items-center rounded-md text-muted-foreground transition-colors duration-80 hover:bg-muted hover:text-foreground motion-reduce:transition-none data-active:bg-muted data-active:text-foreground"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active}
        title={relative(path)}
        onClick={onSelect}
        // A middle click closes it, as it does in an editor.
        onAuxClick={(event) => {
          if (event.button === 1 && onClose) {
            event.preventDefault()
            onClose()
          }
        }}
        className={cn(
          "flex h-full min-w-0 items-center gap-1.5 rounded-md border border-transparent ps-2 font-mono text-xs outline-none focus-visible:border-ring [&_svg]:size-3.5 [&_svg]:shrink-0",
          onClose ? "pe-1" : "pe-2"
        )}
      >
        {codeIconOf(name) ?? <HugeiconsIcon aria-hidden icon={FileIcon} />}
        <span className="truncate">{name}</span>
      </button>
      {onClose ? (
        <button
          type="button"
          aria-label={`Close ${name}`}
          onClick={onClose}
          className="me-1 flex size-5 shrink-0 items-center justify-center rounded-sm border border-transparent text-muted-foreground opacity-0 transition-[opacity,scale] duration-80 outline-none group-hover/tab:opacity-100 group-data-active/tab:opacity-100 hover:bg-foreground/[0.06] hover:text-foreground focus-visible:border-ring focus-visible:opacity-100 active:scale-90 motion-reduce:transition-none dark:hover:bg-foreground/[0.09] pointer-coarse:opacity-100"
        >
          <HugeiconsIcon aria-hidden icon={Cancel01Icon} className="size-3" />
        </button>
      ) : null}
    </div>
  )
}

// CodeMirror's own look, brought in line with a code block: the gutter in
// small muted numbers, no active-line band, our selection.
const editorSurface = cn(
  "min-h-0 flex-1 bg-transparent!",
  "[&_.cm-content]:py-0! [&_.cm-content]:ps-0! [&_.cm-editor]:bg-transparent! [&_.cm-scroller]:py-2 [&_.cm-scroller]:font-mono!",
  "[&_.cm-gutters]:border-0! [&_.cm-gutters]:bg-background! [&_.cm-gutters]:ps-0! [&_.cm-lineNumbers]:min-w-12!",
  "[&_.cm-lineNumbers_.cm-gutterElement]:ps-0! [&_.cm-lineNumbers_.cm-gutterElement]:pe-4! [&_.cm-lineNumbers_.cm-gutterElement]:text-end [&_.cm-lineNumbers_.cm-gutterElement]:text-[11px]! [&_.cm-lineNumbers_.cm-gutterElement]:text-muted-foreground/70!",
  "[&_.cm-activeLine]:bg-transparent! [&_.cm-activeLineGutter]:bg-transparent! [&_.cm-activeLineGutter]:text-foreground!",
  "[&_.cm-line]:ps-0!"
)

function SandboxCodeEditor({
  showHeader = true,
  showFileTree = true,
  showTabs = true,
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
  const tabs = sandpack.visibleFiles.includes(sandpack.activeFile)
    ? sandpack.visibleFiles
    : [...sandpack.visibleFiles, sandpack.activeFile]
  const shown = Object.values(sandpack.files).filter(
    (file) => !file.hidden
  ).length

  return (
    <div
      data-slot="sandbox-code-editor"
      className="flex min-h-0 min-w-0 flex-1"
    >
      {showFileTree ? (
        <div
          data-open={treeOpen || undefined}
          inert={!treeOpen}
          className="w-0 shrink-0 overflow-hidden border-border/60 transition-[width] duration-280 ease-out motion-reduce:transition-none data-open:w-52 data-open:border-e"
        >
          <div className="flex h-full w-52 flex-col">
            <div className="flex h-9 shrink-0 items-center gap-1 border-b border-border/60 ps-3 pe-1.5 text-xs">
              <span className="text-muted-foreground">Files</span>
              <span className="text-muted-foreground/70 tabular-nums">
                {shown}
              </span>
            </div>
            <SandboxFileExplorer className="min-h-0 flex-1 py-1" />
          </div>
        </div>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {showHeader ? (
          <div className="flex h-9 shrink-0 items-center gap-1 border-b border-border/60 ps-1.5 pe-1.5">
            {showFileTree ? (
              <TooltipIconButton
                tooltip={treeOpen ? "Hide files" : "Show files"}
                aria-expanded={treeOpen}
                onClick={() => setTreeOpen((open) => !open)}
                className="shrink-0"
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={SidebarLeft01Icon}
                  className="rtl:-scale-x-100"
                />
              </TooltipIconButton>
            ) : null}
            {showTabs ? (
              <div
                role="tablist"
                aria-label="Open files"
                className="flex min-w-0 [scrollbar-width:none] items-center gap-0.5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              >
                {tabs.map((file) => (
                  <FileTab
                    key={file}
                    path={file}
                    active={file === sandpack.activeFile}
                    onSelect={() => sandpack.openFile(file)}
                    onClose={
                      tabs.length > 1
                        ? () => sandpack.closeFile(file)
                        : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <span
                title={path}
                className="flex min-w-0 items-center gap-1.5 ps-1 font-mono text-xs text-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0"
              >
                {codeIconOf(name) ?? (
                  <HugeiconsIcon aria-hidden icon={FileIcon} />
                )}
                <span className="truncate">{path}</span>
              </span>
            )}
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
          showTabs={false}
          showLineNumbers={showLineNumbers}
          className={cn(editorSurface, className)}
          {...props}
        />
      </div>
    </div>
  )
}

type ConsoleLevel = "log" | "warn" | "error"

function levelOf(method: string): ConsoleLevel {
  if (method === "error" || method === "assert") return "error"
  if (method === "warn") return "warn"
  return "log"
}

function textOf(data: unknown[] | undefined) {
  return (data ?? [])
    .map((part) => {
      if (typeof part === "string") return part
      try {
        return JSON.stringify(part)
      } catch {
        return String(part)
      }
    })
    .join(" ")
}

function SandboxConsole({
  resetOnPreviewRestart = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Clears the log whenever the preview restarts. */
  resetOnPreviewRestart?: boolean
}) {
  const { logs, reset } = useSandpackConsole({ resetOnPreviewRestart })
  const listRef = React.useRef<HTMLDivElement>(null)
  const entries = logs.filter((entry) => entry.method !== "clear")
  const errors = entries.filter((entry) => levelOf(entry.method) === "error")
  const warnings = entries.filter((entry) => levelOf(entry.method) === "warn")

  React.useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [entries.length])

  return (
    <div
      data-slot="sandbox-console"
      className={cn("flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-border/60 ps-3 pe-1.5 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {entries.length} {entries.length === 1 ? "message" : "messages"}
        </span>
        {errors.length > 0 ? (
          <span className="flex items-center gap-1 text-destructive tabular-nums">
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            {errors.length} {errors.length === 1 ? "error" : "errors"}
          </span>
        ) : null}
        {warnings.length > 0 ? (
          <span className="tabular-nums">
            {warnings.length} {warnings.length === 1 ? "warning" : "warnings"}
          </span>
        ) : null}
        <Button
          variant="ghost"
          size="xs"
          disabled={entries.length === 0}
          onClick={reset}
          className="ms-auto text-muted-foreground focus-visible:border-ring"
        >
          Clear
        </Button>
      </div>
      <div
        ref={listRef}
        role="log"
        aria-label="Console output"
        className="min-h-0 flex-1 overflow-y-auto py-1 font-mono text-[11px] leading-5"
      >
        {entries.length === 0 ? (
          <p className="px-3 py-1 text-muted-foreground">No console output</p>
        ) : (
          entries.map((entry) => {
            const level = levelOf(entry.method)
            return (
              <div
                key={entry.id}
                data-level={level}
                className="flex gap-2 border-b border-border/40 px-3 py-0.5 data-[level=error]:bg-destructive/5 data-[level=error]:text-destructive dark:data-[level=error]:bg-destructive/10"
              >
                {level === "log" ? (
                  <span aria-hidden className="w-3 shrink-0" />
                ) : (
                  <HugeiconsIcon
                    aria-label={level === "error" ? "Error" : "Warning"}
                    icon={Alert02Icon}
                    className={cn(
                      "mt-1 size-3 shrink-0",
                      level === "warn" && "text-muted-foreground"
                    )}
                  />
                )}
                <span className="min-w-0 break-words whitespace-pre-wrap">
                  {textOf(entry.data)}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// A live segment sweeping along the top while the bundler works.
function LoadingBar({ loading }: { loading: boolean }) {
  const segment = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const element = segment.current
    if (!element || !loading || reducedMotion()) return
    const animation = element.animate(
      [{ translate: "-100% 0" }, { translate: "300% 0" }],
      {
        duration: 1400,
        iterations: Infinity,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      }
    )
    return () => animation.cancel()
  }, [loading])

  return (
    <span
      aria-hidden
      data-loading={loading || undefined}
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px overflow-hidden opacity-0 transition-opacity duration-280 data-loading:opacity-100 motion-reduce:transition-none"
    >
      <span
        ref={segment}
        className="absolute inset-y-0 start-0 w-1/3 bg-live motion-reduce:w-full motion-reduce:opacity-40"
      />
    </span>
  )
}

// Back, forward and reload with the page's address, as in Web Preview.
function PreviewNavigator() {
  const { listen } = useSandpack()
  const { back, forward, refresh } = useSandpackNavigation()
  const [state, setState] = React.useState({
    url: "",
    back: false,
    forward: false,
  })

  React.useEffect(
    () =>
      listen((message) => {
        if (message.type === "urlchange") {
          setState({
            url: message.url,
            back: message.back,
            forward: message.forward,
          })
        }
      }),
    [listen]
  )

  let address = "/"
  try {
    const parsed = new URL(state.url)
    address = `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    // No page yet.
  }

  return (
    <div
      data-slot="sandbox-preview-navigator"
      className="flex h-9 shrink-0 items-center gap-0.5 border-b border-border/60 px-1.5"
    >
      <TooltipIconButton tooltip="Back" disabled={!state.back} onClick={back}>
        <HugeiconsIcon
          aria-hidden
          icon={ArrowLeft01Icon}
          className="rtl:-scale-x-100"
        />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip="Forward"
        disabled={!state.forward}
        onClick={forward}
      >
        <HugeiconsIcon
          aria-hidden
          icon={ArrowRight01Icon}
          className="rtl:-scale-x-100"
        />
      </TooltipIconButton>
      <TooltipIconButton tooltip="Reload" onClick={refresh}>
        <HugeiconsIcon aria-hidden icon={ArrowReloadHorizontalIcon} />
      </TooltipIconButton>
      <div className="flex min-w-0 flex-1 justify-center px-1">
        <span
          title={state.url || undefined}
          className="flex h-6 w-full max-w-64 min-w-0 items-center justify-center truncate rounded-md bg-muted/60 px-2 font-mono text-[11px] text-muted-foreground"
        >
          {address}
        </span>
      </div>
      {state.url ? (
        <TooltipIconButton
          tooltip="Open in new tab"
          onClick={() =>
            window.open(state.url, "_blank", "noopener,noreferrer")
          }
        >
          <HugeiconsIcon aria-hidden icon={LinkSquare02Icon} />
        </TooltipIconButton>
      ) : (
        <span aria-hidden className="size-6 shrink-0" />
      )}
    </div>
  )
}

function SandboxPreview({
  className,
  showNavigator = true,
  showOpenInCodeSandbox = false,
  showRefreshButton = false,
  showRestartButton = false,
  children,
  ...props
}: PreviewProps & { className?: string }) {
  const { sandpack, listen } = useSandpack()
  const progress = useSandpackPreviewProgress(undefined)
  const error = useErrorMessage()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(
    () =>
      listen((message) => {
        if (message.type === "start") setLoading(true)
        if (message.type === "done") setLoading(false)
      }),
    [listen]
  )

  const timedOut = sandpack.status === "timeout"
  const busy = loading && !timedOut

  return (
    <div
      data-slot="sandbox-preview"
      data-loading={busy || undefined}
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      {showNavigator ? <PreviewNavigator /> : null}
      <div className="relative flex min-h-0 min-w-0 flex-1">
        <LoadingBar loading={busy} />
        <SandpackPreview
          showOpenInCodeSandbox={showOpenInCodeSandbox}
          showRefreshButton={showRefreshButton}
          showRestartButton={showRestartButton}
          showSandpackErrorOverlay={false}
          className={cn(
            // Sandpack's own loading cube and overlays give way to ours.
            "min-h-0 flex-1 bg-background! [&_.sp-loading]:hidden! [&_.sp-overlay]:hidden! [&_.sp-preview-iframe]:bg-background",
            className
          )}
          {...props}
        >
          {children}
        </SandpackPreview>

        {busy || timedOut ? (
          <div
            role="status"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background text-xs text-muted-foreground"
          >
            {timedOut ? (
              <>
                <p>The preview couldn&apos;t start.</p>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => sandpack.runSandpack()}
                >
                  <HugeiconsIcon aria-hidden icon={ArrowReloadHorizontalIcon} />
                  Try again
                </Button>
              </>
            ) : (
              <p className="shimmer motion-reduce:shimmer-none">
                {progress ?? "Starting the preview"}
              </p>
            )}
          </div>
        ) : null}

        {error && !busy ? (
          <div
            role="alert"
            data-slot="sandbox-preview-error"
            className="absolute inset-x-0 bottom-0 z-10 flex max-h-1/2 animate-in flex-col gap-1 overflow-y-auto border-t border-destructive/20 bg-background px-3 py-2 duration-150 fade-in motion-reduce:animate-none"
          >
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <HugeiconsIcon
                aria-hidden
                icon={Alert02Icon}
                className="size-3.5"
              />
              Error
            </p>
            <pre className="font-mono text-[11px] leading-5 whitespace-pre-wrap text-destructive">
              {error}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
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
  children,
}: {
  files: SandboxFiles
  template?: SandpackProviderProps["template"]
  title?: string
  defaultTab?: SandboxView
  showSaveReset?: boolean
  onSave?: (files: Record<string, string>) => void
  height?: number | string
  className?: string
  /** Rendered inside the provider, for code that drives the sandbox with `useSandpack`. */
  children?: React.ReactNode
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
        {children}
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
