import { Input } from "@/registry/aiellie/ui/input"

export default function InputDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Input aria-label="Name" placeholder="Name your agent" />
      <Input aria-label="Disabled" placeholder="Disabled" disabled />
    </div>
  )
}
