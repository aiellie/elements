import { RunBudget } from "@/registry/aiellie/components/run-budget"

export default function NoActions() {
  return (
    <RunBudget
      state="stopped"
      limit={5}
      spent={5.12}
      turns={38}
      elapsedSeconds={214}
      kept={[
        { label: "Pages translated", value: "41 of 60" },
        { label: "Glossary terms", value: "128" },
      ]}
    />
  )
}
