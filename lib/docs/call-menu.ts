import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Call Menu starts a call from a chat: a small round picture of who you'd call, opening a menu with a video call and a voice call.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Start the call",
        body: ["Each row calls its handler when picked."],
        code: {
          title: "components/chat-header.tsx",
          code: `import { CallMenu } from "@/components/aiellie/call-menu"

<CallMenu
  name="Ellie"
  src="/ellie.png"
  onVideoCall={() => startCall({ video: true })}
  onCall={() => startCall({ video: false })}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<button data-slot="call-menu" aria-label="Call Ellie">
  <span data-slot="avatar" />
</button>
<div data-slot="menu-content">
  <div data-slot="menu-item" /> {/* Video call */}
  <div data-slot="menu-item" /> {/* Call */}
</div>`,
    body: [
      "It's built on our `menu`, so it opens from the keyboard and closes on Escape. The trigger keeps its focus edge while the menu is open.",
    ],
  },
  examples: [
    {
      title: "More rows",
      body: ["Children go under the two calls."],
      sample: "call-menu/more-rows",
    },
  ],
  api: [
    {
      title: "CallMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`name`", "`string`", "required", "Who the call is with."],
        ["`src`", "`string`", "", "Their picture."],
        ["`onVideoCall`, `onCall`", "`() => void`", "", ""],
        ["`videoLabel`", "`string`", '`"Video call"`', ""],
        ["`callLabel`", "`string`", '`"Call"`', ""],
        ["`children`", "`ReactNode`", "", "More menu rows."],
        ["`className`", "`string`", "", "Merged onto the trigger."],
      ],
    },
  ],
}

export default doc
