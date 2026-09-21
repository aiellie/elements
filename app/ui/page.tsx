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
        description="A simple button component"
        
      >
        <ButtonDemo />
      </DemoCard>
      <DemoCard
        href="/ui/tooltip-icon-button"
        index={2}
        title="Tooltip Icon Button"
        description="A simple tooltip icon button component"
      >
        <TooltipIconButtonDemo />
      </DemoCard>
      <DemoCard
        href="/ui/menu"
        index={3}
        title="Menu"
        description="A simple menu component"
      >
        <MenuDemo />
      </DemoCard>
      <DemoCard
        href="/examples/tooltip"
        index={4}
        title="Tooltip"
        description="A simple tooltip component"
      >
        <TooltipDemo />
      </DemoCard>
      <DemoCard
        href="/ui/toolbar"
        index={5}
        title="Toolbar"
        description="A simple toolbar component"
      >
        <ToolbarDemo />
      </DemoCard>
    </div>     
  )
}
