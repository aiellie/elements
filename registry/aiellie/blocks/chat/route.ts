import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import {
  convertToModelMessages,
  createGateway,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type LanguageModel,
  type ToolSet,
  type UIMessage,
} from "ai"

export const maxDuration = 60

// The thread shows plain text with inline code, so the reply is asked to keep
// to that rather than arriving as raw Markdown.
const INSTRUCTIONS =
  "You are a helpful assistant in a chat app. Reply in plain prose paragraphs. Wrap code, commands, file names and identifiers in single backticks. Don't use Markdown headings, lists, tables, bold or fenced code blocks. Files the person attaches come as images, PDFs, or text inside <file name=\"…\"> tags. Search the web when a question needs current information, or facts you aren't sure of."

// What the models behind every provider here can all read.
const FILE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
])

type Provider = {
  model: (id: string) => LanguageModel
  /** Web search, run by the provider itself rather than by this route. */
  tools: ToolSet
}

// The gateway's search works with every model it serves. Anthropic's has to
// be turned on for the organization in the Claude Console first.
const PROVIDERS: Record<string, (apiKey: string) => Provider> = {
  gateway: (apiKey) => {
    const gateway = createGateway({ apiKey })
    return {
      model: gateway,
      tools: { perplexity_search: gateway.tools.perplexitySearch() },
    }
  },
  openai: (apiKey) => {
    const openai = createOpenAI({ apiKey })
    return { model: openai, tools: { web_search: openai.tools.webSearch() } }
  },
  anthropic: (apiKey) => {
    const anthropic = createAnthropic({ apiKey })
    return {
      model: anthropic,
      tools: {
        web_search: anthropic.tools.webSearch_20260318({ maxUses: 5 }),
      },
    }
  },
  google: (apiKey) => {
    const google = createGoogleGenerativeAI({ apiKey })
    return {
      model: google,
      tools: { google_search: google.tools.googleSearch({}) },
    }
  },
}

// Providers mostly say plainly what went wrong, like a model a team hasn't
// allowed, so their words are kept. A 403 is a refusal of the request, not of
// the key. Links are dropped, since a reply's footer can't follow them.
function describeError(error: unknown) {
  const status =
    typeof error === "object" && error !== null && "statusCode" in error
      ? error.statusCode
      : undefined
  if (status === 401) return "The API key was refused. Check it in Settings."
  if (status === 429) return "Rate limited or out of credit. Try again soon."
  const message =
    error instanceof Error
      ? error.message.replace(/\s*\(https?:\/\/[^)]*\)/g, "").trim()
      : ""
  return message || "Something went wrong."
}

// Keeps text, and files sent inline as data. A file given by address would
// have this server fetch whatever a request names.
function clean(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => ({
    id: String(message.id),
    role: message.role === "assistant" ? "assistant" : "user",
    parts: (Array.isArray(message.parts) ? message.parts : []).flatMap(
      (part): UIMessage["parts"] => {
        if (part.type === "text" && typeof part.text === "string") {
          return [{ type: "text", text: part.text }]
        }
        if (
          part.type === "file" &&
          FILE_TYPES.has(part.mediaType) &&
          typeof part.url === "string" &&
          part.url.startsWith(`data:${part.mediaType};base64,`)
        ) {
          return [
            {
              type: "file",
              mediaType: part.mediaType,
              filename: part.filename,
              url: part.url,
            },
          ]
        }
        return []
      }
    ),
  }))
}

// The key comes with each request and is never stored. The route never falls
// back to keys in the environment, so it can't spend yours on someone else.
export async function POST(request: Request) {
  const key = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim()
  if (!key) return new Response("Add an API key in Settings.", { status: 401 })

  const { messages, provider, model } = (await request.json()) as {
    messages: UIMessage[]
    provider: string
    model: string
  }
  if (
    !Object.hasOwn(PROVIDERS, provider) ||
    typeof model !== "string" ||
    !Array.isArray(messages)
  ) {
    return new Response("Unknown provider or model.", { status: 400 })
  }

  const { model: languageModel, tools } = PROVIDERS[provider](key)
  const result = streamText({
    model: languageModel(model),
    instructions: INSTRUCTIONS,
    tools,
    // Searches run at the provider and come back in the same reply. The limit
    // only matters if one ever needs another round.
    stopWhen: isStepCount(5),
    messages: await convertToModelMessages(clean(messages)),
    // Models that can think do, and send their thoughts along. Gemini keeps
    // them to itself unless asked.
    reasoning: "medium",
    providerOptions: { google: { thinkingConfig: { includeThoughts: true } } },
    abortSignal: request.signal,
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendSources: true,
      onError: describeError,
    }),
  })
}
