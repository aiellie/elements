---
name: design
description: The aiellie design system — color and status tokens, glass surfaces, elevation, type scale and weights, radius, spacing and density, focus, z-layers, motion, and icon rules. Use before building, restyling or reviewing any UI in this repo, including porting a shadcn component into the registry.
---

# aiellie — design system

The single source of truth for how this registry looks and behaves.

Values live in `globals.css`; this file says what they mean and when to reach for them. If the two disagree, `globals.css` is the value and this file is the intent — fix whichever is wrong.

---

A component registry and pattern library for AI-native and agentic UI. Near-monochrome, restrained, built on shadcn/ui conventions — `data-slot`, `cn()`, static Tailwind class strings.

## Visual foundations

### Color

A zinc neutral set on shadcn's semantic names. No accent hue is defined yet: the interface is carried entirely by neutrals, with `destructive` as the only chromatic token.

Ground every surface in a named token, never a raw Tailwind shade:

- Page in `background`, raised containers in `card`, floating layers in `popover`, the rail in `sidebar`.
- Body copy in `foreground`; labels, captions, timestamps and placeholder in `muted-foreground`; both hold 4.5:1 on every ground listed in their notes, in both themes.
- Inset regions — table headers, code blocks, skeletons, disabled fields — in `muted`. Hover and active rows in `accent`.
- Exactly one `primary` action per view. Secondary actions take `secondary`, tertiary ones a ghost button on `accent`.
- Status colours follow the formula below. Never signal state by hue alone — every status carries a word or an icon too.

Separate surfaces with `border` and light, not with shadow. `card` is flush with `background` in light mode, so a card without its border reads as nothing.

`link` is the only ink that changes on hover. Links rest in whatever ink surrounds them and take `link` on hover — no underline, no colour at rest. It is a placeholder blue until the brand hue lands, set one step darker than the status `live` blue so a body-size link clears 4.5:1.

`selection` is the text-selection highlight — the same zinc as `muted` in each theme. Selecting text is a fill, not a colour event, and selected text keeps `foreground` (18:1 light, 12:1 dark). Set it once globally on `::selection`; never per component.

### Global base

Four rules that belong in `globals.css` rather than in any component:

```css
html { @apply overscroll-y-none scroll-smooth; }
*   { scrollbar-color: var(--border) transparent; }
a   { @apply hover:text-link; }
button:not(:disabled),
[role="button"]:not(:disabled) { cursor: pointer; }
```

Scrollbars are furniture: the `border` hairline on no track at all, so a scrolling region doesn't announce itself with a grey gutter. `overscroll-y-none` kills the rubber-band bounce that makes a fixed header look unmoored; `scroll-smooth` is overridden to `auto` under reduced motion. The cursor rule exists because Tailwind's preflight leaves buttons on the default arrow — a disabled button keeps it, which is the intended signal.

`::selection` is set once here too, in `selection` with `foreground` ink. Never per component.

### Status colors

Three statuses, built the same way. Each has an ink and two fills — 4% resting, 7% on hover — and nothing else:

| status | ink (light / dark) | resting fill | hover fill |
| --- | --- | --- | --- |
| `destructive` | red-600 / red-400 | `destructive-bg` 4% | `destructive-bg-hover` 7% |
| `live` | blue-500 / blue-400 | `live-bg` 4% | `live-bg-hover` 7% |
| `success` | emerald-600 / emerald-400 | `success-bg` 4% | `success-bg-hover` 7% |

`live` means streaming, running, connected, in progress. `success` means completed, passing, saved. Anything else — pending, queued, draft, idle — is neutral: `muted` fill, `muted-foreground` ink. Resist adding a fourth hue.

The formula, as static class strings:

```
bg-destructive/4 text-destructive          — a static badge or row
bg-destructive/4 hover:bg-destructive/7    — the same thing when it is clickable
```

The 7% step is only for items that are genuinely interactive. A status badge sitting in a table cell stays at 4% and never lights up on hover.

Borders are not part of the formula: a status fill reads at 4% because the whole system is near-monochrome, so it needs no outline. Add `border-destructive/20` only when a status block sits on a fill of its own rather than on `background` or `card`.

Contrast, in the light theme: `destructive` clears 4.5:1, but `live` (3.8:1) and `success` (3.7:1) do not. Both are sound for dots, icons and large or bold text; for status text at `body-sm` or `caption` size, set the word in `foreground` and let the hue carry only the mark. In dark all three clear comfortably. `live` is a placeholder — when its final hue is picked between indigo and blue, choose one that clears 4.5:1 on white and the set closes cleanly.

### Glass surfaces

Anything that floats over the page without dimming it — popovers, dropdowns, menus, hover cards, a sticky header — is translucent rather than solid. The treatment is one fill plus one blur, and it never varies:

```
bg-popover supports-[backdrop-filter]:bg-background/60 backdrop-blur-xs
```

