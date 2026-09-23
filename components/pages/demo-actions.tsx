"use client"

import Link from "next/link"
import {
  ArrowUpRightIcon,
  Copy01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/components/aiellie/menu"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

/**
 * Where an item is published. The command is written against the registry's
 * own URL rather than the `@aiellie` shorthand: the shorthand only resolves
 * once a project has the namespace in its `components.json`, and the whole
 * point of a copied command is that it runs in a project that has never heard
 * of this registry.
 */
const REGISTRY_URL = "https://elements.aiellie.dev/r"

/**
 * The managers a command can be written for. They run the same shadcn command
 * and differ only in how each fetches a binary it does not have, which is the
 * half nobody remembers.
 */
const INSTALLERS = [
  { id: "npm", name: "npm", exec: "npx" },
  { id: "pnpm", name: "pnpm", exec: "pnpm dlx" },
  { id: "yarn", name: "yarn", exec: "yarn dlx" },
  { id: "bun", name: "bun", exec: "bunx --bun" },
] as const

/**
 * The surfaces a demo can be set on. A component is only ever seen against
 * whatever the page happens to be, and the translucent ones — anything with a
 * blur or a shadow under it — do not show what they are until the surface
 * behind them moves, so the plate is worth being able to repaint while looking
 * at one.
 *
 * Written in tokens rather than fixed colours, so a surface chosen in one
 * theme is still that surface in the other. `plate` is what the card wears;
 * `swatch` is the dot that stands for it in the menu.
 */
const DEMO_BACKGROUNDS = [
  { id: "default", name: "Default", plate: "", swatch: "bg-background" },
  { id: "muted", name: "Muted", plate: "bg-muted", swatch: "bg-muted" },
  {
    id: "brand",
    name: "Brand",
    plate: "bg-[#eff6ff] dark:bg-[#526fff]/15",
    swatch: "bg-[#7a91ff]",
  },
  {
    id: "dots",
    name: "Dots",
    plate:
      "[background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:12px_12px]",
    swatch:
      "[background-image:radial-gradient(var(--color-border)_1.5px,transparent_1.5px)] [background-size:5px_5px]",
  },
] as const

type DemoBackground = (typeof DEMO_BACKGROUNDS)[number]["id"]

/**
 * Where the demo of `item` opens full screen. Kept here rather than beside the
 * list of demos, which imports every one of them and would drag the lot into
 * any card that only wanted the link.
 */
function demoHref(item: string) {
  return `/demo/${item}`
}

/** What the plate wears for `id`. Default paints nothing and keeps the page. */
function demoBackgroundClass(id: DemoBackground) {
  return DEMO_BACKGROUNDS.find((option) => option.id === id)?.plate ?? ""
}

/**
 * Puts `text` on the clipboard by whichever route the page is allowed.
 *
 * The async clipboard is the one to want, but it answers to a permission that
 * a non-secure or embedded page can simply be refused — and refused wholesale
 * rather than per press, so there is no asking again. Selecting a field and
 * calling `execCommand` is the older way: deprecated, still honoured, and
 * bound to the gesture rather than to a permission, which is exactly what is
 * left when the first route is shut.
 */
async function writeToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Refused, so take the older route rather than give up on the press.
  }

  const field = document.createElement("textarea")
  field.value = text
  field.setAttribute("readonly", "")
  // Off the screen rather than hidden: a selection needs a field that was
  // actually laid out, and `display: none` leaves nothing to select.
  field.style.position = "fixed"
  field.style.top = "-9999px"
  document.body.append(field)

  try {
    field.select()
    return document.execCommand("copy")
  } catch {
    return false
  } finally {
    field.remove()
  }
}

async function copyInstallCommand(command: string, manager: string) {
  if (await writeToClipboard(command)) {
    toast.add({
      title: "Copied",
      description: `The ${manager} command is on your clipboard.`,
      type: "success",
    })
  } else {
    // The command rides along in the toast so a press that could not reach the
    // clipboard still leaves something to take by hand.
    toast.add({ title: "Could not copy", description: command, type: "error" })
  }
}

