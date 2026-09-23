import { Panels } from "@/registry/aiellie/components/panels"

export default function PanelsDemo() {
  return (
    // Panels fills the window by default; here it fills the card.
    <Panels className="h-full overflow-hidden rounded-lg border">
      <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
        Your page goes here.
      </div>
    </Panels>
  )
}
