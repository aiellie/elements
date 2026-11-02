import { VoiceDivider } from "@/registry/aiellie/components/voice-divider"

export default function VoiceDividerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 px-4">
      <VoiceDivider edge="start" model="GPT Realtime" live />
      <VoiceDivider edge="end" />
    </div>
  )
}
