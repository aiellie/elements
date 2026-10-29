import type { Metadata } from "next"

import {
  ComponentDetail,
  componentMetadata,
  componentParams,
} from "@/components/docs/component-detail"

export const dynamicParams = false

// Typed by hand rather than with `PageProps<"/design/[name]">`, which only
// exists once Next has generated its route types and so fails a cold typecheck.
type Props = { params: Promise<{ name: string }> }

export function generateStaticParams() {
  return componentParams("design")
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { name } = await props.params
  return componentMetadata("design", name)
}

export default async function DetailPage(props: Props) {
  const { name } = await props.params
  return <ComponentDetail gallery="design" name={name} />
}
