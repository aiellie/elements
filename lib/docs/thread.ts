import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Thread is the scrolling column a conversation lives in. It opens at the latest turn, settles each new question near the top with a slice of the last reply above it, follows a reply while it streams as long as the reader is at the end, and leaves them be once they scroll away, with a button to jump back. It's built on the message scroller from `@shadcn/react`.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Wrap the messages",
        body: [
          "`ThreadProvider` holds the scroll state, so anything that scrolls the thread, like the scroll button or a transcript, goes inside it. Give each item a `messageId`, and make the user's turns scroll anchors.",
        ],
        code: {
          title: "components/conversation.tsx",
          code: `"use client"

import {
  Message,
  MessageContent,
  MessagePart,
} from "@/components/aiellie/message"
import {
  Thread,
  ThreadContent,
  ThreadItem,
  ThreadProvider,
  ThreadScrollButton,
  ThreadViewport,
} from "@/components/aiellie/thread"

type Turn = { id: string; from: "user" | "assistant"; text: string }

export function Conversation({ turns }: { turns: Turn[] }) {
  return (
    <ThreadProvider autoScroll defaultScrollPosition="last-anchor">
      <Thread>
        <ThreadViewport aria-label="Conversation">
          <ThreadContent>
            {turns.map((turn) => (
              <ThreadItem
                key={turn.id}
                messageId={turn.id}
                scrollAnchor={turn.from === "user"}
              >
                <Message
                  align={turn.from === "user" ? "end" : "start"}
                  variant={turn.from === "user" ? "secondary" : "ghost"}
                >
                  <MessageContent>
                    <MessagePart>{turn.text}</MessagePart>
                  </MessageContent>
                </Message>
              </ThreadItem>
            ))}
          </ThreadContent>
        </ThreadViewport>
        <ThreadScrollButton />
      </Thread>
    </ThreadProvider>
  )
}`,
        },
      },
      {
        title: "Give it a height",
        body: [
          "`Thread` grows to fill a flex column and scrolls inside it, so its parent needs a height, like the space between a header and the composer.",
        ],
        code: {
          title: "app/chat/page.tsx",
          code: `<main className="flex h-svh flex-col">
  <header />
  <Conversation turns={turns} />
  <ChatInput />
</main>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<ThreadProvider> {/* scroll state, no element */}
  <div data-slot="thread">
    <div data-slot="thread-viewport" role="log"> {/* scrolls */}
      <div data-slot="thread-content"> {/* centred, 42rem wide */}
        <div data-slot="thread-item" /> {/* one per turn */}
      </div>
    </div>
    <button data-slot="thread-scroll-button" data-direction="end" data-active />
  </div>
</ThreadProvider>`,
    body: [
      "The viewport fades its bottom edge and hides its scrollbar while it scrolls itself. Items skip rendering while they're off screen, through `content-visibility`, so a long thread stays quick. The scroll button floats over the thread as a glass layer and fades out while it has nowhere to go.",
      "With reduced motion the button and `useThread` jump rather than glide, which the CSS rule can't do on its own because the scroll runs from JavaScript.",
    ],
  },
  examples: [
    {
      title: "Load earlier turns",
      body: [
        "Turns added above keep the reader where they were, so history can load in from the top without the page jumping.",
      ],
      sample: "thread/load-earlier",
    },
    {
      title: "Scroll from your own code",
      body: [
        "`useThread` scrolls to the start, the end or a message by its `messageId`, from anywhere inside the provider. `useThreadScrollable` says whether there's more to scroll either way, and `useThreadVisibility` which messages are on screen.",
      ],
      code: {
        code: `import { useThread, useThreadScrollable } from "@/components/aiellie/thread"

function JumpToEdit({ id }: { id: string }) {
  const { scrollToMessage } = useThread()
  const { start } = useThreadScrollable()

  return start ? (
    <button onClick={() => scrollToMessage(id, { align: "center" })}>
      Back to the edit
    </button>
  ) : null
}`,
      },
    },
    {
      title: "A button to the start",
      body: [
        '`direction="start"` puts a scroll button at the top that jumps to the first turn, its arrow turned up.',
      ],
      code: {
        code: `<ThreadScrollButton direction="start" />`,
      },
    },
  ],
  api: [
    {
      title: "ThreadProvider",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`autoScroll`",
          "`boolean`",
          "`false`",
          "Follows new content while the reader is at the end.",
        ],
        [
          "`defaultScrollPosition`",
          '`"start" | "end" | "last-anchor"`',
          '`"end"`',
          "Where it opens. `last-anchor` opens at the last scroll anchor, the latest question.",
        ],
        [
          "`scrollEdgeThreshold`",
          "`number`",
          "`8`",
          "How close to an edge, in pixels, counts as at it.",
        ],
        [
          "`scrollPreviousItemPeek`",
          "`number`",
          "`64`",
          "How much of the turn before an anchor stays in view above it, in pixels.",
        ],
        [
          "`scrollMargin`",
          "`number`",
          "`0`",
          "Space kept above an item it scrolls to, for a header over the thread.",
        ],
      ],
    },
    {
      title: "ThreadViewport",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`preserveScrollOnPrepend`",
          "`boolean`",
          "`true`",
          "Keeps the reader in place when turns are added above.",
        ],
        ["`aria-label`", "`string`", "", "Names the log for screen readers."],
        ["`className`", "`string`", "", "Merged onto the viewport."],
      ],
    },
    {
      title: "ThreadContent",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`spacerClassName`",
          "`string`",
          "",
          "Classes for the space after the last turn that lets an anchor reach the top.",
        ],
        [
          "`className`",
          "`string`",
          "",
          "Merged onto the column. It's 42rem wide with 24px between turns.",
        ],
      ],
    },
    {
      title: "ThreadItem",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`messageId`",
          "`string`",
          "",
          "Lets `scrollToMessage` and the visibility hook find it.",
        ],
        [
          "`scrollAnchor`",
          "`boolean`",
          "`false`",
          "Settles near the top when it's added, like a new question.",
        ],
        ["`className`", "`string`", "", "Merged onto the item."],
      ],
    },
    {
      title: "ThreadScrollButton",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`direction`",
          '`"start" | "end"`',
          '`"end"`',
          "Which way it jumps, and which edge it sits at.",
        ],
        [
          "`behavior`",
          "`ScrollBehavior`",
          "",
          "How it scrolls. Under reduced motion it's always `auto`.",
        ],
        [
          "`variant`",
          "`Button` variant",
          '`"outline"`',
          "The `Button` it renders as.",
        ],
        ["`size`", "`Button` size", '`"icon-sm"`', "The `Button`'s size."],
        [
          "`children`",
          "`ReactNode`",
          "an arrow",
          "Replaces the arrow and its label.",
        ],
        [
          "`render`",
          "`ReactElement | function`",
          "",
          "Swaps the `Button` for another element.",
        ],
      ],
      after: [
        "It's `data-active` while there's somewhere to go, and faded out and inert otherwise.",
      ],
    },
    {
      title: "useThread",
      head: ["Returns", "Type", "Description"],
      rows: [
        [
          "`scrollToEnd`",
          "`(options?) => boolean`",
          "Scrolls to the latest turn.",
        ],
        [
          "`scrollToStart`",
          "`(options?) => boolean`",
          "Scrolls to the first turn.",
        ],
        [
          "`scrollToMessage`",
          "`(id: string, options?) => boolean`",
          "Scrolls to an item by its `messageId`. Options take `align`, `behavior` and `scrollMargin`.",
        ],
      ],
      after: [
        "`useThreadScrollable` returns `{ start, end }`, whether there's more to scroll each way. `useThreadVisibility` returns `{ visibleMessageIds, currentAnchorId }`.",
      ],
    },
  ],
}

export default doc