The opaque `bg-popover` comes first as the fallback; browsers without `backdrop-filter` get a solid surface rather than an unreadable one. `glass` is that 60% fill as a token (`#ffffff99` light, `#09090b99` dark) for anywhere the class strings aren't available; `blur-xs` is 4px.

Three rules:

- **Glass belongs over the app's own surfaces.** Composited over `background`, `card` or `muted`, `foreground` still reads at 17:1 or better. Over an image, a chart or a dense table it falls to around 7:1 — there, use `glass-strong` (80%), which holds 13:1 light and 10.8:1 dark in the worst case.
- **No `muted-foreground` on glass over anything but a flat surface.** Secondary ink drops to roughly 2:1 against a busy ground. Inside a floating panel, captions and shortcut hints take `foreground` at `caption` size instead, and lean on size to stay quiet.
- **One layer of glass at a time.** A dropdown opened inside a dialog sits on `popover`, opaque. Stacked translucency turns to mud and the blur compounds.

**A panel over a scrim is solid, never glass.** Dialogs, sheets, drawers and the command palette sit on `bg-popover`, with no blur. A 60% fill composited over a dimmed page turns a muddy grey, and `muted-foreground` on it drops below 4.5:1. The scrim has already set the page apart, so the panel doesn't need translucency to read as on top. In dark mode `popover` is a step lighter than `background`, which keeps the panel's edge clear against the scrim.

A modal's scrim is `overlay` — black at 50% light, 70% dark, with `blur-md` if the page beneath should read as genuinely out of focus. The scrim never carries text.

Borders stay `border` on glass; a glass panel keeps its hairline, since the fill alone no longer defines where the surface ends. It also carries `shadow-md` or `shadow-lg` — see Elevation below. A solid panel over a scrim keeps its hairline and its `shadow-lg` too.

### Elevation

**Only things that float carry a shadow.** A card, a button, an input, a table, the sidebar — all flat. They are separated by their ground and a `border` hairline, never by a lift.

| layer | shadow |
| --- | --- |
| card, button, input, table, sidebar, banner | none |
| dropdown, popover, menu, tooltip, toast | `shadow-md` |
| dialog, sheet, drawer, command palette | `shadow-lg` |

Tailwind's smaller names — `shadow-2xs`, `shadow-xs`, `shadow-sm` — all resolve to `none`, so an inherited shadcn Card comes in flat without editing its class string, the same way the weight ramp works. `shadow-xl` and `shadow-2xl` are capped at `shadow-lg`: nothing in the system goes deeper than a dialog.

The shadow exists to do a job glass cannot. A translucent panel shares its colour with the page behind it, so blur alone reads as a smudge rather than a layer — the shadow is what says *this is on top*. That is why the two always travel together, and why a flat surface needs neither.

Both values are near-black at low opacity, deeper in dark mode, where a shadow has less contrast to work with. There is no coloured or brand-tinted shadow, and no `inset`.

### Typography

Two families. `sans` is Geist — every piece of interface and prose. `mono` is Geist Mono — code, token names, keyboard keys, and nothing else. There is no display face; `display` is the sans at large size.

Both load from Google Fonts as variable faces across 100–900, so the 350/400/430 axis positions are real rather than rounded. `globals.css` imports them directly; in a Next.js app prefer `next/font/google`, which self-hosts them and removes the external request — swap the two `--font-*` stacks for the variables it hands back.

Weights keep Tailwind's names so inherited components need no edits, but the values are the system's:

| class | value | | class | value |
| --- | --- | --- | --- | --- |
| `font-thin` | 250 | | `font-medium` | 430 |
| `font-extralight` | 300 | | `font-semibold` | 430 |
| `font-light` | 350 | | `font-bold` | 430 |
| `font-normal` | 400 | | `font-extrabold` | 430 |
| | | | `font-black` | 430 |

Nothing resolves above 430. A shadcn card title marked `font-semibold` and a button marked `font-medium` render at the same weight, which is the point: pull a block or a template in and it comes out quiet without touching its class strings. Set this up in Tailwind v4 with `@theme { --font-weight-medium: 430; --font-weight-semibold: 430; … }`.

The scale itself uses three of them. The ramp is optical rather than hierarchical: the largest type takes the lightest weight, small type the heaviest, and hierarchy is carried by size, leading and ink instead. `display` and `h1` are `light`; `h2`–`h4`, `label`, `overline` and `kbd` are `medium`; everything else is `normal`.

Every value sits on Geist's variable axis, so a fallback face collapses them to 400.

Fourteen styles, each with its size, leading, weight and tracking fixed:

