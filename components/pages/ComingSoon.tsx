import { HugeiconsIcon } from "@hugeicons/react"

import type { PageMeta } from "@/components/pages/page-hero"

type ComingSoonProps = PageMeta

export function ComingSoon({
  eyebrow,
  title,
  icon,
  description,
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[calc(100svh-5rem)] items-center justify-center py-12 sm:py-16">
      <section className="flex w-full max-w-2xl flex-col items-center text-center">
        <div className="relative mb-8 flex size-20 items-center justify-center rounded-2xl border bg-muted/30">
          <div className="absolute -inset-3 -z-10 rounded-[1.75rem] border border-dashed border-border/70" />
          <HugeiconsIcon
            aria-hidden
            icon={icon}
            strokeWidth={1.5}
            className="size-8 text-foreground/80"
          />
        </div>

        <p className="text-code-sm text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-3 text-display">{title}</h1>
        <p className="mt-4 max-w-lg text-body-sm text-muted-foreground sm:text-body">
          {description}
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-caption text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-40 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Work in progress
        </div>

        <div
          aria-hidden
          className="mt-12 grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 text-code-sm text-muted-foreground"
        >
          <span>draft</span>
          <span className="h-px bg-border" />
          <span>publish</span>
        </div>
      </section>
    </div>
  )
}
