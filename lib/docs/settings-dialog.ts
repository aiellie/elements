import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Settings dialog is an app's settings in one window: a rail of sections on the left, the chosen section on the right, and a single Save for all of it. It covers the person's name and email, the theme, keys for the model providers they bring, and API keys they make. Nothing is saved until Save, so Cancel throws every change away.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Open it with the current settings",
        body: [
          "It is controlled by `open`. Everything else is what it starts from each time it opens.",
        ],
        code: {
          title: "components/settings-button.tsx",
          code: `"use client"

import * as React from "react"

import { SettingsDialog } from "@/components/aiellie/settings-dialog"
import { Button } from "@/components/ui/button"

export function SettingsButton({ user }: { user: { name: string; email: string } }) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Settings
      </Button>
      <SettingsDialog
        open={open}
        onOpenChange={setOpen}
        user={user}
        theme="system"
        onSave={(values) => saveSettings(values)}
      />
    </>
  )
}`,
        },
      },
      {
        title: "Let people bring their own keys",
        body: [
          "Pass `providers` to add the Providers section. `PROVIDERS` from `@/lib/models` lists the gateway, OpenAI, Anthropic and Google, the ones the chat block's route reads. A provider without a key is left out of `providerKeys`.",
        ],
        code: {
          code: `import { PROVIDERS } from "@/lib/models"

<SettingsDialog
  providers={PROVIDERS}
  providerKeys={keys}
  onSave={(values) => setKeys(values.providerKeys)}
  {...props}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="dialog-content"> {/* 768px wide at most, 480px tall */}
  <form>
    <div data-slot="sidebar-wrapper">
      <div data-slot="sidebar"> {/* General, Appearance, Providers, API keys; hidden below md */}
        <button data-slot="sidebar-menu-button" data-active />
      </div>
      <div>
        <nav data-slot="breadcrumb" /> {/* Settings › Section; below md, a menu of sections */}
        <section /> {/* the chosen section; only this scrolls */}
        <footer>
          <button /> {/* Cancel */}
          <button type="submit" /> {/* Save changes */}
        </footer>
      </div>
    </div>
  </form>
</div>`,
    body: [
      "The rail is a sidebar rather than tabs, a 30px row per section with the current one filled, and the breadcrumb names the section again over the pane. The header and footer stay put and only the section scrolls. Below `md` the rail is hidden and the breadcrumb becomes a menu of the sections, so a phone still reaches all of them.",
      "Provider keys are hidden in their fields, with a button to show one. A new API key is shown whole once, right after it is made, with a copy button; after that only its first three and last four characters are. The Providers section is left out without `providers`.",
    ],
  },
  examples: [
    {
      title: "Open on a section",
      body: [
        "`defaultSection` picks the section it opens on, here Providers for a button that asks for a key.",
      ],
      sample: "settings-dialog/providers",
    },
    {
      title: "API keys",
      body: [
        "Pass the keys someone has made. Ones they make or revoke come back in `onSave`.",
      ],
      code: {
        code: `<SettingsDialog
  apiKeys={[
    { id: "key_1", name: "Production", secret: "sk-live-7f2a9c1e4b80", createdAt: "2026-03-12" },
  ]}
  defaultSection="api-keys"
  {...props}
/>`,
      },
    },
  ],
  api: [
    {
      title: "SettingsDialog",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`open`", "`boolean`", "required", "Whether the dialog is open."],
        [
          "`onOpenChange`",
          "`(open: boolean) => void`",
          "required",
          "Called to open or close it. Cancel and Save both close it.",
        ],
        [
          "`user`",
          "`SettingsUser`",
          "required",
          "Who they are, filling the General section.",
        ],
        [
          "`theme`",
          '`"system" | "light" | "dark"`',
          '`"system"`',
          "The theme chosen.",
        ],
        [
          "`apiKeys`",
          "`SettingsApiKey[]`",
          "`[]`",
          "The API keys they have made.",
        ],
        [
          "`providers`",
          "`SettingsProvider[]`",
          "`[]`",
          "Providers they bring a key for. Without any, the section is left out.",
        ],
        [
          "`providerKeys`",
          "`Record<string, string>`",
          "`{}`",
          "Their keys, keyed by provider id.",
        ],
        [
          "`defaultSection`",
          '`"general" | "appearance" | "providers" | "api-keys"`',
          '`"general"`',
          "The section shown each time it opens.",
        ],
        [
          "`onSave`",
          "`(values: SettingsValues) => void`",
          "",
          "Called with every value when Save is pressed.",
        ],
      ],
    },
    {
      title: "SettingsValues",
      head: ["Field", "Type", "Description"],
      rows: [
        ["`name` / `email`", "`string`", "From General."],
        ["`theme`", "`SettingsTheme`", "From Appearance."],
        [
          "`apiKeys`",
          "`SettingsApiKey[]`",
          "Every key, including ones just made.",
        ],
        [
          "`providerKeys`",
          "`Record<string, string>`",
          "Keyed by provider id. A provider without a key is left out.",
        ],
      ],
    },
    {
      title: "SettingsProvider and SettingsApiKey",
      head: ["Field", "Type", "Description"],
      rows: [
        ["`SettingsProvider.id` / `name`", "`string`", "The provider."],
        [
          "`SettingsProvider.description`",
          "`string`",
          "Which models its key reaches, in a few words.",
        ],
        [
          "`SettingsProvider.keysUrl`",
          "`string`",
          "Where a key for it is made, linked beside its field.",
        ],
        [
          "`SettingsProvider.placeholder`",
          "`string`",
          "How its keys begin, shown in an empty field.",
        ],
        [
          "`SettingsApiKey.id` / `name` / `secret`",
          "`string`",
          "The key. `secret` is shown in full only right after it is made.",
        ],
        [
          "`SettingsApiKey.createdAt`",
          "`string`",
          "A calendar date, `YYYY-MM-DD`.",
        ],
      ],
    },
  ],
}

export default doc
