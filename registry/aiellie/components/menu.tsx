"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import {
  ArrowRight01Icon,
  Cancel01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"

/**
 * Base UI's menu with this registry's surface on it — the popup, the rows and
 * the rules — so anything that needs a menu is styling none of it again.
 *
 * The trigger is deliberately left alone: a menu hangs off whatever opens it,
 * and every one of those already has a shape of its own. Pass `render` to make
 * an existing control the trigger rather than nesting a button inside one.
 */
function Menu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menu" {...props} />
}

function MenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />
}

/**
 * Glass is the default because a menu is a thing floating over the page rather
 * than part of it: the blur is what says so, and the fill stays translucent
 * enough for there to be something to blur. `variant="solid"` is for the times
 * the backdrop is busy enough that a blurred one is worse than no blur at all.
 */
const menuPopup = (variant: "glass" | "solid") =>
  cn(
    "border border-border/40 bg-background/60 dark:bg-background/70",
    "min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-xl p-1 shadow-xl transition-[opacity,scale] duration-150 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none data-closed:scale-95 data-closed:opacity-0",
    // The positioner publishes the room left between the popup and the edge of
    // the window; without a height to overflow, `overflow-y-auto` above does
    // nothing and a long menu simply runs off the bottom of the screen with
    // its last rows unreachable. Set here rather than on `MenuContent` so the
    // submenus, which render through it, are capped as well.
    "max-h-(--available-height)",
    variant === "glass" &&
      // The border lightens with the fill — a solid edge around a soft panel
      // reads as a card with a blurry picture in it.
      "border-border/40 bg-background/60 backdrop-blur-xs dark:bg-background/70"
  )

type PositionerProps = Pick<
  MenuPrimitive.Positioner.Props,
  "align" | "alignOffset" | "side" | "sideOffset" | "collisionPadding"
>

/**
 * The box `showSearch` puts above the rows.
 *
 * The keystrokes are held back from the menu deliberately. Base UI gives every
 * menu typeahead — letters jump the highlight to the row that starts with them
 * — and it has no off switch, so without this the letters never reach the box
 * and the focus leaves it on the first one typed. Escape and the arrows are let
 * through on purpose: closing the menu and walking the rows are still the
 * menu's job while the caret is in here.
 */
function MenuSearch({
  value,
  onValueChange,
  placeholder = "Search",
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div
      data-slot="menu-search"
      className="-mx-1 -mt-1 mb-1 flex shrink-0 items-center gap-2 border-b border-border/60 py-1.5 ps-3 pe-1.5"
    >
      <HugeiconsIcon
        aria-hidden
        icon={Search01Icon}
        strokeWidth={1.5}
        className="size-3.5 shrink-0 text-muted-foreground/70"
      />
      <input
        ref={inputRef}
        type="text"
        autoFocus
        autoComplete="off"
        spellCheck={false}
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          // The keys the menu owns pass through: the arrows move the
          // highlight, Escape shuts it, Enter takes the highlighted row. Only
          // the printable ones are held back, and only because typeahead would
          // otherwise read them as an attempt to jump to a row.
          const navigational =
            event.key.length > 1 || event.metaKey || event.ctrlKey
          if (!navigational) event.stopPropagation()
        }}
        className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/70"
      />

      {/* Disabled rather than hidden while the field is empty: a control that
          comes and goes shifts the field's end as you type, and the first
          character would move the thing you were about to aim at. */}
      <button
        type="button"
        data-slot="menu-search-clear"
        aria-label="Clear search"
        disabled={!value}
        onClick={(event) => {
          // The menu closes on a press that reaches it, and this one is about
          // the field rather than about choosing anything.
          event.stopPropagation()
          onValueChange("")
          inputRef.current?.focus()
        }}
        className="flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground/70 transition-colors outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-1 focus-visible:ring-foreground/5 disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none dark:hover:bg-foreground/[0.09]"
      >
        <HugeiconsIcon
          aria-hidden
          icon={Cancel01Icon}
          strokeWidth={1.5}
          className="size-3"
        />
      </button>
    </div>
  )
}

