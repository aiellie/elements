import { Gallery } from "@/components/pages/gallery"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"

export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <PageHero
        {...PAGES["/components"]}
        count={cardCount("registry:component")}
      />
      <Gallery gallery="components" />
    </div>
  )
}
