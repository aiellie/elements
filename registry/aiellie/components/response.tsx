"use client"

import * as React from "react"
import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"

// Just the parts of a hast node this file touches, so it needs no types
// package of its own.
type HastNode = {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

const WORD = [
  "transition-[opacity,filter] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
  "starting:opacity-0 starting:blur-xs",
]

const CARET = [
  "ms-0.5 inline-block h-3.5 w-0.5 animate-caret-blink bg-live align-middle motion-reduce:animate-none",
]

const BLOCKS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "pre",
  "hr",
])

// While a reply streams, each word is its own span, so only the words that
// just arrived mount, and only they fade in. The caret goes at the end of the
// last block of text.
function rehypeStreaming() {
  return (tree: HastNode) => {
    const split = (node: HastNode) => {
      if (!node.children) return
      node.children = node.children.flatMap((child): HastNode[] => {
        if (child.type === "text" && child.value) {
          return child.value
            .split(/(\s+)/)
            .filter(Boolean)
            .map((part) =>
              /^\s/.test(part)
                ? { type: "text", value: part }
                : {
                    type: "element",
                    tagName: "span",
                    properties: { className: WORD },
                    children: [{ type: "text", value: part }],
                  }
            )
        }
        if (
          child.type === "element" &&
          child.tagName !== "pre" &&
          child.tagName !== "code"
        ) {
          split(child)
        }
        return [child]
      })
    }
    split(tree)

    let node = tree
    for (;;) {
      const last = node.children
        ?.filter((child) => child.type === "element")
        .at(-1)
      if (!last || !BLOCKS.has(last.tagName ?? "")) break
      if (last.tagName === "pre" || last.tagName === "hr") return
      node = last
    }
    if (node === tree) return
    node.children = [
      ...(node.children ?? []),
      {
        type: "element",
        tagName: "span",
        properties: {
          ariaHidden: "true",
          dataSlot: "response-caret",
          className: CARET,
        },
        children: [],
      },
    ]
  }
}

type CodeElement = React.ReactElement<{
  className?: string
  children?: React.ReactNode
}>

const COMPONENTS: Components = {
  pre({ children }) {
    const code = React.Children.toArray(children)[0] as CodeElement | undefined
    const language = /language-(\S+)/.exec(code?.props.className ?? "")?.[1]
    const text = String(code?.props.children ?? "").replace(/\n$/, "")

    return (
      <CodeBlock data-slot="response-code-block">
        <CodeBlockHeader>
          <CodeBlockTitle>{language ?? "text"}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopy code={text} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent code={text} language={language} />
      </CodeBlock>
    )
  },
  table({ node, ...props }) {
    void node
    return (
      <div data-slot="response-table" className="min-w-0 overflow-x-auto">
        <table {...props} />
      </div>
    )
  },
  a({ node, ...props }) {
    void node
    return <a target="_blank" rel="noopener noreferrer" {...props} />
  },
}

function Response({
  children,
  streaming = false,
  components,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The reply, as Markdown. */
  children: string
  /** Fades in each word as it arrives, with a caret after the last. */
  streaming?: boolean
  /** Renderers of your own for any element, merged over the defaults. */
  components?: Components
}) {
  const merged = React.useMemo(
    () => ({ ...COMPONENTS, ...components }),
    [components]
  )

  return (
    <div
      data-slot="response"
      data-streaming={streaming || undefined}
      aria-busy={streaming || undefined}
      className={cn(
        "flex min-w-0 flex-col gap-4 text-sm leading-6 wrap-break-word whitespace-normal text-foreground",
        "[&_h1]:text-lg [&_h1]:font-medium [&_h2]:text-base [&_h2]:font-medium [&_h3]:text-sm [&_h3]:font-medium [&>:is(h1,h2,h3):not(:first-child)]:mt-2",
        "[&_li]:ps-1 [&_li+li]:mt-1 [&_li::marker]:text-muted-foreground [&_li>:is(ul,ol)]:mt-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_ul]:list-disc [&_ul]:ps-5",
        "[&_a]:font-medium [&_a]:underline-offset-4 [&_a:hover]:underline [&_strong]:font-medium",
        "[&_blockquote]:border-s-2 [&_blockquote]:border-border [&_blockquote]:ps-3 [&_blockquote]:text-muted-foreground [&_hr]:border-border",
        "[&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:box-decoration-clone [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-px [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.93em]",
        "[&_:is(td,th):not(:last-child)]:pe-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border-b [&_td]:border-border/60 [&_td]:py-2 [&_td]:align-top [&_th]:border-b [&_th]:border-border [&_th]:pb-2 [&_th]:text-start [&_th]:text-xs [&_th]:font-medium [&_th]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={streaming ? [rehypeStreaming] : undefined}
        components={merged}
      >
        {children}
      </Markdown>
    </div>
  )
}

export { Response }
