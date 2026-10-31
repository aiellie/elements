import { DemoCard } from "@/components/pages/demo-card"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import AddMenuDemo from "@/registry/aiellie/examples/add-menu-demo"
import AttachmentsDemo from "@/registry/aiellie/examples/attachments-demo"
import BranchesMenuDemo from "@/registry/aiellie/examples/branches-menu-demo"
import CodeBlockDemo from "@/registry/aiellie/examples/code-block-demo"
import ComposerDemo from "@/registry/aiellie/examples/composer-demo"
import DateDividerDemo from "@/registry/aiellie/examples/date-divider-demo"
import DictateButtonDemo from "@/registry/aiellie/examples/dictate-button-demo"
import EditableTitleDemo from "@/registry/aiellie/examples/editable-title-demo"
import EffortMenuDemo from "@/registry/aiellie/examples/effort-menu-demo"
import FilePreviewDemo from "@/registry/aiellie/examples/file-preview-demo"
import HistoryButtonsDemo from "@/registry/aiellie/examples/history-buttons-demo"
import InlineCitationDemo from "@/registry/aiellie/examples/inline-citation-demo"
import ShareDialogDemo from "@/registry/aiellie/examples/share-dialog-demo"
import LoginFormDemo from "@/registry/aiellie/examples/login-form-demo"
import MessageDemo from "@/registry/aiellie/examples/message-demo"
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
import TemporaryChatToggleDemo from "@/registry/aiellie/examples/temporary-chat-toggle-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ThreadTranscriptDemo from "@/registry/aiellie/examples/thread-transcript-demo"
import WaveformDemo from "@/registry/aiellie/examples/waveform-demo"
import WorkInMenuDemo from "@/registry/aiellie/examples/work-in-menu-demo"
import UserMenuDemo from "@/registry/aiellie/examples/user-menu-demo"
import ResponseDemo from "@/registry/aiellie/examples/response-demo"
import MessageActionsDemo from "@/registry/aiellie/examples/message-actions-demo"
export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-16 py-8 sm:py-12">
      <PageHero
        {...PAGES["/components"]}
        count={cardCount("registry:component")}
      />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        <DemoCard
          href="/components/add-menu"
          index={1}
          title="Add Menu"
          description="A plus button that opens a menu of things to add"
        >
          <AddMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/attachments"
          index={2}
          title="Attachments"
          description="Images as small squares, other files as chips, in a row"
        >
          <AttachmentsDemo />
        </DemoCard>
        <DemoCard
          href="/components/branches-menu"
          index={3}
          title="Branches Menu"
          description="Search the branches, or create and check out a new one"
        >
          <BranchesMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/code-block"
          index={4}
          title="Code Block"
          description="A named block of code to copy, download and point at"
        >
          <CodeBlockDemo />
        </DemoCard>
        <DemoCard
          href="/components/composer"
          index={5}
          title="Composer"
          description="A simple composer component"
        >
          <ComposerDemo />
        </DemoCard>
        <DemoCard
          href="/components/date-divider"
          index={6}
          title="Date Divider"
          description="The day and time a thread picks up at, as a quiet line of text"
        >
          <DateDividerDemo />
        </DemoCard>
        <DemoCard
          href="/components/dictate-button"
          index={7}
          title="Dictate Button"
          description="Speak instead of typing, into any field"
        >
          <DictateButtonDemo />
        </DemoCard>
        <DemoCard
          href="/components/editable-title"
          index={8}
          title="Editable Title"
          description="A heading you click to rename in place"
        >
          <EditableTitleDemo />
        </DemoCard>
        <DemoCard
          href="/components/effort-menu"
          index={9}
          title="Effort Menu"
          description="How hard the model thinks, from Off to Max"
        >
          <EffortMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/file-preview"
          index={10}
          title="File Preview"
          description="A file opened in full: an image, a PDF, code in color or a folder"
        >
          <FilePreviewDemo />
        </DemoCard>
        <DemoCard
          href="/components/history-buttons"
          index={11}
          title="History Buttons"
          description="Back and forward through what you opened, with their shortcuts"
        >
          <HistoryButtonsDemo />
        </DemoCard>
        <DemoCard
          href="/components/inline-citation"
          index={12}
          title="Inline Citation"
          description="A numbered mark in the prose that names its source"
        >
          <InlineCitationDemo />
        </DemoCard>
        <DemoCard
          href="/components/login-form"
          index={13}
          title="Login Form"
          description="One form to sign in or up: an email code, Google or GitHub"
        >
          <LoginFormDemo />
        </DemoCard>
        <DemoCard
          href="/components/message"
          index={14}
          title="Message"
          description="A simple message component"
        >
          <MessageDemo />
        </DemoCard>
        <DemoCard
          href="/components/message-actions"
          index={15}
          title="Message Actions"
          description="Copy, rate, retry and more under a reply"
        >
          <MessageActionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/model-selector"
          index={16}
          title="Model Selector"
          description="A simple model selector component"
        >
          <ModelSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/nav-bars"
          index={17}
          title="Nav Bars"
          description="A rail of bars for a page's sections or a thread's turns"
        >
          <NavBarsDemo />
        </DemoCard>
        <DemoCard
          href="/components/panels"
          index={18}
          title="Panels"
          description="An app shell with resizable panels on three sides"
          wide
        >
          <PanelsDemo />
        </DemoCard>
        <DemoCard
          href="/components/plugin-selector"
          index={19}
          title="Plugin Selector"
          description="Which plugins a chat can use, turned on and off from one menu"
        >
          <PluginSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/project-selector"
          index={20}
          title="Project Selector"
          description="Which project a chat belongs to, and a menu to switch it"
        >
          <ProjectSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/quick-chat"
          index={21}
          title="Quick Chat"
          description="A compact conversation that floats over the current page"
        >
          <QuickChatDemo />
        </DemoCard>
        <DemoCard
          href="/components/reasoning"
          index={22}
          title="Reasoning"
          description="How long the model thought, folding open to show its thoughts"
        >
          <ReasoningDemo />
        </DemoCard>
        <DemoCard
          href="/components/response"
          index={23}
          title="Response"
          description="A Markdown reply set as prose, fading in as it streams"
        >
          <ResponseDemo />
        </DemoCard>
        <DemoCard
          href="/components/settings-dialog"
          index={24}
          title="Settings Dialog"
          description="Profile, appearance, and API keys in one focused dialog"
        >
          <SettingsDialogDemo />
        </DemoCard>
        <DemoCard
          href="/components/share-dialog"
          index={25}
          title="Share Dialog"
          description="Who can open it, a link to copy, and places to post it"
        >
          <ShareDialogDemo />
        </DemoCard>
        <DemoCard
          href="/components/sources"
          index={26}
          title="Sources"
          description="The pages a reply drew on, as small chips that open them"
        >
          <SourcesDemo />
        </DemoCard>
        <DemoCard
          href="/components/stream-text"
          index={27}
          title="Stream Text"
          description="A streamed reply written out word by word, at a steady pace"
        >
          <StreamTextDemo />
        </DemoCard>
        <DemoCard
          href="/components/suggestions"
          index={28}
          title="Suggestions"
          description="Prompts to start from, arriving together as a row"
        >
          <SuggestionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/temporary-chat-toggle"
          index={29}
          title="Temporary Chat Toggle"
          description="Start a chat that stays out of history"
        >
          <TemporaryChatToggleDemo />
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
          href="/components/thread"
          index={31}
          title="Thread"
          description="A simple thread component"
        >
          <ThreadDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread-transcript"
          index={32}
          title="Thread Transcript"
          description="A rail of your turns beside a thread that jumps to each one"
        >
          <ThreadTranscriptDemo />
        </DemoCard>
        <DemoCard
          href="/components/user-menu"
          index={33}
          title="User Menu"
          description="Who is signed in, and what they can do with their account"
        >
          <UserMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/waveform"
          index={34}
          title="Waveform"
          description="Live bars that follow a microphone, so you can see it hears you"
        >
          <WaveformDemo />
        </DemoCard>
        <DemoCard
          href="/components/work-in-menu"
          index={35}
          title="Work In Menu"
          description="Where work runs: local, a worktree or the cloud"
        >
          <WorkInMenuDemo />
        </DemoCard>
      </div>
    </div>
  )
}
