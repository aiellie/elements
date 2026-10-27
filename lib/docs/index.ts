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
  /** Where it sits in the whole list, counting from 1 down every section. */
  index: number
}

type DocsSection = {
  /** The category the gallery files it under, like "Chat". */
  title: string
  items: DocsItem[]
}

// Written content, keyed by registry item. An item without an entry still has
// a page, with its preview and install command.
const DOCS: Record<string, DocContent> = {
  "stream-text": streamText,
}

// Every component with a card gets a page, in its gallery category, the
// categories in the order they run down the gallery.
const SECTIONS: DocsSection[] = []
let count = 0
for (const [id, category] of Object.entries(CATEGORIES)) {
  const items = registry.items
    .filter(
      (item) =>
        item.type === "registry:component" &&
        "categories" in item &&
        item.categories?.[0] === (id as Category)
    )
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((item) => ({
      name: item.name,
      title: item.title,
      description: item.description,
      index: ++count,
    }))
  if (items.length) SECTIONS.push({ title: category.name, items })
}

const ITEMS = SECTIONS.flatMap((section) => section.items)

function docsItem(name: string) {
  return ITEMS.find((item) => item.name === name) ?? null
}

function docsContent(name: string) {
  return DOCS[name] ?? null
}

function padIndex(index: number) {
  return String(index).padStart(2, "0")
}

export {
  docsContent,
  docsItem,
  ITEMS as DOCS_ITEMS,
  padIndex,
  SECTIONS as DOCS_SECTIONS,
}
export type { DocContent, DocPart, DocProp, DocSnippet, DocsItem, DocsSection }
