"use client"

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
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/aiellie/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/aiellie/ui/sidebar"

type User = {
  name: string
  /** A picture of them. Without one, their initials stand in. */
  avatar?: string
  /** The plan they are on, e.g. "Pro" or "Free", badged beside their name. */
  plan?: string
}

/** Up to two letters from a name, for when there is no picture. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

/** Their picture, or their initials while there is none. */
function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar size="sm">
      {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
      <AvatarFallback>{initials(user.name)}</AvatarFallback>
    </Avatar>
  )
}

/**
 * Who is signed in, at the foot of a sidebar: a small picture and their name,
 * on a row the size of every other one. It opens a menu headed by who they
 * are and their plan, with what they can do with their account under it. It
 * is a sidebar row, so it goes inside a `SidebarProvider`, usually in
 * `SidebarFooter`.
 *
 * Each item calls its handler; one left out still shows, doing nothing, so
 * the menu keeps its shape while the app is wired up.
 */
function UserMenu({
  user,
  onUsage,
  onInvite,
  onSettings,
  onLogOut,
}: {
  user: User
  onUsage?: () => void
  onInvite?: () => void
  onSettings?: () => void
  onLogOut?: () => void
}) {
  return (
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
          {/* Opens upward from the foot of the sidebar, as wide as the row. */}
          <MenuContent side="top" className="w-(--anchor-width) min-w-48">
            {/* Who this is, as a heading rather than a row to pick. On glass,
                small text takes foreground ink, which holds its contrast over
                whatever is behind the menu. */}
            <div className="flex items-center gap-2 px-2 py-1.5">
              <UserAvatar user={user} />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                {user.name}
              </span>
              {user.plan ? (
                <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
                  {user.plan}
                </span>
              ) : null}
            </div>
            <MenuSeparator />
            <MenuItem onClick={onUsage}>
              <HugeiconsIcon icon={ChartLineData01Icon} aria-hidden />
              Usage
            </MenuItem>
            <MenuItem onClick={onInvite}>
              <HugeiconsIcon icon={UserAdd01Icon} aria-hidden />
              Invite a friend
            </MenuItem>
            <MenuItem onClick={onSettings}>
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
  )
}

export { UserMenu }
export type { User }
