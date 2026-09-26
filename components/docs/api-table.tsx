import { InlineText } from "@/components/docs/inline-text"
import type { DocPart } from "@/lib/docs"

// Plain table markup, so `.typeset` sets it like the prose around it.
function ApiTable({ part }: { part: DocPart }) {
  return (
    <>
      <h3>
        <code>{part.name}</code>
      </h3>
      {part.description ? (
        <p>
          <InlineText>{part.description}</InlineText>
        </p>
      ) : null}
      <table className="w-full">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {part.props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
                {prop.required ? (
                  <>
                    <span aria-hidden>*</span>
                    <span className="sr-only"> (required)</span>
                  </>
                ) : null}
                <span className="mt-1 block text-xs text-muted-foreground">
                  <InlineText>{prop.description}</InlineText>
                </span>
              </td>
              <td>
                <code className="whitespace-nowrap">{prop.type}</code>
              </td>
              <td>
                {prop.default ? (
                  <code>{prop.default}</code>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export { ApiTable }
