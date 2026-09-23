import { PanelShell } from "./components/panels-shell"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // The shell's left panel already collapses and resizes, so the sidebar
    // renders inline (`collapsible="none"`) and simply fills the panel.
    <PanelShell >
      {children}
    </PanelShell>
  )
}