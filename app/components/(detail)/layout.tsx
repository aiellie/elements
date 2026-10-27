import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ComponentSidebar } from "@/components/docs/component-sidebar"

export default function ComponentDetailLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="pt-16 pb-32 md:pt-20 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <ComponentSidebar />
      <article className="min-w-0">
        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-caption text-muted-foreground transition-colors duration-80 hover:text-foreground motion-reduce:transition-none lg:hidden"
        >
          <HugeiconsIcon
            aria-hidden
            icon={ArrowLeft01Icon}
            className="size-3.5 rtl:-scale-x-100"
          />
          Components
        </Link>
        {children}
      </article>
    </div>
  )
}
