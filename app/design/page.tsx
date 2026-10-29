import { readFile } from "node:fs/promises"
import path from "node:path"

import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { DesignMdDialog } from "@/components/pages/design-md-dialog"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import BadgeDemo from "@/registry/aiellie/examples/badge-demo"
import AvatarDemo from "@/registry/aiellie/examples/avatar-demo"
import BreadcrumbDemo from "@/registry/aiellie/examples/breadcrumb-demo"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import CommandDemo from "@/registry/aiellie/examples/command-demo"
import DialogDemo from "@/registry/aiellie/examples/dialog-demo"
import PopoverDemo from "@/registry/aiellie/examples/popover-demo"
import HoverCardDemo from "@/registry/aiellie/examples/hover-card-demo"
import EmptyDemo from "@/registry/aiellie/examples/empty-demo"
import InputDemo from "@/registry/aiellie/examples/input-demo"
import InputGroupDemo from "@/registry/aiellie/examples/input-group-demo"
import MarkerDemo from "@/registry/aiellie/examples/marker-demo"
import ResizableDemo from "@/registry/aiellie/examples/resizable-demo"
import SeparatorDemo from "@/registry/aiellie/examples/separator-demo"
import SheetDemo from "@/registry/aiellie/examples/sheet-demo"
import SidebarDemo from "@/registry/aiellie/examples/sidebar-demo"
import SkeletonDemo from "@/registry/aiellie/examples/skeleton-demo"
import TabsDemo from "@/registry/aiellie/examples/tabs-demo"
import ComboboxDemo from "@/registry/aiellie/examples/combobox-demo"
import ToggleDemo from "@/registry/aiellie/examples/toggle-demo"
import ToggleGroupDemo from "@/registry/aiellie/examples/toggle-group-demo"
import TextareaDemo from "@/registry/aiellie/examples/textarea-demo"
import TooltipDemo from "@/registry/aiellie/examples/tooltip-demo"
import MenuDemo from "@/registry/aiellie/examples/menu-demo"
import MeterDemo from "@/registry/aiellie/examples/meter-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
import ToastDemo from "@/registry/aiellie/examples/toast-demo"
import ToolbarDemo from "@/registry/aiellie/examples/toolbar-demo"
import TooltipIconButtonDemo from "@/registry/aiellie/examples/tooltip-icon-button-demo"
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
      <CategorySection category="actions">
        <DemoCard
          href="/design/button"
          index={1}
          title="Button"
          description="A simple button component"
        >
          <ButtonDemo />
        </DemoCard>
        <DemoCard
          href="/design/toggle"
          index={2}
          title="Toggle"
          description="A button that stays pressed until pressed again"
        >
          <ToggleDemo />
        </DemoCard>
        <DemoCard
          href="/design/toggle-group"
          index={3}
          title="Toggle Group"
          description="Toggles where one or several can be on"
        >
          <ToggleGroupDemo />
        </DemoCard>
        <DemoCard
          href="/design/toolbar"
          index={4}
          title="Toolbar"
          description="A row of controls that name themselves in a tooltip"
        >
          <ToolbarDemo />
        </DemoCard>
        <DemoCard
          href="/design/tooltip-icon-button"
          index={5}
          title="Tooltip Icon Button"
          description="An icon button that carries its own tooltip and label"
        >
          <TooltipIconButtonDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="inputs">
        <DemoCard
          href="/design/textarea"
          index={6}
          title="Textarea"
          description="A simple textarea component"
        >
          <TextareaDemo />
        </DemoCard>
        <DemoCard
          href="/design/input"
          index={7}
          title="Input"
          description="A single line of text"
        >
          <InputDemo />
        </DemoCard>
        <DemoCard
          href="/design/input-group"
          index={8}
          title="Input Group"
          description="An input with icons, text or buttons inside its edge"
        >
          <InputGroupDemo />
        </DemoCard>
        <DemoCard
          href="/design/combobox"
          index={9}
          title="Combobox"
          description="An input that filters a list and picks from it"
        >
          <ComboboxDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="layout">
        <DemoCard
          href="/design/resizable"
          index={10}
          title="Resizable"
          description="Panels you can resize by dragging the line between them"
        >
          <ResizableDemo />
        </DemoCard>
        <DemoCard
          href="/design/separator"
          index={11}
          title="Separator"
          description="A hairline between groups, across or down"
        >
          <SeparatorDemo />
        </DemoCard>
        <DemoCard
          href="/design/marker"
          index={12}
          title="Marker"
          description="A quiet line of text, on its own or between rules"
        >
          <MarkerDemo />
        </DemoCard>
        <DemoCard
          href="/design/sidebar"
          index={13}
          title="Sidebar"
          description="Groups of rows down the side of an app"
        >
          <SidebarDemo />
        </DemoCard>
        <DemoCard
          href="/design/tabs"
          index={14}
          title="Tabs"
          description="Views to switch between, one at a time"
        >
          <TabsDemo />
        </DemoCard>
        <DemoCard
          href="/design/breadcrumb"
          index={15}
          title="Breadcrumb"
          description="A path from a parent place to the current one"
        >
          <BreadcrumbDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="overlays">
        <DemoCard
          href="/design/tooltip"
          index={16}
          title="Tooltip"
          description="A simple tooltip component"
        >
          <TooltipDemo />
        </DemoCard>
        <DemoCard
          href="/design/sheet"
          index={17}
          title="Sheet"
          description="A simple sheet component"
        >
          <SheetDemo />
        </DemoCard>
        <DemoCard
          href="/design/dialog"
          index={18}
          title="Dialog"
          description="A panel in the middle of the screen, over a dimmed page"
        >
          <DialogDemo />
        </DemoCard>
        <DemoCard
          href="/design/popover"
          index={19}
          title="Popover"
          description="A glass panel beside its trigger, for small forms and details"
        >
          <PopoverDemo />
        </DemoCard>
        <DemoCard
          href="/design/hover-card"
          index={20}
          title="Hover Card"
          description="A glass card that opens while you hover or focus its trigger"
        >
          <HoverCardDemo />
        </DemoCard>
        <DemoCard
          href="/design/command"
          index={21}
          title="Command"
          description="A searchable list you move through with the keyboard"
        >
          <CommandDemo />
        </DemoCard>
        <DemoCard
          href="/design/menu"
          index={22}
          title="Menu"
          description="A menu of actions, with an optional search box"
        >
          <MenuDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="feedback">
        <DemoCard
          href="/design/skeleton"
          index={23}
          title="Skeleton"
          description="A placeholder that pulses while content loads"
        >
          <SkeletonDemo />
        </DemoCard>
        <DemoCard
          href="/design/avatar"
          index={24}
          title="Avatar"
          description="A picture of someone, or their initials"
        >
          <AvatarDemo />
        </DemoCard>
        <DemoCard
          href="/design/badge"
          index={25}
          title="Badge"
          description="A short label beside something, like a plan or a status"
        >
          <BadgeDemo />
        </DemoCard>
        <DemoCard
          href="/design/empty"
          index={26}
          title="Empty"
          description="What a place shows before there is anything in it"
        >
          <EmptyDemo />
        </DemoCard>
        <DemoCard
          href="/design/status"
          index={27}
          title="Status"
          description="A labelled state pill with an optional pulse"
        >
          <StatusDemo />
        </DemoCard>
        <DemoCard
          href="/design/meter"
          index={28}
          title="Meter"
          description="How full something is, like a context window or a credit balance"
        >
          <MeterDemo />
        </DemoCard>
        <DemoCard
          href="/design/toast"
          index={29}
          title="Toast"
          description="Stacked notifications with actions and swipe to dismiss"
        >
          <ToastDemo />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
