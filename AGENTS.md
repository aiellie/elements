# Repository Guidelines

## Project Structure & Module Organization

This pnpm workspace contains the Next.js 16 catalog and `aiellie` CLI. Routes and global styles live in `app/`; site-only components in `components/`; metadata and helpers in `lib/`. Publishable source belongs in `registry/aiellie/`: use `ui/` for restyled shadcn primitives, `components/` for aiellie components, `blocks/` for pages, and `examples/` for demos. Register every publishable item and its dependencies in `registry.json`. The plain-JavaScript CLI lives in `packages/cli/`, with its starter app in `packages/cli/template/`. Treat `public/r/` as generated output.

## Build, Test, and Development Commands

- `pnpm install` installs workspace dependencies (Node 20.9 or newer).
- `pnpm dev` runs the catalog locally at `http://localhost:3000`.
- `pnpm registry:build` compiles `registry.json` into installable registry JSON.
- `pnpm typecheck` runs strict TypeScript checks without emitting files.
- `pnpm lint` runs ESLint with the Next.js core-web-vitals and TypeScript rules.
- `pnpm build` builds the registry, then creates the production Next.js bundle.
- `pnpm exec prettier --write <files>` formats only files changed in the current work.

Run `pnpm typecheck` and `pnpm lint` before submitting. Avoid `pnpm format` for scoped changes because it rewrites the entire repository.

## Coding Style & Naming Conventions

Use TypeScript/TSX, two-space indentation, double quotes, and no semicolons. Prettier and its Tailwind plugin own formatting and class ordering. Before changing Next.js code, consult the relevant Next 16 guide in `node_modules/next/dist/docs/`; its conventions differ from older releases. Use kebab-case filenames such as `model-selector.tsx`; React components use PascalCase. Registry components should set `data-slot` attributes, use logical RTL-safe utilities (`ms-`, `pe-`), and import dependencies through `@/registry/aiellie/...`. Keep basenames unique because the installer rewrites imports by filename. Use Hugeicons and reserve comments for non-obvious constraints.

## Testing Guidelines

There is currently no automated test suite or coverage threshold. Validate changes with `pnpm typecheck`, `pnpm lint`, and `pnpm build` when registry or build behavior changes. Visually exercise affected demos in light and dark themes. New publishable UI or components should include an `examples/<name>-demo.tsx`, a gallery card, and a `lib/demos.tsx` entry.

## Commit & Pull Request Guidelines

Follow `type(scope): what changed so why`, as in `feat(registry): add tooltip so actions can explain themselves`. Common types are `feat`, `style`, and `fix`; scopes include `registry`, `catalog`, `theme`, or the affected component. Pull requests should summarize user-visible behavior, list verification commands, link relevant issues, and include screenshots or recordings for visual changes. Note registry additions and dependency updates explicitly.
