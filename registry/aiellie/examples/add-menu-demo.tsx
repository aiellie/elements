"use client"

import {
  Attachment01Icon,
  Camera01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AddMenu } from "@/registry/aiellie/components/add-menu"
import { MenuItem } from "@/registry/aiellie/components/menu"

export default function AddMenuDemo() {
  return (
    <AddMenu side="bottom">
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
        Upload files
      </MenuItem>
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={Image01Icon} />
        Add photos
      </MenuItem>
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={Camera01Icon} />
        Take a photo
      </MenuItem>
    </AddMenu>
  )
}
