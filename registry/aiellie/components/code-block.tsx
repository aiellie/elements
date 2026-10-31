"use client"

import * as React from "react"
import {
  Copy01Icon,
  Download01Icon,
  FileIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"
import { codeIcons, type CodeIconName } from "@/registry/aiellie/icons"
import type { CodeToken } from "@/registry/aiellie/lib/highlight-code"

const ICON_ALIASES: Record<string, CodeIconName> = {
  javascript: "js",
  jsx: "tsx",
  mjs: "js",
  cjs: "js",
  typescript: "ts",
  mts: "ts",
  py: "python",
  rs: "rust",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  markdown: "md",
  mdx: "md",
}

// Takes a file name or a language, so `use-tick.ts` and `typescript` land on
// the same mark.
function codeIconOf(name: string) {
  const base = (name.split("/").pop() ?? name).toLowerCase()
  const key =
    base === ".env" || base.startsWith(".env.")
      ? "env"
      : (base.split(".").pop() ?? base)
  const icon = Object.hasOwn(codeIcons, key)
    ? (key as CodeIconName)
    : ICON_ALIASES[key]
  // Called rather than rendered: the marks are plain drawings with no state.
  return icon ? codeIcons[icon]({}) : null
}

function splitLines(code: string) {
  const lines = code.split("\n")
  // A trailing newline isn't a blank line anybody wrote.
  if (lines.length > 1 && lines.at(-1) === "") lines.pop()
  return lines
}

// Each line's tokens, plain until Shiki has coloured it. A line that changed
// since the last pass stays plain until the next one lands, so streamed code
// keeps its colours rather than flashing.
function useHighlightedLines(code: string, language?: string) {
  const [result, setResult] = React.useState<{
    language: string
    lines: CodeToken[][]
  } | null>(null)

  React.useEffect(() => {
    if (!language) return
    let current = true
    // Loaded on first use, so Shiki stays out of the page until code shows.
    import("@/registry/aiellie/lib/highlight-code")
      .then(({ highlightTokens }) => highlightTokens(code, language))
      .then((lines) => {
        if (current) setResult({ language, lines })
      })
      .catch(() => {
        // A language Shiki doesn't know stays plain.
      })
    return () => {
      current = false
    }
  }, [code, language])

  return React.useMemo(() => {
    const colored = result && result.language === language ? result.lines : []
    return splitLines(code).map((line, index) => {
      const tokens = colored[index]
      return tokens && tokens.map((token) => token.content).join("") === line
        ? tokens
        : [{ content: line }]
    })
  }, [code, language, result])
}

function CodeTokens({ tokens }: { tokens: CodeToken[] }) {
  return tokens.map((token, index) => (
    <span
      key={index}
      style={token.style}
      className={cn(token.style && "dark:text-(color:--shiki-dark)!")}
    >
      {token.content}
    </span>
  ))
}

function useCopied() {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Refused, so there is nothing to confirm.
    }
  }

  return [copied, copy] as const
}

