"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/aiellie/ui/resizable"

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup className="h-56 max-w-md rounded-xl border text-sm">
      <ResizablePanel
        defaultSize="35%"
        minSize="20%"
        className="flex items-center justify-center p-4"
      >
        Sidebar
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize="30%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel className="flex items-center justify-center p-4">
            Editor
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize="35%"
            minSize="20%"
            className="flex items-center justify-center p-4"
          >
            Terminal
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
