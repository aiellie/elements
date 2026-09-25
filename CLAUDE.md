# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

**aiellie elements** is a shadcn registry of AI-native UI built on Base UI and Tailwind v4. It publishes to `https://elements.aiellie.dev/r/{name}.json`, under the `@aiellie` namespace in `components.json`. The same Next.js app is also the site that previews every item.

- **Next.js is 16.x, and its APIs, conventions and file structure differ from your training data.** Before writing Next-specific code, read the relevant guide in `node_modules/next/dist/docs/` and heed its deprecation notices.
- **All UI follows the design system in the `design` skill (`.claude/skills/design/SKILL.md`).** Load it before building or restyling anything. The values live in `app/globals.css`; the skill gives the intent behind them. `registry/aiellie/components/menu.tsx` and `toolbar.tsx` are the reference for house style.

## Commands

```bash
pnpm dev                            # site on :3000 (press `d` to flip light/dark)
pnpm registry:build                 # shadcn build: registry.json -> public/r/*.json
pnpm typecheck                      # tsc --noEmit
pnpm lint                           # eslint with Next's config
pnpm build                          # registry:build, then next build
pnpm exec prettier --write <files>  # format only what you touched
```

- `public/r/` is generated and gitignored. The build never deletes JSON for items that were removed from `registry.json`, so a file existing there doesn't mean the item is still published.
- `pnpm typecheck` and `pnpm lint` are the checks to pass before calling work done.
- `pnpm format` rewrites the whole repo, and much of the repo isn't Prettier-clean yet, so don't run it for a scoped change.
- There is no test suite.
- To try the `aiellie` command against your local registry, run `pnpm registry:build` with `pnpm dev` running, then run this from a scratch folder outside the repo:

  ```bash
  AIELLIE_REGISTRY_URL=http://localhost:3000/r node <repo>/packages/cli/bin/aiellie.js init my-chat --yes
  ```

## Architecture

### `registry/aiellie/`: what gets published

A file's folder decides its item `type` and where it installs:

| folder | holds | item `type` | installs to (`files[].target`) |
| --- | --- | --- | --- |
| `ui/` | shadcn components we restyled (button, tooltip) | `registry:ui` | `components/ui/<name>.tsx`, replacing the consumer's own shadcn file |
| `components/` | everything we designed, from building blocks to AI pieces (menu, toolbar, status, model-selector) | `registry:component` | `components/aiellie/<name>.tsx` |
| `blocks/<name>/` | a whole page: `page.tsx`, plus parts private to the block in `components/` | `registry:block` | `page.tsx` → `app/<name>/page.tsx` |
| `icons/`, `lib/` | vendor marks; data and helpers (`models.ts`, `utils.ts`) | `registry:component` / `registry:lib` | `components/aiellie/icons/`, `lib/` |
| `hooks/` | React hooks that ported shadcn components import (`use-mobile`) | `registry:hook` | `hooks/<name>.ts` |
| `examples/` | `<item>-demo.tsx` with a default export; used by the site only | none | not published |

**`ui/` or `components/`?** Only a shadcn component we restyled goes in `ui/`, because only that can safely replace a file in the consumer's `components/ui/`. Everything else is ours and goes in `components/`, however small. What kind of thing an item is (an action, an overlay, …) is decided by its category, not its folder.

Blocks compose components, and components build on `ui/` and on each other, the way `components/model-selector.tsx` uses `components/menu` and `ui/button`.

Rules that keep installs working:

- Every file under `registry/aiellie/`, except those in `examples/`, belongs to an item in `registry.json`. An item's `name` is the file's basename; a block is named after its folder.
- Inside `registry/`, import other registry files as `@/registry/aiellie/<folder>/<name>`, and import `cn` from `@/lib/utils`. Never import site code (`@/components/...`, `lib/surfaces`, `lib/constants`). On install, the shadcn CLI rewrites these imports so each one points at wherever that file landed, matching files by basename. Keep basenames unique across the registry.
- Every registry file that a file imports must be listed in its item's `registryDependencies` (as `@aiellie/<name>`). Otherwise the file never gets installed and the import breaks. Every npm package the file imports goes in `dependencies`.
- A block lists every file it ships: `page.tsx` as `registry:page`, and its `components/*.tsx` as `registry:component` targeted under `components/aiellie/`. It depends on every item it composes. The page installs as a Next route, so it needs a default export.
- Registry code only gets to use shadcn's standard theme tokens (`background`, `muted`, `sidebar`, `border`, `ring`, …), the `live` token from our theme (`text-live`, `bg-live/4`; never a raw blue), Tailwind's own utilities, and `tw-animate-css` (listed in `dependencies`, like `tooltip` and `message` do). The site's extras (`text-h2`, `glass`, `press`, `bg-overlay`, `animate-blink`, the `--z-*` layers) don't exist in a consumer's project. Don't try to ship new theme variables either: this CLI writes `cssVars.theme` under a `.theme` class instead of `@theme`, and `css` can't declare a variable inside `@theme`.

