import type { Metadata } from "next"

import { ComingSoon } from "@/components/pages/ComingSoon"
import { PAGES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Docs",
  description: PAGES["/docs"].description,
}

export default function DocsPage() {
  return <ComingSoon {...PAGES["/docs"]} />
}
