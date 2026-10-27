import {
  Commit,
  CommitFiles,
  CommitHash,
  CommitHeader,
} from "@/registry/aiellie/components/commit"

export default function CommitDemo() {
  return (
    <div className="w-full max-w-md px-4">
      <Commit
        defaultOpen
        files={[
          {
            path: "app/components/chart.tsx",
            status: "modified",
            additions: 6,
            deletions: 2,
          },
          {
            path: "app/components/use-container-width.ts",
            status: "added",
            additions: 18,
          },
          { path: "app/components/chart.css", status: "removed", deletions: 9 },
        ]}
      >
        <CommitHeader
          message="Size the chart from its container"
          author="Ada Lovelace"
          time="42 minutes ago"
        >
          <CommitHash hash="4f2c9e1b7a03d5e8c6b1f09a2d4e7c3b5a8f6d10" />
        </CommitHeader>
        <CommitFiles />
      </Commit>
    </div>
  )
}
