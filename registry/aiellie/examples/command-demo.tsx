"use client"

import {
  BubbleChatAddIcon,
  Folder01Icon,
  PencilEdit02Icon,
  Search01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/aiellie/ui/command"

export default function CommandDemo() {
  return (
    <Command className="h-auto max-w-sm border">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>
        <CommandGroup heading="Chats">
          <CommandItem>
            <HugeiconsIcon icon={PencilEdit02Icon} aria-hidden />
            New chat
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <HugeiconsIcon icon={BubbleChatAddIcon} aria-hidden />
            Quick chat
            <CommandShortcut>⌘⇧N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <HugeiconsIcon icon={Search01Icon} aria-hidden />
            Search chats
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          <CommandItem>
            <HugeiconsIcon icon={Folder01Icon} aria-hidden />
            Projects
          </CommandItem>
          <CommandItem>
            <HugeiconsIcon icon={Settings01Icon} aria-hidden />
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
