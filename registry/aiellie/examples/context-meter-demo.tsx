import { ContextMeter } from "@/registry/aiellie/components/context-meter"

export default function ContextMeterDemo() {
  return (
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
  )
}
