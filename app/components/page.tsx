import { DemoCard } from "@/components/pages/demo-card"
import { PageHero } from "@/components/pages/page-hero"
import { cardCount } from "@/lib/categories"
import { PAGES } from "@/lib/constants"
import CodeBlockDemo from "@/registry/aiellie/examples/code-block-demo"
import ComposerDemo from "@/registry/aiellie/examples/composer-demo"
import DateDividerDemo from "@/registry/aiellie/examples/date-divider-demo"
import EditableTitleDemo from "@/registry/aiellie/examples/editable-title-demo"
import HistoryButtonsDemo from "@/registry/aiellie/examples/history-buttons-demo"
import InlineCitationDemo from "@/registry/aiellie/examples/inline-citation-demo"
import LoginFormDemo from "@/registry/aiellie/examples/login-form-demo"
import MessageDemo from "@/registry/aiellie/examples/message-demo"
import PanelsDemo from "@/registry/aiellie/examples/panels-demo"
import PlanReviewDemo from "@/registry/aiellie/examples/plan-review-demo"
import ReasoningDemo from "@/registry/aiellie/examples/reasoning-demo"
import ThinkingIndicatorDemo from "@/registry/aiellie/examples/thinking-indicator-demo"
import SourcesDemo from "@/registry/aiellie/examples/sources-demo"
import SuggestionsDemo from "@/registry/aiellie/examples/suggestions-demo"
import StreamTextDemo from "@/registry/aiellie/examples/stream-text-demo"
import ModelSelectorDemo from "@/registry/aiellie/examples/model-selector-demo"
import ThreadDemo from "@/registry/aiellie/examples/thread-demo"
import ThreadTranscriptDemo from "@/registry/aiellie/examples/thread-transcript-demo"
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
          href="/components/attachment"
          index={1}
          title="Attachment"
          description="An image square or a file chip, in a row of several"
        >
          <AttachmentDemo />
        </DemoCard>
        <DemoCard
          href="/components/bubble"
          index={2}
          title="Bubble"
          description="The bubble a message sits in, grouped with its neighbours"
        >
          <BubbleDemo />
        </DemoCard>
        <DemoCard
          href="/components/code-block"
          index={3}
          title="Code Block"
          description="A named block of code to copy, download and point at"
        >
          <CodeBlockDemo />
        </DemoCard>
        <DemoCard
          href="/components/composer"
          index={4}
          title="Composer"
          description="A simple composer component"
        >
          <ComposerDemo />
        </DemoCard>
        <DemoCard
          href="/components/context-meter"
          index={5}
          title="Context Meter"
          description="How much of the context a chat has used, and its cost"
        >
          <ContextMeterDemo />
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
          href="/components/editable-title"
          index={7}
          title="Editable Title"
          description="A heading you click to rename in place"
        >
          <EditableTitleDemo />
        </DemoCard>
        <DemoCard
          href="/components/emoji-selector"
          index={8}
          title="Emoji Selector"
          description="A searchable emoji panel that remembers recent picks"
        >
          <EmojiSelectorDemo />
        </DemoCard>
        <DemoCard
          href="/components/file-attachment"
          index={9}
          title="File Attachment"
          description="A file that opens to preview, copy or download"
        >
          <FileAttachmentDemo />
        </DemoCard>
        <DemoCard
          href="/components/history-buttons"
          index={10}
          title="History Buttons"
          description="Back and forward through what you opened, with their shortcuts"
        >
          <HistoryButtonsDemo />
        </DemoCard>
        <DemoCard
          href="/components/inline-citation"
          index={11}
          title="Inline Citation"
          description="A numbered mark in the prose that names its source"
        >
          <InlineCitationDemo />
        </DemoCard>
        <DemoCard
          href="/components/login-form"
          index={12}
          title="Login Form"
          description="One form to sign in or up: an email code, Google or GitHub"
        >
          <LoginFormDemo />
        </DemoCard>
        <DemoCard
          href="/components/markdown"
          index={13}
          title="Markdown"
          description="A reply written out word by word, with citations"
        >
          <MarkdownDemo />
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
          href="/components/message-scroller"
          index={16}
          title="Message Scroller"
          description="Anchors each turn and follows a reply while you are at the end"
        >
          <MessageScrollerDemo />
        </DemoCard>
        <DemoCard
          href="/components/model-selector"
          index={17}
          title="Model Selector"
          description="A simple model selector component"
        >
          <ModelSelectorDemo />
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
          href="/components/plan-review"
          index={19}
          title="Plan Review"
          description="A proposed plan to reshape before it runs"
        >
          <PlanReviewDemo />
        </DemoCard>
        <DemoCard
          href="/components/reasoning"
          index={20}
          title="Reasoning"
          description="How long the model thought, folding open to show its thoughts"
        >
          <ReasoningDemo />
        </DemoCard>
        <DemoCard
          href="/components/response"
          index={21}
          title="Response"
          description="A Markdown reply set as prose, fading in as it streams"
        >
          <ResponseDemo />
        </DemoCard>
        <DemoCard
          href="/components/sources"
          index={22}
          title="Sources"
          description="The pages a reply drew on, as small chips that open them"
        >
          <SourcesDemo />
        </DemoCard>
        <DemoCard
          href="/components/stream-text"
          index={23}
          title="Stream Text"
          description="A streamed reply written out word by word, at a steady pace"
        >
          <StreamTextDemo />
        </DemoCard>
        <DemoCard
          href="/components/suggestions"
          index={24}
          title="Suggestions"
          description="Prompts to start from, arriving together as a row"
        >
          <SuggestionsDemo />
        </DemoCard>
        <DemoCard
          href="/components/thinking-indicator"
          index={25}
          title="Thinking Indicator"
          description="What a reply is doing before its first word, as a live dot and a shimmer"
        >
          <ThinkingIndicatorDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread"
          index={26}
          title="Thread"
          description="A simple thread component"
        >
          <ThreadDemo />
        </DemoCard>
        <DemoCard
          href="/components/thread-transcript"
          index={27}
          title="Thread Transcript"
          description="A rail of your turns beside a thread that jumps to each one"
        >
          <ThreadTranscriptDemo />
        </DemoCard>
        <DemoCard
          href="/components/voice-divider"
          index={28}
          title="Voice Divider"
          description="Where a voice chat started and ended in a thread"
        >
          <VoiceDividerDemo />
        </DemoCard>
        <DemoCard
          href="/components/web-search"
          index={29}
          title="Web Search"
          description="The searches a reply ran and the pages they found"
        >
          <WebSearchDemo />
        </DemoCard>
      </div>
    </div>
  )
}
