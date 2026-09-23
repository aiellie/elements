import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DemoStage } from "@/components/pages/demo-stage"
import { DEMOS } from "@/lib/demos"

// Only the demos that exist get a page; any other name is a 404 rather than
// an empty stage.
export const dynamicParams = false

// Typed by hand rather than with `PageProps<"/demo/[name]">`, which only exists
// once Next has generated its route types and so fails a cold typecheck.
type Props = { params: Promise<{ name: string }> }

export function generateStaticParams() {
  return Object.keys(DEMOS).map((name) => ({ name }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { name } = await props.params
  return { title: DEMOS[name]?.title }
}

export default async function DemoPage(props: Props) {
  const { name } = await props.params
  const demo = DEMOS[name]
  if (!demo) notFound()

  return (
    <DemoStage item={name} title={demo.title} back={demo.gallery}>
      <demo.Demo />
    </DemoStage>
  )
}
