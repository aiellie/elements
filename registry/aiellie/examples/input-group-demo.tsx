"use client"

import { Copy01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/registry/aiellie/ui/input-group"

export default function InputGroupDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="Search chats" />
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} aria-hidden />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>12 chats</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Share link"
          defaultValue="aiellie.dev/c/8f2k"
          readOnly
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy link">
            <HugeiconsIcon icon={Copy01Icon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
