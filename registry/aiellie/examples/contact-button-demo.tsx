"use client"

import * as React from "react"

import { ContactButton } from "@/registry/aiellie/components/contact-button"

export default function ContactButtonDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <ContactButton
        name="Ellie"
        emoji="🐘"
        src="/brand/favicon.svg"
        aria-expanded={open}
        aria-controls="contact-info"
        onClick={() => setOpen((value) => !value)}
      />
      <p
        id="contact-info"
        hidden={!open}
        className="max-w-56 text-center text-xs text-muted-foreground"
      >
        Ellie answers in this chat, and remembers what you tell her.
      </p>
    </div>
  )
}
