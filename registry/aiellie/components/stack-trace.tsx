"use client"

import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  AlertCircleIcon,
  ArrowRight01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

type StackFrame = {
  /** The function, when the trace names one. */
  name?: string
  file: string
  line?: number
  column?: number
  /** In `node_modules` or Node's own internals, so folded away by default. */
  library: boolean
  raw: string
}

type ParsedStackTrace = {
  type: string
  message: string
  frames: StackFrame[]
}

// V8 writes "at name (file:1:2)" or "at file:1:2"; Firefox and Safari write
// "name@file:1:2".
const V8_FRAME = /^\s*at (?:(.+?) \()?(.+?)(?::(\d+))?(?::(\d+))?\)?$/
const GECKO_FRAME = /^\s*(.*?)@(.+?)(?::(\d+))?(?::(\d+))?$/

function parseStackTrace(trace: string): ParsedStackTrace {
  const lines = trace.trim().split("\n")
  const head = lines[0] ?? ""
  const colon = head.indexOf(": ")
  const frames: StackFrame[] = []

  for (const raw of lines.slice(1)) {
    const match = V8_FRAME.exec(raw) ?? GECKO_FRAME.exec(raw)
    if (!match) continue
    const [, name, location, line, column] = match
    const file = location.replace(/^(?:file|webpack(?:-internal)?):\/\/\/?/, "")
    frames.push({
      name: name || undefined,
      file,
      line: line ? Number(line) : undefined,
      column: column ? Number(column) : undefined,
      library: /node_modules|^node:|^internal\//.test(file),
      raw: raw.trim(),
    })
  }

  return colon > 0
    ? { type: head.slice(0, colon), message: head.slice(colon + 2), frames }
    : { type: "Error", message: head, frames }
}

type StackTraceContextValue = ParsedStackTrace & {
  trace: string
  onOpenFile?: (frame: StackFrame) => void
}

const StackTraceContext = React.createContext<StackTraceContextValue | null>(
  null
)

function useStackTrace() {
  const context = React.useContext(StackTraceContext)
  if (!context)
    throw new Error("StackTrace parts must be used inside <StackTrace>")
  return context
}

function StackTrace({
  trace,
  onOpenFile,
  className,
  ...props
}: React.ComponentProps<typeof Collapsible.Root> & {
  /** The error's text as it was printed, from `error.stack` or a log. */
  trace: string
  /** Makes each frame's file a button. Left out, files are plain text. */
  onOpenFile?: (frame: StackFrame) => void
}) {
  const parsed = React.useMemo(() => parseStackTrace(trace), [trace])

  return (
    <StackTraceContext.Provider value={{ ...parsed, trace, onOpenFile }}>
      <Collapsible.Root
        data-slot="stack-trace"
        className={cn(
          "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background text-sm",
          className
        )}
        {...props}
      />
    </StackTraceContext.Provider>
  )
}

function StackTraceHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { type, message, frames } = useStackTrace()

  return (
    <div
      data-slot="stack-trace-header"
      className={cn(
        "flex min-w-0 items-start gap-1 py-1.5 ps-1.5 pe-1.5",
        className
      )}
      {...props}
    >
      <Collapsible.Trigger
        disabled={frames.length === 0}
        className="group/stack-trace-trigger flex min-w-0 flex-1 items-start gap-2 rounded-md border border-transparent px-1.5 py-1 text-start outline-none focus-visible:border-ring"
      >
        <HugeiconsIcon
          aria-hidden
          icon={AlertCircleIcon}
          className="mt-0.5 size-4 shrink-0 text-destructive"
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-mono text-xs/5 font-medium text-destructive">
            {type}
          </span>
          <span className="min-w-0 leading-5 wrap-break-word">{message}</span>
        </span>
        {frames.length > 0 ? (
          <span className="mt-0.5 flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            {frames.length} {frames.length === 1 ? "frame" : "frames"}
            <HugeiconsIcon
              aria-hidden
              icon={ArrowRight01Icon}
              className="size-3.5 transition-[rotate] duration-150 group-data-panel-open/stack-trace-trigger:rotate-90 motion-reduce:transition-none rtl:-scale-x-100"
            />
          </span>
        ) : null}
      </Collapsible.Trigger>
      {children ? (
        <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
          {children}
        </div>
      ) : null}
    </div>
  )
}

