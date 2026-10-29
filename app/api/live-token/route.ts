// The live-token route, so video calls on this site can reach Gemini when the
// deployment has a key. Without one it answers 503 and the demos use the mock.
export { POST } from "@/registry/aiellie/lib/live-token"
