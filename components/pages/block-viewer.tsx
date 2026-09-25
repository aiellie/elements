"use client"

import * as React from "react"
import {
  ArrowRight01Icon,
  ComputerTerminal01Icon,
  Copy01Icon,
  File02Icon,
  Folder01Icon,
  FullScreenIcon,
  MonitorIcon,
  Refresh01Icon,
  SmartPhone01Icon,
  Tablet01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import type { PanelImperativeHandle } from "react-resizable-panels"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import type {
  RegistryFile,
  RegistryFileTree,
  RegistryItem,
} from "@/lib/registry"
import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { Button } from "@/registry/aiellie/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/aiellie/ui/resizable"
import { Separator } from "@/registry/aiellie/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/registry/aiellie/ui/tabs"

type HighlightedRegistryFile = RegistryFile & {
  highlightedContent: string
}

type BlockViewerItem = Pick<RegistryItem, "name" | "title" | "description">
type BlockViewerView = "preview" | "code"
type Viewport = "desktop" | "tablet" | "mobile" | null

type BlockViewerContextValue = {
  item: BlockViewerItem
  tree: RegistryFileTree[]
  highlightedFiles: HighlightedRegistryFile[]
  view: BlockViewerView
  setView: React.Dispatch<React.SetStateAction<BlockViewerView>>
  activeFile: string | null
  setActiveFile: React.Dispatch<React.SetStateAction<string | null>>
  previewPanelRef: React.RefObject<PanelImperativeHandle | null>
  iframeKey: number
  refreshPreview: () => void
}

const BlockViewerContext = React.createContext<BlockViewerContextValue | null>(
  null
)

const VIEWPORTS = [
  { id: "desktop", label: "Desktop", size: "100%", icon: MonitorIcon },
  { id: "tablet", label: "Tablet", size: "60%", icon: Tablet01Icon },
  { id: "mobile", label: "Mobile", size: "34%", icon: SmartPhone01Icon },
] satisfies {
  id: Exclude<Viewport, null>
  label: string
  size: string
  icon: IconSvgElement
}[]

const TREE_INDENTS = ["ps-2", "ps-5", "ps-8", "ps-12", "ps-16"]

function useBlockViewer() {
  const context = React.useContext(BlockViewerContext)
  if (!context) {
    throw new Error("useBlockViewer must be used within BlockViewer")
  }
  return context
}

function BlockViewerProvider({
  item,
  tree,
  highlightedFiles,
  children,
}: {
  item: BlockViewerItem
  tree: RegistryFileTree[]
  highlightedFiles: HighlightedRegistryFile[]
  children: React.ReactNode
}) {
  const [view, setView] = React.useState<BlockViewerView>("preview")
  const [activeFile, setActiveFile] = React.useState<string | null>(
    highlightedFiles[0]?.target ?? null
  )
  const [iframeKey, setIframeKey] = React.useState(0)
  const previewPanelRef = React.useRef<PanelImperativeHandle>(null)

  const value = React.useMemo(
    () => ({
      item,
      tree,
      highlightedFiles,
      view,
      setView,
      activeFile,
      setActiveFile,
      previewPanelRef,
      iframeKey,
      refreshPreview: () => setIframeKey((key) => key + 1),
    }),
    [item, tree, highlightedFiles, view, activeFile, iframeKey]
  )

  return (
    <BlockViewerContext.Provider value={value}>
      {children}
    </BlockViewerContext.Provider>
  )
}

function PreviewFrame({ className }: { className?: string }) {
  const { item, iframeKey } = useBlockViewer()

  return (
    <iframe
      key={iframeKey}
      src={`/view/${item.name}`}
      title={`${item.title} preview`}
      className={cn("h-full w-full bg-background", className)}
    />
  )
}

function ViewportControls() {
  const { item, view, setView, previewPanelRef, refreshPreview } =
    useBlockViewer()
  const [viewport, setViewport] = React.useState<Viewport>("desktop")

  const resize = (next: (typeof VIEWPORTS)[number]) => {
    setView("preview")
    setViewport(next.id)
    previewPanelRef.current?.resize(next.size)
  }

  return (
    <div className="flex h-8 items-center gap-0.5 rounded-md border border-border/60 bg-background p-0.5">
      {VIEWPORTS.map((option) => (
        <TooltipIconButton
          key={option.id}
          tooltip={option.label}
          aria-label={option.label}
          aria-pressed={view === "preview" && viewport === option.id}
          className={cn(
            "size-6 rounded-sm",
            view === "preview" &&
              viewport === option.id &&
              "bg-accent text-foreground [&_svg]:text-foreground"
          )}
          onClick={() => resize(option)}
        >
          <HugeiconsIcon aria-hidden icon={option.icon} />
        </TooltipIconButton>
      ))}
      <Separator
        orientation="vertical"
        className="mx-1 data-vertical:h-4 data-vertical:self-center"
      />
      <TooltipIconButton
        tooltip="Open in new tab"
        aria-label="Open in new tab"
        className="size-6 rounded-sm"
        onClick={() =>
          window.open(`/view/${item.name}`, "_blank", "noopener,noreferrer")
        }
      >
        <HugeiconsIcon aria-hidden icon={FullScreenIcon} />
      </TooltipIconButton>
      <Separator
        orientation="vertical"
        className="mx-1 data-vertical:h-4 data-vertical:self-center"
      />
      <TooltipIconButton
        tooltip="Refresh preview"
        aria-label="Refresh preview"
        className="size-6 rounded-sm"
        onClick={refreshPreview}
      >
        <HugeiconsIcon aria-hidden icon={Refresh01Icon} />
      </TooltipIconButton>
    </div>
  )
}

function InstallButton() {
  const { item } = useBlockViewer()
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const command = `npx aiellie add ${item.name}`

  return (
    <Button
      variant="outline"
      size="sm"
      className="max-w-60 gap-1.5 font-mono text-xs"
      onClick={() => copyToClipboard(command)}
    >
      <HugeiconsIcon
        aria-hidden
        icon={isCopied ? Tick02Icon : ComputerTerminal01Icon}
      />
      <span className="truncate">{command}</span>
    </Button>
  )
}

function BlockViewerToolbar() {
  const { item, view, setView } = useBlockViewer()

  return (
    <div className="hidden min-w-0 items-center gap-2 lg:flex">
      <Tabs
        value={view}
        onValueChange={(value) => setView(value as BlockViewerView)}
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="preview" className="px-2 text-xs">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="px-2 text-xs">
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Separator
        orientation="vertical"
        className="mx-1 data-vertical:h-4 data-vertical:self-center"
      />
      <a
        href={`#${item.name}`}
        className="min-w-0 flex-1 truncate text-sm font-medium"
      >
        {item.description.replace(/\.$/, "")}
      </a>
      <div className="ms-auto flex shrink-0 items-center gap-2">
        <ViewportControls />
        <Separator
          orientation="vertical"
          className="mx-1 data-vertical:h-4 data-vertical:self-center"
        />
        <InstallButton />
      </div>
    </div>
  )
}

function BlockViewerPreview() {
  const { view, previewPanelRef } = useBlockViewer()

  return (
    <div
      className={cn(
        "relative hidden h-(--block-viewer-height) overflow-hidden rounded-xl lg:block",
        view !== "preview" && "lg:hidden"
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-xl border border-border/60 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px]"
      />
      <ResizablePanelGroup
        orientation="horizontal"
        className="relative h-full overflow-visible"
      >
        <ResizablePanel
          id="block-preview"
          panelRef={previewPanelRef}
          defaultSize="100%"
          minSize="30%"
          className="relative overflow-hidden rounded-xl border border-border/60 bg-background"
        >
          <PreviewFrame />
        </ResizablePanel>
        <ResizableHandle
          id="block-preview-handle"
          withHandle
          className="z-10 w-0 border-0 bg-transparent after:start-0 after:w-3 after:translate-x-0 [&>div]:h-8 [&>div]:translate-x-1 [&>div]:bg-muted-foreground/50 [&>div]:opacity-100 rtl:[&>div]:-translate-x-1"
        />
        <ResizablePanel
          id="block-preview-space"
          defaultSize="0%"
          minSize="0%"
        />
      </ResizablePanelGroup>
    </div>
  )
}

function FileTreeNode({
  node,
  depth,
}: {
  node: RegistryFileTree
  depth: number
}) {
  const { activeFile, setActiveFile } = useBlockViewer()
  const [open, setOpen] = React.useState(true)
  const indent = TREE_INDENTS[Math.min(depth, TREE_INDENTS.length - 1)]

  if (node.children) {
    return (
      <li role="treeitem" aria-expanded={open} aria-selected={false}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-full justify-start rounded-none border border-transparent pe-2 text-muted-foreground focus-visible:border-ring",
            indent
          )}
          onClick={() => setOpen((value) => !value)}
        >
          <HugeiconsIcon
            aria-hidden
            icon={ArrowRight01Icon}
            className={cn(
              "transition-transform duration-150 motion-reduce:transition-none rtl:-scale-x-100",
              open && "rotate-90 rtl:rotate-90"
            )}
          />
          <HugeiconsIcon aria-hidden icon={Folder01Icon} />
          <span className="truncate">{node.name}</span>
        </Button>
        {open ? (
          <ul role="group">
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path ?? `${node.name}/${child.name}`}
                node={child}
                depth={depth + 1}
              />
            ))}
          </ul>
        ) : null}
      </li>
    )
  }

  const active = node.path === activeFile

  return (
    <li role="treeitem" aria-selected={active}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-full justify-start rounded-none border border-transparent pe-2 text-muted-foreground focus-visible:border-ring",
          active && "bg-accent text-foreground",
          indent
        )}
        onClick={() => setActiveFile(node.path ?? null)}
      >
        <span className="size-4 shrink-0" />
        <HugeiconsIcon aria-hidden icon={File02Icon} />
        <span className="truncate">{node.name}</span>
      </Button>
    </li>
  )
}

