import type { ComponentType } from "react"

type SampleModule = Promise<{ default: ComponentType }>

// Each example's live sample, keyed by its path under this folder. The page
// reads the same file to show its code.
const SAMPLES: Record<string, () => SampleModule> = {
  "add-menu/groups": () => import("./add-menu/groups"),
  "attachments/from-input": () => import("./attachments/from-input"),
  "branches-menu/outline": () => import("./branches-menu/outline"),
  "composer/drop-files": () => import("./composer/drop-files"),
  "composer/stop": () => import("./composer/stop"),
  "date-divider/between-messages": () =>
    import("./date-divider/between-messages"),
  "dictate-button/errors": () => import("./dictate-button/errors"),
  "editable-title/from-menu": () => import("./editable-title/from-menu"),
  "file-preview/pick-a-file": () => import("./file-preview/pick-a-file"),
  "help-menu/actions": () => import("./help-menu/actions"),
  "history-buttons/shortcuts": () => import("./history-buttons/shortcuts"),
  "menu/checkbox-and-radio": () => import("./menu/checkbox-and-radio"),
  "menu/search": () => import("./menu/search"),
  "menu/submenu": () => import("./menu/submenu"),
  "message/clickable-part": () => import("./message/clickable-part"),
  "message/variants": () => import("./message/variants"),
  "meter/context-window": () => import("./meter/context-window"),
  "model-selector/availability": () => import("./model-selector/availability"),
  "model-selector/ghost": () => import("./model-selector/ghost"),
  "nav-bars/expand": () => import("./nav-bars/expand"),
  "nav-bars/peek": () => import("./nav-bars/peek"),
  "panels/headers": () => import("./panels/headers"),
  "panels/use-panels": () => import("./panels/use-panels"),
  "plugin-selector/chips": () => import("./plugin-selector/chips"),
  "plugin-selector/submenu": () => import("./plugin-selector/submenu"),
  "project-selector/submenu": () => import("./project-selector/submenu"),
  "quick-chat/echo": () => import("./quick-chat/echo"),
  "reasoning/activity": () => import("./reasoning/activity"),
  "settings-dialog/providers": () => import("./settings-dialog/providers"),
  "share-dialog/private-by-default": () =>
    import("./share-dialog/private-by-default"),
  "sources/given": () => import("./sources/given"),
  "status/running": () => import("./status/running"),
  "stream-text/fresh-words": () => import("./stream-text/fresh-words"),
  "stream-text/reveal-initial": () => import("./stream-text/reveal-initial"),
  "suggestions/fill-composer": () => import("./suggestions/fill-composer"),
  "temporary-chat-toggle/header": () =>
    import("./temporary-chat-toggle/header"),
  "thinking-indicator/started-at": () =>
    import("./thinking-indicator/started-at"),
  "thread/load-earlier": () => import("./thread/load-earlier"),
  "thread-transcript/peek": () => import("./thread-transcript/peek"),
  "toast/anchored": () => import("./toast/anchored"),
  "toast/promise": () => import("./toast/promise"),
  "toolbar/message-actions": () => import("./toolbar/message-actions"),
  "toolbar/vertical": () => import("./toolbar/vertical"),
  "tooltip-icon-button/shortcut": () =>
    import("./tooltip-icon-button/shortcut"),
  "tooltip-icon-button/sides": () => import("./tooltip-icon-button/sides"),
  "user-menu/settings": () => import("./user-menu/settings"),
  "waveform/microphone": () => import("./waveform/microphone"),
  "work-in-menu/options": () => import("./work-in-menu/options"),
}

export { SAMPLES }
