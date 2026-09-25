import {
  DropboxIcon,
  FigmaIcon,
  Github01Icon,
  GoogleDriveIcon,
  Notion01Icon,
  SlackIcon,
} from "@hugeicons/core-free-icons"

import type { ChatMessage } from "@/registry/aiellie/blocks/chat/components/chat-messages"
import type { PluginOption } from "@/registry/aiellie/components/plugin-selector"
import type { ProjectOption } from "@/registry/aiellie/components/project-selector"
import type { User } from "@/registry/aiellie/components/user-menu"

// Everything the preview shows is sample data, kept here so it can be swapped
// for your own in one place.

type ConversationStatus = "running" | "completed" | "failed"

type Conversation = {
  id: string
  title: string
  pinned?: boolean
  /** Kept out of the sidebar, but not deleted. */
  archived?: boolean
  /** Kept out of the sidebar, and gone once the page is left. */
  temporary?: boolean
  /** Where its latest run stands. */
  status?: ConversationStatus
  /** Finished while it wasn't open, and not opened since. */
  unread?: boolean
  messages: ChatMessage[]
}

const SAMPLE_USER: User = { name: "AI Ellie", plan: "Pro" }

const SAMPLE_USAGE = "72% left"

// Sample times are set from when the page loads, so the preview always has a
// chat from today, one from yesterday and older ones.
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000)

const daysAgo = (days: number, hours: number, minutes: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hours, minutes, 0, 0)
  return date
}

// Where a shared chat can be read. Point it at your own share route.
const shareUrlOf = (id: string) => `https://example.com/share/${id}`

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "middleware",
    title: "Move the session check into the auth middleware",
    status: "running",
    messages: [
      {
        id: "middleware-1",
        createdAt: minutesAgo(3),
        role: "user",
        content:
          "Move the session check out of each route and into the middleware, and keep the tests passing.",
      },
      {
        id: "middleware-2",
        createdAt: minutesAgo(3),
        role: "assistant",
        content:
          "Reading the middleware and the six routes that check the session themselves. Four of them do it the same way, so those can go first",
        status: "streaming",
      },
    ],
  },
  {
    id: "tokens",
    title: "Custom colors in Tailwind v4",
    pinned: true,
    status: "completed",
    messages: [
      {
        id: "tokens-1",
        createdAt: daysAgo(1, 17, 16),
        role: "user",
        content: "How do I add a custom color in Tailwind v4?",
      },
      {
        id: "tokens-2",
        createdAt: daysAgo(1, 17, 16),
        role: "assistant",
        content:
          "In v4 the theme lives in your CSS rather than in a config file. Add the color under @theme:\n\n@theme {\n  --color-brand: oklch(0.62 0.21 260);\n}\n\nThat gives you bg-brand, text-brand, border-brand and the rest, and opacity modifiers like bg-brand/10 work with nothing else to set up.",
      },
    ],
  },
  {
    id: "bundle",
    title: "Audit the bundle size",
    status: "completed",
    unread: true,
    messages: [
      {
        id: "bundle-1",
        createdAt: daysAgo(4, 10, 2),
        role: "user",
        content: "Find what's making the dashboard bundle so big.",
      },
      {
        id: "bundle-2",
        createdAt: daysAgo(4, 10, 3),
        role: "assistant",
        content:
          "Most of it is the charting library, pulled in whole by one import on the settings page. Importing the two charts it uses on their own brings the bundle from 412 KB down to 268 KB.\n\nThe date library is next, at 38 KB, and the browser's own Intl.DateTimeFormat covers everything it's used for.",
      },
    ],
  },
  {
    id: "debounce",
    title: "Debouncing a search field",
    messages: [
      {
        id: "debounce-1",
        createdAt: daysAgo(19, 17, 16),
        role: "user",
        content: "What's a simple way to debounce a search field in React?",
      },
      {
        id: "debounce-2",
        createdAt: daysAgo(19, 17, 16),
        role: "assistant",
        content:
          "Keep what's typed in state, and copy it to a second value only once typing pauses. An effect that sets a timeout on every change, and clears the one before it, does that in a few lines.\n\nThen search on the second value. The field stays responsive, and the search only runs when someone stops typing.",
      },
      {
        id: "debounce-3",
        createdAt: daysAgo(2, 9, 30),
        role: "user",
        content: "How long should the pause be?",
      },
      {
        id: "debounce-4",
        createdAt: daysAgo(2, 9, 31),
        role: "assistant",
        content:
          "Somewhere around 200 to 300 milliseconds. Any shorter and it fires mid-word; much longer and the results feel like they're lagging behind.",
      },
    ],
  },
  {
    id: "names",
    title: "Names for a design system",
    messages: [
      {
        id: "names-1",
        createdAt: daysAgo(400, 14, 45),
        role: "user",
        content: "Give me three names for a quiet, monochrome design system.",
      },
      {
        id: "names-2",
        createdAt: daysAgo(400, 14, 46),
        role: "assistant",
        content:
          "Graphite, for the pencil gray it lives in.\n\nHairline, after the borders that do most of its work.\n\nStill, because nothing in it moves unless you ask it to.",
      },
    ],
  },
  {
    id: "notes",
    title: "Summarize the release notes",
    status: "failed",
    messages: [
      {
        id: "notes-1",
        createdAt: minutesAgo(48),
        role: "user",
        content: "Summarize these release notes in three bullet points.",
      },
      {
        id: "notes-2",
        role: "assistant",
        content: "",
        status: "failed",
        createdAt: minutesAgo(48),
      },
    ],
  },
]

// The preview only shows which projects and plugins are connected; nothing
// reads a project or calls a plugin.
const SAMPLE_PROJECTS: ProjectOption[] = [
  { id: "website", name: "Website redesign" },
  { id: "planning", name: "Q3 planning" },
  { id: "onboarding", name: "Onboarding docs" },
]

const SAMPLE_BRANCHES = [
  "main",
  "feat/composer-tray",
  "fix/attachment-preview",
  "chore/update-deps",
]

const SAMPLE_PLUGINS: PluginOption[] = [
  { id: "github", name: "GitHub", icon: Github01Icon },
  { id: "drive", name: "Google Drive", icon: GoogleDriveIcon },
  { id: "slack", name: "Slack", icon: SlackIcon },
  { id: "notion", name: "Notion", icon: Notion01Icon },
  { id: "figma", name: "Figma", icon: FigmaIcon },
  { id: "dropbox", name: "Dropbox", icon: DropboxIcon },
]

// There is no model behind the preview. Replace `stream` in the chat
// component with your model's response and the rest of the page works as it
// is.
const PREVIEW_REPLY =
  "This is a preview, so there's no model behind it. In your app, this is where the reply streams in, word by word, while the send button turns into stop.\n\nSwap the fake stream in the chat component for your model's response, and the rest of the page works as it is."

export {
  PREVIEW_REPLY,
  SAMPLE_BRANCHES,
  SAMPLE_CONVERSATIONS,
  SAMPLE_PLUGINS,
  SAMPLE_PROJECTS,
  SAMPLE_USAGE,
  SAMPLE_USER,
  shareUrlOf,
}
export type { Conversation, ConversationStatus }
