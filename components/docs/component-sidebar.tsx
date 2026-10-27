"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { FilterInput } from "@/components/docs/filter-input"
import { DOCS_ITEMS, DOCS_SECTIONS, type DocsSection } from "@/lib/docs"

const componentLink =
  "flex h-7.5 min-w-0 items-center rounded-lg border border-transparent px-2 text-sm text-muted-foreground transition-colors duration-80 outline-none hover:bg-accent hover:text-foreground focus-visible:border-ring aria-[current=page]:bg-accent aria-[current=page]:text-foreground motion-reduce:transition-none"

function filterSections(query: string): DocsSection[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return DOCS_SECTIONS
  return DOCS_SECTIONS.map((section) => ({
    title: section.title,
    items: section.items.filter((item) =>
      `${item.title} ${item.name}`.toLowerCase().includes(normalized)
    ),
  })).filter((section) => section.items.length > 0)
}

function ComponentLink({
  href,
  current,
  children,
}: {
  href: string
  current: boolean
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLAnchorElement>(null)

  // A page opened from a link lands with its row in view, however far down
  // the list it is.
  React.useEffect(() => {
    if (current) ref.current?.scrollIntoView({ block: "nearest" })
  }, [current])

  return (
    <Link
      ref={ref}
      href={href}
      aria-current={current ? "page" : undefined}
      className={componentLink}
    >
      <span className="truncate">{children}</span>
    </Link>
  )
}

function ComponentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const sections = filterSections(query)
  const matches = sections.reduce((n, section) => n + section.items.length, 0)

  return (
    <aside className="hidden lg:block">
      {/* Pulled up under the header and padded back down, so the list scrolls
          beneath it rather than stopping short of it. */}
      <div className="sticky top-12 -mt-20 max-h-[calc(100svh-3rem)] w-52 [scrollbar-width:none] overflow-y-auto overscroll-contain bg-background pt-20 pb-8 [&::-webkit-scrollbar]:hidden">
        <Link
          href="/components"
          className="flex items-baseline justify-between px-2 text-sm text-muted-foreground transition-colors duration-80 hover:text-foreground motion-reduce:transition-none"
        >
          Components
          <span className="text-code-sm font-mono tabular-nums">
            {query.trim()
              ? `${matches} / ${DOCS_ITEMS.length}`
              : DOCS_ITEMS.length}
          </span>
        </Link>
        <FilterInput
          value={query}
          onValueChange={setQuery}
          onEnter={() => {
            const first = sections[0]?.items[0]
            if (first) router.push(`/components/${first.name}`)
          }}
          placeholder="Filter"
          aria-label="Filter components"
          className="mt-3"
        />
        {sections.length === 0 ? (
          <p className="mt-4 px-2 text-caption text-muted-foreground">
            Nothing matches.
          </p>
        ) : null}
        <nav aria-label="Components" className="mt-5 flex flex-col gap-5">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <p className="px-2 text-caption font-medium text-muted-foreground">
                {section.title}
              </p>
              <ul className="flex flex-col gap-px">
                {section.items.map((item) => {
                  const href = `/components/${item.name}`
                  return (
                    <li key={item.name}>
                      <ComponentLink href={href} current={pathname === href}>
                        {item.title}
                      </ComponentLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export { ComponentSidebar }
