import Link from "next/link"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { SiteFooter } from "@/components/shared/site-footer"
import { SiteHeader } from "@/components/shared/site-header"
import { CONTAINER } from "@/lib/constants"
import { cn } from "@/lib/utils"

const trace = [
  { label: "request", value: "unknown route" },
  { label: "match", value: "not found" },
  { label: "fallback", value: "/" },
]

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main
        className={cn(
          CONTAINER,
          "flex flex-1 items-center py-12 sm:py-16 lg:py-20"
        )}
      >
        <section className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(28rem,1.2fr)] lg:gap-20">
          <div className="max-w-xl">
            <p className="text-code-sm text-muted-foreground">
              404 / NOT_FOUND
            </p>
            <h1 className="mt-4 text-display sm:text-[3rem] sm:leading-[3.25rem]">
              This page wandered off.
            </h1>
            <p className="mt-4 max-w-md text-body-sm text-muted-foreground sm:text-body">
              The route may have moved, changed names, or never existed. The
              rest of the library is still right where you left it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm text-primary-foreground transition-[background-color,scale] duration-150 hover:bg-primary/80 hover:text-primary-foreground active:scale-[0.97]"
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={ArrowLeft02Icon}
                  strokeWidth={2}
                  className="size-4"
                />
                Back to the library
              </Link>
              <Link
                href="/components"
                className="inline-flex h-8 items-center justify-center rounded-lg border border-border/60 bg-background px-3 text-sm transition-[background-color,color,scale] duration-150 hover:bg-muted hover:text-foreground active:scale-[0.97] dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              >
                Browse components
              </Link>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative min-h-80 overflow-hidden rounded-2xl border bg-muted/20 sm:min-h-96"
          >
            <div className="flex h-10 items-center justify-between bg-background/70 px-4">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-foreground/20" />
                <span className="size-1.5 rounded-full bg-foreground/20" />
                <span className="size-1.5 rounded-full bg-foreground/20" />
              </div>
              <span className="text-code-sm text-muted-foreground">
                route trace
              </span>
            </div>

            <div className="relative flex min-h-70 flex-col justify-between p-5 sm:min-h-86 sm:p-7">
              <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_90%)] [background-size:32px_32px] opacity-50" />

              <div className="relative flex items-center gap-3 text-code-sm text-muted-foreground">
                <span className="flex size-6 items-center justify-center rounded-full border bg-background text-foreground">
                  1
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="flex size-6 items-center justify-center rounded-full border bg-background text-foreground">
                  4
                </span>
                <span className="h-px flex-1 border-t border-dashed" />
                <span className="flex size-6 items-center justify-center rounded-full border border-dashed bg-background text-muted-foreground">
                  4
                </span>
              </div>

              <div className="relative my-10 grid gap-2">
                {trace.map((item, index) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-lg border bg-background/90 px-3 py-2.5 text-code-sm shadow-xs"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="truncate text-foreground">
                      {item.value}
                    </span>
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        index === trace.length - 1
                          ? "bg-success"
                          : "bg-muted-foreground/40"
                      )}
                    />
                  </div>
                ))}
              </div>

              <div className="relative flex items-end justify-between gap-4">
                <p className="max-w-48 text-code-sm text-muted-foreground">
                  No matching page at this address.
                </p>
                <span className="font-mono text-6xl font-light tracking-[-0.08em] text-foreground/10 sm:text-8xl">
                  404
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
