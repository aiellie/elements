"use client"

import { Panels } from "@/registry/aiellie/components/panels"
import { Badge } from "@/registry/aiellie/ui/badge"

export default function Headers() {
  return (
    <div className="h-72 w-full">
      <Panels
        className="h-full overflow-hidden rounded-lg border"
        left={<p className="p-4 text-sm text-muted-foreground">Chats</p>}
        bottom={
          <pre className="p-4 font-mono text-xs text-muted-foreground">
            $ pnpm build
          </pre>
        }
        headers={{
          main: <span className="px-1 text-sm font-medium">Q3 planning</span>,
          bottom: (
            <span className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
              Terminal <Badge variant="secondary">running</Badge>
            </span>
          ),
        }}
        headerBorder={{ left: false }}
        toggleAt={{ left: "start" }}
        defaultOpen={{ left: true, bottom: true }}
      >
        <p className="p-4 text-sm text-muted-foreground">The page.</p>
      </Panels>
    </div>
  )
}
