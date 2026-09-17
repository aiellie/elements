import { cn } from "@/lib/utils"

function LogoMark({ className }: { className?: string }) {
  // Inlined so the strokes can inherit currentColor and flip to white in dark mode.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0 text-foreground", className)}
    >
      <path
        opacity="0.2"
        fill="none"
        d="M9.2 9.6C9.2 7.4 10.6 6.1 12.4 6.1C14.3 6.1 15.7 7.5 15.7 9.4L15.7 10.9C15.7 12.8 14.3 14.1 12.4 14.1C10.6 14.1 9.2 12.7 9.2 10.9Z"
      />
      <path
        d="M5.5 16.6C5.5 17.7 4.4 18.3 3.6 17.6C2.9 17 2.9 16 3.2 14.9C3.7 12.9 4.6 11 5.1 8.9C5.7 6.3 7.7 4.4 10.3 4.4L14.8 4.6C18.2 5 20.7 7.7 20.7 11L20.7 18.4C20.7 19.2 20.1 19.8 19.3 19.8L18.3 19.8C17.5 19.8 16.9 19.2 16.9 18.4L16.9 16.1C15 16.8 12.9 16.8 11 16.1L11 18.4C11 19.2 10.4 19.8 9.6 19.8L8.6 19.8C7.8 19.8 7.2 19.2 7.2 18.4L7.2 12.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 9.6C9.2 7.4 10.6 6.1 12.4 6.1C14.3 6.1 15.7 7.5 15.7 9.4L15.7 10.9C15.7 12.8 14.3 14.1 12.4 14.1C10.6 14.1 9.2 12.7 9.2 10.9Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 8.6L7.51 8.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <LogoMark />
      <span className="truncate text-sm">@aiellie</span>
    </span>
  )
}