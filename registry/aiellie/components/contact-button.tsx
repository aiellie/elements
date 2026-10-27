"use client"

import * as React from "react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/aiellie/ui/avatar"

function ContactButton({
  name,
  src,
  emoji,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  name: string
  /** Their picture. Their initials stand in without one. */
  src?: string
  /** Set before the name in the pill. */
  emoji?: string
}) {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <button
      data-slot="contact-button"
      type="button"
      aria-label={`About ${name}`}
      className={cn(
        "group/contact-button flex w-fit flex-col items-center outline-none active:scale-[0.97] motion-safe:transition-[scale] motion-safe:duration-80",
        className
      )}
      {...props}
    >
      {/* The avatar is positioned, so it paints over the pill it overlaps. */}
      <Avatar className="size-14 border-2 border-background after:hidden">
        {src ? <AvatarImage src={src} alt="" /> : null}
        <AvatarFallback className="text-sm">{initials}</AvatarFallback>
      </Avatar>
      <span className="-mt-2 flex max-w-40 min-w-0 items-center gap-1 rounded-lg border border-border/60 bg-background px-2.5 pt-2 pb-1 text-xs leading-4 font-medium transition-colors duration-80 group-hover/contact-button:bg-muted group-focus-visible/contact-button:border-ring group-aria-expanded/contact-button:bg-muted motion-reduce:transition-none">
        <span className="min-w-0 truncate">
          {emoji ? <span aria-hidden>{emoji} </span> : null}
          {name}
        </span>
        <HugeiconsIcon
          aria-hidden
          icon={ArrowRight01Icon}
          className="size-3 shrink-0 text-muted-foreground rtl:-scale-x-100"
        />
      </span>
    </button>
  )
}

export { ContactButton }
