"use client"

import * as React from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useComposer } from "@/registry/aiellie/components/composer"

type SlashCommand = {
  /** What's typed after the slash, like "summarize". */
  id: string
  description?: string
  icon?: IconSvgElement
}

// Open while the field holds nothing but a slash and the start of a name.
function queryOf(value: string) {
  return /^\/([\w-]*)$/.exec(value)?.[1] ?? null
}

function SlashMenu({
  commands,
  onSelect,
  emptyMessage = "No commands match",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onSelect"> & {
  commands: SlashCommand[]
  /** Called with the command picked. Left out, the field becomes `/<id> `. */
  onSelect?: (command: SlashCommand) => void
  emptyMessage?: string
}) {
  const { value, setValue } = useComposer()
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()
  const [dismissed, setDismissed] = React.useState<string | null>(null)
  const [highlighted, setHighlighted] = React.useState(0)

  const query = queryOf(value)
  const matches =
    query === null
      ? []
      : commands.filter((command) =>
          command.id.toLowerCase().includes(query.toLowerCase())
        )
  const open = query !== null && value !== dismissed
  const active = Math.min(highlighted, Math.max(0, matches.length - 1))

  const [lastQuery, setLastQuery] = React.useState(query)
  if (query !== lastQuery) {
    setLastQuery(query)
    setHighlighted(0)
  }

  const select = (command: SlashCommand) => {
    if (onSelect) onSelect(command)
    else setValue(`/${command.id} `)
    setDismissed(null)
    wrapperRef.current?.querySelector("textarea")?.focus()
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
      data-slot="slash-menu"
      className={cn("relative flex min-w-0 flex-col", className)}
      // Caught on the way down, so the field never sees the keys the list
      // answers, and Enter picks a command rather than sending.
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
          setDismissed(value)
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
          aria-label="Commands"
          className="absolute start-0 bottom-full z-50 mb-2 flex max-h-64 w-72 max-w-full flex-col overflow-y-auto rounded-xl border border-border/40 bg-popover p-1 shadow-md supports-[backdrop-filter]:bg-background/60 supports-[backdrop-filter]:backdrop-blur-xs dark:supports-[backdrop-filter]:bg-background/70"
        >
          {matches.length === 0 ? (
            <div className="px-2 py-1 text-xs text-foreground/70">
              {emptyMessage}
            </div>
          ) : (
            matches.map((command, index) => (
              <div
                key={command.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                data-highlighted={index === active || undefined}
                // Keeps focus in the field.
                onPointerDown={(event) => event.preventDefault()}
                onPointerMove={() => setHighlighted(index)}
                onClick={() => select(command)}
                className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1 text-xs text-muted-foreground select-none data-highlighted:bg-foreground/[0.06] data-highlighted:text-foreground dark:data-highlighted:bg-foreground/[0.09]"
              >
                {command.icon ? (
                  <HugeiconsIcon
                    aria-hidden
                    icon={command.icon}
                    strokeWidth={1.5}
                    className="mt-px size-4 shrink-0"
                  />
                ) : null}
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-mono font-medium">/{command.id}</span>
                  {command.description ? (
                    <span className="text-foreground/70">
                      {command.description}
                    </span>
                  ) : null}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}

export { SlashMenu }
export type { SlashCommand }
