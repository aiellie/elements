"use client"

import * as React from "react"
import {
  ArrowShrink02Icon,
  BookOpen01Icon,
  CircleDashedIcon,
  GitPullRequestIcon,
  Mortarboard01Icon,
  QuillWrite01Icon,
  QuoteUpIcon,
  Route01Icon,
  TaskDaily01Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import { Button } from "@/registry/aiellie/ui/button"

type PromptGroup = { id: string; name: string; icon: IconSvgElement }

type Prompt = {
  id: string
  name: string
  /** The id of the group it goes under. */
  group: string
  /** How the answer changes, under the name. */
  description: string
  /** The instructions themselves, for your route to send. */
  prompt: string
  icon: IconSvgElement
}

const PROMPT_GROUPS: PromptGroup[] = [
  { id: "styles", name: "Styles", icon: QuoteUpIcon },
  { id: "workflows", name: "Workflows", icon: Route01Icon },
]

const PROMPTS: Prompt[] = [
  {
    id: "concise",
    name: "Concise",
    group: "styles",
    description: "Answers in the fewest words that still answer.",
    prompt:
      "Be concise. Lead with the answer, leave out the preamble and the hedging, and stop once the question is dealt with.",
    icon: ArrowShrink02Icon,
  },
  {
    id: "explanatory",
    name: "Explanatory",
    group: "styles",
    description: "Teaches as it goes, saying why before what.",
    prompt:
      "Explain your reasoning as you work. Before each step, say why it is the right one.",
    icon: Mortarboard01Icon,
  },
  {
    id: "formal",
    name: "Formal",
    group: "styles",
    description: "Writes the way documentation would.",
    prompt:
      "Write formally, as documentation would: full sentences, no asides, and every term defined the first time it is used.",
    icon: BookOpen01Icon,
  },
  {
    id: "code-reviewer",
    name: "Code reviewer",
    group: "workflows",
    description: "Reads a change for what would break, and says where.",
    prompt:
      "Review the change for what would break. Name the file and line, and rank the findings by how much each one matters.",
    icon: GitPullRequestIcon,
  },
  {
    id: "planner",
    name: "Planner",
    group: "workflows",
    description: "Lays the work out before doing any of it.",
    prompt:
      "Plan before acting: lay the work out as ordered steps, say what each one touches, and wait for agreement before starting.",
    icon: TaskDaily01Icon,
  },
  {
    id: "test-first",
    name: "Test-first",
    group: "workflows",
    description: "Writes the failing test before the code.",
    prompt:
      "Work test-first: write a test that pins the behaviour down, watch it fail, then write the least code that makes it pass.",
    icon: TestTube01Icon,
  },
]

function PromptMenu({
  prompts = PROMPTS,
  groups = PROMPT_GROUPS,
  value,
  onValueChange,
  label = "Prompt",
  side,
  align,
  render = <Button variant="ghost" size="sm" />,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children" | "value"> & {
  prompts?: Prompt[]
  groups?: PromptGroup[]
  /** The chosen prompt's id, or `""` for none. */
  value: string
  onValueChange: (value: string) => void
  /** Shown on the button while no prompt is chosen. */
  label?: string
  side?: React.ComponentProps<typeof MenuContent>["side"]
  align?: React.ComponentProps<typeof MenuContent>["align"]
}) {
  const selected = prompts.find((prompt) => prompt.id === value)

  return (
    <Menu>
      <MenuTrigger
        data-slot="prompt-menu"
        data-active={selected ? true : undefined}
        aria-label={selected ? `${label}: ${selected.name}` : label}
        render={render}
        className="text-muted-foreground data-active:text-foreground"
        {...props}
      >
        <HugeiconsIcon aria-hidden icon={selected?.icon ?? QuillWrite01Icon} />
        {selected?.name ?? label}
      </MenuTrigger>
      <MenuContent
        side={side}
        align={align}
        className="max-h-[min(26rem,var(--available-height))] w-72 overscroll-contain"
      >
        <MenuRadioGroup
          value={value}
          onValueChange={(next: string) => onValueChange(next)}
        >
          <MenuRadioItem value="" closeOnClick>
            <HugeiconsIcon aria-hidden icon={CircleDashedIcon} />
            None
          </MenuRadioItem>
          {groups.map((group) => {
            const grouped = prompts.filter(
              (prompt) => prompt.group === group.id
            )
            if (grouped.length === 0) return null
            return (
              <React.Fragment key={group.id}>
                <MenuSeparator />
                <MenuGroup>
                  <MenuGroupLabel>{group.name}</MenuGroupLabel>
                  {grouped.map((prompt) => (
                    <MenuRadioItem
                      key={prompt.id}
                      value={prompt.id}
                      closeOnClick
                      className="items-start py-2"
                    >
                      <HugeiconsIcon
                        aria-hidden
                        icon={prompt.icon}
                        className="mt-px shrink-0"
                      />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span>{prompt.name}</span>
                        <span className="font-normal text-foreground/70">
                          {prompt.description}
                        </span>
                      </span>
                    </MenuRadioItem>
                  ))}
                </MenuGroup>
              </React.Fragment>
            )
          })}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  )
}

export { PROMPT_GROUPS, PROMPTS, PromptMenu }
export type { Prompt, PromptGroup }
