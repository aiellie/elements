import { Orb } from "@/registry/aiellie/components/orb"

export default function Seeds() {
  return (
    <div className="flex items-center gap-6">
      <Orb seed="aiellie" size={64} />
      <Orb seed="anthropic" size={64} state="speaking" />
      <Orb seed="my product" size={64} state="thinking" />
    </div>
  )
}
