"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/aiellie/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/aiellie/ui/collapsible"

const FILES = ["chat.tsx", "chat-messages.tsx", "chat-composer.tsx"]

export default function CollapsibleDemo() {
  return (
    <Collapsible className="w-full max-w-xs gap-1">
      <div className="flex items-center justify-between gap-2 ps-2">
        <span className="text-sm text-foreground">3 files changed</span>
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Show files"
              className="group/collapsible-trigger"
            />
          }
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            aria-hidden
            className="transition-[rotate] duration-150 group-data-panel-open/collapsible-trigger:rotate-180 motion-reduce:transition-none"
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ul className="flex flex-col gap-1">
          {FILES.map((file) => (
            <li
              key={file}
              className="rounded-md border px-2 py-1 font-mono text-xs text-muted-foreground"
            >
              {file}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
