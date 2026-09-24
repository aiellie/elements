"use client"

import { Meter as MeterPrimitive } from "@base-ui/react/meter"

import { cn } from "@/lib/utils"

function Meter({
  className,
  children,
  tone = "default",
  ...props
}: MeterPrimitive.Root.Props & {
  /** Recolours the fill only. */
  tone?: "default" | "success" | "destructive"
}) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      data-tone={tone}
      className={cn(
        "group/meter flex w-full flex-wrap items-center gap-x-2 gap-y-2",
        className
      )}
      {...props}
    >
      {children}
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </MeterPrimitive.Root>
  )
}

function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
}

// A shadcn theme has no success token, so that tone uses raw emerald.
function MeterIndicator({
  className,
  ...props
}: MeterPrimitive.Indicator.Props) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn(
        "h-full rounded-full bg-foreground transition-[width] duration-[280ms] ease-[cubic-bezier(.16,1,.3,1)] group-data-[tone=destructive]/meter:bg-destructive group-data-[tone=success]/meter:bg-emerald-600 motion-reduce:transition-none dark:group-data-[tone=success]/meter:bg-emerald-400",
        className
      )}
      {...props}
    />
  )
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("truncate text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn("ms-auto text-xs text-foreground tabular-nums", className)}
      {...props}
    />
  )
}

export { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue }
