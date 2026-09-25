"use client"

import * as React from "react"

import { Input } from "@/registry/aiellie/ui/input"
import { cn } from "@/lib/utils"

function useRenameInput(title: string, onDone: (title?: string) => void) {
  const [value, setValue] = React.useState(title)
  const ref = React.useRef<HTMLInputElement>(null)
  // Escape ends the edit by removing the field, and some browsers report that
  // as a blur, which would otherwise save the name Escape meant to throw away.
  const cancelledRef = React.useRef(false)

  React.useEffect(() => {
    // A frame late on purpose: a menu this was opened from hands focus back to
    // its trigger as it closes, and focus taken before then is lost again.
    const frame = requestAnimationFrame(() => {
      ref.current?.focus()
      ref.current?.select()
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return {
    ref,
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    onBlur: () => {
      if (!cancelledRef.current) onDone(value.trim() || undefined)
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault()
        event.currentTarget.blur()
      } else if (event.key === "Escape") {
        event.preventDefault()
        cancelledRef.current = true
        onDone()
      }
    },
  }
}

function ChatTitleField({
  title,
  onDone,
}: {
  title: string
  onDone: (title?: string) => void
}) {
  return (
    <Input
      {...useRenameInput(title, onDone)}
      aria-label="Chat name"
      className="h-7 max-w-72 rounded-md px-2 text-sm font-medium"
    />
  )
}

function ChatTitle({
  title,
  editing,
  onEditingChange,
  onRename,
}: {
  title: string
  editing: boolean
  onEditingChange: (editing: boolean) => void
  /** Left out for a chat that can't be renamed yet, which shows plain text. */
  onRename?: (title: string) => void
}) {
  if (!onRename) {
    return (
      <h1 className="min-w-0 truncate px-1 text-sm font-medium">{title}</h1>
    )
  }

  if (editing) {
    return (
      <ChatTitleField
        title={title}
        onDone={(next) => {
          if (next && next !== title) onRename(next)
          onEditingChange(false)
        }}
      />
    )
  }

  return (
    <h1 className="min-w-0">
      <button
        type="button"
        title="Rename"
        onClick={() => onEditingChange(true)}
        className={cn(
          "flex h-7 max-w-full min-w-0 items-center rounded-md border border-transparent px-2 text-sm font-medium outline-none",
          "transition-colors duration-80 hover:bg-accent focus-visible:border-ring motion-reduce:transition-none"
        )}
      >
        <span className="truncate">{title}</span>
      </button>
    </h1>
  )
}

export { ChatTitle, useRenameInput }
