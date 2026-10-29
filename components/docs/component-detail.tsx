import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ComponentSidebar } from "@/components/docs/component-sidebar"
import { CommandTabs } from "@/components/docs/command-tabs"
import { ComponentPager } from "@/components/docs/component-pager"
import { DemoFigure } from "@/components/docs/demo-figure"
import { asInstalled, DOC_SECTIONS, DocBody } from "@/components/docs/doc-body"
import { InlineText } from "@/components/docs/inline-text"
import { DEMOS } from "@/lib/demos"
import {
  docsContent,
  docsItem,
  docsNav,
  padIndex,
  type Gallery,
} from "@/lib/docs"
import { highlightCode } from "@/lib/highlight-code"
import { getRegistryItem } from "@/lib/registry"
import { cn } from "@/lib/utils"

const GALLERY_TITLES = {
  components: "Components",
  design: "Design",
} satisfies Record<Gallery, string>

function componentParams(gallery: Gallery) {
  return docsNav(gallery).items.map(({ name }) => ({ name }))
}

function componentMetadata(gallery: Gallery, name: string): Metadata {
  const item = docsItem(gallery, name)
  if (!item) return {}
  return {
    title: `${item.title} | ${GALLERY_TITLES[gallery]}`,
    description: item.description,
  }
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

function ComponentDetailLayout({
  gallery,
  children,
}: {
  gallery: Gallery
  children: ReactNode
}) {
  return (
    <div className="pt-16 pb-32 md:pt-20 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <ComponentSidebar gallery={gallery} />
      <article className="min-w-0">
        <Link
          href={`/${gallery}`}
          className="inline-flex items-center gap-1.5 text-caption text-muted-foreground transition-colors duration-80 hover:text-foreground motion-reduce:transition-none lg:hidden"
        >
          <HugeiconsIcon
            aria-hidden
            icon={ArrowLeft01Icon}
            className="size-3.5 rtl:-scale-x-100"
          />
          {GALLERY_TITLES[gallery]}
        </Link>
        {children}
      </article>
    </div>
  )
}

async function ComponentDetail({
  gallery,
  name,
}: {
  gallery: Gallery
  name: string
}) {
  const nav = docsNav(gallery)
  const item = docsItem(gallery, name)
  if (!item) notFound()

  const content = docsContent(name)
  const demo = DEMOS[name]
  const file = (await getRegistryItem(name))?.files[0]
  const source = file ? asInstalled(file.content) : ""
  const previous = nav.items[item.index - 2]
  const next = nav.items[item.index]

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
            <ComponentPager gallery={gallery} name={name} />
          </div>
          <p className="mt-4 max-w-[48ch] text-body-sm text-pretty text-muted-foreground">
            {item.description}
          </p>
        </header>

        {demo && file ? (
          <DemoFigure
            name={name}
            file={file.target}
            html={await highlightCode(source)}
            code={source}
          >
            <demo.Demo />
          </DemoFigure>
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
            <Link href={`/${gallery}/${previous.name}`} className={pagerLink}>
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
            <Link href={`/${gallery}/${next.name}`} className={pagerLink}>
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

export {
  ComponentDetail,
  ComponentDetailLayout,
  componentMetadata,
  componentParams,
}
