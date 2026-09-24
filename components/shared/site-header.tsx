"use client"

import { CONTAINER, NAV_PAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import Link from "next/link"
import { SiteNav } from "./nav-button"
import { GitHubLink } from "./github-link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 shrink-0 bg-background/30 backdrop-blur-md transition-[background-color,backdrop-filter] duration-200">
      <div
        className={cn(
          CONTAINER,
          "flex h-12 items-center gap-2 border-b border-border/40"
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center">
            <Logo />
          </Link>
          <SiteNav pages={NAV_PAGES} />
        </div>
        <GitHubLink />
      </div>
    </header>
  )
}