function MenuContent({
  className,
  variant = "glass",
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  collisionPadding = 8,
  showSearch = false,
  searchPlaceholder,
  emptyMessage = "No matches",
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  PositionerProps & {
    variant?: "glass" | "solid"
    showSearch?: boolean
    searchPlaceholder?: string
    emptyMessage?: string
  }) {
  const [query, setQuery] = React.useState("")

  const rows = showSearch ? filterRows(children, query) : children
  const empty = showSearch && query !== "" && React.Children.count(rows) === 0

  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className="isolate z-50"
      >
        <MenuPrimitive.Popup
          data-slot="menu-content"
          data-variant={variant}
          className={cn(
            menuPopup(variant),
            // With a search box the popup stops being the scrolling element:
            // the rows scroll under a box that stays put. `overflow-y-hidden`
            // is what takes the scroll off the popup, since the base sets
            // `overflow-y-auto` and the two are the same property.
            showSearch && "flex flex-col overflow-y-hidden",
            className
          )}
          {...props}
        >
          {showSearch ? (
            <>
              <MenuSearch
                value={query}
                onValueChange={setQuery}
                placeholder={searchPlaceholder}
              />
              {/* `-mx-1 px-1` reinstates the popup's own gutter inside the scroller,
                  because the separators bleed into it with a matching `-mx-1`.
                  Without it they hang 4px past this box and, since a scroller
                  cannot be scrollable on one axis alone, that shows up as a
                  horizontal scrollbar. */}
              <div className="-mx-1 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-1">
                {empty ? (
                  <div className="px-2 py-1.5 text-xs text-muted-foreground/70">
                    {emptyMessage}
                  </div>
                ) : (
                  rows
                )}
              </div>
            </>
          ) : (
            children
          )}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

/**
 * One row, and the shape every other kind of row borrows. The icon sizing rule
 * is here rather than on each item so a menu can be written as an icon and a
 * word without either being wrapped in anything.
 */
const menuItem = cn(
  "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors outline-none select-none",
  "data-highlighted:bg-foreground/[0.06] data-highlighted:text-foreground dark:data-highlighted:bg-foreground/[0.09]",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg:not([class*='size-'])]:size-4",
  "[&_svg:not([class*='stroke-width-'])]:stroke-width-1.5",
  "motion-reduce:transition-none"
)

function MenuItem({
  className,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & { variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.Item
      data-slot="menu-item"
      data-variant={variant}
      className={cn(
        menuItem,
        variant === "destructive" &&
          cn(
            // The dark tint is the heavier one, as it is on the bubble and the
            // button: the same alpha that reads as a warning over a light
            // surface barely registers over a dark one, and over glass there
            // is a translucent popup fill in the way of it as well.
            "text-destructive data-highlighted:bg-destructive/5 data-highlighted:text-destructive dark:data-highlighted:bg-destructive/15",
            // The shortcut is named separately because it sets a muted color
            // of its own, so without this the row goes red around a grey
            // keystroke. Highlighted only — at rest it stays quiet, as the
            // shortcut does on every other row.
            "data-highlighted:**:data-[slot=menu-shortcut]:text-destructive"
          ),
        className
      )}
      {...props}
    />
  )
}

/** The same row as a real link, so modified clicks keep working. */
function MenuLinkItem({ className, ...props }: MenuPrimitive.LinkItem.Props) {
  return (
    <MenuPrimitive.LinkItem
      data-slot="menu-link-item"
      className={cn(menuItem, className)}
      {...props}
    />
  )
}

/** The mark a chosen row carries. */
function MenuIndicatorMark({ className }: { className?: string }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={Tick02Icon}
      strokeWidth={2}
      className={cn("size-3.5", className)}
    />
  )
}

/**
 * A row that keeps its own state. The indicator sits at the end rather than the
 * start so a menu of them still reads as a list of words, and the space it
 * takes is held whether or not it is showing.
 */
function MenuCheckboxItem({
  className,
  children,
  ...props
}: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menu-checkbox-item"
      className={cn(menuItem, className)}
      {...props}
    >
      {children}
      <MenuPrimitive.CheckboxItemIndicator
        data-slot="menu-checkbox-item-indicator"
        keepMounted
        className="ms-auto ps-2 opacity-0 data-checked:opacity-100"
      >
        <MenuIndicatorMark />
      </MenuPrimitive.CheckboxItemIndicator>
    </MenuPrimitive.CheckboxItem>
  )
}

function MenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />
}

function MenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="menu-radio-item"
      className={cn(menuItem, className)}
      {...props}
    >
      {children}
      <MenuPrimitive.RadioItemIndicator
        data-slot="menu-radio-item-indicator"
        keepMounted
        className="ms-auto ps-2 opacity-0 data-checked:opacity-100"
      >
        <MenuIndicatorMark />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  )
}

function MenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />
}

function MenuGroupLabel({
  className,
  ...props
}: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menu-group-label"
      className={cn(
        "px-2 py-1.5 text-[11px] font-medium text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}

function MenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/** The keystroke a row also answers to, set at the end of it. */
function MenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menu-shortcut"
      className={cn(
        "ms-auto ps-3 text-[11px] tracking-wide text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}

function MenuSub(props: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menu-sub" {...props} />
}

/**
 * A row that opens another menu. Its chevron is logical rather than
 * left-to-right: in an RTL layout the submenu opens the other way, and an
 * arrow pointing the wrong way is worse than none.
 */
function MenuSubTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menu-sub-trigger"
      className={cn(
        menuItem,
        "data-popup-open:bg-foreground/[0.06] data-popup-open:text-foreground dark:data-popup-open:bg-foreground/[0.09]",
        className
      )}
      {...props}
    >
      {children}
      <HugeiconsIcon
        aria-hidden
        icon={ArrowRight01Icon}
        strokeWidth={2}
        className="ms-auto size-3.5 rtl:-scale-x-100"
      />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function MenuSubContent({
  side = "inline-end",
  align = "start",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  return (
    <MenuContent
      data-slot="menu-sub-content"
      side={side}
      align={align}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

/**
 * What a row is called, for matching. The keystroke is left out on purpose: a
 * menu searched for "s" should not answer with every row that has ⌘S on it.
 */
function labelOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(labelOf).join(" ")
  if (React.isValidElement(node)) {
    if (node.type === MenuShortcut) return ""
    return labelOf((node.props as { children?: React.ReactNode }).children)
  }
  return ""
}

/**
 * The rows that answer to `query`, with the structure around them kept honest.
 * A group whose rows all went is dropped along with its label, and separators
 * go entirely — they mark the divisions of the whole menu, and a filtered menu
 * is a different list whose old divisions no longer describe it.
 *
 * A submenu is matched on its own trigger's label rather than on what is inside
 * it. Searching into one would mean flattening the tree and answering with rows
 * that are not where the search says they are.
 */
function filterRows(children: React.ReactNode, query: string): React.ReactNode {
  const needle = query.trim().toLowerCase()
  if (needle === "") return children

  const matches = (node: React.ReactNode) =>
    labelOf(node).toLowerCase().includes(needle)

  const walk = (nodes: React.ReactNode): React.ReactNode[] =>
    React.Children.toArray(nodes).flatMap((child) => {
      if (!React.isValidElement(child)) return []

      const element = child as React.ReactElement<{
        children?: React.ReactNode
      }>
      const kids = element.props.children

      if (element.type === MenuSeparator) return []

      if (element.type === MenuGroup || element.type === MenuRadioGroup) {
        const kept = walk(kids)
        const hasRow = kept.some(
          (node) => React.isValidElement(node) && node.type !== MenuGroupLabel
        )
        return hasRow ? [React.cloneElement(element, {}, kept)] : []
      }

      // Kept unconditionally: the group above decides whether it survives.
      if (element.type === MenuGroupLabel) return [element]

      if (element.type === MenuSub) {
        const trigger = React.Children.toArray(kids).find(
          (node) => React.isValidElement(node) && node.type === MenuSubTrigger
        ) as React.ReactElement<{ children?: React.ReactNode }> | undefined
        return trigger && matches(trigger.props.children) ? [element] : []
      }

      if (
        element.type === MenuItem ||
        element.type === MenuCheckboxItem ||
        element.type === MenuRadioItem ||
        element.type === MenuLinkItem
      ) {
        return matches(kids) ? [element] : []
      }

      return [element]
    })

  return walk(children)
}

export {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
  menuItem,
  menuPopup,
}
