"use client"

import * as React from "react"

import { UserMenu, type User } from "@/registry/aiellie/components/user-menu"
import { SidebarProvider } from "@/registry/aiellie/ui/sidebar"

export default function SignedOut() {
  const [user, setUser] = React.useState<User>()

  return (
    <SidebarProvider className="min-h-0 w-full max-w-64">
      <UserMenu
        user={user}
        onSignIn={async ({ email }) => {
          await new Promise((resolve) => setTimeout(resolve, 600))
          setUser({ name: "AI Ellie", email, plan: "Pro" })
        }}
        onLogOut={() => setUser(undefined)}
      />
    </SidebarProvider>
  )
}
