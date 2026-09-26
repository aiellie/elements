import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SquareArrowExpand01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ApiTable } from "@/components/docs/api-table"
import { CodeBlock } from "@/components/docs/code-block"
import { InlineText } from "@/components/docs/inline-text"
import { InstallCommand } from "@/components/pages/install-command"
import { DEMOS } from "@/lib/demos"
import { ITEM_ICONS } from "@/lib/item-icons"
import {
  DOCS_ITEMS,
  docsContent,
  docsItem,
  docsSectionOf,
  type DocSnippet,
} from "@/lib/docs"
import { highlightCode } from "@/lib/highlight-code"
import { Button } from "@/registry/aiellie/ui/button"

export const dynamicParams = false

// Typed by hand rather than with `PageProps<"/docs/[name]">`, which only exists
// once Next has generated its route types and so fails a cold typecheck.
type Props = { params: Promise<{ name: string }> }

export function generateStaticParams() {
  return DOCS_ITEMS.map(({ name }) => ({ name }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { name } = await props.params
  const item = docsItem(name)
  return { title: item?.title, description: item?.description }
}

const dots =
  "[background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:12px_12px]"

// Left out of `.typeset`, which would restyle what's inside, and spaced by the
// same flow as the prose around it.
function Block({ children }: { children: React.ReactNode }) {
  return (
    <div data-not-typeset className="mt-(--typeset-flow)">
      {children}
    </div>
  )
}

async function Snippet({ snippet }: { snippet: DocSnippet }) {
  return (
    <>
      {snippet.description ? (
        <p>
          <InlineText>{snippet.description}</InlineText>
        </p>
      ) : null}
      <Block>
        <CodeBlock
          html={await highlightCode(snippet.code)}
          code={snippet.code}
        />
      </Block>
    </>
  )
}

export default async function DocsItemPage(props: Props) {
  const { name } = await props.params
  const item = docsItem(name)
  if (!item) notFound()

  const content = docsContent(name)
  const demo = DEMOS[name]
  const icon = ITEM_ICONS[name]
  const block = item.type === "registry:block"

  const contents = [
    { id: "installation", title: "Installation" },
    ...(content
      ? [
          { id: "usage", title: "Usage" },
          ...(content.composition
            ? [{ id: "composition", title: "Composition" }]
            : []),
          { id: "api-reference", title: "API reference" },
        ]
      : []),
  ]

  return (
    <div className="flex gap-12 py-8 md:py-10">
      <article className="typeset min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">
          {docsSectionOf(item)} · {item.category}
        </p>
        {/* Under its eyebrow rather than a section's worth below it. */}
        <h1 className="mt-2 flex items-center gap-2">
          {icon ? (
            <HugeiconsIcon
              aria-hidden
              icon={icon}
              className="size-[1em] shrink-0 text-foreground/80"
            />
          ) : null}
          {item.title}
        </h1>
        <p className="text-muted-foreground">{item.description}</p>

        {block ? (
          // A block is a whole page, so it previews in a frame of its own.
          <Block>
            <iframe
              src={`/view/${name}`}
              title={`${item.title} preview`}
              className="h-150 w-full rounded-xl border border-border/60 bg-background"
            />
          </Block>
        ) : demo ? (
          <Block>
            <div
              className={`relative flex min-h-80 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-background p-8 ${dots}`}
            >
              <demo.Demo />
              <Button
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link href={`/demo/${name}`} />}
                className="absolute end-2 top-2 text-muted-foreground"
              >
                <HugeiconsIcon aria-hidden icon={SquareArrowExpand01Icon} />
                <span className="sr-only">Open full screen</span>
              </Button>
            </div>
          </Block>
        ) : null}

        <h2 id="installation">Installation</h2>
        <Block>
          <InstallCommand
            command={`npx aiellie add ${name}`}
            className="w-fit max-w-full"
          />
        </Block>
        <p>
          <InlineText>
            {`The command adds the @aiellie registry to components.json on its first run. With it there, shadcn installs it too: \`npx shadcn@latest add @aiellie/${name}\`.`}
          </InlineText>
        </p>

        {content ? (
          <>
            <h2 id="usage">Usage</h2>
            <Snippet snippet={content.usage} />
            {content.composition ? (
              <>
                <h2 id="composition">Composition</h2>
                <Snippet snippet={content.composition} />
              </>
            ) : null}
            <h2 id="api-reference">API reference</h2>
            {content.api.map((part) => (
              <ApiTable key={part.name} part={part} />
            ))}
            {content.notes?.length ? (
              <ul>
                {content.notes.map((note) => (
                  <li key={note}>
                    <InlineText>{note}</InlineText>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <p className="text-muted-foreground">
            Usage and the API reference for {item.title} are still being
            written.
          </p>
        )}
      </article>

      <aside className="sticky top-12 hidden h-fit w-44 shrink-0 self-start py-2 xl:block">
        <p className="flex h-8 items-center text-xs font-medium text-muted-foreground">
          On this page
        </p>
        <ul className="flex flex-col">
          {contents.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className="flex h-7 items-center text-sm text-muted-foreground transition-colors duration-80 hover:text-foreground motion-reduce:transition-none"
              >
                {entry.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
