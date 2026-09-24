"use client"

import { useSyncExternalStore, type ReactElement } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuLinkItem,
  MenuTrigger,
} from "@/components/aiellie/menu"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/** Matches Tailwind `sm` — below this the nav labels hide and only glyphs remain. */
const ICON_NAV_QUERY = "(width < 40rem)"

function subscribeIconNav(onStoreChange: () => void) {
  const media = window.matchMedia(ICON_NAV_QUERY)
  media.addEventListener("change", onStoreChange)
  return () => media.removeEventListener("change", onStoreChange)
}

function getIconNavSnapshot() {
  return window.matchMedia(ICON_NAV_QUERY).matches
}

function useIconOnlyNav() {
  return useSyncExternalStore(subscribeIconNav, getIconNavSnapshot, () => false)
}

/**
 * The label is the tooltip, but only while the button is a glyph — once `sm`
 * grows the text back in, a tooltip of the same word is just a second name.
 */
function NavTooltip({
  label,
  children,
}: {
  label: string
  children: ReactElement
}) {
  const iconOnly = useIconOnlyNav()

  return (
    <Tooltip disabled={!iconOnly}>
      <TooltipTrigger render={children} />
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}

interface NavPage {
  href: string
  label: string
  icon: IconSvgElement
}

/** The shared small ghost button treatment, plus the current-route state. */
const navButton = cn(
  buttonVariants({ variant: "ghost", size: "sm" }),
  "data-[active=true]:bg-muted data-[active=true]:text-foreground",
  "data-[active=true]:[&_svg]:text-foreground",
  "data-[active=true]:hover:bg-muted data-[active=true]:hover:text-foreground",
  "dark:data-[active=true]:hover:bg-muted"
)

/**
 * Whether `href` is the section on screen. "/" would prefix-match every route,
 * so only it is exact; the rest match their own section too, keeping a button
 * lit on a detail page like /elements/message.
 */
function isCurrent(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * One destination in the site nav, lit while its section is the one on screen.
 *
 * The button reads the pathname itself rather than being told whether it is
 * selected, so a nav is just its list of pages. Pass `active` to override that
 * — for a nav whose selection isn't the route.
 */
function NavButton({
  href,
  label,
  active,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href" | "children"> &
  Omit<NavPage, "icon"> & { active?: boolean }) {
  const pathname = usePathname()
  const selected = active ?? isCurrent(pathname, href)

  return (
    <Link
      href={href}
      data-slot="nav-button"
      data-active={selected}
      aria-current={selected ? "page" : undefined}
      className={cn(navButton, className)}
      {...props}
    >
      <span>{label}</span>
    </Link>
  )
}

/**
 * The section links beside the logo. Below `sm` a row of them doesn't fit, so
 * they fold into one menu instead of collapsing to glyphs with tooltips.
 */
function SiteNav({ pages }: { pages: NavPage[] }) {
  const pathname = usePathname()
  const selected = pages.some((page) => isCurrent(pathname, page.href))

  return (
    <>
      <nav aria-label="Site" className="hidden items-center gap-0.5 sm:flex">
        {pages.map((page) => (
          <NavButton key={page.href} href={page.href} label={page.label} />
        ))}
      </nav>
      <div className="sm:hidden">
        <Menu>
          <MenuTrigger data-active={selected} className={navButton}>
            <HugeiconsIcon
              aria-hidden
              icon={Menu01Icon}
              strokeWidth={1.75}
              className="size-3.5"
            />
            <span className="sr-only">Site</span>
          </MenuTrigger>
          <MenuContent aria-label="Site">
            {pages.map((item) => {
              const current = isCurrent(pathname, item.href)

              return (
                <MenuLinkItem
                  key={item.href}
                  closeOnClick
                  render={<Link href={item.href} />}
                  data-active={current}
                  aria-current={current ? "page" : undefined}
                  className="data-[active=true]:text-foreground data-[active=true]:data-highlighted:text-foreground"
                >
                  <HugeiconsIcon icon={item.icon} className="size-3.5" />
                  {item.label}
                </MenuLinkItem>
              )
            })}
          </MenuContent>
        </Menu>
      </div>
    </>
  )
}

/**
 * A nav item that holds a group of pages rather than being one: the same button,
 * with a chevron and a menu of destinations under it.
 *
 * It lights up for any page it contains, so the section stays marked while you
 * are inside it and the menu doesn't have to be open to say where you are.
 */
function NavMenu({
  label,
  icon,
  items,
  className,
  ...props
}: Omit<React.ComponentProps<typeof MenuTrigger>, "children"> & {
  label: string
  icon: IconSvgElement
  items: NavPage[]
}) {
  const pathname = usePathname()
  const selected = items.some((item) => isCurrent(pathname, item.href))

  return (
    <Menu>
      <NavTooltip label={label}>
        <MenuTrigger
          data-active={selected}
          className={cn(navButton, "group/nav-menu", className)}
          {...props}
        >
          <HugeiconsIcon icon={icon} strokeWidth={2} className="size-3.5" />
          <span className="sr-only sm:not-sr-only">{label}</span>
        </MenuTrigger>
      </NavTooltip>
      <MenuContent aria-label={label}>
        {items.map((item) => {
          const current = isCurrent(pathname, item.href)

          return (
            <MenuLinkItem
              key={item.href}
              // The rows navigate client-side, so nothing unmounts the menu on
              // its own — Base UI leaves a link item open by default because it
              // assumes the page is about to go away.
              closeOnClick
              render={<Link href={item.href} />}
              data-active={current}
              aria-current={current ? "page" : undefined}
              className={cn(
                "data-[active=true]:text-accent",
                "data-[active=true]:data-highlighted:text-accent"
              )}
            >
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className="size-3.5"
              />
              {item.label}
            </MenuLinkItem>
          )
        })}
      </MenuContent>
    </Menu>
  )
}

export { NavButton, NavMenu, SiteNav, navButton, isCurrent }
export type { NavPage }
