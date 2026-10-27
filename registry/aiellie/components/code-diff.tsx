"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  CodeTokens,
  useHighlightedLines,
} from "@/registry/aiellie/components/code-block"

type DiffLine =
  | { kind: "hunk"; text: string }
  | {
      kind: "context" | "added" | "removed"
      text: string
      oldNumber?: number
      newNumber?: number
    }

// Reads a unified diff, like `git diff` writes, into rows. File headers are
// dropped, since the block's own header names the file.
function parseDiff(diff: string): DiffLine[] {
  const rows: DiffLine[] = []
  let oldNumber = 0
  let newNumber = 0

  for (const line of diff.replace(/\n$/, "").split("\n")) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line)
    if (hunk) {
      oldNumber = Number(hunk[1])
      newNumber = Number(hunk[2])
      rows.push({ kind: "hunk", text: line })
    } else if (
      line.startsWith("diff ") ||
      line.startsWith("index ") ||
      line.startsWith("--- ") ||
      line.startsWith("+++ ") ||
      line.startsWith("\\")
    ) {
      continue
    } else if (line.startsWith("+")) {
      rows.push({ kind: "added", text: line.slice(1), newNumber: newNumber++ })
    } else if (line.startsWith("-")) {
      rows.push({
        kind: "removed",
        text: line.slice(1),
        oldNumber: oldNumber++,
      })
    } else {
      rows.push({
        kind: "context",
        text: line.slice(1),
        oldNumber: oldNumber++,
        newNumber: newNumber++,
      })
    }
  }

  return rows
}

function diffStat(diff: string) {
  const rows = parseDiff(diff)
  return {
    added: rows.filter((row) => row.kind === "added").length,
    removed: rows.filter((row) => row.kind === "removed").length,
  }
}

// A shadcn theme has no success token, so added lines use raw emerald. Tints
// are mixed into the ground rather than laid over it, so the pinned gutter can
// carry the same colour as its row.
const rowClass = {
  hunk: "bg-muted text-muted-foreground",
  context: "bg-background",
  added:
    "bg-[color-mix(in_oklch,var(--color-emerald-500)_8%,var(--background))] dark:bg-[color-mix(in_oklch,var(--color-emerald-400)_10%,var(--background))]",
  removed:
    "bg-[color-mix(in_oklch,var(--destructive)_7%,var(--background))] dark:bg-[color-mix(in_oklch,var(--destructive)_10%,var(--background))]",
}

const markClass = {
  context: "text-muted-foreground",
  added: "text-emerald-600 dark:text-emerald-400",
  removed: "text-destructive",
}

function CodeDiffStat({
  diff,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { diff: string }) {
  const { added, removed } = diffStat(diff)

  return (
    <span
      data-slot="code-diff-stat"
      className={cn(
        "flex shrink-0 items-center gap-1.5 font-mono text-xs tabular-nums",
        className
      )}
      {...props}
    >
      <span className="text-emerald-600 dark:text-emerald-400">
        <span className="sr-only">Added </span>+{added}
      </span>
      <span className="text-destructive">
        <span className="sr-only">Removed </span>−{removed}
      </span>
    </span>
  )
}

function CodeDiffContent({
  diff,
  language,
  lineNumbers = true,
  className,
  ...props
}: Omit<React.ComponentProps<"pre">, "children"> & {
  /** A unified diff, like `git diff` writes. */
  diff: string
  /** Any language Shiki knows. Left out, the lines stay plain. */
  language?: string
  lineNumbers?: boolean
}) {
  const rows = React.useMemo(() => parseDiff(diff), [diff])
  const code = rows
    .filter((row) => row.kind !== "hunk")
    .map((row) => row.text)
    .join("\n")
  const tokens = useHighlightedLines(code, language)
  const width = `${
    String(
      Math.max(
        0,
        ...rows.map((row) =>
          row.kind === "hunk"
            ? 0
            : Math.max(row.oldNumber ?? 0, row.newNumber ?? 0)
        )
      )
    ).length
  }ch`

  let line = 0

  return (
    <pre
      data-slot="code-diff-content"
      dir="ltr"
      tabIndex={0}
      className={cn(
        "min-w-0 overflow-x-auto py-2 font-mono text-[0.8125rem] leading-[1.375rem] outline-none",
        className
      )}
      {...props}
    >
      <code className="grid w-max min-w-full">
        {rows.map((row, index) => {
          if (row.kind === "hunk") {
            return (
              <span
                key={index}
                data-slot="code-diff-hunk"
                className={cn("flex px-4 text-xs leading-7", rowClass.hunk)}
              >
                <span className="sticky start-4">{row.text}</span>
              </span>
            )
          }

          const lineTokens = tokens[line++] ?? [{ content: row.text }]

          return (
            <span
              key={index}
              data-slot="code-diff-line"
              data-kind={row.kind}
              className={cn("flex min-h-[1.375rem] pe-4", rowClass[row.kind])}
            >
              <span
                aria-hidden
                className="sticky start-0 flex shrink-0 gap-3 bg-inherit ps-4 pe-3 text-[0.6875rem] text-muted-foreground tabular-nums select-none"
              >
                {lineNumbers ? (
                  <>
                    <span style={{ minInlineSize: width }} className="text-end">
                      {row.oldNumber ?? ""}
                    </span>
                    <span style={{ minInlineSize: width }} className="text-end">
                      {row.newNumber ?? ""}
                    </span>
                  </>
                ) : null}
                <span
                  className={cn("w-2 text-[0.8125rem]", markClass[row.kind])}
                >
                  {row.kind === "added"
                    ? "+"
                    : row.kind === "removed"
                      ? "−"
                      : ""}
                </span>
              </span>
              {row.kind === "context" ? null : (
                <span className="sr-only">
                  {row.kind === "added" ? "Added: " : "Removed: "}
                </span>
              )}
              <span className="whitespace-pre">
                <CodeTokens tokens={lineTokens} />
              </span>
            </span>
          )
        })}
      </code>
    </pre>
  )
}

export { CodeDiffContent, CodeDiffStat, diffStat, parseDiff }
export type { DiffLine }
