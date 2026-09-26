import type { ReactNode } from "react"

import { DocsMenu, DocsSidebar } from "@/components/docs/docs-sidebar"
import { SiteFooter } from "@/components/shared/site-footer"
import { SiteHeader } from "@/components/shared/site-header"
import { CONTAINER } from "@/lib/constants"
import { docsSections } from "@/lib/docs"
import { cn } from "@/lib/utils"

export default function DocsLayout({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  const sections = docsSections()

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <div className={cn(CONTAINER, "flex flex-1 gap-10")}>
        {/* Stays in place under the header while the page scrolls. */}
        <aside className="sticky top-12 hidden h-[calc(100svh-3rem)] w-56 shrink-0 scroll-fade-y overflow-y-auto overscroll-contain py-8 md:block">
          <DocsSidebar sections={sections} />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <DocsMenu sections={sections} className="mt-6 md:hidden" />
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
