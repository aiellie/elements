import { readFile } from "node:fs/promises"
import path from "node:path"
import { Fragment } from "react"

import { CodeBlock } from "@/components/docs/code-block"
import { InlineText } from "@/components/docs/inline-text"
import { PreviewCode } from "@/components/docs/preview-code"
import { Step, Steps } from "@/components/docs/steps"
import type { DocCode, DocContent, DocTable, DocText } from "@/lib/docs"
import { SAMPLES } from "@/lib/docs/samples"
import { highlightCode } from "@/lib/highlight-code"

// Left out of `.typeset`, which would restyle what's inside, and spaced by the
// same flow as the prose around it.
function Block({ children }: { children: React.ReactNode }) {
  return (
    <div data-not-typeset className="mt-(--typeset-flow)">
      {children}
    </div>
  )
}

function Paragraphs({ texts }: { texts?: DocText[] }) {
  return texts?.map((text) => (
    <p key={text}>
      <InlineText>{text}</InlineText>
    </p>
  ))
}

async function Code({ code }: { code: DocCode }) {
  return (
    <Block>
      <CodeBlock
        html={await highlightCode(code.code, code.lang)}
        code={code.code}
        title={code.title}
      />
    </Block>
  )
}

// What someone who installed the item writes: the paths the registry files
// land at, rather than this repo's.
function asInstalled(source: string) {
  return source
    .replace(/@\/registry\/aiellie\/components\//g, "@/components/aiellie/")
    .replace(/@\/registry\/aiellie\/icons\//g, "@/components/aiellie/icons/")
    .replace(/@\/registry\/aiellie\/ui\//g, "@/components/ui/")
    .replace(/@\/registry\/aiellie\/lib\//g, "@/lib/")
    .replace(/@\/registry\/aiellie\/hooks\//g, "@/hooks/")
    .trim()
}

async function Sample({ id }: { id: string }) {
  const load = SAMPLES[id]
  if (!load) throw new Error(`No sample "${id}" in lib/docs/samples.`)
  const [{ default: Preview }, source] = await Promise.all([
    load(),
    readFile(path.join(process.cwd(), "lib/docs/samples", `${id}.tsx`), "utf8"),
  ])
  const code = asInstalled(source)

  return (
    <Block>
      <PreviewCode html={await highlightCode(code)} code={code}>
        <Preview />
      </PreviewCode>
    </Block>
  )
}

function Table({ table }: { table: DocTable }) {
  return (
    <>
      <h3>{table.title}</h3>
      <Paragraphs texts={table.body} />
      <div className="typeset-scroll">
        <table>
          <thead>
            <tr>
              {table.head.map((cell) => (
                <th key={cell}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td
                    key={index}
                    className={
                      index === row.length - 1 ? "max-w-96 min-w-56" : undefined
                    }
                  >
                    <InlineText>{cell}</InlineText>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paragraphs texts={table.after} />
    </>
  )
}

const DOC_SECTIONS = [
  { id: "getting-started", title: "Getting started" },
  { id: "anatomy", title: "Anatomy" },
  { id: "examples", title: "Examples" },
  { id: "api-reference", title: "API reference" },
]

// The sections of an item's page after its installation, in the order
// assistant-ui's element pages run.
async function DocBody({ content }: { content: DocContent }) {
  return (
    <>
      <Paragraphs texts={content.intro} />

      <h2 id="getting-started">Getting started</h2>
      <Paragraphs texts={content.gettingStarted.body} />
      <Steps>
        {content.gettingStarted.steps.map((step) => (
          <Step key={step.title}>
            <h3>{step.title}</h3>
            <Paragraphs texts={step.body} />
            {step.code ? <Code code={step.code} /> : null}
            <Paragraphs texts={step.after} />
          </Step>
        ))}
      </Steps>

      <h2 id="anatomy">Anatomy</h2>
      <Code code={{ code: content.anatomy.code }} />
      <Paragraphs texts={content.anatomy.body} />

      <h2 id="examples">Examples</h2>
      {content.examples.map((example) => (
        <Fragment key={example.title}>
          <h3>{example.title}</h3>
          <Paragraphs texts={example.body} />
          {example.sample ? <Sample id={example.sample} /> : null}
          {example.code ? <Code code={example.code} /> : null}
          <Paragraphs texts={example.after} />
        </Fragment>
      ))}

      <h2 id="api-reference">API reference</h2>
      {content.api.map((table) => (
        <Table key={table.title} table={table} />
      ))}
    </>
  )
}

export { asInstalled, DOC_SECTIONS, DocBody }
