"use client"

import * as React from "react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  modelIcons,
  type ModelIconName,
  type ModelIconProps,
} from "@/registry/aiellie/components/icons/model-icons"
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

/**
 * One model on offer. `vendor` does two jobs — it picks the mark the row wears
 * and the group the row is listed under — so a model is filed by saying whose
 * it is, rather than by being written into the right list.
 */
interface ModelOption {
  /** What `value` holds while this model is the chosen one. */
  id: string
  /** What the row says, and what the trigger says once this is chosen. */
  name: string
  /** Whose model it is, as a key of `modelIcons`. */
  vendor: ModelIconName
  /** Listed, but not choosable — a model the current plan does not include. */
  disabled?: boolean
}

/**
 * The heading over each vendor's rows. These name the company rather than the
 * product: a row already says "Claude" or "Gemini" in its own name, and a
 * heading that says it again tells the reader nothing the row did not.
 *
 * Typed against the set's keys, so a mark added to `model-icons` stops the
 * type check here until it has a name, instead of heading its group with
 * nothing.
 */
const VENDOR_NAMES: Record<ModelIconName, string> = {
  claude: "Anthropic",
  openai: "OpenAI",
  gemini: "Google",
  grok: "xAI",
  deepseek: "DeepSeek",
  mistral: "Mistral",
  v0: "Vercel",
}

function ModelMark({
  vendor,
  ...props
}: ModelIconProps & { vendor: ModelIconName }) {
  const Mark = modelIcons[vendor]
  return <Mark {...props} />
}

/**
 * The models, gathered by vendor. A group sits where its first model was and
 * rows keep the order they came in, so the menu reads the way the list was
 * written without anyone sorting it by vendor first.
 */
function groupByVendor(models: ModelOption[]) {
  const groups = new Map<ModelIconName, ModelOption[]>()

  for (const model of models) {
    const group = groups.get(model.vendor)
    if (group) group.push(model)
    else groups.set(model.vendor, [model])
  }

  return [...groups]
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
  render = <Button variant="ghost" />,
  className,
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
      <MenuTrigger render={<Button variant="outline" size="sm" />}>
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
