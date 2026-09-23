"use client"

import * as React from "react"

import { useSidebar } from "@/registry/aiellie/ui/sidebar"

const RIGHT_OPEN_KEY = "panels:right-open"
const BOTTOM_OPEN_KEY = "panels:bottom-open"

// Sidebar already binds ⌘B (see SIDEBAR_KEYBOARD_SHORTCUT) to the left panel;
// these sit next to it: ⌘I for the right panel, ⌘J for the bottom one. Plain
// ⌘+letter like the sidebar's, and letters it doesn't use — the sidebar's
// handler doesn't check Shift, so ⌘⇧B would double up with ⌘B under Caps Lock.
const RIGHT_PANEL_KEYBOARD_SHORTCUT = "i"
const BOTTOM_PANEL_KEYBOARD_SHORTCUT = "j"

// localStorage is the source of truth for panel state so it survives reloads.
// Writes fall back to this map when storage is unavailable (private mode,
// quota), keeping the panels working for the session either way.
const memoryFallback = new Map<string, string>()
const listeners = new Set<() => void>()

/** Reads a JSON value persisted with `writePanelStorage`. */
function readPanelStorage<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined
  let raw: string | null | undefined
  try {
    raw = window.localStorage.getItem(key)
  } catch {
    raw = undefined
  }
  raw ??= memoryFallback.get(key)
  if (raw == null) return undefined
  try {
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

function writePanelStorage(key: string, value: unknown) {
  const raw = JSON.stringify(value)
  memoryFallback.set(key, raw)
  try {
    window.localStorage.setItem(key, raw)
  } catch {
    // The memory copy above still drives this session.
  }
  for (const listener of listeners) listener()
}

// The `storage` event covers other tabs; `listeners` covers this one.
function subscribeToPanelStorage(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

const getRightOpenSnapshot = () => readPanelStorage<boolean>(RIGHT_OPEN_KEY)
const getBottomOpenSnapshot = () => readPanelStorage<boolean>(BOTTOM_OPEN_KEY)
const getServerSnapshot = () => undefined

type PanelsContextProps = {
  /** The right rail, on desktop. Persisted. */
  rightOpen: boolean
  /**
   * The right panel as a sheet, on mobile — the counterpart of the sidebar's
   * `openMobile`. Session-only: a sheet must not pop open by itself after a
   * reload or a resize.
   */
  rightOpenMobile: boolean
  bottomOpen: boolean
  setRightOpen: (open: boolean) => void
  setRightOpenMobile: (open: boolean) => void
  setBottomOpen: (open: boolean) => void
  /** Drives the rail on desktop and the sheet on mobile, like `toggleSidebar`. */
  toggleRight: () => void
  /** Opens whichever of the two is in play, for content that needs the panel up. */
  openRight: () => void
  toggleBottom: () => void
}

const PanelsContext = React.createContext<PanelsContextProps | null>(
  null
)

// The header toggles live outside the panel group, so the open state for the
// right and bottom panels sits above both. `useSidebar` already owns the left
// one; this covers the other two sides, and leans on the same `isMobile` to
// tell the right rail from its mobile sheet — so `PanelsProvider` has to sit
// inside a `SidebarProvider`.
function usePanels() {
  const context = React.useContext(PanelsContext)
  if (!context) {
    throw new Error("usePanels must be used within a PanelsProvider.")
  }

  return context
}

function PanelsProvider({
  defaultRightOpen = false,
  defaultBottomOpen = false,
  children,
}: {
  defaultRightOpen?: boolean
  defaultBottomOpen?: boolean
  children: React.ReactNode
}) {
  // The server render can't see localStorage, so it paints the defaults and
  // the client corrects itself right after hydration — that's exactly the
  // server-snapshot / client-snapshot split useSyncExternalStore models.
  const storedRight = React.useSyncExternalStore(
    subscribeToPanelStorage,
    getRightOpenSnapshot,
    getServerSnapshot
  )
  const storedBottom = React.useSyncExternalStore(
    subscribeToPanelStorage,
    getBottomOpenSnapshot,
    getServerSnapshot
  )

  const rightOpen =
    typeof storedRight === "boolean" ? storedRight : defaultRightOpen
  const bottomOpen =
    typeof storedBottom === "boolean" ? storedBottom : defaultBottomOpen

  // Plain state, same as the sidebar's `openMobile`: the sheet is the mobile
  // stand-in for the rail and shares nothing with it.
  const { isMobile } = useSidebar()
  const [rightOpenMobile, setRightOpenMobile] = React.useState(false)

  const setRightOpen = React.useCallback((open: boolean) => {
    writePanelStorage(RIGHT_OPEN_KEY, open)
  }, [])

  const setBottomOpen = React.useCallback((open: boolean) => {
    writePanelStorage(BOTTOM_OPEN_KEY, open)
  }, [])

  const toggleRight = React.useCallback(() => {
    if (isMobile) {
      setRightOpenMobile((open) => !open)
    } else {
      setRightOpen(!rightOpen)
    }
  }, [isMobile, rightOpen, setRightOpen])

  const openRight = React.useCallback(() => {
    if (isMobile) {
      setRightOpenMobile(true)
    } else {
      setRightOpen(true)
    }
  }, [isMobile, setRightOpen])

  const toggleBottom = React.useCallback(() => {
    setBottomOpen(!bottomOpen)
  }, [bottomOpen, setBottomOpen])

  // Same shape as the sidebar's ⌘B handler (⌘ or Ctrl, no other modifiers).
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return
      }
      const key = event.key.toLowerCase()
      if (key === RIGHT_PANEL_KEYBOARD_SHORTCUT) {
        event.preventDefault()
        toggleRight()
      } else if (key === BOTTOM_PANEL_KEYBOARD_SHORTCUT) {
        event.preventDefault()
        toggleBottom()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleBottom, toggleRight])

  const value = React.useMemo<PanelsContextProps>(
    () => ({
      rightOpen,
      rightOpenMobile,
      bottomOpen,
      setRightOpen,
      setRightOpenMobile,
      setBottomOpen,
      toggleRight,
      openRight,
      toggleBottom,
    }),
    [
      bottomOpen,
      rightOpen,
      rightOpenMobile,
      setBottomOpen,
      setRightOpen,
      toggleBottom,
      toggleRight,
      openRight,
    ]
  )

  return (
    <PanelsContext.Provider value={value}>
      {children}
    </PanelsContext.Provider>
  )
}

export {
  PanelsProvider,
  usePanels,
  readPanelStorage,
  writePanelStorage,
  RIGHT_PANEL_KEYBOARD_SHORTCUT,
  BOTTOM_PANEL_KEYBOARD_SHORTCUT,
}