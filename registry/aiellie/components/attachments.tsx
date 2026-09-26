"use client"

import * as React from "react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

// Fades an edge of the row only while more of it is hidden past that edge.
function useScrollFade() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [edges, setEdges] = React.useState({ start: false, end: false })

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => {
      // Negative in a right-to-left row, so the distance is what counts.
      const scrolled = Math.abs(element.scrollLeft)
      const start = scrolled > 0
      const end = scrolled + element.clientWidth < element.scrollWidth - 1
      setEdges((current) =>
        current.start === start && current.end === end
          ? current
          : { start, end }
      )
    }
    update()
    element.addEventListener("scroll", update, { passive: true })
    // Adding or removing a file changes the width without a scroll event.
    const observer = new ResizeObserver(update)
    observer.observe(element)
    const mutations = new MutationObserver(update)
    mutations.observe(element, { childList: true })
    return () => {
      element.removeEventListener("scroll", update)
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])

  const style: React.CSSProperties | undefined =
    edges.start || edges.end
      ? {
          maskImage: `linear-gradient(to var(--attachments-end), ${edges.start ? "transparent" : "#000"}, #000 1.5rem, #000 calc(100% - 1.5rem), ${edges.end ? "transparent" : "#000"})`,
        }
      : undefined

  return { ref, style }
}

function Attachments({
  size = "default",
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  /** 56px squares and chips, or 40px where room is tight. */
  size?: "default" | "sm"
}) {
  const { ref, style: fade } = useScrollFade()

  return (
    <div
      ref={ref}
      data-slot="attachments"
      data-size={size}
      style={{ ...fade, ...style }}
      className={cn(
        "group/attachments flex max-w-full min-w-0 snap-x snap-mandatory [scrollbar-width:none] flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain [--attachments-end:right] rtl:[--attachments-end:left] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    />
  )
}

const attachmentItem =
  "group/attachment relative flex h-14 shrink-0 snap-start overflow-hidden rounded-lg border border-border/60 bg-background transition-[border-color,scale] duration-80 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[size=sm]/attachments:h-10 has-[[data-slot=attachment-open]:active]:scale-[0.97] has-[[data-slot=attachment-open]:focus-visible]:border-ring motion-reduce:transition-none dark:bg-input/30"

function AttachmentOpen({
  name,
  onOpen,
}: {
  name: string
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      data-slot="attachment-open"
      aria-label={`Open ${name}`}
      onClick={onOpen}
      className="absolute inset-0 outline-none"
    />
  )
}

// On an image it floats over the picture, so it takes a backing that reads on
// any photo. It shows on hover and focus, and always on touch.
function AttachmentRemove({
  name,
  onRemove,
}: {
  name: string
  onRemove: () => void
}) {
  return (
    <button
      type="button"
      data-slot="attachment-remove"
      aria-label={`Remove ${name}`}
      onClick={onRemove}
      className="absolute end-1 top-1 flex size-5 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground opacity-0 backdrop-blur-xs transition-[opacity,scale,border-color] duration-150 outline-none group-focus-within/attachment:opacity-100 group-hover/attachment:opacity-100 group-data-[size=sm]/attachments:size-4 focus-visible:border-ring active:scale-90 motion-reduce:transition-none pointer-coarse:opacity-100 [&_svg]:size-3 group-data-[size=sm]/attachments:[&_svg]:size-2.5"
    >
      <HugeiconsIcon aria-hidden icon={Cancel01Icon} strokeWidth={2} />
    </button>
  )
}

function AttachmentImage({
  src,
  name,
  onOpen,
  onRemove,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  src: string
  /** Read out in place of the picture, which shows no name of its own. */
  name: string
  onOpen?: () => void
  onRemove?: () => void
}) {
  return (
    <div
      data-slot="attachment-image"
      className={cn(
        attachmentItem,
        "aspect-square bg-muted dark:bg-muted",
        className
      )}
      {...props}
    >
      {/* Often an object URL, which next/image has nothing to optimise in. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={onOpen ? "" : name}
        className="size-full object-cover"
      />
      {onOpen ? <AttachmentOpen name={name} onOpen={onOpen} /> : null}
      {onRemove ? <AttachmentRemove name={name} onRemove={onRemove} /> : null}
    </div>
  )
}

function AttachmentFile({
  icon,
  name,
  description,
  onOpen,
  onRemove,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  icon: IconSvgElement
  name: string
  /** Its kind and size, e.g. "PDF · 1.2 MB". */
  description?: string
  onOpen?: () => void
  onRemove?: () => void
}) {
  return (
    <div
      data-slot="attachment-file"
      className={cn(
        attachmentItem,
        "max-w-56 items-center gap-2.5 ps-2 pe-3 group-data-[size=sm]/attachments:gap-2 group-data-[size=sm]/attachments:ps-1.5 group-data-[size=sm]/attachments:pe-2.5",
        onRemove && "pe-7 group-data-[size=sm]/attachments:pe-6",
        className
      )}
      {...props}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-data-[size=sm]/attachments:size-7 group-data-[size=sm]/attachments:rounded-sm [&_svg]:size-5 group-data-[size=sm]/attachments:[&_svg]:size-4">
        <HugeiconsIcon aria-hidden icon={icon} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm/5 font-medium group-data-[size=sm]/attachments:text-xs/4">
          {name}
        </span>
        {description ? (
          <span className="truncate text-xs/4 text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      {onOpen ? <AttachmentOpen name={name} onOpen={onOpen} /> : null}
      {onRemove ? <AttachmentRemove name={name} onRemove={onRemove} /> : null}
    </div>
  )
}

export { Attachments, AttachmentFile, AttachmentImage }
