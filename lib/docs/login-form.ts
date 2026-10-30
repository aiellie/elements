import type { DocContent } from "@/lib/docs"

const doc: DocContent = {
  intro: [
    "Login form signs someone in with an email and a password, or with Google or GitHub. `LoginForm` is the form on its own, for a page of its own; `LoginDialog` puts it in a dialog, which is what the [User menu](/components/user-menu) opens when no one is signed in. It is only the interface: what signing in does is yours.",
  ],
  gettingStarted: {
    steps: [
      {
        title: "Open it from a Sign in button",
        body: [
          "`LoginDialog` brings no trigger, so open it from wherever Sign in lives. `onSubmit` gets the email and password, and the dialog closes once it resolves.",
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
        onSubmit={({ email, password }) => signIn(email, password)}
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
          "Throw from `onSubmit`, or return a promise that rejects, and the error's message shows above the button. The fields keep what was typed and the dialog stays open.",
        ],
        code: {
          code: `<LoginDialog
  onSubmit={async (values) => {
    const response = await fetch("/api/sign-in", {
      method: "POST",
      body: JSON.stringify(values),
    })
    if (!response.ok) throw new Error("That email and password don't match.")
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
    <h2 data-slot="dialog-title">{title}</h2>
    <p data-slot="dialog-description">{description}</p>
  </div>
  <form data-slot="login-form">
    <div data-slot="login-form-providers">
      <button /> {/* Continue with Google, one per provider */}
    </div>
    <div data-slot="login-form-divider" /> {/* or */}
    <label /> <input type="email" />
    <label /> <button /> {/* Password, Forgot password? */}
    <div data-slot="input-group">
      <input type="password" /> <button /> {/* show or hide */}
    </div>
    <p data-slot="login-form-error" /> {/* only after a failed attempt */}
    <button type="submit" /> {/* Sign in */}
    <p /> {/* No account? Sign up */}
  </form>
</div>`,
    body: [
      "Sign in is the view's one primary button; the providers are outline buttons above it. While `onSubmit` runs, every control is disabled and the button reads Signing in with a spinner. Forgot password? and Sign up only show when you pass `onForgotPassword` and `onSignUp`. The fields carry `email` and `current-password` autocomplete, so password managers fill them.",
    ],
  },
  examples: [
    {
      title: "A wrong password",
      body: [
        "With `providers={[]}` it is the email form alone. This one always fails, to show the error.",
      ],
      sample: "login-form/wrong-password",
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
          "`(values: { email: string; password: string }) => void | Promise<void>`",
          "",
          "Called with what was typed. A rejection's message shows above the button.",
        ],
        [
          "`providers`",
          "`LoginProvider[]`",
          "Google, GitHub",
          "Sign-in buttons above the email form. Pass `[]` for none.",
        ],
        [
          "`onProvider`",
          "`(id: string) => void`",
          "",
          "Runs when a provider's button is pressed.",
        ],
        [
          "`onForgotPassword`",
          "`() => void`",
          "",
          "Shows Forgot password? beside the password's label.",
        ],
        [
          "`onSignUp`",
          "`() => void`",
          "",
          "Shows No account? Sign up under the form.",
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
        ["`title`", "`ReactNode`", '`"Sign in"`', "The dialog's title."],
        [
          "`description`",
          "`ReactNode`",
          "",
          "Under the title. Pass `null` for none.",
        ],
        ["…", "", "", "Every `LoginForm` prop."],
      ],
    },
  ],
}

export default doc
