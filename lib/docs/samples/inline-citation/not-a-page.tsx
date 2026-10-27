"use client"

import { InlineCitation } from "@/registry/aiellie/components/inline-citation"

export default function NotAPage() {
  return (
    <p className="max-w-md text-sm leading-6">
      A citation whose address isn&apos;t a web page keeps its number but leads
      nowhere
      <InlineCitation index={3} href="file:///Users/ada/notes.md" />.
    </p>
  )
}
