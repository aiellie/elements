import type { Session } from "@google/genai"

type LiveCallEndReason = "hangup" | "error" | "timeout"

type LiveCallHandlers = {
  /** The socket is open and the assistant is listening. */
  onOpen: () => void
  /** More of what the person is saying. */
  onUserText: (text: string) => void
  /** More of what the assistant is saying. */
  onAssistantText: (text: string) => void
  /** The assistant's voice started or stopped playing. */
  onSpeaking: (speaking: boolean) => void
  /** The assistant finished its turn. */
  onTurnEnd: () => void
  /** The person talked over the assistant, so its reply was cut off. */
  onInterrupted: () => void
  onClose: (reason: LiveCallEndReason, message?: string) => void
}

type LiveCallSession = {
  /** The microphone to send, or null while muted. */
  setMic: (stream: MediaStream | null) => void
  /** The camera to send frames from, or null while it's off. */
  setCamera: (stream: MediaStream | null) => void
  /** How loud the assistant's voice is right now, from 0 to 1. */
  level: () => number
  close: () => void
}

type LiveTransport = (handlers: LiveCallHandlers) => LiveCallSession

const MIN_FRAME_INTERVAL = 1000
const FRAME_WIDTH = 640

function toBase64(bytes: Uint8Array) {
  let binary = ""
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

function fromBase64(data: string) {
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function analyserLevel(
  analyser: AnalyserNode,
  buffer: Uint8Array<ArrayBuffer>
) {
  analyser.getByteTimeDomainData(buffer)
  let sum = 0
  for (const sample of buffer) sum += ((sample - 128) / 128) ** 2
  return Math.min(1, Math.sqrt(sum / buffer.length) * 4)
}

// Shipped inline, since a registry file can't put a worklet at a public URL.
const CAPTURE_WORKLET = `
class Capture extends AudioWorkletProcessor {
  constructor() { super(); this.chunk = []; this.size = 0 }
  process(inputs) {
    const channel = inputs[0] && inputs[0][0]
    if (channel) {
      this.chunk.push(channel.slice())
      this.size += channel.length
      if (this.size >= sampleRate / 10) {
        const out = new Int16Array(this.size)
        let offset = 0
        for (const part of this.chunk) {
          for (let i = 0; i < part.length; i++) {
            const s = Math.max(-1, Math.min(1, part[i]))
            out[offset++] = s < 0 ? s * 0x8000 : s * 0x7fff
          }
        }
        this.port.postMessage(out.buffer, [out.buffer])
        this.chunk = []
        this.size = 0
      }
    }
    return true
  }
}
registerProcessor("live-call-capture", Capture)
`

// Sends 16-bit PCM at the context's own rate in 100 ms chunks. The rate goes in
// the mime type, and Gemini resamples it.
async function captureMic(
  stream: MediaStream,
  send: (pcm: ArrayBuffer, rate: number) => void
) {
  const context = new AudioContext()
  const url = URL.createObjectURL(
    new Blob([CAPTURE_WORKLET], { type: "text/javascript" })
  )
  try {
    await context.audioWorklet.addModule(url)
  } finally {
    URL.revokeObjectURL(url)
  }
  const source = context.createMediaStreamSource(stream)
  const node = new AudioWorkletNode(context, "live-call-capture")
  node.port.onmessage = (event: MessageEvent<ArrayBuffer>) =>
    send(event.data, context.sampleRate)
  source.connect(node)
  return () => {
    node.port.onmessage = null
    source.disconnect()
    node.disconnect()
    void context.close()
  }
}

// Grabs a JPEG from the camera on an interval, never faster than Gemini's
// one frame a second.
function captureFrames(
  stream: MediaStream,
  interval: number,
  send: (jpeg: string) => void
) {
  const video = document.createElement("video")
  video.muted = true
  video.playsInline = true
  video.srcObject = stream
  void video.play().catch(() => {})
  const canvas = document.createElement("canvas")
  const timer = window.setInterval(
    () => {
      if (video.videoWidth === 0) return
      canvas.width = Math.min(FRAME_WIDTH, video.videoWidth)
      canvas.height = Math.round(
        (video.videoHeight / video.videoWidth) * canvas.width
      )
      canvas
        .getContext("2d")
        ?.drawImage(video, 0, 0, canvas.width, canvas.height)
      const url = canvas.toDataURL("image/jpeg", 0.7)
      send(url.slice(url.indexOf(",") + 1))
    },
    Math.max(MIN_FRAME_INTERVAL, interval)
  )
  return () => {
    window.clearInterval(timer)
    video.srcObject = null
  }
}

// Queues 24 kHz PCM chunks back to back, and drops them all on barge-in.
function createPlayer(onSpeaking: (speaking: boolean) => void) {
  const context = new AudioContext()
  const analyser = context.createAnalyser()
  analyser.fftSize = 512
  analyser.connect(context.destination)
  const buffer = new Uint8Array(analyser.fftSize)
  const playing = new Set<AudioBufferSourceNode>()
  let next = 0

  return {
    play(data: string, rate = 24000) {
      const bytes = fromBase64(data)
      const pcm = new Int16Array(bytes.buffer, 0, bytes.length >> 1)
      if (pcm.length === 0) return
      const audio = context.createBuffer(1, pcm.length, rate)
      const channel = audio.getChannelData(0)
      for (let i = 0; i < pcm.length; i++) channel[i] = pcm[i] / 0x8000
      const source = context.createBufferSource()
      source.buffer = audio
      source.connect(analyser)
      next = Math.max(next, context.currentTime)
      source.start(next)
      next += audio.duration
      if (playing.size === 0) onSpeaking(true)
      playing.add(source)
      source.onended = () => {
        playing.delete(source)
        if (playing.size === 0) onSpeaking(false)
      }
    },
    stop() {
      for (const source of playing) {
        source.onended = null
        source.stop()
      }
      if (playing.size > 0) onSpeaking(false)
      playing.clear()
      next = 0
    },
    level: () => (playing.size > 0 ? analyserLevel(analyser, buffer) : 0),
    resume: () => context.resume(),
    close() {
      this.stop()
      void context.close()
    },
  }
}

type GeminiLiveOptions = {
  /** The route that mints a token. `live-token` installs one at this path. */
  tokenUrl?: string
  /** Milliseconds between camera frames. Gemini takes at most one a second. */
  frameInterval?: number
  /** The API version the token was minted for. */
  apiVersion?: string
}

type TokenResponse = { token: string; model: string; error?: string }

async function fetchToken(tokenUrl: string): Promise<TokenResponse> {
  const response = await fetch(tokenUrl, { method: "POST" })
  const body = (await response.json().catch(() => ({}))) as TokenResponse
  if (!response.ok || !body.token) {
    throw new Error(body.error ?? "Couldn't start the call.")
  }
  return body
}

function geminiLive({
  tokenUrl = "/api/live-token",
  frameInterval = MIN_FRAME_INTERVAL,
  apiVersion = "v1beta",
}: GeminiLiveOptions = {}): LiveTransport {
  return (handlers) => {
    let session: Session | null = null
    let closed = false
    let opened = false
    let handle: string | undefined
    let reconnecting = false
    let mic: MediaStream | null = null
    let camera: MediaStream | null = null
    let stopMic: (() => void) | undefined
    let stopFrames: (() => void) | undefined
    let micToken = 0
    const player = createPlayer(handlers.onSpeaking)

    const end = (reason: LiveCallEndReason, message?: string) => {
      if (closed) return
      closed = true
      teardown()
      handlers.onClose(reason, message)
    }

    const teardown = () => {
      stopMic?.()
      stopFrames?.()
      stopMic = stopFrames = undefined
      player.close()
      session?.close()
      session = null
    }

    const startMic = () => {
      stopMic?.()
      stopMic = undefined
      const run = ++micToken
      if (!mic || !session) {
        session?.sendRealtimeInput({ audioStreamEnd: true })
        return
      }
      void captureMic(mic, (pcm, rate) =>
        session?.sendRealtimeInput({
          audio: {
            data: toBase64(new Uint8Array(pcm)),
            mimeType: `audio/pcm;rate=${rate}`,
          },
        })
      ).then((stop) => {
        if (run === micToken && !closed) stopMic = stop
        else stop()
      })
    }

    const startFrames = () => {
      stopFrames?.()
      stopFrames = undefined
      if (!camera || !session) return
      stopFrames = captureFrames(camera, frameInterval, (data) =>
        session?.sendRealtimeInput({
          video: { data, mimeType: "image/jpeg" },
        })
      )
    }

    const connect = async (token: string, model: string) => {
      const { GoogleGenAI } = await import("@google/genai")
      const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion } })
      // The socket can close before connect resolves, so its callbacks read
      // the session from here.
      const own: { session?: Session } = {}
      own.session = await ai.live.connect({
        model,
        config: { sessionResumption: handle ? { handle } : {} },
        callbacks: {
          onmessage: (message) => {
            if (message.sessionResumptionUpdate?.resumable) {
              handle = message.sessionResumptionUpdate.newHandle ?? handle
            }
            // The server is about to drop this connection, so move to a new
            // one before it does.
            if (message.goAway) void reconnect(token, model)

            const content = message.serverContent
            if (!content) return
            if (content.interrupted) {
              player.stop()
              handlers.onInterrupted()
            }
            if (content.inputTranscription?.text) {
              handlers.onUserText(content.inputTranscription.text)
            }
            if (content.outputTranscription?.text) {
              handlers.onAssistantText(content.outputTranscription.text)
            }
            for (const part of content.modelTurn?.parts ?? []) {
              const data = part.inlineData
              if (!data?.data || !data.mimeType?.startsWith("audio/")) continue
              const rate =
                Number(/rate=(\d+)/.exec(data.mimeType)?.[1]) || 24000
              player.play(data.data, rate)
            }
            if (content.turnComplete) handlers.onTurnEnd()
          },
          onerror: () => {
            if (!reconnecting) end("error", "The call dropped.")
          },
          onclose: (event) => {
            if (closed || reconnecting || own.session !== session) return
            if (handle) void reconnect(token, model)
            else end(event.code === 1000 ? "timeout" : "error", event.reason)
          },
        },
      })
      return own.session
    }

    const reconnect = async (token: string, model: string) => {
      if (reconnecting || closed) return
      reconnecting = true
      const previous = session
      try {
        session = await connect(token, model).catch(async () => {
          // A resumed session reuses the token, but if it's expired, mint a new one.
          const fresh = await fetchToken(tokenUrl)
          return connect(fresh.token, fresh.model)
        })
        previous?.close()
        startMic()
        startFrames()
      } catch {
        end("timeout", "The call timed out.")
      } finally {
        reconnecting = false
      }
    }

    void (async () => {
      try {
        const { token, model } = await fetchToken(tokenUrl)
        if (closed) return
        await player.resume()
        session = await connect(token, model)
        if (closed) {
          session.close()
          return
        }
        opened = true
        handlers.onOpen()
        startMic()
        startFrames()
      } catch (error) {
        end("error", error instanceof Error ? error.message : undefined)
      }
    })()

    return {
      setMic(stream) {
        mic = stream
        if (opened) startMic()
      },
      setCamera(stream) {
        camera = stream
        if (opened) startFrames()
      },
      level: player.level,
      close: () => end("hangup"),
    }
  }
}

