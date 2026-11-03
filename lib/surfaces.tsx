"use client"

import type { ComponentProps } from "react"
import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Site-only: registry code can't import this file, so it writes these classes
// itself. Timings follow the design skill's motion rules.

export const floating =
  "border border-border/60 bg-popover shadow-md backdrop-blur-xs supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-background/70"

export const field = "bg-foreground/[0.04] dark:bg-foreground/[0.06]"

export const fieldInteractive =
  "bg-foreground/[0.04] transition-colors duration-80 hover:bg-foreground/[0.07] motion-reduce:transition-none dark:bg-foreground/[0.06] dark:hover:bg-foreground/[0.09]"

export const iconSwap =
  "[grid-area:1/1] transition-[opacity,scale,filter] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"

export const iconSwapIn = "scale-100 opacity-100 blur-none"

export const iconSwapOut = "scale-[0.25] opacity-0 blur-xs"

const labelSwap =
  "col-start-1 row-start-1 flex w-max items-center gap-1.5 leading-none transition-[opacity,filter] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"

const labelSwapIn = "opacity-100 blur-none"

const labelSwapOut = "pointer-events-none select-none opacity-0 blur-[2px]"

export const collapsePanel =
  "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:h-0 data-[ending-style]:ease-[cubic-bezier(0.4,0,1,1)] data-[starting-style]:h-0 motion-reduce:transition-none"

export function ShimmerLabel({
  active = true,
  className,
  ...props
}: ComponentProps<"span"> & { active?: boolean }) {
  return (
    <span
      className={cn(active && "shimmer motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export function SwapLabel({
  active,
  children,
  className,
}: {
  active: 0 | 1
  children: [React.ReactNode, React.ReactNode]
  className?: string
}) {
  const first = useRef<HTMLSpanElement>(null)
  const second = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    const target = (active === 0 ? first : second).current
    if (!target) return undefined
    const measure = () =>
      setWidth(Math.ceil(target.getBoundingClientRect().width))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(target)
    return () => observer.disconnect()
  }, [active])

  return (
    <span
      style={width === null ? undefined : { width }}
      className={cn(
        "grid overflow-x-clip transition-[width] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        className
      )}
    >
      {children.map((layer, index) => (
        <span
          key={index}
          ref={index === 0 ? first : second}
          aria-hidden={active !== index}
          className={cn(
            labelSwap,
            active === index ? labelSwapIn : labelSwapOut
          )}
        >
          {layer}
        </span>
      ))}
    </span>
  )
}
