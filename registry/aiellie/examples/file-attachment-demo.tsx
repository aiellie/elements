"use client"

import { FileAttachment } from "@/registry/aiellie/components/file-attachment"

const CODE = `export function useCopied() {
  const [copied, setCopied] = useState(false)
  return [copied, setCopied] as const
}
`

export default function FileAttachmentDemo() {
  return (
    <div className="flex w-full max-w-md flex-wrap gap-2 px-4">
      <FileAttachment
        name="use-copied.ts"
        mediaType="text/plain"
        src={`data:text/plain;base64,${btoa(CODE)}`}
        onRemove={() => {}}
      />
      <FileAttachment name="budget.csv" mediaType="text/csv" size={18_400} />
    </div>
  )
}
