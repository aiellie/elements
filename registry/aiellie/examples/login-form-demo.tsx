"use client"

import * as React from "react"

import { LoginDialog } from "@/registry/aiellie/components/login-form"
import { Button } from "@/registry/aiellie/ui/button"

export default function LoginFormDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Sign in
      </Button>
      <LoginDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={() => new Promise((resolve) => setTimeout(resolve, 800))}
      />
    </>
  )
}
