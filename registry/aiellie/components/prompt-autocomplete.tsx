"use client"

import * as React from "react"
import { ArrowUp02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"

type AcceptMode = "all" | "word"

// Shared by the field and the mirror that draws the ghost text, so both wrap
// at the same characters.
const textMetrics =
  "px-2 py-1.5 text-sm leading-6 whitespace-pre-wrap wrap-anywhere"

/** The next word of a completion, with the space in front of it. */
function nextWord(completion: string) {
  return completion.match(/^\s*\S+/)?.[0] ?? completion
}

/**
 * What is left of a suggestion made for `base` once `value` is typed. Typing
 * the suggestion's own characters keeps it; typing anything else drops it.
 */
function remainingCompletion(value: string, base: string, completion: string) {
  const full = base + completion
  if (!value.startsWith(base) || !full.startsWith(value)) return ""
  return full.slice(value.length)
}

const subscribeNever = () => () => {}

// Option-Right on a Mac, Ctrl-Right everywhere else.
function useWordKey() {
  return React.useSyncExternalStore(
    subscribeNever,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌥→" : "Ctrl →"),
    () => "⌥→"
  )
}

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-4 items-center rounded-sm border border-border px-1 font-sans text-[10px] leading-none text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PromptAutocomplete({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  suggestion,
  onAccept,
  onDismiss,
  onSubmit,
  placeholder = "Message",
  label = "Message",
  disabled = false,
  showHints = true,
  className,
  ...props
}: Omit<
  React.ComponentProps<"div">,
  "children" | "onSubmit" | "defaultValue"
> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** The completion for the current value: only the text that comes after it. */
  suggestion?: string
  /** Fires with the text that was put in. */
  onAccept?: (accepted: string, mode: AcceptMode) => void
  /** Fires on Escape while a suggestion shows. */
  onDismiss?: () => void
  /** Fires on Enter without Shift, and from the send button. Ghost text isn't sent. */
  onSubmit?: (value: string) => void
  placeholder?: string
  /** The field's accessible name. */
  label?: string
  disabled?: boolean
  /** Shows the keys under the field while a suggestion shows. */
  showHints?: boolean
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  const setValue = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  // A suggestion is anchored to the value it was made for, so it survives the
  // user typing its own characters, and shrinks as they do.
  const [anchor, setAnchor] = React.useState({
    base: value,
    text: suggestion ?? "",
  })
  const [dismissed, setDismissed] = React.useState(false)
  const [previousSuggestion, setPreviousSuggestion] = React.useState(suggestion)
  if (suggestion !== previousSuggestion) {
    setPreviousSuggestion(suggestion)
    setAnchor({ base: value, text: suggestion ?? "" })
    setDismissed(false)
  }

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [caretAtEnd, setCaretAtEnd] = React.useState(true)
  const [focused, setFocused] = React.useState(false)
  const pendingCaret = React.useRef(false)
  const descriptionId = React.useId()
  const wordKey = useWordKey()

  const ghost =
    dismissed || disabled || !caretAtEnd
      ? ""
      : remainingCompletion(value, anchor.base, anchor.text)
  const showing = ghost.length > 0
  const empty = value.length === 0
  const canSubmit = !disabled && value.trim().length > 0

  // After an accept, the caret goes to the end of what was put in.
  React.useLayoutEffect(() => {
    if (!pendingCaret.current) return
    pendingCaret.current = false
    textareaRef.current?.setSelectionRange(value.length, value.length)
  }, [value])

  const syncCaret = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    setCaretAtEnd(
      textarea.selectionStart === textarea.selectionEnd &&
        textarea.selectionEnd === textarea.value.length
    )
  }

  const accept = (mode: AcceptMode) => {
    if (!showing) return
    const inserted = mode === "all" ? ghost : nextWord(ghost)
    pendingCaret.current = true
    setCaretAtEnd(true)
    setValue(value + inserted)
    onAccept?.(inserted, mode)
  }

  const submit = () => {
    if (canSubmit) onSubmit?.(value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) {
      return
    }
    // Tab accepts only while a suggestion shows; otherwise focus moves on.
    if (showing && event.key === "Tab" && !event.shiftKey) {
      event.preventDefault()
      accept("all")
      return
    }
    if (
      showing &&
      event.key === "ArrowRight" &&
      (event.altKey || event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault()
      accept("word")
      return
    }
    if (showing && event.key === "Escape") {
      event.preventDefault()
      setDismissed(true)
      onDismiss?.()
      return
    }
    if (event.key === "Enter" && !event.shiftKey && onSubmit) {
      event.preventDefault()
      submit()
    }
  }

  // Announced once when it arrives, not on every keystroke that shrinks it.
  const fresh = !dismissed && anchor.text !== "" && anchor.base === value
  const announcement =
    focused && fresh
      ? `Suggestion: ${(anchor.base + anchor.text).trim()}. Tab to accept.`
      : ""

  return (
    <div
      data-slot="prompt-autocomplete"
      data-suggesting={showing || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "flex w-full max-w-lg flex-col gap-1 rounded-xl border border-input bg-background p-2 transition-colors has-[textarea:focus-visible]:border-ring motion-reduce:transition-none dark:bg-input/30 data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span id={descriptionId} role="status" className="sr-only">
        {announcement}
      </span>

      <div className="relative">
        {/* The mirror: the same text wrapped the same way, the typed part invisible. */}
        <div
          aria-hidden
          className={cn(
            textMetrics,
            "pointer-events-none relative z-10 min-h-9 select-none"
          )}
        >
          <span className="text-transparent">{value}</span>
          {showing ? (
            <>
              <span
                data-slot="prompt-autocomplete-ghost"
                className="text-muted-foreground/60"
              >
                {ghost}
              </span>
              <button
                type="button"
                tabIndex={-1}
                onPointerDown={(event) => {
                  // Keeps focus, and the caret, in the field.
                  event.preventDefault()
                  accept("all")
                }}
                className="pointer-events-auto ms-1.5 inline-flex h-4 -translate-y-px cursor-pointer items-center rounded-sm border border-border px-1 align-middle text-[10px] leading-none text-muted-foreground transition-colors duration-80 hover:bg-muted hover:text-foreground motion-reduce:transition-none"
              >
                tab
              </button>
            </>
          ) : empty ? (
            <span className="text-muted-foreground/60">{placeholder}</span>
          ) : null}
          {/* Keeps a trailing newline from collapsing the last line. */}
          <span>{"​"}</span>
        </div>

        <textarea
          ref={textareaRef}
          data-slot="prompt-autocomplete-input"
          aria-label={label}
          aria-placeholder={placeholder}
          aria-describedby={descriptionId}
          aria-keyshortcuts={showing ? "Tab" : undefined}
          aria-autocomplete="inline"
          rows={1}
          value={value}
          disabled={disabled}
          spellCheck
          onChange={(event) => {
            setValue(event.target.value)
            setCaretAtEnd(
              event.target.selectionEnd === event.target.value.length
            )
          }}
          onKeyDown={onKeyDown}
          onSelect={syncCaret}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            textMetrics,
            "absolute inset-0 size-full resize-none overflow-hidden bg-transparent caret-foreground outline-none disabled:cursor-not-allowed"
          )}
        />
      </div>

      <div className="flex min-h-7 items-center justify-between gap-3 ps-2">
        <span
          aria-hidden
          data-slot="prompt-autocomplete-hints"
          data-visible={(showHints && showing) || undefined}
          className="flex min-w-0 items-center gap-1.5 truncate text-[11px] text-muted-foreground opacity-0 transition-opacity duration-150 data-visible:opacity-100 motion-reduce:transition-none"
        >
          <Kbd>tab</Kbd> accept
          <span className="text-muted-foreground/40">·</span>
          <Kbd>{wordKey}</Kbd> word
          <span className="text-muted-foreground/40">·</span>
          <Kbd>esc</Kbd> dismiss
        </span>
        {onSubmit ? (
          <Button
            data-slot="prompt-autocomplete-send"
            size="icon-sm"
            aria-label="Send message"
            disabled={!canSubmit}
            onClick={submit}
            className="rounded-full"
          >
            <HugeiconsIcon aria-hidden icon={ArrowUp02Icon} strokeWidth={2} />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export { PromptAutocomplete, nextWord, remainingCompletion }
export type { AcceptMode }
