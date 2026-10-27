import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Menu is Base UI's menu with this registry's surface on it, plus an optional search box that filters the rows as you type. It is the base of every menu here: the model, branch, project and plugin selectors, the add, help and user menus. Rows can be plain items, links, checkboxes, radio groups and submenus.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add a trigger and rows",
        body: [
          "Base UI composes through `render`, so the trigger becomes whatever button you pass it.",
        ],
        code: {
          title: "components/chat-options.tsx",
          code: `"use client"

import { MoreHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/aiellie/menu"
import { Button } from "@/components/ui/button"

export function ChatOptions({ onRename, onDelete }: {
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <HugeiconsIcon aria-hidden icon={MoreHorizontalIcon} />
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem onClick={onRename}>Rename</MenuItem>
        <MenuSeparator />
        <MenuItem variant="destructive" onClick={onDelete}>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}`,
        },
      },
      {
        title: "Turn on the search",
        body: [
          "`showSearch` adds a box at the top that filters the rows by their text. Groups whose rows all filter out go with them.",
        ],
        code: {
          code: `<MenuContent showSearch searchPlaceholder="Search projects">{rows}</MenuContent>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="menu-trigger" data-popup-open />

<div data-slot="menu-content" data-variant="glass">
  <div data-slot="menu-search" /> {/* only with showSearch */}
  <div data-slot="menu-item" data-highlighted data-variant="destructive">
    <svg /> {children} <span data-slot="menu-shortcut" />
  </div>
  <a data-slot="menu-link-item" />
  <div data-slot="menu-group">
    <div data-slot="menu-group-label" />
  </div>
  <div data-slot="menu-radio-group">
    <div data-slot="menu-radio-item"><span data-slot="menu-radio-item-indicator" /></div>
  </div>
  <div data-slot="menu-checkbox-item"><span data-slot="menu-checkbox-item-indicator" /></div>
  <div data-slot="menu-separator" />
  <div data-slot="menu-sub-trigger" /> {/* opens a menu-sub-content beside it */}
  <div data-slot="menu-footer" /> {/* only with footer, never filtered */}
</div>`,
    body: [
      'The popup is glass by default: a translucent background with a blur, a hairline border and a shadow, 14px from the trigger\'s corner. `variant="solid"` drops the blur for a popup over busy content. Rows are 12px text in `muted-foreground` that turn foreground on highlight; icons are 16px. It grows from the trigger and fades, and caps its height at the space available, scrolling inside.',
      "The search box is a row of the panel, not a field inside it, and its rows scroll under it. It matches each row's text, so rows must be the menu's own parts: a row wrapped in a component of your own is kept whatever the query. `footer` rows are pinned under the list and never filtered; given a function, they get the query, for a row that acts on what was typed.",
    ],
  },
  examples: [
    {
      title: "Search with an action for what was typed",
      body: [
        "The footer gets the query, so it can offer to add a label that doesn't exist yet.",
      ],
      sample: "menu/search",
    },
    {
      title: "Checkboxes and radio groups",
      body: [
        "Radio rows choose one of a group and checkbox rows switch something on. Both keep the menu open, so several can be set in one go.",
      ],
      sample: "menu/checkbox-and-radio",
    },
    {
      title: "Submenus, shortcuts and destructive rows",
      sample: "menu/submenu",
    },
  ],
  api: [
    {
      title: "MenuContent",
      body: [
        "The popup, with its portal and positioner. Takes Base UI's `Menu.Popup` props.",
      ],
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`side`",
          '`"top" | "bottom" | "left" | "right"`',
          '`"bottom"`',
          "Which side of the trigger it opens on.",
        ],
        [
          "`align`",
          '`"start" | "center" | "end"`',
          '`"start"`',
          "How it lines up with the trigger.",
        ],
        [
          "`sideOffset` / `alignOffset`",
          "`number`",
          "`6` / `0`",
          "Distance from the trigger.",
        ],
        [
          "`variant`",
          '`"glass" | "solid"`',
          '`"glass"`',
          "With or without the blur behind it.",
        ],
        [
          "`showSearch`",
          "`boolean`",
          "`false`",
          "Adds a search box that filters the rows.",
        ],
        [
          "`searchPlaceholder`",
          "`string`",
          '`"Search"`',
          "The search box's placeholder.",
        ],
        [
          "`emptyMessage`",
          "`string`",
          '`"No matches"`',
          "Shown when the search matches nothing.",
        ],
        [
          "`footer`",
          "`ReactNode | (query: string) => ReactNode`",
          "",
          "Rows pinned under the list, which the search never filters.",
        ],
      ],
    },
    {
      title: "MenuItem",
      body: ["Base UI's `Menu.Item`."],
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`variant`",
          '`"default" | "destructive"`',
          '`"default"`',
          "Destructive rows are red, for deleting or leaving.",
        ],
        ["`onClick`", "`() => void`", "", "Runs when the row is chosen."],
        [
          "`closeOnClick`",
          "`boolean`",
          "`true`",
          "Whether choosing it closes the menu.",
        ],
        ["`disabled`", "`boolean`", "`false`", "Dims the row and skips it."],
      ],
    },
    {
      title: "Parts",
      head: ["Export", "Renders", "Notes"],
      rows: [
        [
          "`Menu`",
          "Base UI `Menu.Root`",
          "Holds the open state. `open` and `onOpenChange` control it.",
        ],
        [
          "`MenuTrigger`",
          "`button`",
          "Takes `render` for the element it should be.",
        ],
        [
          "`MenuLinkItem`",
          "`a`",
          "A row that is a real link. Pass `render={<Link href />}` for a Next link.",
        ],
        [
          "`MenuCheckboxItem`",
          "`div`",
          "`checked` and `onCheckedChange`; a tick shows while checked.",
        ],
        [
          "`MenuRadioGroup` / `MenuRadioItem`",
          "`div`",
          "`value` and `onValueChange` on the group, `value` on each row.",
        ],
        [
          "`MenuGroup` / `MenuGroupLabel`",
          "`div`",
          "A labelled group of rows.",
        ],
        ["`MenuSeparator`", "`div`", "A hairline between groups."],
        ["`MenuShortcut`", "`span`", "Keys at the end of a row."],
        [
          "`MenuSub` / `MenuSubTrigger` / `MenuSubContent`",
          "`div`",
          "A row that opens another menu beside it.",
        ],
        [
          "`menuItem`",
          "`string`",
          "The row's class string, for rows you build yourself.",
        ],
      ],
    },
  ],
}

export default doc
