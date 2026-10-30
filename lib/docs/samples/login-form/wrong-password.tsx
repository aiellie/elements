"use client"

import { LoginForm } from "@/registry/aiellie/components/login-form"

export default function WrongPassword() {
  return (
    <LoginForm
      providers={[]}
      className="w-full max-w-xs"
      onSubmit={async () => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        throw new Error("That email and password don't match.")
      }}
    />
  )
}
