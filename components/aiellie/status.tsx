import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusVariants = cva(
  "group/status inline-flex w-fit shrink-0 items-center gap-1.5 overflow-hidden rounded-4xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-foreground/5 motion-reduce:transition-none [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        success:
          "border-emerald-500/10 bg-emerald-500/4 text-emerald-700 dark:border-emerald-400/5 dark:bg-emerald-400/10 dark:text-emerald-400",
        destructive:
          "border-destructive/20 bg-destructive/6 text-destructive dark:border-destructive/25 dark:bg-destructive/10",
        live: "border-blue-500/20 bg-blue-500/6 text-[#526FFF] dark:border-blue-400/20 dark:bg-blue-400/6 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "live",
    },
  }
)

function Status({
  className,
  variant = "live",
  pulse = false,
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof statusVariants> & {
    /** Animate the indicator dot with a pulsing ping. */
    pulse?: boolean
  }) {
  const rootProps: useRender.ComponentProps<"span"> &
    Record<`data-${string}`, string> = {
    className: cn(statusVariants({ variant }), className),
    "data-pulse": pulse ? "true" : "false",
  }
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(rootProps, props),
    render,
    state: {
      slot: "status",
      variant,
    },
  })
}

/**
 * Colored dot for a {@link Status}. Inherits the status color via
 * `currentColor`, so it always matches the surrounding variant.
 */
function StatusIndicator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="status-indicator"
      className={cn(
        "relative flex size-1.5 shrink-0 items-center justify-center",
        className
      )}
      {...props}
    >
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60 group-data-[pulse=false]/status:hidden motion-reduce:animate-none" />
      <span
        aria-hidden
        className="absolute inline-flex size-full rounded-full border border-current/30"
      />
      <span className="relative inline-flex size-1 rounded-full bg-current" />
    </span>
  )
}

/** Text label for a {@link Status}. */
function StatusLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="status-label"
      className={cn("truncate", className)}
      {...props}
    />
  )
}

export { Status, StatusIndicator, StatusLabel, statusVariants }
