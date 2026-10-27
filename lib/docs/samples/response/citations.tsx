"use client"

import { InlineCitation } from "@/registry/aiellie/components/inline-citation"
import { Response } from "@/registry/aiellie/components/response"
import { Source, Sources } from "@/registry/aiellie/components/sources"

const SOURCES = [
  {
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
    title: "CSS container queries | MDN",
  },
  {
    url: "https://web.dev/blog/cq-stable",
    title: "Container queries | web.dev",
  },
]

const REPLY = `Container queries style an element by its parent's width ([MDN](${SOURCES[0].url})), and every major browser has supported them since 2023 ([web.dev](${SOURCES[1].url})).`

export default function Citations() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Response
        components={{
          // A link to a listed source becomes its number.
          a({ href, children }) {
            const index = SOURCES.findIndex((source) => source.url === href)
            if (index === -1) return <a href={href}>{children}</a>
            return (
              <InlineCitation
                href={SOURCES[index].url}
                index={index + 1}
                title={SOURCES[index].title}
              />
            )
          },
        }}
      >
        {REPLY}
      </Response>
      <Sources>
        {SOURCES.map((source) => (
          <Source key={source.url} href={source.url} title={source.title} />
        ))}
      </Sources>
    </div>
  )
}
