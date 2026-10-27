"use client"

import {
  Idea01Icon,
  LanguageSquareIcon,
  TextAlignLeftIcon,
  TextIcon,
} from "@hugeicons/core-free-icons"

import {
  Composer,
  ComposerFooter,
  ComposerInput,
  ComposerSubmit,
} from "@/registry/aiellie/components/composer"
import {
  SlashMenu,
  type SlashCommand,
} from "@/registry/aiellie/components/slash-menu"

const COMMANDS: SlashCommand[] = [
  {
    id: "summarize",
    description: "Sum up the thread so far",
    icon: TextAlignLeftIcon,
  },
  {
    id: "explain",
    description: "Explain the last reply simply",
    icon: Idea01Icon,
  },
  {
    id: "translate",
    description: "Translate into another language",
    icon: LanguageSquareIcon,
  },
  {
    id: "rewrite",
    description: "Say the last reply another way",
    icon: TextIcon,
  },
]

export default function SlashMenuDemo() {
  return (
    <Composer onSubmit={() => {}} className="mt-auto max-w-md">
      <SlashMenu commands={COMMANDS}>
        <ComposerInput placeholder="Type / for commands" />
      </SlashMenu>
      <ComposerFooter>
        <ComposerSubmit />
      </ComposerFooter>
    </Composer>
  )
}