- Headings `display`, `h1`–`h4` carry negative tracking that eases off as the size drops. Never set one in caps.
- `body` (16/26) is docs prose; `body-sm` (14/20) is the default inside the product UI. Pick by surface, not by emphasis.
- `label` is the 14px `medium` style used for form labels, button text and active nav items. `caption` is 12px for helper text and timestamps, and reads in `muted-foreground`.
- `overline` is the only style that gets capitalised, and the component does the capitalising — never type caps into content.
- `code` (13px) sits inline on a `muted` ground; `code-block` is the same size with looser leading. `code-sm` is 11px for dense work — token and prop names in reference tables, paths, ids, and inline code inside `caption` or `body-sm`. `kbd` is 12px.
- The code group runs one weight heavier at its small end: `code-sm` and `kbd` are `medium`, since mono at 11 and 12px goes thin against a `muted` fill.

Emphasis comes from size and ink, not weight — the 80-unit spread between light and medium is too small to shout with. Italics are for citation only, and nothing in the UI is underlined except a link on hover.

### Radius

The base is `radius`, 0.875rem — 14px. Every other step is derived from it exactly the way shadcn derives its own, so setting `--radius: 0.875rem` makes the inherited `rounded-*` classes land on this set without edits:

| token | value | for |
| --- | --- | --- |
| `radius-sm` | 10px | things nested inside something already rounded |
| `radius-md` | 12px | dense controls: inputs, selects, small buttons, menu items, tabs |
| `radius-lg` | **14px** | the default: buttons, badges, popovers, dropdowns, tooltips, toasts, sidebar items |
| `radius-xl` | 18px | containers that hold components: cards, dialogs, sheets, image frames |
| `radius-2xl` | 24px | large full-width surfaces only — hero and marketing panels |
| `radius-full` | pill | switches, circular icon buttons, avatars, progress tracks, status dots |

`radius-lg` is the one to reach for when unsure. The shape of the system is a 14px corner; the steps either side exist to keep nesting honest, not to give every component its own curve.

Two rules:

- **Nested radius = container radius minus the padding between them.** A code block inside a card (18px corner, 16px padding) rounds at 10px with `radius-sm`, not at 18px — matching the parent makes the inner element look like it is bulging out of it.
- **One radius family per composition.** A pill next to a 14px corner reads as two systems. Pick pills or corners for a given row of controls and hold it; `radius-full` is for shapes that are genuinely circular or capsule-shaped, never a softer version of a button.

Anything interactive stays at `radius-2xl` or below — a 24px corner on a button reads as a toy.

### Spacing and density

A 4px grid with one 2px half-step, at editor density — the reference points are Codex and Cursor, not a marketing site. Names match Tailwind's scale, so `p-4` and `gap-2` resolve to these:

