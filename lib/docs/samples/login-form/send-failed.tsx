"use client"

import { LoginForm } from "@/registry/aiellie/components/login-form"

export default function SendFailed() {
  return (
    <LoginForm
      providers={[]}
      className="w-full max-w-xs"
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        throw new Error("Couldn't send a code to that address.")
      }}
    />
  )
}
