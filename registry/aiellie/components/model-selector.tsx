"use client"

import * as React from "react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  modelIcons,
  type ModelIconName,
  type ModelIconProps,
} from "@/registry/aiellie/components/icons/model-icons"
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
} from "@/registry/aiellie/ui/menu"

function ModelMark({
  vendor,
  ...props
}: ModelIconProps & { vendor: ModelIconName }) {
  const Mark = modelIcons[vendor]
  return <Mark {...props} />
}

/**
 * The model a message goes to, and the menu that changes it: a button showing
 * the choice, over the models grouped by vendor with each row wearing its
 * vendor's mark.
 *
 * The models come in as data rather than as parts to compose, and that is
 * forced rather than chosen. The menu's search reads its rows by type — it
 * matches its own radio rows and drops the groups they leave empty — so a row
 * wrapped in a component of this file's would be a type it does not know, and
 * would stay in the list whatever was typed. Taking a list is what lets the
 * rows below be the menu's own parts.
 *
 * Controlled only. The choice is read by whatever sends the message, so it
 * already lives outside the menu, and a copy kept in here too would be a
 * second answer to the same question.
 */
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
  /** The chosen model's `id`. One that names no model shows `placeholder`. */
  value: string
  onValueChange: (value: string) => void
  /** What is being chosen, read out ahead of the model's name. */
  label?: string
  /** Stands in the trigger while `value` matches none of `models`. */
  placeholder?: string
  /**
   * A box over the rows that narrows them by name. Off unless asked for, as
   * it is on the menu: the box takes the focus as the menu opens, which earns
   * its place in a list of thirty and is in the way in a list of four.
   */
  showSearch?: boolean
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  const selected = models.find((model) => model.id === value)

  return (
    <Menu>
      {/* `render` and the rest of the trigger's props are passed on rather
          than swallowed: a selector sits in a composer next to other controls,
          and the button it wears is the caller's to match. The default is the
          shape it had when it wore a fixed one. */}
      <MenuTrigger render={render} {...props}>
        {selected ? (
          <>
            <ModelMark vendor={selected.vendor} />
            {/* The name says what is chosen but not what is being chosen, so
                the button's name carries both. Real text rather than an
                `aria-label`, so it translates with the page. */}
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
        {/* One flat array rather than fragments, for the same reason the
            models are data: the search walks these by type, and anything it
            does not recognise is kept whatever was typed. */}
        {groupByVendor(models).flatMap(([vendor, rows], index) => [
          index > 0 && <MenuSeparator key={`${vendor}-separator`} />,
          // One radio group per vendor, all reading the same value. Base UI's
          // radio group is a group as well, so the label names its rows
          // directly, and a pick in one clears the tick in the rest because
          // the value they read has moved.
          <MenuRadioGroup
            key={vendor}
            value={value}
            onValueChange={onValueChange}
          >
            <MenuGroupLabel>{VENDOR_NAMES[vendor]}</MenuGroupLabel>
            {rows.map((model) => (
              // Closes on a pick, unlike the menu's radio rows. Those are
              // settings, changed in passing and sometimes twice; a model is
              // chosen once, and what comes next is the message.
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
