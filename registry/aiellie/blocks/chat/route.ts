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

const pause = (ms: number) => new Promise((done) => setTimeout(done, ms))

function sampleReply(modelId: string) {
  const started = Date.now()
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      async execute({ writer }) {
        writer.write({
          type: "start",
          messageMetadata: { createdAt: started } satisfies MessageMetadata,
        })
        writer.write({ type: "reasoning-start", id: "thoughts" })
        for (const word of SAMPLE_THOUGHTS.split(/(?<= )/)) {
          writer.write({ type: "reasoning-delta", id: "thoughts", delta: word })
          await pause(40)
        }
        writer.write({ type: "reasoning-end", id: "thoughts" })
        writer.write({ type: "text-start", id: "reply" })
        for (const word of SAMPLE_REPLY.split(/(?<= )/)) {
          writer.write({ type: "text-delta", id: "reply", delta: word })
          await pause(30)
        }
        writer.write({ type: "text-end", id: "reply" })
        writer.write({
          type: "finish",
          finishReason: "stop",
          messageMetadata: {
            model: modelId,
            reasoningSeconds: Math.max(
              1,
              Math.round((Date.now() - started) / 1000)
            ),
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
    return sampleReply(modelId)
  const tools = search === true ? resolved.search : undefined

  const modelMessages = await toModelMessages(inlineFilesOnly(messages))

  const result = streamText({
    model: resolved.model,
    instructions: tools ? CITE_SOURCES : undefined,
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
    // found: a few steps in all.
    tools,
    stopWhen: tools ? isStepCount(5) : undefined,
  })

  const clock = reasoningClock()

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream.pipeThrough(clock.watch),
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
