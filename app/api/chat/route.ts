// The chat block's own route, so its previews on this site reply for real.
export { POST } from "@/registry/aiellie/blocks/chat/route"

// Segment config has to be written here, since Next reads it statically.
export const maxDuration = 60
