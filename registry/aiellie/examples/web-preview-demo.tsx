"use client"

import * as React from "react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  WebPreview,
  WebPreviewAnnotateToggle,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewMenu,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  useWebPreview,
  type WebPreviewLog,
} from "@/registry/aiellie/components/web-preview"

const HOME = "https://acme.dev/"

const PAGES: Record<string, { title: string; body: string; script?: string }> =
  {
    "/": {
      title: "Ship the agent, not the plumbing",
      body: "Acme runs your tools, keeps the logs and hands the hard cases to a person.",
      script: `console.log("hydrated in 182ms")`,
    },
    "/pricing": {
      title: "Pricing",
      body: "Hobby is free. Team is $20 a seat. Enterprise talks to us.",
      script: `console.warn("Image /plans.png has no width or height, so the page will shift as it loads")`,
    },
    "/docs": {
      title: "Docs",
      body: "Install the SDK, add a key, then call run() with a prompt.",
      script: `console.log("search index loading"); console.error("GET /api/search 404 (Not Found)")`,
    },
  }

function page(url: string, dark: boolean) {
  let host = ""
  let path = "/"
  try {
    const parsed = new URL(url)
    host = parsed.host
    path = parsed.pathname
  } catch {}
  const known = host === "acme.dev" ? PAGES[path] : undefined
  const content = known ?? {
    title: "Not found",
    body:
      host === "acme.dev"
        ? `Nothing lives at ${path}.`
        : "This demo only serves acme.dev. Try /pricing or /docs.",
    script: `console.error("GET ${url.replace(/"/g, "")} 404 (Not Found)")`,
  }
  const ink = dark ? "#ededed" : "#171717"
  const muted = dark ? "#a1a1a1" : "#737373"
  const line = dark ? "#262626" : "#e5e5e5"
  const link = (href: string, label: string) =>
    `<a href="${href}" data-current="${href === path}">${label}</a>`

  return `<!doctype html><html><head><style>
    *{box-sizing:border-box}
    body{margin:0;font:14px/1.5 ui-sans-serif,system-ui,sans-serif;color:${ink};background:${dark ? "#0a0a0a" : "#fff"}}
    nav{display:flex;gap:16px;align-items:center;padding:12px 20px;border-bottom:1px solid ${line};font-size:12px}
    nav b{margin-inline-end:auto;font-size:13px}
    a{color:${muted};text-decoration:none}a:hover,a[data-current=true]{color:${ink}}
    main{padding:40px 20px;max-width:520px}
    h1{font-size:24px;line-height:1.2;letter-spacing:-.02em;margin:0 0 8px}
    p{margin:0;color:${muted}}
    button{margin-top:20px;font:inherit;font-size:12px;padding:6px 12px;border-radius:8px;border:0;background:${ink};color:${dark ? "#0a0a0a" : "#fff"};cursor:pointer}
  </style></head><body>
    <nav><b>Acme</b>${link("/", "Home")}${link("/pricing", "Pricing")}${link("/docs", "Docs")}</nav>
    <main><h1>${content.title}</h1><p>${content.body}</p><button type="button" onclick="console.log('clicked Get started')">Get started</button></main>
    <script>
      for (const level of ["log", "warn", "error"]) {
        const original = console[level]
        console[level] = (...args) => {
          parent.postMessage({ source: "web-preview-demo", level, message: args.join(" ") }, "*")
          original.apply(console, args)
        }
      }
      document.addEventListener("click", (event) => {
        const anchor = event.target.closest("a")
        if (!anchor) return
        event.preventDefault()
        parent.postMessage({ source: "web-preview-demo", navigate: new URL(anchor.getAttribute("href"), "https://acme.dev").href }, "*")
      })
      ${content.script ?? ""}
    </script>
  </body></html>`
}

function useDarkClass() {
  return React.useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      return () => observer.disconnect()
    },
    () => document.documentElement.classList.contains("dark"),
    () => false
  )
}

export default function WebPreviewDemo() {
  const dark = useDarkClass()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const frameRef = React.useRef<HTMLIFrameElement>(null)
  const [history, setHistory] = React.useState({ stack: [HOME], index: 0 })
  const [logs, setLogs] = React.useState<WebPreviewLog[]>([])
  const [annotating, setAnnotating] = React.useState(false)
  const [zoom, setZoom] = React.useState(100)
  const [device, setDevice] = React.useState(false)
  const [fullScreen, setFullScreen] = React.useState(false)

  const url = history.stack[history.index]
  const navigate = React.useCallback((next: string) => {
    setHistory(({ stack, index }) =>
      stack[index] === next
        ? { stack, index }
        : { stack: [...stack.slice(0, index + 1), next], index: index + 1 }
    )
  }, [])

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return
      const data = event.data as {
        source?: string
        level?: WebPreviewLog["level"]
        message?: string
        navigate?: string
      }
      if (data?.source !== "web-preview-demo") return
      if (data.navigate) navigate(data.navigate)
      else if (data.level && data.message !== undefined) {
        const { level, message } = data
        setLogs((current) =>
          [...current, { level, message, timestamp: new Date() }].slice(-50)
        )
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [navigate])

  React.useEffect(() => {
    const onChange = () =>
      setFullScreen(document.fullscreenElement === rootRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  return (
    <WebPreview
      ref={rootRef}
      url={url}
      onUrlChange={navigate}
      className="h-80 w-full max-w-3xl"
    >
      <WebPreviewNavigation>
        <WebPreviewNavigationButton
          tooltip="Back"
          disabled={history.index === 0}
          onClick={() =>
            setHistory(({ stack, index }) => ({ stack, index: index - 1 }))
          }
        >
          <HugeiconsIcon
            aria-hidden
            icon={ArrowLeft01Icon}
            className="rtl:-scale-x-100"
          />
        </WebPreviewNavigationButton>
        <WebPreviewNavigationButton
          tooltip="Forward"
          disabled={history.index === history.stack.length - 1}
          onClick={() =>
            setHistory(({ stack, index }) => ({ stack, index: index + 1 }))
          }
        >
          <HugeiconsIcon
            aria-hidden
            icon={ArrowRight01Icon}
            className="rtl:-scale-x-100"
          />
        </WebPreviewNavigationButton>
        <ReloadButton />
        <WebPreviewUrl />
        <WebPreviewAnnotateToggle
          active={annotating}
          onActiveChange={setAnnotating}
        />
        <WebPreviewMenu
          onPrint={() => frameRef.current?.contentWindow?.print()}
          zoom={zoom}
          onZoomChange={setZoom}
          fullScreen={fullScreen}
          onFullScreenChange={(next) => {
            if (next) rootRef.current?.requestFullscreen()
            else document.exitFullscreen()
          }}
          deviceToolbar={device}
          onDeviceToolbarChange={setDevice}
          onClearCache={() => setLogs([])}
        />
      </WebPreviewNavigation>
      <WebPreviewBody
        ref={frameRef}
        srcDoc={page(url, dark)}
        zoom={zoom}
        device={device}
        className={annotating ? "cursor-crosshair" : undefined}
      />
      <WebPreviewConsole logs={logs} onClear={() => setLogs([])} />
    </WebPreview>
  )
}

function ReloadButton() {
  const { reload } = useWebPreview()
  return (
    <WebPreviewNavigationButton tooltip="Reload" onClick={reload}>
      <HugeiconsIcon aria-hidden icon={RefreshIcon} />
    </WebPreviewNavigationButton>
  )
}
