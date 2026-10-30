"use client"

import { BubbleChatTemporaryIcon, Key01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { brandIcons } from "@/registry/aiellie/icons"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/aiellie/ui/empty"

function ChatEmpty({
  temporary = false,
  onAddKey,
}: {
  temporary?: boolean
  /** Offered while replies are samples, for want of an API key. */
  onAddKey?: () => void
}) {
  return (
    <Empty className="gap-5">
      <EmptyHeader>
        <EmptyMedia className="size-10 rounded-lg" variant="icon">
          {temporary ? (
            <HugeiconsIcon
              aria-hidden
              icon={BubbleChatTemporaryIcon}
              className="size-6 text-foreground"
            />
          ) : (
            brandIcons.elephant("size-6 text-foreground")
          )}
        </EmptyMedia>
        <EmptyTitle className="text-2xl font-light tracking-tight">
          {temporary ? "Temporary chat" : "Ready when you are."}
        </EmptyTitle>
        {temporary ? (
          <EmptyDescription className="max-w-xs">
            It won&apos;t appear in your history, and it won&apos;t use or
            update your memory.
          </EmptyDescription>
        ) : null}
        {onAddKey ? (
          <>
            <EmptyDescription className="text-xs">
              Replies are samples for now.
            </EmptyDescription>
            <Button
              variant="outline"
              size="xs"
              onClick={onAddKey}
              className="mt-1"
            >
              <HugeiconsIcon icon={Key01Icon} aria-hidden />
              Add an API key
            </Button>
          </>
        ) : null}
      </EmptyHeader>
    </Empty>
  )
}

export { ChatEmpty }
