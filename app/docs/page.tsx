import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"

import { InstallCommand } from "@/components/pages/install-command"
import { PageHero } from "@/components/pages/page-hero"
import { PAGES } from "@/lib/constants"
import { docsSections } from "@/lib/docs"

export const metadata: Metadata = {
  title: "Docs",
  description: PAGES["/docs"].description,
}

// Each kind wears the icon of its own gallery page.
const SECTION_ICONS = {
  Blocks: PAGES["/"].icon,
  Components: PAGES["/components"].icon,
  UI: PAGES["/ui"].icon,
} as Record<string, (typeof PAGES)["/"]["icon"]>

export default function DocsPage() {
  const sections = docsSections()

  return (
    <div className="flex flex-col py-8 md:py-10">
      <PageHero {...PAGES["/docs"]} />

      <article className="typeset mt-10">
        <h2>Start a new app</h2>
        <p>
          A Next.js app with the theme and the chat page in it, ready to run.
        </p>
        <div data-not-typeset className="mt-(--typeset-flow)">
          <InstallCommand
            command="npx aiellie init my-app"
            className="w-fit max-w-full"
          />
        </div>

        <h2>Add to an app you have</h2>
        <p>
          Anything listed here installs by its name, along with whatever it
          builds on. The first run adds the <code>@aiellie</code> registry to
          your <code>components.json</code>.
        </p>
        <div data-not-typeset className="mt-(--typeset-flow)">
          <InstallCommand
            command="npx aiellie add stream-text"
            className="w-fit max-w-full"
          />
        </div>

        <h2>Browse</h2>
        <ul
          data-not-typeset
          className="mt-(--typeset-flow) grid gap-3 sm:grid-cols-3"
        >
          {sections.map((section) => {
            const first = section.items[0]
            return (
              <li key={section.title}>
                <Link
                  href={`/docs/${first?.name ?? ""}`}
                  className="flex flex-col gap-1 rounded-xl border border-border/60 p-4 transition-colors duration-80 outline-none hover:bg-muted/50 focus-visible:border-ring motion-reduce:transition-none"
                >
                  <span className="flex items-center gap-2 text-label">
                    {SECTION_ICONS[section.title] ? (
                      <HugeiconsIcon
                        aria-hidden
                        icon={SECTION_ICONS[section.title]}
                        className="size-4 text-muted-foreground"
                      />
                    ) : null}
                    {section.title}
                  </span>
                  <span className="text-caption text-muted-foreground tabular-nums">
                    {section.items.length}{" "}
                    {section.items.length === 1 ? "item" : "items"}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </article>
    </div>
  )
}
