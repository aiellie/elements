import { DemoCard } from "@/components/pages/demo-card"
import ButtonDemo from "@/registry/aiellie/examples/button-demo"
export default function UiPage() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 py-8 sm:py-12 md:grid-cols-2 xl:grid-cols-3">
      <DemoCard
        href="/ui/button"
        index={1}
        title="Button"
        description="A simple button component"
        
      >
        <ButtonDemo />
      </DemoCard>
    </div>     
  )
}
