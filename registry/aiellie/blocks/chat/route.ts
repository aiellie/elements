import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import {
  convertToModelMessages,
  createGateway,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"

export const maxDuration = 60

// The thread shows plain text with inline code, so the reply is asked to keep
// to that rather than arriving as raw Markdown.
const INSTRUCTIONS =
  "You are a helpful assistant in a chat app. Reply in plain prose paragraphs. Wrap code, commands, file names and identifiers in single backticks. Don't use Markdown headings, lists, tables, bold or fenced code blocks."

const PROVIDERS = {
  gateway: (apiKey: string) => createGateway({ apiKey }),
  openai: (apiKey: string) => createOpenAI({ apiKey }),
  anthropic: (apiKey: string) => createAnthropic({ apiKey }),
  google: (apiKey: string) => createGoogleGenerativeAI({ apiKey }),
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
    provider: keyof typeof PROVIDERS
    model: string
  }
  if (!Object.hasOwn(PROVIDERS, provider) || typeof model !== "string") {
    return new Response("Unknown provider or model.", { status: 400 })
  }

  const result = streamText({
    model: PROVIDERS[provider](key)(model),
    instructions: INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    abortSignal: request.signal,
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: describeError,
    }),
  })
}
