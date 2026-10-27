import Link from "next/link"

// Sets runs inside `backticks` as code and [label](href) as links, the way the
// docs content writes them. Inside `.typeset` the code takes its size from the
// text around it.
function InlineText({ children }: { children: string }) {
  return children
    .split(/(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/)
    .map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
        return <code key={index}>{part.slice(1, -1)}</code>
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
      if (link) {
        const [, label, href] = link
        const text =
          label.startsWith("`") && label.endsWith("`") ? (
            <code>{label.slice(1, -1)}</code>
          ) : (
            label
          )
        return href.startsWith("/") || href.startsWith("#") ? (
          <Link key={index} href={href}>
            {text}
          </Link>
        ) : (
          <a key={index} href={href}>
            {text}
          </a>
        )
      }
      return part
    })
}

export { InlineText }
