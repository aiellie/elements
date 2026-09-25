import {
  Attachment01Icon,
  Square01Icon,
  Tag01Icon,
  UserCircleIcon,
  Comment01Icon,
  Layers01Icon,
  InputLongTextIcon,
  LayoutTwoColumnIcon,
  Loading03Icon,
  MinusSignIcon,
  MousePointerClickIcon,
  PanelRightIcon,
  SidebarLeftIcon,
  BrowserIcon,
  CommandIcon,
  InputShortTextIcon,
  DashedLineCircleIcon,
  TextIcon,
} from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import AttachmentDemo from "@/registry/aiellie/examples/attachment-demo"
import BadgeDemo from "@/registry/aiellie/examples/badge-demo"
import AvatarDemo from "@/registry/aiellie/examples/avatar-demo"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import CommandDemo from "@/registry/aiellie/examples/command-demo"
import DialogDemo from "@/registry/aiellie/examples/dialog-demo"
import PopoverDemo from "@/registry/aiellie/examples/popover-demo"
import EmptyDemo from "@/registry/aiellie/examples/empty-demo"
import InputDemo from "@/registry/aiellie/examples/input-demo"
import InputGroupDemo from "@/registry/aiellie/examples/input-group-demo"
import ResizableDemo from "@/registry/aiellie/examples/resizable-demo"
import SeparatorDemo from "@/registry/aiellie/examples/separator-demo"
import SheetDemo from "@/registry/aiellie/examples/sheet-demo"
import SidebarDemo from "@/registry/aiellie/examples/sidebar-demo"
import SkeletonDemo from "@/registry/aiellie/examples/skeleton-demo"
import TabsDemo from "@/registry/aiellie/examples/tabs-demo"
import TextareaDemo from "@/registry/aiellie/examples/textarea-demo"
import TooltipDemo from "@/registry/aiellie/examples/tooltip-demo"
export default function UiPage() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <PageHero {...PAGES["/ui"]} count={cardCount("registry:ui")} />
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
        <DemoCard
          href="/ui/input-group"
          index={4}
          title="Input Group"
          icon={InputShortTextIcon}
          description="An input with icons, text or buttons inside its edge"
        >
          <InputGroupDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="layout">
        <DemoCard
          href="/ui/resizable"
          index={5}
          title="Resizable"
          icon={LayoutTwoColumnIcon}
          description="Panels you can resize by dragging the line between them"
        >
          <ResizableDemo />
        </DemoCard>
        <DemoCard
          href="/ui/separator"
          index={6}
          title="Separator"
          icon={MinusSignIcon}
          description="A hairline between groups, across or down"
        >
          <SeparatorDemo />
        </DemoCard>
        <DemoCard
          href="/ui/sidebar"
          index={7}
          title="Sidebar"
          icon={SidebarLeftIcon}
          description="Groups of rows down the side of an app"
        >
          <SidebarDemo />
        </DemoCard>
        <DemoCard
          href="/ui/tabs"
          index={8}
          title="Tabs"
          icon={BrowserIcon}
          description="Views to switch between, one at a time"
        >
          <TabsDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="overlays">
        <DemoCard
          href="/ui/tooltip"
          index={9}
          title="Tooltip"
          icon={Comment01Icon}
          description="A simple tooltip component"
        >
          <TooltipDemo />
        </DemoCard>
        <DemoCard
          href="/ui/sheet"
          index={10}
          title="Sheet"
          icon={PanelRightIcon}
          description="A simple sheet component"
        >
          <SheetDemo />
        </DemoCard>
        <DemoCard
          href="/ui/dialog"
          index={11}
          title="Dialog"
          icon={Square01Icon}
          description="A panel in the middle of the screen, over a dimmed page"
        >
          <DialogDemo />
        </DemoCard>
        <DemoCard
          href="/ui/popover"
          index={12}
          title="Popover"
          icon={Layers01Icon}
          description="A glass panel beside its trigger, for small forms and details"
        >
          <PopoverDemo />
        </DemoCard>
        <DemoCard
          href="/ui/command"
          index={13}
          title="Command"
          icon={CommandIcon}
          description="A searchable list you move through with the keyboard"
        >
          <CommandDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="feedback">
        <DemoCard
          href="/ui/skeleton"
          index={14}
          title="Skeleton"
          icon={Loading03Icon}
          description="A placeholder that pulses while content loads"
        >
          <SkeletonDemo />
        </DemoCard>
        <DemoCard
          href="/ui/avatar"
          index={15}
          title="Avatar"
          icon={UserCircleIcon}
          description="A picture of someone, or their initials"
        >
          <AvatarDemo />
        </DemoCard>
        <DemoCard
          href="/ui/badge"
          index={16}
          title="Badge"
          icon={Tag01Icon}
          description="A short label beside something, like a plan or a status"
        >
          <BadgeDemo />
        </DemoCard>
        <DemoCard
          href="/ui/empty"
          index={17}
          title="Empty"
          icon={DashedLineCircleIcon}
          description="What a place shows before there is anything in it"
        >
          <EmptyDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="chat">
        <DemoCard
          href="/ui/attachment"
          index={18}
          title="Attachment"
          icon={Attachment01Icon}
          description="A file as a chip, with its upload state"
        >
          <AttachmentDemo />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