type MockLiveOptions = {
  /** What the assistant says, in turn. */
  replies?: string[]
  /** What the person is shown saying when no microphone is on. */
  prompts?: string[]
  /** Ends the call by itself after this many milliseconds. */
  hangUpAfter?: number
}

const MOCK_REPLIES = [
  "Hi! I can see you now. The light behind you is nice. What would you like to talk about?",
  "Good question. Give me the short version of what you're building and I'll tell you where I'd start.",
  "That makes sense. I'd keep the first version small, get it in front of people, and listen to what they trip over.",
  "I can see you nodding, so I'll take that as a yes. Anything else on your mind?",
]

const MOCK_PROMPTS = [
  "Hey, can you see me?",
  "I'm working on a new app and I'm not sure where to begin.",
  "Yeah, that sounds right.",
  "Not right now, thanks.",
]

const SPEAKING_THRESHOLD = 0.12
const SILENCE_MS = 800
const IDLE_TURN_MS = 4000
const WORD_MS = 180

// Plays the assistant's side with no key and no network. It listens to the
// real microphone, if there is one, to decide when the person stops talking.
function mockLive({
  replies = MOCK_REPLIES,
  prompts = MOCK_PROMPTS,
  hangUpAfter,
}: MockLiveOptions = {}): LiveTransport {
  return (handlers) => {
    let closed = false
    let opened = false
    let turn = 0
    let speaking = false
    let level = 0
    let heard = 0
    let quietSince = 0
    let mic: { context: AudioContext; analyser: AnalyserNode } | null = null
    const buffer = new Uint8Array(512)
    const timers = new Set<number>()
    // The reply's own timers, so a barge-in cancels it and nothing else.
    const speech = new Set<number>()
    const script = new Set<number>()

    const later = (fn: () => void, ms: number, group = timers) => {
      const id = window.setTimeout(() => {
        group.delete(id)
        if (!closed) fn()
      }, ms)
      group.add(id)
    }

    const stopMic = () => {
      void mic?.context.close()
      mic = null
    }

    const stopSpeaking = () => {
      for (const id of speech) window.clearTimeout(id)
      speech.clear()
      if (speaking) {
        speaking = false
        handlers.onSpeaking(false)
      }
    }

    const reply = () => {
      const words = replies[turn % replies.length].split(" ")
      turn++
      speaking = true
      handlers.onSpeaking(true)
      words.forEach((word, i) =>
        later(
          () => handlers.onAssistantText((i ? " " : "") + word),
          (i + 1) * WORD_MS,
          speech
        )
      )
      later(
        () => {
          speaking = false
          handlers.onSpeaking(false)
          handlers.onTurnEnd()
          if (!mic) scriptedTurn()
        },
        (words.length + 2) * WORD_MS,
        speech
      )
    }

    // Without a microphone there's nothing to hear, so the person's side is
    // written in for them.
    const cancelScript = () => {
      for (const id of script) window.clearTimeout(id)
      script.clear()
    }

    const scriptedTurn = () => {
      cancelScript()
      later(
        () => {
          const words = prompts[turn % prompts.length].split(" ")
          words.forEach((word, i) =>
            later(
              () => handlers.onUserText((i ? " " : "") + word),
              i * WORD_MS,
              script
            )
          )
          later(reply, words.length * WORD_MS + SILENCE_MS, script)
        },
        IDLE_TURN_MS,
        script
      )
    }

    const tick = () => {
      if (closed) return
      level = speaking
        ? 0.35 +
          0.3 *
            Math.sin(performance.now() / 90) *
            Math.sin(performance.now() / 230)
        : 0
      if (mic) {
        const loud = analyserLevel(mic.analyser, buffer) > SPEAKING_THRESHOLD
        const now = performance.now()
        if (loud) {
          if (speaking) {
            stopSpeaking()
            handlers.onInterrupted()
          }
          heard = heard || now
          quietSince = 0
        } else if (heard) {
          quietSince = quietSince || now
          if (now - quietSince > SILENCE_MS) {
            heard = 0
            quietSince = 0
            handlers.onUserText(prompts[turn % prompts.length])
            later(reply, 400)
          }
        }
      }
      requestAnimationFrame(tick)
    }

    later(() => {
      opened = true
      handlers.onOpen()
      requestAnimationFrame(tick)
      later(reply, 600, speech)
      if (hangUpAfter) later(() => close("timeout"), hangUpAfter)
    }, 1200)

    const close = (reason: LiveCallEndReason) => {
      if (closed) return
      stopSpeaking()
      closed = true
      stopMic()
      handlers.onClose(reason)
    }

    return {
      setMic(stream) {
        stopMic()
        cancelScript()
        if (!stream || typeof AudioContext === "undefined") {
          if (opened && !speaking && speech.size === 0) scriptedTurn()
          return
        }
        const context = new AudioContext()
        const analyser = context.createAnalyser()
        analyser.fftSize = buffer.length
        context.createMediaStreamSource(stream).connect(analyser)
        mic = { context, analyser }
      },
      setCamera() {},
      level: () => level,
      close: () => close("hangup"),
    }
  }
}

export { geminiLive, mockLive }
export type {
  GeminiLiveOptions,
  LiveCallEndReason,
  LiveCallHandlers,
  LiveCallSession,
  LiveTransport,
  MockLiveOptions,
}
