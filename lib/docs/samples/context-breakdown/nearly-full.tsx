import { ContextBreakdown } from "@/registry/aiellie/components/context-breakdown"

export default function NearlyFull() {
  return (
    <ContextBreakdown
      label="Context · compact soon"
      max={128_000}
      className="max-w-xs"
      segments={[
        { key: "system", label: "System prompt", tokens: 4_100 },
        {
          key: "conversation",
          label: "Conversation",
          tokens: 117_400,
          className: "bg-destructive",
        },
      ]}
    />
  )
}
