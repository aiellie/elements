import {
  Comment01Icon,
  MousePointerClickIcon,
} from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import TooltipDemo from "@/registry/aiellie/examples/tooltip-demo"
export default function UiPage() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <CategorySection category="actions">
        <DemoCard
          href="/ui/button"
          index={1}
          title="Button"
          icon={MousePointerClickIcon}
          description="A simple button component"
        >
          <ButtonDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="overlays">
        <DemoCard
          href="/ui/tooltip"
          index={2}
          title="Tooltip"
          icon={Comment01Icon}
          description="A simple tooltip component"
        >
          <TooltipDemo />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
