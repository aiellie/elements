"use client"

import { useMemo, type ComponentProps } from "react"
import {
  Copy01Icon,
  Tick02Icon,
  CommandLineIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { tokenizeCommand, TOKEN_COLORS } from "@/lib/highlight"
import {
  codeScroll,
  ghostButton,
  iconSwap,
  iconSwapIn,
  iconSwapOut,
  mono,
  paper,
} from "@/lib/surfaces"

export type PackageManager = "npm" | "pnpm" | "bun" | "yarn"

export const PACKAGE_MANAGERS: readonly PackageManager[] = [
  "npm",
  "pnpm",
  "bun",
  "yarn",
]

/** What each manager calls to run a package it has not installed. */
const RUNNERS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  bun: "bunx",
  yarn: "yarn dlx",
}

/**
 * The line as it is actually run. Exported so a caller copies exactly what is
 * on screen instead of rebuilding the runner prefix itself.
 */
export function resolveCommand(manager: PackageManager, command: string) {
  return `${RUNNERS[manager]} ${command}`
}

export interface CodeSnippetTab {
  name: string
  /** The whole line this tab runs, runner prefix and all. */
  command: string
}

export interface CodeSnippetProps extends Omit<
  ComponentProps<"div">,
  "children" | "onCopy"
> {
  /**
   * The line to run: what follows the runner while a `manager` supplies one
   * (`shadcn@latest add …`), the whole line when none does. Unused under
   * `tabs`, since each tab carries its own.
   */
  command?: string
  /**
   * Tabs for the package manager running `command`, paired with
   * `onManagerChange`. Leave both off — and pass no `tabs` — for a card with
   * no tabs at all, which runs `command` as it stands.
   */
  manager?: PackageManager
  onManagerChange?: (manager: PackageManager) => void
  managers?: readonly PackageManager[]
  /**
   * Tabs of the caller's own in place of the managers, for lines that differ
   * by more than their runner. Paired with `active` and `onActiveChange`.
   */
  tabs?: readonly CodeSnippetTab[]
  active?: number
  onActiveChange?: (index: number) => void
  /** Colours the line's parts — program, flags, versions, URLs — like code. */
  highlight?: boolean
  /** Handed the resolved line, so the caller never rebuilds the prefix. */
  onCopy: (resolved: string) => void
  copied?: boolean
}

export function CodeSnippet({
  command = "",
  manager,
  onManagerChange,
  managers = PACKAGE_MANAGERS,
  tabs,
  active = 0,
  onActiveChange,
  highlight = false,
  onCopy,
  copied = false,
  className,
  ...props
}: CodeSnippetProps) {
  /* Whichever set of tabs the caller is in, resolve to one strip of labels and
     one line, so the header and the prompt below it cannot disagree. Nothing
     to choose between leaves the strip empty, and the header goes with it. */
  const labels: readonly string[] = tabs
    ? tabs.map((tab) => tab.name)
    : manager
      ? managers
      : []

  /* An out-of-range index would otherwise show a line no tab is holding. */
  const index = tabs
    ? Math.min(Math.max(active, 0), tabs.length - 1)
    : manager
      ? managers.indexOf(manager)
      : -1

  const resolved = tabs
    ? (tabs[index]?.command ?? "")
    : manager
      ? resolveCommand(manager, command)
      : command

  const tokens = useMemo(
    () => (highlight ? tokenizeCommand(resolved) : null),
    [highlight, resolved]
  )

  const select = (at: number) => {
    if (tabs) onActiveChange?.(at)
    else onManagerChange?.(managers[at])
  }

  /* One button, sitting in the header when there is one and coming down to the
     line when there is not. */
  const copyButton = (
    <button
      type="button"
      aria-label={copied ? "Copied command" : "Copy command"}
      onClick={() => onCopy(resolved)}
      className={cn(
        ghostButton,
        "ms-auto grid size-6 shrink-0 place-items-center"
      )}
    >
      <HugeiconsIcon
        icon={Copy01Icon}
        className={cn(iconSwap, "size-3.5", copied ? iconSwapOut : iconSwapIn)}
        strokeWidth={2}
      />
      <HugeiconsIcon
        icon={Tick02Icon}
        className={cn(iconSwap, "size-3.5", copied ? iconSwapIn : iconSwapOut)}
        strokeWidth={2}
      />
    </button>
  )

  return (
    <div
      data-slot="code-snippet"
      className={cn(
        paper,
        "w-full max-w-lg overflow-hidden rounded-2xl",
        className
      )}
      {...props}
    >
      {/* The badge sits at the same inset as the prompt below it, so the two
          rows read down one edge. */}
      {labels.length > 0 && (
        <div className="flex items-center gap-2 border-b border-border/60 px-3.5 py-1.5">
          <HugeiconsIcon
            aria-hidden
            icon={CommandLineIcon}
            className="size-3.5 text-foreground/40"
            strokeWidth={2}
          />
          <div role="tablist" className="-ms-0.5 flex items-center gap-0.5">
            {labels.map((label, at) => {
              const selected = at === index

              return (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => select(at)}
                  className={cn(
                    mono,
                    "cursor-pointer rounded-full px-2 py-1 transition-[background-color,color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 active:scale-[0.94] motion-reduce:transition-none",
                    selected
                      ? "bg-foreground/[0.06] text-foreground/90 dark:bg-foreground/[0.09]"
                      : "text-foreground/35 hover:text-foreground/70"
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
          {copyButton}
        </div>
      )}
      <div
        className={cn(
          "flex items-center gap-2 px-3.5 py-2.5",
          /* With no header to hold it, the copy action comes down to the line
             and the row tightens on that edge to seat it. */
          labels.length === 0 && "py-1.5 pe-1.5"
        )}
      >
        {/* The prompt takes the line's own size, so the two share a baseline
            rather than each centring on a box of its own. */}
        <span
          aria-hidden
          className={cn(mono, "text-[12px] text-foreground/25 select-none")}
        >
          $
        </span>
        {/* A registry URL is long enough to outrun the card, so the line scrolls
            rather than wrapping into something you cannot paste. The prompt and
            the copy action stay outside the scroller so they hold their place —
            which leaves the scroller to carry the text sizing, since its own
            line box would otherwise stand the line off centre. */}
        <div className={cn(codeScroll, mono, "min-w-0 flex-1 text-[12px]")}>
          <code className="whitespace-pre text-foreground/70">
            {tokens
              ? tokens.map((token, at) => (
                  <span key={at} className={TOKEN_COLORS[token.kind]}>
                    {token.text}
                  </span>
                ))
              : resolved}
          </code>
        </div>
        {labels.length === 0 && copyButton}
      </div>
    </div>
  )
}
