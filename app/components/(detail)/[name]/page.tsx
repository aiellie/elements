import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SquareArrowExpand01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { CommandTabs } from "@/components/docs/command-tabs"
import { ComponentPager } from "@/components/docs/component-pager"
import { DOC_SECTIONS, DocBody } from "@/components/docs/doc-body"
import { InlineText } from "@/components/docs/inline-text"
import { DEMOS } from "@/lib/demos"
import { DOCS_ITEMS, docsContent, docsItem, padIndex } from "@/lib/docs"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"

export const dynamicParams = false

// Typed by hand rather than with `PageProps<"/components/[name]">`, which only
// exists once Next has generated its route types and so fails a cold typecheck.
type Props = { params: Promise<{ name: string }> }

export function generateStaticParams() {
  return DOCS_ITEMS.map(({ name }) => ({ name }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { name } = await props.params
  const item = docsItem(name)
  if (!item) return {}
  return { title: `${item.title} | Components`, description: item.description }
}

// Left out of `.typeset`, which would restyle what's inside, and spaced by the
// same flow as the prose around it.
function Block({ children }: { children: React.ReactNode }) {
  return (
    <div data-not-typeset className="mt-(--typeset-flow)">
      {children}
    </div>
  )
}

const pagerLink =
  "group flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-80 hover:text-foreground motion-reduce:transition-none"

export default async function ComponentPage(props: Props) {
  const { name } = await props.params
  const item = docsItem(name)
  if (!item) notFound()

  const content = docsContent(name)
  const demo = DEMOS[name]
  const previous = DOCS_ITEMS[item.index - 2]
  const next = DOCS_ITEMS[item.index]

  const toc = [
    { id: "installation", title: "Installation" },
    ...(content ? DOC_SECTIONS : []),
  ]
  const showToc = toc.length >= 3

  return (
    <div
      className={cn(
        showToc && "xl:grid xl:grid-cols-[minmax(0,1fr)_10rem] xl:gap-12"
      )}
    >
      <div className="min-w-0">
        <header className="mt-8 lg:mt-0">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-h1 text-balance md:text-display">
              {item.title}
            </h1>
            <ComponentPager name={name} />
          </div>
          <p className="mt-4 max-w-[48ch] text-body-sm text-pretty text-muted-foreground">
            {item.description}
          </p>
        </header>

        {demo ? (
          <figure className="mt-10">
            <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-xl border border-foreground/10 p-5 md:p-6">
              <div className="flex h-full min-h-0 w-full items-center justify-center">
                <demo.Demo />
              </div>
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
            <figcaption className="mt-2.5 text-caption text-muted-foreground">
              fig. 01 · open it full screen from the corner
            </figcaption>
          </figure>
        ) : null}

        <div className="typeset mt-12">
          <h2 id="installation">Installation</h2>
          <Block>
            <CommandTabs args={`shadcn@latest add "@aiellie/${name}"`} />
          </Block>
          <p>
            <InlineText>
              {`shadcn needs the \`@aiellie\` registry in \`components.json\` first. \`npx aiellie add ${name}\` adds it on its first run, then installs the same way.`}
            </InlineText>
          </p>

          {content ? (
            <DocBody content={content} />
          ) : (
            <p className="text-muted-foreground">
              The rest of the docs for {item.title} are still being written.
            </p>
          )}
        </div>

        <nav
          aria-label="Previous and next"
          className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-6"
        >
          {previous ? (
            <Link href={`/components/${previous.name}`} className={pagerLink}>
              <HugeiconsIcon
                aria-hidden
                icon={ArrowLeft01Icon}
                className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100 rtl:group-hover:translate-x-0.5"
              />
              <span className="text-code-sm font-mono tabular-nums">
                {padIndex(previous.index)}
              </span>
              {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/components/${next.name}`} className={pagerLink}>
              <span className="text-code-sm font-mono tabular-nums">
                {padIndex(next.index)}
              </span>
              {next.title}
              <HugeiconsIcon
                aria-hidden
                icon={ArrowRight01Icon}
                className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      {showToc ? (
        <nav aria-label="On this page" className="hidden xl:block">
          <div className="sticky top-12 -mt-20 flex max-h-[calc(100svh-3rem)] w-40 [scrollbar-width:none] flex-col gap-2 overflow-y-auto bg-background pt-20 pb-8 text-caption [&::-webkit-scrollbar]:hidden">
            <span className="text-muted-foreground/70">On this page</span>
            {toc.map((entry) => (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                className="truncate text-muted-foreground transition-colors duration-80 hover:text-foreground motion-reduce:transition-none"
              >
                {entry.title}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </div>
  )
}
