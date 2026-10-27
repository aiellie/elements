"use client"

import * as React from "react"
import { Tabs } from "@base-ui/react/tabs"
import { CommandLineIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  CodeBlockCopy,
  CodeTokens,
  useHighlightedLines,
} from "@/registry/aiellie/components/code-block"

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"]

const RUNNERS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
}

/** The line a package manager runs, runner and all. */
function runWith(manager: PackageManager, command: string) {
  return `${RUNNERS[manager]} ${command}`
}

function CodeSnippetLine({ command }: { command: string }) {
  const [tokens = []] = useHighlightedLines(command, "bash")

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 font-mono text-[0.8125rem] leading-[1.375rem]">
      <span aria-hidden className="text-muted-foreground select-none">
        $
      </span>
      {/* Scrolls rather than wraps, so a long line stays one line to paste. */}
      <code
        dir="ltr"
        tabIndex={0}
        className="min-w-0 flex-1 [scrollbar-width:none] overflow-x-auto rounded-sm border border-transparent whitespace-pre outline-none focus-visible:border-ring"
      >
        <CodeTokens tokens={tokens} />
      </code>
    </div>
  )
}

function CodeSnippet({
  command,
  managers = PACKAGE_MANAGERS,
  manager,
  defaultManager = managers[0],
  onManagerChange,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** What follows the runner, like `shadcn@latest add button`. With no `managers`, the whole line. */
  command: string
  /** The tabs. Pass `[]` to run `command` as it stands, with no tabs. */
  managers?: PackageManager[]
  manager?: PackageManager
  defaultManager?: PackageManager
  onManagerChange?: (manager: PackageManager) => void
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultManager)
  const current = manager ?? uncontrolled

  if (managers.length === 0) {
    return (
      <div
        data-slot="code-snippet"
        className={cn(
          "flex w-full min-w-0 items-center gap-2 rounded-xl border border-border/60 bg-background py-1.5 ps-3 pe-1.5",
          className
        )}
        {...props}
      >
        <CodeSnippetLine command={command} />
        <CodeBlockCopy code={command} />
      </div>
    )
  }

  return (
    <Tabs.Root
      data-slot="code-snippet"
      value={current}
      onValueChange={(next: PackageManager) => {
        if (manager === undefined) setUncontrolled(next)
        onManagerChange?.(next)
      }}
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background",
        className
      )}
      {...props}
    >
      <div className="flex h-9 min-w-0 items-center gap-2 border-b border-border/60 ps-3 pe-1.5">
        <HugeiconsIcon
          aria-hidden
          icon={CommandLineIcon}
          className="size-3.5 shrink-0 text-muted-foreground"
        />
        <Tabs.List
          aria-label="Package manager"
          className="flex min-w-0 items-center gap-0.5"
        >
          {managers.map((name) => (
            <Tabs.Tab
              key={name}
              value={name}
              className="h-6 cursor-pointer rounded-md border border-transparent px-1.5 font-mono text-xs text-muted-foreground transition-colors duration-80 outline-none select-none hover:text-foreground focus-visible:border-ring motion-reduce:transition-none data-active:bg-muted data-active:text-foreground"
            >
              {name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <CodeBlockCopy code={runWith(current, command)} className="ms-auto" />
      </div>
      {managers.map((name) => (
        <Tabs.Panel key={name} value={name} className="flex px-3 py-2.5">
          <CodeSnippetLine command={runWith(name, command)} />
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}

export { CodeSnippet, PACKAGE_MANAGERS, runWith }
export type { PackageManager }
