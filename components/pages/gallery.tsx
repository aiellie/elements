import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { DEMOS } from "@/lib/demos"
import { docsNav, type Gallery as GalleryName } from "@/lib/docs"

// Every card on a gallery page, section by section, in the same order and with
// the same numbers as the component pages' sidebar and pager, since both read
// docsNav.
export function Gallery({ gallery }: { gallery: GalleryName }) {
  return docsNav(gallery).sections.map((section) => (
    <CategorySection key={section.category} category={section.category}>
      {section.items.map((item) => {
        const demo = DEMOS[item.name]
        if (!demo) return null
        const { Demo } = demo
        return (
          <DemoCard
            key={item.name}
            href={`/${gallery}/${item.name}`}
            index={item.index}
            title={item.title}
            description={demo.description ?? item.description}
            wide={demo.wide}
            audit
          >
            <Demo />
          </DemoCard>
        )
      })}
    </CategorySection>
  ))
}
