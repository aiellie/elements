"use client"

import * as React from "react"
import Script from "next/script"
import { useTheme } from "next-themes"
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { useMetaColor } from "@/hooks/use-meta-color"
import {
  iconSwap,
  iconSwapIn,
  iconSwapOut,
} from "@/lib/surfaces"
import { TooltipIconButton } from "@/components/aiellie/tooltip-icon-button"

export const DARK_MODE_FORWARD_TYPE = "dark-mode-forward"

const noopSubscribe = () => () => {}
const getMounted = () => true
const getServerMounted = () => false

export function useThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { setMetaColor, metaColor } = useMetaColor()

  React.useEffect(() => {
    setMetaColor(metaColor)
  }, [metaColor, setMetaColor])

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return { toggleTheme, resolvedTheme, setTheme }
}

export function ThemeToggle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof TooltipIconButton>, "tooltip">) {
  const { toggleTheme, resolvedTheme } = useThemeToggle()
  const mounted = React.useSyncExternalStore(
    noopSubscribe,
    getMounted,
    getServerMounted
  )
  const isDark = mounted && resolvedTheme === "dark"
  const nextTheme = isDark ? "Light" : "Dark"

  return (
    <TooltipIconButton
      {...props}
      tooltip={nextTheme}
      aria-label={nextTheme}
      className={className}
      onClick={toggleTheme}
    >
      <span className="grid">
        <HugeiconsIcon
          icon={Sun01Icon}
          className={cn(iconSwap, isDark ? iconSwapOut : iconSwapIn)}
        />
        <HugeiconsIcon
          icon={Moon02Icon}
          className={cn(iconSwap, isDark ? iconSwapIn : iconSwapOut)}
        />
      </span>
    </TooltipIconButton>
  )
}

export function DarkModeScript() {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      id="dark-mode-listener"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            (function() {
              // Forward D key
              document.addEventListener('keydown', function(e) {
                if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey) {
                  if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                  ) {
                    return;
                  }
                  e.preventDefault();
                  if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                      type: '${DARK_MODE_FORWARD_TYPE}',
                      key: e.key
                    }, '*');
                  }
                }
              });

            })();
          `,
      }}
    />
  )
}