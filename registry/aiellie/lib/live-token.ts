import { GoogleGenAI, MediaResolution, Modality } from "@google/genai"

const MODEL = "gemini-3.8-live"
// The window to open the socket in. Resuming a session later doesn't count.
const NEW_SESSION_MS = 60 * 1000
const SESSION_MS = 30 * 60 * 1000

const SYSTEM_INSTRUCTION =
  "You are on a live video call. You can hear the person and see their camera. Keep replies short and spoken, and mention what you see only when it helps."

// Mints a one-use token for the browser, so the key never leaves the server.
// Anyone who can reach this route can start a call on your key, so put it
// behind your own sign-in before you deploy it.
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "Set GEMINI_API_KEY to start live calls." },
      { status: 503 }
    )
  }

  // Only pages on this site may ask, so another site can't spend the key.
  const origin = request.headers.get("origin")
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const now = Date.now()
  const expireTime = new Date(now + SESSION_MS).toISOString()
  try {
    const ai = new GoogleGenAI({ apiKey })
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        newSessionExpireTime: new Date(now + NEW_SESSION_MS).toISOString(),
        // Locks the model and these fields, so the token can't be pointed at
        // anything else.
        liveConnectConstraints: {
          model: MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: SYSTEM_INSTRUCTION,
            mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW,
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            // An audio and video session ends at two minutes without this.
            contextWindowCompression: { slidingWindow: {} },
            sessionResumption: {},
          },
        },
        lockAdditionalFields: [],
      },
    })
    return Response.json(
      { token: token.name, model: MODEL, expireTime },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch {
    return Response.json(
      { error: "Couldn't start a call. Try again." },
      { status: 502 }
    )
  }
}
