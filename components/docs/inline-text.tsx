// Sets runs inside `backticks` as code, the way the docs content writes them.
// Inside `.typeset` the code takes its size from the text around it.
function InlineText({ children }: { children: string }) {
  return children
    .split(/(`[^`]+`)/)
    .map((part, index) =>
      part.startsWith("`") && part.endsWith("`") && part.length > 1 ? (
        <code key={index}>{part.slice(1, -1)}</code>
      ) : (
        part
      )
    )
}

export { InlineText }
