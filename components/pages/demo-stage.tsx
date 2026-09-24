"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  DemoActions,
  demoBackgroundClass,
  type DemoBackground,
} from "@/components/pages/demo-actions"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * One demo with the whole viewport to itself: a thin bar with the way back and
 * the card's own controls, and the plate filling everything under it.
 *
 * The plate starts on dots rather than the page's colour, because the dots are
 * what show the edge of a translucent layer and how far a component reaches,
 * which is most of the reason to look at one this large.
 */
function DemoStage({
  item,
  title,
  back,
  children,
}: {
  /** The registry item on show, e.g. `model-selector`. */
  item: string
  title: string
  /** The gallery this demo was opened from. */
  back: string
  children: React.ReactNode
}) {
  const [background, setBackground] = useState<DemoBackground>("dots")

  return (
    <div className="flex h-svh flex-col bg-background">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/40 px-3">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href={back} />}
          className="text-muted-foreground"
        >
          <HugeiconsIcon
            aria-hidden
            icon={ArrowLeft02Icon}
            className="rtl:-scale-x-100"
          />
          <span className="sr-only">Back to the gallery</span>
        </Button>
        <h1 className="truncate text-[13.5px] font-medium">{title}</h1>
        <div className="ms-auto flex items-center gap-1.5">
          {/* Always shown: on the card it waits for the pointer so a grid of
              them stays quiet, but here it is the only one on the page. */}
          <DemoActions
            item={item}
            title={title}
            background={background}
            onBackgroundChange={setBackground}
            className="opacity-100"
          />
          <ThemeToggle />
        </div>
      </header>
      <main
        className={cn(
          "flex min-h-0 flex-1 items-center justify-center overflow-auto p-6",
          demoBackgroundClass(background)
        )}
      >
        <div className="flex h-full min-h-0 w-full items-center justify-center">
          {children}
        </div>
      </main>
    </div>
  )
}

export { DemoStage }
