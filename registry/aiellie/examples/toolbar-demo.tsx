"use client"

import * as React from "react"
import {
  Eraser01Icon,
  Image01Icon,
  Link01Icon,
  MoreHorizontalIcon,
  SourceCodeIcon,
  Table01Icon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "@/registry/aiellie/components/toolbar"

export default function ToolbarDemo() {
  const [marks, setMarks] = React.useState<string[]>(["bold"])
  const [align, setAlign] = React.useState("left")

  const toggle = (mark: string) =>
    setMarks((current) =>
      current.includes(mark)
        ? current.filter((value) => value !== mark)
        : [...current, mark]
    )

  return (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup aria-label="Text style">
        <ToolbarButton
          aria-label="Bold"
          tooltip="Bold"
          aria-pressed={marks.includes("bold")}
          onClick={() => toggle("bold")}
        >
          <HugeiconsIcon aria-hidden icon={TextBoldIcon} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Italic"
          tooltip="Italic"
          aria-pressed={marks.includes("italic")}
          onClick={() => toggle("italic")}
        >
          <HugeiconsIcon aria-hidden icon={TextItalicIcon} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Underline"
          tooltip="Underline"
          aria-pressed={marks.includes("underline")}
          onClick={() => toggle("underline")}
        >
          <HugeiconsIcon aria-hidden icon={TextUnderlineIcon} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Strikethrough"
          tooltip="Strikethrough"
          disabled
        >
          <HugeiconsIcon
            aria-hidden
            icon={TextStrikethroughIcon}
            strokeWidth={2}
          />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup aria-label="Alignment">
        <ToolbarButton
          aria-label="Align left"
          tooltip="Align left"
          aria-pressed={align === "left"}
          onClick={() => setAlign("left")}
        >
          <HugeiconsIcon aria-hidden icon={TextAlignLeftIcon} strokeWidth={2} />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Align center"
          tooltip="Align center"
          aria-pressed={align === "center"}
          onClick={() => setAlign("center")}
        >
          <HugeiconsIcon
            aria-hidden
            icon={TextAlignCenterIcon}
            strokeWidth={2}
          />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Align right"
          tooltip="Align right"
          aria-pressed={align === "right"}
          onClick={() => setAlign("right")}
        >
          <HugeiconsIcon
            aria-hidden
            icon={TextAlignRightIcon}
            strokeWidth={2}
          />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarInput placeholder="Link URL" aria-label="Link URL" />

      <ToolbarLink
        href="https://base-ui.com/react/components/toolbar"
        target="_blank"
        rel="noreferrer"
        aria-label="Documentation"
      >
        <HugeiconsIcon aria-hidden icon={Link01Icon} strokeWidth={2} />
      </ToolbarLink>

      <ToolbarSeparator />

      {/* The button is the trigger rather than nested in one, so the arrows still reach it. */}
      <Menu>
        <MenuTrigger render={<ToolbarButton aria-label="More" />}>
          <HugeiconsIcon
            aria-hidden
            icon={MoreHorizontalIcon}
            strokeWidth={2}
          />
        </MenuTrigger>
        <MenuContent side="bottom" align="end">
          <MenuGroup>
            <MenuGroupLabel>Insert</MenuGroupLabel>
            <MenuItem>
              <HugeiconsIcon aria-hidden icon={Image01Icon} />
              Image
            </MenuItem>
            <MenuItem>
              <HugeiconsIcon aria-hidden icon={Table01Icon} />
              Table
            </MenuItem>
            <MenuItem>
              <HugeiconsIcon aria-hidden icon={SourceCodeIcon} />
              Code block
            </MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem variant="destructive" onClick={() => setMarks([])}>
            <HugeiconsIcon aria-hidden icon={Eraser01Icon} />
            Clear formatting
          </MenuItem>
        </MenuContent>
      </Menu>
    </Toolbar>
  )
}
