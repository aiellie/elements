"use client"

import * as React from "react"
import {
  Cancel01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Command as CommandPrimitive } from "cmdk"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/aiellie/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/registry/aiellie/ui/input-group"
import { cn } from "@/lib/utils"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 gap-0 overflow-hidden rounded-xl p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

// Holds the text itself when the caller doesn't, since the clear button needs
// it and cmdk keeps its own copy out of reach.
function CommandInput({
  className,
  value,
  onValueChange,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const [ownValue, setOwnValue] = React.useState("")
  const search = value ?? ownValue
  const inputRef = React.useRef<HTMLInputElement>(null)

  const change = (next: string) => {
    if (value === undefined) setOwnValue(next)
    onValueChange?.(next)
  }

  return (
    <div
      data-slot="command-input-wrapper"
      className="-mx-1 -mt-1 mb-1 border-b border-border/60"
    >
      <InputGroup className="h-10 rounded-none border-0 bg-transparent dark:bg-transparent">
        <CommandPrimitive.Input
          ref={inputRef}
          data-slot="command-input"
          value={search}
          onValueChange={change}
          className={cn(
            "h-full w-full bg-transparent text-sm text-foreground outline-hidden placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <InputGroupAddon className="ps-4 text-muted-foreground/70">
          <HugeiconsIcon
            icon={Search01Icon}
            aria-hidden
            className="size-4 shrink-0"
          />
        </InputGroupAddon>
        {/* Disabled rather than hidden while empty, so the field's end doesn't
            shift as you type. */}
        <InputGroupAddon align="inline-end" className="pe-2">
          <InputGroupButton
            data-slot="command-input-clear"
            size="icon-xs"
            aria-label="Clear search"
            disabled={!search}
            onClick={() => {
              change("")
              inputRef.current?.focus()
            }}
            className="active:scale-90 disabled:opacity-30"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              aria-hidden
              strokeWidth={1.5}
              className="size-3.5"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        "py-6 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

// cmdk writes `data-selected` and `data-disabled` as "true" or "false", so the
// states are matched on their value rather than on the attribute being there.
function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex min-h-8 cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-foreground/[0.06] data-[selected=true]:text-foreground dark:data-[selected=true]:bg-foreground/[0.09] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <HugeiconsIcon
        icon={Tick02Icon}
        aria-hidden
        className="ms-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground group-data-[selected=true]/command-item:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
