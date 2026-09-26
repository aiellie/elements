"use client"

import * as React from "react"
import { Link01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

const sourceChip =
  "inline-flex h-6 max-w-48 min-w-0 items-center gap-1 rounded-md border border-border/60 px-2 text-xs text-muted-foreground transition-colors duration-80 outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring motion-reduce:transition-none dark:hover:bg-muted/50"

// Only a web page can be a source. Anything else, like a `javascript:` link
// a search handed back, isn't one.
function hostOf(href: string) {
  try {
    const url = new URL(href)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    return url.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

function Sources({
  max = 4,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** How many show before the rest fold into a "+N" chip. */
  max?: number
}) {
  const [all, setAll] = React.useState(false)
  // A source that isn't a web page shows nothing, so it isn't counted either.
  const items = React.Children.toArray(children).filter(
    (item) =>
      !React.isValidElement<{ href?: unknown }>(item) ||
      typeof item.props.href !== "string" ||
      hostOf(item.props.href) !== null
  )
  const shown = all ? items : items.slice(0, max)
  const more = items.length - shown.length

  return (
    <div
      data-slot="sources"
      role="group"
      aria-label="Sources"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    >
      {shown}
      {more > 0 ? (
        <button
          type="button"
          data-slot="sources-more"
          aria-label={`Show ${more} more sources`}
          onClick={() => setAll(true)}
          className={sourceChip}
        >
          +{more}
        </button>
      ) : null}
    </div>
  )
}

function Source({
  href,
  title,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"a">, "href"> & {
  href: string
  /** The page's title, shown on hover. The chip itself names the site. */
  title?: string
}) {
  const host = hostOf(href)
  if (!host) return null

  return (
    <a
      data-slot="source"
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title ?? href}
      className={cn(sourceChip, className)}
      {...props}
    >
      {children ?? (
        <>
          <HugeiconsIcon aria-hidden icon={Link01Icon} className="size-3" />
          <span className="truncate">{host}</span>
        </>
      )}
    </a>
  )
}

export { Source, Sources }
