import { jsonSchema, tool } from "ai"

import type {
  PlanDecision,
  PlanStep,
} from "@/registry/aiellie/components/plan-review"

const PLAN_TOOL = "propose_plan"

const PLAN_INSTRUCTIONS = `When the person asks for work that takes several steps, like building, changing, migrating or researching something, call ${PLAN_TOOL} with the steps first and do nothing else in that reply. The person can reorder, rewrite, remove and add steps, then approve the plan or send it back with a note. Once they approve, carry out the approved steps in their order, and mention anything they removed only to leave it out. If they send it back, propose a new plan that follows their note. Answer questions and small requests directly, without a plan.`

type PlanInput = { title?: string; steps: PlanStep[] }

/** What the person decided, as the model gets it back and the chat keeps it. */
type PlanOutput =
  | { state: "approved" | "revising"; decision: PlanDecision; note?: string }
  /** They wrote something else instead of deciding. */
  | { state: "unanswered" }

// No `execute`: the plan waits in the thread until the person decides, and
// their decision goes back as the tool's output.
const planTool = tool({
  description:
    "Propose a plan of steps for the person to review before any of it is done. Each step is one short action, written as an instruction.",
  inputSchema: jsonSchema<PlanInput>({
    type: "object",
    properties: {
      title: { type: "string", description: "A few words naming the plan." },
      steps: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Short and unique, like s1." },
            label: { type: "string" },
          },
          required: ["id", "label"],
        },
      },
    },
    required: ["steps"],
  }),
})

// While the input streams in, its last step can be half written, so only the
// steps with a label so far are kept.
function planStepsOf(input: unknown): PlanStep[] {
  const steps = (input as Partial<PlanInput> | undefined)?.steps
  if (!Array.isArray(steps)) return []
  // Steps are keyed by id, so one a model repeats gets one of its own.
  const seen = new Set<string>()
  return steps.flatMap((step, index) => {
    if (!step || typeof step.label !== "string" || !step.label.trim()) return []
    let id = String(step.id ?? `s${index + 1}`)
    if (seen.has(id)) id = `${id}-${index + 1}`
    seen.add(id)
    return [{ id, label: step.label }]
  })
}

export { PLAN_INSTRUCTIONS, PLAN_TOOL, planStepsOf, planTool }
export type { PlanInput, PlanOutput }
