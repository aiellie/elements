import { InitSnippet } from "@/app/(home)/components/init-snippet"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="flex flex-col gap-10 py-8 sm:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl tracking-tight">Library for building AI Agents.</h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Primitives and a runtime for production chat. Upgrade to pro to connect backend.
        </p>
      </div>
      <InitSnippet />
      <Separator />
    </div>
  )
}