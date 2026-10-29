import type { ReactNode } from "react"

import { ComponentDetailLayout } from "@/components/docs/component-detail"

export default function DetailLayout({ children }: { children: ReactNode }) {
  return (
    <ComponentDetailLayout gallery="design">{children}</ComponentDetailLayout>
  )
}
