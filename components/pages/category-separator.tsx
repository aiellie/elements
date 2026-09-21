import { Children, type ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"

import { CATEGORIES, type Category } from "@/lib/categories"
import { cn } from "@/lib/utils"

/**
 * The heading a category's demo cards sit under: its mark and name, a rule
 * running to the edge so the break reads across the page, and how many cards
 * follow.
 */
export function CategorySeparator({
  category,
  count,
  className,
}: {
  category: Category
  /** How many cards the category holds on this page. */
  count: number
  className?: string
}) {
  const { name, icon } = CATEGORIES[category]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <HugeiconsIcon
        aria-hidden
        icon={icon}
        strokeWidth={1.75}
        className="size-3.5 shrink-0 text-muted-foreground"
      />
      <h2 className="text-overline">{name}</h2>
      <span aria-hidden className="h-px flex-1 bg-border" />
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
        {String(count).padStart(2, "0")}
      </span>
    </div>
  )
}

/**
 * One category's run of cards: its separator, then the cards in the gallery
 * grid. The count is read off the cards themselves rather than written down
 * beside them, so adding a card can't leave the number behind.
 */
export function CategorySection({
  category,
  children,
}: {
  category: Category
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-10">
      <CategorySeparator
        category={category}
        count={Children.toArray(children).length}
      />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  )
}
