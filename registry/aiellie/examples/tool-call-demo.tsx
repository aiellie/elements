"use client"

import * as React from "react"
import {
  File01Icon,
  Globe02Icon,
  CommandLineIcon,
} from "@hugeicons/core-free-icons"

import {
  ToolCall,
  ToolCallApproval,
  ToolCallCode,
  ToolCallContent,
  ToolCallSection,
  ToolCallTrigger,
  type ToolCallStatus,
} from "@/registry/aiellie/components/tool-call"

export default function ToolCallDemo() {
  const [shell, setShell] = React.useState<ToolCallStatus>("awaiting")

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <ToolCall>
        <ToolCallTrigger
          icon={Globe02Icon}
          name="Searched the web"
          summary="“css container queries support”"
        />
        <ToolCallContent>
          <ToolCallSection title="Input">
            <ToolCallCode value={{ query: "css container queries support" }} />
          </ToolCallSection>
          <ToolCallSection title="Output">
            <ToolCallCode
              value={[
                {
                  title: "Container queries | MDN",
                  url: "https://developer.mozilla.org",
                },
                { title: "Can I use", url: "https://caniuse.com" },
              ]}
            />
          </ToolCallSection>
        </ToolCallContent>
      </ToolCall>
      <ToolCall status="running">
        <ToolCallTrigger
          icon={File01Icon}
          name="Reading"
          summary="app/layout.tsx"
        />
      </ToolCall>
      <ToolCall status={shell} defaultOpen>
        <ToolCallTrigger
          icon={CommandLineIcon}
          name={shell === "running" ? "Running" : "Run"}
          summary="pnpm test"
        />
        {shell === "awaiting" ? (
          <ToolCallApproval
            onApprove={() => setShell("running")}
            onDeny={() => setShell("error")}
          >
            Run <code className="font-mono text-xs">pnpm test</code>?
          </ToolCallApproval>
        ) : null}
        <ToolCallContent>
          <ToolCallSection title="Command">
            <ToolCallCode value="pnpm test" />
          </ToolCallSection>
        </ToolCallContent>
      </ToolCall>
    </div>
  )
}
