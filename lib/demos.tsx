import type { ComponentType } from "react"

import AddMenuDemo from "@/registry/aiellie/examples/add-menu-demo"
import BadgeDemo from "@/registry/aiellie/examples/badge-demo"
import BranchesMenuDemo from "@/registry/aiellie/examples/branches-menu-demo"
import AvatarDemo from "@/registry/aiellie/examples/avatar-demo"
import BreadcrumbDemo from "@/registry/aiellie/examples/breadcrumb-demo"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import CommandDemo from "@/registry/aiellie/examples/command-demo"
import DictateButtonDemo from "@/registry/aiellie/examples/dictate-button-demo"
import DialogDemo from "@/registry/aiellie/examples/dialog-demo"
import EmptyDemo from "@/registry/aiellie/examples/empty-demo"
import HelpMenuDemo from "@/registry/aiellie/examples/help-menu-demo"
import AttachmentsDemo from "@/registry/aiellie/examples/attachments-demo"
import EditableTitleDemo from "@/registry/aiellie/examples/editable-title-demo"
import FilePreviewDemo from "@/registry/aiellie/examples/file-preview-demo"
import HistoryButtonsDemo from "@/registry/aiellie/examples/history-buttons-demo"
import ShareDialogDemo from "@/registry/aiellie/examples/share-dialog-demo"
import ComposerDemo from "@/registry/aiellie/examples/composer-demo"
import InputDemo from "@/registry/aiellie/examples/input-demo"
import InputGroupDemo from "@/registry/aiellie/examples/input-group-demo"
import MenuDemo from "@/registry/aiellie/examples/menu-demo"
import MeterDemo from "@/registry/aiellie/examples/meter-demo"
import DateDividerDemo from "@/registry/aiellie/examples/date-divider-demo"
import MarkerDemo from "@/registry/aiellie/examples/marker-demo"
import MessageDemo from "@/registry/aiellie/examples/message-demo"
import HoverCardDemo from "@/registry/aiellie/examples/hover-card-demo"
import PopoverDemo from "@/registry/aiellie/examples/popover-demo"
import StreamTextDemo from "@/registry/aiellie/examples/stream-text-demo"
import NavBarsDemo from "@/registry/aiellie/examples/nav-bars-demo"
import PanelsDemo from "@/registry/aiellie/examples/panels-demo"
import PluginSelectorDemo from "@/registry/aiellie/examples/plugin-selector-demo"
import ProjectSelectorDemo from "@/registry/aiellie/examples/project-selector-demo"
import QuickChatDemo from "@/registry/aiellie/examples/quick-chat-demo"
import ReasoningDemo from "@/registry/aiellie/examples/reasoning-demo"
import ThinkingIndicatorDemo from "@/registry/aiellie/examples/thinking-indicator-demo"
import SourcesDemo from "@/registry/aiellie/examples/sources-demo"
import SuggestionsDemo from "@/registry/aiellie/examples/suggestions-demo"
import ModelSelectorDemo from "@/registry/aiellie/examples/model-selector-demo"
import ResizableDemo from "@/registry/aiellie/examples/resizable-demo"
import SeparatorDemo from "@/registry/aiellie/examples/separator-demo"
import SettingsDialogDemo from "@/registry/aiellie/examples/settings-dialog-demo"
import SheetDemo from "@/registry/aiellie/examples/sheet-demo"
import SidebarDemo from "@/registry/aiellie/examples/sidebar-demo"
import SkeletonDemo from "@/registry/aiellie/examples/skeleton-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
import TabsDemo from "@/registry/aiellie/examples/tabs-demo"
import TemporaryChatToggleDemo from "@/registry/aiellie/examples/temporary-chat-toggle-demo"
import TextareaDemo from "@/registry/aiellie/examples/textarea-demo"
import ToastDemo from "@/registry/aiellie/examples/toast-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ThreadTranscriptDemo from "@/registry/aiellie/examples/thread-transcript-demo"
import ToolbarDemo from "@/registry/aiellie/examples/toolbar-demo"
import TooltipDemo from "@/registry/aiellie/examples/tooltip-demo"
import UserMenuDemo from "@/registry/aiellie/examples/user-menu-demo"
import WaveformDemo from "@/registry/aiellie/examples/waveform-demo"
import WorkInMenuDemo from "@/registry/aiellie/examples/work-in-menu-demo"
import TooltipIconButtonDemo from "@/registry/aiellie/examples/tooltip-icon-button-demo"
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
import CodeWorkspaceDemo from "@/registry/aiellie/examples/code-workspace-demo"
import ComboboxDemo from "@/registry/aiellie/examples/combobox-demo"
import SandboxDemo from "@/registry/aiellie/examples/sandbox-demo"
import ToggleDemo from "@/registry/aiellie/examples/toggle-demo"
import ToggleGroupDemo from "@/registry/aiellie/examples/toggle-group-demo"
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
import { Chat } from "@/registry/aiellie/blocks/chat/components/chat"

