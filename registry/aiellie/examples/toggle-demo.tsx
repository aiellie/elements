import { PinIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Toggle } from "@/registry/aiellie/ui/toggle"

export default function ToggleDemo() {
  return (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Pin the chat" defaultPressed>
        <HugeiconsIcon aria-hidden icon={PinIcon} />
      </Toggle>
      <Toggle variant="outline">
        <HugeiconsIcon aria-hidden icon={PinIcon} data-icon="inline-start" />
        Pinned only
      </Toggle>
    </div>
  )
}
