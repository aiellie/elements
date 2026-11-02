import { Sources } from "@/registry/aiellie/components/sources"

const SOURCES = [
  {
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
    title: "CSS container queries | MDN",
    snippet:
      "Container queries let you apply styles to an element based on the size of its container.",
  },
  {
    url: "https://web.dev/blog/cq-stable",
    title: "Container queries land in stable browsers",
    snippet: "Container queries are now supported in every major browser engine.",
    date: "2023-02-14",
  },
  {
    url: "https://caniuse.com/css-container-queries",
    title: "CSS Container Queries (Size) | Can I use",
  },
  {
    url: "https://www.w3.org/TR/css-contain-3/",
    title: "CSS Containment Module Level 3",
  },
]

export default function SourcesDemo() {
  return (
    <div className="w-full max-w-md px-4">
      <Sources sources={SOURCES} />
    </div>
  )
}
