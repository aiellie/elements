"use client"

import { InlineCitation } from "@/registry/aiellie/components/inline-citation"

export default function InlineCitationDemo() {
  return (
    <p className="max-w-md text-sm leading-6">
      Container queries style an element by its parent&apos;s size rather than
      the viewport&apos;s
      <InlineCitation
        index={1}
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries"
        title="CSS container queries | MDN"
        description="Container queries let you apply styles to an element based on the size of its container."
      />
      , and every major browser has shipped them since 2023
      <InlineCitation
        index={2}
        href="https://web.dev/blog/cq-stable"
        title="Container queries land in stable browsers | web.dev"
      />
      .
    </p>
  )
}
