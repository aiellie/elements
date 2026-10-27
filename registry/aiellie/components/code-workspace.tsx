"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import {
  ArrowRight01Icon,
  ArrowTurnBackwardIcon,
  Cancel01Icon,
  FileIcon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  CodeTokens,
  codeIconOf,
  useHighlightedLines,
} from "@/registry/aiellie/components/code-block"
import {
  FileTree,
  type FileNode,
} from "@/registry/aiellie/components/file-tree"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import {
  buildMatcher,
  InvalidPatternError,
  replaceAll,
  searchContents,
  searchNames,
  splitTarget,
  type SourceFile,
} from "@/registry/aiellie/lib/file-search"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/aiellie/ui/combobox"
import { InputGroupAddon } from "@/registry/aiellie/ui/input-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/aiellie/ui/resizable"
import { Toggle } from "@/registry/aiellie/ui/toggle"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/aiellie/ui/toggle-group"

type CodeWorkspaceFile = {
  /** The full path, split on `/` into the tree. */
  path: string
  content: string
  /** A Shiki language id. Read off the extension when left out. */
  language?: string
}

type CodeWorkspaceScope = "names" | "contents"

type CodeWorkspaceContextValue = {
  files: readonly CodeWorkspaceFile[]
  paths: string[]
  activeFile: string | null
  openFiles: string[]
  /** Opens the file in a tab if it has none, and points at a line if given one. */
  selectFile: (path: string, line?: number) => void
  closeFile: (path: string) => void
  /** Bumped on every choice, so choosing the same line again still scrolls to it. */
  target: { line: number | null; id: number }
  contentOf: (path: string) => string
  languageOf: (path: string) => string
  /** The files showing a replacement, by path. */
  replaced: Record<string, string>
  applyReplacements: (edits: { path: string; content: string }[]) => void
  revertReplacements: () => void
}

const CodeWorkspaceContext =
  React.createContext<CodeWorkspaceContextValue | null>(null)

function useCodeWorkspace() {
  const context = React.useContext(CodeWorkspaceContext)
  if (!context) {
    throw new Error("useCodeWorkspace must be used in CodeWorkspace.")
  }
  return context
}

// `.gitignore` to `gitignore`, `button.tsx` to `tsx`.
function extensionOf(path: string) {
  const name = splitTarget(path).name.replace(/^\./, "")
  return name.slice(name.lastIndexOf(".") + 1).toLowerCase()
}

