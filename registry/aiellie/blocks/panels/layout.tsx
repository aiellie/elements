import { PanelShell } from "./components/panels-shell"
import { Toaster } from "@/components/ui/toast"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <PanelShell>{children}</PanelShell>
      {/* The app's one toaster, kept out of the shell so a shell rendered
          inside a page that already has one doesn't show every toast twice. */}
      <Toaster />
    </>
  )
}
