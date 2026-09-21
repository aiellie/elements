import { Textarea } from "@/registry/aiellie/ui/textarea"

export default function TextareaDemo() {
  return (
    <Textarea
      aria-label="Note"
      placeholder="Write a note. The field grows as you type."
      className="max-w-sm"
    />
  )
}
