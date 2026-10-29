"use client"

import Link from "next/link"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { docsItem, docsNav, padIndex, type Gallery } from "@/lib/docs"
import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuLinkItem,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import { Button } from "@/registry/aiellie/ui/button"

function Step({
  gallery,
  name,
  title,
  direction,
}: {
  gallery: Gallery
  name?: string
  title?: string
  direction: "previous" | "next"
}) {
  const icon = (
    <HugeiconsIcon
      aria-hidden
      icon={direction === "previous" ? ArrowLeft01Icon : ArrowRight01Icon}
      className="rtl:-scale-x-100"
    />
  )

  if (!name) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        disabled
        aria-hidden
        className="text-muted-foreground"
      >
        {icon}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      nativeButton={false}
      render={<Link href={`/${gallery}/${name}`} />}
      aria-label={`${direction === "previous" ? "Previous" : "Next"}: ${title}`}
      className="text-muted-foreground"
    >
      {icon}
    </Button>
  )
}

function ComponentPager({
  gallery,
  name,
  className,
}: {
  gallery: Gallery
  name: string
  className?: string
}) {
  const nav = docsNav(gallery)
  const item = docsItem(gallery, name)
  if (!item) return null

  const previous = nav.items[item.index - 2]
  const next = nav.items[item.index]

  return (
    <nav
      aria-label="Browse components"
      className={cn("flex shrink-0 items-center gap-0.5", className)}
    >
      <Step
        gallery={gallery}
        name={previous?.name}
        title={previous?.title}
        direction="previous"
      />
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              aria-label="Jump to a component"
              className="px-1.5 text-code-sm font-mono text-muted-foreground tabular-nums"
            />
          }
        >
          {padIndex(item.index)}
          <span aria-hidden className="px-0.5 text-muted-foreground/50">
            /
          </span>
          {nav.items.length}
        </MenuTrigger>
        <MenuContent
          align="end"
          showSearch
          searchPlaceholder="Filter components"
          className="max-h-80 w-64"
        >
          {nav.sections.map((section) => (
            <MenuGroup key={section.title}>
              <MenuGroupLabel>{section.title}</MenuGroupLabel>
              {section.items.map((entry) => (
                <MenuLinkItem
                  key={entry.name}
                  closeOnClick
                  aria-current={entry.name === name ? "page" : undefined}
                  render={<Link href={`/${gallery}/${entry.name}`} />}
                  className="aria-[current=page]:text-foreground"
                >
                  {entry.title}
                </MenuLinkItem>
              ))}
            </MenuGroup>
          ))}
        </MenuContent>
      </Menu>
      <Step
        gallery={gallery}
        name={next?.name}
        title={next?.title}
        direction="next"
      />
    </nav>
  )
}

export { ComponentPager }
