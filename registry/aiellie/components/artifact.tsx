"use client"

import * as React from "react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

function Artifact({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="artifact"
      className={cn(
        "flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/60 bg-background text-sm",
        className
      )}
      {...props}
    />
  )
}

function ArtifactHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="artifact-header"
      className={cn(
        "flex min-h-11 min-w-0 shrink-0 items-center gap-2 border-b border-border/60 py-1.5 ps-3 pe-1.5",
        className
      )}
      {...props}
    />
  )
}

function ArtifactTitle({
  icon,
  description,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: IconSvgElement
  /** A short line beside the title, like the kind of file and when it changed. */
  description?: React.ReactNode
}) {
  return (
    <div
      data-slot="artifact-title"
      className={cn("flex min-w-0 flex-1 items-center gap-2", className)}
      {...props}
    >
      {icon ? (
        <HugeiconsIcon
          aria-hidden
          icon={icon}
          className="size-4 shrink-0 text-muted-foreground"
        />
      ) : null}
      <div className="flex min-w-0 flex-col">
        <h3 className="truncate leading-5 font-medium">{children}</h3>
        {description ? (
          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function ArtifactActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="artifact-actions"
      role="group"
      aria-label="Artifact actions"
      className={cn("ms-auto flex shrink-0 items-center gap-0.5", className)}
      {...props}
    />
  )
}

function ArtifactAction({
  icon,
  children,
  ...props
}: React.ComponentProps<typeof TooltipIconButton> & {
  icon?: IconSvgElement
}) {
  return (
    <TooltipIconButton data-slot="artifact-action" {...props}>
      {icon ? <HugeiconsIcon aria-hidden icon={icon} /> : children}
    </TooltipIconButton>
  )
}

function ArtifactClose({
  tooltip = "Close",
  ...props
}: Omit<React.ComponentProps<typeof TooltipIconButton>, "tooltip"> & {
  tooltip?: string
}) {
  return (
    <TooltipIconButton data-slot="artifact-close" tooltip={tooltip} {...props}>
      <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
    </TooltipIconButton>
  )
}

function ArtifactContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="artifact-content"
      className={cn("min-h-0 min-w-0 flex-1 overflow-auto", className)}
      {...props}
    />
  )
}

export {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactHeader,
  ArtifactTitle,
}
