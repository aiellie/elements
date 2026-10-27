import { NeedsYou } from "@/registry/aiellie/components/needs-you"

export default function ReadOnly() {
  return (
    <NeedsYou
      staleAfter={300}
      items={[
        {
          id: "1",
          thread: "Nightly import",
          kind: "approval",
          prompt: "Delete the 214 rows that failed validation?",
          detail: "DELETE FROM imports WHERE status = 'invalid'",
          waitingSeconds: 640,
        },
        {
          id: "2",
          thread: "Onboarding emails",
          kind: "question",
          prompt: "Should the second email go out after 2 days or 5?",
          options: ["2 days", "5 days"],
          waitingSeconds: 45,
        },
      ]}
    />
  )
}