`space-0.5` 2 · `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 · `space-8` 32 · `space-12` 48 · `space-16` 64

Controls are 32px, not shadcn's 36px. That one change is most of what makes the density read as an editor rather than a web app:

| element | size | padding | internal gap |
| --- | --- | --- | --- |
| button | `h-8` 32px | `px-3` | `gap-2` |
| small button, icon button | `h-7` 28px / `size-7` | `px-2` | — |
| input, select, combobox | `h-8` 32px | `px-3` | — |
| menu item, table row, list row | `h-8` 32px | `px-2` | `gap-2` |
| card, dialog, popover | — | `p-4` | `gap-3` |
| sidebar item | `h-7.5` 30px | `px-2` | `gap-2` |
| page gutter | — | `px-6` | — |
| between sections | — | — | `gap-6` |
| between page regions | — | — | `gap-8` |

Sidebar items are the one row that runs shorter than a control, at 30px, the half-step between the two. A sidebar is a long list read at a glance: at 32px it read as tall, and at 28px as cramped. Its rows, the rename field, the loading row and any icon button beside a row (quick chat, say) all sit at 30px, and the row's action and badge sit 5px from its top to stay centred. Group labels keep 32px, since they space the sections rather than being rows.

Docs pages are the exception: `body` prose at 16/26 with 16px between paragraphs, 40px between sections, and a measure capped near 72ch. Product density and reading density are different jobs.

Four rules:

- **Padding decreases as you nest.** A card is `p-4`, the block inside it is `p-3`, the chip inside that is `px-2`. Equal padding at two levels makes the inner element look like it escaped.
- **`gap`, not margin.** Spacing belongs to the container, so a component never carries an outside margin that another layout has to undo.
- **One step for related things, two for separate ones.** Label to field is `space-1`; field to the next field is `space-4`. Jumping a single step to mean "these are different" doesn't read.
- **No arbitrary values.** If something needs 14px, the answer is 12 or 16. `space-0.5` exists for the genuine optical exceptions so nothing else has to invent one.

A 32px control with a 12px corner (`radius-md`) has 10px of straight edge on each side — that ratio is what keeps the tight density from looking like a pill. If a control gets shorter than 28px, drop it to `radius-sm`.

### Focus and edges

**There are no rings in this system.** No `ring-1`, no `ring-2`, no `ring-[3px]`, no offset, no glow. A focused control keeps exactly the geometry it had at rest — its 1px border changes colour, and nothing else moves.

```
border border-input focus-visible:border-ring focus-visible:ring-0 outline-none
```

`focus-visible:ring-0` is load-bearing: shadcn's own inputs and buttons ship `focus-visible:ring-ring/50 focus-visible:ring-[3px]`, so inherited components need it stripped or they grow a halo. This applies to everything focusable — buttons, inputs, selects, checkboxes, tabs, menu items, links. A button with no resting border gets its border on focus only, in `ring`, so nothing reflows.

`ring` is zinc-500 in both themes. That value is chosen so the swap is actually perceivable: 4.8:1 against `background` and 3.8:1 against the resting `input` edge in light, 4.1:1 on `background` and 3.7:1 on `card` in dark — a focus indicator has to clear 3:1 against what surrounds it, and a colour change alone only counts if the two colours differ by that much. A lighter zinc would look more restrained and would not be a focus indicator.

Keyboard focus is the only thing that triggers it: `focus-visible`, never `focus`, so clicking a field doesn't paint the border.

`border` and `input` are deliberate hairlines at roughly 1.3:1. They are decoration and containment, not information: every control also carries a visible label, and every state that matters is carried by text or ink as well. When a boundary must be perceivable on its own — a chart axis, a table rule that encodes structure — use `muted-foreground` instead.

### Tabs

**Tabs are the segmented track only: `TabsList` on its default variant.** Never use `variant="line"`. The underline marks the current view with a 2px bar in `foreground`, a heavier mark than anything else in the system uses for "selected". Everywhere else, the current item is a quiet fill: sidebar rows and menu items on `accent`, and the active tab on `background` inside a `muted` track. The `line` variant stays in `ui/tabs.tsx` only because the port keeps shadcn's API, so an install doesn't break anyone's call sites. Don't show it in demos, blocks or components.

The active tab carries an `input` hairline in both themes, since the `shadow-sm` shadcn lifts it with resolves to none here. It gives way to `ring` under keyboard focus (`data-active:not-focus-visible:border-input`), so a focused active tab still shows focus.

### Scrolling lists

**Rows that get you somewhere stay put; only the list under them scrolls.** In a sidebar, the header and the main rows (new chat, projects) sit above the scroll area, and only the chat sections move. An edge of a scrolling list fades over 24px (`1.5rem`) with a mask, and only while more of the list is hidden past that edge, so a list that fits shows no fade at all. The fade is a mask on the scroll box, never a gradient overlay painted in a background colour, which would break on any other ground.

**A section label can fold its list.** The label becomes the button, with a chevron after it that shows on hover and stays while the list is folded, turning 90° at 150 ms. The list folds the way any in-layout region does (see Motion). A section's other controls, like its filter, sit at the label's end and appear on hover, on focus, while their menu is open, and always on touch.

### Search inside a list

**A search field at the top of a menu or command list is a row of the panel, not a field set inside it.** It runs edge to edge, has no fill, no border of its own and no rounding, and a `border-border/60` hairline under it divides it from the rows. Its search glyph sits in `muted-foreground/70` and lines up with the row icons below it. A clear button sits at its end, disabled at 30% rather than hidden while the field is empty, so the text's end doesn't shift as you type; clearing puts focus back in the field. A boxed input there would read as a second surface inside the panel, and it would steal a step of padding from every row. `MenuSearch` in `menu.tsx` and `CommandInput` in `ui/command.tsx` are the reference. A standalone search field elsewhere on the page is an ordinary input and keeps its border.

### Layers

Eight layers, ten apart so one can be slipped in later without renumbering:

| token | value | layer |
| --- | --- | --- |
| `z-base` | 0 | page content |
| `z-raised` | 10 | sticky table headers, pinned rows |
| `z-sticky` | 20 | app header, sidebar rail, sticky toolbars |
| `z-dropdown` | 30 | dropdowns, popovers, selects, context menus |
| `z-overlay` | 40 | the scrim behind a modal |
| `z-modal` | 50 | dialogs, sheets, drawers, command palette |
| `z-toast` | 60 | toasts and notifications |
| `z-tooltip` | 70 | tooltips |

Two of these are ordered the way they are for a specific reason. **Toasts sit above modals**, because a save failure that appears behind the form that caused it is a bug. **Tooltips sit above everything**, because a tooltip can be triggered from a control inside a dialog or inside a toast.

Three rules:

- **Never write a raw z-index.** If something needs to be above something else, it belongs to one of these layers; if it fits none of them, the stack is wrong, not short a number.
- **Let the DOM do the work first.** Radix and Base UI portal their overlays to the end of `<body>`, so order already puts them on top — reach for a layer only when a portal isn't involved.
- **Layers are page-wide, not per-component.** A component never establishes its own stacking context with `z-index` to solve a local overlap; use DOM order or `isolation: isolate` on the container instead.

Use them as `z-[var(--z-modal)]` rather than Tailwind's numeric `z-50`, so the name travels with the intent.

### Motion

Motion is not in `tokens.json` — the token format has no motion family — so these are the values, to be declared alongside the rest in `@theme`:

| token | value | for |
| --- | --- | --- |
| `--duration-instant` | 80ms | press, hover on a control, row background |
| `--duration-fast` | 150ms | a state the pointer answers: a chevron or plus turning, a toggle; popovers, dropdowns, tooltips, toasts entering |
| `--duration-layout` | 280ms | something arriving or reshaping the page: resizable panels, sidebar collapse, accordions, dialogs, sheets, a set of suggestions coming in |
| stagger | 70ms per item | the delay between items when several arrive together |
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | everything entering or responding to input |
| `--ease-in` | `cubic-bezier(.4, 0, 1, 1)` | everything leaving |

Registry code can't use these tokens, so it writes the value: `duration-80`, `duration-150`, `duration-280`. A duration off this list, like `duration-200` or `duration-300`, is a bug.

Input is answered instantly; layout takes its time. Anything the pointer causes directly finishes in 80 ms — past about 100 ms a press stops feeling connected to the finger. A state the pointer toggles, like a menu opening, takes 150 ms. Anything that arrives or reshapes the page runs at 280 ms, because a panel that snaps open makes the eye lose its place.

**Every animation and transition has a `motion-reduce` escape.** `motion-reduce:transition-none` on a transition, `motion-reduce:animate-none` on an animation, on the same element. No exceptions: a spinner, a stagger, a colour fade and an opacity fade are all motion to someone who asked for less of it. The global rule in `globals.css` is only a backstop for the site. A consumer may not install the theme, so registry code never relies on it. Motion driven from JavaScript, like a waveform following the microphone, has no class to hang the escape on, so it checks `matchMedia("(prefers-reduced-motion: reduce)")` and holds still.

**Transition the properties that change, never `all`.** `transition-[opacity,scale]` says what is moving and keeps everything else from being caught up in it. `transition-colors`, `transition-opacity` and `transition-transform` are fine, because each already names its properties. Tailwind v4's `scale-*`, `rotate-*` and `translate-*` set the `scale`, `rotate` and `translate` properties, so list those rather than `transform` inside a bracketed list.

**Press feedback.** Every button, icon button and clickable card dents by about a pixel at each edge, so the scale depends on the size:

```
active:scale-[0.97]   a button with a label, a clickable card
active:scale-90       an icon-only button, 20–36px
```

At 0.97 a 32px button dents about 1px. An icon button at the same scale would move less than half a pixel, which reads as nothing, so it goes to 0.90. A labelled button at 0.90 would lose a tenth of its width and read as a toy. Transition only `scale`, at 80 ms, with `ease-out`.

Scale only: the button doesn't also nudge down, and the fill doesn't darken on press, since hover already shifted it. Nothing else in the system scales; a hover that grows an element is not part of this vocabulary.

**A trigger's icon may turn to show that what it opens is open**: a chevron by 180°, a plus by 45° into a close mark. It turns at 150 ms, keyed to the trigger's `aria-expanded`, and turns back when the menu closes.

**Layout transitions** animate: resizable panels, sidebar collapse and expand, accordions, drawers. Animate `width`, `height` or `transform`, never `all`. That includes a panel dragged past its minimum: the snap shut, or open again, plays at 280 ms instead of jumping, while the rest of the drag follows the pointer with no transition at all.

**A region that appears inside a layout folds open and shut; it never pops in.** A tray above the composer, a row of chips, a banner: keep it mounted, and move `grid-template-rows` between `0fr` and `1fr` with opacity, at 280 ms, with an inner `overflow-hidden` wrapper. Mark it `inert` while shut, and keep its last contents while it folds away, so it doesn't empty before it closes. `ComposerHeader` is the reference.

**Entrances with a delay pair with `fill-mode-both`**, so an item isn't visible for a frame before its delay starts and doesn't snap back when it ends.

**Stagger only a small set that arrives together**, like a row of suggestions or a fresh batch of chips: 70 ms per item, at 280 ms each. Never stagger a long list or anything that loads on scroll. A stagger needs a way to replay: key the container and bump the key, so the set remounts and a fresh one arrives rather than just appearing.

**Streaming and loading** animate: skeleton shimmer, the caret on streaming text, a running agent's spinner. These are the one place a loop is allowed to run indefinitely, and they stop the moment the work does.

Still open: overlay enter/exit and row-hover fades — the Motion card on this page demos both against no motion, with a switch.

Everything else is static. No scroll-triggered reveals, no parallax, no easing on colour changes other than the row-hover case above.

**Checklist for a new element**

- `motion-reduce` on every transition and animation.
- Motion driven from JavaScript checks `prefers-reduced-motion` itself.
- Every transition names its properties; none uses `all`.
- Every duration is 80, 150 or 280 ms, and a stagger step is 70 ms.
- Entrances with a delay carry `fill-mode-both`.
- Anything that loops is streaming or loading, and stops when the work does.

### Themes

`light` is the primary theme; `dark` is complete, not derived. Check both when adding a token: surfaces invert, and the destructive pair flips its ink rather than its fill.

---

# Icons

Icons come from Hugeicons (`@hugeicons/react` with `@hugeicons/core-free-icons`), stroke-rounded set. One family, no mixing: an icon from another pack in the same view is a bug, not a variation.

## Rules

- **16px inside text and controls** — buttons, menu items, table cells, badges. 20px for a standalone icon button or a list leading icon; 24px only in an empty state or a feature block. Nothing larger unless it is illustration, not iconography.
- **Ink follows the text it sits with**: `foreground` beside body copy, `muted-foreground` in secondary rows and idle nav items, the status ink for a status mark. An icon is never the only colourful thing in a neutral row for decoration's sake.
- **Icons carry meaning only alongside a word**, except in dense toolbars where the icon is the control — and there it needs a tooltip and an `aria-label`.
- **Stroke stays as the package ships it.** No re-weighting to match the type ramp, no filled variants mixed in with stroked ones.
- Decorative icons get `aria-hidden`; meaningful ones get a label.

## Reusable icons

The running list of icons this registry reuses, so a component reaches for the same mark every time rather than picking a new one. Fill it in as projects land — a row belongs here once the same icon has been used in two places.

| purpose | icon | notes |
| --- | --- | --- |
| _(empty)_ | | |

Add a row with the exact export name from `@hugeicons/core-free-icons` so it can be pasted straight into an import, and say what it means in this system rather than what it depicts — "a run in progress", not "a circle with an arrow".

---

# Brand assets

Nothing here yet. This section is the list of what the system is missing, so it can be filled in one pass rather than remembered piecemeal.

Assets are copied, never approximated — a mark is never drawn from a description, and a placeholder is always labelled as one.

## What's missing

| asset | what's needed | status |
| --- | --- | --- |
| Wordmark | SVG, the full name set as it should always appear | — |
| Lettermark / glyph | SVG, the square mark for tight spaces | — |
| App icon | SVG or 1024px PNG, the rounded-square form | — |
| Favicon | 32px and 16px, plus the SVG it's cut from | — |
| Mark on dark | The variant for dark surfaces, if it isn't just an ink swap | — |
| Monochrome mark | Single-ink version for stamps, watermarks and print | — |
| Background / OG placeholder | 1200×630 share image, and whatever fills an empty hero | — |
| Avatar | The default identity image, if it isn't the generated gradient | — |
| Screenshot frame | The chrome product screenshots sit in, for docs and marketing | — |

Files land under `assets/<Group>/` when they arrive — `assets/Logos/`, `assets/Images/` — one group per row above, each group with its own `README.md` saying what its files are for. A single-ink SVG needs its ink named in that README, since an `<img>` can't inherit `currentColor`.

## Questions to answer when filling this in

- **Name.** Is the system's name always lowercase `aiellie`, or does it capitalise in prose and at the start of a sentence? Is there a separate product name from the handle?
- **Brand hue.** Still unpicked — somewhere between indigo and blue. Once chosen it replaces the `live` placeholder, takes a block on the cover, and decides whether the focus border stays neutral zinc or moves to brand.
- **Clear space and minimum size.** How much room around the mark, expressed in a unit of the mark itself; the smallest size it's allowed to render.
- **Lockups.** Is there a fixed mark-plus-wordmark arrangement, and does it have a stacked variant?
- **Misuse.** What is explicitly not allowed — recolouring, stretching, outlining, setting it on a busy photo, rebuilding it in a different typeface.
- **Imagery.** Does the brand use photography at all, or only screenshots, diagrams and flat colour? If screenshots: light, dark, or both, and in a frame or bare?
- **Illustration and empty states.** Is there a drawing style, or do empty states stay type and icons only?
- **Voice for the mark.** Where the wordmark appears versus where plain type set in `display` is enough — a docs header probably doesn't need the logo.

Until a real mark exists, the name is set in plain type — `display` at `light` weight — and the absence is noted rather than papered over with a drawn substitute.

---

# Token reference

Every value in the system. Generated from `tokens.json` — do not hand-edit here.

## Color

| token | light | dark | use |
| --- | --- | --- | --- |
| `background` | `oklch(1 0 0)` | `oklch(0.141 0.005 285.823)` | Page ground. |
| `foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Default text and icon ink on background, card, popover, muted and secondary. |
| `card` | `oklch(1 0 0)` | `oklch(0.21 0.006 285.885)` | Raised container ground. |
| `card-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Text on card. |
| `popover` | `oklch(1 0 0)` | `oklch(0.21 0.006 285.885)` | Ground for popovers, dropdowns, command menus and tooltips that float over the page. |
| `popover-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Text on popover. |
| `primary` | `oklch(0.21 0.006 285.885)` | `oklch(0.92 0.004 286.32)` | Solid fill of the one primary action per view. |
| `primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.21 0.006 285.885)` | Text and icons on primary (17. |
| `secondary` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | Fill of secondary buttons and quiet chips. |
| `secondary-foreground` | `oklch(0.21 0.006 285.885)` | `oklch(0.985 0 0)` | Text on secondary. |
| `muted` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | Inset ground: table headers, code blocks, skeletons, disabled fields. |
| `muted-foreground` | `oklch(0.53 0.016 285.938)` | `oklch(0.705 0.015 286.067)` | Secondary text: labels, captions, timestamps, placeholder. |
| `accent` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | Hover and active ground for rows, menu items and ghost buttons. |
| `accent-foreground` | `oklch(0.21 0.006 285.885)` | `oklch(0.985 0 0)` | Text on accent. |
| `link` | `oklch(0.546 0.245 262.881)` | `oklch(0.623 0.214 259.815)` | Link ink, shown on hover — links rest in the ink around them. |
| `selection` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | Text-selection highlight. |
| `destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Status ink for destructive: icons, dots, and the text of a destructive row or badge. |
| `destructive-foreground` | `oklch(0.985 0 0)` | `oklch(0.141 0.005 285.823)` | Text on a destructive fill (4. |
| `destructive-bg` | `#e7000b0a` | `#ff64670a` | Destructive at 4%. |
| `destructive-bg-hover` | `#e7000b12` | `#ff646712` | Destructive at 7%. |
| `live` | `oklch(0.623 0.214 259.815)` | `oklch(0.707 0.165 254.624)` | Status ink for live — streaming, running, connected, in progress. |
| `live-bg` | `#2b7fff0a` | `#51a2ff0a` | Live at 4%. |
| `live-bg-hover` | `#2b7fff12` | `#51a2ff12` | Live at 7%. |
| `success` | `oklch(0.596 0.145 163.225)` | `oklch(0.765 0.177 163.223)` | Status ink for success — completed, passing, saved. |
| `success-bg` | `#0099660a` | `#00d4920a` | Success at 4%. |
| `success-bg-hover` | `#00996612` | `#00d49212` | Success at 7%. |
| `border` | `oklch(0.92 0.004 286.32)` | `#ffffff1a` | Hairline separators and container edges. |
| `input` | `oklch(0.92 0.004 286.32)` | `#ffffff26` | Field and control edges at rest. |
| `ring` | `oklch(0.552 0.016 285.938)` | `oklch(0.552 0.016 285.938)` | The focused border colour, not a ring. |
| `sidebar` | `oklch(0.985 0 0)` | `oklch(0.21 0.006 285.885)` | Sidebar ground: one step off background, set apart by tone rather than a heavy border. |
| `sidebar-foreground` | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)` | Sidebar text. |
| `sidebar-primary` | `oklch(0.21 0.006 285.885)` | `oklch(0.92 0.004 286.32)` | Solid fill of the active sidebar item or a sidebar CTA. |
| `sidebar-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.21 0.006 285.885)` | Text on sidebar-primary. |
| `sidebar-accent` | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | Hover and current-item ground inside the sidebar. |
| `sidebar-accent-foreground` | `oklch(0.21 0.006 285.885)` | `oklch(0.985 0 0)` | Text on sidebar-accent. |
| `sidebar-border` | `oklch(0.92 0.004 286.32)` | `#ffffff1a` | Sidebar rail edge and group separators. |
| `sidebar-ring` | `oklch(0.552 0.016 285.938)` | `oklch(0.552 0.016 285.938)` | Focused border colour inside the sidebar. |
| `glass` | `#ffffff99` | `#09090b99` | Background at 60%, the translucent fill behind popovers, dropdowns, menus and sticky headers. Never behind a panel over a scrim. |
| `glass-strong` | `#ffffffcc` | `#09090bcc` | Background at 80%. |
| `overlay` | `#00000080` | `#000000b3` | The scrim behind a dialog, sheet or drawer. |

