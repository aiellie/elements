"use client"

import * as React from "react"
import {
  Copy01Icon,
  GlobalIcon,
  Linkedin01Icon,
  LockIcon,
  NewTwitterIcon,
  RedditIcon,
  Share08Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/aiellie/ui/dialog"
import { Input } from "@/registry/aiellie/ui/input"

type ShareVisibility = "private" | "link"

const VISIBILITY = {
  private: {
    icon: LockIcon,
    label: "Only you",
    description: "Nobody else can open it.",
  },
  link: {
    icon: GlobalIcon,
    label: "Anyone with the link",
    description: "Anyone with the link can open it.",
  },
} as const

function ShareLink({ url, disabled }: { url: string; disabled: boolean }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <div className="flex items-center gap-2">
      <Input
        readOnly
        value={disabled ? "" : url}
        placeholder="No link while it's private"
        disabled={disabled}
        aria-label="Share link"
        onFocus={(event) => event.currentTarget.select()}
        className="text-xs"
      />
      <Button
        disabled={disabled}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
          } catch {
            // Refused, so there is nothing to confirm.
          }
        }}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          data-icon="inline-start"
          aria-hidden
        />
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  )
}

function ShareDialog({
  open,
  onOpenChange,
  url,
  text,
  title = "Share",
  descriptions,
  preview,
  defaultVisibility = "link",
  onVisibilityChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  /** What a post to X or Reddit says alongside the link, like the page's title. */
  text?: string
  title?: string
  /** What each choice means for what's shared, in place of the general wording. */
  descriptions?: Partial<Record<ShareVisibility, string>>
  /** Shown above the controls, like a glimpse of what's being shared. */
  preview?: React.ReactNode
  defaultVisibility?: ShareVisibility
  onVisibilityChange?: (visibility: ShareVisibility) => void
}) {
  const [visibility, setVisibility] =
    React.useState<ShareVisibility>(defaultVisibility)
  const current = VISIBILITY[visibility]
  const shared = visibility === "link"

  const targets = [
    {
      label: "Share to X",
      icon: NewTwitterIcon,
      href: `https://x.com/intent/post?url=${encodeURIComponent(url)}${text ? `&text=${encodeURIComponent(text)}` : ""}`,
    },
    {
      label: "Share to LinkedIn",
      icon: Linkedin01Icon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share to Reddit",
      icon: RedditIcon,
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}${text ? `&title=${encodeURIComponent(text)}` : ""}`,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        <HugeiconsIcon
          icon={Share08Icon}
          data-icon="inline-start"
          aria-hidden
        />
        Share
      </DialogTrigger>
      <DialogContent data-slot="share-dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {descriptions?.[visibility] ?? current.description}
          </DialogDescription>
        </DialogHeader>
        {preview}
        <Menu>
          <MenuTrigger
            render={
              <Button variant="outline" className="w-full justify-start" />
            }
          >
            <HugeiconsIcon
              icon={current.icon}
              data-icon="inline-start"
              aria-hidden
            />
            {current.label}
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              aria-hidden
              className="ms-auto text-muted-foreground"
            />
          </MenuTrigger>
          <MenuContent variant="solid" align="start" className="w-72">
            <MenuRadioGroup
              value={visibility}
              onValueChange={(value) => {
                setVisibility(value as ShareVisibility)
                onVisibilityChange?.(value as ShareVisibility)
              }}
            >
              {(Object.keys(VISIBILITY) as ShareVisibility[]).map((key) => (
                <MenuRadioItem key={key} value={key}>
                  <HugeiconsIcon icon={VISIBILITY[key].icon} />
                  {VISIBILITY[key].label}
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          </MenuContent>
        </Menu>
        <ShareLink url={url} disabled={!shared} />
        <DialogFooter className="flex-row items-center gap-1 sm:justify-start">
          <span className="me-auto text-xs text-muted-foreground">
            Post it to
          </span>
          {targets.map((target) => (
            <TooltipIconButton
              key={target.label}
              tooltip={target.label}
              side="top"
              disabled={!shared}
              onClick={() =>
                window.open(target.href, "_blank", "noopener,noreferrer")
              }
              className="size-7"
            >
              <HugeiconsIcon icon={target.icon} aria-hidden />
            </TooltipIconButton>
          ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ShareDialog }
export type { ShareVisibility }
