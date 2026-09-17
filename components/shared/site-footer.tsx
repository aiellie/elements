import { Copyright } from "@/components/shared/copyright"
import { Latency } from "@/components/shared/latency"
import { LoadStatus } from "@/components/shared/load-status"
import { NyClock } from "@/components/shared/ny-clock"
import { ThemeToggle } from "./theme-toggle"
import { CONTAINER } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  return (
    <footer className=" inset-x-0 bottom-0 z-50 bg-background py-0">
      <div className={cn(CONTAINER, "flex h-8 items-center justify-between gap-2 border-t border-border/40")}>
        {/* Shrinks and ellipsizes; the status cluster never gives up space. */}
        <Copyright className="min-w-0 truncate" />
        <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-4">
          <Latency />
          <span className="h-3 w-px shrink-0 bg-border" />
          <NyClock />
          <span className="h-3 w-px shrink-0 bg-border" />
          <LoadStatus />
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}