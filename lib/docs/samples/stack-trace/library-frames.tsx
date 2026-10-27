import {
  StackTrace,
  StackTraceFrames,
  StackTraceHeader,
} from "@/registry/aiellie/components/stack-trace"

const TRACE = `RangeError: Maximum call stack size exceeded
    at flatten (lib/tree.ts:8:12)
    at Array.map (<anonymous>)
    at flatten (lib/tree.ts:9:30)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)`

export default function LibraryFrames() {
  return (
    <StackTrace trace={TRACE} defaultOpen className="max-w-md">
      <StackTraceHeader />
      <StackTraceFrames showLibrary />
    </StackTrace>
  )
}
