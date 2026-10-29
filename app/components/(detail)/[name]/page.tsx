import type { Metadata } from "next"

import {
  ComponentDetail,
  componentMetadata,
  componentParams,
} from "@/components/docs/component-detail"

export const dynamicParams = false

// Typed by hand rather than with `PageProps<"/components/[name]">`, which only
// exists once Next has generated its route types and so fails a cold typecheck.
type Props = { params: Promise<{ name: string }> }

export function generateStaticParams() {
  return componentParams("components")
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { name } = await props.params
  return componentMetadata("components", name)
}

export default async function DetailPage(props: Props) {
  const { name } = await props.params
  return <ComponentDetail gallery="components" name={name} />
}
