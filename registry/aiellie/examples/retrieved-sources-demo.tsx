import {
  RetrievedSource,
  RetrievedSources,
} from "@/registry/aiellie/components/retrieved-sources"

export default function RetrievedSourcesDemo() {
  return (
    <div className="w-full max-w-md px-4">
      <RetrievedSources threshold={0.5}>
        <RetrievedSource
          title="Employee handbook.pdf"
          location="p. 14"
          score={0.92}
          defaultOpen
        >
          Full-time employees accrue 1.5 days of paid leave per month, up to a
          maximum of 30 days carried into the next year.
        </RetrievedSource>
        <RetrievedSource
          title="Leave policy 2026.docx"
          location="§ 2.1"
          score={0.81}
        >
          Unused leave above the carry-over cap is paid out at the end of the
          fiscal year.
        </RetrievedSource>
        <RetrievedSource title="Benefits FAQ.md" score={0.34}>
          Parental leave is covered separately; see the parental leave policy.
        </RetrievedSource>
      </RetrievedSources>
    </div>
  )
}
