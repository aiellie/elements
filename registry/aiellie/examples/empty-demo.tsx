import { brandIcons } from "@/registry/aiellie/icons/brand-icons"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/aiellie/ui/empty"

export default function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{brandIcons.elephant("size-5")}</EmptyMedia>
        <EmptyTitle>No chats yet</EmptyTitle>
        <EmptyDescription>
          Start one and it will show up here, ready to pick up again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">New chat</Button>
      </EmptyContent>
    </Empty>
  )
}
