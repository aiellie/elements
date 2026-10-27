"use client"

import * as React from "react"
import {
  ArrowRight01Icon,
  FileIcon,
  Folder01Icon,
  Folder02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { codeIconOf } from "@/registry/aiellie/components/code-block"

type FileStatus = "added" | "modified" | "removed"

type FileNode = {
  name: string
  /** Makes it a folder, even when empty. */
  children?: FileNode[]
  status?: FileStatus
  /** Folders start closed unless this is set. */
  defaultOpen?: boolean
}

type Row = {
  node: FileNode
  path: string
  parent: string
  depth: number
  folder: boolean
  open: boolean
}

// The same ink as a diff, so green means added in both.
const STATUS = {
  added: { mark: "+", tone: "text-emerald-600 dark:text-emerald-400" },
  modified: { mark: "•", tone: "text-muted-foreground" },
  removed: { mark: "−", tone: "text-destructive" },
} satisfies Record<FileStatus, { mark: string; tone: string }>

// The rows on screen, in the order the arrow keys walk them. The nesting the
// flat list loses goes back in through `aria-level`.
function flatten(
  nodes: readonly FileNode[],
  open: ReadonlySet<string>,
  depth = 0,
  parent = ""
): Row[] {
  return nodes.flatMap((node) => {
    const path = parent ? `${parent}/${node.name}` : node.name
    const folder = node.children !== undefined
    const isOpen = folder && open.has(path)
    const row = { node, path, parent, depth, folder, open: isOpen }
    return isOpen
      ? [row, ...flatten(node.children ?? [], open, depth + 1, path)]
      : [row]
  })
}

function openByDefault(nodes: readonly FileNode[], parent = ""): string[] {
  return nodes.flatMap((node) => {
    if (node.children === undefined) return []
    const path = parent ? `${parent}/${node.name}` : node.name
    return [
      ...(node.defaultOpen ? [path] : []),
      ...openByDefault(node.children, path),
    ]
  })
}

function FileTree({
  nodes,
  selected,
  onSelect,
  className,
  "aria-label": label = "Files",
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "onSelect"> & {
  nodes: readonly FileNode[]
  /** The chosen file's path from the root, like `app/page.tsx`. */
  selected?: string
  onSelect?: (path: string) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState<ReadonlySet<string>>(
    () => new Set(openByDefault(nodes))
  )
  const rows = React.useMemo(() => flatten(nodes, open), [nodes, open])

  // One tab stop for the whole tree, held by path so opening a folder above
  // it doesn't move it.
  const [active, setActive] = React.useState<string>()
  const current =
    active && rows.some((row) => row.path === active) ? active : rows[0]?.path

  const toggle = (path: string) =>
    setOpen((previous) => {
      const next = new Set(previous)
      if (!next.delete(path)) next.add(path)
      return next
    })

  const focus = (path?: string) => {
    if (!path) return
    setActive(path)
    ref.current
      ?.querySelector<HTMLElement>(`[data-path="${CSS.escape(path)}"]`)
      ?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = rows.findIndex((row) => row.path === current)
    const row = rows[index]
    if (!row) return
    const rtl = ref.current && getComputedStyle(ref.current).direction === "rtl"
    const inwards = rtl ? "ArrowLeft" : "ArrowRight"
    const outwards = rtl ? "ArrowRight" : "ArrowLeft"

    if (event.key === "ArrowDown") focus(rows[index + 1]?.path)
    else if (event.key === "ArrowUp") focus(rows[index - 1]?.path)
    else if (event.key === "Home") focus(rows[0]?.path)
    else if (event.key === "End") focus(rows.at(-1)?.path)
    else if (event.key === inwards && row.folder) {
      if (row.open) focus(rows[index + 1]?.path)
      else toggle(row.path)
    } else if (event.key === outwards) {
      if (row.folder && row.open) toggle(row.path)
      else focus(row.parent || undefined)
    } else return
    event.preventDefault()
  }

  const siblings = new Map<string, Row[]>()
  for (const row of rows) {
    siblings.set(row.parent, [...(siblings.get(row.parent) ?? []), row])
  }

  return (
    <div
      ref={ref}
      data-slot="file-tree"
      role="tree"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "flex w-full min-w-0 flex-col overflow-y-auto rounded-xl border border-border/60 bg-background py-1.5 font-mono text-xs",
        className
      )}
      {...props}
    >
      {rows.map((row) => {
        const group = siblings.get(row.parent) ?? []
        const isSelected = !row.folder && selected === row.path
        const status = row.node.status ? STATUS[row.node.status] : null
        const mark = row.folder ? null : codeIconOf(row.node.name)

        return (
          <button
            key={row.path}
            type="button"
            role="treeitem"
            data-slot="file-tree-item"
            data-path={row.path}
            data-status={row.node.status}
            data-selected={isSelected || undefined}
            tabIndex={row.path === current ? 0 : -1}
            aria-level={row.depth + 1}
            aria-setsize={group.length}
            aria-posinset={group.indexOf(row) + 1}
            aria-expanded={row.folder ? row.open : undefined}
            aria-selected={row.folder ? undefined : isSelected}
            onFocus={() => setActive(row.path)}
            onClick={() =>
              row.folder ? toggle(row.path) : onSelect?.(row.path)
            }
            // Depth as padding, so hover and selection span the whole width.
            style={{ paddingInlineStart: `${0.5 + row.depth * 0.875}rem` }}
            className="mx-1.5 flex h-7 min-w-0 cursor-pointer items-center gap-1.5 rounded-md border border-transparent pe-2 text-start text-muted-foreground transition-colors duration-80 outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring motion-reduce:transition-none data-selected:bg-muted data-selected:text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0"
          >
            {row.folder ? (
              <HugeiconsIcon
                aria-hidden
                icon={ArrowRight01Icon}
                className={cn(
                  "size-3! transition-transform duration-150 motion-reduce:transition-none rtl:-scale-x-100",
                  row.open && "rotate-90 rtl:-rotate-90"
                )}
              />
            ) : (
              <span aria-hidden className="size-3 shrink-0" />
            )}
            {row.folder ? (
              <HugeiconsIcon
                aria-hidden
                icon={row.open ? Folder02Icon : Folder01Icon}
              />
            ) : (
              (mark ?? <HugeiconsIcon aria-hidden icon={FileIcon} />)
            )}
            <span
              className={cn(
                "min-w-0 truncate",
                row.node.status === "removed" &&
                  "line-through decoration-muted-foreground/50"
              )}
            >
              {row.node.name}
            </span>
            {status ? (
              <span className={cn("ms-auto shrink-0 ps-2", status.tone)}>
                <span aria-hidden>{status.mark}</span>
                <span className="sr-only">{row.node.status}</span>
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export { FileTree }
export type { FileNode, FileStatus }
