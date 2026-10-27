"use client"

import * as React from "react"

import { UserMenu } from "@/registry/aiellie/components/user-menu"
import { SidebarProvider } from "@/registry/aiellie/ui/sidebar"

export default function Settings() {
  const [name, setName] = React.useState("AI Ellie")

  return (
    <SidebarProvider className="min-h-0 w-full max-w-64 flex-col gap-2">
      <UserMenu
        user={{ name, email: "ellie@example.com", plan: "Pro" }}
        usage="72% left"
        settings={{
          theme: "dark",
          providers: [
            {
              id: "openai",
              name: "OpenAI",
              description: "GPT models",
              placeholder: "sk-…",
            },
          ],
        }}
        onSettingsSave={(values) => setName(values.name)}
      />
      <p className="px-2 text-xs text-muted-foreground">
        Open Settings, change the name, and save.
      </p>
    </SidebarProvider>
  )
}
