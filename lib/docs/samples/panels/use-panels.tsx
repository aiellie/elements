"use client"

import { Panels, usePanels } from "@/registry/aiellie/components/panels"
import { Button } from "@/registry/aiellie/ui/button"

function ShowDetails() {
  const { isOpen, toggle } = usePanels()

  return (
    <Button variant="outline" size="sm" onClick={() => toggle("right")}>
      {isOpen("right") ? "Hide details" : "Show details"}
    </Button>
  )
}

export default function UsePanelsSample() {
  return (
    <div className="h-72 w-full">
      <Panels
        className="h-full overflow-hidden rounded-lg border"
        right={
          <p className="p-4 text-sm text-muted-foreground">Who, when, where.</p>
        }
        defaultOpen={{ right: false }}
      >
        <div className="flex h-full items-center justify-center">
          <ShowDetails />
        </div>
      </Panels>
    </div>
  )
}
