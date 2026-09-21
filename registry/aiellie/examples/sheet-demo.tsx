"use client"

import { Button } from "@/registry/aiellie/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/aiellie/ui/sheet"

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        Open sheet
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet</SheetTitle>
          <SheetDescription>
            A panel that slides in from an edge of the screen.
          </SheetDescription>
        </SheetHeader>
        <p className="px-4 text-sm">
          The page behind it dims and stops responding until the sheet closes.
          Press Escape, click outside it, or use the button below.
        </p>
        <SheetFooter>
          <SheetClose render={<Button size="sm" />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
