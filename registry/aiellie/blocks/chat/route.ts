import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type TextStreamPart,
  type ToolSet,
  type UIMessage,
} from "ai"

import { apiKeysFrom } from "@/registry/aiellie/blocks/chat/lib/chat-keys"
import { failureReason } from "@/registry/aiellie/blocks/chat/lib/chat-failures"
import { defaultModel, isEffort } from "@/registry/aiellie/lib/models"
import {
  fitToContext,
  toModelMessages,
  type MessageMetadata,
} from "@/registry/aiellie/lib/messages"
import { resolveModel } from "@/registry/aiellie/blocks/chat/lib/chat-providers"
import {
  PLAN_INSTRUCTIONS,
  PLAN_TOOL,
  planTool,
  type PlanInput,
  type PlanOutput,
} from "@/registry/aiellie/blocks/chat/lib/chat-plan"

// With search on, the model cites what it found where it uses it, in the form
// a reply draws as a numbered citation that previews the page.
const CITE_SOURCES =
  "When you use something a web search found, cite the page right after the sentence that uses it, as a markdown link with a number for its text and the page's address, like [1](https://example.com/page). Cite only pages your searches returned, and don't list them again at the end: the chat shows them under your reply."

export const maxDuration = 60

// Without a key there's no model to ask, so the reply is a sample, streamed
// the way a real one is. A deployment with no key set, like a public
// preview, never spends anyone's credits.
const SAMPLE_THOUGHTS =
  "There's no API key yet, so these thoughts are a sample too. They stream in first, then fold away once the answer starts."
const SAMPLE_REPLY =
  "This is a sample reply, since there's no API key yet. Add one under **API keys** in the account menu, or set `AI_GATEWAY_API_KEY` on the server, and replies come from the model you pick."

// Asking for a plan gets a sample one to review, so the preview shows how a
// plan waits for a decision.
const SAMPLE_PLAN: PlanInput = {
  title: "Plan",
  steps: [
    { id: "s1", label: "Read the checkout flow and its tests" },
    { id: "s2", label: "Move the price maths into lib/price.ts" },
    { id: "s3", label: "Write tests for discounts and tax" },
    { id: "s4", label: "Use the new helper in the cart" },
  ],
}
const SAMPLE_APPROVED =
  "That's the plan approved. With an API key, the model would now work through your steps in the order you left them."
const SAMPLE_REVISING =
  "Thanks for the note. With an API key, the model would come back with a new plan that follows it."

const pause = (ms: number) => new Promise((done) => setTimeout(done, ms))

const planPartType = `tool-${PLAN_TOOL}`

// The decision on the newest plan, once the person has made it, for the
// sample reply that follows.
function decidedPlan(messages: UIMessage[]) {
  const last = messages.at(-1)
  if (last?.role !== "assistant") return undefined
  const part = last.parts.findLast((part) => part.type === planPartType)
  return part && "output" in part && part.state === "output-available"
    ? (part.output as PlanOutput)
    : undefined
}

const asksForPlan = (messages: UIMessage[]) => {
  const last = messages.at(-1)
  return (
    last?.role === "user" &&
    last.parts.some(
      (part) => part.type === "text" && /\bplan\b/i.test(part.text)
    )
  )
}

function sampleReply(modelId: string, messages: UIMessage[]) {
  const started = Date.now()
  const decided = decidedPlan(messages)
  const planning = !decided && asksForPlan(messages)
  const reply =
    decided?.state === "approved"
      ? SAMPLE_APPROVED
      : decided?.state === "revising"
        ? SAMPLE_REVISING
        : SAMPLE_REPLY
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      // A reply that carries on from a decided plan keeps the plan's message.
      originalMessages: messages,
      async execute({ writer }) {
        writer.write({
          type: "start",
          messageMetadata: { createdAt: started } satisfies MessageMetadata,
        })
        if (!decided) {
          writer.write({ type: "reasoning-start", id: "thoughts" })
          for (const word of SAMPLE_THOUGHTS.split(/(?<= )/)) {
            writer.write({
              type: "reasoning-delta",
              id: "thoughts",
              delta: word,
            })
            await pause(40)
          }
          writer.write({ type: "reasoning-end", id: "thoughts" })
        }
        if (planning) {
          // Streamed a step at a time, the way a model writes a tool's input.
          const toolCallId = `plan-${started}`
          writer.write({
            type: "tool-input-start",
            toolCallId,
            toolName: PLAN_TOOL,
          })
          const json = JSON.stringify(SAMPLE_PLAN)
          for (const chunk of json.match(/.{1,12}/g) ?? []) {
            writer.write({
              type: "tool-input-delta",
              toolCallId,
              inputTextDelta: chunk,
            })
            await pause(30)
          }
          writer.write({
            type: "tool-input-available",
            toolCallId,
            toolName: PLAN_TOOL,
            input: SAMPLE_PLAN,
          })
        } else {
          writer.write({ type: "text-start", id: "reply" })
          for (const word of reply.split(/(?<= )/)) {
            writer.write({ type: "text-delta", id: "reply", delta: word })
            await pause(30)
          }
          writer.write({ type: "text-end", id: "reply" })
        }
        writer.write({
          type: "finish",
          finishReason: planning ? "tool-calls" : "stop",
          messageMetadata: {
            model: modelId,
            // A reply that carries on from a plan keeps the plan's thinking time.
            reasoningSeconds: decided
              ? undefined
              : Math.max(1, Math.round((Date.now() - started) / 1000)),
          } satisfies MessageMetadata,
        })
      },
    }),
  })
}

