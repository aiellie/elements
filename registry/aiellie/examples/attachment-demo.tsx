import { AttachmentGroup } from "@/registry/aiellie/components/attachment"
import { FileAttachment } from "@/registry/aiellie/components/file-attachment"

const NOTES = `data:text/plain;base64,${btoa("Pack: shoes, charger, passport.\n")}`

export default function AttachmentDemo() {
  return (
    <div className="w-full max-w-md px-4">
      <AttachmentGroup>
        <FileAttachment name="notes.txt" mediaType="text/plain" src={NOTES} />
        <FileAttachment
          name="report.pdf"
          mediaType="application/pdf"
          size={482_000}
        />
        <FileAttachment
          name="use-copied.ts"
          mediaType="text/plain"
          size={1_240}
          onRemove={() => {}}
        />
      </AttachmentGroup>
    </div>
  )
}
