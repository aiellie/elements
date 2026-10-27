"use client"

import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"
import {
  CodeDiffContent,
  CodeDiffStat,
} from "@/registry/aiellie/components/code-diff"

const DIFF = `--- /dev/null
+++ b/.env.example
@@ -0,0 +1,3 @@
+DATABASE_URL=
+OPENAI_API_KEY=
+NEXT_PUBLIC_APP_URL=http://localhost:3000
`

export default function NewFile() {
  return (
    <CodeBlock className="max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>.env.example</CodeBlockTitle>
        <CodeDiffStat diff={DIFF} className="ms-auto" />
      </CodeBlockHeader>
      <CodeDiffContent diff={DIFF} lineNumbers={false} />
    </CodeBlock>
  )
}
