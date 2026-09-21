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
} from "@/registry/aiellie/ui/menu"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "@/registry/aiellie/ui/toolbar"

/**
 * A formatting row: two groups of controls, a field, a link and a menu, divided
 * by the rules the toolbar draws itself.
 *
 * Every button is a glyph, so every button carries its name on a hover — a row
 * of marks with nothing to read is only legible to someone who already knows
 * it. The whole row is one tab stop: Tab reaches it, the arrows walk it, Tab
 * again leaves, which is the thing worth trying here with the keyboard.
 */
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
      {/* The marks are a set, so each one says whether it is on. */}
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
        {/* Still in the row and still walked to, just not usable. */}
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

      {/* Alignment is a choice of one, so only the chosen one is pressed. */}
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

      {/* The caret keeps the left and right keys while there is text either
          side of it, and hands them back to the row at each end. */}
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

      {/* The overflow: what a row this size has no width left to show. The
          button is the trigger rather than something nested inside one, so it
          stays an item of the toolbar and the arrows still reach it. It takes
          no tooltip — the menu it opens is the label. */}
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