The `theme` item is the exception to living under `registry/aiellie/`: it publishes the site's own `app/globals.css`, byte for byte, as a file that replaces a consumer's stylesheet. Any change to `app/globals.css` therefore ships to new apps on the next deploy. Keep it self-contained: every package it `@import`s must be in the theme item's `dependencies`.

Projects have to register the `@aiellie` namespace in their `components.json` before anything that depends on `@aiellie/...` will install. Without it, shadcn stops with "Unknown registry". The `aiellie` command adds the entry itself; a plain `shadcn add <url>` doesn't.

### `packages/cli/`: the `aiellie` command

An npm package (`aiellie`) in the pnpm workspace, written in plain JavaScript with no build step. Commands:

- **`npx aiellie init [dir]`:** in an empty folder, or given a new folder name, it copies `template/` (a bare Next.js app: layout, fonts, `components.json`, a home page that shows the chat), installs its packages, then runs `shadcn add @aiellie/theme @aiellie/chat` against the live registry. In a folder with a `package.json`, it runs `shadcn init` if the project has no `components.json`, registers the namespace, and adds the chat.
- **`npx aiellie add <names...>`:** registers the namespace if needed and runs `shadcn add @aiellie/<name>`.

The chat and the theme come from the registry at install time, so they reach new apps whenever the site deploys. Republish the package only when `bin/` or `template/` changes. The template ships inside the package rather than being downloaded, because the GitHub repo is private. Its `.gitignore` is stored as `_gitignore`, because npm strips `.gitignore` files from published packages.

With `--yes`, or when there's no terminal, the command types shadcn's answers itself. shadcn asks about files that already exist even with `--yes`, and it quits without installing the rest if its input is closed instead of answered. The site's typecheck and lint skip `packages/`, because the template's imports only resolve inside a generated app.

To publish, log in with `npm login`, bump `version` in `packages/cli/package.json`, then run `pnpm publish` from `packages/cli`.

### The site: `app/`, `components/`, `lib/`

- Gallery pages: `app/(home)/page.tsx` previews blocks, `app/ui/page.tsx` previews `ui/` items, and `app/components/page.tsx` previews `components/` items. Each page is a stack of `CategorySection`s (`components/pages/category-separator.tsx`), one per category. A section wraps its `DemoCard`s (`components/pages/demo-card.tsx`), each wrapping one example, and heads them with a `CategorySeparator` that counts the cards itself, so never write a count by hand.
- Categories: `lib/categories.ts` lists them (id, name, icon) in the order they run down a page. Every item with a card lists exactly one category id under `categories` in `registry.json`, and its card goes in that category's section. Supporting items (lib, icons) have no category. If a new item fits none of the categories, add one to `lib/categories.ts` first.
- `DemoCard`:
  - Its menu has a "Copy install command" entry that builds `https://elements.aiellie.dev/r/<item>.json` from the last segment of `href`, or from `item` if you pass it. That segment must therefore be the registry item name. No detail routes exist yet.
  - `index` is the number the card displays. It keeps counting down the whole page instead of restarting at each category.
  - `icon` takes a Hugeicons glyph.
  - `wide` makes the card span the whole row; use it for blocks.
  - The demo mounts lazily, centred in a plate of fixed height: 340px, or 420px when `wide`.
- `components/ui/` and `components/aiellie/` hold the UI used by the site chrome (`demo-actions`, `nav-button`). Most of these files are copies of registry items installed into this repo; `toast.tsx` exists only for the site. Nothing keeps the copies in sync with `registry/`, which is the source of truth, so they can fall behind it. To update a copy, copy the registry file over it, then point any `@/registry/aiellie/...` imports at the installed paths.
- Site-only code: `components/shared/`, `components/pages/`, `lib/surfaces.tsx`, `lib/constants.ts` (nav pages, container width), `lib/categories.ts`, `lib/demos.tsx` (the demos `/demo/<name>` can open), and `app/provider.tsx` (themes and toasts).

## Building a feature

When asked to build something new (a block, a component or a primitive), **post a plan and wait for the user's approval before creating any files.** The plan lists:

- **Block:** the page's own parts, the `<block>-*.tsx` files that go in `blocks/<block>/components/`.
- **Components:** the reusable ones it uses, and the new ones to build, with a line on what each new one does.
- **UI:** the existing primitives it uses, the ones to port from shadcn (into `ui/`), and the ones to build ourselves on Base UI (into `components/`).
- **Categories:** the category each new item's card goes under.

Once the plan is approved, build it in layers. For example, "build the chat page: sidebar, header, messages, empty state, composer, thread" breaks down like this:

