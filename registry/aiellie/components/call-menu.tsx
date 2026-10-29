"use client"

import * as React from "react"
import { CallIcon, Video01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/aiellie/ui/avatar"

function CallMenu({
  name,
  src,
  onVideoCall,
  onCall,
  videoLabel = "Video call",
  callLabel = "Call",
  className,
  children,
}: {
  /** Who the call is with, for the button's label. */
  name: string
  /** Their picture. Their initials stand in without one. */
  src?: string
  onVideoCall?: () => void
  onCall?: () => void
  videoLabel?: string
  callLabel?: string
  className?: string
  /** More rows under the two calls. */
  children?: React.ReactNode
}) {
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Menu>
      <MenuTrigger
        data-slot="call-menu"
        aria-label={`Call ${name}`}
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full border border-border/60 bg-background outline-none focus-visible:border-ring active:scale-90 data-popup-open:border-ring motion-safe:transition-[scale,border-color] motion-safe:duration-80",
          className
        )}
      >
        <Avatar size="sm" className="size-7 after:hidden">
          {src ? <AvatarImage src={src} alt="" /> : null}
          <AvatarFallback className="text-[0.625rem]">
            {initials}
          </AvatarFallback>
        </Avatar>
      </MenuTrigger>
      <MenuContent align="end" className="min-w-36">
        <MenuItem onClick={onVideoCall}>
          <HugeiconsIcon aria-hidden icon={Video01Icon} />
          {videoLabel}
        </MenuItem>
        <MenuItem onClick={onCall}>
          <HugeiconsIcon aria-hidden icon={CallIcon} />
          {callLabel}
        </MenuItem>
        {children}
      </MenuContent>
    </Menu>
  )
}

export { CallMenu }