## Font weight

| token | value | use |
| --- | --- | --- |
| `thin` | `250` | Tailwind font-thin. |
| `extralight` | `300` | Tailwind font-extralight. |
| `light` | `350` | Tailwind font-light. |
| `normal` | `400` | Tailwind font-normal. |
| `medium` | `430` | Tailwind font-medium. |
| `semibold` | `430` | Tailwind font-semibold, capped to 430. |
| `bold` | `430` | Tailwind font-bold, capped to 430. |
| `extrabold` | `430` | Tailwind font-extrabold, capped to 430. |
| `black` | `430` | Tailwind font-black, capped to 430. |

## Radius

| token | value | use |
| --- | --- | --- |
| `radius` | `0.875rem` | The base, 14px. |
| `radius-sm` | `0.625rem` | 10px. |
| `radius-md` | `0.75rem` | 12px. |
| `radius-lg` | `0.875rem` | 14px, the default and the one to reach for when unsure. |
| `radius-xl` | `1.125rem` | 18px. |
| `radius-2xl` | `1.5rem` | 24px. |
| `radius-full` | `9999px` | Pills and circles only: switches, circular icon buttons, avatars, progress tracks, status dots, count badges. |

## Spacing

| token | value | use |
| --- | --- | --- |
| `space-0.5` | `2px` | The half-step. |
| `space-1` | `4px` | Tight pairs that read as one object: a chip's vertical padding, the gap between stacked label and field, icon to counter inside a badge. |
| `space-2` | `8px` | The workhorse gap: icon to text, button to button in a row, checkbox to label, items in a menu. |
| `space-3` | `12px` | Horizontal padding inside controls — buttons, inputs, selects — and the gap between a card's title and its body. |
| `space-4` | `16px` | Padding inside cards, dialogs, popovers and panels; the gap between fields in a form. |
| `space-5` | `20px` | The in-between step for a container that needs more air than 16px without jumping to a section gap. |
| `space-6` | `24px` | Page gutters and the gap between sections inside a page or card group. |
| `space-8` | `32px` | Separation between major regions of a page — a header block and the content under it. |
| `space-12` | `48px` | Major breaks on docs and marketing pages: between a hero and the first section. |
| `space-16` | `64px` | The largest step, for the top and bottom of a long-form page. |

