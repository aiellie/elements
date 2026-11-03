import { readFile } from "node:fs/promises"
import path from "node:path"

import { DesignMdDialog } from "@/components/pages/design-md-dialog"
import { Gallery } from "@/components/pages/gallery"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"

export default async function DesignPage() {
  const designMd = await readFile(
    path.join(process.cwd(), ".claude/skills/design/SKILL.md"),
    "utf8"
  )

  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <PageHero
        {...PAGES["/design"]}
        count={cardCount("registry:ui")}
        actions={<DesignMdDialog markdown={designMd} />}
      />
      <Gallery gallery="design" />
    </div>
  )
}
