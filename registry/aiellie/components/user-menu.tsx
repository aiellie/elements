"use client"

import {
  Logout01Icon,
  Settings01Icon,
  UnfoldMoreIcon,
  UserCircleIcon,
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

/**
 * Who is signed in, at the foot of a sidebar: a small picture and their name,
 * on a row the size of every other one, opening a menu of what they can do
 * with their account. It is a sidebar row,
 * so it goes inside a `SidebarProvider`, usually in `SidebarFooter`.
 *
 * Each item calls its handler; one left out still shows, doing nothing, so
 * the menu keeps its shape while the app is wired up.
 */
function UserMenu({
  user,
  onAccount,
  onSettings,
  onSignOut,
}: {
  user: User
  onAccount?: () => void
  onSettings?: () => void
  onSignOut?: () => void
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
            <Avatar size="sm">
              {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate">{user.name}</span>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              aria-hidden
              className="ms-auto text-muted-foreground"
            />
          </MenuTrigger>
          {/* Opens upward from the foot of the sidebar, as wide as the row. */}
          <MenuContent side="top" className="w-(--anchor-width) min-w-48">
            <MenuItem onClick={onAccount}>
              <HugeiconsIcon icon={UserCircleIcon} aria-hidden />
              Account
            </MenuItem>
            <MenuItem onClick={onSettings}>
              <HugeiconsIcon icon={Settings01Icon} aria-hidden />
              Settings
            </MenuItem>
            <MenuSeparator />
            <MenuItem onClick={onSignOut}>
              <HugeiconsIcon icon={Logout01Icon} aria-hidden />
              Sign out
            </MenuItem>
          </MenuContent>
        </Menu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { UserMenu }
export type { User }
