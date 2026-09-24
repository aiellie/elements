"use client"

import * as React from "react"
import {
  AiChat02Icon,
  InboxIcon,
  MoreHorizontalIcon,
  PlayIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
} from "@/registry/aiellie/ui/sidebar"

const ITEMS = [
  { id: "inbox", label: "Inbox", icon: InboxIcon, badge: 3 },
  { id: "chats", label: "Chats", icon: AiChat02Icon },
  { id: "runs", label: "Runs", icon: PlayIcon },
  { id: "settings", label: "Settings", icon: Settings01Icon },
]

// `collapsible="none"` keeps the sidebar inside the card. The default is fixed
// to the window's edge.
export default function SidebarDemo() {
  const [active, setActive] = React.useState("inbox")
  const current = ITEMS.find((item) => item.id === active)

  return (
    <SidebarProvider className="h-72 min-h-0 w-full max-w-lg overflow-hidden rounded-xl border">
      <Sidebar collapsible="none" className="w-56 border-e bg-background">
        <SidebarHeader>
          <SidebarInput aria-label="Search" placeholder="Search" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="pt-0">
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={item.id === active}
                    onClick={() => setActive(item.id)}
                  >
                    <HugeiconsIcon icon={item.icon} aria-hidden />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : (
                    <SidebarMenuAction showOnHover>
                      <HugeiconsIcon icon={MoreHorizontalIcon} />
                      <span className="sr-only">Options for {item.label}</span>
                    </SidebarMenuAction>
                  )}
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="items-center justify-center text-sm text-muted-foreground">
        {current?.label}
      </SidebarInset>
    </SidebarProvider>
  )
}