function CodeWorkspace({
  files,
  defaultFile,
  onFileChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  files: readonly CodeWorkspaceFile[]
  /** The file open at first. The first file when left out. */
  defaultFile?: string
  onFileChange?: (path: string) => void
}) {
  const paths = React.useMemo(() => files.map((file) => file.path), [files])
  const byPath = React.useMemo(
    () => new Map(files.map((file) => [file.path, file])),
    [files]
  )

  const first = defaultFile ?? paths[0] ?? null
  const [chosen, setChosen] = React.useState(first)
  const [tabs, setTabs] = React.useState<string[]>(first ? [first] : [])
  const [target, setTarget] = React.useState<{
    line: number | null
    id: number
  }>({ line: null, id: 0 })
  const [replaced, setReplaced] = React.useState<Record<string, string>>({})

  // Files can be swapped out from under the tabs, so both are read against
  // what's there now.
  const openFiles = tabs.filter((path) => byPath.has(path))
  const activeFile =
    chosen && byPath.has(chosen) ? chosen : (openFiles[0] ?? paths[0] ?? null)
  if (activeFile && !openFiles.includes(activeFile)) openFiles.push(activeFile)

  const selectFile = React.useCallback(
    (path: string, line?: number) => {
      setChosen(path)
      setTabs((current) =>
        current.includes(path) ? current : [...current, path]
      )
      setTarget((current) => ({ line: line ?? null, id: current.id + 1 }))
      onFileChange?.(path)
    },
    [onFileChange]
  )

  const closeFile = (path: string) => {
    const index = openFiles.indexOf(path)
    // The panel has nothing to show without a file, so the last tab stays.
    if (index === -1 || openFiles.length === 1) return
    const next = openFiles.filter((open) => open !== path)
    setTabs(next)
    if (path === activeFile) {
      // The tab that slid into its place, or the one before it.
      const fallback = next[index] ?? next[index - 1]
      setChosen(fallback)
      setTarget((current) => ({ line: null, id: current.id + 1 }))
      onFileChange?.(fallback)
    }
  }

  const contentOf = (path: string) =>
    replaced[path] ?? byPath.get(path)?.content ?? ""
  const languageOf = (path: string) =>
    byPath.get(path)?.language ?? extensionOf(path)

  const applyReplacements = (edits: { path: string; content: string }[]) => {
    setReplaced(
      Object.fromEntries(edits.map((edit) => [edit.path, edit.content]))
    )
    if (edits[0]) selectFile(edits[0].path)
  }

  const value: CodeWorkspaceContextValue = {
    files,
    paths,
    activeFile,
    openFiles,
    selectFile,
    closeFile,
    target,
    contentOf,
    languageOf,
    replaced,
    applyReplacements,
    revertReplacements: () => setReplaced({}),
  }

  return (
    <CodeWorkspaceContext.Provider value={value}>
      {/* The height lives here: the group sets `height: 100%` inline, so the
          tree and the code only scroll inside a box of definite size. */}
      <div
        data-slot="code-workspace"
        className={cn(
          "flex h-96 w-full min-w-0 overflow-hidden rounded-xl border border-border/60 bg-background text-sm",
          className
        )}
        {...props}
      >
        <ResizablePanelGroup orientation="horizontal">
          {children}
        </ResizablePanelGroup>
      </div>
    </CodeWorkspaceContext.Provider>
  )
}

// A panel puts `className` on an inner element that defaults to block, so
// each one restates the column or its content scrolls the whole panel.
const panelBody = "flex h-full min-h-0 min-w-0 flex-col"

const header =
  "flex h-9 shrink-0 items-center gap-1 border-b border-border/60 ps-3 pe-1.5"

