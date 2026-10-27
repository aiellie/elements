import {
  AgentStep,
  AgentStepDetail,
  AgentSteps,
  AgentStepsContent,
  AgentStepsTrigger,
} from "@/registry/aiellie/components/agent-steps"

export default function Failed() {
  return (
    <AgentSteps defaultOpen duration={34}>
      <AgentStepsTrigger />
      <AgentStepsContent>
        <AgentStep label="Installed dependencies" />
        <AgentStep label="Ran the test suite" status="error">
          <AgentStepDetail>
            2 of 48 tests failed in auth.test.ts.
          </AgentStepDetail>
        </AgentStep>
        <AgentStep label="Open a pull request" status="pending" />
      </AgentStepsContent>
    </AgentSteps>
  )
}
