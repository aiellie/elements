import Link from "next/link"

import { ORG_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

type CopyrightProps = {
  holder?: string
  startYear?: number
  className?: string
}

export function Copyright({
  holder = "AIEllie Inc.",
  startYear,
  className,
}: CopyrightProps) {
  const year = new Date().getFullYear()
  const range =
    startYear !== undefined && startYear < year
      ? `${startYear}–${year}`
      : `${year}`

  return (
    <p
      className={cn(
        "font-mono text-xs whitespace-nowrap text-muted-foreground",
        className
      )}
    >
            <Link href={ORG_URL} className="transition-colors">
      © {range}{" "}
        {holder}
      </Link>
      {/* The tail is the first thing to go when the bar gets narrow. */}
    </p>
  )
}