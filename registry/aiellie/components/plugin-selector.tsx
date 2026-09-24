"use client"

import * as React from "react"
import {
  ArrowDown01Icon,
  Cancel01Icon,
  PuzzleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { Button } from "@/registry/aiellie/ui/button"
import { cn } from "@/lib/utils"

type PluginOption = {
  id: string
  name: string
  icon: IconSvgElement
}

// The trigger shows this many marks before it lets the count speak for the rest.
const SHOWN_MARKS = 3

/** The plugin rows alone, for a menu of your own, like a submenu of an add menu. */
function PluginSelectorItems({
  plugins,
  value,
  onValueChange,
}: {
  plugins: PluginOption[]
  value: string[]
  onValueChange: (value: string[]) => void
}) {
  // Kept in the list's order, whatever order they were ticked in.
  const toggle = (id: string, on: boolean) =>
    onValueChange(
      plugins
        .map((plugin) => plugin.id)
        .filter((each) => (each === id ? on : value.includes(each)))
    )

  return plugins.map((plugin) => (
    <MenuCheckboxItem
      key={plugin.id}
      checked={value.includes(plugin.id)}
      onCheckedChange={(checked) => toggle(plugin.id, checked)}
    >
      <HugeiconsIcon aria-hidden icon={plugin.icon} />
      {plugin.name}
    </MenuCheckboxItem>
  ))
}

/** The plugins turned on, one chip each with its own remove button. */
function PluginChips({
  plugins,
  value,
  onValueChange,
  className,
}: {
  plugins: PluginOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  className?: string
}) {
  const selected = plugins.filter((plugin) => value.includes(plugin.id))
  if (selected.length === 0) return null

  return (
    <div
      data-slot="plugin-chips"
      className={cn("flex flex-wrap items-center gap-1", className)}
    >
      {selected.map((plugin) => (
        <span
          key={plugin.id}
          data-slot="plugin-chip"
          className="group/chip inline-flex h-6 items-center gap-0.5 rounded-full border bg-background ps-0.5 pe-2 text-xs text-foreground dark:bg-input/30"
        >
          {/* The mark turns into the way to turn the plugin off on hover. */}
          <TooltipIconButton
            tooltip={`Turn off ${plugin.name}`}
            side="top"
            onClick={() =>
              onValueChange(value.filter((id) => id !== plugin.id))
            }
            className="group/remove size-5 rounded-full p-0.5 [&_svg]:size-3.5 [&_svg]:text-foreground"
          >
            <HugeiconsIcon
              aria-hidden
              icon={plugin.icon}
              className="group-hover/chip:hidden group-focus-visible/remove:hidden"
            />
            <HugeiconsIcon
              aria-hidden
              icon={Cancel01Icon}
              className="hidden group-hover/chip:block group-focus-visible/remove:block"
            />
          </TooltipIconButton>
          {plugin.name}
        </span>
      ))}
    </div>
  )
}

function PluginSelector({
  plugins,
  value,
  onValueChange,
  label = "Plugins",
  side,
  align,
  render = <Button variant="outline" size="xs" />,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children" | "value"> & {
  plugins: PluginOption[]
  /** The ids of the plugins turned on. */
  value: string[]
  onValueChange: (value: string[]) => void
  /** What is being chosen, read out ahead of the names. */
  label?: string
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  const selected = plugins.filter((plugin) => value.includes(plugin.id))

  return (
    <Menu>
      <MenuTrigger data-slot="plugin-selector" render={render} {...props}>
        {selected.length > 0 ? (
          selected
            .slice(0, SHOWN_MARKS)
            .map((plugin) => (
              <HugeiconsIcon key={plugin.id} aria-hidden icon={plugin.icon} />
            ))
        ) : (
          <HugeiconsIcon aria-hidden icon={PuzzleIcon} />
        )}
        <span className="sr-only">
          {label}: {selected.map((plugin) => plugin.name).join(", ")}
        </span>
        <span aria-hidden>
          {selected.length === 1
            ? selected[0].name
            : selected.length > 1
              ? `${selected.length} plugins`
              : label}
        </span>
        <HugeiconsIcon
          aria-hidden
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="transition-transform duration-150 group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
        />
      </MenuTrigger>
      <MenuContent side={side} align={align} className="min-w-48">
        <MenuGroup>
          <MenuGroupLabel>Plugins</MenuGroupLabel>
          <PluginSelectorItems
            plugins={plugins}
            value={value}
            onValueChange={onValueChange}
          />
        </MenuGroup>
        {value.length > 0 ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={() => onValueChange([])}>
              <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
              Turn off all plugins
            </MenuItem>
          </>
        ) : null}
      </MenuContent>
    </Menu>
  )
}

export { PluginChips, PluginSelector, PluginSelectorItems }
export type { PluginOption }
