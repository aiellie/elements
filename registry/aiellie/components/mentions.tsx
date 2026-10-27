"use client"

import * as React from "react"
import { AiMagicIcon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useComposer } from "@/registry/aiellie/components/composer"

type MentionOption = {
  id: string
  name: string
  description?: string
  /** A picture to show beside the name. */
  avatar?: string
  /** Agents get a sparkle where there's no picture, people a silhouette. */
  kind?: "person" | "agent"
}

// The at sign and what follows it, when the caret sits at its end.
function mentionAt(value: string, caret: number) {
  const match = /(^|\s)@([\w.-]*)$/.exec(value.slice(0, caret))
  return match ? { query: match[2], start: caret - match[2].length - 1 } : null
}

function Mentions({
  options,
  onMention,
  emptyMessage = "No one matches",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The people and agents a message can name. */
  options: MentionOption[]
  /** Called with whoever was picked, after `@Name ` goes into the field. */
  onMention?: (option: MentionOption) => void
  emptyMessage?: string
}) {
  const { value, setValue } = useComposer()
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()
  const [caret, setCaret] = React.useState(0)
  const [dismissed, setDismissed] = React.useState<string | null>(null)
  const [highlighted, setHighlighted] = React.useState(0)

  const mention = mentionAt(value, Math.min(caret, value.length))
  const matches = mention
    ? options.filter((option) =>
        option.name.toLowerCase().includes(mention.query.toLowerCase())
      )
    : []
  const key = mention ? `${mention.start}:${value}` : null
  const open = mention !== null && key !== dismissed
  const active = Math.min(highlighted, Math.max(0, matches.length - 1))

  const [lastQuery, setLastQuery] = React.useState(mention?.query)
  if (mention?.query !== lastQuery) {
    setLastQuery(mention?.query)
    setHighlighted(0)
  }

  const readCaret = () => {
    const field = wrapperRef.current?.querySelector("textarea")
    if (field) setCaret(field.selectionStart)
  }

  const select = (option: MentionOption) => {
    if (!mention) return
    const end = mention.start + mention.query.length + 1
    const inserted = `@${option.name} `
    setValue(value.slice(0, mention.start) + inserted + value.slice(end))
    const position = mention.start + inserted.length
    setCaret(position)
    onMention?.(option)
    requestAnimationFrame(() => {
      const field = wrapperRef.current?.querySelector("textarea")
      field?.focus()
      field?.setSelectionRange(position, position)
    })
  }

  React.useEffect(() => {
    const field = wrapperRef.current?.querySelector("textarea")
    if (!field) return
    field.setAttribute("aria-autocomplete", "list")
    field.setAttribute("aria-expanded", String(open))
    if (open) field.setAttribute("aria-controls", listId)
    else field.removeAttribute("aria-controls")
    if (open && matches.length > 0) {
      field.setAttribute("aria-activedescendant", `${listId}-${active}`)
    } else {
      field.removeAttribute("aria-activedescendant")
    }
  }, [open, active, listId, matches.length])

  return (
    <div
      ref={wrapperRef}
      data-slot="mentions"
      className={cn("relative flex min-w-0 flex-col", className)}
      onInput={readCaret}
      onKeyUp={readCaret}
      onClick={readCaret}
      // Caught on the way down, so the field never sees the keys the list
      // answers, and Enter picks someone rather than sending.
      onKeyDownCapture={(event) => {
        if (!open || event.nativeEvent.isComposing) return
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          if (matches.length === 0) return
          const step = event.key === "ArrowDown" ? 1 : -1
          setHighlighted((active + step + matches.length) % matches.length)
        } else if (
          (event.key === "Enter" || event.key === "Tab") &&
          !event.shiftKey &&
          matches[active]
        ) {
          select(matches[active])
        } else if (event.key === "Escape") {
          setDismissed(key)
        } else {
          return
        }
        event.preventDefault()
        event.stopPropagation()
      }}
      {...props}
    >
      {children}
      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label="People and agents"
          className="absolute start-0 bottom-full z-50 mb-2 flex max-h-64 w-64 max-w-full flex-col overflow-y-auto rounded-xl border border-border/40 bg-popover p-1 shadow-md supports-[backdrop-filter]:bg-background/60 supports-[backdrop-filter]:backdrop-blur-xs dark:supports-[backdrop-filter]:bg-background/70"
        >
          {matches.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-foreground/70">
              {emptyMessage}
            </div>
          ) : (
            matches.map((option, index) => (
              <div
                key={option.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                data-highlighted={index === active || undefined}
                // Keeps focus in the field.
                onPointerDown={(event) => event.preventDefault()}
                onPointerMove={() => setHighlighted(index)}
                onClick={() => select(option)}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground select-none data-highlighted:bg-foreground/[0.06] data-highlighted:text-foreground dark:data-highlighted:bg-foreground/[0.09]"
              >
                {option.avatar ? (
                  // An avatar is small and from anywhere, so next/image has nothing to add.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={option.avatar}
                    alt=""
                    className="size-5 shrink-0 rounded-full bg-muted object-cover"
                  />
                ) : (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                    <HugeiconsIcon
                      aria-hidden
                      icon={option.kind === "agent" ? AiMagicIcon : UserIcon}
                      strokeWidth={1.5}
                      className="size-3"
                    />
                  </span>
                )}
                <span className="truncate font-medium">{option.name}</span>
                {option.description ? (
                  <span className="ms-auto truncate text-foreground/70">
                    {option.description}
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}

export { Mentions }
export type { MentionOption }
