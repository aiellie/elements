"use client"

import { File01Icon } from "@hugeicons/core-free-icons"

import {
  ToolCall,
  ToolCallCode,
  ToolCallContent,
  ToolCallSection,
  ToolCallTrigger,
} from "@/registry/aiellie/components/tool-call"

export default function Failed() {
  return (
    <ToolCall status="error" defaultOpen className="w-full max-w-md">
      <ToolCallTrigger
        icon={File01Icon}
        name="Read"
        summary="app/missing.tsx"
      />
      <ToolCallContent>
        <ToolCallSection title="Input">
          <ToolCallCode value={{ path: "app/missing.tsx" }} />
        </ToolCallSection>
        <ToolCallSection title="Error">
          <ToolCallCode
            value="ENOENT: no such file or directory"
            className="text-destructive"
          />
        </ToolCallSection>
      </ToolCallContent>
    </ToolCall>
  )
}
