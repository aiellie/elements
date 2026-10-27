import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Status is a small pill that says what state something is in: live, done, failed, under construction. A dot leads the word, pulsing while the thing is still going, and the pill takes a tint of the state's color. The word is always there, so the state never rests on color alone.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add a status",
        body: ["Compose it from its dot and its label."],
        code: {
          title: "components/deploy-status.tsx",
          code: `import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/aiellie/status"

export function DeployStatus({ running }: { running: boolean }) {
  return (
    <Status variant={running ? "live" : "success"} pulse={running}>
      <StatusIndicator />
      <StatusLabel>{running ? "Deploying" : "Deployed"}</StatusLabel>
    </Status>
  )
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<span data-slot="status" data-variant="live" data-pulse="true"> {/* render, a span by default */}
  <span data-slot="status-indicator"> {/* a 6px dot, with a ring and a ping while pulsing */}
  <span data-slot="status-label" />
</span>`,
    body: [
      "The pill is 12px text in the state's color on a 4% tint of it, with a hairline border. `live` uses the theme's `live` token; `success` and `construction` use emerald and yellow, since a shadcn theme has neither. The ping stops with reduced motion, and the dot stays.",
      "Use `pulse` for something still running, and leave it off once it has finished. `statusVariants` is exported for a pill of your own that should look the same.",
    ],
  },
  examples: [
    {
      title: "A task's state",
      body: ["Pulsing while it runs, still once it has an outcome."],
      sample: "status/running",
    },
    {
      title: "As a link",
      body: [
        "`render` makes the pill another element, like a link to the status page.",
      ],
      code: {
        code: `<Status variant="destructive" render={<a href="https://status.example.com" />}>
  <StatusIndicator />
  <StatusLabel>Degraded</StatusLabel>
</Status>`,
      },
    },
  ],
  api: [
    {
      title: "Status",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`variant`",
          '`"live" | "success" | "destructive" | "construction"`',
          '`"live"`',
          "The state, and its color.",
        ],
        [
          "`pulse`",
          "`boolean`",
          "`false`",
          "Pings the dot, for something still going.",
        ],
        [
          "`render`",
          "`ReactElement`",
          "`<span />`",
          "The element it renders as.",
        ],
        ["`className`", "`string`", "", "Merged onto the pill."],
      ],
    },
    {
      title: "Parts",
      head: ["Export", "Renders", "Notes"],
      rows: [
        ["`StatusIndicator`", "`span`", "The dot, in the state's color."],
        [
          "`StatusLabel`",
          "`span`",
          "The word, truncated when there's no room.",
        ],
        ["`statusVariants`", "`cva`", "The pill's classes by variant."],
      ],
    },
  ],
}

export default doc
