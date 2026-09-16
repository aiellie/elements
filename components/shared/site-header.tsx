"use client"

import { CONTAINER, NAV_PAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { NavButton } from "./nav-button"
import { Logo } from "./logo"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 shrink-0 bg-background/30 backdrop-blur-md transition-[background-color,backdrop-filter] duration-200">
      <div className={cn(CONTAINER, "flex h-11 items-center gap-2 border-b border-border/40")}>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-4">
            <nav aria-label="Site" className="flex items-center gap-0.5">
              {NAV_PAGES.map((page) => (
                <NavButton key={page.href} {...page} />
              ))}
            </nav>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}