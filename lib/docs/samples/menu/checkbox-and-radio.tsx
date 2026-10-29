"use client"

import * as React from "react"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import { Button } from "@/registry/aiellie/ui/button"

export default function CheckboxAndRadio() {
  const [sort, setSort] = React.useState("recent")
  const [archived, setArchived] = React.useState(false)
  const [pinned, setPinned] = React.useState(true)

  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" size="sm" />}>
        View
      </MenuTrigger>
      <MenuContent className="w-52">
        <MenuRadioGroup value={sort} onValueChange={setSort}>
          <MenuGroupLabel>Sort by</MenuGroupLabel>
          <MenuRadioItem value="recent">Most recent</MenuRadioItem>
          <MenuRadioItem value="name">Name</MenuRadioItem>
          <MenuRadioItem value="created">Date created</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Show</MenuGroupLabel>
          <MenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
            Pinned first
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={archived} onCheckedChange={setArchived}>
            Archived chats
          </MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  )
}
