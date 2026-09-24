"use client"

import * as React from "react"
import { ArrowUp02Icon, StopIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/aiellie/ui/button"
import { Textarea } from "@/registry/aiellie/ui/textarea"
import { cn } from "@/lib/utils"

// Named like the AI SDK's `useChat` status, so that value can be handed in.
type ComposerStatus = "ready" | "submitted" | "streaming" | "error"

type ComposerContextValue = {
  value: string
  setValue: (value: string) => void
  busy: boolean
  disabled: boolean
  submit: () => void
  stop?: () => void
}

const ComposerContext = React.createContext<ComposerContextValue | null>(null)

function useComposer() {
  const context = React.useContext(ComposerContext)
  if (!context) {
    throw new Error("Composer parts must be used inside <Composer>.")
  }
  return context
}

function Composer({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onStop,
  status = "ready",
  disabled = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit" | "defaultValue"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called with the trimmed text. Never called with an empty message. */
  onSubmit: (value: string) => void
  onStop?: () => void
  status?: ComposerStatus
  disabled?: boolean
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const controlled = valueProp !== undefined
  const value = controlled ? valueProp : uncontrolledValue
  const busy = status === "submitted" || status === "streaming"

  const setValue = (next: string) => {
    if (!controlled) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  const submit = () => {
    const text = value.trim()
    if (!text || busy || disabled) return
    onSubmit(text)
    setValue("")
  }

  return (
    <ComposerContext.Provider
      value={{ value, setValue, busy, disabled, submit, stop: onStop }}
    >
      <form
        data-slot="composer"
        data-status={status}
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        className={cn(
          "flex w-full flex-col gap-1 rounded-xl border border-input bg-background p-2 transition-colors has-[textarea:focus-visible]:border-ring motion-reduce:transition-none dark:bg-input/30",
          className
        )}
        {...props}
      >
        {children}
      </form>
    </ComposerContext.Provider>
  )
}

// An Enter pressed while an input method is composing belongs to the
// character, not the message.
function ComposerInput({
  className,
  onKeyDown,
  placeholder = "Ask anything",
  ...props
}: Omit<
  React.ComponentProps<typeof Textarea>,
  "value" | "defaultValue" | "onChange"
>) {
  const { value, setValue, submit, disabled } = useComposer()

  return (
    <Textarea
      data-slot="composer-input"
      rows={1}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          !event.nativeEvent.isComposing
        ) {
          event.preventDefault()
          submit()
        }
      }}
      className={cn(
        "max-h-48 min-h-10 resize-none border-0 bg-transparent px-2 py-1.5 focus-visible:border-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function ComposerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-footer"
      className={cn("flex items-center justify-end gap-1", className)}
      {...props}
    />
  )
}

function ComposerSubmit({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type" | "children">) {
  const { value, busy, disabled, stop } = useComposer()

  return (
    <Button
      data-slot="composer-submit"
      size="icon-sm"
      type={busy ? "button" : "submit"}
      onClick={
        busy
          ? (event) => {
              // Stopping turns this back into send before the click ends, and send's click
              // would submit the form.
              event.preventDefault()
              stop?.()
            }
          : undefined
      }
      disabled={busy ? !stop : disabled || !value.trim()}
      className={cn("rounded-full", className)}
      {...props}
    >
      <HugeiconsIcon icon={busy ? StopIcon : ArrowUp02Icon} strokeWidth={2} />
      <span className="sr-only">{busy ? "Stop" : "Send"}</span>
    </Button>
  )
}

export { Composer, ComposerFooter, ComposerInput, ComposerSubmit }
export type { ComposerStatus }
