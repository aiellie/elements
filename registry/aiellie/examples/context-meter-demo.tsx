import { ContextMeter } from "@/registry/aiellie/components/context-meter"

export default function ContextMeterDemo() {
  return (
    <div className="flex flex-col items-center gap-1">
      <ContextMeter
        used={86_400}
        limit={200_000}
        cost={0.42}
        last={{
          inputTokens: 84_200,
          outputTokens: 2_200,
          totalTokens: 86_400,
          inputTokenDetails: {
            noCacheTokens: 12_200,
            cacheReadTokens: 72_000,
            cacheWriteTokens: 0,
          },
          outputTokenDetails: { textTokens: 1_400, reasoningTokens: 800 },
        }}
      />
      <p className="text-xs text-muted-foreground">
        Click the ring to see what the chat has used.
      </p>
    </div>
  )
}
