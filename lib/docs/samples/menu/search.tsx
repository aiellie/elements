"use client"

import * as React from "react"
import { Add01Icon, Tag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import { Button } from "@/registry/aiellie/ui/button"

const LABELS = ["Bug", "Design", "Docs", "Feature", "Performance", "Question"]

export default function Search() {
  const [labels, setLabels] = React.useState(LABELS)
  const [label, setLabel] = React.useState("Feature")

  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" size="sm" />}>
        <HugeiconsIcon aria-hidden icon={Tag01Icon} />
        {label}
      </MenuTrigger>
      <MenuContent
        showSearch
        searchPlaceholder="Find or add a label"
        className="max-h-72 w-56"
        footer={(query) => (
          <MenuItem
            disabled={!query.trim() || labels.includes(query.trim())}
            onClick={() => {
              setLabels([...labels, query.trim()])
              setLabel(query.trim())
            }}
          >
            <HugeiconsIcon aria-hidden icon={Add01Icon} />
            {query.trim() ? `Add “${query.trim()}”` : "Add a label"}
          </MenuItem>
        )}
      >
        {labels.map((each) => (
          <MenuItem key={each} onClick={() => setLabel(each)}>
            {each}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  )
}
