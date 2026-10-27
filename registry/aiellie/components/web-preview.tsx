"use client"

import * as React from "react"
import {
  Alert02Icon,
  ArrowDown01Icon,
  BrushIcon,
  Camera01Icon,
  Clock01Icon,
  CookieIcon,
  DatabaseIcon,
  Download01Icon,
  Key01Icon,
  LinkSquare02Icon,
  LockKeyIcon,
  Maximize01Icon,
  Minimize01Icon,
  MinusSignIcon,
  MoreVerticalIcon,
  PlusSignCircleIcon,
  PlusSignIcon,
  PrinterIcon,
  RefreshIcon,
  Search01Icon,
  SearchAddIcon,
  Settings01Icon,
  SlidersHorizontalIcon,
  SmartPhone01Icon,
  SquareLockPasswordIcon,
  UnavailableIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/registry/aiellie/components/menu"
import { Button } from "@/registry/aiellie/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/aiellie/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/aiellie/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"

type WebPreviewContextValue = {
  url: string
  setUrl: (url: string) => void
  /** Re-loads the current document, even when the URL has not changed. */
  reload: () => void
  /** Bumped by every reload, so the frame remounts. */
  reloadKey: number
  consoleOpen: boolean
  setConsoleOpen: (open: boolean) => void
}

const WebPreviewContext = React.createContext<WebPreviewContextValue | null>(
  null
)

function useWebPreview() {
  const context = React.useContext(WebPreviewContext)
  if (!context) {
    throw new Error("WebPreview components must be used within a WebPreview")
  }
  return context
}

type WebPreviewProps = React.ComponentProps<"div"> & {
  defaultUrl?: string
  /** The URL, to control it. Only `onUrlChange` changes it then. */
  url?: string
  onUrlChange?: (url: string) => void
  /** Fires on every reload, including Enter on the URL already loaded. */
  onReload?: () => void
  /** Whether the console is open, to control it. */
  consoleOpen?: boolean
  defaultConsoleOpen?: boolean
  onConsoleOpenChange?: (open: boolean) => void
}

function WebPreview({
  className,
  children,
  defaultUrl = "",
  url: controlledUrl,
  onUrlChange,
  onReload,
  consoleOpen: controlledConsoleOpen,
  defaultConsoleOpen = false,
  onConsoleOpenChange,
  ...props
}: WebPreviewProps) {
  const [uncontrolledUrl, setUncontrolledUrl] = React.useState(defaultUrl)
  const [uncontrolledConsoleOpen, setUncontrolledConsoleOpen] =
    React.useState(defaultConsoleOpen)
  const [reloadKey, setReloadKey] = React.useState(0)

  const url = controlledUrl ?? uncontrolledUrl
  const consoleOpen = controlledConsoleOpen ?? uncontrolledConsoleOpen

  const setUrl = React.useCallback(
    (next: string) => {
      if (controlledUrl === undefined) setUncontrolledUrl(next)
      onUrlChange?.(next)
    },
    [controlledUrl, onUrlChange]
  )

  const setConsoleOpen = React.useCallback(
    (next: boolean) => {
      if (controlledConsoleOpen === undefined) setUncontrolledConsoleOpen(next)
      onConsoleOpenChange?.(next)
    },
    [controlledConsoleOpen, onConsoleOpenChange]
  )

  const reload = React.useCallback(() => {
    setReloadKey((key) => key + 1)
    onReload?.()
  }, [onReload])

  const value = React.useMemo<WebPreviewContextValue>(
    () => ({ url, setUrl, reload, reloadKey, consoleOpen, setConsoleOpen }),
    [url, setUrl, reload, reloadKey, consoleOpen, setConsoleOpen]
  )

  return (
    <WebPreviewContext.Provider value={value}>
      <div
        data-slot="web-preview"
        className={cn(
          "relative flex size-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-background",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  )
}

function WebPreviewNavigation({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="web-preview-navigation"
      className={cn(
        "flex h-11 shrink-0 items-center gap-0.5 border-b border-border/60 px-1.5",
        className
      )}
      {...props}
    />
  )
}

type WebPreviewNavigationButtonProps = React.ComponentProps<typeof Button> & {
  tooltip?: string
  /** The keys that do the same, shown after the tooltip. */
  shortcut?: string
}

function WebPreviewNavigationButton({
  tooltip,
  shortcut,
  className,
  children,
  ...props
}: WebPreviewNavigationButtonProps) {
  const button = (
    <Button
      data-slot="web-preview-navigation-button"
      variant="ghost"
      size="icon"
      aria-label={tooltip}
      className={cn(
        "text-muted-foreground hover:text-foreground focus-visible:border-ring [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
  if (!tooltip) return button

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={button} />
        <TooltipContent>
          {tooltip}
          {shortcut ? (
            <kbd
              data-slot="kbd"
              className="rounded-sm bg-background/15 px-1 font-sans"
            >
              {shortcut}
            </kbd>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/** "https://acme.dev/" → "acme.dev", keeping the path, query and hash. */
function displayUrl(value: string) {
  if (!value) return ""
  try {
    const parsed = new URL(value)
    const path = parsed.pathname === "/" ? "" : parsed.pathname
    return `${parsed.host}${path}${parsed.search}${parsed.hash}`
  } catch {
    return value
  }
}

/** What was typed, as a URL a frame can load: a bare host gets `https://`. */
function normalizeUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed || /^[a-z][a-z\d+.-]*:/i.test(trimmed)) return trimmed
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(trimmed)
  return `${local ? "http" : "https"}://${trimmed}`
}

type WebPreviewUrlProps = Omit<React.ComponentProps<"input">, "size"> & {
  /** The connection popover's body. Defaults to `WebPreviewConnection`. */
  connectionContent?: React.ReactNode
  /** Replaces opening the URL in a new tab. */
  onOpenExternal?: (url: string) => void
}

function WebPreviewUrl({
  className,
  value,
  onChange,
  onKeyDown,
  onBlur,
  connectionContent,
  onOpenExternal,
  ...props
}: WebPreviewUrlProps) {
  const { url, setUrl, reload } = useWebPreview()
  const [inputValue, setInputValue] = React.useState(() => displayUrl(url))
  const [previousUrl, setPreviousUrl] = React.useState(url)
  if (url !== previousUrl) {
    setPreviousUrl(url)
    setInputValue(displayUrl(url))
  }

  const current = typeof value === "string" ? value : inputValue
  const committed = url || normalizeUrl(current)

  const openExternal = () => {
    if (!committed) return
    if (onOpenExternal) onOpenExternal(committed)
    else window.open(committed, "_blank", "noopener,noreferrer")
  }

  return (
    <InputGroup
      data-slot="web-preview-url"
      className="h-8 min-w-0 flex-1 rounded-lg border-transparent bg-transparent transition-colors duration-80 hover:bg-muted has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:bg-background motion-reduce:transition-none dark:bg-transparent dark:hover:bg-muted"
    >
      <InputGroupAddon align="inline-start">
        <Popover>
          <PopoverTrigger
            render={
              <InputGroupButton
                size="icon-xs"
                aria-label="Connection information"
                className="rounded-md text-muted-foreground focus-visible:border-ring"
              />
            }
          >
            <HugeiconsIcon aria-hidden icon={SlidersHorizontalIcon} />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 gap-2 p-3">
            {connectionContent ?? <WebPreviewConnection url={committed} />}
          </PopoverContent>
        </Popover>
      </InputGroupAddon>

      <InputGroupInput
        aria-label="Address"
        placeholder="Enter a URL"
        spellCheck={false}
        autoComplete="off"
        value={current}
        onChange={(event) => {
          setInputValue(event.target.value)
          onChange?.(event)
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            const typed = event.currentTarget.value
            // The bar shows the URL without its scheme, so re-submitting it
            // as shown has to keep the scheme it had (http:// on localhost).
            setUrl(typed === displayUrl(url) ? url : normalizeUrl(typed))
            reload()
            event.currentTarget.blur()
          }
          if (event.key === "Escape") {
            setInputValue(displayUrl(url))
            event.currentTarget.blur()
          }
          onKeyDown?.(event)
        }}
        onBlur={(event) => {
          setInputValue(displayUrl(url))
          onBlur?.(event)
        }}
        onFocus={(event) => event.currentTarget.select()}
        className={cn(
          "px-1 text-center text-xs text-foreground placeholder:text-muted-foreground/60 focus-visible:text-start",
          className
        )}
        {...props}
      />

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          aria-label="Open in new tab"
          disabled={!committed}
          onClick={openExternal}
          className="rounded-md text-muted-foreground focus-visible:border-ring"
        >
          <HugeiconsIcon aria-hidden icon={LinkSquare02Icon} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

function WebPreviewConnection({
  className,
  url,
  ...props
}: React.ComponentProps<"div"> & { url: string }) {
  let host = url
  let secure = false
  let local = false
  try {
    const parsed = new URL(url)
    host = parsed.host
    secure = parsed.protocol === "https:"
    local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(parsed.hostname)
  } catch {
    // A half-typed URL; show it as it is.
  }

  return (
    <div
      data-slot="web-preview-connection"
      data-secure={secure || undefined}
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          aria-hidden
          icon={secure || local ? LockKeyIcon : UnavailableIcon}
          className={cn(
            "size-4",
            secure || local ? "text-muted-foreground" : "text-destructive"
          )}
        />
        <span className="text-xs font-medium">
          {!url
            ? "No page loaded"
            : secure
              ? "Connection is secure"
              : local
                ? "Local development server"
                : "Connection is not secure"}
        </span>
      </div>
      {url ? (
        <p className="text-xs break-all text-muted-foreground">{host}</p>
      ) : null}
      {url ? (
        <p className="text-xs text-muted-foreground">
          {secure
            ? "This page was served over HTTPS."
            : local
              ? "Served from this machine, so nothing leaves it."
              : "Information sent to this site could be seen by others."}
        </p>
      ) : null}
    </div>
  )
}

const subscribeNever = () => () => {}

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// A live segment sweeping under the bar until the frame says it loaded.
function LoadingBar({ loading }: { loading: boolean }) {
  const segment = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const element = segment.current
    if (!element || !loading || reducedMotion()) return
    const animation = element.animate(
      [{ translate: "-100% 0" }, { translate: "300% 0" }],
      {
        duration: 1400,
        iterations: Infinity,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      }
    )
    return () => animation.cancel()
  }, [loading])

  return (
    <span
      aria-hidden
      data-loading={loading || undefined}
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px overflow-hidden opacity-0 transition-opacity duration-280 data-loading:opacity-100 motion-reduce:transition-none"
    >
      <span
        ref={segment}
        className="absolute inset-y-0 start-0 w-1/3 bg-live motion-reduce:w-full motion-reduce:opacity-40"
      />
    </span>
  )
}

type WebPreviewBodyProps = Omit<React.ComponentProps<"iframe">, "loading"> & {
  /** Shown over the frame. Leave it out for a live bar while it loads. */
  loading?: React.ReactNode
  /** Scales the page, in percent. */
  zoom?: number
  /** Renders the page at a phone's width, centred. */
  device?: boolean
}

function WebPreviewBody({
  className,
  loading,
  src,
  srcDoc,
  zoom = 100,
  device = false,
  onLoad,
  ...props
}: WebPreviewBodyProps) {
  const { url, reloadKey } = useWebPreview()
  const source = (src ?? url) || undefined
  const frameKey = `${source ?? ""}:${srcDoc ?? ""}:${reloadKey}`
  const [loadedKey, setLoadedKey] = React.useState<string | null>(null)
  // Server-rendered, the frame can finish loading before its onLoad is
  // attached, and the bar would never stop. So it only renders in the browser.
  const mounted = React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const isLoading = Boolean(source || srcDoc) && loadedKey !== frameKey
  const scale = zoom / 100

  return (
    <div
      data-slot="web-preview-body"
      data-device={device || undefined}
      className="relative flex min-h-0 flex-1 justify-center overflow-hidden bg-background data-device:bg-muted/50"
    >
      {loading ?? <LoadingBar loading={isLoading} />}
      {!mounted ? null : source || srcDoc ? (
        <div
          className={cn(
            "relative size-full overflow-hidden transition-[max-width] duration-280 ease-out motion-reduce:transition-none",
            device
              ? "my-3 max-w-[390px] rounded-xl border border-border/60 bg-background shadow-md"
              : "max-w-full"
          )}
        >
          <iframe
            key={frameKey}
            title="Preview"
            // `allow-modals` lets the menu's Print reach the framed page.
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-modals"
            src={srcDoc ? undefined : source}
            srcDoc={srcDoc}
            onLoad={(event) => {
              setLoadedKey(frameKey)
              onLoad?.(event)
            }}
            style={
              scale === 1
                ? undefined
                : {
                    width: `${100 / scale}%`,
                    height: `${100 / scale}%`,
                    transform: `scale(${scale})`,
                    transformOrigin: "0 0",
                  }
            }
            className={cn("block size-full border-0 bg-background", className)}
            {...props}
          />
        </div>
      ) : (
        <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
          Enter a URL to preview it
        </div>
      )}
    </div>
  )
}

type WebPreviewLog = {
  level: "log" | "warn" | "error"
  message: string
  timestamp: Date
}

function WebPreviewConsole({
  className,
  logs = [],
  onClear,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  logs?: readonly WebPreviewLog[]
  /** Adds Clear to the console's bar. */
  onClear?: () => void
}) {
  const { consoleOpen, setConsoleOpen } = useWebPreview()
  const panelId = React.useId()
  const listRef = React.useRef<HTMLDivElement>(null)
  const errors = logs.filter((log) => log.level === "error").length
  const warnings = logs.filter((log) => log.level === "warn").length

  React.useEffect(() => {
    const list = listRef.current
    if (list && consoleOpen) list.scrollTop = list.scrollHeight
  }, [logs.length, consoleOpen])

  return (
    <div
      data-slot="web-preview-console"
      data-open={consoleOpen || undefined}
      className={cn(
        "group/web-preview-console shrink-0 border-t border-border/60",
        className
      )}
      {...props}
    >
      <div className="flex h-8 items-center gap-1 pe-1.5">
        <button
          type="button"
          aria-expanded={consoleOpen}
          aria-controls={panelId}
          onClick={() => setConsoleOpen(!consoleOpen)}
          className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2 border border-transparent ps-3 text-xs font-medium text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:border-ring motion-reduce:transition-none"
        >
          <HugeiconsIcon
            aria-hidden
            icon={ArrowDown01Icon}
            className="size-3.5 -rotate-90 transition-[rotate] duration-150 group-data-open/web-preview-console:rotate-0 motion-reduce:transition-none"
          />
          Console
          {errors > 0 ? (
            <span className="flex items-center gap-1 font-normal text-destructive tabular-nums">
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              {errors} {errors === 1 ? "error" : "errors"}
            </span>
          ) : null}
          {warnings > 0 ? (
            <span className="font-normal tabular-nums">
              {warnings} {warnings === 1 ? "warning" : "warnings"}
            </span>
          ) : null}
        </button>
        {onClear && consoleOpen && logs.length > 0 ? (
          <Button
            variant="ghost"
            size="xs"
            onClick={onClear}
            className="text-muted-foreground focus-visible:border-ring"
          >
            Clear
          </Button>
        ) : null}
      </div>
      <div
        id={panelId}
        inert={!consoleOpen}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-280 ease-out group-data-open/web-preview-console:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div className="min-h-0 overflow-hidden">
          <div
            ref={listRef}
            role="log"
            aria-label="Console output"
            className="max-h-40 overflow-y-auto border-t border-border/60 py-1 font-mono text-[11px] leading-5"
          >
            {logs.length === 0 && !children ? (
              <p className="px-3 text-muted-foreground">No console output</p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={`${log.timestamp.getTime()}-${index}`}
                  data-level={log.level}
                  className="flex gap-3 px-3 data-[level=error]:bg-destructive/5 data-[level=error]:text-destructive dark:data-[level=error]:bg-destructive/10"
                >
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    {log.timestamp.toLocaleTimeString([], {
                      hour12: false,
                    })}
                  </span>
                  {log.level === "log" ? null : (
                    <HugeiconsIcon
                      aria-label={log.level === "error" ? "Error" : "Warning"}
                      icon={Alert02Icon}
                      className={cn(
                        "mt-1 size-3 shrink-0",
                        log.level === "warn" && "text-muted-foreground"
                      )}
                    />
                  )}
                  <span className="min-w-0 break-words whitespace-pre-wrap">
                    {log.message}
                  </span>
                </div>
              ))
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

type WebPreviewAnnotateToggleProps = Omit<
  React.ComponentProps<typeof Button>,
  "onChange"
> & {
  active?: boolean
  onActiveChange?: (active: boolean) => void
  /** Shown beside the icon while active, and its name. */
  label?: string
}

function WebPreviewAnnotateToggle({
  active = false,
  onActiveChange,
  label = "Annotating",
  className,
  onClick,
  ...props
}: WebPreviewAnnotateToggleProps) {
  return (
    <Button
      data-slot="web-preview-annotate-toggle"
      data-active={active || undefined}
      variant="ghost"
      aria-label={label}
      aria-pressed={active}
      onClick={(event) => {
        onClick?.(event)
        onActiveChange?.(!active)
      }}
      className={cn(
        "h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground focus-visible:border-ring data-active:bg-live/8 data-active:px-2.5 data-active:text-live data-active:hover:bg-live/12 dark:data-active:bg-live/15",
        className
      )}
      {...props}
    >
      <HugeiconsIcon aria-hidden icon={PlusSignCircleIcon} className="size-4" />
      {active ? (
        <span className="animate-in duration-150 fade-in motion-reduce:animate-none">
          {label}
        </span>
      ) : null}
    </Button>
  )
}

/** Chrome's zoom stops, so stepping lands on values people know. */
const ZOOM_STEPS = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200]

function stepZoom(zoom: number, delta: 1 | -1) {
  const index = ZOOM_STEPS.findIndex((step) => step >= zoom)
  const current =
    index === -1
      ? ZOOM_STEPS.length - 1
      : ZOOM_STEPS[index] !== zoom && delta === 1
        ? index - 1
        : index
  return ZOOM_STEPS[
    Math.min(ZOOM_STEPS.length - 1, Math.max(0, current + delta))
  ]
}

function WebPreviewMenuItem({
  icon,
  children,
  ...props
}: React.ComponentProps<typeof MenuItem> & { icon: IconSvgElement }) {
  return (
    <MenuItem {...props}>
      <HugeiconsIcon aria-hidden icon={icon} />
      {children}
    </MenuItem>
  )
}

function SubTrigger({
  icon,
  children,
  ...props
}: React.ComponentProps<typeof MenuSubTrigger> & { icon: IconSvgElement }) {
  return (
    <MenuSubTrigger {...props}>
      <HugeiconsIcon aria-hidden icon={icon} />
      {children}
    </MenuSubTrigger>
  )
}

type WebPreviewMenuProps = {
  onFindInPage?: () => void
  onPrint?: () => void
  zoom?: number
  onZoomChange?: (zoom: number) => void
  fullScreen?: boolean
  onFullScreenChange?: (fullScreen: boolean) => void
  deviceToolbar?: boolean
  onDeviceToolbarChange?: (open: boolean) => void
  onScreenshot?: () => void
  onImportCookiesAndPasswords?: () => void
  onPasswordManager?: () => void
  onContactInfo?: () => void
  onDownloads?: () => void
  onClearCookies?: () => void
  onClearCache?: () => void
  onDeleteDownloadHistory?: () => void
  onBrowserSettings?: () => void
  className?: string
}

// Every entry is disabled until its handler is passed. The credential entries
// are labels only: nothing here reads or stores a credential.
function WebPreviewMenu({
  onFindInPage,
  onPrint,
  zoom = 100,
  onZoomChange,
  fullScreen = false,
  onFullScreenChange,
  deviceToolbar = false,
  onDeviceToolbarChange,
  onScreenshot,
  onImportCookiesAndPasswords,
  onPasswordManager,
  onContactInfo,
  onDownloads,
  onClearCookies,
  onClearCache,
  onDeleteDownloadHistory,
  onBrowserSettings,
  className,
}: WebPreviewMenuProps) {
  const zoomButton =
    "size-6 text-muted-foreground hover:text-foreground focus-visible:border-ring"

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Preview menu"
            className={cn(
              "text-muted-foreground hover:text-foreground focus-visible:border-ring data-popup-open:bg-muted data-popup-open:text-foreground",
              className
            )}
          />
        }
      >
        <HugeiconsIcon aria-hidden icon={MoreVerticalIcon} className="size-4" />
      </MenuTrigger>

      <MenuContent align="end" className="w-64">
        <WebPreviewMenuItem
          icon={Search01Icon}
          disabled={!onFindInPage}
          onClick={onFindInPage}
        >
          Find in page
        </WebPreviewMenuItem>
        <WebPreviewMenuItem
          icon={PrinterIcon}
          disabled={!onPrint}
          onClick={onPrint}
        >
          Print
        </WebPreviewMenuItem>

        <MenuSeparator />

        {/* A row, not an item, so the menu stays open while zooming. */}
        <div
          role="group"
          aria-label="Zoom"
          className="flex items-center gap-2 py-0.5 ps-2 pe-1 text-xs font-medium text-muted-foreground"
        >
          <HugeiconsIcon aria-hidden icon={SearchAddIcon} className="size-4" />
          Zoom
          <span className="ms-auto flex items-center rounded-lg bg-muted">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Zoom out"
              disabled={!onZoomChange || zoom <= ZOOM_STEPS[0]}
              onClick={() => onZoomChange?.(stepZoom(zoom, -1))}
              className={zoomButton}
            >
              <HugeiconsIcon aria-hidden icon={MinusSignIcon} />
            </Button>
            <span
              aria-live="polite"
              className="w-10 text-center text-foreground tabular-nums"
            >
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Zoom in"
              disabled={!onZoomChange || zoom >= ZOOM_STEPS.at(-1)!}
              onClick={() => onZoomChange?.(stepZoom(zoom, 1))}
              className={zoomButton}
            >
              <HugeiconsIcon aria-hidden icon={PlusSignIcon} />
            </Button>
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Reset zoom"
            disabled={!onZoomChange || zoom === 100}
            onClick={() => onZoomChange?.(100)}
            className={zoomButton}
          >
            <HugeiconsIcon aria-hidden icon={RefreshIcon} />
          </Button>
        </div>

        <MenuSeparator />

        <WebPreviewMenuItem
          icon={fullScreen ? Minimize01Icon : Maximize01Icon}
          disabled={!onFullScreenChange}
          onClick={() => onFullScreenChange?.(!fullScreen)}
        >
          {fullScreen ? "Exit full screen" : "Full screen"}
        </WebPreviewMenuItem>
        <WebPreviewMenuItem
          icon={SmartPhone01Icon}
          disabled={!onDeviceToolbarChange}
          onClick={() => onDeviceToolbarChange?.(!deviceToolbar)}
        >
          {deviceToolbar ? "Hide device toolbar" : "Show device toolbar"}
        </WebPreviewMenuItem>
        <WebPreviewMenuItem
          icon={Camera01Icon}
          disabled={!onScreenshot}
          onClick={onScreenshot}
        >
          Take a screenshot
        </WebPreviewMenuItem>

        <MenuSeparator />

        <WebPreviewMenuItem
          icon={CookieIcon}
          disabled={!onImportCookiesAndPasswords}
          onClick={onImportCookiesAndPasswords}
        >
          Import cookies and passwords…
        </WebPreviewMenuItem>
        <MenuSub>
          <SubTrigger
            icon={SquareLockPasswordIcon}
            disabled={!onPasswordManager && !onContactInfo}
          >
            Passwords and autofill
          </SubTrigger>
          <MenuSubContent className="w-52">
            <WebPreviewMenuItem
              icon={Key01Icon}
              disabled={!onPasswordManager}
              onClick={onPasswordManager}
            >
              Password manager
            </WebPreviewMenuItem>
            <WebPreviewMenuItem
              icon={UserSquareIcon}
              disabled={!onContactInfo}
              onClick={onContactInfo}
            >
              Contact info
            </WebPreviewMenuItem>
          </MenuSubContent>
        </MenuSub>
        <WebPreviewMenuItem
          icon={Download01Icon}
          disabled={!onDownloads}
          onClick={onDownloads}
        >
          Downloads
        </WebPreviewMenuItem>
        <MenuSub>
          <SubTrigger
            icon={BrushIcon}
            disabled={
              !onClearCookies && !onClearCache && !onDeleteDownloadHistory
            }
          >
            Clear browsing data
          </SubTrigger>
          <MenuSubContent className="w-52">
            <WebPreviewMenuItem
              icon={CookieIcon}
              disabled={!onClearCookies}
              onClick={onClearCookies}
            >
              Clear cookies
            </WebPreviewMenuItem>
            <WebPreviewMenuItem
              icon={DatabaseIcon}
              disabled={!onClearCache}
              onClick={onClearCache}
            >
              Clear cache
            </WebPreviewMenuItem>
            <WebPreviewMenuItem
              icon={Clock01Icon}
              disabled={!onDeleteDownloadHistory}
              onClick={onDeleteDownloadHistory}
            >
              Delete download history
            </WebPreviewMenuItem>
          </MenuSubContent>
        </MenuSub>

        <MenuSeparator />

        <WebPreviewMenuItem
          icon={Settings01Icon}
          disabled={!onBrowserSettings}
          onClick={onBrowserSettings}
        >
          Browser settings
        </WebPreviewMenuItem>
      </MenuContent>
    </Menu>
  )
}

export {
  WebPreview,
  WebPreviewAnnotateToggle,
  WebPreviewBody,
  WebPreviewConnection,
  WebPreviewConsole,
  WebPreviewMenu,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  ZOOM_STEPS,
  displayUrl,
  normalizeUrl,
  stepZoom,
  useWebPreview,
}
export type {
  WebPreviewAnnotateToggleProps,
  WebPreviewBodyProps,
  WebPreviewContextValue,
  WebPreviewLog,
  WebPreviewMenuProps,
  WebPreviewNavigationButtonProps,
  WebPreviewProps,
  WebPreviewUrlProps,
}
