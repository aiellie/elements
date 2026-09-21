"use client"

import * as React from "react"
import {
  HelpCircleIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/aiellie/ui/button"
import { Input } from "@/registry/aiellie/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/aiellie/ui/popover"

/**
 * Two popovers on two kinds of trigger.
 *
 * Invite is the one worth pressing: it opens with the caret already in the
 * email field rather than on the close button that comes first in the panel,
 * and sending closes it, so the popover is held open by the demo rather than by
 * itself. Roles opens on a hover as well as a press, for a note that should not
 * cost a click to read.
 */
export default function PopoverDemo() {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const emailRef = React.useRef<HTMLInputElement>(null)

  function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEmail("")
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant="default" />}>
          <HugeiconsIcon icon={UserAdd01Icon} />
          Invite
        </PopoverTrigger>
        <PopoverContent initialFocus={emailRef}>
          <div className="flex items-start gap-2">
            <PopoverHeader className="flex-1">
              <PopoverTitle>Invite to project</PopoverTitle>
              <PopoverDescription>
                They&apos;ll get an email with a link to join.
              </PopoverDescription>
            </PopoverHeader>
          </div>
          {/* The field and the button share a height, which is the point of
              Input taking Button's sizes. */}
          <form onSubmit={invite} className="flex items-center gap-2">
            <Input
              ref={emailRef}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              aria-label="Email"
            />
            <Button type="submit">Send</Button>
          </form>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger
          openOnHover
          delay={200}
          render={<Button variant="ghost" />}
        >
          <HugeiconsIcon icon={HelpCircleIcon} />
          Roles
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Who can do what</PopoverTitle>
            <PopoverDescription>
              Editors can change anything in the project. Viewers can read and
              comment, but not edit.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}
