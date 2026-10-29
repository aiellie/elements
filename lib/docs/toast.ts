import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Toast says something happened without stopping anyone: a save, a copy, an export that finished or failed. It is Base UI's toast with this registry's glass on it. Toasts stack in the corner of the screen, or anchor to the button that caused them for a quick confirmation, and each one wears an icon for its type.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Add the provider and a toaster",
        body: [
          "Once, near the root of the app. A manager made outside React lets anything add a toast, not only components.",
        ],
        code: {
          title: "app/providers.tsx",
          code: `"use client"

import {
  ToastProvider,
  Toaster,
  createToastManager,
} from "@/components/ui/toast"

export const toasts = createToastManager()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider toastManager={toasts}>
      {children}
      <Toaster />
    </ToastProvider>
  )
}`,
        },
      },
      {
        title: "Add a toast",
        body: [
          "`type` picks the icon: `success`, `info`, `warning`, `error` or `loading`. `actionProps` adds a button, like Undo.",
        ],
        code: {
          code: `toasts.add({
  title: "Chat deleted",
  description: "It's gone from your history.",
  type: "success",
  actionProps: { children: "Undo", onClick: restore },
})`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="toast-viewport"> {/* Toaster: the bottom corner, stacking */}
  <div data-slot="toast" data-type="success"> {/* glass, a shadow */}
    <div data-slot="toast-content">
      <span data-slot="toast-icon" />
      <div data-slot="toast-title" />
      <div data-slot="toast-description" />
      <button data-slot="toast-action" /> {/* only with actionProps */}
    </div>
    <button data-slot="toast-close" />
  </div>
</div>

{/* AnchoredToaster: each toast beside its anchor */}
<div data-slot="toast-positioner">
  <div data-slot="toast"><span data-slot="toast-arrow" />…</div>
</div>`,
    body: [
      "Stacked toasts fan out behind the newest, open up on hover, and can be swiped away. They slide in from below and out the same way; a toast pushed out by the limit fades instead. An `error` toast's title is in `destructive`. A `loading` toast spins until its promise settles, then becomes the success or error toast in place.",
      'Anchored toasts are one line, a description and an icon, with an arrow toward the anchor. Both toasters take `variant="solid"` to drop the blur.',
    ],
  },
  examples: [
    {
      title: "Follow a promise",
      body: ["`promise` shows the loading toast and swaps it for the outcome."],
      sample: "toast/promise",
    },
    {
      title: "Anchored to its button",
      body: [
        "With an `AnchoredToaster`, pass `positionerProps` with the element to point at.",
      ],
      sample: "toast/anchored",
    },
  ],
  api: [
    {
      title: "Toaster and AnchoredToaster",
      body: [
        "Both take Base UI's `Toast.Viewport` props and render the toasts in a portal.",
      ],
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`variant`",
          '`"glass" | "solid"`',
          '`"glass"`',
          "With or without the blur behind each toast.",
        ],
        [
          "`showArrow`",
          "`boolean`",
          "`true`",
          "`AnchoredToaster` only: points the toast at its anchor.",
        ],
        ["`className`", "`string`", "", "Merged onto the viewport."],
      ],
    },
    {
      title: "toasts.add",
      body: [
        "The manager is Base UI's. These are the options this registry's toasts read.",
      ],
      head: ["Option", "Type", "Description"],
      rows: [
        ["`title` / `description`", "`ReactNode`", "What it says."],
        [
          "`type`",
          '`"success" | "info" | "warning" | "error" | "loading"`',
          "Its icon, and for `error` the title's color.",
        ],
        [
          "`timeout`",
          "`number`",
          "How long it stays, in ms. `0` keeps it until it is closed.",
        ],
        [
          "`priority`",
          '`"low" | "high"`',
          "`high` is announced at once to screen readers.",
        ],
        ["`actionProps`", "`ButtonProps`", "Adds a button, like Undo."],
        [
          "`positionerProps`",
          "`{ anchor, side, align }`",
          "Where an anchored toast points.",
        ],
      ],
    },
    {
      title: "Parts",
      head: ["Export", "Notes"],
      rows: [
        [
          "`ToastProvider`",
          "Holds the toasts. Pass `toastManager` to add them from outside React.",
        ],
        [
          "`createToastManager` / `useToastManager`",
          "Make a manager, or reach the provider's from a component.",
        ],
        [
          "`Toast`, `ToastContent`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`, `ToastIcon`",
          "The pieces the toasters are built from, for a toaster of your own.",
        ],
        [
          "`ToastPortal`, `ToastViewport`, `ToastPositioner`, `ToastArrow`",
          "Where toasts render, and how an anchored one is placed.",
        ],
      ],
    },
  ],
}

export default doc
