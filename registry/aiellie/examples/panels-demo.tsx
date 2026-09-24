import { Panels } from "@/registry/aiellie/components/panels"

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
      {children}
    </div>
  )
}

export default function PanelsDemo() {
  return (
    <Panels
      className="h-full overflow-hidden rounded-lg border"
      left={<Placeholder>Navigation</Placeholder>}
      right={<Placeholder>Details</Placeholder>}
      bottom={<Placeholder>Output</Placeholder>}
    >
      <Placeholder>Your page goes here.</Placeholder>
    </Panels>
  )
}
