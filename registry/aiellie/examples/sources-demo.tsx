import { Source, Sources } from "@/registry/aiellie/components/sources"

const SOURCES = [
  {
    url: "https://recharts.github.io/en-US/api/ResponsiveContainer",
    title: "ResponsiveContainer | Recharts",
  },
  {
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-width",
    title: "min-width | MDN",
  },
  {
    url: "https://tailwindcss.com/docs/min-width",
    title: "min-width | Tailwind CSS",
  },
  { url: "https://react.dev/learn", title: "Quick Start | React" },
  { url: "https://nextjs.org/docs", title: "Next.js Docs" },
  { url: "https://web.dev/learn/css", title: "Learn CSS | web.dev" },
]

export default function SourcesDemo() {
  return (
    <Sources className="max-w-sm px-4">
      {SOURCES.map((source) => (
        <Source key={source.url} href={source.url} title={source.title} />
      ))}
    </Sources>
  )
}