## Shadow

| token | light | dark |
| --- | --- | --- |
| `shadow-2xs` | `none` | `none` |
| `shadow-xs` | `none` | `none` |
| `shadow-sm` | `none` | `none` |
| `shadow-md` | `0 4px 12px -2px #00000014, 0 2px 4px -2px #0000000f` | `0 4px 12px -2px #00000066, 0 2px 4px -2px #00000052` |
| `shadow-lg` | `0 12px 28px -6px #0000001f, 0 4px 8px -4px #00000014` | `0 12px 28px -6px #00000080, 0 4px 8px -4px #00000066` |
| `shadow-xl` | `0 12px 28px -6px #0000001f, 0 4px 8px -4px #00000014` | `0 12px 28px -6px #00000080, 0 4px 8px -4px #00000066` |
| `shadow-2xl` | `0 12px 28px -6px #0000001f, 0 4px 8px -4px #00000014` | `0 12px 28px -6px #00000080, 0 4px 8px -4px #00000066` |

## Blur

| token | value | use |
| --- | --- | --- |
| `blur-xs` | `4px` | The system default for glass: popovers, dropdowns, menus, sticky headers. |
| `blur-sm` | `8px` | Heavier separation for a glass layer that covers most of the page without a scrim. |
| `blur-md` | `12px` | The scrim behind a modal, when the page underneath should read as out of focus rather than merely dimmed. |

