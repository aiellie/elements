"use client"

import { UserMenu } from "@/registry/aiellie/components/user-menu"
import { SidebarProvider } from "@/registry/aiellie/ui/sidebar"

export default function UserMenuDemo() {
  return (
    // A sidebar row, so it needs the provider; `min-h-0` drops the provider's
    // own full-height minimum, which is for a whole page.
    <SidebarProvider className="min-h-0 w-full max-w-64">
      <UserMenu
        user={{ name: "Ada Lovelace", plan: "Free" }}
        usage="40% left"
      />
    </SidebarProvider>
  )
}
