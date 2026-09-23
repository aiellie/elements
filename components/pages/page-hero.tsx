import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

/**
 * The copy a section page opens with. It is held in `lib/constants` beside the
 * nav that links to the page rather than in the page file, so the two readings
 * of "what is this section" can't drift apart, and a page file is only what
 * the page shows.
 */
interface PageMeta {
  /**
   * The word over the title, which the nav uses as its label too. Given a
   * count, the hero puts the number in front: "Components" becomes
   * "09 Components".
   */
  eyebrow: string
  title: string
  icon: IconSvgElement
  /** One or two sentences under the title, kept to `max-w-prose`. */
  description: string
}

/**
 * The block every section page opens with: the eyebrow, the title and what the
 * section holds, with the page's own actions to the side and a rule under it
 * all. A page spreads its meta in, so adding a section is a constant rather
 * than another copy of this markup.
 */
function PageHero({
  eyebrow,
  count,
  title,
  icon,
  description,
  actions,
  className,
  ...props
}: React.ComponentProps<"header"> &
  PageMeta & {
    /**
     * How many of what the eyebrow names the page shows. Left off by a page
     * with nothing to count, and the eyebrow is then the word alone.
     */
    count?: number
    actions?: React.ReactNode
  }) {
  return (
    <header
      data-slot="page-hero"
      className={cn("flex flex-col gap-10", className)}
      {...props}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-code-sm text-muted-foreground tabular-nums">
            {count === undefined
              ? eyebrow
              : `${String(count).padStart(2, "0")} ${eyebrow}`}
          </p>
          <h1 className="flex items-center gap-2 text-h1">
            <HugeiconsIcon
              aria-hidden
              icon={icon}
              className="shrink-0 text-foreground/80"
            />
            {title}
          </h1>
          <p className="max-w-prose text-body-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {actions ? (
          <div data-slot="page-hero-actions" className="flex shrink-0 gap-2">
            {actions}
          </div>
        ) : null}
      </div>
      <hr className="border-border" />
    </header>
  )
}

export { PageHero }
export type { PageMeta }
