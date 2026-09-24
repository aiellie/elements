"use client"

import * as React from "react"
import {
  FigmaIcon,
  Github01Icon,
  GoogleDriveIcon,
  SlackIcon,
} from "@hugeicons/core-free-icons"

import {
  PluginSelector,
  type PluginOption,
} from "@/registry/aiellie/components/plugin-selector"

const PLUGINS: PluginOption[] = [
  { id: "github", name: "GitHub", icon: Github01Icon },
  { id: "drive", name: "Google Drive", icon: GoogleDriveIcon },
  { id: "slack", name: "Slack", icon: SlackIcon },
  { id: "figma", name: "Figma", icon: FigmaIcon },
]

export default function PluginSelectorDemo() {
  const [plugins, setPlugins] = React.useState(["github", "slack"])

  return (
    <PluginSelector
      plugins={PLUGINS}
      value={plugins}
      onValueChange={setPlugins}
    />
  )
}
