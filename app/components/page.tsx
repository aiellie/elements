import { Activity03Icon, AiBrain01Icon } from "@hugeicons/core-free-icons"
import { DemoCard } from "@/components/pages/demo-card"
import ModelSelectorDemo from "@/registry/aiellie/examples/model-selector-demo"
import StatusDemo from "@/registry/aiellie/examples/status-demo"
export default function ComponentsPage() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 py-8 sm:py-12 md:grid-cols-2 xl:grid-cols-3">
      <DemoCard
        href="/examples/model-selector"
        index={1}
        title="Model Selector"
        icon={AiBrain01Icon}
        description="A simple model selector component"
        
      >
        <ModelSelectorDemo />
      </DemoCard>
      <DemoCard
        href="/examples/status"
        index={2}
        title="Status"
        icon={Activity03Icon}
        description="A simple status component"
      >
        <StatusDemo />
      </DemoCard>
    </div>    
  )
}
