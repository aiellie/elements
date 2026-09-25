"use client"

import * as React from "react"

import {
  NavBars,
  useNavBarsInView,
  type NavBarsVariant,
} from "@/registry/aiellie/components/nav-bars"
import { Tabs, TabsList, TabsTrigger } from "@/registry/aiellie/ui/tabs"

const SECTIONS = [
  {
    id: "install",
    label: "Install",
    body: "Add the registry to components.json, then install a component by name. Each one brings the pieces it depends on with it.",
  },
  {
    id: "theme",
    label: "Theme",
    body: "The theme ships as one stylesheet. Swap its colour tokens for your own and every component follows, in light and dark.",
  },
  {
    id: "compose",
    label: "Compose",
    body: "Components build on each other. The composer takes a model selector, attachments and a send button, and each works on its own too.",
  },
  {
    id: "stream",
    label: "Stream a reply",
    body: "Pass the reply as it arrives. Stream text writes it out word by word at a steady pace, whatever the model's own rhythm.",
  },
  {
    id: "ship",
    label: "Ship",
    body: "Every item is a file in your project, so you can change anything. Nothing updates underneath you.",
  },
]

const ITEMS = SECTIONS.map(({ id, label, body }) => ({
  id: `nav-bars-${id}`,
  label,
  description: body,
}))

const VARIANTS: { value: NavBarsVariant; label: string }[] = [
  { value: "list", label: "List" },
  { value: "peek", label: "Peek" },
  { value: "expand", label: "Expand" },
]

export default function NavBarsDemo() {
  const [variant, setVariant] = React.useState<NavBarsVariant>("list")
  const scroller = React.useRef<HTMLDivElement>(null)
  const active = useNavBarsInView(
    ITEMS.map((item) => item.id),
    scroller
  )

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <Tabs
        value={variant}
        onValueChange={(value) => setVariant(value as NavBarsVariant)}
      >
        <TabsList>
          {VARIANTS.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex h-64 w-full gap-2 overflow-hidden rounded-xl border bg-background py-2 ps-2">
        <NavBars
          variant={variant}
          items={ITEMS}
          active={active}
          onSelect={(id) =>
            document.getElementById(id)?.scrollIntoView({
              block: "start",
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
            })
          }
          className="self-center"
        />
        <div
          ref={scroller}
          className="flex min-w-0 flex-1 [scrollbar-width:thin] flex-col gap-8 overflow-y-auto pe-4"
        >
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={`nav-bars-${section.id}`}
              className="flex scroll-mt-2 flex-col gap-1"
            >
              <h3 className="text-sm font-medium">{section.label}</h3>
              <p className="text-sm text-muted-foreground">{section.body}</p>
            </section>
          ))}
          <div className="h-32 shrink-0" />
        </div>
      </div>
    </div>
  )
}
