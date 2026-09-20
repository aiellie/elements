"use client"

import {
  AiEditingIcon,
  AiBeautifyIcon,
  ArrowUp02Icon,
  Copy01Icon,
  Delete01Icon,
  Search02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/aiellie/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="default">
          <HugeiconsIcon icon={ArrowUp02Icon} /> Submit
        </Button>
        <Button size="sm" variant="outline">
          <HugeiconsIcon icon={Copy01Icon} /> Copy
        </Button>
        <Button size="sm" variant="secondary">
          <HugeiconsIcon icon={Search02Icon} /> Search
        </Button>
        <Button size="sm" variant="ghost">
          <HugeiconsIcon icon={AiEditingIcon} /> Edit
        </Button>
        <Button size="sm" variant="link">
          <HugeiconsIcon icon={AiBeautifyIcon} /> Generate
        </Button>
        <Button size="sm" variant="destructive">
          <HugeiconsIcon icon={Delete01Icon} /> Delete
        </Button>
      </div>
    </div>
  )
}
