import { BlockDisplay } from "@/components/pages/block-display"
import { CategorySection } from "@/components/pages/category-separator"
import { InstallCommand } from "@/components/pages/install-command"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"

export default function Page() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <PageHero
        {...PAGES["/"]}
        count={cardCount("registry:block")}
        actions={<InstallCommand command="npx aiellie init" />}
      />
      <CategorySection category="chat">
        <BlockDisplay name="chat" />
      </CategorySection>
    </div>
  )
}
