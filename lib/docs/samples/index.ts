import type { ComponentType } from "react"

type SampleModule = Promise<{ default: ComponentType }>

// Each example's live sample, keyed by its path under this folder. The page
// reads the same file to show its code.
const SAMPLES: Record<string, () => SampleModule> = {
  "add-menu/groups": () => import("./add-menu/groups"),
  "approval-mode-menu/your-modes": () =>
    import("./approval-mode-menu/your-modes"),
  "attachments/from-input": () => import("./attachments/from-input"),
  "branches-menu/outline": () => import("./branches-menu/outline"),
  "code-block/streaming": () => import("./code-block/streaming"),
  "code-diff/new-file": () => import("./code-diff/new-file"),
  "code-snippet/no-tabs": () => import("./code-snippet/no-tabs"),
  "code-workspace/copy-action": () => import("./code-workspace/copy-action"),
  "compaction-marker/failed": () => import("./compaction-marker/failed"),
  "composer/drop-files": () => import("./composer/drop-files"),
  "composer/stop": () => import("./composer/stop"),
  "date-divider/between-messages": () =>
    import("./date-divider/between-messages"),
  "dictate-button/errors": () => import("./dictate-button/errors"),
  "editable-title/from-menu": () => import("./editable-title/from-menu"),
  "effort-menu/in-composer": () => import("./effort-menu/in-composer"),
  "file-preview/pick-a-file": () => import("./file-preview/pick-a-file"),
  "file-tree/with-code": () => import("./file-tree/with-code"),
  "help-menu/actions": () => import("./help-menu/actions"),
  "history-buttons/shortcuts": () => import("./history-buttons/shortcuts"),
  "human-handoff/unavailable": () => import("./human-handoff/unavailable"),
  "inline-citation/not-a-page": () => import("./inline-citation/not-a-page"),
  "mentions/who-was-named": () => import("./mentions/who-was-named"),
  "menu/checkbox-and-radio": () => import("./menu/checkbox-and-radio"),
  "menu/search": () => import("./menu/search"),
  "menu/submenu": () => import("./menu/submenu"),
  "message-actions/your-turn": () => import("./message-actions/your-turn"),
  "message-context-menu/your-reactions": () =>
    import("./message-context-menu/your-reactions"),
  "message-highlight-toolbar/ask-about": () =>
    import("./message-highlight-toolbar/ask-about"),
  "message-status/your-words": () => import("./message-status/your-words"),
  "message/clickable-part": () => import("./message/clickable-part"),
  "message/variants": () => import("./message/variants"),
  "meter/context-window": () => import("./meter/context-window"),
  "model-selector/availability": () => import("./model-selector/availability"),
  "model-selector/ghost": () => import("./model-selector/ghost"),
  "nav-bars/expand": () => import("./nav-bars/expand"),
  "nav-bars/peek": () => import("./nav-bars/peek"),
  "orb/seeds": () => import("./orb/seeds"),
  "panels/headers": () => import("./panels/headers"),
  "panels/use-panels": () => import("./panels/use-panels"),
  "plan-review/stored-decision": () => import("./plan-review/stored-decision"),
  "plugin-selector/chips": () => import("./plugin-selector/chips"),
  "plugin-selector/submenu": () => import("./plugin-selector/submenu"),
  "project-selector/submenu": () => import("./project-selector/submenu"),
  "prompt-autocomplete/accept-events": () =>
    import("./prompt-autocomplete/accept-events"),
  "prompt-menu/your-prompts": () => import("./prompt-menu/your-prompts"),
  "quick-chat/echo": () => import("./quick-chat/echo"),
  "quoted-message/in-composer": () => import("./quoted-message/in-composer"),
  "reactions/who-reacted": () => import("./reactions/who-reacted"),
  "reasoning/activity": () => import("./reasoning/activity"),
  "response/citations": () => import("./response/citations"),
  "run-budget/no-actions": () => import("./run-budget/no-actions"),
  "sandbox/composed": () => import("./sandbox/composed"),
  "settings-dialog/providers": () => import("./settings-dialog/providers"),
  "share-dialog/private-by-default": () =>
    import("./share-dialog/private-by-default"),
  "slash-menu/run-a-command": () => import("./slash-menu/run-a-command"),
  "sources/given": () => import("./sources/given"),
  "status/running": () => import("./status/running"),
  "stream-text/fresh-words": () => import("./stream-text/fresh-words"),
  "stream-text/reveal-initial": () => import("./stream-text/reveal-initial"),
  "suggestions/fill-composer": () => import("./suggestions/fill-composer"),
  "temporary-chat-toggle/header": () =>
    import("./temporary-chat-toggle/header"),
  "terminal/running": () => import("./terminal/running"),
  "thinking-indicator/started-at": () =>
    import("./thinking-indicator/started-at"),
  "thread-transcript/peek": () => import("./thread-transcript/peek"),
  "thread/load-earlier": () => import("./thread/load-earlier"),
  "timestamps/formats": () => import("./timestamps/formats"),
  "toast/anchored": () => import("./toast/anchored"),
  "toast/promise": () => import("./toast/promise"),
  "tool-call/failed": () => import("./tool-call/failed"),
  "toolbar/message-actions": () => import("./toolbar/message-actions"),
  "toolbar/vertical": () => import("./toolbar/vertical"),
  "tooltip-icon-button/shortcut": () =>
    import("./tooltip-icon-button/shortcut"),
  "tooltip-icon-button/sides": () => import("./tooltip-icon-button/sides"),
  "transcript/dictation": () => import("./transcript/dictation"),
  "user-menu/settings": () => import("./user-menu/settings"),
  "waveform/microphone": () => import("./waveform/microphone"),
  "web-preview/console-logs": () => import("./web-preview/console-logs"),
  "work-in-menu/options": () => import("./work-in-menu/options"),
}

export { SAMPLES }
