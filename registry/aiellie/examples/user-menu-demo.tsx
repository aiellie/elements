"use client"

import { UserMenu } from "@/registry/aiellie/components/user-menu"
import { SidebarProvider } from "@/registry/aiellie/ui/sidebar"

export default function UserMenuDemo() {
  return (
    // `min-h-0` drops the provider's full-page minimum height.
    <SidebarProvider className="min-h-0 w-full max-w-64">
      <UserMenu
        user={{ name: "AI Ellie", email: "ellie@example.com", plan: "Free" }}
        usage="40% left"
      />
    </SidebarProvider>
  )
}
