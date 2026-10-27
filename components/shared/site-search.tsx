"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { CATEGORIES, HIDDEN_ITEMS, type Category } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import { ITEM_ICONS } from "@/lib/item-icons"
import registry from "@/registry.json"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/aiellie/ui/command"

type Entry = {
  href: string
  title: string
  description: string
  icon?: IconSvgElement
  /** What the entry is filed under, matched like the title. */
  tag: string
}

const PAGE_ENTRIES: Entry[] = (["/", "/components"] as const).map((href) => ({
  href,
  title: PAGES[href].title,
  description: PAGES[href].description,
  icon: PAGES[href].icon,
  tag: PAGES[href].label,
}))

const TEMPLATE_ENTRIES: Entry[] = registry.items
  .filter((item) => item.type === "registry:block")
  .map((item) => ({
    href: "/",
    title: item.title,
    description: item.description,
    icon: ITEM_ICONS[item.name],
    tag: "Template",
  }))

const SECTIONS = Object.entries(CATEGORIES)
  .map(([id, category]) => ({
    title: category.name,
    entries: registry.items
      .filter(
        (item) =>
          item.type === "registry:component" &&
          "categories" in item &&
          !HIDDEN_ITEMS.has(item.name) &&
          item.categories?.[0] === (id as Category)
      )
      .sort((a, b) => a.title.localeCompare(b.title))
      .map<Entry>((item) => ({
        href: `/components/${item.name}`,
        title: item.title,
        description: item.description,
        icon: ITEM_ICONS[item.name],
        tag: category.name,
      })),
  }))
  .filter((section) => section.entries.length)

const GROUPS = [
  { title: "Templates", entries: TEMPLATE_ENTRIES },
  ...SECTIONS,
  { title: "Pages", entries: PAGE_ENTRIES },
]

// cmdk's own filter is fuzzy, which across long descriptions matches almost
// anything. Words are matched whole-prefix instead, and a hit in the title
// outranks one in the category, which outranks one in the description.
function filter(_value: string, search: string, keywords: string[] = []) {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return 1
  const [title = "", tag = "", description = ""] = keywords.map((keyword) =>
    keyword.toLowerCase()
  )
  const has = (text: string, word: string) =>
    text.startsWith(word) ||
    text.includes(` ${word}`) ||
    text.includes(`-${word}`)
  let score = 0
  for (const word of words) {
    if (has(title, word)) score += 3
    else if (has(tag, word)) score += 2
    else if (has(description, word)) score += 1
    else return 0
  }
  return score / (words.length * 3)
}

function subscribeNothing() {
  return () => {}
}

function useIsMac() {
  return React.useSyncExternalStore(
    subscribeNothing,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true
  )
}

export function SiteSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const isMac = useIsMac()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        aria-label="Search"
        aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
        onClick={() => setOpen(true)}
      >
        <HugeiconsIcon aria-hidden icon={Search01Icon} />
        <span className="max-sm:hidden">Search</span>
        <kbd
          data-slot="kbd"
          className="rounded-sm bg-muted px-1 font-sans text-xs text-muted-foreground max-sm:hidden"
        >
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Find a component, template or page"
        className="sm:max-w-lg"
      >
        <Command filter={filter}>
          <CommandInput placeholder="Search components…" />
          <CommandList className="max-h-[min(24rem,60dvh)]">
            <CommandEmpty>Nothing matches that.</CommandEmpty>
            {GROUPS.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.entries.map((entry) => (
                  <CommandItem
                    key={`${entry.href}:${entry.title}`}
                    value={`${entry.href}:${entry.title}`}
                    keywords={[entry.title, entry.tag, entry.description]}
                    onSelect={() => go(entry.href)}
                    className="items-start"
                  >
                    {entry.icon && (
                      <HugeiconsIcon
                        aria-hidden
                        icon={entry.icon}
                        className="mt-0.5"
                      />
                    )}
                    <span className="flex min-w-0 flex-col">
                      <span className="text-foreground">{entry.title}</span>
                      <span className="truncate text-xs">
                        {entry.description}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
