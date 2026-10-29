"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
  MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"

const useToastManager = ToastPrimitive.useToastManager
const createToastManager = ToastPrimitive.createToastManager

function ToastProvider(props: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />
}

function ToastPortal(props: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed end-4 bottom-4 isolate z-[var(--z-toast,60)] mx-auto w-[calc(100vw-2rem)] outline-none sm:end-6 sm:bottom-6 sm:w-80",
        className
      )}
      {...props}
    />
  )
}

const toastSurface = (variant: "glass" | "solid") =>
  cn(
    "rounded-lg border border-border/40 text-sm text-foreground shadow-md select-none",
    variant === "glass"
      ? "bg-popover backdrop-blur-xs supports-[backdrop-filter]:bg-background/60"
      : "bg-popover"
  )

const toastStacked = cn(
  "pointer-events-auto absolute end-0 bottom-0 h-(--height) w-full origin-bottom",
  "[--gap:0.5rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--peek:0.5rem] [--scale:calc(max(0,1-(var(--toast-index)*0.08)))] [--shrink:calc(1-var(--scale))]",
  "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
  "[transition:transform_280ms_cubic-bezier(0.16,1,0.3,1),opacity_150ms_cubic-bezier(0.16,1,0.3,1),height_280ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
  "after:absolute after:start-0 after:top-full after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
  "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
  "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)] data-starting-style:opacity-0",
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)] [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:opacity-0",
  "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]"
)

const toastAnchored = cn(
  "pointer-events-auto relative flex w-max max-w-[calc(100vw-2rem)] origin-(--transform-origin) flex-col",
  "transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:ease-[cubic-bezier(0.4,0,1,1)] data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none"
)

function Toast({
  className,
  variant = "glass",
  placement = "stacked",
  ...props
}: ToastPrimitive.Root.Props & {
  variant?: "glass" | "solid"
  placement?: "stacked" | "anchored"
}) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={variant}
      data-placement={placement}
      className={cn(
        toastSurface(variant),
        placement === "stacked" ? toastStacked : toastAnchored,
        "outline-none focus-visible:border-ring",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-3 transition-opacity duration-150 ease-out data-behind:opacity-0 data-expanded:opacity-100 motion-reduce:transition-none",
        "in-data-[placement=anchored]:h-auto in-data-[placement=anchored]:gap-2 in-data-[placement=anchored]:px-3 in-data-[placement=anchored]:py-2",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "text-sm font-medium text-foreground data-[type=error]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-xs leading-4 text-foreground", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  "aria-label": ariaLabel = "Dismiss notification",
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      render={render}
      aria-label={ariaLabel}
      className={cn(
        "relative shrink-0 text-foreground after:absolute after:-inset-2 after:content-['']",
        className
      )}
      {...props}
    >
      {children ?? <HugeiconsIcon aria-hidden icon={Cancel01Icon} />}
    </ToastPrimitive.Close>
  )
}

function ToastIcon({ type }: { type: string | undefined }) {
  let icon: React.ReactNode = null

  if (type === "success") {
    icon = (
      <HugeiconsIcon
        aria-hidden
        icon={CheckmarkCircle02Icon}
        className="text-success"
      />
    )
  }

  if (type === "info") {
    icon = <HugeiconsIcon aria-hidden icon={InformationCircleIcon} />
  }

  if (type === "warning") {
    icon = <HugeiconsIcon aria-hidden icon={Alert02Icon} />
  }

  if (type === "error") {
    icon = (
      <HugeiconsIcon
        aria-hidden
        icon={MultiplicationSignCircleIcon}
        className="text-destructive"
      />
    )
  }

  if (type === "loading") {
    icon = (
      <HugeiconsIcon
        aria-hidden
        icon={Loading03Icon}
        className="animate-spin text-live motion-reduce:animate-none"
      />
    )
  }

  if (!icon) return null

  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    >
      {icon}
    </span>
  )
}

function ToastPositioner({
  className,
  sideOffset = 8,
  ...props
}: ToastPrimitive.Positioner.Props) {
  return (
    <ToastPrimitive.Positioner
      data-slot="toast-positioner"
      sideOffset={sideOffset}
      className={cn("isolate z-[var(--z-toast,60)]", className)}
      {...props}
    />
  )
}

function ToastArrow({ className, ...props }: ToastPrimitive.Arrow.Props) {
  return (
    <ToastPrimitive.Arrow
      data-slot="toast-arrow"
      className={cn(
        "block h-1.5 w-3 overflow-clip",
        "before:absolute before:start-1/2 before:bottom-0 before:block before:size-2 before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:border before:border-border/40 before:bg-popover before:content-[''] rtl:before:translate-x-1/2",
        "data-[side=bottom]:-top-1.5 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180",
        "data-[side=left]:-end-2 data-[side=left]:rotate-90 data-[side=right]:-start-2 data-[side=right]:-rotate-90",
        className
      )}
      {...props}
    />
  )
}

function Toaster({
  variant = "glass",
  ...props
}: ToastPrimitive.Viewport.Props & { variant?: "glass" | "solid" }) {
  const { toasts } = useToastManager()

  return (
    <ToastPortal>
      <ToastViewport {...props}>
        {[...toasts].reverse().map((toast) => (
          <Toast key={toast.id} toast={toast} variant={variant}>
            <ToastContent>
              <ToastIcon type={toast.type} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <ToastTitle />
                <ToastDescription />
              </div>
              <ToastAction />
              <ToastClose />
            </ToastContent>
          </Toast>
        ))}
      </ToastViewport>
    </ToastPortal>
  )
}

function AnchoredToaster({
  variant = "glass",
  showArrow = true,
  className,
  ...props
}: ToastPrimitive.Viewport.Props & {
  variant?: "glass" | "solid"
  showArrow?: boolean
}) {
  const { toasts } = useToastManager()

  return (
    <ToastPortal>
      <ToastPrimitive.Viewport
        data-slot="toast-viewport"
        className={cn("outline-none", className)}
        {...props}
      >
        {toasts.map((toast) => (
          <ToastPositioner
            key={toast.id}
            toast={toast}
            {...toast.positionerProps}
          >
            <Toast toast={toast} variant={variant} placement="anchored">
              {showArrow ? <ToastArrow /> : null}
              <ToastContent>
                <ToastIcon type={toast.type} />
                <ToastDescription />
              </ToastContent>
            </Toast>
          </ToastPositioner>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPortal>
  )
}

export {
  AnchoredToaster,
  Toast,
  ToastAction,
  ToastArrow,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastPortal,
  ToastPositioner,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
  createToastManager,
  useToastManager,
}