function StackTraceCopy({
  tooltip = "Copy trace",
  ...props
}: Omit<React.ComponentProps<typeof TooltipIconButton>, "tooltip"> & {
  tooltip?: string
}) {
  const { trace } = useStackTrace()
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <TooltipIconButton
      data-slot="stack-trace-copy"
      tooltip={copied ? "Copied" : tooltip}
      onClick={() =>
        navigator.clipboard.writeText(trace).then(() => setCopied(true))
      }
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={copied ? Tick02Icon : Copy01Icon} />
    </TooltipIconButton>
  )
}

function StackTraceFrames({
  showLibrary: showLibraryProp,
  className,
  ...props
}: React.ComponentProps<typeof Collapsible.Panel> & {
  /** Shows frames from `node_modules` and Node internals from the start. */
  showLibrary?: boolean
}) {
  const { frames, onOpenFile } = useStackTrace()
  const [showLibrary, setShowLibrary] = React.useState(showLibraryProp ?? false)
  const hidden = frames.filter((frame) => frame.library).length
  const shown = showLibrary ? frames : frames.filter((frame) => !frame.library)

  return (
    <Collapsible.Panel
      data-slot="stack-trace-frames"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:h-0 data-ending-style:opacity-0 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div className="flex flex-col border-t border-border/60 bg-muted/40 py-1.5">
        <ol dir="ltr" className="flex flex-col font-mono text-xs">
          {shown.map((frame, index) => (
            <li
              key={`${frame.raw}-${index}`}
              data-library={frame.library || undefined}
              className="flex min-h-7 min-w-0 items-center gap-2 px-3 data-library:text-muted-foreground"
            >
              <span className="w-28 shrink-0 truncate" title={frame.name}>
                {frame.name ?? "<anonymous>"}
              </span>
              {onOpenFile && !frame.library ? (
                <button
                  type="button"
                  onClick={() => onOpenFile(frame)}
                  className="-mx-1 min-w-0 truncate rounded-sm border border-transparent px-1 text-start text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:border-ring motion-reduce:transition-none"
                >
                  <FrameLocation frame={frame} />
                </button>
              ) : (
                <span className="min-w-0 truncate text-muted-foreground">
                  <FrameLocation frame={frame} />
                </span>
              )}
            </li>
          ))}
        </ol>
        {hidden > 0 ? (
          <button
            type="button"
            aria-expanded={showLibrary}
            onClick={() => setShowLibrary((value) => !value)}
            className="mx-1.5 mt-0.5 flex h-7 w-fit items-center rounded-md border border-transparent px-1.5 text-xs text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:border-ring motion-reduce:transition-none"
          >
            {showLibrary
              ? `Hide ${hidden} library ${hidden === 1 ? "frame" : "frames"}`
              : `Show ${hidden} library ${hidden === 1 ? "frame" : "frames"}`}
          </button>
        ) : null}
      </div>
    </Collapsible.Panel>
  )
}

function FrameLocation({ frame }: { frame: StackFrame }) {
  return (
    <>
      {frame.file}
      {frame.line !== undefined ? (
        <span>
          :{frame.line}
          {frame.column !== undefined ? `:${frame.column}` : null}
        </span>
      ) : null}
    </>
  )
}

export {
  StackTrace,
  StackTraceCopy,
  StackTraceFrames,
  StackTraceHeader,
  parseStackTrace,
}
export type { ParsedStackTrace, StackFrame }
