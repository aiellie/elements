import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Login form is one form for signing in and signing up: Google or GitHub, or an email and Continue, which sends a verification code. There is no password and no separate sign-up, so a new address simply makes an account. `LoginForm` is the form on its own, for a page of its own; `LoginDialog` puts it in a dialog, which is what the [User menu](/components/user-menu) opens when no one is signed in. It is only the interface: sending the code and checking it are yours.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Open it from a Sign in button",
        body: [
          "`LoginDialog` brings no trigger, so open it from wherever Sign in lives. `onSubmit` gets the email, and the dialog closes once it resolves.",
        ],
        code: {
          title: "components/sign-in.tsx",
          code: `"use client"

import * as React from "react"

import { LoginDialog } from "@/components/aiellie/login-form"
import { Button } from "@/components/ui/button"

export function SignIn() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Sign in
      </Button>
      <LoginDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={({ email }) => sendCode(email)}
        onProvider={(id) => signInWith(id)}
      />
    </>
  )
}`,
        },
      },
      {
        title: "Say why it failed",
        body: [
          "Throw from `onSubmit`, or return a promise that rejects, and the error's message shows above the button. The field keeps what was typed and the dialog stays open.",
        ],
        code: {
          code: `<LoginDialog
  onSubmit={async ({ email }) => {
    const response = await fetch("/api/send-code", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
    if (!response.ok) throw new Error("Couldn't send a code to that address.")
  }}
  {...props}
/>`,
        },
      },
    ],
  },
  anatomy: {
    code: `<div data-slot="login-dialog"> {/* DialogContent, 384px wide at most */}
  <div data-slot="dialog-header">
    <h2 data-slot="dialog-title">{title}</h2> {/* Sign in or sign up */}
  </div>
  <form data-slot="login-form">
    <div data-slot="login-form-providers">
      <button /> {/* Continue with Google, one per provider */}
    </div>
    <div data-slot="login-form-divider" /> {/* or */}
    <label /> <input type="email" />
    <p /> {/* We'll email you a verification code to sign in. */}
    <p data-slot="login-form-error" /> {/* only after a failed attempt */}
    <button type="submit" /> {/* Continue */}
  </form>
</div>`,
    body: [
      "Continue is the view's one primary button; the providers are outline buttons above it. The line under the field says what Continue does, and the field points to it with `aria-describedby`. While `onSubmit` runs, every control is disabled and the button reads Sending code with a spinner.",
    ],
  },
  examples: [
    {
      title: "When the code can't be sent",
      body: [
        "With `providers={[]}` it is the email alone. This one always fails, to show the error.",
      ],
      sample: "login-form/send-failed",
    },
    {
      title: "Other providers",
      body: [
        "`providers` replaces Google and GitHub. Each has an id, which `onProvider` gets, a name and a Hugeicons glyph.",
      ],
      code: {
        code: `import { AppleIcon } from "@hugeicons/core-free-icons"

<LoginForm
  providers={[{ id: "apple", name: "Apple", icon: AppleIcon }]}
  onProvider={(id) => signInWith(id)}
/>`,
      },
    },
  ],
  api: [
    {
      title: "LoginForm",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        [
          "`onSubmit`",
          "`(values: { email: string }) => void | Promise<void>`",
          "",
          "Called with the email to send a code to. A rejection's message shows above the button.",
        ],
        [
          "`providers`",
          "`LoginProvider[]`",
          "Google, GitHub",
          "Sign-in buttons above the email field. Pass `[]` for none.",
        ],
        [
          "`onProvider`",
          "`(id: string) => void`",
          "",
          "Runs when a provider's button is pressed.",
        ],
        [
          "`emailDescription`",
          "`ReactNode`",
          "`We'll email you a verification code to sign in.`",
          "Under the email field: what happens after Continue.",
        ],
      ],
    },
    {
      title: "LoginDialog",
      head: ["Prop", "Type", "Default", "Description"],
      rows: [
        ["`open`", "`boolean`", "required", "Whether the dialog is open."],
        [
          "`onOpenChange`",
          "`(open: boolean) => void`",
          "required",
          "Called when it closes, including after `onSubmit` resolves.",
        ],
        [
          "`title`",
          "`ReactNode`",
          '`"Sign in or sign up"`',
          "The dialog's title.",
        ],
        ["`description`", "`ReactNode`", "", "Under the title."],
        ["…", "", "", "Every `LoginForm` prop."],
      ],
    },
  ],
}

export default doc
