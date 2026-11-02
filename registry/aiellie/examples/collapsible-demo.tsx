"use client"

import { ArrowDown01Icon, File01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/aiellie/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/aiellie/ui/collapsible"

const FILES = [
  { path: "app/(home)/page.tsx", added: 12, removed: 3 },
  { path: "components/pages/demo-card.tsx", added: 4, removed: 4 },
  { path: "lib/links.ts", added: 21, removed: 0 },
]

export default function CollapsibleDemo() {
  return (
    <Collapsible className="w-full max-w-xs">
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            className="group/collapsible w-full justify-between"
          />
        }
      >
        {FILES.length} files changed
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          data-icon="inline-end"
          className="transition-transform duration-150 group-data-panel-open/collapsible:rotate-180 motion-reduce:transition-none"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-1 flex flex-col gap-0.5 rounded-xl border border-border/40 bg-background/70 p-1 dark:bg-background/70">
          {FILES.map((file) => (
            <li
              key={file.path}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground"
            >
              <HugeiconsIcon
                icon={File01Icon}
                strokeWidth={1.5}
                className="size-4 shrink-0"
              />
              <span className="min-w-0 flex-1 truncate font-mono text-xs">
                {file.path}
              </span>
              <span className="shrink-0 text-xs tabular-nums">
                <span className="text-accent">+{file.added}</span>{" "}
                <span className="text-destructive">−{file.removed}</span>
              </span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
