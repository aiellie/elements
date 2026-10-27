import { CATEGORIES, HIDDEN_ITEMS, type Category } from "@/lib/categories"
import registry from "@/registry.json"
import addMenu from "@/lib/docs/add-menu"
import attachments from "@/lib/docs/attachments"
import branchesMenu from "@/lib/docs/branches-menu"
import composer from "@/lib/docs/composer"
import dateDivider from "@/lib/docs/date-divider"
import dictateButton from "@/lib/docs/dictate-button"
import editableTitle from "@/lib/docs/editable-title"
import filePreview from "@/lib/docs/file-preview"
import helpMenu from "@/lib/docs/help-menu"
import historyButtons from "@/lib/docs/history-buttons"
import menu from "@/lib/docs/menu"
import message from "@/lib/docs/message"
import meter from "@/lib/docs/meter"
import modelSelector from "@/lib/docs/model-selector"
import navBars from "@/lib/docs/nav-bars"
import panels from "@/lib/docs/panels"
import pluginSelector from "@/lib/docs/plugin-selector"
import projectSelector from "@/lib/docs/project-selector"
import quickChat from "@/lib/docs/quick-chat"
import reasoning from "@/lib/docs/reasoning"
import settingsDialog from "@/lib/docs/settings-dialog"
import shareDialog from "@/lib/docs/share-dialog"
import sources from "@/lib/docs/sources"
import status from "@/lib/docs/status"
import streamText from "@/lib/docs/stream-text"
import suggestions from "@/lib/docs/suggestions"
import temporaryChatToggle from "@/lib/docs/temporary-chat-toggle"
import thinkingIndicator from "@/lib/docs/thinking-indicator"
import thread from "@/lib/docs/thread"
import threadTranscript from "@/lib/docs/thread-transcript"
import toast from "@/lib/docs/toast"
import toolbar from "@/lib/docs/toolbar"
import tooltipIconButton from "@/lib/docs/tooltip-icon-button"
import userMenu from "@/lib/docs/user-menu"
import waveform from "@/lib/docs/waveform"
import workInMenu from "@/lib/docs/work-in-menu"

/** A paragraph. `backticks` set code and [label](href) sets a link. */
type DocText = string

type DocCode = {
  code: string
  /** The file it goes in, shown above the code. */
  title?: string
  lang?: string
}

type DocStep = {
  title: string
  body?: DocText[]
  code?: DocCode
  after?: DocText[]
}

type DocExample = {
  title: string
  body?: DocText[]
  /** A live sample with its source, keyed `<item>/<name>` in `lib/docs/samples`. */
  sample?: string
  code?: DocCode
  after?: DocText[]
}

type DocTable = {
  title: string
  body?: DocText[]
  /** Like `["Prop", "Type", "Default", "Description"]`. */
  head: string[]
  rows: DocText[][]
  after?: DocText[]
}

type DocContent = {
  /** What it is and how it's used, under the installation. */
  intro: DocText[]
  gettingStarted: { body?: DocText[]; steps: DocStep[] }
  anatomy: { code: string; body?: DocText[] }
  examples: DocExample[]
  api: DocTable[]
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
  "add-menu": addMenu,
  attachments: attachments,
  "branches-menu": branchesMenu,
  composer: composer,
  "date-divider": dateDivider,
  "dictate-button": dictateButton,
  "editable-title": editableTitle,
  "file-preview": filePreview,
  "help-menu": helpMenu,
  "history-buttons": historyButtons,
  menu: menu,
  message: message,
  meter: meter,
  "model-selector": modelSelector,
  "nav-bars": navBars,
  panels: panels,
  "plugin-selector": pluginSelector,
  "project-selector": projectSelector,
  "quick-chat": quickChat,
  reasoning: reasoning,
  "settings-dialog": settingsDialog,
  "share-dialog": shareDialog,
  sources: sources,
  status: status,
  "stream-text": streamText,
  suggestions: suggestions,
  "temporary-chat-toggle": temporaryChatToggle,
  "thinking-indicator": thinkingIndicator,
  thread: thread,
  "thread-transcript": threadTranscript,
  toast: toast,
  toolbar: toolbar,
  "tooltip-icon-button": tooltipIconButton,
  "user-menu": userMenu,
  waveform: waveform,
  "work-in-menu": workInMenu,
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
        !HIDDEN_ITEMS.has(item.name) &&
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
export type {
  DocCode,
  DocContent,
  DocExample,
  DocsItem,
  DocsSection,
  DocStep,
  DocTable,
  DocText,
}
