import { WebSearch } from "@/registry/aiellie/components/web-search"

export default function WebSearchDemo() {
  return (
    <div className="w-full max-w-md px-4">
      <WebSearch
        queries={["container queries browser support"]}
        found={[
          {
            url: "https://caniuse.com/css-container-queries",
            title: "CSS Container Queries | Can I use",
            snippet: "Supported in Chrome, Edge, Firefox and Safari.",
          },
          {
            url: "https://web.dev/blog/cq-stable",
            title: "Container queries land in stable browsers",
            date: "2023-02-14",
          },
        ]}
      />
    </div>
  )
}
