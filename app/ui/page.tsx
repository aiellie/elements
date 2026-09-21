import {
  Comment01Icon,
  CursorInfo02Icon,
  LayoutTopIcon,
  Menu01Icon,
  MousePointerClickIcon,
} from "@hugeicons/core-free-icons"
import { DemoCard } from "@/components/pages/demo-card"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import MenuDemo from "@/registry/aiellie/examples/menu-demo"
import TooltipDemo from "@/registry/aiellie/examples/tooltip-demo"
import TooltipIconButtonDemo from "@/registry/aiellie/examples/tooltip-icon-button-demo"
import ToolbarDemo from "@/registry/aiellie/examples/toolbar-demo"
export default function UiPage() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 py-8 sm:py-12 md:grid-cols-2 xl:grid-cols-3">
      <DemoCard
        href="/ui/button"
        index={1}
        title="Button"
        icon={MousePointerClickIcon}
        description="A simple button component"
        
      >
        <ButtonDemo />
      </DemoCard>
      <DemoCard
        href="/ui/tooltip-icon-button"
        index={2}
        title="Tooltip Icon Button"
        icon={CursorInfo02Icon}
        description="A simple tooltip icon button component"
      >
        <TooltipIconButtonDemo />
      </DemoCard>
      <DemoCard
        href="/ui/menu"
        index={3}
        title="Menu"
        icon={Menu01Icon}
        description="A simple menu component"
      >
        <MenuDemo />
      </DemoCard>
      <DemoCard
        href="/examples/tooltip"
        index={4}
        title="Tooltip"
        icon={Comment01Icon}
        description="A simple tooltip component"
      >
        <TooltipDemo />
      </DemoCard>
      <DemoCard
        href="/ui/toolbar"
        index={5}
        title="Toolbar"
        icon={LayoutTopIcon}
        description="A simple toolbar component"
      >
        <ToolbarDemo />
      </DemoCard>
    </div>     
  )
}
