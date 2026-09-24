"use client"

import {
  Alert02Icon,
  Cancel01Icon,
  File02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/aiellie/ui/attachment"

// A placeholder picture, so the demo needs no image file.
const PREVIEW = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#a5b4fc"/><stop offset="1" stop-color="#f9a8d4"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>'
)}`

export default function AttachmentDemo() {
  return (
    <AttachmentGroup className="max-w-full px-4">
      <Attachment>
        <AttachmentMedia variant="image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PREVIEW} alt="" />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>mockup.png</AttachmentTitle>
          <AttachmentDescription>PNG · 1.2 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction>
            <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
            <span className="sr-only">Remove mockup.png</span>
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="uploading">
        <AttachmentMedia className="text-muted-foreground">
          <HugeiconsIcon aria-hidden icon={File02Icon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>report.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading…</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="error">
        <AttachmentMedia>
          <HugeiconsIcon aria-hidden icon={Alert02Icon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>data.csv</AttachmentTitle>
          <AttachmentDescription>Upload failed</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction>
            <HugeiconsIcon aria-hidden icon={Cancel01Icon} />
            <span className="sr-only">Remove data.csv</span>
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </AttachmentGroup>
  )
}
