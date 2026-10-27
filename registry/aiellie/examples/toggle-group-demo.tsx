import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/aiellie/ui/toggle-group"

export default function ToggleGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup multiple defaultValue={["bold"]} aria-label="Text style">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <HugeiconsIcon aria-hidden icon={TextBoldIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <HugeiconsIcon aria-hidden icon={TextItalicIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <HugeiconsIcon aria-hidden icon={TextUnderlineIcon} />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        variant="outline"
        spacing={0}
        defaultValue={["start"]}
        aria-label="Alignment"
      >
        <ToggleGroupItem value="start" aria-label="Align to the start">
          <HugeiconsIcon
            aria-hidden
            icon={TextAlignLeftIcon}
            className="rtl:-scale-x-100"
          />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Centre">
          <HugeiconsIcon aria-hidden icon={TextAlignCenterIcon} />
        </ToggleGroupItem>
        <ToggleGroupItem value="end" aria-label="Align to the end">
          <HugeiconsIcon
            aria-hidden
            icon={TextAlignRightIcon}
            className="rtl:-scale-x-100"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
