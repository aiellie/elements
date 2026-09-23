"use client"

import * as React from "react"
import type { ReactNode } from "react"
import { createPortal } from "react-dom"

import type { HugeiconsIcon } from "@hugeicons/react"

/**
 * What the right panel is showing. The shell renders the panel far above the
 * page, so pages fill it by portalling into the body it registers here rather
 * than by handing a node down through the layout. The content stays in the
 * page's own tree — its state and handlers work as if it rendered inline.
 */
type RightPanelContextProps = {
  /** Header title while a page fills the panel; null falls back to the panel's own. */
  title: string | null
  setTitle: (title: string | null) => void
  /** The icon beside it, on the same terms. */
  icon: HugeiconsIcon | null
  setIcon: (icon: HugeiconsIcon | null) => void
  /** What the tab's close button does; without one the tab has no button. */
  onClose: (() => void) | null
  setOnClose: (onClose: (() => void) | null) => void
  /** The panel body to portal into — the sheet's on mobile, the rail's otherwise. */
  target: HTMLElement | null
  setRailNode: (node: HTMLElement | null) => void
  setSheetNode: (node: HTMLElement | null) => void
}

const RightPanelContext = React.createContext<RightPanelContextProps | null>(
  null
)

function useRightPanel() {
  const context = React.useContext(RightPanelContext)
  if (!context) {
    throw new Error("useRightPanel must be used within a RightPanelProvider.")
  }

  return context
}

function RightPanelProvider({ children }: { children: ReactNode }) {
  const [railNode, setRailNode] = React.useState<HTMLElement | null>(null)
  const [sheetNode, setSheetNode] = React.useState<HTMLElement | null>(null)
  const [title, setTitle] = React.useState<string | null>(null)
  const [icon, setIconState] = React.useState<HugeiconsIcon | null>(null)

  const [onClose, setOnCloseState] = React.useState<(() => void) | null>(null)

  // An `AppIcon` is sometimes a component, and a bare function handed to a
  // setter is read as an updater — so every write goes through one. Same for
  // the close handler, which is always a function.
  const setIcon = React.useCallback((next: HugeiconsIcon | null) => {
    setIconState(() => next)
  }, [])
  const setOnClose = React.useCallback((next: (() => void) | null) => {
    setOnCloseState(() => next)
  }, [])

  const value = React.useMemo<RightPanelContextProps>(
    () => ({
      title,
      setTitle,
      icon,
      setIcon,
      onClose,
      setOnClose,
      // The sheet only mounts while it is open, and on mobile it is the one on
      // screen — so it wins whenever it is there.
      target: sheetNode ?? railNode,
      setRailNode,
      setSheetNode,
    }),
    [icon, onClose, railNode, setIcon, setOnClose, sheetNode, title]
  )

  return (
    <RightPanelContext.Provider value={value}>
      {children}
    </RightPanelContext.Provider>
  )
}

/**
 * Renders `children` inside the right panel. Mount it anywhere in a page;
 * it draws nothing where it sits. `title` and `icon` name the panel while it
 * is mounted, and are handed back when it unmounts. `onClose` puts a close
 * button on the panel's tab — memoize it, or every render re-registers it.
 */
function RightPanelContent({
  icon,
  title,
  onClose,
  children,
}: {
  icon?: HugeiconsIcon
  title?: string
  onClose?: () => void
  children: ReactNode
}) {
  const { target, setIcon, setOnClose, setTitle } = useRightPanel()

  React.useEffect(() => {
    setTitle(title ?? null)
    setIcon(icon ?? null)
    setOnClose(onClose ?? null)
    return () => {
      setTitle(null)
      setIcon(null)
      setOnClose(null)
    }
  }, [icon, onClose, setIcon, setOnClose, setTitle, title])

  if (!target) return null
  return createPortal(children, target)
}

export { RightPanelProvider, RightPanelContent, useRightPanel }