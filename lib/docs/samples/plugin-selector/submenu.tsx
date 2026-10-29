"use client"

import * as React from "react"
import {
  Attachment01Icon,
  FigmaIcon,
  Github01Icon,
  PuzzleIcon,
  SlackIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AddMenu } from "@/registry/aiellie/components/add-menu"
import {
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from "@/registry/aiellie/ui/menu"
import {
  PluginSelectorItems,
  type PluginOption,
} from "@/registry/aiellie/components/plugin-selector"

const PLUGINS: PluginOption[] = [
  { id: "github", name: "GitHub", icon: Github01Icon },
  { id: "slack", name: "Slack", icon: SlackIcon },
  { id: "figma", name: "Figma", icon: FigmaIcon },
]

export default function Submenu() {
  const [plugins, setPlugins] = React.useState<string[]>([])

  return (
    <AddMenu side="bottom">
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
        Upload files
      </MenuItem>
      <MenuSub>
        <MenuSubTrigger>
          <HugeiconsIcon aria-hidden icon={PuzzleIcon} />
          Plugins
        </MenuSubTrigger>
        <MenuSubContent>
          <PluginSelectorItems
            plugins={PLUGINS}
            value={plugins}
            onValueChange={setPlugins}
          />
        </MenuSubContent>
      </MenuSub>
    </AddMenu>
  )
}
