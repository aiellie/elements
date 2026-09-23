import type { ComponentType } from "react"

import ButtonDemo from "@/registry/aiellie/examples/button-demo"
import ComposerDemo from "@/registry/aiellie/examples/composer-demo"
import InputDemo from "@/registry/aiellie/examples/input-demo"
import MenuDemo from "@/registry/aiellie/examples/menu-demo"
import MessageDemo from "@/registry/aiellie/examples/message-demo"
import ModelSelectorDemo from "@/registry/aiellie/examples/model-selector-demo"
import ResizableDemo from "@/registry/aiellie/examples/resizable-demo"
import SeparatorDemo from "@/registry/aiellie/examples/separator-demo"
import SheetDemo from "@/registry/aiellie/examples/sheet-demo"
import SidebarDemo from "@/registry/aiellie/examples/sidebar-demo"
import SkeletonDemo from "@/registry/aiellie/examples/skeleton-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
import TabsDemo from "@/registry/aiellie/examples/tabs-demo"
import TextareaDemo from "@/registry/aiellie/examples/textarea-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ToolbarDemo from "@/registry/aiellie/examples/toolbar-demo"
import TooltipDemo from "@/registry/aiellie/examples/tooltip-demo"
import TooltipIconButtonDemo from "@/registry/aiellie/examples/tooltip-icon-button-demo"
import { Chat } from "@/registry/aiellie/blocks/chat/components/chat"
import { PanelShell } from "@/registry/aiellie/blocks/panels/components/panels-shell"
import PanelsPage from "@/registry/aiellie/blocks/panels/page"

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
  panels: {
    title: "Panels",
    gallery: "/",
    // Full screen it fills the stage rather than the window, which also has
    // the stage's own bar in it.
    Demo: () => (
      <PanelShell className="my-0 h-full">
        <PanelsPage />
      </PanelShell>
    ),
  },
  button: { title: "Button", gallery: "/ui", Demo: ButtonDemo },
  textarea: { title: "Textarea", gallery: "/ui", Demo: TextareaDemo },
  input: { title: "Input", gallery: "/ui", Demo: InputDemo },
  resizable: { title: "Resizable", gallery: "/ui", Demo: ResizableDemo },
  separator: { title: "Separator", gallery: "/ui", Demo: SeparatorDemo },
  sidebar: { title: "Sidebar", gallery: "/ui", Demo: SidebarDemo },
  tabs: { title: "Tabs", gallery: "/ui", Demo: TabsDemo },
  tooltip: { title: "Tooltip", gallery: "/ui", Demo: TooltipDemo },
  sheet: { title: "Sheet", gallery: "/ui", Demo: SheetDemo },
  skeleton: { title: "Skeleton", gallery: "/ui", Demo: SkeletonDemo },
  "tooltip-icon-button": {
    title: "Tooltip Icon Button",
    gallery: "/components",
    Demo: TooltipIconButtonDemo,
  },
  toolbar: { title: "Toolbar", gallery: "/components", Demo: ToolbarDemo },
  "model-selector": {
    title: "Model Selector",
    gallery: "/components",
    Demo: ModelSelectorDemo,
  },
  menu: { title: "Menu", gallery: "/components", Demo: MenuDemo },
  status: { title: "Status", gallery: "/components", Demo: StatusDemo },
  composer: { title: "Composer", gallery: "/components", Demo: ComposerDemo },
  message: { title: "Message", gallery: "/components", Demo: MessageDemo },
  thread: { title: "Thread", gallery: "/components", Demo: ThreadDemo },
}

export { DEMOS }
export type { Demo }
