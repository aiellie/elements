import { CATEGORIES, HIDDEN_ITEMS, type Category } from "@/lib/categories"
import registry from "@/registry.json"
import addMenu from "@/lib/docs/add-menu"
import agentCursor from "@/lib/docs/agent-cursor"
import approvalModeMenu from "@/lib/docs/approval-mode-menu"
import attachments from "@/lib/docs/attachments"
import attemptPicker from "@/lib/docs/attempt-picker"
import audioPlayer from "@/lib/docs/audio-player"
import branchesMenu from "@/lib/docs/branches-menu"
import codeBlock from "@/lib/docs/code-block"
import codeDiff from "@/lib/docs/code-diff"
import codeSnippet from "@/lib/docs/code-snippet"
import codeWorkspace from "@/lib/docs/code-workspace"
import compactionMarker from "@/lib/docs/compaction-marker"
import composer from "@/lib/docs/composer"
import dateDivider from "@/lib/docs/date-divider"
import dictateButton from "@/lib/docs/dictate-button"
import editableTitle from "@/lib/docs/editable-title"
import effortMenu from "@/lib/docs/effort-menu"
import filePreview from "@/lib/docs/file-preview"
import fileTree from "@/lib/docs/file-tree"
import helpMenu from "@/lib/docs/help-menu"
import historyButtons from "@/lib/docs/history-buttons"
import humanHandoff from "@/lib/docs/human-handoff"
import inlineCitation from "@/lib/docs/inline-citation"
import mentions from "@/lib/docs/mentions"
import menu from "@/lib/docs/menu"
import message from "@/lib/docs/message"
import messageActions from "@/lib/docs/message-actions"
import messageContextMenu from "@/lib/docs/message-context-menu"
import messageHighlightToolbar from "@/lib/docs/message-highlight-toolbar"
import messageStatus from "@/lib/docs/message-status"
import meter from "@/lib/docs/meter"
import micMenu from "@/lib/docs/mic-menu"
import modelSelector from "@/lib/docs/model-selector"
import navBars from "@/lib/docs/nav-bars"
import needsYou from "@/lib/docs/needs-you"
import agentSteps from "@/lib/docs/agent-steps"
import agentCard from "@/lib/docs/agent-card"
import typingIndicator from "@/lib/docs/typing-indicator"
import artifact from "@/lib/docs/artifact"
import stackTrace from "@/lib/docs/stack-trace"
import commit from "@/lib/docs/commit"
import contextBreakdown from "@/lib/docs/context-breakdown"
import retrievedSources from "@/lib/docs/retrieved-sources"
import contactButton from "@/lib/docs/contact-button"
import callMenu from "@/lib/docs/call-menu"
import orb from "@/lib/docs/orb"
import panels from "@/lib/docs/panels"
import planReview from "@/lib/docs/plan-review"
import pluginSelector from "@/lib/docs/plugin-selector"
import projectSelector from "@/lib/docs/project-selector"
import promptAutocomplete from "@/lib/docs/prompt-autocomplete"
import promptMenu from "@/lib/docs/prompt-menu"
import quickChat from "@/lib/docs/quick-chat"
import quotedMessage from "@/lib/docs/quoted-message"
import reactions from "@/lib/docs/reactions"
import reasoning from "@/lib/docs/reasoning"
import response from "@/lib/docs/response"
import runBudget from "@/lib/docs/run-budget"
import sandbox from "@/lib/docs/sandbox"
import settingsDialog from "@/lib/docs/settings-dialog"
import shareDialog from "@/lib/docs/share-dialog"
import slashMenu from "@/lib/docs/slash-menu"
import sources from "@/lib/docs/sources"
import status from "@/lib/docs/status"
import streamText from "@/lib/docs/stream-text"
import suggestions from "@/lib/docs/suggestions"
import temporaryChatToggle from "@/lib/docs/temporary-chat-toggle"
import terminal from "@/lib/docs/terminal"
import thinkingIndicator from "@/lib/docs/thinking-indicator"
import thread from "@/lib/docs/thread"
import threadTranscript from "@/lib/docs/thread-transcript"
import timestamps from "@/lib/docs/timestamps"
import toast from "@/lib/docs/toast"
import toolCall from "@/lib/docs/tool-call"
import toolbar from "@/lib/docs/toolbar"
import tooltipIconButton from "@/lib/docs/tooltip-icon-button"
import transcript from "@/lib/docs/transcript"
import userMenu from "@/lib/docs/user-menu"
import waveform from "@/lib/docs/waveform"
import webPreview from "@/lib/docs/web-preview"
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
  "agent-cursor": agentCursor,
  "approval-mode-menu": approvalModeMenu,
  attachments: attachments,
  "attempt-picker": attemptPicker,
  "audio-player": audioPlayer,
  "branches-menu": branchesMenu,
  "code-block": codeBlock,
  "code-diff": codeDiff,
  "code-snippet": codeSnippet,
  "code-workspace": codeWorkspace,
  "compaction-marker": compactionMarker,
  composer: composer,
  "date-divider": dateDivider,
  "dictate-button": dictateButton,
  "editable-title": editableTitle,
  "effort-menu": effortMenu,
  "file-preview": filePreview,
  "file-tree": fileTree,
  "help-menu": helpMenu,
  "history-buttons": historyButtons,
  "human-handoff": humanHandoff,
  "inline-citation": inlineCitation,
  mentions: mentions,
  menu: menu,
  message: message,
  "message-actions": messageActions,
  "message-context-menu": messageContextMenu,
  "message-highlight-toolbar": messageHighlightToolbar,
  "message-status": messageStatus,
  meter: meter,
  "mic-menu": micMenu,
  "model-selector": modelSelector,
  "nav-bars": navBars,
  "needs-you": needsYou,
  "agent-steps": agentSteps,
  "agent-card": agentCard,
  "typing-indicator": typingIndicator,
  artifact: artifact,
  "stack-trace": stackTrace,
  commit: commit,
  "context-breakdown": contextBreakdown,
  "retrieved-sources": retrievedSources,
  "contact-button": contactButton,
  "call-menu": callMenu,
  orb: orb,
  panels: panels,
  "plan-review": planReview,
  "plugin-selector": pluginSelector,
  "project-selector": projectSelector,
  "prompt-autocomplete": promptAutocomplete,
  "prompt-menu": promptMenu,
  "quick-chat": quickChat,
  "quoted-message": quotedMessage,
  reactions: reactions,
  reasoning: reasoning,
  response: response,
  "run-budget": runBudget,
  sandbox: sandbox,
  "settings-dialog": settingsDialog,
  "share-dialog": shareDialog,
  "slash-menu": slashMenu,
  sources: sources,
  status: status,
  "stream-text": streamText,
  suggestions: suggestions,
  "temporary-chat-toggle": temporaryChatToggle,
  terminal: terminal,
  "thinking-indicator": thinkingIndicator,
  thread: thread,
  "thread-transcript": threadTranscript,
  timestamps: timestamps,
  toast: toast,
  "tool-call": toolCall,
  toolbar: toolbar,
  "tooltip-icon-button": tooltipIconButton,
  transcript: transcript,
  "user-menu": userMenu,
  waveform: waveform,
  "web-preview": webPreview,
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
