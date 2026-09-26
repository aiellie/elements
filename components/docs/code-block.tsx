"use client"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/components/tooltip-icon-button"

// `html` comes from highlightCode, which escapes the code, so nothing in it
// is markup the snippet wrote.
function CodeBlock({
  html,
  code,
  className,
}: {
  html: string
  /** What the copy button puts on the clipboard. */
  code: string
  className?: string
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <div
      data-slot="code-block"
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-background",
        className
      )}
    >
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="overflow-x-auto text-code-block [&_pre]:overflow-visible! [&_pre]:px-4! [&_pre]:py-4! dark:[&_span]:text-(color:--shiki-dark)!"
      />
      <TooltipIconButton
        tooltip={isCopied ? "Copied" : "Copy code"}
        aria-label={isCopied ? "Copied" : "Copy code"}
        onClick={() => copyToClipboard(code)}
        className="absolute end-2 top-2 size-7 bg-background"
      >
        <HugeiconsIcon aria-hidden icon={isCopied ? Tick02Icon : Copy01Icon} />
      </TooltipIconButton>
    </div>
  )
}

export { CodeBlock }
