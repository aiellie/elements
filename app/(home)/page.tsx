import { DemoCard } from "@/components/pages/demo-card"
import { HelloWorldPage } from "@/registry/aiellie/blocks/hello-world/page"

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 py-8 sm:py-12 md:grid-cols-2 xl:grid-cols-3">
      <DemoCard
        href="/elements/hello-world"
        index={1}
        title="Hello World"
        description="A simple hello world component"
        wide
        connection="aiellie"
      >
        <HelloWorldPage />
      </DemoCard>
    </div>
  )
}
