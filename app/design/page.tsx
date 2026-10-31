import { readFile } from "node:fs/promises"
import path from "node:path"

import { DemoCard } from "@/components/pages/demo-card"
import { DesignMdDialog } from "@/components/pages/design-md-dialog"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import AvatarDemo from "@/registry/aiellie/examples/avatar-demo"
import BadgeDemo from "@/registry/aiellie/examples/badge-demo"
import BreadcrumbDemo from "@/registry/aiellie/examples/breadcrumb-demo"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import CollapsibleDemo from "@/registry/aiellie/examples/collapsible-demo"
import CommandDemo from "@/registry/aiellie/examples/command-demo"
import DialogDemo from "@/registry/aiellie/examples/dialog-demo"
import EmptyDemo from "@/registry/aiellie/examples/empty-demo"
import HoverCardDemo from "@/registry/aiellie/examples/hover-card-demo"
import InputGroupDemo from "@/registry/aiellie/examples/input-group-demo"
import InputDemo from "@/registry/aiellie/examples/input-demo"
import MarkerDemo from "@/registry/aiellie/examples/marker-demo"
import MenuDemo from "@/registry/aiellie/examples/menu-demo"
import PopoverDemo from "@/registry/aiellie/examples/popover-demo"
import ResizableDemo from "@/registry/aiellie/examples/resizable-demo"
import SeparatorDemo from "@/registry/aiellie/examples/separator-demo"
import SheetDemo from "@/registry/aiellie/examples/sheet-demo"
import SidebarDemo from "@/registry/aiellie/examples/sidebar-demo"
import SkeletonDemo from "@/registry/aiellie/examples/skeleton-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
import TextareaDemo from "@/registry/aiellie/examples/textarea-demo"
import TooltipIconButtonDemo from "@/registry/aiellie/examples/tooltip-icon-button-demo"
import TooltipDemo from "@/registry/aiellie/examples/tooltip-demo"
import TraceDemo from "@/registry/aiellie/examples/trace-demo"

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
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        <DemoCard
          href="/design/avatar"
          index={1}
          title="Avatar"
          description="A picture of someone, or their initials"
        >
          <AvatarDemo />
        </DemoCard>
        <DemoCard
          href="/design/badge"
          index={2}
          title="Badge"
          description="A short label beside something, like a plan or a status"
        >
          <BadgeDemo />
        </DemoCard>
        <DemoCard
          href="/design/breadcrumb"
          index={3}
          title="Breadcrumb"
          description="A path from a parent place to the current one"
        >
          <BreadcrumbDemo />
        </DemoCard>
        <DemoCard
          href="/design/button"
          index={4}
          title="Button"
          description="A simple button component"
        >
          <ButtonDemo />
        </DemoCard>
        <DemoCard
          href="/design/collapsible"
          index={5}
          title="Collapsible"
          description="A trigger that folds a panel open and shut in place"
        >
          <CollapsibleDemo />
        </DemoCard>
        <DemoCard
          href="/design/command"
          index={6}
          title="Command"
          description="A searchable list you move through with the keyboard"
        >
          <CommandDemo />
        </DemoCard>
        <DemoCard
          href="/design/dialog"
          index={7}
          title="Dialog"
          description="A panel in the middle of the screen, over a dimmed page"
        >
          <DialogDemo />
        </DemoCard>
        <DemoCard
          href="/design/empty"
          index={8}
          title="Empty"
          description="What a place shows before there is anything in it"
        >
          <EmptyDemo />
        </DemoCard>
        <DemoCard
          href="/design/hover-card"
          index={9}
          title="Hover Card"
          description="A glass card that opens while you hover or focus its trigger"
        >
          <HoverCardDemo />
        </DemoCard>
        <DemoCard
          href="/design/input"
          index={10}
          title="Input"
          description="A single line of text"
        >
          <InputDemo />
        </DemoCard>
        <DemoCard
          href="/design/input-group"
          index={11}
          title="Input Group"
          description="An input with icons, text or buttons inside its edge"
        >
          <InputGroupDemo />
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
          href="/design/menu"
          index={13}
          title="Menu"
          description="A menu of actions, with an optional search box"
        >
          <MenuDemo />
        </DemoCard>
        <DemoCard
          href="/design/popover"
          index={14}
          title="Popover"
          description="A glass panel beside its trigger, for small forms and details"
        >
          <PopoverDemo />
        </DemoCard>
        <DemoCard
          href="/design/resizable"
          index={15}
          title="Resizable"
          description="Panels you can resize by dragging the line between them"
        >
          <ResizableDemo />
        </DemoCard>
        <DemoCard
          href="/design/separator"
          index={16}
          title="Separator"
          description="A hairline between groups, across or down"
        >
          <SeparatorDemo />
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
          href="/design/sidebar"
          index={18}
          title="Sidebar"
          description="Groups of rows down the side of an app"
        >
          <SidebarDemo />
        </DemoCard>
        <DemoCard
          href="/design/skeleton"
          index={19}
          title="Skeleton"
          description="A placeholder that pulses while content loads"
        >
          <SkeletonDemo />
        </DemoCard>
        <DemoCard
          href="/design/status"
          index={20}
          title="Status"
          description="A labelled state pill with an optional pulse"
        >
          <StatusDemo />
        </DemoCard>
        <DemoCard
          href="/design/textarea"
          index={21}
          title="Textarea"
          description="A simple textarea component"
        >
          <TextareaDemo />
        </DemoCard>
        <DemoCard
          href="/design/tooltip"
          index={22}
          title="Tooltip"
          description="A simple tooltip component"
        >
          <TooltipDemo />
        </DemoCard>
        <DemoCard
          href="/design/tooltip-icon-button"
          index={23}
          title="Tooltip Icon Button"
          description="An icon button that carries its own tooltip and label"
        >
          <TooltipIconButtonDemo />
        </DemoCard>
        <DemoCard
          href="/design/trace"
          index={24}
          title="Trace"
          description="The steps an agent took, one line each, folding open for more"
        >
          <TraceDemo />
        </DemoCard>
      </div>
    </div>
  )
}
