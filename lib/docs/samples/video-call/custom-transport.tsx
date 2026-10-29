"use client"

import { VideoCall } from "@/registry/aiellie/components/video-call"
import { mockLive } from "@/registry/aiellie/lib/live-call"

const support = mockLive({
  replies: [
    "Hi, I'm Sam from support. I can see your screen is showing an error. What happened just before it?",
    "Thanks. Try signing out and back in, and tell me what you see.",
  ],
  hangUpAfter: 30000,
})

export default function CustomTransport() {
  return (
    <VideoCall
      transport={support}
      name="Sam"
      seed="support"
      showTranscript={false}
      className="max-w-md"
    />
  )
}
