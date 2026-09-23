import * as React from "react"

const MOBILE_BREAKPOINT = 768

const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

/**
 * Whether the window is narrower than a tablet. It reads the media query as a
 * store rather than copying it into state from an effect, so it is right on
 * the first client render. The server has no window and assumes a wide one,
 * as shadcn's own hook does.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}
