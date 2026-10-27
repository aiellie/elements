import { CategorySection } from "@/components/pages/category-separator"
import { DemoCard } from "@/components/pages/demo-card"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import AddMenuDemo from "@/registry/aiellie/examples/add-menu-demo"
import AttachmentsDemo from "@/registry/aiellie/examples/attachments-demo"
import EditableTitleDemo from "@/registry/aiellie/examples/editable-title-demo"
import FilePreviewDemo from "@/registry/aiellie/examples/file-preview-demo"
import HistoryButtonsDemo from "@/registry/aiellie/examples/history-buttons-demo"
import ShareDialogDemo from "@/registry/aiellie/examples/share-dialog-demo"
import BranchesMenuDemo from "@/registry/aiellie/examples/branches-menu-demo"
import DictateButtonDemo from "@/registry/aiellie/examples/dictate-button-demo"
import HelpMenuDemo from "@/registry/aiellie/examples/help-menu-demo"
import ComposerDemo from "@/registry/aiellie/examples/composer-demo"
import MeterDemo from "@/registry/aiellie/examples/meter-demo"
import MessageDemo from "@/registry/aiellie/examples/message-demo"
import DateDividerDemo from "@/registry/aiellie/examples/date-divider-demo"
import NavBarsDemo from "@/registry/aiellie/examples/nav-bars-demo"
import PanelsDemo from "@/registry/aiellie/examples/panels-demo"
import PluginSelectorDemo from "@/registry/aiellie/examples/plugin-selector-demo"
import ProjectSelectorDemo from "@/registry/aiellie/examples/project-selector-demo"
import QuickChatDemo from "@/registry/aiellie/examples/quick-chat-demo"
import ReasoningDemo from "@/registry/aiellie/examples/reasoning-demo"
import ThinkingIndicatorDemo from "@/registry/aiellie/examples/thinking-indicator-demo"
import SourcesDemo from "@/registry/aiellie/examples/sources-demo"
import SuggestionsDemo from "@/registry/aiellie/examples/suggestions-demo"
import SettingsDialogDemo from "@/registry/aiellie/examples/settings-dialog-demo"
import StreamTextDemo from "@/registry/aiellie/examples/stream-text-demo"
import ModelSelectorDemo from "@/registry/aiellie/examples/model-selector-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
import TemporaryChatToggleDemo from "@/registry/aiellie/examples/temporary-chat-toggle-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ThreadTranscriptDemo from "@/registry/aiellie/examples/thread-transcript-demo"
import WaveformDemo from "@/registry/aiellie/examples/waveform-demo"
import WorkInMenuDemo from "@/registry/aiellie/examples/work-in-menu-demo"
import UserMenuDemo from "@/registry/aiellie/examples/user-menu-demo"
export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <PageHero
        {...PAGES["/components"]}
        count={cardCount("registry:component")}
      />
      <CategorySection category="actions">
        <DemoCard
          href="/components/add-menu"
          index={1}
          title="Add Menu"
          description="A plus button that opens a menu of things to add"
        >
          <AddMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/user-menu"
          index={2}
          title="User Menu"
          description="Who is signed in, and what they can do with their account"
        >
          <UserMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/help-menu"
          index={3}
          title="Help Menu"
          description="Help, shortcuts and policies behind one button"
        >
          <HelpMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/temporary-chat-toggle"
          index={4}
          title="Temporary Chat Toggle"
          description="Start a chat that stays out of history"
        >
          <TemporaryChatToggleDemo />
        </DemoCard>
        <DemoCard
          href="/components/history-buttons"
          index={5}
          title="History Buttons"
          description="Back and forward through what you opened, with their shortcuts"
        >
          <HistoryButtonsDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="inputs">
        <DemoCard
          href="/components/model-selector"
          index={6}
          title="Model Selector"
          description="A simple model selector component"
        >
          <ModelSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/project-selector"
          index={7}
          title="Project Selector"
          description="Which project a chat belongs to, and a menu to switch it"
        >
          <ProjectSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/plugin-selector"
          index={8}
          title="Plugin Selector"
          description="Which plugins a chat can use, turned on and off from one menu"
        >
          <PluginSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/work-in-menu"
          index={9}
          title="Work In Menu"
          description="Where work runs: local, a worktree or the cloud"
        >
          <WorkInMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/branches-menu"
          index={10}
          title="Branches Menu"
          description="Search the branches, or create and check out a new one"
        >
          <BranchesMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/dictate-button"
          index={11}
          title="Dictate Button"
          description="Speak instead of typing, into any field"
        >
          <DictateButtonDemo />
        </DemoCard>
        <DemoCard
          href="/components/editable-title"
          index={12}
          title="Editable Title"
          description="A heading you click to rename in place"
        >
          <EditableTitleDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="layout">
        <DemoCard
          href="/components/panels"
          index={13}
          title="Panels"
          description="An app shell with resizable panels on three sides"
          wide
        >
          <PanelsDemo />
        </DemoCard>
        <DemoCard
          href="/components/nav-bars"
          index={14}
          title="Nav Bars"
          description="A rail of bars for a page's sections or a thread's turns"
        >
          <NavBarsDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="overlays">
        <DemoCard
          href="/components/settings-dialog"
          index={15}
          title="Settings Dialog"
          description="Profile, appearance, and API keys in one focused dialog"
        >
          <SettingsDialogDemo />
        </DemoCard>
        <DemoCard
          href="/components/share-dialog"
          index={16}
          title="Share Dialog"
          description="Who can open it, a link to copy, and places to post it"
        >
          <ShareDialogDemo />
        </DemoCard>
        <DemoCard
          href="/components/file-preview"
          index={17}
          title="File Preview"
          description="A file opened in full: an image, a PDF, code in color or a folder"
        >
          <FilePreviewDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="feedback">
        <DemoCard
          href="/components/status"
          index={18}
          title="Status"
          description="A simple status component"
        >
          <StatusDemo />
        </DemoCard>
        <DemoCard
          href="/components/meter"
          index={19}
          title="Meter"
          description="How full something is, like a context window or a credit balance"
        >
          <MeterDemo />
        </DemoCard>
        <DemoCard
          href="/components/waveform"
          index={20}
          title="Waveform"
          description="Live bars that follow a microphone, so you can see it hears you"
        >
          <WaveformDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="chat">
        <DemoCard
          href="/components/composer"
          index={21}
          title="Composer"
          description="A simple composer component"
        >
          <ComposerDemo />
        </DemoCard>
        <DemoCard
          href="/components/attachments"
          index={22}
          title="Attachments"
          description="Images as small squares, other files as chips, in a row"
        >
          <AttachmentsDemo />
        </DemoCard>
        <DemoCard
          href="/components/message"
          index={23}
          title="Message"
          description="A simple message component"
        >
          <MessageDemo />
        </DemoCard>
        <DemoCard
          href="/components/date-divider"
          index={24}
          title="Date Divider"
          description="The day and time a thread picks up at, as a quiet line of text"
        >
          <DateDividerDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread"
          index={25}
          title="Thread"
          description="A simple thread component"
        >
          <ThreadDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread-transcript"
          index={26}
          title="Thread Transcript"
          description="A rail of your turns beside a thread that jumps to each one"
        >
          <ThreadTranscriptDemo />
        </DemoCard>
        <DemoCard
          href="/components/quick-chat"
          index={27}
          title="Quick Chat"
          description="A compact conversation that floats over the current page"
        >
          <QuickChatDemo />
        </DemoCard>
        <DemoCard
          href="/components/stream-text"
          index={28}
          title="Stream Text"
          description="A streamed reply written out word by word, at a steady pace"
        >
          <StreamTextDemo />
        </DemoCard>
        <DemoCard
          href="/components/reasoning"
          index={29}
          title="Reasoning"
          description="How long the model thought, folding open to show its thoughts"
        >
          <ReasoningDemo />
        </DemoCard>
        <DemoCard
          href="/components/thinking-indicator"
          index={30}
          title="Thinking Indicator"
          description="What a reply is doing before its first word, as a live dot and a shimmer"
        >
          <ThinkingIndicatorDemo />
        </DemoCard>
        <DemoCard
          href="/components/sources"
          index={31}
          title="Sources"
          description="The pages a reply drew on, as small chips that open them"
        >
          <SourcesDemo />
        </DemoCard>
        <DemoCard
          href="/components/suggestions"
          index={32}
          title="Suggestions"
          description="Prompts to start from, arriving together as a row"
        >
          <SuggestionsDemo />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
