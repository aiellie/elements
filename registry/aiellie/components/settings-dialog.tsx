"use client"

import * as React from "react"
import {
  AiNetworkIcon,
  ArrowUpRight01Icon,
  Cancel01Icon,
  ComputerIcon,
  Copy01Icon,
  Key01Icon,
  Moon02Icon,
  PaintBoardIcon,
  PlusSignIcon,
  Sun03Icon,
  Tick02Icon,
  UserAccountIcon,
  ViewIcon,
  ViewOffSlashIcon,
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/aiellie/ui/input-group"
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
type SettingsSection = "general" | "appearance" | "providers" | "api-keys"

type SettingsUser = {
  name: string
  email?: string
  /** A picture of them. Without one, their initials stand in. */
  avatar?: string
}

type SettingsApiKey = {
  id: string
  name: string
  /** Shown in full only in the moment after the key is created. */
  secret: string
  /** Calendar date, `YYYY-MM-DD`. */
  createdAt: string
}

/** A model provider whose key the person brings, like OpenAI or a gateway. */
type SettingsProvider = {
  id: string
  name: string
  /** Which models its key reaches, in a few words. */
  description?: string
  /** Where a key for it is made. */
  keysUrl?: string
  /** How its keys begin, shown in an empty field. */
  placeholder?: string
}

type SettingsValues = {
  name: string
  email: string
  theme: SettingsTheme
  apiKeys: SettingsApiKey[]
  /** Keyed by provider id. A provider without a key is left out. */
  providerKeys: Record<string, string>
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

const SECTIONS: {
  id: SettingsSection
  label: string
  icon: typeof ComputerIcon
}[] = [
  { id: "general", label: "General", icon: UserAccountIcon },
  { id: "appearance", label: "Appearance", icon: PaintBoardIcon },
  { id: "providers", label: "Providers", icon: AiNetworkIcon },
  { id: "api-keys", label: "API keys", icon: Key01Icon },
]

function maskSecret(secret: string) {
  if (secret.length <= 8) return "••••••••"
  return `${secret.slice(0, 3)}••••${secret.slice(-4)}`
}

function formatCreated(createdAt: string) {
  const date = new Date(`${createdAt.slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return createdAt
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function today() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function createSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const body = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")
  return `sk-${body}`
}

function Fold({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  return (
    <div
      data-open={open || undefined}
      inert={!open}
      className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none data-open:grid-rows-[1fr] data-open:opacity-100"
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
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

function ApiKeysSection({
  id,
  keys,
  onChange,
}: {
  id: string
  keys: SettingsApiKey[]
  onChange: (keys: SettingsApiKey[]) => void
}) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const nameRef = React.useRef<HTMLInputElement>(null)
  const [creating, setCreating] = React.useState(false)
  const [draftName, setDraftName] = React.useState("")
  const [revealed, setRevealed] = React.useState<SettingsApiKey | null>(null)
  const [revealOpen, setRevealOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (creating) nameRef.current?.focus()
  }, [creating])

  function createKey() {
    const name = draftName.trim()
    if (!name) return
    const key: SettingsApiKey = {
      id: crypto.randomUUID(),
      name,
      secret: createSecret(),
      createdAt: today(),
    }
    onChange([key, ...keys])
    setRevealed(key)
    setRevealOpen(true)
    setCopied(false)
    setCreating(false)
    sectionRef.current?.parentElement?.scrollTo({ top: 0 })
  }

  function revoke(keyId: string) {
    onChange(keys.filter((key) => key.id !== keyId))
    setConfirmingId(null)
    if (revealed?.id === keyId) setRevealOpen(false)
  }

  async function copySecret() {
    if (!revealed) return
    try {
      await navigator.clipboard.writeText(revealed.secret)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label="API keys"
      className="flex flex-col p-6 pt-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-sm font-medium">API keys</p>
          <p className="text-xs text-muted-foreground">
            Authenticate requests from your own apps. A key is shown in full
            only when you create it.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={creating}
          onClick={() => {
            setDraftName("")
            setCreating(true)
          }}
          className="shrink-0"
        >
          <HugeiconsIcon icon={PlusSignIcon} aria-hidden />
          New key
        </Button>
      </div>

      <Fold open={creating}>
        <div className="pt-4">
          <div className="flex flex-col gap-3 rounded-lg border p-3">
            <label
              htmlFor={`${id}-name`}
              className="flex flex-col gap-1 text-sm font-medium"
            >
              Name
              <Input
                ref={nameRef}
                id={`${id}-name`}
                value={draftName}
                placeholder="Production"
                autoComplete="off"
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return
                  event.preventDefault()
                  createKey()
                }}
              />
            </label>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreating(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={!draftName.trim()}
                onClick={createKey}
              >
                Create key
              </Button>
            </div>
          </div>
        </div>
      </Fold>

      <Fold open={revealOpen}>
        <div className="pt-4">
          {revealed ? (
            <div className="flex flex-col gap-2 rounded-lg border bg-muted p-3">
              <p className="text-sm font-medium">{revealed.name}</p>
              <p className="text-xs text-muted-foreground">
                Copy this key now. This is the only time it is shown.
              </p>
              <p className="font-mono text-sm break-all">{revealed.secret}</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={copySecret}>
                  <HugeiconsIcon
                    icon={copied ? Tick02Icon : Copy01Icon}
                    aria-hidden
                  />
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setRevealOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Fold>

      <div className="pt-4">
        {keys.length === 0 ? (
          <p className="text-sm text-muted-foreground">No API keys yet.</p>
        ) : (
          <ul className="overflow-hidden rounded-lg border">
            {keys.map((key) => (
              <li
                key={key.id}
                className="flex items-center gap-3 border-b px-3 py-2 last:border-b-0"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="truncate text-sm font-medium">{key.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    <span className="font-mono">{maskSecret(key.secret)}</span>
                    <span aria-hidden> · </span>
                    {formatCreated(key.createdAt)}
                  </p>
                </div>
                {confirmingId === key.id ? (
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setConfirmingId(null)}
                    >
                      Keep
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => revoke(key.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => setConfirmingId(key.id)}
                  >
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function ProviderKeyField({
  id,
  provider,
  value,
  onChange,
}: {
  id: string
  provider: SettingsProvider
  value: string
  onChange: (value: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [shown, setShown] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <label htmlFor={id} className="text-sm font-medium">
            {provider.name}
          </label>
          {provider.description ? (
            <p
              id={`${id}-description`}
              className="text-xs text-muted-foreground"
            >
              {provider.description}
            </p>
          ) : null}
        </div>
        {provider.keysUrl ? (
          <a
            href={provider.keysUrl}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none"
          >
            Get a key
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              aria-hidden
              className="size-3 rtl:-scale-x-100"
            />
          </a>
        ) : null}
      </div>
      <InputGroup>
        <InputGroupInput
          ref={inputRef}
          id={id}
          type={shown ? "text" : "password"}
          value={value}
          placeholder={provider.placeholder}
          autoComplete="off"
          spellCheck={false}
          // Keeps password managers from offering to save or fill it.
          data-1p-ignore
          data-lpignore="true"
          aria-describedby={
            provider.description ? `${id}-description` : undefined
          }
          onChange={(event) => onChange(event.target.value)}
          className="font-mono"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label={shown ? "Hide key" : "Show key"}
            aria-pressed={shown}
            onClick={() => setShown(!shown)}
          >
            <HugeiconsIcon icon={shown ? ViewOffSlashIcon : ViewIcon} />
          </InputGroupButton>
          {/* Disabled rather than hidden while empty, so the field's end stays put. */}
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear key"
            disabled={!value}
            onClick={() => {
              onChange("")
              inputRef.current?.focus()
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function ProvidersSection({
  id,
  providers,
  keys,
  onChange,
}: {
  id: string
  providers: SettingsProvider[]
  keys: Record<string, string>
  onChange: (keys: Record<string, string>) => void
}) {
  return (
    <section id={id} aria-label="Providers" className="flex flex-col p-6 pt-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Providers</p>
        <p className="text-xs text-muted-foreground">
          Keys for the models you chat with. They stay in this browser and go
          out only with your own requests.
        </p>
      </div>
      <div className="flex flex-col gap-4 pt-4">
        {providers.map((provider) => (
          <ProviderKeyField
            key={provider.id}
            id={`${id}-${provider.id}`}
            provider={provider}
            value={keys[provider.id] ?? ""}
            onChange={(value) => onChange({ ...keys, [provider.id]: value })}
          />
        ))}
      </div>
    </section>
  )
}

function SettingsDialogForm({
  user,
  initialTheme,
  initialApiKeys,
  providers,
  initialProviderKeys,
  initialSection,
  onOpenChange,
  onSave,
}: {
  user: SettingsUser
  initialTheme: SettingsTheme
  initialApiKeys: SettingsApiKey[]
  providers: SettingsProvider[]
  initialProviderKeys: Record<string, string>
  initialSection: SettingsSection
  onOpenChange: (open: boolean) => void
  onSave?: (values: SettingsValues) => void
}) {
  const id = React.useId()
  const [name, setName] = React.useState(user.name)
  const [email, setEmail] = React.useState(user.email ?? "")
  const [theme, setTheme] = React.useState<SettingsTheme>(initialTheme)
  const [apiKeys, setApiKeys] = React.useState(initialApiKeys)
  const [providerKeys, setProviderKeys] = React.useState(initialProviderKeys)
  const sections = SECTIONS.filter(
    (item) => item.id !== "providers" || providers.length > 0
  )
  const [section, setSection] = React.useState<SettingsSection>(
    sections.some((item) => item.id === initialSection)
      ? initialSection
      : "general"
  )
  const current = sections.find((item) => item.id === section) ?? sections[0]

  return (
    <form
      className="h-full min-h-0 overflow-hidden"
      onSubmit={(event) => {
        event.preventDefault()
        onSave?.({
          name,
          email,
          theme,
          apiKeys,
          providerKeys: Object.fromEntries(
            Object.entries(providerKeys).flatMap(([provider, key]) =>
              key.trim() ? [[provider, key.trim()]] : []
            )
          ),
        })
        onOpenChange(false)
      }}
    >
      <SidebarProvider className="h-full min-h-0">
        <ResizablePanelGroup className="h-full min-h-0">
          <ResizablePanel
            defaultSize="34%"
            minSize="24%"
            maxSize="42%"
            className="min-h-0"
          >
            <Sidebar collapsible="none" className="w-full">
              <SidebarContent>
                <SidebarGroup className="p-4 pt-6">
                  <SidebarMenu className="gap-1">
                    {sections.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          type="button"
                          isActive={section === item.id}
                          aria-current={
                            section === item.id ? "page" : undefined
                          }
                          aria-controls={`${id}-${item.id}-panel`}
                          onClick={() => setSection(item.id)}
                        >
                          <HugeiconsIcon icon={item.icon} aria-hidden />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize="45%" className="min-h-0">
            <div className="flex h-full min-h-0 flex-col">
              <DialogHeader className="shrink-0 p-6 pb-4">
                <DialogTitle className="sr-only">
                  Settings: {current.label}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Manage your account, appearance, and keys.
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
                      <BreadcrumbPage>{current.label}</BreadcrumbPage>
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
                ) : section === "appearance" ? (
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
                ) : section === "providers" ? (
                  <ProvidersSection
                    id={`${id}-providers-panel`}
                    providers={providers}
                    keys={providerKeys}
                    onChange={setProviderKeys}
                  />
                ) : (
                  <ApiKeysSection
                    id={`${id}-api-keys-panel`}
                    keys={apiKeys}
                    onChange={setApiKeys}
                  />
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
  apiKeys = [],
  providers = [],
  providerKeys = {},
  defaultSection = "general",
  open,
  onOpenChange,
  onSave,
}: {
  user: SettingsUser
  theme?: SettingsTheme
  apiKeys?: SettingsApiKey[]
  /** Providers the person brings a key for. Without any, the section is left out. */
  providers?: SettingsProvider[]
  providerKeys?: Record<string, string>
  /** The section shown each time it opens. */
  defaultSection?: SettingsSection
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (values: SettingsValues) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-3/4 max-h-120 grid-rows-[minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-3xl [&>[data-slot=dialog-close]]:end-4 [&>[data-slot=dialog-close]]:top-4">
        <SettingsDialogForm
          user={user}
          initialTheme={theme}
          initialApiKeys={apiKeys}
          providers={providers}
          initialProviderKeys={providerKeys}
          initialSection={defaultSection}
          onOpenChange={onOpenChange}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  )
}

export { SettingsDialog }
export type {
  SettingsApiKey,
  SettingsProvider,
  SettingsSection,
  SettingsTheme,
  SettingsUser,
  SettingsValues,
}
