import { Badge } from "@/registry/aiellie/ui/badge"

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "destructive",
  "ghost",
  "link",
] as const

export default function BadgeDemo() {
  return (
    <div className="flex max-w-xs flex-wrap items-center justify-center gap-2">
      {VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  )
}
