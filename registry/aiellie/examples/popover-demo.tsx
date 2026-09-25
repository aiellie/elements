"use client"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/aiellie/ui/popover"
import { Button } from "@/registry/aiellie/ui/button"
import { Input } from "@/registry/aiellie/ui/input"

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" />}>
        Send feedback
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Send feedback</PopoverTitle>
          <PopoverDescription>
            What would make this reply better?
          </PopoverDescription>
        </PopoverHeader>
        <Input placeholder="It could have…" aria-label="Feedback" />
        <Button size="sm" className="self-end">
          Send
        </Button>
      </PopoverContent>
    </Popover>
  )
}