type Demo = {
  title: string
  /** The gallery the card lives on, which is where the way back leads. */
  gallery: "/" | "/design" | "/components"
  Demo: ComponentType
}

/**
 * Every demo that can be opened on its own, keyed by the registry item it
 * shows. The key is what `/demo/<name>` reads, so it has to match the name a
 * card installs, which is also the name its menu builds the link from.
 */
const DEMOS: Record<string, Demo> = {
  chat: {
    title: "Chat",
    gallery: "/",
    // Bordered on the card, where it sits on a plate; full screen it is the
    // page, and a frame around the whole viewport would only be a second edge.
    Demo: () => <Chat />,
  },
  button: { title: "Button", gallery: "/design", Demo: ButtonDemo },
  textarea: { title: "Textarea", gallery: "/design", Demo: TextareaDemo },
  input: { title: "Input", gallery: "/design", Demo: InputDemo },
  "input-group": {
    title: "Input Group",
    gallery: "/design",
    Demo: InputGroupDemo,
  },
  resizable: { title: "Resizable", gallery: "/design", Demo: ResizableDemo },
  separator: { title: "Separator", gallery: "/design", Demo: SeparatorDemo },
  marker: { title: "Marker", gallery: "/design", Demo: MarkerDemo },
  sidebar: { title: "Sidebar", gallery: "/design", Demo: SidebarDemo },
  tabs: { title: "Tabs", gallery: "/design", Demo: TabsDemo },
  breadcrumb: {
    title: "Breadcrumb",
    gallery: "/design",
    Demo: BreadcrumbDemo,
  },
  tooltip: { title: "Tooltip", gallery: "/design", Demo: TooltipDemo },
  sheet: { title: "Sheet", gallery: "/design", Demo: SheetDemo },
  dialog: { title: "Dialog", gallery: "/design", Demo: DialogDemo },
  popover: { title: "Popover", gallery: "/design", Demo: PopoverDemo },
  "hover-card": {
    title: "Hover Card",
    gallery: "/design",
    Demo: HoverCardDemo,
  },
  command: { title: "Command", gallery: "/design", Demo: CommandDemo },
  skeleton: { title: "Skeleton", gallery: "/design", Demo: SkeletonDemo },
  avatar: { title: "Avatar", gallery: "/design", Demo: AvatarDemo },
  badge: { title: "Badge", gallery: "/design", Demo: BadgeDemo },
  empty: { title: "Empty", gallery: "/design", Demo: EmptyDemo },
  "tooltip-icon-button": {
    title: "Tooltip Icon Button",
    gallery: "/design",
    Demo: TooltipIconButtonDemo,
  },
  "add-menu": { title: "Add Menu", gallery: "/components", Demo: AddMenuDemo },
  toolbar: { title: "Toolbar", gallery: "/design", Demo: ToolbarDemo },
  "temporary-chat-toggle": {
    title: "Temporary Chat Toggle",
    gallery: "/components",
    Demo: TemporaryChatToggleDemo,
  },
  meter: { title: "Meter", gallery: "/design", Demo: MeterDemo },
  "help-menu": {
    title: "Help Menu",
    gallery: "/components",
    Demo: HelpMenuDemo,
  },
  "user-menu": {
    title: "User Menu",
    gallery: "/components",
    Demo: UserMenuDemo,
  },
  "model-selector": {
    title: "Model Selector",
    gallery: "/components",
    Demo: ModelSelectorDemo,
  },
  "project-selector": {
    title: "Project Selector",
    gallery: "/components",
    Demo: ProjectSelectorDemo,
  },
  "plugin-selector": {
    title: "Plugin Selector",
    gallery: "/components",
    Demo: PluginSelectorDemo,
  },
  "work-in-menu": {
    title: "Work In Menu",
    gallery: "/components",
    Demo: WorkInMenuDemo,
  },
  "branches-menu": {
    title: "Branches Menu",
    gallery: "/components",
    Demo: BranchesMenuDemo,
  },
  "dictate-button": {
    title: "Dictate Button",
    gallery: "/components",
    Demo: DictateButtonDemo,
  },
  panels: { title: "Panels", gallery: "/components", Demo: PanelsDemo },
  "nav-bars": {
    title: "Nav Bars",
    gallery: "/components",
    Demo: NavBarsDemo,
  },
  menu: { title: "Menu", gallery: "/design", Demo: MenuDemo },
  "settings-dialog": {
    title: "Settings Dialog",
    gallery: "/components",
    Demo: SettingsDialogDemo,
  },
  status: { title: "Status", gallery: "/design", Demo: StatusDemo },
  waveform: { title: "Waveform", gallery: "/components", Demo: WaveformDemo },
  toast: { title: "Toast", gallery: "/design", Demo: ToastDemo },
  composer: { title: "Composer", gallery: "/components", Demo: ComposerDemo },
  attachments: {
    title: "Attachments",
    gallery: "/components",
    Demo: AttachmentsDemo,
  },
  message: { title: "Message", gallery: "/components", Demo: MessageDemo },
  "date-divider": {
    title: "Date Divider",
    gallery: "/components",
    Demo: DateDividerDemo,
  },
  thread: { title: "Thread", gallery: "/components", Demo: ThreadDemo },
  "thread-transcript": {
    title: "Thread Transcript",
    gallery: "/components",
    Demo: ThreadTranscriptDemo,
  },
  "quick-chat": {
    title: "Quick Chat",
    gallery: "/components",
    Demo: QuickChatDemo,
  },
  "stream-text": {
    title: "Stream Text",
    gallery: "/components",
    Demo: StreamTextDemo,
  },
  reasoning: {
    title: "Reasoning",
    gallery: "/components",
    Demo: ReasoningDemo,
  },
  "thinking-indicator": {
    title: "Thinking Indicator",
    gallery: "/components",
    Demo: ThinkingIndicatorDemo,
  },
  sources: { title: "Sources", gallery: "/components", Demo: SourcesDemo },
  suggestions: {
    title: "Suggestions",
    gallery: "/components",
    Demo: SuggestionsDemo,
  },
  "history-buttons": {
    title: "History Buttons",
    gallery: "/components",
    Demo: HistoryButtonsDemo,
  },
  "editable-title": {
    title: "Editable Title",
    gallery: "/components",
    Demo: EditableTitleDemo,
  },
  "share-dialog": {
    title: "Share Dialog",
    gallery: "/components",
    Demo: ShareDialogDemo,
  },
  "file-preview": {
    title: "File Preview",
    gallery: "/components",
    Demo: FilePreviewDemo,
  },
  "code-block": {
    title: "Code Block",
    gallery: "/components",
    Demo: CodeBlockDemo,
  },
  "code-diff": {
    title: "Code Diff",
    gallery: "/components",
    Demo: CodeDiffDemo,
  },
  terminal: { title: "Terminal", gallery: "/components", Demo: TerminalDemo },
  response: { title: "Response", gallery: "/components", Demo: ResponseDemo },
  "tool-call": {
    title: "Tool Call",
    gallery: "/components",
    Demo: ToolCallDemo,
  },
  "message-actions": {
    title: "Message Actions",
    gallery: "/components",
    Demo: MessageActionsDemo,
  },
  "inline-citation": {
    title: "Inline Citation",
    gallery: "/components",
    Demo: InlineCitationDemo,
  },
  "quoted-message": {
    title: "Quoted Message",
    gallery: "/components",
    Demo: QuotedMessageDemo,
  },
  "message-highlight-toolbar": {
    title: "Message Highlight Toolbar",
    gallery: "/components",
    Demo: MessageHighlightToolbarDemo,
  },
  "effort-menu": {
    title: "Effort Menu",
    gallery: "/components",
    Demo: EffortMenuDemo,
  },
  "approval-mode-menu": {
    title: "Approval Mode Menu",
    gallery: "/components",
    Demo: ApprovalModeMenuDemo,
  },
  "slash-menu": {
    title: "Slash Menu",
    gallery: "/components",
    Demo: SlashMenuDemo,
  },
  mentions: { title: "Mentions", gallery: "/components", Demo: MentionsDemo },
  orb: {
    title: "Orb",
    gallery: "/components",
    Demo: OrbDemo,
  },
  transcript: {
    title: "Transcript",
    gallery: "/components",
    Demo: TranscriptDemo,
  },
  "audio-player": {
    title: "Audio Player",
    gallery: "/components",
    Demo: AudioPlayerDemo,
  },
  "mic-menu": {
    title: "Mic Menu",
    gallery: "/components",
    Demo: MicMenuDemo,
  },
  "prompt-menu": {
    title: "Prompt Menu",
    gallery: "/components",
    Demo: PromptMenuDemo,
  },
  "code-snippet": {
    title: "Code Snippet",
    gallery: "/components",
    Demo: CodeSnippetDemo,
  },
  "file-tree": {
    title: "File Tree",
    gallery: "/components",
    Demo: FileTreeDemo,
  },
  reactions: {
    title: "Reactions",
    gallery: "/components",
    Demo: ReactionsDemo,
  },
  "message-status": {
    title: "Message Status",
    gallery: "/components",
    Demo: MessageStatusDemo,
  },
  timestamps: {
    title: "Timestamps",
    gallery: "/components",
    Demo: TimestampsDemo,
  },
  "message-context-menu": {
    title: "Message Context Menu",
    gallery: "/components",
    Demo: MessageContextMenuDemo,
  },
  "plan-review": {
    title: "Plan Review",
    gallery: "/components",
    Demo: PlanReviewDemo,
  },
  "compaction-marker": {
    title: "Compaction Marker",
    gallery: "/components",
    Demo: CompactionMarkerDemo,
  },
  "code-workspace": {
    title: "Code Workspace",
    gallery: "/components",
    Demo: CodeWorkspaceDemo,
  },
  sandbox: { title: "Sandbox", gallery: "/components", Demo: SandboxDemo },
  "web-preview": {
    title: "Web Preview",
    gallery: "/components",
    Demo: WebPreviewDemo,
  },
  "run-budget": {
    title: "Run Budget",
    gallery: "/components",
    Demo: RunBudgetDemo,
  },
  "prompt-autocomplete": {
    title: "Prompt Autocomplete",
    gallery: "/components",
    Demo: PromptAutocompleteDemo,
  },
  "human-handoff": {
    title: "Human Handoff",
    gallery: "/components",
    Demo: HumanHandoffDemo,
  },
  "agent-cursor": {
    title: "Agent Cursor",
    gallery: "/components",
    Demo: AgentCursorDemo,
  },
  "attempt-picker": {
    title: "Attempt Picker",
    gallery: "/components",
    Demo: AttemptPickerDemo,
  },
  "needs-you": {
    title: "Needs You",
    gallery: "/components",
    Demo: NeedsYouDemo,
  },
  "agent-steps": {
    title: "Agent Steps",
    gallery: "/components",
    Demo: AgentStepsDemo,
  },
  "agent-card": {
    title: "Agent Card",
    gallery: "/components",
    Demo: AgentCardDemo,
  },
  "typing-indicator": {
    title: "Typing Indicator",
    gallery: "/components",
    Demo: TypingIndicatorDemo,
  },
  artifact: {
    title: "Artifact",
    gallery: "/components",
    Demo: ArtifactDemo,
  },
  "stack-trace": {
    title: "Stack Trace",
    gallery: "/components",
    Demo: StackTraceDemo,
  },
  commit: {
    title: "Commit",
    gallery: "/components",
    Demo: CommitDemo,
  },
  "context-breakdown": {
    title: "Context Breakdown",
    gallery: "/components",
    Demo: ContextBreakdownDemo,
  },
  "retrieved-sources": {
    title: "Retrieved Sources",
    gallery: "/components",
    Demo: RetrievedSourcesDemo,
  },
  "contact-button": {
    title: "Contact Button",
    gallery: "/components",
    Demo: ContactButtonDemo,
  },
  "call-menu": {
    title: "Call Menu",
    gallery: "/components",
    Demo: CallMenuDemo,
  },
  toggle: { title: "Toggle", gallery: "/design", Demo: ToggleDemo },
  "toggle-group": {
    title: "Toggle Group",
    gallery: "/design",
    Demo: ToggleGroupDemo,
  },
  combobox: { title: "Combobox", gallery: "/design", Demo: ComboboxDemo },
}

export { DEMOS }
export type { Demo }
