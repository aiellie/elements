"use client"

import { Button } from "@/registry/aiellie/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/aiellie/ui/tooltip"
  
const SIDES = ["top", "right", "bottom", "left"] as const

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SIDES.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" size="sm" />}>
              {side}
            </TooltipTrigger>
            <TooltipContent side={side}>Opens on the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
