"use client"

import * as React from "react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/aiellie/ui/hover-card"
import { cn } from "@/lib/utils"

type NavBarsItem = {
  id: string
  label: string
  /** A line or two under the label, in the `peek` card. */
  description?: string
}

type NavBarsVariant = "list" | "peek" | "expand"

type NavBarsSide = "inline-start" | "inline-end"

const bar =
  "h-0.5 w-3 shrink-0 rounded-full bg-muted-foreground/35 transition-colors duration-150 motion-reduce:transition-none"

const HOVER_DELAY = 150

function NavBarsTick({
  item,
  active,
  onSelect,
  onClick,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "onSelect"> & {
  item: NavBarsItem
  active: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      {...props}
      data-slot="nav-bars-tick"
      aria-label={item.label}
      aria-current={active ? "location" : undefined}
      data-active={active || undefined}
      onClick={(event) => {
        onClick?.(event)
        onSelect(item.id)
      }}
      className={cn(
        "group/tick flex h-2.5 w-7 items-center rounded-xs border border-transparent px-1 outline-none focus-visible:border-ring",
        className
      )}
    >
      <span
        className={cn(
          bar,
          "group-hover/tick:bg-foreground/70 group-data-active/tick:bg-foreground"
        )}
      />
    </button>
  )
}

function NavBarsRow({
  item,
  active,
  onSelect,
  className,
  children,
}: {
  item: NavBarsItem
  active: boolean
  onSelect: (id: string) => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      data-slot="nav-bars-row"
      aria-current={active ? "location" : undefined}
      data-active={active || undefined}
      onClick={() => onSelect(item.id)}
      className={cn(
        "group/row flex h-7 w-full shrink-0 items-center gap-2 rounded-md border border-transparent px-2 text-start text-xs outline-none hover:bg-accent focus-visible:border-ring",
        className
      )}
    >
      {children}
    </button>
  )
}

function NavBars({
  items,
  active = [],
  onSelect,
  variant = "list",
  side = "inline-end",
  className,
  ...props
}: Omit<React.ComponentProps<"nav">, "children" | "onSelect"> & {
  items: NavBarsItem[]
  /** The ids of the items currently in view. */
  active?: string[]
  onSelect: (id: string) => void
  variant?: NavBarsVariant
  /** Which way the card opens, or the rail grows. */
  side?: NavBarsSide
}) {
  const isActive = (id: string) => active.includes(id)
  const nav = {
    "data-slot": "nav-bars",
    "data-variant": variant,
    "aria-label": props["aria-label"] ?? "On this page",
    ...props,
  }

  if (variant === "expand") {
    // The nav keeps the rail's width, so the panel grows over what's beside it
    // instead of pushing it along.
    return (
      <nav
        {...nav}
        className={cn(
          "relative flex w-9 shrink-0 flex-col",
          side === "inline-start" && "items-end",
          className
        )}
      >
        <div
          className={cn(
            "group/rail z-10 flex w-9 flex-col overflow-hidden rounded-xl border border-transparent p-1",
            "transition-[width,background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            "hover:w-64 hover:border-border/40 hover:bg-background/60 hover:shadow-md hover:backdrop-blur-xs dark:hover:bg-background/70",
            "has-[:focus-visible]:w-64 has-[:focus-visible]:border-border/40 has-[:focus-visible]:bg-background/60 has-[:focus-visible]:shadow-md has-[:focus-visible]:backdrop-blur-xs dark:has-[:focus-visible]:bg-background/70"
          )}
        >
          {items.map((item) => (
            <NavBarsRow
              key={item.id}
              item={item}
              active={isActive(item.id)}
              onSelect={onSelect}
              className="h-6 w-62 gap-3 px-1.5"
            >
              <span
                className={cn(
                  bar,
                  "group-hover/row:bg-foreground/70 group-data-active/row:bg-foreground"
                )}
              />
              <span className="truncate opacity-0 transition-opacity duration-150 group-hover/rail:opacity-100 group-has-[:focus-visible]/rail:opacity-100 motion-reduce:transition-none">
                {item.label}
              </span>
            </NavBarsRow>
          ))}
        </div>
      </nav>
    )
  }

  if (variant === "peek") {
    // One card for every tick: it moves to whichever tick is hovered and
    // shows that item, rather than each tick opening and closing its own.
    return (
      <HoverCard>
        {({ payload }) => {
          const item = payload as NavBarsItem | undefined
          return (
            <>
              <nav {...nav} className={cn("flex flex-col gap-0.5", className)}>
                {items.map((entry) => (
                  <HoverCardTrigger
                    key={entry.id}
                    payload={entry}
                    delay={HOVER_DELAY}
                    render={
                      <NavBarsTick
                        item={entry}
                        active={isActive(entry.id)}
                        onSelect={onSelect}
                      />
                    }
                  />
                ))}
              </nav>
              <HoverCardContent
                side={side}
                sideOffset={4}
                className="flex w-64 flex-col gap-1"
              >
                {item ? (
                  <>
                    <span className="line-clamp-2 text-sm">{item.label}</span>
                    {item.description ? (
                      <span className="line-clamp-3 text-xs">
                        {item.description}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </HoverCardContent>
            </>
          )
        }}
      </HoverCard>
    )
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={HOVER_DELAY}
        render={
          <nav {...nav} className={cn("flex flex-col gap-0.5", className)} />
        }
      >
        {items.map((item) => (
          <NavBarsTick
            key={item.id}
            item={item}
            active={isActive(item.id)}
            onSelect={onSelect}
          />
        ))}
      </HoverCardTrigger>
      <HoverCardContent side={side} sideOffset={4} className="w-64 p-1">
        <div className="flex max-h-72 flex-col overflow-y-auto">
          {items.map((item) => (
            <NavBarsRow
              key={item.id}
              item={item}
              active={isActive(item.id)}
              onSelect={onSelect}
            >
              <span className="size-1 shrink-0 rounded-full bg-transparent group-data-active/row:bg-foreground" />
              <span className="truncate">{item.label}</span>
            </NavBarsRow>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

// For a page: the ids of the elements with these ids that are on screen, in
// the order given. `root` is the scroll container, or the window if left out.
function useNavBarsInView(
  ids: string[],
  root?: React.RefObject<Element | null>
) {
  const [inView, setInView] = React.useState<string[]>([])
  const key = ids.join("\n")

  React.useEffect(() => {
    const order = key ? key.split("\n") : []
    const seen = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.add(entry.target.id)
          else seen.delete(entry.target.id)
        }
        setInView(order.filter((id) => seen.has(id)))
      },
      { root: root?.current ?? null }
    )
    for (const id of order) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [key, root])

  return inView
}

export { NavBars, useNavBarsInView }
export type { NavBarsItem, NavBarsSide, NavBarsVariant }
