import { Separator } from "@/registry/aiellie/ui/separator"

export default function SeparatorDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3 text-sm">
      <div className="flex flex-col gap-1">
        <p>aiellie elements</p>
        <p className="text-xs text-muted-foreground">
          AI-native UI on Base UI and Tailwind.
        </p>
      </div>
      <Separator />
      <div className="flex h-4 items-center gap-3">
        <span>Blocks</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>UI</span>
      </div>
    </div>
  )
}
