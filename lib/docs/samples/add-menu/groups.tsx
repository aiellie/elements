"use client"

import {
  Attachment01Icon,
  Folder01Icon,
  GithubIcon,
  GoogleDriveIcon,
  Image01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AddMenu } from "@/registry/aiellie/components/add-menu"
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
} from "@/registry/aiellie/components/menu"

export default function Groups() {
  return (
    <AddMenu side="bottom" tooltip="Add files and more">
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={Attachment01Icon} />
        Upload files
      </MenuItem>
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={Image01Icon} />
        Add photos
      </MenuItem>
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={Folder01Icon} />
        Add a folder
      </MenuItem>
      <MenuSeparator />
      <MenuGroup>
        <MenuGroupLabel>Connected</MenuGroupLabel>
        <MenuItem>
          <HugeiconsIcon aria-hidden icon={GoogleDriveIcon} />
          Google Drive
        </MenuItem>
        <MenuItem>
          <HugeiconsIcon aria-hidden icon={GithubIcon} />
          GitHub
        </MenuItem>
      </MenuGroup>
    </AddMenu>
  )
}