function BlockViewerFileTree() {
  const { tree } = useBlockViewer()

  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-border/60 bg-muted/30">
      <div className="flex h-12 shrink-0 items-center border-b border-border/60 px-4 text-sm font-medium">
        Files
      </div>
      <div className="min-h-0 flex-1 overflow-auto py-1">
        <ul role="tree">
          {tree.map((node) => (
            <FileTreeNode key={node.path ?? node.name} node={node} depth={0} />
          ))}
        </ul>
      </div>
    </aside>
  )
}

function CopyCodeButton({ content }: { content: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <TooltipIconButton
      tooltip={isCopied ? "Copied" : "Copy code"}
      aria-label={isCopied ? "Copied" : "Copy code"}
      className="size-7"
      onClick={() => copyToClipboard(content)}
    >
      <HugeiconsIcon aria-hidden icon={isCopied ? Tick02Icon : Copy01Icon} />
    </TooltipIconButton>
  )
}

function BlockViewerCode() {
  const { activeFile, highlightedFiles, view } = useBlockViewer()
  const file = highlightedFiles.find(
    (candidate) => candidate.target === activeFile
  )

  if (!file) return null

  return (
    <div
      data-slot="block-viewer-code"
      className={cn(
        "hidden h-(--block-viewer-height) overflow-hidden rounded-xl border border-border/60 bg-background lg:flex",
        view !== "code" && "lg:hidden"
      )}
    >
      <BlockViewerFileTree />
      <figure className="flex min-w-0 flex-1 flex-col">
        <figcaption className="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 px-4 text-sm">
          <HugeiconsIcon
            aria-hidden
            icon={File02Icon}
            className="size-4 text-muted-foreground"
          />
          <span className="truncate font-mono text-xs">{file.target}</span>
          <div className="ms-auto">
            <CopyCodeButton content={file.content} />
          </div>
        </figcaption>
        <div
          key={file.path}
          dangerouslySetInnerHTML={{ __html: file.highlightedContent }}
          className="min-h-0 flex-1 overflow-auto text-code-block [&_pre]:min-h-full [&_pre]:py-4"
        />
      </figure>
    </div>
  )
}

