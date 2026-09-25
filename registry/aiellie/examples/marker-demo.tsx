import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Marker, MarkerContent, MarkerIcon } from "@/registry/aiellie/ui/marker"

export default function MarkerDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Marker>
        <MarkerIcon>
          <HugeiconsIcon icon={InformationCircleIcon} />
        </MarkerIcon>
        <MarkerContent>Replies may be wrong. Check what matters.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>New messages</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Earlier in this project</MarkerContent>
      </Marker>
    </div>
  )
}
