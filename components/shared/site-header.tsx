"use client"

import { CONTAINER, NAV_PAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import Link from "next/link"
import { SiteNav } from "./nav-button"
import { GitHubLink } from "./github-link"
import { McpDialog } from "./mcp-dialog"
import { SiteSearch } from "./site-search"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 shrink-0 bg-background/30 backdrop-blur-md transition-[background-color,backdrop-filter] duration-200">
      <div
        className={cn(
          CONTAINER,
          "grid h-12 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-border/40"
        )}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center justify-self-start"
        >
          <Logo />
        </Link>
        <SiteNav pages={NAV_PAGES} />
        <div className="flex items-center gap-0.5 justify-self-end">
          <SiteSearch />
          <McpDialog />
          <GitHubLink />
        </div>
      </div>
    </header>
  )
}
