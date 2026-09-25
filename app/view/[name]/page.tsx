import { notFound } from "next/navigation"

import { DEMOS } from "@/lib/demos"
import { getRegistryItemNames } from "@/lib/registry"

export const dynamicParams = false

type Props = { params: Promise<{ name: string }> }

const blockNames = getRegistryItemNames("registry:block")

export function generateStaticParams() {
  return blockNames.map((name) => ({ name }))
}

export default async function BlockPreviewPage({ params }: Props) {
  const { name } = await params
  const demo = DEMOS[name]

  if (!blockNames.includes(name) || !demo) notFound()

  return (
    <main className="h-dvh overflow-hidden bg-background">
      <demo.Demo />
    </main>
  )
}