function CodeBlock({ className, ...props }: React.ComponentProps<"figure">) {
  return (
    <figure
      data-slot="code-block"
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background text-sm",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockHeader({
  className,
  ...props
}: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-slot="code-block-header"
      className={cn(
        "flex h-9 min-w-0 shrink-0 items-center gap-2 border-b border-border/60 ps-3 pe-1.5",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  /** A mark of your own, or `null` for none. Left out, it's read off a string title. */
  icon?: React.ReactNode
}) {
  const mark =
    icon === undefined && typeof children === "string"
      ? codeIconOf(children)
      : null

  return (
    <span
      data-slot="code-block-title"
      className={cn(
        "flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {icon === undefined
        ? (mark ?? <HugeiconsIcon aria-hidden icon={FileIcon} />)
        : icon}
      <span className="truncate">{children}</span>
    </span>
  )
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      role="group"
      aria-label="Code actions"
      className={cn("ms-auto flex shrink-0 items-center gap-0.5", className)}
      {...props}
    />
  )
}

function CodeBlockCopy({
  code,
  tooltip = "Copy",
  ...props
}: Omit<React.ComponentProps<typeof TooltipIconButton>, "tooltip"> & {
  code: string
  tooltip?: string
}) {
  const [copied, copy] = useCopied()

  return (
    <TooltipIconButton
      data-slot="code-block-copy"
      tooltip={copied ? "Copied" : tooltip}
      onClick={() => copy(code)}
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={copied ? Tick02Icon : Copy01Icon} />
    </TooltipIconButton>
  )
}

function CodeBlockDownload({
  code,
  filename = "snippet.txt",
  tooltip = "Download",
  ...props
}: Omit<React.ComponentProps<typeof TooltipIconButton>, "tooltip"> & {
  code: string
  filename?: string
  tooltip?: string
}) {
  return (
    <TooltipIconButton
      data-slot="code-block-download"
      tooltip={tooltip}
      onClick={() => {
        const url = URL.createObjectURL(
          new Blob([code], { type: "text/plain;charset=utf-8" })
        )
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        link.click()
        // Revoked a tick later, or some browsers cancel before reading it.
        setTimeout(() => URL.revokeObjectURL(url), 0)
      }}
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={Download01Icon} />
    </TooltipIconButton>
  )
}

function CodeBlockContent({
  code,
  language,
  lineNumbers = false,
  highlightLines,
  wrap = false,
  streaming = false,
  className,
  ...props
}: Omit<React.ComponentProps<"pre">, "children"> & {
  code: string
  /** Any language Shiki knows, like `tsx` or `bash`. Left out, the code stays plain. */
  language?: string
  lineNumbers?: boolean
  /** Lines to mark, counting from 1. */
  highlightLines?: number[]
  /** Wraps long lines instead of scrolling them. */
  wrap?: boolean
  /** Shows a caret after the last line while more code is coming. */
  streaming?: boolean
}) {
  const lines = useHighlightedLines(code, language)
  const marked = new Set(highlightLines)
  const gutter = `${String(lines.length).length}ch`

  return (
    <pre
      data-slot="code-block-content"
      // Code reads left to right whatever the page does, or its brackets
      // reorder under rtl.
      dir="ltr"
      tabIndex={wrap ? undefined : 0}
      aria-busy={streaming || undefined}
      className={cn(
        "min-w-0 overflow-x-auto py-3 font-mono text-[0.8125rem] leading-[1.375rem] outline-none",
        className
      )}
      {...props}
    >
      <code className={cn("grid", !wrap && "w-max min-w-full")}>
        {lines.map((tokens, index) => {
          const number = index + 1
          const highlighted = marked.has(number)

          return (
            <span
              key={index}
              data-slot="code-block-line"
              data-highlighted={highlighted || undefined}
              className={cn(
                "flex min-h-[1.375rem] bg-background pe-4",
                !lineNumbers && "ps-4",
                highlighted && "bg-muted"
              )}
            >
              {lineNumbers ? (
                <span
                  aria-hidden
                  style={{ minInlineSize: gutter }}
                  className="sticky start-0 box-content shrink-0 bg-inherit ps-4 pe-4 text-end text-[0.6875rem] text-muted-foreground tabular-nums select-none"
                >
                  {number}
                </span>
              ) : null}
              <span
                className={cn(
                  wrap ? "min-w-0 flex-1 whitespace-pre-wrap" : "whitespace-pre"
                )}
              >
                <CodeTokens tokens={tokens} />
                {streaming && index === lines.length - 1 ? (
                  <span
                    aria-hidden
                    data-slot="code-block-caret"
                    className="ms-0.5 inline-block h-3.5 w-0.5 animate-caret-blink bg-live align-middle motion-reduce:animate-none"
                  />
                ) : null}
              </span>
            </span>
          )
        })}
      </code>
    </pre>
  )
}

export {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopy,
  CodeBlockDownload,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeTokens,
  codeIconOf,
  useHighlightedLines,
}
