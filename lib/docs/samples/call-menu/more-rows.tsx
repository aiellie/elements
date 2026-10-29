import { VoiceIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CallMenu } from "@/registry/aiellie/components/call-menu"
import { MenuItem, MenuSeparator } from "@/registry/aiellie/ui/menu"

export default function MoreRows() {
  return (
    <CallMenu name="Maya Kapoor">
      <MenuSeparator />
      <MenuItem>
        <HugeiconsIcon aria-hidden icon={VoiceIcon} />
        Voice note
      </MenuItem>
    </CallMenu>
  )
}
