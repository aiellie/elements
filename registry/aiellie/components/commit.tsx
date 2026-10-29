"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  ArrowRight01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/aiellie/ui/avatar"

type CommitFileStatus = "added" | "modified" | "removed"

type CommitFile = {
  path: string
  status?: CommitFileStatus
  additions?: number
  deletions?: number
}

// The same marks and ink as File Tree and Code Diff, so green means added in
// all three.
const STATUS = {
  added: {
    mark: "+",
    label: "Added",
    tone: "text-emerald-600 dark:text-emerald-400",
  },
  modified: { mark: "•", label: "Changed", tone: "text-muted-foreground" },
  removed: { mark: "−", label: "Removed", tone: "text-destructive" },
} satisfies Record<
  CommitFileStatus,
  { mark: string; label: string; tone: string }
>

const CommitContext = React.createContext<CommitFile[]>([])

function Commit({
  files = [],
  className,
  ...props
}: React.ComponentProps<typeof Collapsible.Root> & {
  /** What the commit changed, listed when it's opened. */
  files?: CommitFile[]
}) {
  return (
    <CommitContext.Provider value={files}>
      <Collapsible.Root
        data-slot="commit"
        className={cn(
          "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background text-sm",
          className
        )}
        {...props}
      />
    </CommitContext.Provider>
  )
}

function CommitHeader({
  message,
  author,
  avatar,
  time,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** The commit's subject line. */
  message: React.ReactNode
  author?: string
  /** A picture of the author. Their initials stand in without one. */
  avatar?: string
  /** When it was made, like a `Timestamp`. */
  time?: React.ReactNode
}) {
  const files = React.useContext(CommitContext)
  const added = files.reduce((sum, file) => sum + (file.additions ?? 0), 0)
  const removed = files.reduce((sum, file) => sum + (file.deletions ?? 0), 0)
  const initials = author
    ?.split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div
      data-slot="commit-header"
      className={cn("flex min-w-0 items-start gap-1 p-1.5", className)}
      {...props}
    >
      <Collapsible.Trigger
        disabled={files.length === 0}
        className="group/commit-trigger flex min-w-0 flex-1 items-start gap-2.5 rounded-md border border-transparent px-1.5 py-1 text-start outline-none focus-visible:border-ring"
      >
        {author ? (
          <Avatar size="sm" className="mt-0.5">
            {avatar ? <AvatarImage src={avatar} alt="" /> : null}
            <AvatarFallback className="text-[0.625rem]">
              {initials}
            </AvatarFallback>
          </Avatar>
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="min-w-0 leading-5 font-medium wrap-break-word">
            {message}
          </span>
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            {author ? <span className="truncate">{author}</span> : null}
            {author && time ? <span aria-hidden>·</span> : null}
            {time ? <span className="shrink-0">{time}</span> : null}
          </span>
        </span>
        {files.length > 0 ? (
          <span className="mt-0.5 flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span className="sr-only">
              {files.length} {files.length === 1 ? "file" : "files"},
            </span>
            <span className="flex items-center gap-1.5 font-mono tabular-nums">
              <span className="text-emerald-600 dark:text-emerald-400">
                <span className="sr-only">Added </span>+{added}
              </span>
              <span className="text-destructive">
                <span className="sr-only">Removed </span>−{removed}
              </span>
            </span>
            <HugeiconsIcon
              aria-hidden
              icon={ArrowRight01Icon}
              className="size-3.5 transition-[rotate] duration-150 group-data-panel-open/commit-trigger:rotate-90 motion-reduce:transition-none rtl:-scale-x-100"
            />
          </span>
        ) : null}
      </Collapsible.Trigger>
      {children ? (
        <div className="flex shrink-0 items-center gap-0.5">{children}</div>
      ) : null}
    </div>
  )
}

function CommitHash({
  hash,
  length = 7,
  tooltip = "Copy hash",
  className,
  ...props
}: Omit<React.ComponentProps<typeof TooltipIconButton>, "tooltip"> & {
  /** The full hash, which is what gets copied. */
  hash: string
  /** How much of it to show. */
  length?: number
  tooltip?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <TooltipIconButton
      data-slot="commit-hash"
      tooltip={copied ? "Copied" : tooltip}
      onClick={() =>
        navigator.clipboard.writeText(hash).then(() => setCopied(true))
      }
      className={cn(
        "h-6 w-auto gap-1 px-1.5 font-mono text-xs text-muted-foreground hover:text-foreground active:scale-[0.97]",
        className
      )}
      {...props}
    >
      <span dir="ltr">{hash.slice(0, length)}</span>
      <HugeiconsIcon
        aria-hidden
        icon={copied ? Tick02Icon : Copy01Icon}
        className="size-3!"
      />
    </TooltipIconButton>
  )
}

function CommitFiles({
  onOpenFile,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible.Panel>, "children"> & {
  /** Makes each path a button. */
  onOpenFile?: (file: CommitFile) => void
}) {
  const files = React.useContext(CommitContext)

  return (
    <Collapsible.Panel
      data-slot="commit-files"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <ul className="flex flex-col border-t border-border/60 py-1.5">
        {files.map((file) => {
          const status = STATUS[file.status ?? "modified"]
          const path = (
            <span dir="ltr" className="min-w-0 truncate">
              {file.path}
            </span>
          )

          return (
            <li
              key={file.path}
              data-status={file.status ?? "modified"}
              className="flex h-7 min-w-0 items-center gap-2 px-3 font-mono text-xs"
            >
              <span
                aria-hidden
                className={cn("w-2 shrink-0 text-center", status.tone)}
              >
                {status.mark}
              </span>
              <span className="sr-only">{status.label}: </span>
              {onOpenFile ? (
                <button
                  type="button"
                  onClick={() => onOpenFile(file)}
                  className="-mx-1 flex min-w-0 rounded-sm border border-transparent px-1 text-start transition-colors duration-80 outline-none hover:text-muted-foreground focus-visible:border-ring motion-reduce:transition-none"
                >
                  {path}
                </button>
              ) : (
                path
              )}
              <span className="ms-auto flex shrink-0 items-center gap-1.5 tabular-nums">
                {file.additions ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    <span className="sr-only">Added </span>+{file.additions}
                  </span>
                ) : null}
                {file.deletions ? (
                  <span className="text-destructive">
                    <span className="sr-only">Removed </span>−{file.deletions}
                  </span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ul>
    </Collapsible.Panel>
  )
}

export { Commit, CommitFiles, CommitHash, CommitHeader }
export type { CommitFile, CommitFileStatus }