## Z-index

| token | value | use |
| --- | --- | --- |
| `z-base` | `0` | Page content. |
| `z-raised` | `10` | In-flow elements that must clear their siblings: a sticky table header, a pinned row, a focused cell in a grid. |
| `z-sticky` | `20` | Page furniture that stays put while content scrolls under it: the app header, the sidebar rail, a sticky toolbar. |
| `z-dropdown` | `30` | Layers anchored to a trigger: dropdowns, popovers, selects, comboboxes, context menus, the autocomplete list. |
| `z-overlay` | `40` | The scrim behind a modal layer. |
| `z-modal` | `50` | Layers that own the screen: dialogs, sheets, drawers, the command palette. |
| `z-toast` | `60` | Toasts and notifications, which must stay readable over a dialog — a save failure that appears behind the form that caused it is a bug. |
| `z-tooltip` | `70` | The top of the stack. |

## Type scale

| style | family | size / leading | weight | tracking |
| --- | --- | --- | --- | --- |
| `display` | sans | 36px / 40px | 350 | -0.02em |
| `h1` | sans | 30px / 36px | 350 | -0.02em |
| `h2` | sans | 24px / 32px | 430 | -0.015em |
| `h3` | sans | 20px / 28px | 430 | -0.01em |
| `h4` | sans | 16px / 24px | 430 | 0 |
| `body` | sans | 16px / 26px | 400 | 0 |
| `body-sm` | sans | 14px / 20px | 400 | 0 |
| `label` | sans | 14px / 20px | 430 | 0 |
| `caption` | sans | 12px / 16px | 400 | 0 |
| `overline` | sans | 11px / 16px | 430 | 0.06em |
| `code` | mono | 13px / 20px | 400 | 0 |
| `code-sm` | mono | 11px / 16px | 430 | 0 |
| `code-block` | mono | 13px / 22px | 400 | 0 |
| `kbd` | mono | 12px / 16px | 430 | 0 |


**Families.** `sans` Geist, ui-sans-serif, system-ui, sans-serif · `mono` "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace