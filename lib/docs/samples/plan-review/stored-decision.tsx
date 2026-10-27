import {
  PlanReview,
  type PlanDecision,
} from "@/registry/aiellie/components/plan-review"

const STEPS = [
  { id: "a", label: "Add a migration for the new column" },
  { id: "b", label: "Backfill it from the old one" },
  { id: "c", label: "Drop the old column" },
]

// What `onApprove` handed you, saved with the conversation.
const DECISION: PlanDecision = {
  steps: [
    { id: "a", label: "Add a migration for the new column" },
    { id: "b", label: "Backfill it in batches of 1,000" },
  ],
  removed: [{ id: "c", label: "Drop the old column" }],
  edits: { moved: [], rewritten: ["b"], added: [], removed: ["c"] },
}

export default function StoredDecision() {
  return <PlanReview steps={STEPS} state="approved" decision={DECISION} />
}