function toNodes(paths: readonly string[]): FileNode[] {
  const root: FileNode[] = []
  for (const path of paths) {
    let level = root
    const parts = path.split("/")
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
  // Folders first, then files, each in the order they were given.
  const sort = (nodes: FileNode[]): FileNode[] =>
    [...nodes]
      .sort((a, b) => Number(!a.children) - Number(!b.children))
      .map((node) =>
        node.children ? { ...node, children: sort(node.children) } : node
      )
  return sort(root)
}

function CodeWorkspaceSidebar({
  title = "Files",
  defaultScopes = ["names"],
  defaultSize = "16rem",
  minSize = "11rem",
  maxSize = "50%",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode
  /** What a search looks through the first time it opens. */
  defaultScopes?: CodeWorkspaceScope[]
  /** A CSS length or a percentage. */
  defaultSize?: string
  minSize?: string
  maxSize?: string
}) {
  const { paths, activeFile, selectFile } = useCodeWorkspace()
  const [searching, setSearching] = React.useState(false)
  const [scopes, setScopes] = React.useState(defaultScopes)
  const nodes = React.useMemo(() => toNodes(paths), [paths])

  return (
    <>
      <ResizablePanel
        defaultSize={defaultSize}
        minSize={minSize}
        maxSize={maxSize}
        className={cn(panelBody, className)}
        style={{ overflow: "hidden" }}
      >
        <div
          data-slot="code-workspace-sidebar"
          className={panelBody}
          {...props}
        >
          <div className={header}>
            {searching ? (
              <>
                <ToggleGroup
                  size="sm"
                  spacing={0}
                  variant="outline"
                  multiple
                  value={scopes}
                  aria-label="Search in"
                  onValueChange={(next) => {
                    // With both off the box would do nothing, so the last stays on.
                    if (next.length > 0) setScopes(next as CodeWorkspaceScope[])
                  }}
                  className="-ms-1.5"
                >
                  <ToggleGroupItem value="names" className="h-6 px-2">
                    Files
                  </ToggleGroupItem>
                  <ToggleGroupItem value="contents" className="h-6 px-2">
                    Text
                  </ToggleGroupItem>
                </ToggleGroup>
                <TooltipIconButton
                  tooltip="Close search"
                  className="ms-auto"
                  onClick={() => setSearching(false)}
                >
                  <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
                </TooltipIconButton>
              </>
            ) : (
              <>
                <span className="min-w-0 truncate text-xs text-muted-foreground">
                  {title}
                </span>
                <span className="text-xs text-muted-foreground/70 tabular-nums">
                  {paths.length}
                </span>
                <TooltipIconButton
                  tooltip="Search"
                  className="ms-auto"
                  onClick={() => setSearching(true)}
                >
                  <HugeiconsIcon aria-hidden icon={Search01Icon} />
                </TooltipIconButton>
              </>
            )}
          </div>
          {searching ? (
            <CodeWorkspaceSearch
              scopes={scopes}
              onClose={() => setSearching(false)}
            />
          ) : (
            <FileTree
              nodes={nodes}
              selected={activeFile ?? undefined}
              onSelect={(path) => selectFile(path)}
              className="min-h-0 flex-1 rounded-none border-0 bg-transparent"
            />
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
    </>
  )
}

function CodeWorkspacePanel({
  actions,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Set at the end of the tab strip, like a copy button. */
  actions?: React.ReactNode
}) {
  const { activeFile, openFiles, selectFile, closeFile, paths, replaced } =
    useCodeWorkspace()
  const stripRef = React.useRef<HTMLDivElement>(null)

  // Keeps the chosen tab in sight. Scrolled by hand, since `scrollIntoView`
  // would move the page along with the strip.
  React.useEffect(() => {
    const strip = stripRef.current
    const tab = strip?.querySelector<HTMLElement>("[aria-selected=true]")
    if (!strip || !tab) return
    const start = tab.offsetLeft - strip.offsetLeft
    const end = start + tab.offsetWidth
    if (start < strip.scrollLeft) strip.scrollLeft = start
    else if (end > strip.scrollLeft + strip.clientWidth) {
      strip.scrollLeft = end - strip.clientWidth
    }
  }, [activeFile, openFiles.length])

  return (
    <ResizablePanel
      minSize="30%"
      className={panelBody}
      style={{ overflow: "hidden" }}
    >
      <div
        data-slot="code-workspace-panel"
        className={cn(panelBody, className)}
        {...props}
      >
        <div className={cn(header, "ps-1.5")}>
          <div
            ref={stripRef}
            role="tablist"
            aria-label="Open files"
            className="flex min-w-0 [scrollbar-width:none] items-center gap-0.5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
          >
            {openFiles.map((path) => (
              <FileTab
                key={path}
                path={path}
                active={path === activeFile}
                replaced={replaced[path] !== undefined}
                onSelect={() => selectFile(path)}
                onClose={
                  openFiles.length > 1 ? () => closeFile(path) : undefined
                }
              />
            ))}
          </div>
          <OpenFile paths={paths} value={activeFile} onSelect={selectFile} />
          {actions ? (
            <div className="ms-auto flex shrink-0 items-center gap-0.5">
              {actions}
            </div>
          ) : null}
        </div>
        {activeFile ? (
          <CodeView key={activeFile} path={activeFile} />
        ) : (
          <p className="m-auto text-xs text-muted-foreground">No files</p>
        )}
      </div>
    </ResizablePanel>
  )
}

function FileTab({
  path,
  active,
  replaced,
  onSelect,
  onClose,
}: {
  path: string
  active: boolean
  replaced: boolean
  onSelect: () => void
  onClose?: () => void
}) {
  const { name } = splitTarget(path)

  return (
    <div
      data-slot="code-workspace-tab"
      data-active={active || undefined}
      className="group/tab flex h-7 max-w-44 shrink-0 items-center rounded-md text-muted-foreground transition-colors duration-80 hover:bg-muted hover:text-foreground motion-reduce:transition-none data-active:bg-muted data-active:text-foreground"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active}
        title={path}
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
        {replaced ? (
          <>
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-foreground/60"
            />
            <span className="sr-only">, replacement previewed</span>
          </>
        ) : null}
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

function OpenFile({
  paths,
  value,
  onSelect,
}: {
  paths: string[]
  value: string | null
  onSelect: (path: string) => void
}) {
  return (
    <Combobox
      items={paths}
      value={value}
      onValueChange={(next: string | null) => {
        if (next) onSelect(next)
      }}
    >
      <ComboboxPrimitive.Trigger
        aria-label="Open a file"
        title="Open a file"
        render={<Button variant="ghost" size="icon-xs" className="shrink-0" />}
      >
        <HugeiconsIcon aria-hidden icon={PlusSignIcon} className="size-3.5" />
      </ComboboxPrimitive.Trigger>
      <ComboboxContent className="w-72">
        <ComboboxInput
          showTrigger={false}
          placeholder="Open a file"
          aria-label="Open a file"
          className="[&_input]:text-xs"
        >
          <InputGroupAddon className="ps-3 text-muted-foreground/70">
            <HugeiconsIcon
              aria-hidden
              icon={Search01Icon}
              className="size-3.5"
            />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxEmpty>No files match</ComboboxEmpty>
        <ComboboxList>
          {(path: string) => (
            <ComboboxItem key={path} value={path} className="font-mono">
              {codeIconOf(path) ?? (
                <HugeiconsIcon aria-hidden icon={FileIcon} />
              )}
              <span className="truncate">{path}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function CodeView({ path }: { path: string }) {
  const { contentOf, languageOf, target } = useCodeWorkspace()
  const lines = useHighlightedLines(contentOf(path), languageOf(path))
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const line = target.line

  // Centres the line a search result pointed at, inside the pane only.
  React.useEffect(() => {
    const scroller = scrollRef.current
    const row = line
      ? scroller?.querySelector<HTMLElement>(`[data-line="${line}"]`)
      : null
    if (!scroller || !row) return
    scroller.scrollTop = Math.max(
      0,
      row.offsetTop - scroller.clientHeight / 2 + row.offsetHeight / 2
    )
  }, [line, target.id])

  return (
    <div
      ref={scrollRef}
      data-slot="code-workspace-code"
      className="min-h-0 flex-1 overflow-auto py-2 font-mono text-xs leading-5"
    >
      <div className="relative w-max min-w-full">
        {lines.map((tokens, index) => (
          <div
            key={index}
            data-line={index + 1}
            data-hit={line === index + 1 || undefined}
            className="group/line flex data-hit:bg-muted"
          >
            {/* Pinned while long lines scroll, and left out of a copy. */}
            <span
              aria-hidden
              className="sticky start-0 w-12 shrink-0 bg-background pe-4 text-end text-[11px] text-muted-foreground/70 tabular-nums select-none group-data-hit/line:bg-muted group-data-hit/line:text-foreground"
            >
              {index + 1}
            </span>
            <span className="pe-6 whitespace-pre">
              <CodeTokens tokens={tokens} />
              {tokens.length === 0 || tokens.every((t) => !t.content)
                ? "​"
                : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const hit = "rounded-[3px] bg-foreground/10 text-foreground"

function Marked({
  text,
  start,
  end,
}: {
  text: string
  start: number
  end: number
}) {
  if (start === -1) return text
  return (
    <>
      {text.slice(0, start)}
      <mark className={hit}>{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  )
}

function CodeWorkspaceSearch({
  scopes,
  onClose,
}: {
  scopes: readonly CodeWorkspaceScope[]
  onClose: () => void
}) {
  const {
    files,
    paths,
    activeFile,
    selectFile,
    contentOf,
    replaced,
    applyReplacements,
    revertReplacements,
  } = useCodeWorkspace()

  const [query, setQuery] = React.useState("")
  const [replacement, setReplacement] = React.useState("")
  const [replacing, setReplacing] = React.useState(false)
  const [matchCase, setMatchCase] = React.useState(false)
  const [wholeWord, setWholeWord] = React.useState(false)
  const [useRegex, setUseRegex] = React.useState(false)
  const [preserveCase, setPreserveCase] = React.useState(false)
  const [folded, setFolded] = React.useState<ReadonlySet<string>>(new Set())

  const deferredQuery = React.useDeferredValue(query)
  const deferredReplacement = React.useDeferredValue(replacement)
  const names = scopes.includes("names")
  const contents = scopes.includes("contents")

  let matcher: ReturnType<typeof buildMatcher> = null
  let patternError: string | null = null
  try {
    matcher = buildMatcher(deferredQuery, { matchCase, wholeWord, useRegex })
  } catch (error) {
    patternError =
      error instanceof InvalidPatternError ? error.message : "Invalid pattern"
  }

  const previewing = replacing && deferredReplacement.length > 0
  const sources: SourceFile[] = files.map((file) => ({
    target: file.path,
    path: file.path,
    content: contentOf(file.path),
  }))
  const nameResults = names && !patternError ? searchNames(paths, matcher) : []
  const textResults = contents
    ? searchContents(sources, matcher, {
        value: deferredReplacement,
        enabled: previewing,
        preserveCase,
      })
    : { results: [], total: 0, truncated: false }

  const replaceEverywhere = () => {
    if (!matcher) return
    const edits = textResults.results.flatMap((result) => {
      const { content, count } = replaceAll(
        contentOf(result.target),
        matcher,
        replacement,
        preserveCase
      )
      return count > 0 ? [{ path: result.target, content }] : []
    })
    if (edits.length > 0) applyReplacements(edits)
  }

  const replacedCount = Object.keys(replaced).length
  const both = names && contents

  const summary = patternError
    ? patternError
    : [
        names &&
          (deferredQuery && nameResults.length === 0
            ? both
              ? "No names match"
              : "No files match"
            : `${nameResults.length} ${plural(nameResults.length, both ? "name" : "file")}`),
        contents &&
          (!deferredQuery
            ? "Type to search text"
            : textResults.total === 0
              ? "No text matches"
              : `${textResults.truncated ? "First " : ""}${textResults.total} ${plural(textResults.total, "result")} in ${textResults.results.length} ${plural(textResults.results.length, "file")}`),
      ]
        .filter(Boolean)
        .join(" · ")

  const field =
    "min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:font-sans placeholder:text-muted-foreground/70"

  return (
    <div data-slot="code-workspace-search" className={panelBody}>
      {/* A row of the panel rather than a box inside it, like a menu's search. */}
      <div className="shrink-0 border-b border-border/60">
        <div className="flex h-9 items-center gap-1.5 ps-1.5 pe-1.5">
          <button
            type="button"
            aria-label="Replace"
            aria-expanded={replacing}
            onClick={() => setReplacing((open) => !open)}
            className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-transparent text-muted-foreground/70 transition-colors duration-80 outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:border-ring motion-reduce:transition-none dark:hover:bg-foreground/[0.09]"
          >
            <HugeiconsIcon
              aria-hidden
              icon={ArrowRight01Icon}
              className="size-3.5 transition-[rotate] duration-150 motion-reduce:transition-none rtl:-scale-x-100 [[aria-expanded=true]>&]:rotate-90 rtl:[[aria-expanded=true]>&]:-rotate-90"
            />
          </button>
          <input
            autoFocus
            type="text"
            spellCheck={false}
            autoComplete="off"
            aria-label="Search"
            aria-invalid={patternError ? true : undefined}
            value={query}
            placeholder={
              both
                ? "Search files and text"
                : names
                  ? "Search files"
                  : "Search text"
            }
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault()
                onClose()
              }
            }}
            className={cn(field, patternError && "text-destructive")}
          />
          <div className="flex shrink-0 items-center gap-0.5">
            <SearchOption
              label="Match case"
              pressed={matchCase}
              onPressedChange={setMatchCase}
            >
              Aa
            </SearchOption>
            <SearchOption
              label="Match whole word"
              pressed={wholeWord}
              onPressedChange={setWholeWord}
            >
              <span className="underline underline-offset-2">ab</span>
            </SearchOption>
            <SearchOption
              label="Use regular expression"
              pressed={useRegex}
              onPressedChange={setUseRegex}
            >
              .*
            </SearchOption>
          </div>
        </div>
        <div
          data-open={replacing || undefined}
          inert={!replacing}
          className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-280 ease-out motion-reduce:transition-none data-open:grid-rows-[1fr] data-open:opacity-100"
        >
          <div className="overflow-hidden">
            <div className="flex h-9 items-center gap-1.5 border-t border-border/60 ps-8 pe-1.5">
              <input
                type="text"
                spellCheck={false}
                autoComplete="off"
                aria-label="Replace with"
                value={replacement}
                placeholder="Replace"
                onChange={(event) => setReplacement(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") replaceEverywhere()
                }}
                className={field}
              />
              <SearchOption
                label="Preserve case"
                pressed={preserveCase}
                onPressedChange={setPreserveCase}
              >
                AB
              </SearchOption>
              <TooltipIconButton
                tooltip="Replace all"
                side="top"
                disabled={!contents || textResults.total === 0}
                onClick={replaceEverywhere}
                className="size-5 rounded-sm"
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={ArrowTurnBackwardIcon}
                  className="size-3.5 -scale-x-100 rtl:scale-x-100"
                />
              </TooltipIconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-8 shrink-0 items-center gap-2 ps-3 pe-1.5">
        <p
          aria-live="polite"
          className={cn(
            "min-w-0 flex-1 truncate text-xs text-muted-foreground",
            patternError && "text-destructive"
          )}
        >
          {summary}
        </p>
        {replacedCount > 0 ? (
          <Button
            variant="ghost"
            size="xs"
            onClick={revertReplacements}
            className="shrink-0"
          >
            <HugeiconsIcon
              aria-hidden
              data-icon="inline-start"
              icon={ArrowTurnBackwardIcon}
            />
            Undo {replacedCount === 1 ? "replace" : `${replacedCount} files`}
          </Button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-1.5 font-mono text-xs">
        {nameResults.length > 0 ? (
          <div role="group" aria-label="Files">
            {both ? <ScopeLabel>Files</ScopeLabel> : null}
            {nameResults.map((result) => (
              <button
                key={result.target}
                type="button"
                data-selected={result.target === activeFile || undefined}
                onClick={() => selectFile(result.target)}
                className={cn(row, "gap-1.5")}
              >
                {codeIconOf(result.name) ?? (
                  <HugeiconsIcon aria-hidden icon={FileIcon} />
                )}
                <span className="shrink-0 whitespace-nowrap text-foreground">
                  <Marked
                    text={result.name}
                    start={result.nameStart}
                    end={result.nameEnd}
                  />
                </span>
                {result.directory ? (
                  <span className="min-w-0 truncate text-[11px]">
                    <Marked
                      text={result.directory}
                      start={result.dirStart}
                      end={result.dirEnd}
                    />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}

        {textResults.results.length > 0 ? (
          <div role="group" aria-label="Text">
            {both ? <ScopeLabel className="mt-2">Text</ScopeLabel> : null}
            {textResults.results.map((file) => {
              const open = !folded.has(file.target)
              return (
                <div key={file.target} className="min-w-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() =>
                      setFolded((current) => {
                        const next = new Set(current)
                        if (!next.delete(file.target)) next.add(file.target)
                        return next
                      })
                    }
                    className={cn(row, "gap-1.5")}
                  >
                    <HugeiconsIcon
                      aria-hidden
                      icon={ArrowRight01Icon}
                      className={cn(
                        "size-3! transition-[rotate] duration-150 motion-reduce:transition-none rtl:-scale-x-100",
                        open && "rotate-90 rtl:-rotate-90"
                      )}
                    />
                    {codeIconOf(file.name) ?? (
                      <HugeiconsIcon aria-hidden icon={FileIcon} />
                    )}
                    <span className="shrink-0 whitespace-nowrap text-foreground">
                      {file.name}
                    </span>
                    {file.directory ? (
                      <span className="min-w-0 truncate text-[11px]">
                        {file.directory}
                      </span>
                    ) : null}
                    <span className="ms-auto shrink-0 ps-2 font-sans text-[11px] tabular-nums">
                      {file.matches.length + file.hidden}
                    </span>
                  </button>
                  {open
                    ? file.matches.map((match, index) => (
                        <button
                          key={`${match.line}-${match.start}-${index}`}
                          type="button"
                          onClick={() => selectFile(file.target, match.line)}
                          className={cn(row, "gap-2 ps-6")}
                        >
                          <span className="w-6 shrink-0 text-end font-sans text-[11px] text-muted-foreground/70 tabular-nums">
                            {match.line}
                          </span>
                          <span className="min-w-0 flex-1 truncate whitespace-pre">
                            {match.text.slice(0, match.start)}
                            {previewing && match.replacement !== null ? (
                              <>
                                <del className="rounded-[3px] bg-destructive/7 text-destructive line-through decoration-destructive/50">
                                  {match.text.slice(match.start, match.end)}
                                </del>
                                <ins className="rounded-[3px] bg-emerald-600/10 text-emerald-700 no-underline dark:bg-emerald-400/15 dark:text-emerald-400">
                                  {match.replacement}
                                </ins>
                              </>
                            ) : (
                              <mark className={hit}>
                                {match.text.slice(match.start, match.end)}
                              </mark>
                            )}
                            {match.text.slice(match.end)}
                          </span>
                        </button>
                      ))
                    : null}
                  {open && file.hidden > 0 ? (
                    <p className="py-1 ps-14 font-sans text-[11px] text-muted-foreground">
                      {file.hidden} more in this file
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const row =
  "flex h-7 w-full min-w-0 items-center rounded-md border border-transparent px-2 text-start text-muted-foreground transition-colors duration-80 outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring motion-reduce:transition-none data-selected:bg-muted [&_svg]:size-3.5 [&_svg]:shrink-0"

function plural(count: number, word: string) {
  return count === 1 ? word : `${word}s`
}

function ScopeLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "px-2 pt-1 pb-1 font-sans text-[11px] font-medium text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}

function SearchOption({
  label,
  pressed,
  onPressedChange,
  children,
}: {
  label: string
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  children: React.ReactNode
}) {
  return (
    <Toggle
      size="sm"
      aria-label={label}
      title={label}
      pressed={pressed}
      onPressedChange={onPressedChange}
      className="size-5 min-w-5 rounded-sm px-0 font-mono text-[10px] leading-none tracking-tight"
    >
      {children}
    </Toggle>
  )
}

export {
  CodeWorkspace,
  CodeWorkspacePanel,
  CodeWorkspaceSidebar,
  useCodeWorkspace,
}
export type { CodeWorkspaceFile, CodeWorkspaceScope }
