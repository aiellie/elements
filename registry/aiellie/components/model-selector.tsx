"use client"

import * as React from "react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  modelIcons,
  type ModelIconName,
  type ModelIconProps,
} from "@/registry/aiellie/icons/model-icons"
import { groupByVendor, VENDOR_NAMES } from "@/registry/aiellie/lib/models"
import type { ModelOption } from "@/registry/aiellie/lib/models"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"

function ModelMark({
  vendor,
  ...props
}: ModelIconProps & { vendor: ModelIconName }) {
  const Mark = modelIcons[vendor]
  return <Mark {...props} />
}

// The models come in as data rather than as composed rows because the menu's
// search matches its own row types, and a wrapped row would never filter out.
function ModelSelector({
  models,
  value,
  onValueChange,
  label = "Model",
  placeholder = "Select a model",
  showSearch = false,
  side,
  align,
  render = <Button variant="outline" size="sm" />,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children" | "value"> & {
  models: ModelOption[]
  value: string
  onValueChange: (value: string) => void
  /** What is being chosen, read out ahead of the model's name. */
  label?: string
  /** Stands in the trigger while `value` matches none of `models`. */
  placeholder?: string
  /** The box takes focus as the menu opens, so it only pays off in a long list. */
  showSearch?: boolean
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  const selected = models.find((model) => model.id === value)

  return (
    <Menu>
      <MenuTrigger render={render} {...props}>
        {selected ? (
          <>
            <ModelMark vendor={selected.vendor} />
            {/* Real text rather than an `aria-label`, so it translates with the page. */}
            <span className="sr-only">{label}: </span>
            {selected.name}
          </>
        ) : (
          placeholder
        )}
        <HugeiconsIcon
          aria-hidden
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="transition-transform duration-150 group-aria-expanded/button:rotate-180 motion-reduce:transition-none"
        />
      </MenuTrigger>

      <MenuContent
        side={side}
        align={align}
        showSearch={showSearch}
        searchPlaceholder="Search models"
        className="min-w-48"
      >
        {/* A flat array, not fragments: the search keeps anything it doesn't recognise. */}
        {groupByVendor(models).flatMap(([vendor, rows], index) => [
          index > 0 && <MenuSeparator key={`${vendor}-separator`} />,
          <MenuRadioGroup
            key={vendor}
            value={value}
            onValueChange={onValueChange}
          >
            <MenuGroupLabel>{VENDOR_NAMES[vendor]}</MenuGroupLabel>
            {rows.map((model) => (
              // Closes on a pick, unlike the menu's radio rows: a model is chosen once.
              <MenuRadioItem
                key={model.id}
                value={model.id}
                disabled={model.disabled}
                closeOnClick
              >
                <ModelMark vendor={model.vendor} />
                {model.name}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>,
        ])}
      </MenuContent>
    </Menu>
  )
}

export { ModelSelector }
export type { ModelOption }
