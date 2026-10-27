import { InlineText } from "@/components/docs/inline-text"
import type { DocPart } from "@/lib/docs"

// A spec sheet rather than a table: a hairline opens the list and one closes
// every row, each a mono name with its type and default beside it.
function PropsList({ part, labelled }: { part: DocPart; labelled: boolean }) {
  return (
    <div data-not-typeset className="mt-(--typeset-section)">
      {labelled ? (
        <p className="mb-2 text-code-sm font-mono [overflow-wrap:anywhere] text-muted-foreground">
          {part.name}
        </p>
      ) : null}
      {part.description ? (
        <p className="mb-3 text-body-sm text-muted-foreground">
          <InlineText>{part.description}</InlineText>
        </p>
      ) : null}
      <dl className="border-t border-border">
        {part.props.map((prop) => (
          <div key={prop.name} className="border-b border-border py-3">
            <dt className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-code font-mono text-foreground">
                {prop.name}
                {!prop.required && !prop.default ? "?" : null}
              </span>
              <span className="text-code-sm font-mono text-muted-foreground">
                {prop.type}
              </span>
              {prop.default ? (
                <span className="text-code-sm font-mono text-muted-foreground">
                  = {prop.default}
                </span>
              ) : null}
              {prop.required ? (
                <span className="text-caption text-muted-foreground">
                  required
                </span>
              ) : null}
            </dt>
            <dd className="pt-1.5 text-body-sm text-muted-foreground [&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:text-code-sm [&_code]:font-mono">
              <InlineText>{prop.description}</InlineText>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export { PropsList }
