"use client"

import * as React from "react"
import {
  ComputerIcon,
  Moon02Icon,
  PaintBoardIcon,
  Sun03Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/aiellie/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/aiellie/ui/breadcrumb"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/aiellie/ui/dialog"
import { Input } from "@/registry/aiellie/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/aiellie/ui/resizable"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/aiellie/ui/sidebar"

type SettingsTheme = "system" | "light" | "dark"
type SettingsSection = "general" | "appearance"

type SettingsUser = {
  name: string
  email?: string
  /** A picture of them. Without one, their initials stand in. */
  avatar?: string
}

type SettingsValues = {
  name: string
  email: string
  theme: SettingsTheme
}

const THEMES: {
  value: SettingsTheme
  label: string
  icon: typeof ComputerIcon
}[] = [
  { value: "system", label: "System", icon: ComputerIcon },
  { value: "light", label: "Light", icon: Sun03Icon },
  { value: "dark", label: "Dark", icon: Moon02Icon },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

function SettingsDialogForm({
  user,
  initialTheme,
  onOpenChange,
  onSave,
}: {
  user: SettingsUser
  initialTheme: SettingsTheme
  onOpenChange: (open: boolean) => void
  onSave?: (values: SettingsValues) => void
}) {
  const id = React.useId()
  const [name, setName] = React.useState(user.name)
  const [email, setEmail] = React.useState(user.email ?? "")
  const [theme, setTheme] = React.useState<SettingsTheme>(initialTheme)
  const [section, setSection] = React.useState<SettingsSection>("general")

  return (
    <form
      className="h-full"
      onSubmit={(event) => {
        event.preventDefault()
        onSave?.({ name, email, theme })
        onOpenChange(false)
      }}
    >
      <SidebarProvider className="h-full min-h-0">
        <ResizablePanelGroup>
          <ResizablePanel defaultSize="34%" minSize="24%" maxSize="42%">
            <Sidebar collapsible="none" className="w-full">
              <SidebarContent>
                <SidebarGroup className="p-4 pt-6">
                  <SidebarMenu className="gap-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        type="button"
                        isActive={section === "general"}
                        aria-current={
                          section === "general" ? "page" : undefined
                        }
                        aria-controls={`${id}-general-panel`}
                        onClick={() => setSection("general")}
                      >
                        <HugeiconsIcon icon={UserAccountIcon} aria-hidden />
                        <span>General</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        type="button"
                        isActive={section === "appearance"}
                        aria-current={
                          section === "appearance" ? "page" : undefined
                        }
                        aria-controls={`${id}-appearance-panel`}
                        onClick={() => setSection("appearance")}
                      >
                        <HugeiconsIcon icon={PaintBoardIcon} aria-hidden />
                        <span>Appearance</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize="45%">
            <div className="flex h-full flex-col">
              <DialogHeader className="shrink-0 p-6 pb-4">
                <DialogTitle className="sr-only">
                  Settings: {section === "general" ? "General" : "Appearance"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Manage your account and preferences.
                </DialogDescription>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        render={<button type="button" />}
                        onClick={() => setSection("general")}
                      >
                        Settings
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {section === "general" ? "General" : "Appearance"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </DialogHeader>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {section === "general" ? (
                  <section
                    id={`${id}-general-panel`}
                    aria-label="General"
                    className="p-6 pt-4"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt="" />
                          ) : null}
                          <AvatarFallback>
                            {initials(name || user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {name || user.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {email || "No email added"}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <label
                          htmlFor={`${id}-name`}
                          className="flex flex-col gap-1 text-sm font-medium"
                        >
                          Display name
                          <Input
                            id={`${id}-name`}
                            name="name"
                            autoComplete="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                          />
                        </label>
                        <label
                          htmlFor={`${id}-email`}
                          className="flex flex-col gap-1 text-sm font-medium"
                        >
                          Email
                          <Input
                            id={`${id}-email`}
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                          />
                        </label>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section
                    id={`${id}-appearance-panel`}
                    aria-label="Appearance"
                    className="p-6 pt-4"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">
                        Choose how the interface appears on this device.
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {THEMES.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant="outline"
                          aria-pressed={theme === option.value}
                          data-active={theme === option.value ? "" : undefined}
                          onClick={() => setTheme(option.value)}
                          className="h-auto flex-1 flex-col gap-2 py-3 data-active:border-ring data-active:bg-muted data-active:text-foreground"
                        >
                          <HugeiconsIcon icon={option.icon} aria-hidden />
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarProvider>
    </form>
  )
}

function SettingsDialog({
  user,
  theme = "system",
  open,
  onOpenChange,
  onSave,
}: {
  user: SettingsUser
  theme?: SettingsTheme
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (values: SettingsValues) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-3/4 max-h-120 gap-0 overflow-hidden p-0 sm:max-w-3xl [&>[data-slot=dialog-close]]:end-4 [&>[data-slot=dialog-close]]:top-4">
        <SettingsDialogForm
          user={user}
          initialTheme={theme}
          onOpenChange={onOpenChange}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  )
}

export { SettingsDialog }
export type { SettingsTheme, SettingsUser, SettingsValues }
