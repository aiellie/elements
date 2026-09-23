import {
  Comment01Icon,
  InputLongTextIcon,
  LayoutTwoColumnIcon,
  Loading03Icon,
  MinusSignIcon,
  MousePointerClickIcon,
  PanelRightIcon,
  SidebarLeftIcon,
  TextIcon,
} from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import InputDemo from "@/registry/aiellie/examples/input-demo"
import ResizableDemo from "@/registry/aiellie/examples/resizable-demo"
import SeparatorDemo from "@/registry/aiellie/examples/separator-demo"
import SheetDemo from "@/registry/aiellie/examples/sheet-demo"
import SidebarDemo from "@/registry/aiellie/examples/sidebar-demo"
import SkeletonDemo from "@/registry/aiellie/examples/skeleton-demo"
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
        <DemoCard
          href="/ui/input"
          index={3}
          title="Input"
          icon={TextIcon}
          description="A single line of text"
        >
          <InputDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="layout">
        <DemoCard
          href="/ui/resizable"
          index={4}
          title="Resizable"
          icon={LayoutTwoColumnIcon}
          description="Panels you can resize by dragging the line between them"
        >
          <ResizableDemo />
        </DemoCard>
        <DemoCard
          href="/ui/separator"
          index={5}
          title="Separator"
          icon={MinusSignIcon}
          description="A hairline between groups, across or down"
        >
          <SeparatorDemo />
        </DemoCard>
        <DemoCard
          href="/ui/sidebar"
          index={6}
          title="Sidebar"
          icon={SidebarLeftIcon}
          description="Groups of rows down the side of an app"
        >
          <SidebarDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="overlays">
        <DemoCard
          href="/ui/tooltip"
          index={7}
          title="Tooltip"
          icon={Comment01Icon}
          description="A simple tooltip component"
        >
          <TooltipDemo />
        </DemoCard>
        <DemoCard
          href="/ui/sheet"
          index={8}
          title="Sheet"
          icon={PanelRightIcon}
          description="A simple sheet component"
        >
          <SheetDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="feedback">
        <DemoCard
          href="/ui/skeleton"
          index={9}
          title="Skeleton"
          icon={Loading03Icon}
          description="A placeholder that pulses while content loads"
        >
          <SkeletonDemo />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
