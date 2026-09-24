"use client"

import * as React from "react"
import { BubbleChatIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { Conversation } from "@/registry/aiellie/blocks/chat/components/chat-data"
import { usePanels } from "@/registry/aiellie/components/panels"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/aiellie/ui/command"

const SNIPPET_LEAD = 24

type Result = {
  chat: Conversation
  /** The part of a message that matched, when the title didn't. */
  snippet?: { before: string; match: string; after: string }
}

function search(chats: Conversation[], query: string): Result[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return chats.map((chat) => ({ chat }))

  return chats.flatMap((chat): Result[] => {
    if (chat.title.toLowerCase().includes(needle)) return [{ chat }]

    for (const message of chat.messages) {
      const text = message.content.replace(/\s+/g, " ")
      const at = text.toLowerCase().indexOf(needle)
      if (at === -1) continue
      const from = Math.max(0, at - SNIPPET_LEAD)
      return [
        {
          chat,
          snippet: {
            before: (from > 0 ? "…" : "") + text.slice(from, at),
            match: text.slice(at, at + needle.length),
            after: text.slice(at + needle.length),
          },
        },
      ]
    }
    return []
  })
}

function ChatSearch({
  open,
  onOpenChange,
  chats,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  chats: Conversation[]
  onSelect: (id: string) => void
}) {
  const [query, setQuery] = React.useState("")
  const { closeSheet } = usePanels()
  const results = search(chats, query)

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      // Cleared once the dialog has faded out, so the list doesn't jump back
      // to every chat while it's still on screen.
      onOpenChangeComplete={(next) => {
        if (!next) setQuery("")
      }}
      title="Search chats"
      description="Find a chat by its name or by something said in it."
      className="sm:max-w-lg"
    >
      {/* Filtered here rather than by cmdk, which only sees an item's value
          and so can't match what was said in a chat. */}
      <Command shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search chats…"
        />
        <CommandList className="max-h-80">
          <CommandEmpty>
            {chats.length === 0 ? "No chats yet." : "No chats match."}
          </CommandEmpty>
          {results.length > 0 ? (
            <CommandGroup heading={query.trim() ? "Chats" : "Recent"}>
              {results.map(({ chat, snippet }) => (
                <CommandItem
                  key={chat.id}
                  value={chat.id}
                  onSelect={() => {
                    onSelect(chat.id)
                    onOpenChange(false)
                    closeSheet()
                  }}
                >
                  <HugeiconsIcon icon={BubbleChatIcon} aria-hidden />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{chat.title}</span>
                    {snippet ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {snippet.before}
                        <mark className="bg-transparent text-foreground">
                          {snippet.match}
                        </mark>
                        {snippet.after}
                      </span>
                    ) : null}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export { ChatSearch }
