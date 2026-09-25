import type { ComponentType } from "react"

import AddMenuDemo from "@/registry/aiellie/examples/add-menu-demo"
import BadgeDemo from "@/registry/aiellie/examples/badge-demo"
import BranchesMenuDemo from "@/registry/aiellie/examples/branches-menu-demo"
import AttachmentDemo from "@/registry/aiellie/examples/attachment-demo"
import AvatarDemo from "@/registry/aiellie/examples/avatar-demo"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import CommandDemo from "@/registry/aiellie/examples/command-demo"
import DictateButtonDemo from "@/registry/aiellie/examples/dictate-button-demo"
import DialogDemo from "@/registry/aiellie/examples/dialog-demo"
import EmptyDemo from "@/registry/aiellie/examples/empty-demo"
import HelpMenuDemo from "@/registry/aiellie/examples/help-menu-demo"
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
import ModelSelectorDemo from "@/registry/aiellie/examples/model-selector-demo"
import ResizableDemo from "@/registry/aiellie/examples/resizable-demo"
import SeparatorDemo from "@/registry/aiellie/examples/separator-demo"
import SheetDemo from "@/registry/aiellie/examples/sheet-demo"
import SidebarDemo from "@/registry/aiellie/examples/sidebar-demo"
import SkeletonDemo from "@/registry/aiellie/examples/skeleton-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
import TabsDemo from "@/registry/aiellie/examples/tabs-demo"
import TemporaryChatToggleDemo from "@/registry/aiellie/examples/temporary-chat-toggle-demo"
import TextareaDemo from "@/registry/aiellie/examples/textarea-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ThreadTranscriptDemo from "@/registry/aiellie/examples/thread-transcript-demo"
import ToolbarDemo from "@/registry/aiellie/examples/toolbar-demo"
import TooltipDemo from "@/registry/aiellie/examples/tooltip-demo"
import UserMenuDemo from "@/registry/aiellie/examples/user-menu-demo"
import WaveformDemo from "@/registry/aiellie/examples/waveform-demo"
import WorkInMenuDemo from "@/registry/aiellie/examples/work-in-menu-demo"
import TooltipIconButtonDemo from "@/registry/aiellie/examples/tooltip-icon-button-demo"
import { Chat } from "@/registry/aiellie/blocks/chat/components/chat"

type Demo = {
  title: string
  /** The gallery the card lives on, which is where the way back leads. */
  gallery: "/" | "/ui" | "/components"
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
  button: { title: "Button", gallery: "/ui", Demo: ButtonDemo },
  textarea: { title: "Textarea", gallery: "/ui", Demo: TextareaDemo },
  input: { title: "Input", gallery: "/ui", Demo: InputDemo },
  "input-group": {
    title: "Input Group",
    gallery: "/ui",
    Demo: InputGroupDemo,
  },
  resizable: { title: "Resizable", gallery: "/ui", Demo: ResizableDemo },
  separator: { title: "Separator", gallery: "/ui", Demo: SeparatorDemo },
  marker: { title: "Marker", gallery: "/ui", Demo: MarkerDemo },
  sidebar: { title: "Sidebar", gallery: "/ui", Demo: SidebarDemo },
  tabs: { title: "Tabs", gallery: "/ui", Demo: TabsDemo },
  tooltip: { title: "Tooltip", gallery: "/ui", Demo: TooltipDemo },
  sheet: { title: "Sheet", gallery: "/ui", Demo: SheetDemo },
  dialog: { title: "Dialog", gallery: "/ui", Demo: DialogDemo },
  popover: { title: "Popover", gallery: "/ui", Demo: PopoverDemo },
  "hover-card": { title: "Hover Card", gallery: "/ui", Demo: HoverCardDemo },
  command: { title: "Command", gallery: "/ui", Demo: CommandDemo },
  skeleton: { title: "Skeleton", gallery: "/ui", Demo: SkeletonDemo },
  avatar: { title: "Avatar", gallery: "/ui", Demo: AvatarDemo },
  badge: { title: "Badge", gallery: "/ui", Demo: BadgeDemo },
  empty: { title: "Empty", gallery: "/ui", Demo: EmptyDemo },
  attachment: { title: "Attachment", gallery: "/ui", Demo: AttachmentDemo },
  "tooltip-icon-button": {
    title: "Tooltip Icon Button",
    gallery: "/components",
    Demo: TooltipIconButtonDemo,
  },
  "add-menu": { title: "Add Menu", gallery: "/components", Demo: AddMenuDemo },
  toolbar: { title: "Toolbar", gallery: "/components", Demo: ToolbarDemo },
  "temporary-chat-toggle": {
    title: "Temporary Chat Toggle",
    gallery: "/components",
    Demo: TemporaryChatToggleDemo,
  },
  meter: { title: "Meter", gallery: "/components", Demo: MeterDemo },
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
  menu: { title: "Menu", gallery: "/components", Demo: MenuDemo },
  status: { title: "Status", gallery: "/components", Demo: StatusDemo },
  waveform: { title: "Waveform", gallery: "/components", Demo: WaveformDemo },
  composer: { title: "Composer", gallery: "/components", Demo: ComposerDemo },
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
}

export { DEMOS }
export type { Demo }
