import { InitSnippet } from "@/app/(home)/components/init-snippet"
import { Separator } from "@/components/ui/separator"
import { HelloWorldPage } from "@/registry/aiellie/blocks/hello-world/page"

export default function Page() {
  return (
    <div className="flex flex-col gap-10 py-8 sm:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl tracking-tight">Library for building AI Agents.</h1>
        <h2 className="max-w-prose text-md font-normal leading-relaxed text-muted-foreground">
          Primitives and a runtime for production chat. Upgrade to pro to connect backend.
        </h2>
      </div>
      <InitSnippet />
      <Separator />
      <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground sm:pl-3">
              A simple hello world component
            </h2>
          </div>
          <div className="flex items-center justify-center min-h-[400px] relative">
            <HelloWorldPage />
          </div>
        </div>
    </div>
  )
}