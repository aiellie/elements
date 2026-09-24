import type { ReactNode } from "react"

import { SiteFooter } from "@/components/shared/site-footer"
import { SiteHeader } from "@/components/shared/site-header"
import { CONTAINER } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function DocsLayout({
  children,
}: {
  children: ReactNode
}): React.ReactElement {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className={cn(CONTAINER, "flex-1")}>{children}</main>
      <SiteFooter />
    </div>
  )
}
