"use client"

import * as React from "react"
import {
  Alert02Icon,
  Github01Icon,
  GoogleIcon,
  Loading03Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/registry/aiellie/ui/dialog"
import { Input } from "@/registry/aiellie/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/aiellie/ui/input-group"
import { Separator } from "@/registry/aiellie/ui/separator"

type LoginValues = { email: string; password: string }

type LoginProvider = { id: string; name: string; icon: IconSvgElement }

const LOGIN_PROVIDERS: LoginProvider[] = [
  { id: "google", name: "Google", icon: GoogleIcon },
  { id: "github", name: "GitHub", icon: Github01Icon },
]

type LoginFormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  /** Return a promise to show the button working; a rejection's message shows above it. */
  onSubmit?: (values: LoginValues) => void | Promise<void>
  /** Sign-in buttons above the email form. Pass `[]` for none. */
  providers?: LoginProvider[]
  onProvider?: (id: string) => void
  onForgotPassword?: () => void
  onSignUp?: () => void
}

function LoginForm({
  onSubmit,
  providers = LOGIN_PROVIDERS,
  onProvider,
  onForgotPassword,
  onSignUp,
  className,
  ...props
}: LoginFormProps) {
  const id = React.useId()
  const passwordRef = React.useRef<HTMLInputElement>(null)
  const [shown, setShown] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <form
      data-slot="login-form"
      className={cn("flex flex-col gap-4", className)}
      onSubmit={async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setError(null)
        setPending(true)
        try {
          await onSubmit?.({
            email: String(data.get("email") ?? "").trim(),
            password: String(data.get("password") ?? ""),
          })
        } catch (reason) {
          setError(
            reason instanceof Error && reason.message
              ? reason.message
              : "Couldn't sign you in. Try again."
          )
        } finally {
          setPending(false)
        }
      }}
      {...props}
    >
      {providers.length > 0 ? (
        <>
          <div data-slot="login-form-providers" className="flex flex-col gap-2">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                type="button"
                variant="outline"
                size="default"
                disabled={pending}
                onClick={() => onProvider?.(provider.id)}
              >
                <HugeiconsIcon
                  icon={provider.icon}
                  data-icon="inline-start"
                  aria-hidden
                />
                Continue with {provider.name}
              </Button>
            ))}
          </div>
          <div
            data-slot="login-form-divider"
            className="flex items-center gap-3 text-xs text-muted-foreground"
          >
            <Separator className="flex-1" />
            or
            <Separator className="flex-1" />
          </div>
        </>
      ) : null}

      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-email`} className="text-sm font-medium">
          Email
        </label>
        <Input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={pending}
          aria-invalid={error ? true : undefined}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`${id}-password`} className="text-sm font-medium">
            Password
          </label>
          {onForgotPassword ? (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-muted-foreground transition-colors duration-80 outline-none hover:text-foreground focus-visible:text-foreground motion-reduce:transition-none"
            >
              Forgot password?
            </button>
          ) : null}
        </div>
        <InputGroup>
          <InputGroupInput
            ref={passwordRef}
            id={`${id}-password`}
            name="password"
            type={shown ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={pending}
            aria-invalid={error ? true : undefined}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label={shown ? "Hide password" : "Show password"}
              aria-pressed={shown}
              disabled={pending}
              onClick={() => {
                setShown(!shown)
                passwordRef.current?.focus()
              }}
            >
              <HugeiconsIcon icon={shown ? ViewOffSlashIcon : ViewIcon} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      {error ? (
        <p
          role="alert"
          data-slot="login-form-error"
          className="flex items-start gap-2 rounded-lg bg-destructive/4 px-3 py-2 text-xs text-destructive dark:bg-destructive/15"
        >
          <HugeiconsIcon
            icon={Alert02Icon}
            aria-hidden
            className="mt-px size-3.5 shrink-0"
          />
          {error}
        </p>
      ) : null}

      <Button type="submit" size="default" disabled={pending}>
        {pending ? (
          <HugeiconsIcon
            icon={Loading03Icon}
            data-icon="inline-start"
            aria-hidden
            className="animate-spin motion-reduce:animate-none"
          />
        ) : null}
        {pending ? "Signing in" : "Sign in"}
      </Button>

      {onSignUp ? (
        <p className="text-center text-xs text-muted-foreground">
          No account?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="text-foreground transition-colors duration-80 outline-none hover:underline hover:underline-offset-4 focus-visible:underline focus-visible:underline-offset-4 motion-reduce:transition-none"
          >
            Sign up
          </button>
        </p>
      ) : null}
    </form>
  )
}

function LoginDialog({
  open,
  onOpenChange,
  title = "Sign in",
  description = "Welcome back. Sign in to pick up where you left off.",
  onSubmit,
  ...props
}: LoginFormProps & {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-slot="login-dialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <LoginForm
          {...props}
          onSubmit={async (values) => {
            await onSubmit?.(values)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export { LoginDialog, LoginForm, LOGIN_PROVIDERS }
export type { LoginProvider, LoginValues }
