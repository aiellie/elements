"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/aiellie/ui/hover-card"

export default function HoverCardDemo() {
  return (
    <p className="max-w-xs text-sm text-muted-foreground">
      Written with{" "}
      <HoverCard>
        <HoverCardTrigger
          href="#"
          className="text-foreground underline-offset-2 hover:text-foreground"
        >
          Claude Opus
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col gap-1">
          <span className="font-medium">Claude Opus</span>
          <span className="text-xs">
            The largest model, for long, careful work across a whole codebase.
          </span>
        </HoverCardContent>
      </HoverCard>
      , then checked by hand.
    </p>
  )
}