1. **Primitives.** Port anything missing from shadcn into `ui/` (see the next section), or build our own on `@base-ui/react` in `components/`.
2. **Components.** A piece worth reusing outside this page becomes its own item in `components/`, with a general name (`composer`, `message`, `thread`). Each one installs on its own and knows nothing about the page.
3. **Block.** The page's own parts are `chat-*.tsx` files in `blocks/chat/components/`, each built from the reusable pieces. For example, `chat-composer.tsx` is the composer plus the model selector, hooked up to send. Parts that only make sense on this page (the sidebar, the header, the empty state) exist only here. `chat.tsx` lays them out and holds the state, and `page.tsx` renders it. Block files install only with the block and get no cards; the home page previews the whole block.
4. **Demos.** Every new `ui/` or `components/` item gets an `examples/<name>-demo.tsx`, a `DemoCard` on `/ui` or `/components` inside its category's `CategorySection`, and an entry in `DEMOS` in `lib/demos.tsx`. That entry is what gives the card its full-page view at `/demo/<name>`; without it the page is a 404.
5. **Registry.** Add every new item to `registry.json` with its category, then run `pnpm registry:build`, `pnpm typecheck` and `pnpm lint`.

## Design feedback

Design feedback is already a decision, so it doesn't need a plan first. Ask only when it's unclear what the user wants. Don't just patch the one spot that was mentioned. Make the change stick, so later work follows it without being told again:

1. **The component** in `registry/aiellie/`. Registry code can't use the site's own tokens (see the rules above), so the new value goes in the component's classes.
2. **Its demo** in `examples/`, so its card shows the change, and **the site's copy** in `components/ui/` or `components/aiellie/`, if it has one.
3. **`app/globals.css`**, when the feedback changes a value the site itself uses: a token, a utility or a global rule.
4. **The `design` skill.** Write the feedback down as a rule, with its reason, where future work will look for it. Where it contradicts the skill, the feedback wins: rewrite that part instead of adding an exception.
5. **Other components with the same pattern.** Feedback about one component usually describes a pattern, so bring the others in line and say which ones changed. If it's unclear whether the feedback applies to them, ask.
6. **This file**, when the feedback changes how things are built rather than how they look.

Check each change in the browser, in light and dark mode. When feedback arrives as a list, work through it item by item and end with a summary of what changed where.

## Porting a shadcn component into `ui/`

Port the Base UI version (`style: "base-nova"` in `components.json`), not the Radix one. Someone who installs our file over their own `components/ui/<name>.tsx` must be able to leave every call site unchanged, so **change the styling and nothing else**:

- Keep the following exactly as upstream has them:
  - the file name
  - every export: button ships `Button` and `buttonVariants`, no more and no fewer
  - component and prop names
  - variant and size keys: add none, remove none, rename none
  - `data-slot` attributes
- Change class strings only, so they match the `design` skill: tokens instead of raw colour shades, no focus rings (focus is a change of border colour), glass and a shadow on floating layers only, and editor density. `font-semibold`, `font-bold`, `shadow-xs` and `shadow-sm` can stay, because the tokens already cap them.
- Change these imports:
  - `cn` comes from `@/lib/utils`, with `@aiellie/utils` as a registry dependency.
  - Other shadcn primitives come from `@/registry/aiellie/ui/<name>`; port them first if they aren't there yet.
  - Icons become Hugeicons.
- Get the upstream source with `pnpm exec shadcn view <name>`, which prints the item's JSON and writes nothing. Don't run `shadcn add <name>` for upstream components here: it installs into `components/ui/` and overwrites the site's copies.

Our own primitives (menu, toolbar) have no upstream API to preserve, so you're free to design their API. Build them on `@base-ui/react` in `components/`, and style them the same way.

## Code conventions

- Base UI composes through `render`, not Radix's `asChild`: `<MenuTrigger render={<Button variant="ghost" />}>`. Style its states through its data attributes (`data-highlighted`, `data-popup-open`, `data-starting-style`, `data-checked`, `data-disabled`, …).
- Each part is a function component that sets `data-slot="<kebab-name>"` and passes `className` last into `cn()`. Put every export in one `export { … }` block at the bottom of the file, together with any reusable class strings (`buttonVariants`, `menuItem`, `toolbarButton`).
- Use Hugeicons only: `<HugeiconsIcon icon={…} />` from `@hugeicons/react`, with glyphs from `@hugeicons/core-free-icons`. Mark decorative icons `aria-hidden`.
- `components.json` sets `rtl: true`, so use logical utilities (`ms-`, `pe-`, `start-`, `inline-end`) and flip directional glyphs with `rtl:-scale-x-100`.
- Comment sparingly. Most code gets no comment at all.
  - No docblocks that say what a component is, what it's for, or how its parts fit together. The name, the props and the demo already say that.
  - A comment earns its place only by explaining something the code can't: a workaround, a browser or Base UI quirk, or a choice that looks wrong but is deliberate. Keep it to a line or two.
  - A prop may get a one-line `/** … */` when its name alone doesn't say what it does.
  - `menu.tsx` is the reference for house style, not for comment density. Its long comments predate this rule.
- Prettier settings: no semicolons, double quotes, and Tailwind classes sorted inside `cn()` and `cva()`.
- Commit messages follow `type(scope): what changed so why`, e.g. `feat(registry): ship popover and input so a dismissible panel can be previewed and installed`. Scopes in use are `registry`, `catalog` (gallery pages and demo cards), `theme`, or the component's name.
