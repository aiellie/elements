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
import AttachmentDemo from "@/registry/aiellie/examples/attachment-demo"
import BubbleDemo from "@/registry/aiellie/examples/bubble-demo"
import ContextMeterDemo from "@/registry/aiellie/examples/context-meter-demo"
import EmojiSelectorDemo from "@/registry/aiellie/examples/emoji-selector-demo"
import FileAttachmentDemo from "@/registry/aiellie/examples/file-attachment-demo"
import MarkdownDemo from "@/registry/aiellie/examples/markdown-demo"
import MessageScrollerDemo from "@/registry/aiellie/examples/message-scroller-demo"
import VoiceDividerDemo from "@/registry/aiellie/examples/voice-divider-demo"
import WebSearchDemo from "@/registry/aiellie/examples/web-search-demo"
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
          href="/components/attachment"
          index={2}
          title="Attachment"
          description="An image square or a file chip, in a row of several"
        >
          <AttachmentDemo />
        </DemoCard>
        <DemoCard
          href="/components/attachments"
          index={3}
          title="Attachments"
          description="Images as small squares, other files as chips, in a row"
        >
          <AttachmentsDemo />
        </DemoCard>
        <DemoCard
          href="/components/branches-menu"
          index={4}
          title="Branches Menu"
          description="Search the branches, or create and check out a new one"
        >
          <BranchesMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/bubble"
          index={5}
          title="Bubble"
          description="The bubble a message sits in, grouped with its neighbours"
        >
          <BubbleDemo />
        </DemoCard>
        <DemoCard
          href="/components/code-block"
          index={6}
          title="Code Block"
          description="A named block of code to copy, download and point at"
        >
          <CodeBlockDemo />
        </DemoCard>
        <DemoCard
          href="/components/composer"
          index={7}
          title="Composer"
          description="A simple composer component"
        >
          <ComposerDemo />
        </DemoCard>
        <DemoCard
          href="/components/context-meter"
          index={8}
          title="Context Meter"
          description="How much of the context a chat has used, and its cost"
        >
          <ContextMeterDemo />
        </DemoCard>
        <DemoCard
          href="/components/date-divider"
          index={9}
          title="Date Divider"
          description="The day and time a thread picks up at, as a quiet line of text"
        >
          <DateDividerDemo />
        </DemoCard>
        <DemoCard
          href="/components/dictate-button"
          index={10}
          title="Dictate Button"
          description="Speak instead of typing, into any field"
        >
          <DictateButtonDemo />
        </DemoCard>
        <DemoCard
          href="/components/editable-title"
          index={11}
          title="Editable Title"
          description="A heading you click to rename in place"
        >
          <EditableTitleDemo />
        </DemoCard>
        <DemoCard
          href="/components/effort-menu"
          index={12}
          title="Effort Menu"
          description="How hard the model thinks, from Off to Max"
        >
          <EffortMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/emoji-selector"
          index={13}
          title="Emoji Selector"
          description="A searchable emoji panel that remembers recent picks"
        >
          <EmojiSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/file-attachment"
          index={14}
          title="File Attachment"
          description="A file that opens to preview, copy or download"
        >
          <FileAttachmentDemo />
        </DemoCard>
        <DemoCard
          href="/components/file-preview"
          index={15}
          title="File Preview"
          description="A file opened in full: an image, a PDF, code in color or a folder"
        >
          <FilePreviewDemo />
        </DemoCard>
        <DemoCard
          href="/components/history-buttons"
          index={16}
          title="History Buttons"
          description="Back and forward through what you opened, with their shortcuts"
        >
          <HistoryButtonsDemo />
        </DemoCard>
        <DemoCard
          href="/components/inline-citation"
          index={17}
          title="Inline Citation"
          description="A numbered mark in the prose that names its source"
        >
          <InlineCitationDemo />
        </DemoCard>
        <DemoCard
          href="/components/login-form"
          index={18}
          title="Login Form"
          description="One form to sign in or up: an email code, Google or GitHub"
        >
          <LoginFormDemo />
        </DemoCard>
        <DemoCard
          href="/components/markdown"
          index={19}
          title="Markdown"
          description="A reply written out word by word, with citations"
        >
          <MarkdownDemo />
        </DemoCard>
        <DemoCard
          href="/components/message"
          index={20}
          title="Message"
          description="A simple message component"
        >
          <MessageDemo />
        </DemoCard>
        <DemoCard
          href="/components/message-actions"
          index={21}
          title="Message Actions"
          description="Copy, rate, retry and more under a reply"
        >
          <MessageActionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/message-scroller"
          index={22}
          title="Message Scroller"
          description="Anchors each turn and follows a reply while you are at the end"
        >
          <MessageScrollerDemo />
        </DemoCard>
        <DemoCard
          href="/components/model-selector"
          index={23}
          title="Model Selector"
          description="A simple model selector component"
        >
          <ModelSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/nav-bars"
          index={24}
          title="Nav Bars"
          description="A rail of bars for a page's sections or a thread's turns"
        >
          <NavBarsDemo />
        </DemoCard>
        <DemoCard
          href="/components/panels"
          index={25}
          title="Panels"
          description="An app shell with resizable panels on three sides"
          wide
        >
          <PanelsDemo />
        </DemoCard>
        <DemoCard
          href="/components/plugin-selector"
          index={26}
          title="Plugin Selector"
          description="Which plugins a chat can use, turned on and off from one menu"
        >
          <PluginSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/project-selector"
          index={27}
          title="Project Selector"
          description="Which project a chat belongs to, and a menu to switch it"
        >
          <ProjectSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/quick-chat"
          index={28}
          title="Quick Chat"
          description="A compact conversation that floats over the current page"
        >
          <QuickChatDemo />
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
          href="/components/response"
          index={30}
          title="Response"
          description="A Markdown reply set as prose, fading in as it streams"
        >
          <ResponseDemo />
        </DemoCard>
        <DemoCard
          href="/components/settings-dialog"
          index={31}
          title="Settings Dialog"
          description="Profile, appearance, and API keys in one focused dialog"
        >
          <SettingsDialogDemo />
        </DemoCard>
        <DemoCard
          href="/components/share-dialog"
          index={32}
          title="Share Dialog"
          description="Who can open it, a link to copy, and places to post it"
        >
          <ShareDialogDemo />
        </DemoCard>
        <DemoCard
          href="/components/sources"
          index={33}
          title="Sources"
          description="The pages a reply drew on, as small chips that open them"
        >
          <SourcesDemo />
        </DemoCard>
        <DemoCard
          href="/components/stream-text"
          index={34}
          title="Stream Text"
          description="A streamed reply written out word by word, at a steady pace"
        >
          <StreamTextDemo />
        </DemoCard>
        <DemoCard
          href="/components/suggestions"
          index={35}
          title="Suggestions"
          description="Prompts to start from, arriving together as a row"
        >
          <SuggestionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/temporary-chat-toggle"
          index={36}
          title="Temporary Chat Toggle"
          description="Start a chat that stays out of history"
        >
          <TemporaryChatToggleDemo />
        </DemoCard>
        <DemoCard
          href="/components/thinking-indicator"
          index={37}
          title="Thinking Indicator"
          description="What a reply is doing before its first word, as a live dot and a shimmer"
        >
          <ThinkingIndicatorDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread"
          index={38}
          title="Thread"
          description="A simple thread component"
        >
          <ThreadDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread-transcript"
          index={39}
          title="Thread Transcript"
          description="A rail of your turns beside a thread that jumps to each one"
        >
          <ThreadTranscriptDemo />
        </DemoCard>
        <DemoCard
          href="/components/user-menu"
          index={40}
          title="User Menu"
          description="Who is signed in, and what they can do with their account"
        >
          <UserMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/voice-divider"
          index={41}
          title="Voice Divider"
          description="Where a voice chat started and ended in a thread"
        >
          <VoiceDividerDemo />
        </DemoCard>
        <DemoCard
          href="/components/waveform"
          index={42}
          title="Waveform"
          description="Live bars that follow a microphone, so you can see it hears you"
        >
          <WaveformDemo />
        </DemoCard>
        <DemoCard
          href="/components/web-search"
          index={43}
          title="Web Search"
          description="The searches a reply ran and the pages they found"
        >
          <WebSearchDemo />
        </DemoCard>
        <DemoCard
          href="/components/work-in-menu"
          index={44}
          title="Work In Menu"
          description="Where work runs: local, a worktree or the cloud"
        >
          <WorkInMenuDemo />
        </DemoCard>
      </div>
    </div>
  )
}
