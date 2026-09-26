import { lookup } from "node:dns/promises"
import { isIP } from "node:net"

type LinkPreview = {
  /** Where the page ended up, after any redirects. */
  url: string
  title?: string
  description?: string
  /** The page's own preview image, from `og:image`. */
  image?: string
  icon?: string
  siteName?: string
}

const TIMEOUT = 5000
const MAX_BYTES = 512 * 1024
const MAX_REDIRECTS = 3

// Anything a request names gets fetched from this server, so only the public
// web is allowed: no loopback, private, link-local or cloud metadata address.
function isPublicAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b, c] = address.split(".").map(Number)
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0 && (c === 0 || c === 2)) ||
      (a === 198 && (b === 18 || b === 19))
    )
  }
  const lower = address.toLowerCase()
  // IPv4 written as IPv6, like ::ffff:127.0.0.1. Any other address starting
  // with :: is loopback, unspecified or an old mapping, and none are public.
  if (lower.startsWith("::")) {
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    return mapped ? isPublicAddress(mapped[1]) : false
  }
  return !(
    lower.startsWith("fc") ||
    lower.startsWith("fd") ||
    /^fe[89ab]/.test(lower) ||
    lower.startsWith("ff")
  )
}

async function assertPublic(url: URL) {
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Not a web page.")
  }
  if (
    url.username ||
    url.password ||
    (url.port && !["80", "443"].includes(url.port))
  ) {
    throw new Error("Not a web page.")
  }
  const host = url.hostname.replace(/^\[(.*)\]$/, "$1")
  const addresses = isIP(host)
    ? [host]
    : (await lookup(host, { all: true, verbatim: true })).map(
        (entry) => entry.address
      )
  if (addresses.length === 0 || !addresses.every(isPublicAddress)) {
    throw new Error("Not a public address.")
  }
}

// Redirects are followed by hand, so each hop is checked before it's fetched.
async function fetchPage(start: URL, signal: AbortSignal) {
  let url = start
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublic(url)
    const response = await fetch(url, {
      redirect: "manual",
      signal,
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Mozilla/5.0 (compatible; LinkPreview/1.0)",
      },
    })
    const location = response.headers.get("location")
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel()
      url = new URL(location, url)
      continue
    }
    return { url, response }
  }
  throw new Error("Too many redirects.")
}

// Only the head matters, so reading stops there, or at the size cap.
async function readHead(response: Response) {
  const reader = response.body?.getReader()
  if (!reader) return ""
  const decoder = new TextDecoder()
  let html = ""
  let bytes = 0
  while (bytes < MAX_BYTES) {
    const { done, value } = await reader.read()
    if (done) break
    bytes += value.byteLength
    html += decoder.decode(value, { stream: true })
    if (/<\/head>/i.test(html)) break
  }
  await reader.cancel()
  return html
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
}

function decode(text: string) {
  return text
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
      if (entity[0] !== "#") return ENTITIES[entity.toLowerCase()] ?? match
      const code =
        entity[1].toLowerCase() === "x"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10)
      return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : match
    })
    .replace(/\s+/g, " ")
    .trim()
}

function attributesOf(tag: string) {
  const found: Record<string, string> = {}
  for (const [, name, double, single, bare] of tag.matchAll(
    /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g
  )) {
    found[name.toLowerCase()] = double ?? single ?? bare ?? ""
  }
  return found
}

// The browser loads these itself, so a page can't point it at the reader's
// own network either.
function linkFrom(href: string | undefined, base: URL) {
  if (!href) return undefined
  try {
    const url = new URL(decode(href), base)
    const host = url.hostname.replace(/^\[(.*)\]$/, "$1")
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined
    if (host === "localhost" || (isIP(host) && !isPublicAddress(host))) {
      return undefined
    }
    return url.href
  } catch {
    return undefined
  }
}

function clip(text: string | undefined, length: number) {
  if (!text) return undefined
  return text.length > length ? `${text.slice(0, length - 1).trimEnd()}…` : text
}

function parse(html: string, base: URL): Omit<LinkPreview, "url"> {
  const meta = new Map<string, string>()
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const { property, name, content } = attributesOf(tag)
    const key = (property ?? name)?.toLowerCase()
    if (key && content && !meta.has(key)) meta.set(key, decode(content))
  }

  // A plain icon first, then the larger touch icon, then the one every
  // browser asks for.
  let icon: string | undefined
  let touchIcon: string | undefined
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const { rel = "", href } = attributesOf(tag)
    const kinds = rel.toLowerCase().split(/\s+/)
    if (!href) continue
    if (kinds.includes("icon")) icon ??= href
    else if (kinds.includes("apple-touch-icon")) touchIcon ??= href
  }

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]

  return {
    title: clip(
      meta.get("og:title") ??
        meta.get("twitter:title") ??
        (title ? decode(title) : undefined),
      200
    ),
    description: clip(
      meta.get("og:description") ??
        meta.get("description") ??
        meta.get("twitter:description"),
      300
    ),
    image: linkFrom(
      meta.get("og:image") ??
        meta.get("og:image:url") ??
        meta.get("twitter:image"),
      base
    ),
    icon:
      linkFrom(icon, base) ??
      linkFrom(touchIcon, base) ??
      new URL("/favicon.ico", base).href,
    siteName: clip(meta.get("og:site_name"), 80),
  }
}

const CACHED = {
  "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
}

// A page's title, description, image and icon, read from its head. The page
// itself never reaches the browser.
export async function GET(request: Request) {
  let url: URL
  try {
    url = new URL(new URL(request.url).searchParams.get("url") ?? "")
  } catch {
    return Response.json({ error: "Pass a page as ?url=" }, { status: 400 })
  }

  try {
    const { url: page, response } = await fetchPage(
      url,
      AbortSignal.timeout(TIMEOUT)
    )
    const html = (response.headers.get("content-type") ?? "").includes("html")
    if (!response.ok || !html) {
      await response.body?.cancel()
      return Response.json(
        { url: page.href, icon: new URL("/favicon.ico", page).href },
        { headers: CACHED }
      )
    }
    const preview: LinkPreview = {
      url: page.href,
      ...parse(await readHead(response), page),
    }
    return Response.json(preview, { headers: CACHED })
  } catch (error) {
    const refused = error instanceof Error && error.message.startsWith("Not a")
    return Response.json({ url: url.href }, { status: refused ? 400 : 502 })
  }
}

export type { LinkPreview }
