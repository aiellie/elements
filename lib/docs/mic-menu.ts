import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Mic Menu picks which microphone to listen with, from the inputs the browser lists. It updates when a headset is plugged in or taken out.",
    "Until a page has been allowed the microphone once, browsers hide the inputs' names. The menu numbers them instead and offers a row that asks for access, after which the real names appear.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Keep the choice",
        code: {
          title: "components/voice-controls.tsx",
          code: `"use client"

import * as React from "react"

import { MicMenu } from "@/components/aiellie/mic-menu"

export function VoiceControls() {
  const [device, setDevice] = React.useState("")
  return <MicMenu value={device} onValueChange={setDevice} />
}`,
        },
      },
      {
        title: "Listen on it",
        body: [
          "Ask for that input when you open the microphone. An empty value means the system default.",
        ],
        code: {
          title: "lib/listen.ts",
          code: `export function listen(deviceId: string) {
  return navigator.mediaDevices.getUserMedia({
    audio: deviceId ? { deviceId: { exact: deviceId } } : true,
  })
}`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="mic-menu" /> {/* tooltip icon button */}
<div data-slot="menu-content"> {/* in a portal */}
  <div data-slot="menu-radio-group">{/* a row per input */}</div>
  {/* "Allow access to see names", while they're hidden */}
</div>`,
    body: [
      "The button's tooltip names the chosen input. `useMicDevices` is exported too, for a picker of your own.",
    ],
  },
  examples: [
    {
      title: "Your own picker",
      body: [
        "`useMicDevices` gives the list, whether it has names yet, and a way to ask for them.",
      ],
      code: {
        title: "components/mic-select.tsx",
        code: `"use client"

import { useMicDevices } from "@/components/aiellie/mic-menu"

export function MicSelect() {
  const { devices, named, requestNames } = useMicDevices()
  return (
    <>
      <select>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      {named ? null : <button onClick={requestNames}>Show names</button>}
    </>
  )
}`,
      },
    },
  ],
  api: [
    {
      title: "MicMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`value`",
          "`string`",
          "required",
          'The chosen `deviceId`, or `""` for the system default.',
        ],
        ["`onValueChange`", "`(deviceId: string) => void`", "required", ""],
        [
          "`label`",
          "`string`",
          '`"Microphone"`',
          "Heads the menu and is read out on the button.",
        ],
        ["`side`, `align`", "", '`"top"`, `"start"`', "Where the menu opens."],
      ],
      after: ["All other `TooltipIconButton` props are forwarded."],
    },
    {
      title: "useMicDevices",
      head: ["Field", "Type", "Default", "Description"],
      rows: [
        [
          "`devices`",
          "`{ deviceId: string; label: string }[]`",
          "",
          "The inputs.",
        ],
        [
          "`named`",
          "`boolean`",
          "",
          "Whether the browser has shown their names.",
        ],
        [
          "`requestNames`",
          "`() => Promise<void>`",
          "",
          "Opens the microphone for a moment so the names appear.",
        ],
      ],
    },
  ],
}

export default doc
