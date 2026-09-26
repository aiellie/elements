"use client"

import * as React from "react"
import { Link01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { ChatSource } from "@/registry/aiellie/blocks/chat/components/chat-messages"

const SHOWN = 4

const sourceLink =
  "inline-flex h-6 max-w-48 min-w-0 items-center gap-1 rounded-md border border-border/60 px-2 text-xs text-muted-foreground transition-colors duration-80 outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring motion-reduce:transition-none dark:hover:bg-muted/50"

// Only a web page can be a source. Anything else a search hands back, like a
// `javascript:` link, is left out.
function hostOf(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

function ChatSources({ sources }: { sources: ChatSource[] }) {
  const [all, setAll] = React.useState(false)
  const pages = sources.flatMap((source) => {
    const host = hostOf(source.url)
    return host ? [{ ...source, host }] : []
  })
  if (pages.length === 0) return null
  const shown = all ? pages : pages.slice(0, SHOWN)
  const more = pages.length - shown.length

  return (
    <div
      data-slot="chat-sources"
      className="flex flex-wrap items-center gap-1.5"
      aria-label="Sources"
      role="group"
    >
      {shown.map((page) => (
        <a
          key={page.url}
          href={page.url}
          target="_blank"
          rel="noreferrer"
          title={page.title ?? page.url}
          className={sourceLink}
        >
          <HugeiconsIcon aria-hidden icon={Link01Icon} className="size-3" />
          <span className="truncate">{page.host}</span>
        </a>
      ))}
      {more > 0 ? (
        <button
          type="button"
          onClick={() => setAll(true)}
          className={sourceLink}
          aria-label={`Show ${more} more sources`}
        >
          +{more}
        </button>
      ) : null}
    </div>
  )
}

export { ChatSources }
