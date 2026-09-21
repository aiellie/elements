import {
  Comment01Icon,
  InputLongTextIcon,
  MousePointerClickIcon,
  PanelRightIcon,
} from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import SheetDemo from "@/registry/aiellie/examples/sheet-demo"
import TextareaDemo from "@/registry/aiellie/examples/textarea-demo"
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
      <CategorySection category="inputs">
        <DemoCard
          href="/ui/textarea"
          index={2}
          title="Textarea"
          icon={InputLongTextIcon}
          description="A simple textarea component"
        >
          <TextareaDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="overlays">
        <DemoCard
          href="/ui/tooltip"
          index={3}
          title="Tooltip"
          icon={Comment01Icon}
          description="A simple tooltip component"
        >
          <TooltipDemo />
        </DemoCard>
        <DemoCard
          href="/ui/sheet"
          index={4}
          title="Sheet"
          icon={PanelRightIcon}
          description="A simple sheet component"
        >
          <SheetDemo />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
