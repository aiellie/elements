"use client"

import { Source, Sources } from "@/registry/aiellie/components/sources"

const SOURCES = [
  {
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS/container",
    title: "container | MDN",
    description:
      "A shorthand that sets both the name and the type of a container.",
  },
  {
    href: "https://tailwindcss.com/docs/responsive-design",
    title: "Responsive design | Tailwind CSS",
    description: "Use container queries to style an element by its parent.",
  },
  {
    href: "https://web.dev/learn/css/container-queries",
    title: "Container queries | web.dev",
  },
]

export default function Given() {
  return (
    <Sources>
      {SOURCES.map((source) => (
        <Source key={source.href} {...source} />
      ))}
    </Sources>
  )
}
