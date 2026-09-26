"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowDown01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import type { DocsSection } from "@/lib/docs"
import { ITEM_ICONS } from "@/lib/item-icons"
import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuLinkItem,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"

const docsLink =
  "flex h-7.5 min-w-0 items-center gap-2 rounded-lg border border-transparent px-2 text-sm text-muted-foreground transition-colors duration-80 outline-none hover:bg-accent hover:text-foreground focus-visible:border-ring aria-[current=page]:bg-accent aria-[current=page]:text-foreground motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0"

function DocsLink({
  href,
  icon,
  current,
  children,
}: {
  href: string
  icon?: IconSvgElement
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
      className={docsLink}
    >
      {icon ? <HugeiconsIcon aria-hidden icon={icon} /> : null}
      <span className="truncate">{children}</span>
    </Link>
  )
}

function DocsSidebar({ sections }: { sections: DocsSection[] }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Docs" className="flex flex-col gap-6">
      <DocsLink
        href="/docs"
        icon={BookOpen01Icon}
        current={pathname === "/docs"}
      >
        Introduction
      </DocsLink>
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col">
          <p className="flex h-8 items-center px-2 text-xs font-medium text-muted-foreground">
            {section.title}
          </p>
          <ul className="flex flex-col gap-px">
            {section.items.map((item) => {
              const href = `/docs/${item.name}`
              return (
                <li key={item.name}>
                  <DocsLink
                    href={href}
                    icon={ITEM_ICONS[item.name]}
                    current={pathname === href}
                  >
                    {item.title}
                  </DocsLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

// On a narrow screen the list folds into a menu that can be searched.
function DocsMenu({
  sections,
  className,
}: {
  sections: DocsSection[]
  className?: string
}) {
  const pathname = usePathname()
  const current = sections
    .flatMap((section) => section.items)
    .find((item) => pathname === `/docs/${item.name}`)

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="outline"
            className={cn("w-full justify-between", className)}
          />
        }
      >
        {current?.title ?? "Introduction"}
        <HugeiconsIcon
          aria-hidden
          icon={ArrowDown01Icon}
          className="text-muted-foreground"
        />
      </MenuTrigger>
      <MenuContent
        showSearch
        searchPlaceholder="Search docs"
        className="max-h-96 w-(--anchor-width)"
      >
        {/* The menu lives in the layout, which stays mounted from page to
            page, so it has to close itself. */}
        <MenuLinkItem closeOnClick render={<Link href="/docs" />}>
          <HugeiconsIcon aria-hidden icon={BookOpen01Icon} />
          Introduction
        </MenuLinkItem>
        {sections.map((section) => (
          <MenuGroup key={section.title}>
            <MenuGroupLabel>{section.title}</MenuGroupLabel>
            {section.items.map((item) => (
              <MenuLinkItem
                key={item.name}
                closeOnClick
                render={<Link href={`/docs/${item.name}`} />}
              >
                {ITEM_ICONS[item.name] ? (
                  <HugeiconsIcon aria-hidden icon={ITEM_ICONS[item.name]} />
                ) : null}
                {item.title}
              </MenuLinkItem>
            ))}
          </MenuGroup>
        ))}
      </MenuContent>
    </Menu>
  )
}

export { DocsMenu, DocsSidebar }
