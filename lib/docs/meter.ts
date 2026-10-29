import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Meter shows how much of something is used: a context window, monthly credits, storage. It is Base UI's meter, so it is a measurement rather than a progress bar, and screen readers read it as one. A label and a value sit over a thin track, and a `tone` turns the fill green or red when the amount means something.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add a meter with its label and value",
        body: [
          "`value` is out of `max`, 100 by default. The track is drawn for you; the label and the value are children, so you choose what shows.",
        ],
        code: {
          title: "components/credits.tsx",
          code: `import { Meter, MeterLabel, MeterValue } from "@/components/ui/meter"

export function Credits({ used }: { used: number }) {
  return (
    <Meter value={used}>
      <MeterLabel>Monthly credits</MeterLabel>
      <MeterValue />
    </Meter>
  )
}`,
        },
      },
      {
        title: "Format the value",
        body: [
          "`format` takes `Intl.NumberFormat` options. `MeterValue` takes a function for text of your own, and `getAriaValueText` says the same to a screen reader.",
        ],
        code: {
          code: `<Meter
  value={64_000}
  max={200_000}
  format={{ notation: "compact" }}
  getAriaValueText={(tokens) => \`\${tokens} of 200K tokens\`}
>
  <MeterLabel>Context window</MeterLabel>
  <MeterValue>{(tokens) => \`\${tokens} / 200K\`}</MeterValue>
</Meter>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="meter" data-tone="default" role="meter">
  <span data-slot="meter-label" />
  <span data-slot="meter-value" /> {/* pushed to the end */}
  <div data-slot="meter-track"> {/* added for you, under them */}
    <div data-slot="meter-indicator" />
  </div>
</div>`,
    body: [
      "The track is 4px tall on `muted`, and the fill is `foreground`, `destructive`, or emerald for `success`, since a shadcn theme has no success token. Only the fill changes with the tone, so the label stays readable. A change of value slides the fill over 280ms.",
    ],
  },
  examples: [
    {
      title: "A tone that follows the value",
      body: ["Turn the fill red once the window is nearly full."],
      sample: "meter/context-window",
    },
    {
      title: "Without a label",
      body: [
        "With no children, give the meter an `aria-label` so it still has a name.",
      ],
      code: {
        code: `<Meter value={40} aria-label="Storage used" className="w-24" />`,
      },
    },
  ],
  api: [
    {
      title: "Meter",
      body: ["Base UI's `Meter.Root`, with the track inside it."],
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`value`", "`number`", "required", "How much is used."],
        ["`min` / `max`", "`number`", "`0` / `100`", "The range."],
        [
          "`tone`",
          '`"default" | "success" | "destructive"`',
          '`"default"`',
          "Recolours the fill only.",
        ],
        [
          "`format`",
          "`Intl.NumberFormatOptions`",
          "",
          "How `MeterValue` and screen readers write the number.",
        ],
        [
          "`getAriaValueText`",
          "`(formatted: string, value: number) => string`",
          "",
          "What a screen reader says for the value.",
        ],
        ["`className`", "`string`", "", "Merged onto the root."],
      ],
    },
    {
      title: "Parts",
      head: ["Export", "Renders", "Notes"],
      rows: [
        ["`MeterLabel`", "`span`", "Its name, in `muted-foreground`."],
        [
          "`MeterValue`",
          "`span`",
          "The formatted value at the end. Takes a function of the formatted value for text of your own.",
        ],
        [
          "`MeterTrack` / `MeterIndicator`",
          "`div`",
          "The track and its fill. `Meter` adds them; export them to build a meter of your own from Base UI's root.",
        ],
      ],
    },
  ],
}

export default doc
