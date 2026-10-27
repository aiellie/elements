"use client"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"
import {
  CodeDiffContent,
  CodeDiffStat,
} from "@/registry/aiellie/components/code-diff"

const DIFF = `diff --git a/lib/format.ts b/lib/format.ts
--- a/lib/format.ts
+++ b/lib/format.ts
@@ -1,8 +1,9 @@
 export function formatDuration(seconds: number) {
-  const whole = Math.round(seconds)
+  const whole = Math.max(1, Math.round(seconds))
   if (whole < 60) return \`\${whole}s\`
   const minutes = Math.floor(whole / 60)
-  return \`\${minutes}m \${whole % 60}s\`
+  const rest = whole % 60
+  return rest > 0 ? \`\${minutes}m \${rest}s\` : \`\${minutes}m\`
 }
`

export default function CodeDiffDemo() {
  return (
    <CodeBlock className="max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>lib/format.ts</CodeBlockTitle>
        <CodeDiffStat diff={DIFF} />
        <CodeBlockActions>
          <CodeBlockCopy code={DIFF} tooltip="Copy diff" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeDiffContent diff={DIFF} language="ts" />
    </CodeBlock>
  )
}
