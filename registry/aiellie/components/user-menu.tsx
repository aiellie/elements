"use client"

import * as React from "react"
import {
  ChartLineData01Icon,
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
} from "@/registry/aiellie/components/menu"
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
  onLogOut,
}: {
  user: User
  /** How much of their plan is left, e.g. "72% left", shown beside Usage. */
  usage?: string
  onUsage?: () => void
  onInvite?: () => void
  onSettings?: () => void
  onSettingsSave?: (values: SettingsValues) => void
  onLogOut?: () => void
}) {
  const [settingsOpen, setSettingsOpen] = React.useState(false)

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
              <div className="flex items-center gap-2 px-2 py-1.5">
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
              <MenuSeparator />
              <MenuItem onClick={onLogOut}>
                <HugeiconsIcon icon={Logout01Icon} aria-hidden />
                Log out
              </MenuItem>
            </MenuContent>
          </Menu>
        </SidebarMenuItem>
      </SidebarMenu>
      <SettingsDialog
        user={user}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSave={onSettingsSave}
      />
    </>
  )
}

export { UserMenu }
export type { User }
