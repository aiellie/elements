import { CATEGORIES, type Category } from "@/lib/categories"
import registry from "@/registry.json"
import { streamText } from "@/lib/docs/stream-text"

type DocProp = {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

type DocPart = {
  /** The export, like `StreamText`. */
  name: string
  description?: string
  props: DocProp[]
}

type DocSnippet = {
  /** A sentence or two above the code. */
  description?: string
  code: string
}

type DocContent = {
  usage: DocSnippet
  composition?: DocSnippet
  api: DocPart[]
  /** Short points worth knowing, like what it needs from the theme. */
  notes?: string[]
}

type DocsItem = {
  name: string
  title: string
  description: string
  type: (typeof registry.items)[number]["type"]
  /** The name of the gallery section its card sits in, like "Chat". */
  category: string
}

type DocsSection = {
  title: string
  items: DocsItem[]
}

// Written content, keyed by registry item. An item without an entry still has
// a page, with its preview and install command.
const DOCS: Record<string, DocContent> = {
  "stream-text": streamText,
}

const SECTIONS = [
  { type: "registry:block", title: "Blocks" },
  { type: "registry:component", title: "Components" },
  { type: "registry:ui", title: "UI" },
] as const

// Everything with a card gets a page: supporting items, like the theme or the
// icon sets, have nothing to preview.
const ITEMS: DocsItem[] = registry.items.flatMap((item) =>
  "categories" in item && item.categories?.length
    ? [
        {
          name: item.name,
          title: item.title,
          description: item.description,
          type: item.type,
          category: CATEGORIES[item.categories[0] as Category].name,
        },
      ]
    : []
)

function docsSections(): DocsSection[] {
  return SECTIONS.map(({ type, title }) => ({
    title,
    items: ITEMS.filter((item) => item.type === type).sort((a, b) =>
      a.title.localeCompare(b.title)
    ),
  }))
}

function docsSectionOf(item: DocsItem) {
  return SECTIONS.find((section) => section.type === item.type)?.title
}

function docsItem(name: string) {
  return ITEMS.find((item) => item.name === name) ?? null
}

function docsContent(name: string) {
  return DOCS[name] ?? null
}

export {
  docsContent,
  docsItem,
  docsSectionOf,
  docsSections,
  ITEMS as DOCS_ITEMS,
}
export type { DocContent, DocPart, DocProp, DocSnippet, DocsItem, DocsSection }
