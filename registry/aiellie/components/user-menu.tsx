"use client"

import * as React from "react"
import {
  ChartLineData01Icon,
  HelpCircleIcon,
  Login03Icon,
  Logout01Icon,
  Settings01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import {
  SettingsDialog,
  type SettingsUser,
  type SettingsValues,
} from "@/registry/aiellie/components/settings-dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/aiellie/ui/avatar"
import { Badge } from "@/registry/aiellie/ui/badge"
import {
  LoginDialog,
  type LoginValues,
} from "@/registry/aiellie/components/login-form"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"

type User = SettingsUser & {
  /** The plan they are on, e.g. "Pro" or "Free", badged beside their name. */
  plan?: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar size="sm">
      {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
      <AvatarFallback>{initials(user.name)}</AvatarFallback>
    </Avatar>
  )
}

function UserMenu({
  user,
  usage,
  onUsage,
  onInvite,
  onSettings,
  onSettingsSave,
  settings,
  settingsOpen: settingsOpenProp,
  onSettingsOpenChange,
  onHelp,
  onLogOut,
  onSignIn,
  login,
}: {
  /** Who is signed in. Without one, the row is a Sign in button that opens the login dialog. */
  user?: User
  /** How much of their plan is left, e.g. "72% left", shown beside Usage. */
  usage?: string
  onUsage?: () => void
  onInvite?: () => void
  onSettings?: () => void
  onSettingsSave?: (values: SettingsValues) => void
  /** What the settings dialog starts from each time it opens. */
  settings?: Pick<
    React.ComponentProps<typeof SettingsDialog>,
    "theme" | "apiKeys" | "providers" | "providerKeys" | "defaultSection"
  >
  /** Controls the settings dialog, so something else can open it too. */
  settingsOpen?: boolean
  onSettingsOpenChange?: (open: boolean) => void
  onHelp?: () => void
  onLogOut?: () => void
  /** Return a promise to keep the dialog open and working until it settles. */
  onSignIn?: (values: LoginValues) => void | Promise<void>
  /** Passed on to the login dialog. */
  login?: Omit<
    React.ComponentProps<typeof LoginDialog>,
    "open" | "onOpenChange" | "onSubmit"
  >
}) {
  const [loginOpen, setLoginOpen] = React.useState(false)
  const [settingsOpenState, setSettingsOpenState] = React.useState(false)
  const settingsOpen = settingsOpenProp ?? settingsOpenState
  const setSettingsOpen = (open: boolean) => {
    setSettingsOpenState(open)
    onSettingsOpenChange?.(open)
  }

  const settingsDialog = (
    <SettingsDialog
      {...settings}
      user={user}
      open={settingsOpen}
      onOpenChange={setSettingsOpen}
      onSave={onSettingsSave}
    />
  )

  if (!user) {
    return (
      <>
        <SidebarMenu data-slot="user-menu">
          <SidebarMenuItem>
            <SidebarMenuButton
              data-slot="user-menu-sign-in"
              aria-haspopup="dialog"
              onClick={() => setLoginOpen(true)}
            >
              <HugeiconsIcon icon={Login03Icon} aria-hidden />
              <span className="min-w-0 flex-1 truncate">Sign in</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <LoginDialog
          {...login}
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onSubmit={onSignIn}
        />
        {settingsDialog}
      </>
    )
  }

  return (
    <>
      <SidebarMenu data-slot="user-menu">
        <SidebarMenuItem>
          <Menu>
            <MenuTrigger
              render={
                <SidebarMenuButton className="data-popup-open:bg-sidebar-accent" />
              }
            >
              <UserAvatar user={user} />
              <span className="min-w-0 flex-1 truncate">{user.name}</span>
            </MenuTrigger>
            <MenuContent side="top" className="w-(--anchor-width) min-w-48">
              {/* Small text on glass takes foreground ink to hold its contrast. */}
              <div className="flex items-center gap-2 px-2 py-1">
                <UserAvatar user={user} />
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                  {user.name}
                </span>
                {user.plan ? (
                  <Badge variant="secondary">{user.plan}</Badge>
                ) : null}
              </div>
              <MenuSeparator />
              <MenuItem onClick={onUsage}>
                <HugeiconsIcon icon={ChartLineData01Icon} aria-hidden />
                Usage
                {usage ? <MenuShortcut>{usage}</MenuShortcut> : null}
              </MenuItem>
              <MenuItem onClick={onInvite}>
                <HugeiconsIcon icon={UserAdd01Icon} aria-hidden />
                Invite a friend
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setSettingsOpen(true)
                  onSettings?.()
                }}
              >
                <HugeiconsIcon icon={Settings01Icon} aria-hidden />
                Settings
              </MenuItem>
              <MenuItem onClick={onHelp}>
                <HugeiconsIcon icon={HelpCircleIcon} aria-hidden />
                Help
              </MenuItem>
              <MenuSeparator />
              <MenuItem onClick={onLogOut}>
                <HugeiconsIcon icon={Logout01Icon} aria-hidden />
                Log out
              </MenuItem>
            </MenuContent>
          </Menu>
        </SidebarMenuItem>
      </SidebarMenu>
      {settingsDialog}
    </>
  )
}

export { UserMenu }
export type { User }
