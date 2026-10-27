import {
  Transcript,
  TranscriptSegment,
} from "@/registry/aiellie/components/transcript"

export default function Dictation() {
  return (
    <Transcript className="max-w-sm">
      <TranscriptSegment>
        Remind me to send the invoice on Friday.
      </TranscriptSegment>
      <TranscriptSegment interim>And book a table for</TranscriptSegment>
    </Transcript>
  )
}
