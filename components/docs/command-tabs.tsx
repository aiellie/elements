"use client"

import * as React from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { INSTALLERS, writeToClipboard } from "@/components/pages/demo-actions"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { Tabs, TabsList, TabsTrigger } from "@/registry/aiellie/ui/tabs"

type Installer = (typeof INSTALLERS)[number]["id"]

const STORAGE_KEY = "package-manager"
// Picking a manager in one block switches every other block on the page too.
const SYNC_EVENT = "command-tabs:package-manager"

function isInstaller(value: unknown): value is Installer {
  return INSTALLERS.some((installer) => installer.id === value)
}

// Kept in memory too, so a pick still sticks where storage is refused.
let picked: Installer | null = null

function readInstaller(): Installer {
  if (picked) return picked
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isInstaller(stored)) return stored
  } catch {}
  return "npm"
}

function writeInstaller(value: Installer) {
  picked = value
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {}
  window.dispatchEvent(new Event(SYNC_EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener(SYNC_EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(SYNC_EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** One command, written for each package manager, with a copy button. */
function CommandTabs({
  args,
  className,
}: {
  /** What follows the manager's exec, like `aiellie add stream-text`. */
  args: string
  className?: string
}) {
  const active = React.useSyncExternalStore(
    subscribe,
    readInstaller,
    () => "npm" as const
  )
  const [copied, setCopied] = React.useState(false)
  const exec =
    INSTALLERS.find((installer) => installer.id === active)?.exec ?? "npx"
  const command = `${exec} ${args}`

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <figure
      data-slot="command-tabs"
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background",
        className
      )}
    >
      <div className="flex h-10 items-center justify-between gap-2 border-b border-border/60 ps-1.5 pe-1.5">
        <Tabs
          value={active}
          onValueChange={(value) => {
            if (isInstaller(value)) writeInstaller(value)
          }}
        >
          <TabsList aria-label="Package manager">
            {INSTALLERS.map((installer) => (
              <TabsTrigger
                key={installer.id}
                value={installer.id}
                className="text-code-sm font-mono"
              >
                {installer.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <TooltipIconButton
          tooltip={copied ? "Copied" : "Copy command"}
          aria-label={copied ? "Copied" : "Copy command"}
          onClick={async () => {
            if (await writeToClipboard(command)) {
              setCopied(true)
            } else {
              toast.add({
                title: "Could not copy",
                description: command,
                type: "error",
              })
            }
          }}
          className="size-7"
        >
          <HugeiconsIcon aria-hidden icon={copied ? Tick02Icon : Copy01Icon} />
        </TooltipIconButton>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-code-block font-mono">
        <code>
          <span aria-hidden className="text-muted-foreground select-none">
            ${" "}
          </span>
          {command}
        </code>
      </pre>
    </figure>
  )
}

export { CommandTabs }
