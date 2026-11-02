// Where the chat is lives in the page's address, so a reload, a link and back
// and forward all work wherever the page is mounted: the open chat as
// ?chat=<id>, and a shared chat in the #, which never reaches the server.
const NAVIGATE = "chat:navigate"
const SHARED = "share="

function subscribeAddress(onChange: () => void) {
  window.addEventListener("popstate", onChange)
  window.addEventListener("hashchange", onChange)
  window.addEventListener(NAVIGATE, onChange)
  return () => {
    window.removeEventListener("popstate", onChange)
    window.removeEventListener("hashchange", onChange)
    window.removeEventListener(NAVIGATE, onChange)
  }
}

const chatInAddress = () =>
  new URLSearchParams(window.location.search).get("chat")

/** Opens a saved chat, or a new one with `null`, leaving any shared chat. */
function openInAddress(id: string | null) {
  const url = new URL(window.location.href)
  url.hash = ""
  if (id) url.searchParams.set("chat", id)
  else url.searchParams.delete("chat")
  window.history.pushState(null, "", url)
  window.dispatchEvent(new Event(NAVIGATE))
}

/** The shared chat the address holds, still encoded, or null. */
function sharedInAddress() {
  const hash = window.location.hash.slice(1)
  return hash.startsWith(SHARED) ? hash.slice(SHARED.length) : null
}

/** A link to this page that opens `data`, a chat encoded for sharing. */
function shareLinkFor(data: string) {
  const url = new URL(window.location.href)
  url.searchParams.delete("chat")
  url.hash = SHARED + data
  return url.toString()
}

export {
  chatInAddress,
  openInAddress,
  shareLinkFor,
  sharedInAddress,
  subscribeAddress,
}
