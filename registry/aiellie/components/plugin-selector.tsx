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
import { Button } from "@/registry/aiellie/ui/button"

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

export { PluginSelector, PluginSelectorItems }
export type { PluginOption }
