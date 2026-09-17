import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusVariants = cva(
  "group/status inline-flex w-fit shrink-0 items-center gap-1.5 overflow-hidden rounded-4xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-foreground/5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        success:
          "border-emerald-500/10 bg-emerald-500/4 text-emerald-700 dark:border-emerald-400/5 dark:bg-emerald-400/15 dark:text-emerald-400",
        error:
          "border-destructive/20 bg-destructive/6 text-destructive dark:border-destructive/25 dark:bg-destructive/10",
        pending:
          "border-amber-500/20 bg-amber-500/6 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/6 dark:text-amber-400",
        loading:
          "border-sky-500/20 bg-sky-500/6 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/6 dark:text-sky-400",
        recording:
          "border-rose-500/20 bg-rose-500/6 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/6 dark:text-rose-400",
        cancelled: "border-border bg-muted text-muted-foreground",
        verified:
          "border-blue-500/20 bg-blue-500/6 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/6 dark:text-blue-400",
        brand:
          "border-primary/20 bg-primary/6 text-primary dark:border-primary/25 dark:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "brand",
    },
  }
)

function Status({
  className,
  variant = "success",
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
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60 group-data-[pulse=false]/status:hidden" />
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