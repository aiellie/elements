"use client"

import { Key01Icon, SourceCodeIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/aiellie/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/registry/aiellie/ui/item"

export default function ItemDemo() {
  return (
    <ItemGroup className="w-full max-w-sm">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Key01Icon} aria-hidden />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>OpenAI key</ItemTitle>
          <ItemDescription>
            Kept in this browser, sent with each request.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Replace
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={SourceCodeIcon} aria-hidden />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Context window</ItemTitle>
          <ItemDescription className="tabular-nums">
            128,000 tokens
          </ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
