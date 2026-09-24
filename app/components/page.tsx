import {
  Activity03Icon,
  AudioWave01Icon,
  AddCircleIcon,
  AiBrain01Icon,
  BubbleChatTemporaryIcon,
  CursorInfo02Icon,
  DashboardSpeed02Icon,
  HelpCircleIcon,
  LayoutThreeColumnIcon,
  LayoutTopIcon,
  Mic01Icon,
  Menu01Icon,
  Message01Icon,
  MessageEdit01Icon,
  MessageMultiple01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons"
import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import AddMenuDemo from "@/registry/aiellie/examples/add-menu-demo"
import DictateButtonDemo from "@/registry/aiellie/examples/dictate-button-demo"
import HelpMenuDemo from "@/registry/aiellie/examples/help-menu-demo"
import ComposerDemo from "@/registry/aiellie/examples/composer-demo"
import MenuDemo from "@/registry/aiellie/examples/menu-demo"
import MeterDemo from "@/registry/aiellie/examples/meter-demo"
import MessageDemo from "@/registry/aiellie/examples/message-demo"
import PanelsDemo from "@/registry/aiellie/examples/panels-demo"
import ModelSelectorDemo from "@/registry/aiellie/examples/model-selector-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
import TemporaryChatToggleDemo from "@/registry/aiellie/examples/temporary-chat-toggle-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ToolbarDemo from "@/registry/aiellie/examples/toolbar-demo"
import WaveformDemo from "@/registry/aiellie/examples/waveform-demo"
import UserMenuDemo from "@/registry/aiellie/examples/user-menu-demo"
import TooltipIconButtonDemo from "@/registry/aiellie/examples/tooltip-icon-button-demo"
export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <PageHero
        {...PAGES["/components"]}
        count={cardCount("registry:component")}
      />
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
          href="/components/add-menu"
          index={2}
          title="Add Menu"
          icon={AddCircleIcon}
          description="A plus button that opens a menu of things to add"
        >
          <AddMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/toolbar"
          index={3}
          title="Toolbar"
          icon={LayoutTopIcon}
          description="A simple toolbar component"
        >
          <ToolbarDemo />
        </DemoCard>
        <DemoCard
          href="/components/user-menu"
          index={4}
          title="User Menu"
          icon={UserAccountIcon}
          description="Who is signed in, and what they can do with their account"
        >
          <UserMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/help-menu"
          index={5}
          title="Help Menu"
          icon={HelpCircleIcon}
          description="Help, shortcuts and policies behind one button"
        >
          <HelpMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/temporary-chat-toggle"
          index={6}
          title="Temporary Chat Toggle"
          icon={BubbleChatTemporaryIcon}
          description="Start a chat that stays out of history"
        >
          <TemporaryChatToggleDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="inputs">
        <DemoCard
          href="/components/model-selector"
          index={7}
          title="Model Selector"
          icon={AiBrain01Icon}
          description="A simple model selector component"
        >
          <ModelSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/dictate-button"
          index={8}
          title="Dictate Button"
          icon={Mic01Icon}
          description="Speak instead of typing, into any field"
        >
          <DictateButtonDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="layout">
        <DemoCard
          href="/components/panels"
          index={9}
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
          index={10}
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
          index={11}
          title="Status"
          icon={Activity03Icon}
          description="A simple status component"
        >
          <StatusDemo />
        </DemoCard>
        <DemoCard
          href="/components/meter"
          index={12}
          title="Meter"
          icon={DashboardSpeed02Icon}
          description="How full something is, like a context window or a credit balance"
        >
          <MeterDemo />
        </DemoCard>
        <DemoCard
          href="/components/waveform"
          index={13}
          title="Waveform"
          icon={AudioWave01Icon}
          description="Live bars that follow a microphone, so you can see it hears you"
        >
          <WaveformDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="chat">
        <DemoCard
          href="/components/composer"
          index={14}
          title="Composer"
          icon={MessageEdit01Icon}
          description="A simple composer component"
        >
          <ComposerDemo />
        </DemoCard>
        <DemoCard
          href="/components/message"
          index={15}
          title="Message"
          icon={Message01Icon}
          description="A simple message component"
        >
          <MessageDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread"
          index={16}
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
