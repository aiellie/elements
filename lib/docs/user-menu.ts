import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "User menu is the row at the foot of a sidebar with the person's avatar and name, and the account menu it opens: usage, inviting a friend, settings and logging out. Settings opens the [Settings dialog](/components/settings-dialog), which comes with it, so the row works on its own.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Put it in the sidebar's footer",
        body: [
          "It is a `SidebarMenu`, so it goes inside a `Sidebar` under a `SidebarProvider`. Pass who is signed in as `user`.",
        ],
        code: {
          title: "components/app-sidebar.tsx",
          code: `"use client"

import { UserMenu } from "@/components/aiellie/user-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>{/* chats */}</SidebarContent>
      <SidebarFooter>
        <UserMenu
          user={{ name: "Ada Lovelace", email: "ada@example.com", plan: "Pro" }}
          usage="72% left"
          onUsage={() => {}}
          onInvite={() => {}}
          onLogOut={() => signOut()}
        />
      </SidebarFooter>
    </Sidebar>
  )
}`,
        },
      },
      {
        title: "Save what settings change",
        body: [
          "`settings` is what the dialog starts from each time it opens, and `onSettingsSave` gets everything in it when saved.",
        ],
        code: {
          code: `<UserMenu
  user={user}
  settings={{ theme, providers, providerKeys }}
  onSettingsSave={(values) => saveSettings(values)}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<ul data-slot="user-menu"> {/* SidebarMenu */}
  <li>
    <button data-slot="sidebar-menu-button"> {/* the menu's trigger */}
      <span data-slot="avatar" /> {/* their picture, or their initials */}
      <span>{user.name}</span>
    </button>
  </li>
</ul>

<div data-slot="menu-content"> {/* as wide as the row, opening upward */}
  <div>{/* avatar, name, plan badge */}</div>
  <div data-slot="menu-separator" />
  <div data-slot="menu-item" /> {/* Usage, with \`usage\` at its end */}
  <div data-slot="menu-item" /> {/* Invite a friend */}
  <div data-slot="menu-item" /> {/* Settings, opening the dialog */}
  <div data-slot="menu-separator" />
  <div data-slot="menu-item" /> {/* Log out */}
</div>

<div data-slot="dialog-content" /> {/* SettingsDialog */}`,
    body: [
      "The row keeps its `sidebar-accent` fill while the menu is open. The menu opens upward at the row's width, and repeats the name with the `plan` as a badge, so the account is named where its actions are. Without an `avatar`, the first letters of the first two words of the name stand in.",
    ],
  },
  examples: [
    {
      title: "Settings that save",
      body: [
        "Change the name in Settings and save: `onSettingsSave` passes it back and the row follows.",
      ],
      sample: "user-menu/settings",
    },
    {
      title: "Open settings from somewhere else",
      body: [
        "Control the dialog with `settingsOpen` and `onSettingsOpenChange`, so a shortcut or another button can open it too.",
      ],
      code: {
        code: `const [settingsOpen, setSettingsOpen] = React.useState(false)

<UserMenu
  user={user}
  settingsOpen={settingsOpen}
  onSettingsOpenChange={setSettingsOpen}
/>`,
      },
    },
  ],
  api: [
    {
      title: "UserMenu",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`user`", "`User`", "required", "Who is signed in."],
        [
          "`usage`",
          "`string`",
          "",
          "How much of their plan is left, like `72% left`, shown at the end of Usage.",
        ],
        ["`onUsage`", "`() => void`", "", "Runs when Usage is chosen."],
        [
          "`onInvite`",
          "`() => void`",
          "",
          "Runs when Invite a friend is chosen.",
        ],
        [
          "`onSettings`",
          "`() => void`",
          "",
          "Runs when Settings is chosen, as the dialog opens.",
        ],
        [
          "`settings`",
          "`{ theme, apiKeys, providers, providerKeys, defaultSection }`",
          "",
          "What the settings dialog starts from each time it opens.",
        ],
        [
          "`onSettingsSave`",
          "`(values: SettingsValues) => void`",
          "",
          "Called with the dialog's values when saved.",
        ],
        [
          "`settingsOpen` / `onSettingsOpenChange`",
          "`boolean` / `(open: boolean) => void`",
          "",
          "Controls the settings dialog.",
        ],
        ["`onLogOut`", "`() => void`", "", "Runs when Log out is chosen."],
      ],
    },
    {
      title: "User",
      head: ["Field", "Type", "Description"],
      rows: [
        [
          "`name`",
          "`string`",
          "Shown in the row and the menu, and the source of the initials.",
        ],
        ["`email`", "`string`", "Filled into the settings dialog."],
        [
          "`avatar`",
          "`string`",
          "A picture of them. Without one, their initials stand in.",
        ],
        [
          "`plan`",
          "`string`",
          "The plan they are on, like `Pro`, badged beside their name.",
        ],
      ],
    },
  ],
}

export default doc