function BlockViewerMobile() {
  const { item } = useBlockViewer()

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <div className="flex items-center gap-2 px-2">
        <p className="line-clamp-1 text-sm font-medium">{item.description}</p>
        <span className="ms-auto shrink-0 font-mono text-xs text-muted-foreground">
          {item.name}
        </span>
      </div>
      <div className="h-[min(680px,75svh)] overflow-hidden rounded-xl border border-border/60 bg-background">
        <PreviewFrame />
      </div>
    </div>
  )
}

function BlockViewer({
  item,
  tree,
  highlightedFiles,
}: {
  item: BlockViewerItem
  tree: RegistryFileTree[]
  highlightedFiles: HighlightedRegistryFile[]
}) {
  return (
    <BlockViewerProvider
      item={item}
      tree={tree}
      highlightedFiles={highlightedFiles}
    >
      <section
        id={item.name}
        className="flex min-w-0 flex-col gap-4 overflow-hidden md:col-span-2 xl:col-span-3"
        style={
          {
            "--block-viewer-height": "min(720px, calc(100svh - 96px))",
          } as React.CSSProperties
        }
      >
        <BlockViewerToolbar />
        <BlockViewerPreview />
        <BlockViewerCode />
        <BlockViewerMobile />
        <style>{`
          .dark [data-slot="block-viewer-code"] pre span {
            color: var(--shiki-dark) !important;
            font-style: var(--shiki-dark-font-style) !important;
            font-weight: var(--shiki-dark-font-weight) !important;
            text-decoration: var(--shiki-dark-text-decoration) !important;
          }
        `}</style>
      </section>
    </BlockViewerProvider>
  )
}

export { BlockViewer }
export type { HighlightedRegistryFile }