/**
 * A demo card's own controls: the command that installs the item it is
 * showing, and the surface that item is drawn on.
 *
 * The background is controlled from outside because the card is the thing
 * wearing it — the menu only names the choice, and a copy kept in here as well
 * would be a second answer to what the card is already showing.
 */
function DemoActions({
  item,
  href,
  title,
  background,
  onBackgroundChange,
  className,
}: {
  /** The registry item to install, e.g. `model-selector`. */
  item: string
  /**
   * Where the example opens full screen. Left out on that page itself, which
   * has nowhere further to open to.
   */
  href?: string
  /** What the card is called, so the button says which card it belongs to. */
  title: string
  background: DemoBackground
  onBackgroundChange: (background: DemoBackground) => void
  className?: string
}) {
  const url = `${REGISTRY_URL}/${item}.json`

  return (
    <Menu>
      <MenuTrigger
        render={<Button variant="ghost" size="icon-xs" />}
        className={cn(
          // Out of the way until the card is under the pointer, as the arrow
          // it stands in for was. Focus and an open menu both pin it down: a
          // control that vanishes while it is being used is worse than one
          // that was always there.
          "text-muted-foreground opacity-0 transition-opacity",
          "group-hover/plate:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100",
          "motion-reduce:transition-none",
          className
        )}
      >
        <HugeiconsIcon aria-hidden icon={MoreHorizontalIcon} strokeWidth={2} />
        {/* Real text rather than an `aria-label`, so it translates with the
            page — and it names the card, since a grid of these otherwise
            offers a screen reader several identically named buttons. */}
        <span className="sr-only">{title} actions</span>
      </MenuTrigger>

      <MenuContent align="end" className="min-w-44">
        {/* The managers sit one level down because only one of them is ever
            wanted, and the row above already says what is being copied. */}
        <MenuSub>
          <MenuSubTrigger>
            <HugeiconsIcon aria-hidden icon={Copy01Icon} />
            Copy install command
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuGroup>
              <MenuGroupLabel>Package manager</MenuGroupLabel>
              {INSTALLERS.map((installer) => (
                <MenuItem
                  key={installer.id}
                  onClick={() =>
                    copyInstallCommand(
                      `${installer.exec} shadcn@latest add ${url}`,
                      installer.name
                    )
                  }
                >
                  {installer.name}
                </MenuItem>
              ))}
            </MenuGroup>
          </MenuSubContent>
        </MenuSub>

        <MenuSeparator />

        {/* Radio rows rather than another submenu: repainting the plate is
            done while looking at the result, and these keep the menu open, so
            the next surface is one press away rather than four. */}
        <MenuGroup>
          <MenuGroupLabel>Background</MenuGroupLabel>
          <MenuRadioGroup
            value={background}
            onValueChange={(value) =>
              onBackgroundChange(value as DemoBackground)
            }
          >
            {DEMO_BACKGROUNDS.map((option) => (
              <MenuRadioItem key={option.id} value={option.id}>
                {/* Bordered so Default, which is the page's own colour, is
                    still a dot rather than a gap. */}
                <span
                  aria-hidden
                  className={cn(
                    "size-3.5 shrink-0 rounded-[5px] border border-border/60",
                    option.swatch
                  )}
                />
                {option.name}
              </MenuRadioItem>
            ))}
          </MenuRadioGroup>
        </MenuGroup>

        {href ? (
          <>
            <MenuSeparator />

            {/* The card's title is still the link; this is the affordance the
                arrow used to carry, kept where the arrow was. Rendered as a
                real anchor through Next's link, so modified clicks open a tab
                and a plain one does not reload the page. */}
            <MenuLinkItem render={<Link href={href} />} closeOnClick>
              <HugeiconsIcon aria-hidden icon={ArrowUpRightIcon} />
              Open example
            </MenuLinkItem>
          </>
        ) : null}
      </MenuContent>
    </Menu>
  )
}

export {
  DemoActions,
  DEMO_BACKGROUNDS,
  demoBackgroundClass,
  demoHref,
  writeToClipboard,
}
export type { DemoBackground }