// Files come inline, as data. One given by address would have this server
// fetch whatever a request names, so it's treated as a file no longer there.
function inlineFilesOnly(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => ({
    ...message,
    parts: message.parts.map((part) =>
      part.type === "file" && !part.url.startsWith("data:")
        ? { ...part, url: "" }
        : part
    ),
  }))
}

// A plan left without a decision, because the person wrote something else,
// still needs an answer before the model can be asked again.
function answerOpenPlans(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => ({
    ...message,
    parts: message.parts.map((part): UIMessage["parts"][number] =>
      part.type === planPartType &&
      "toolCallId" in part &&
      (part.state === "input-streaming" || part.state === "input-available")
        ? {
            type: planPartType as `tool-${string}`,
            toolCallId: part.toolCallId,
            state: "output-available",
            input: part.input ?? { steps: [] },
            output: { state: "unanswered" } satisfies PlanOutput,
          }
        : part
    ),
  }))
}

/**
 * Times the reasoning as it streams past, block by block, so a reply keeps
 * how long the model thought for. `seconds()` is the total so far.
 */
function reasoningClock() {
  const started = new Map<string, number>()
  let total = 0
  const watch = new TransformStream<
    TextStreamPart<ToolSet>,
    TextStreamPart<ToolSet>
  >({
    transform(part, controller) {
      if (part.type === "reasoning-start") started.set(part.id, Date.now())
      if (part.type === "reasoning-end") {
        const at = started.get(part.id)
        if (at !== undefined) total += Date.now() - at
        started.delete(part.id)
      }
      controller.enqueue(part)
    },
  })
  return {
    watch,
    seconds: () =>
      total > 0 ? Math.max(1, Math.round(total / 1000)) : undefined,
  }
}

export async function POST(req: Request) {
  const {
    messages,
    model,
    effort,
    context,
    search,
  }: {
    messages: UIMessage[]
    /** The model picked, or its fast variant with Fast on. */
    model?: unknown
    /** The reasoning effort picked, for a model that reasons. */
    effort?: unknown
    /** The context size picked, in tokens, for a model with a choice. */
    context?: unknown
    /** Whether the model may search the web for this reply. */
    search?: unknown
  } = await req.json()
  const modelId = typeof model === "string" && model ? model : defaultModel
  const keys = apiKeysFrom(req)
  // Straight to the provider when there's a key for it, from the API keys
  // dialog or the server's environment; otherwise through the AI Gateway.
  const resolved = resolveModel(modelId, keys)
  // The Gateway also signs in with a Vercel deployment's own token, so only a
  // key someone set counts. Without one, the reply is a sample.
  if (
    resolved.route.via === "gateway" &&
    !keys.gateway &&
    !process.env.AI_GATEWAY_API_KEY
  )
    return sampleReply(modelId, messages)
  const searching = search === true
  const tools = {
    ...(searching ? resolved.search : {}),
    [PLAN_TOOL]: planTool,
  }

  const modelMessages = await toModelMessages(
    answerOpenPlans(inlineFilesOnly(messages))
  )

  const result = streamText({
    model: resolved.model,
    instructions: searching
      ? `${PLAN_INSTRUCTIONS}\n\n${CITE_SOURCES}`
      : PLAN_INSTRUCTIONS,
    // A smaller context size picked keeps the request under it, so it stays
    // at the model's standard rate: the oldest messages are left out.
    messages:
      typeof context === "number" && context > 0
        ? fitToContext(modelMessages, context)
        : modelMessages,
    // Each provider maps this to its own setting, whichever way the request
    // goes. Its reasoning streams to the client, where the reply's reasoning
    // line shows it. Google sends its thoughts back only when asked to.
    reasoning: isEffort(effort) ? effort : "provider-default",
    providerOptions: {
      google: { thinkingConfig: { includeThoughts: true } },
    },
    // With search on, the model can look things up, then answer from what it
    // found: a few steps in all. A plan stops the reply until it's decided.
    tools,
    stopWhen: isStepCount(5),
  })

  const clock = reasoningClock()

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream.pipeThrough(clock.watch),
      // A reply that carries on from a decided plan keeps the plan's message.
      originalMessages: messages,
      // Pages a search turned up, for the reply to list.
      sendSources: true,
      // Why it failed, for the thread to say beside "Failed".
      onError: (error) => failureReason(error, resolved.route),
      // When the reply started, for its timestamp, and how it went, for the
      // context meter and reasoning line. Small, so it's kept with the message.
      messageMetadata: ({ part }): MessageMetadata | undefined =>
        part.type === "start"
          ? { createdAt: Date.now() }
          : part.type === "finish"
            ? {
                model: modelId,
                via: resolved.route.via,
                finishReason: part.finishReason,
                usage: part.totalUsage,
                reasoningSeconds: clock.seconds(),
              }
            : undefined,
    }),
  })
}
