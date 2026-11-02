import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@/registry/aiellie/components/bubble"
import { Message, MessageContent } from "@/registry/aiellie/components/message"

export default function BubbleDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 px-4">
      <Message align="end">
        <MessageContent>
          <BubbleGroup>
            <Bubble variant="secondary">
              <BubbleContent>Are we still on for Friday?</BubbleContent>
            </Bubble>
            <Bubble variant="secondary">
              <BubbleContent>I can bring the projector.</BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent>
          <Bubble variant="ghost">
            <BubbleContent>
              Yes, 3pm in the big room. Bring the projector and a spare cable.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}
