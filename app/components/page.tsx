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
import TemporaryChatToggleDemo from "@/registry/aiellie/examples/temporary-chat-toggle-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ThreadTranscriptDemo from "@/registry/aiellie/examples/thread-transcript-demo"
import WaveformDemo from "@/registry/aiellie/examples/waveform-demo"
import WorkInMenuDemo from "@/registry/aiellie/examples/work-in-menu-demo"
import UserMenuDemo from "@/registry/aiellie/examples/user-menu-demo"
import CodeWorkspaceDemo from "@/registry/aiellie/examples/code-workspace-demo"
import SandboxDemo from "@/registry/aiellie/examples/sandbox-demo"
import CodeBlockDemo from "@/registry/aiellie/examples/code-block-demo"
import CodeDiffDemo from "@/registry/aiellie/examples/code-diff-demo"
import TerminalDemo from "@/registry/aiellie/examples/terminal-demo"
import ResponseDemo from "@/registry/aiellie/examples/response-demo"
import ToolCallDemo from "@/registry/aiellie/examples/tool-call-demo"
import MessageActionsDemo from "@/registry/aiellie/examples/message-actions-demo"
import InlineCitationDemo from "@/registry/aiellie/examples/inline-citation-demo"
import QuotedMessageDemo from "@/registry/aiellie/examples/quoted-message-demo"
import MessageHighlightToolbarDemo from "@/registry/aiellie/examples/message-highlight-toolbar-demo"
import EffortMenuDemo from "@/registry/aiellie/examples/effort-menu-demo"
import ApprovalModeMenuDemo from "@/registry/aiellie/examples/approval-mode-menu-demo"
import SlashMenuDemo from "@/registry/aiellie/examples/slash-menu-demo"
import MentionsDemo from "@/registry/aiellie/examples/mentions-demo"
import OrbDemo from "@/registry/aiellie/examples/orb-demo"
import TranscriptDemo from "@/registry/aiellie/examples/transcript-demo"
import AudioPlayerDemo from "@/registry/aiellie/examples/audio-player-demo"
import MicMenuDemo from "@/registry/aiellie/examples/mic-menu-demo"
import PromptMenuDemo from "@/registry/aiellie/examples/prompt-menu-demo"
import CodeSnippetDemo from "@/registry/aiellie/examples/code-snippet-demo"
import FileTreeDemo from "@/registry/aiellie/examples/file-tree-demo"
import ReactionsDemo from "@/registry/aiellie/examples/reactions-demo"
import MessageStatusDemo from "@/registry/aiellie/examples/message-status-demo"
import TimestampsDemo from "@/registry/aiellie/examples/timestamps-demo"
import MessageContextMenuDemo from "@/registry/aiellie/examples/message-context-menu-demo"
import PlanReviewDemo from "@/registry/aiellie/examples/plan-review-demo"
import CompactionMarkerDemo from "@/registry/aiellie/examples/compaction-marker-demo"
import WebPreviewDemo from "@/registry/aiellie/examples/web-preview-demo"
import RunBudgetDemo from "@/registry/aiellie/examples/run-budget-demo"
import PromptAutocompleteDemo from "@/registry/aiellie/examples/prompt-autocomplete-demo"
import HumanHandoffDemo from "@/registry/aiellie/examples/human-handoff-demo"
import AgentCursorDemo from "@/registry/aiellie/examples/agent-cursor-demo"
import AttemptPickerDemo from "@/registry/aiellie/examples/attempt-picker-demo"
import NeedsYouDemo from "@/registry/aiellie/examples/needs-you-demo"
import AgentStepsDemo from "@/registry/aiellie/examples/agent-steps-demo"
import AgentCardDemo from "@/registry/aiellie/examples/agent-card-demo"
import TypingIndicatorDemo from "@/registry/aiellie/examples/typing-indicator-demo"
import ArtifactDemo from "@/registry/aiellie/examples/artifact-demo"
import StackTraceDemo from "@/registry/aiellie/examples/stack-trace-demo"
import CommitDemo from "@/registry/aiellie/examples/commit-demo"
import ContextBreakdownDemo from "@/registry/aiellie/examples/context-breakdown-demo"
import RetrievedSourcesDemo from "@/registry/aiellie/examples/retrieved-sources-demo"
import ContactButtonDemo from "@/registry/aiellie/examples/contact-button-demo"
import CallMenuDemo from "@/registry/aiellie/examples/call-menu-demo"
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
        <DemoCard
          href="/components/effort-menu"
          index={13}
          title="Effort Menu"
          description="How hard the model thinks, from Off to Max"
        >
          <EffortMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/approval-mode-menu"
          index={14}
          title="Approval Mode Menu"
          description="How much an agent may do without asking"
        >
          <ApprovalModeMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/slash-menu"
          index={15}
          title="Slash Menu"
          description="The commands a slash opens in the composer"
        >
          <SlashMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/mentions"
          index={16}
          title="Mentions"
          description="The people and agents an at sign opens"
        >
          <MentionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/prompt-menu"
          index={17}
          title="Prompt Menu"
          description="Preset instructions to put the assistant under"
        >
          <PromptMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/prompt-autocomplete"
          index={18}
          title="Prompt Autocomplete"
          description="Ghost text that finishes the prompt, taken with Tab"
        >
          <PromptAutocompleteDemo />
        </DemoCard>
        <DemoCard
          href="/components/agent-cursor"
          index={19}
          title="Agent Cursor"
          description="A document you and the agent edit at once, without clobbering each other"
        >
          <AgentCursorDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="layout">
        <DemoCard
          href="/components/panels"
          index={20}
          title="Panels"
          description="An app shell with resizable panels on three sides"
          wide
        >
          <PanelsDemo />
        </DemoCard>
        <DemoCard
          href="/components/nav-bars"
          index={21}
          title="Nav Bars"
          description="A rail of bars for a page's sections or a thread's turns"
        >
          <NavBarsDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="overlays">
        <DemoCard
          href="/components/settings-dialog"
          index={22}
          title="Settings Dialog"
          description="Profile, appearance, and API keys in one focused dialog"
        >
          <SettingsDialogDemo />
        </DemoCard>
        <DemoCard
          href="/components/share-dialog"
          index={23}
          title="Share Dialog"
          description="Who can open it, a link to copy, and places to post it"
        >
          <ShareDialogDemo />
        </DemoCard>
        <DemoCard
          href="/components/file-preview"
          index={24}
          title="File Preview"
          description="A file opened in full: an image, a PDF, code in color or a folder"
        >
          <FilePreviewDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="feedback">
        <DemoCard
          href="/components/waveform"
          index={25}
          title="Waveform"
          description="Live bars that follow a microphone, so you can see it hears you"
        >
          <WaveformDemo />
        </DemoCard>
        <DemoCard
          href="/components/run-budget"
          index={26}
          title="Run Budget"
          description="A spend cap for an agent run, and what happens at it"
        >
          <RunBudgetDemo />
        </DemoCard>
        <DemoCard
          href="/components/needs-you"
          index={27}
          title="Needs You"
          description="Every agent waiting on you, oldest first, answered in place"
        >
          <NeedsYouDemo />
        </DemoCard>
        <DemoCard
          href="/components/context-breakdown"
          index={28}
          title="Context Breakdown"
          description="What fills the context window, part by part"
        >
          <ContextBreakdownDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="chat">
        <DemoCard
          href="/components/composer"
          index={29}
          title="Composer"
          description="A simple composer component"
        >
          <ComposerDemo />
        </DemoCard>
        <DemoCard
          href="/components/attachments"
          index={30}
          title="Attachments"
          description="Images as small squares, other files as chips, in a row"
        >
          <AttachmentsDemo />
        </DemoCard>
        <DemoCard
          href="/components/message"
          index={31}
          title="Message"
          description="A simple message component"
        >
          <MessageDemo />
        </DemoCard>
        <DemoCard
          href="/components/date-divider"
          index={32}
          title="Date Divider"
          description="The day and time a thread picks up at, as a quiet line of text"
        >
          <DateDividerDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread"
          index={33}
          title="Thread"
          description="A simple thread component"
        >
          <ThreadDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread-transcript"
          index={34}
          title="Thread Transcript"
          description="A rail of your turns beside a thread that jumps to each one"
        >
          <ThreadTranscriptDemo />
        </DemoCard>
        <DemoCard
          href="/components/quick-chat"
          index={35}
          title="Quick Chat"
          description="A compact conversation that floats over the current page"
        >
          <QuickChatDemo />
        </DemoCard>
        <DemoCard
          href="/components/stream-text"
          index={36}
          title="Stream Text"
          description="A streamed reply written out word by word, at a steady pace"
        >
          <StreamTextDemo />
        </DemoCard>
        <DemoCard
          href="/components/reasoning"
          index={37}
          title="Reasoning"
          description="How long the model thought, folding open to show its thoughts"
        >
          <ReasoningDemo />
        </DemoCard>
        <DemoCard
          href="/components/thinking-indicator"
          index={38}
          title="Thinking Indicator"
          description="What a reply is doing before its first word, as a live dot and a shimmer"
        >
          <ThinkingIndicatorDemo />
        </DemoCard>
        <DemoCard
          href="/components/sources"
          index={39}
          title="Sources"
          description="The pages a reply drew on, as small chips that open them"
        >
          <SourcesDemo />
        </DemoCard>
        <DemoCard
          href="/components/suggestions"
          index={40}
          title="Suggestions"
          description="Prompts to start from, arriving together as a row"
        >
          <SuggestionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/response"
          index={41}
          title="Response"
          description="A Markdown reply set as prose, fading in as it streams"
        >
          <ResponseDemo />
        </DemoCard>
        <DemoCard
          href="/components/tool-call"
          index={42}
          title="Tool Call"
          description="A tool the model called, folded behind one row"
        >
          <ToolCallDemo />
        </DemoCard>
        <DemoCard
          href="/components/message-actions"
          index={43}
          title="Message Actions"
          description="Copy, rate, retry and more under a reply"
        >
          <MessageActionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/inline-citation"
          index={44}
          title="Inline Citation"
          description="A numbered mark in the prose that names its source"
        >
          <InlineCitationDemo />
        </DemoCard>
        <DemoCard
          href="/components/quoted-message"
          index={45}
          title="Quoted Message"
          description="The words a reply is about, kept above it"
        >
          <QuotedMessageDemo />
        </DemoCard>
        <DemoCard
          href="/components/message-highlight-toolbar"
          index={46}
          title="Message Highlight Toolbar"
          description="Actions over the words selected in a thread"
        >
          <MessageHighlightToolbarDemo />
        </DemoCard>
        <DemoCard
          href="/components/reactions"
          index={47}
          title="Reactions"
          description="Emoji counts you press to add or take back"
        >
          <ReactionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/message-status"
          index={48}
          title="Message Status"
          description="Sending, sent, delivered, read, or not sent"
        >
          <MessageStatusDemo />
        </DemoCard>
        <DemoCard
          href="/components/timestamps"
          index={49}
          title="Timestamps"
          description="When a message was sent, worded by how long ago"
        >
          <TimestampsDemo />
        </DemoCard>
        <DemoCard
          href="/components/message-context-menu"
          index={50}
          title="Message Context Menu"
          description="Reactions and actions on a right click"
        >
          <MessageContextMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/plan-review"
          index={51}
          title="Plan Review"
          description="A proposed plan to reshape before it runs"
        >
          <PlanReviewDemo />
        </DemoCard>
        <DemoCard
          href="/components/compaction-marker"
          index={52}
          title="Compaction Marker"
          description="Where the agent compacted its context, and what it kept"
        >
          <CompactionMarkerDemo />
        </DemoCard>
        <DemoCard
          href="/components/human-handoff"
          index={53}
          title="Human Handoff"
          description="Hand the chat to a person, with what they should know"
        >
          <HumanHandoffDemo />
        </DemoCard>
        <DemoCard
          href="/components/agent-steps"
          index={54}
          title="Agent Steps"
          description="A run laid out step by step, with what each step found"
        >
          <AgentStepsDemo />
        </DemoCard>
        <DemoCard
          href="/components/agent-card"
          index={55}
          title="Agent Card"
          description="What an agent is: its model, instructions, tools and output"
        >
          <AgentCardDemo />
        </DemoCard>
        <DemoCard
          href="/components/typing-indicator"
          index={56}
          title="Typing Indicator"
          description="Three dots that say someone is writing a reply"
        >
          <TypingIndicatorDemo />
        </DemoCard>
        <DemoCard
          href="/components/retrieved-sources"
          index={57}
          title="Retrieved Sources"
          description="The passages a reply was built from, with their scores"
        >
          <RetrievedSourcesDemo />
        </DemoCard>
        <DemoCard
          href="/components/contact-button"
          index={58}
          title="Contact Button"
          description="Who you're talking to, opening more about them"
        >
          <ContactButtonDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="voice">
        <DemoCard
          href="/components/orb"
          index={59}
          title="Orb"
          description="The assistant as a sphere that listens, thinks and speaks"
        >
          <OrbDemo />
        </DemoCard>
        <DemoCard
          href="/components/transcript"
          index={60}
          title="Transcript"
          description="Speech as text, with guesses that settle as they're heard"
        >
          <TranscriptDemo />
        </DemoCard>
        <DemoCard
          href="/components/audio-player"
          index={61}
          title="Audio Player"
          description="A clip to play, scrub through and time"
        >
          <AudioPlayerDemo />
        </DemoCard>
        <DemoCard
          href="/components/mic-menu"
          index={62}
          title="Mic Menu"
          description="Which microphone to listen with"
        >
          <MicMenuDemo />
        </DemoCard>
        <DemoCard
          href="/components/call-menu"
          index={63}
          title="Call Menu"
          description="A picture that opens a video or voice call"
        >
          <CallMenuDemo />
        </DemoCard>
      </CategorySection>
      <CategorySection category="code">
        <DemoCard
          href="/components/code-block"
          index={64}
          title="Code Block"
          description="A named block of code to copy, download and point at"
        >
          <CodeBlockDemo />
        </DemoCard>
        <DemoCard
          href="/components/code-diff"
          index={65}
          title="Code Diff"
          description="What a change did, from the diff that describes it"
        >
          <CodeDiffDemo />
        </DemoCard>
        <DemoCard
          href="/components/terminal"
          index={66}
          title="Terminal"
          description="A command, what came back, and whether it worked"
        >
          <TerminalDemo />
        </DemoCard>
        <DemoCard
          href="/components/code-snippet"
          index={67}
          title="Code Snippet"
          description="A command to copy, for whichever package manager you use"
        >
          <CodeSnippetDemo />
        </DemoCard>
        <DemoCard
          href="/components/file-tree"
          index={68}
          title="File Tree"
          description="The files a change touched, and how"
        >
          <FileTreeDemo />
        </DemoCard>
        <DemoCard
          href="/components/code-workspace"
          index={69}
          title="Code Workspace"
          description="Files to browse, search and replace across, in tabs"
          wide
        >
          <CodeWorkspaceDemo />
        </DemoCard>
        <DemoCard
          href="/components/sandbox"
          index={70}
          title="Sandbox"
          description="Code that runs, with its preview, editor and console"
          wide
        >
          <SandboxDemo />
        </DemoCard>
        <DemoCard
          href="/components/web-preview"
          index={71}
          title="Web Preview"
          description="A page to load, browse and debug, like a browser tab"
          wide
        >
          <WebPreviewDemo />
        </DemoCard>
        <DemoCard
          href="/components/attempt-picker"
          index={72}
          title="Attempt Picker"
          description="Several tries at one task, compared, with one to apply"
        >
          <AttemptPickerDemo />
        </DemoCard>
        <DemoCard
          href="/components/artifact"
          index={73}
          title="Artifact"
          description="A panel for something a reply made, with its actions"
        >
          <ArtifactDemo />
        </DemoCard>
        <DemoCard
          href="/components/stack-trace"
          index={74}
          title="Stack Trace"
          description="An error with its frames, library code folded away"
        >
          <StackTraceDemo />
        </DemoCard>
        <DemoCard
          href="/components/commit"
          index={75}
          title="Commit"
          description="A commit's message, author and hash, opening to its files"
        >
          <CommitDemo />
        </DemoCard>
      </CategorySection>
    </div>
  )
}
