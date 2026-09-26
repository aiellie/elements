import {
  DropboxIcon,
  FigmaIcon,
  Github01Icon,
  GoogleDriveIcon,
  Notion01Icon,
  SlackIcon,
} from "@hugeicons/core-free-icons"

import type { ChatAttachment } from "@/registry/aiellie/blocks/chat/components/chat-attachments"
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

// Sample times are set from when the page loads, so the chat is always today's.
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000)

// Where a shared chat can be read. Point it at your own share route.
const shareUrlOf = (id: string) => `https://example.com/share/${id}`

const svg = (markup: string) =>
  `data:image/svg+xml,${encodeURIComponent(markup)}`

const DASHBOARD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#fafafa"/><rect width="220" height="800" fill="#f4f4f5"/><rect x="24" y="28" width="120" height="14" rx="7" fill="#d4d4d8"/><g fill="#e4e4e7"><rect x="24" y="80" width="150" height="10" rx="5"/><rect x="24" y="112" width="120" height="10" rx="5"/><rect x="24" y="144" width="136" height="10" rx="5"/></g><rect x="260" y="30" width="200" height="18" rx="9" fill="#27272a"/><g fill="#fff" stroke="#e4e4e7" stroke-width="2"><rect x="260" y="80" width="283" height="120" rx="16"/><rect x="563" y="80" width="283" height="120" rx="16"/><rect x="866" y="80" width="294" height="120" rx="16"/><rect x="260" y="224" width="900" height="536" rx="16"/></g><g fill="#a1a1aa"><rect x="284" y="104" width="90" height="10" rx="5"/><rect x="587" y="104" width="70" height="10" rx="5"/><rect x="890" y="104" width="110" height="10" rx="5"/><rect x="284" y="250" width="80" height="12" rx="6"/></g><g fill="#18181b"><rect x="284" y="136" width="140" height="30" rx="8"/><rect x="587" y="136" width="110" height="30" rx="8"/><rect x="890" y="136" width="160" height="30" rx="8"/></g><path d="M300 660 400 610 500 630 600 540 700 560 800 470 900 500 1000 400 1110 430V720H300Z" fill="#6366f1" fill-opacity=".1"/><path d="M300 660 400 610 500 630 600 540 700 560 800 470 900 500 1000 400 1110 430" fill="none" stroke="#6366f1" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`

// The chart card runs past the right edge of the phone, as in the question.
const DASHBOARD_PHONE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844"><rect width="390" height="844" fill="#fafafa"/><rect x="24" y="60" width="130" height="16" rx="8" fill="#27272a"/><g fill="#fff" stroke="#e4e4e7" stroke-width="2"><rect x="16" y="104" width="358" height="100" rx="16"/><rect x="16" y="220" width="358" height="100" rx="16"/><rect x="16" y="336" width="560" height="300" rx="16"/></g><g fill="#a1a1aa"><rect x="36" y="126" width="80" height="10" rx="5"/><rect x="36" y="242" width="64" height="10" rx="5"/><rect x="36" y="358" width="70" height="10" rx="5"/></g><g fill="#18181b"><rect x="36" y="152" width="130" height="28" rx="8"/><rect x="36" y="268" width="100" height="28" rx="8"/></g><path d="M40 580 110 550 180 562 250 500 320 514 390 450 460 470 540 410V610H40Z" fill="#6366f1" fill-opacity=".1"/><path d="M40 580 110 550 180 562 250 500 320 514 390 450 460 470 540 410" fill="none" stroke="#6366f1" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="0" y="826" width="260" height="5" rx="2.5" fill="#a1a1aa"/></svg>`

const REVENUE_CHART = `import { Area, AreaChart, XAxis } from "recharts"

export function RevenueChart({
  data,
}: {
  data: { month: string; revenue: number }[]
}) {
  return (
    <div className="rounded-xl border p-4">
      <h2 className="text-sm font-medium">Revenue</h2>
      <AreaChart width={640} height={240} data={data}>
        <XAxis dataKey="month" />
        <Area dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
      </AreaChart>
    </div>
  )
}
`

// A one-page PDF, built here so the sample needs no file on disk.
function pdf(title: string, lines: string[]) {
  const escape = (text: string) => text.replace(/[()\\]/g, "\\$&")
  const text = [
    `BT /F1 20 Tf 64 720 Td (${escape(title)}) Tj ET`,
    ...lines.map(
      (line, i) => `BT /F1 12 Tf 64 ${680 - i * 22} Td (${escape(line)}) Tj ET`
    ),
  ].join("\n")
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ]
  let body = "%PDF-1.4\n"
  const offsets = objects.map((object, i) => {
    const offset = body.length
    body += `${i + 1} 0 obj\n${object}\nendobj\n`
    return offset
  })
  const table = offsets
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("")
  return `${body}xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${table}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${body.length}\n%%EOF\n`
}

const SPEC = pdf("Revenue card", [
  "The card shows monthly revenue as an area chart.",
  "The chart fills the card's width at every size, with no sideways scroll.",
  "Desktop: a third of the grid, 240px tall.",
  "Phone: full width with 16px padding, 180px tall.",
])

function sampleAttachment(
  id: string,
  kind: ChatAttachment["kind"],
  file: File,
  url?: string
): ChatAttachment {
  return { id, name: file.name, kind, size: file.size, url, files: [file] }
}

const specFile = new File([SPEC], "revenue-card-spec.pdf", {
  type: "application/pdf",
})

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "chart",
    title: "Revenue chart overflows on phones",
    status: "completed",
    messages: [
      {
        id: "chart-1",
        createdAt: minutesAgo(12),
        role: "user",
        content:
          "The revenue chart spills off the screen on phones. Here's the dashboard on desktop and on an iPhone, the spec for the card, and the component. What's causing it?",
        attachments: [
          sampleAttachment(
            "chart-desktop",
            "image",
            new File([DASHBOARD], "dashboard.svg", { type: "image/svg+xml" }),
            svg(DASHBOARD)
          ),
          sampleAttachment(
            "chart-phone",
            "image",
            new File([DASHBOARD_PHONE], "dashboard-phone.svg", {
              type: "image/svg+xml",
            }),
            svg(DASHBOARD_PHONE)
          ),
          sampleAttachment(
            "chart-spec",
            "file",
            specFile,
            // Made in the browser only. Nothing the server renders reads it:
            // only the preview dialog, which opens in the browser.
            typeof window === "undefined"
              ? undefined
              : URL.createObjectURL(specFile)
          ),
          sampleAttachment(
            "chart-component",
            "file",
            new File([REVENUE_CHART], "revenue-chart.tsx", {
              type: "text/plain",
            })
          ),
        ],
      },
      {
        id: "chart-2",
        createdAt: minutesAgo(11),
        role: "assistant",
        content:
          "It's the fixed `width={640}` on `AreaChart` in `revenue-chart.tsx`. On the iPhone the card is about 358px wide, so the chart runs well past it and drags the page into scrolling sideways, which the spec rules out.\n\nWrap the chart in `ResponsiveContainer` with `width=\"100%\"`, and set its height from the spec: 240px on desktop and 180px on phones. If the card sits in a grid or a flex row, give it `min-w-0` as well, or it still won't shrink below the chart.",
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
