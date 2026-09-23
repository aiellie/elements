import {
  Activity03Icon,
  AiBrain01Icon,
  CursorInfo02Icon,
  LayoutThreeColumnIcon,
  LayoutTopIcon,
  Menu01Icon,
  Message01Icon,
  MessageEdit01Icon,
  MessageMultiple01Icon,
} from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import ComposerDemo from "@/registry/aiellie/examples/composer-demo"
import MenuDemo from "@/registry/aiellie/examples/menu-demo"
import MessageDemo from "@/registry/aiellie/examples/message-demo"
import PanelsDemo from "@/registry/aiellie/examples/panels-demo"
import ModelSelectorDemo from "@/registry/aiellie/examples/model-selector-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ToolbarDemo from "@/registry/aiellie/examples/toolbar-demo"
import TooltipIconButtonDemo from "@/registry/aiellie/examples/tooltip-icon-button-demo"
export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <CategorySection category="actions">
        <DemoCard
          href="/components/tooltip-icon-button"
          index={1}
          title="Tooltip Icon Button"
          icon={CursorInfo02Icon}
          description="A simple tooltip icon button component"
        >
          <TooltipIconButtonDemo />
        </DemoCard>
        <DemoCard
          href="/components/toolbar"
          index={2}
          title="Toolbar"
          icon={LayoutTopIcon}
          description="A simple toolbar component"
        >
          <ToolbarDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="inputs">
        <DemoCard
          href="/components/model-selector"
          index={3}
          title="Model Selector"
          icon={AiBrain01Icon}
          description="A simple model selector component"
        >
          <ModelSelectorDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="layout">
        <DemoCard
          href="/components/panels"
          index={4}
          title="Panels"
          icon={LayoutThreeColumnIcon}
          description="An app shell with resizable panels on three sides"
          wide
        >
          <PanelsDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="overlays">
        <DemoCard
          href="/components/menu"
          index={5}
          title="Menu"
          icon={Menu01Icon}
          description="A simple menu component"
        >
          <MenuDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="feedback">
        <DemoCard
          href="/components/status"
          index={6}
          title="Status"
          icon={Activity03Icon}
          description="A simple status component"
        >
          <StatusDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="chat">
        <DemoCard
          href="/components/composer"
          index={7}
          title="Composer"
          icon={MessageEdit01Icon}
          description="A simple composer component"
        >
          <ComposerDemo />
        </DemoCard>
        <DemoCard
          href="/components/message"
          index={8}
          title="Message"
          icon={Message01Icon}
          description="A simple message component"
        >
          <MessageDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread"
          index={9}
          title="Thread"
          icon={MessageMultiple01Icon}
          description="A simple thread component"
        >
          <ThreadDemo />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
