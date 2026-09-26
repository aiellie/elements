"use client"

import * as React from "react"
import { Link01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/aiellie/ui/hover-card"
import { Skeleton } from "@/registry/aiellie/ui/skeleton"

type SourcePreview = {
  title?: string
  description?: string
  /** The page's own preview image, like its `og:image`. */
  image?: string
  icon?: string
  siteName?: string
}

type LoadPreview = (href: string) => Promise<SourcePreview | null>

const SourcesContext = React.createContext<{ loadPreview?: LoadPreview }>({})

const sourceChip =
  "inline-flex h-6 max-w-48 min-w-0 items-center gap-1.5 rounded-md border border-border/60 px-2 text-xs text-muted-foreground transition-colors duration-80 outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring data-popup-open:bg-muted data-popup-open:text-foreground motion-reduce:transition-none dark:hover:bg-muted/50 dark:data-popup-open:bg-muted/50"

// Only a web page can be a source. Anything else, like a `javascript:` link
// a search handed back, isn't one.
function urlOf(href: string) {
  try {
    const url = new URL(href)
    return url.protocol === "https:" || url.protocol === "http:" ? url : null
  } catch {
    return null
  }
}

// Each page is asked for once, however many chips and cards want it.
const previews = new Map<string, Promise<SourcePreview | null>>()

function usePreview(
  href: string,
  load: LoadPreview | undefined,
  want: boolean
) {
  const [preview, setPreview] = React.useState<SourcePreview | null>()

  React.useEffect(() => {
    if (!want || !load) return
    let current = true
    let request = previews.get(href)
    if (!request) {
      request = load(href).catch(() => null)
      previews.set(href, request)
    }
    void request.then((result) => {
      if (current) setPreview(result)
    })
    return () => {
      current = false
    }
  }, [href, load, want])

  return { preview, loading: want && Boolean(load) && preview === undefined }
}

// Tries each icon in turn and falls back to a link glyph, so a site without
// one never shows a broken image. `onMissing` asks for more places to look.
function Favicon({
  icons,
  onMissing,
  className,
}: {
  icons: (string | undefined)[]
  onMissing?: () => void
  className?: string
}) {
  const candidates = [...new Set(icons.filter(Boolean))] as string[]
  const [failed, setFailed] = React.useState(0)
  const src = candidates[failed]

  if (!src) {
    return (
      <HugeiconsIcon
        aria-hidden
        icon={Link01Icon}
        className={cn("size-3 shrink-0", className)}
      />
    )
  }

  return (
    // A favicon is tiny and from anywhere, so next/image has nothing to add.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => {
        if (failed + 1 >= candidates.length) onMissing?.()
        setFailed((count) => count + 1)
      }}
      className={cn("size-3.5 shrink-0 rounded-sm object-contain", className)}
    />
  )
}

function Sources({
  max = 4,
  loadPreview,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** How many show before the rest fold into a "+N" chip. */
  max?: number
  /** Fetches a page's title, description, image and icon for its hover card. Without it, the card shows what each source was given. */
  loadPreview?: LoadPreview
}) {
  const [all, setAll] = React.useState(false)
  // A source that isn't a web page shows nothing, so it isn't counted either.
  const items = React.Children.toArray(children).filter(
    (item) =>
      !React.isValidElement<{ href?: unknown }>(item) ||
      typeof item.props.href !== "string" ||
      urlOf(item.props.href) !== null
  )
  const shown = all ? items : items.slice(0, max)
  const more = items.length - shown.length

  return (
    <SourcesContext.Provider value={{ loadPreview }}>
      <div
        data-slot="sources"
        role="group"
        aria-label="Sources"
        className={cn("flex flex-wrap items-center gap-1.5", className)}
        {...props}
      >
        {shown}
        {more > 0 ? (
          <button
            type="button"
            data-slot="sources-more"
            aria-label={`Show ${more} more sources`}
            onClick={() => setAll(true)}
            className={sourceChip}
          >
            +{more}
          </button>
        ) : null}
      </div>
    </SourcesContext.Provider>
  )
}

function Source({
  href,
  title,
  description,
  image,
  icon,
  className,
  ...props
}: Omit<React.ComponentProps<"a">, "href" | "children"> &
  SourcePreview & {
    href: string
  }) {
  const { loadPreview } = React.useContext(SourcesContext)
  const [open, setOpen] = React.useState(false)
  const [iconMissing, setIconMissing] = React.useState(false)
  const [imageFailed, setImageFailed] = React.useState(false)
  // Read the first time the card opens, or sooner if the site has no
  // favicon where browsers look for one.
  const { preview, loading } = usePreview(
    href,
    loadPreview,
    open || iconMissing
  )
  const url = urlOf(href)
  if (!url) return null

  const host = url.hostname.replace(/^www\./, "")
  const icons = [icon, `${url.origin}/favicon.ico`, preview?.icon]
  const shownTitle = title ?? preview?.title
  const shownDescription = description ?? preview?.description
  const shownImage = imageFailed ? undefined : (image ?? preview?.image)

  return (
    <HoverCard onOpenChange={setOpen}>
      <HoverCardTrigger
        data-slot="source"
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(sourceChip, className)}
        {...props}
      >
        <Favicon icons={icons} onMissing={() => setIconMissing(true)} />
        <span className="truncate">{host}</span>
      </HoverCardTrigger>
      <HoverCardContent
        data-slot="source-preview"
        side="top"
        className="flex w-72 flex-col gap-2 p-2"
      >
        {shownImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shownImage}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="aspect-[1.91/1] w-full rounded-md bg-muted object-cover"
          />
        ) : null}
        <div className="flex min-w-0 flex-col gap-1 px-1 pb-1">
          <div className="flex min-w-0 items-center gap-1.5 text-xs">
            <Favicon icons={icons} />
            <span className="truncate">{preview?.siteName ?? host}</span>
          </div>
          {loading && !shownTitle ? (
            <div className="flex flex-col gap-1.5 py-0.5">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          ) : (
            <>
              <p className="line-clamp-2 text-sm font-medium">
                {shownTitle ?? url.href}
              </p>
              {shownDescription ? (
                <p className="line-clamp-3 text-xs">{shownDescription}</p>
              ) : null}
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export { Source, Sources }
export type { SourcePreview }
