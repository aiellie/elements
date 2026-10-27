"use client"

import * as React from "react"

import {
  AgentCursor,
  type DocBlock,
} from "@/registry/aiellie/components/agent-cursor"

const BLOCKS: DocBlock[] = [
  {
    id: "a",
    text: "We're moving the weekly sync to Thursdays at 10, starting next week.",
  },
  {
    id: "b",
    text: "The reason is that alot of people had clashes on Monday and it was hard to get everyone in the room at once.",
  },
  { id: "c", text: "Reply here if Thursday doesn't work for you." },
]

const REWRITE =
  "Mondays clashed for too many of you, so it was hard to get everyone in one room."

export default function AgentCursorDemo() {
  const [blocks, setBlocks] = React.useState(BLOCKS)
  const [target, setTarget] = React.useState<string | undefined>("b")
  const [draft, setDraft] = React.useState("")
  const [goal, setGoal] = React.useState(REWRITE)
  const [writing, setWriting] = React.useState(true)

  React.useEffect(() => {
    if (!writing) return
    if (draft.length >= goal.length) {
      const timer = setTimeout(() => setWriting(false), 0)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(
      () => setDraft(goal.slice(0, draft.length + 3)),
      45
    )
    return () => clearTimeout(timer)
  }, [writing, draft, goal])

  const finish = () => {
    setTarget(undefined)
    setDraft("")
    setWriting(false)
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <AgentCursor
        title="Team update"
        blocks={blocks}
        onBlocksChange={setBlocks}
        target={target}
        draft={draft}
        writing={writing}
        onKeepYours={finish}
        onUseAgent={(text) => {
          setBlocks((current) =>
            current.map((block) =>
              block.id === target ? { ...block, text } : block
            )
          )
          finish()
        }}
        onMerge={(yours) => {
          // Stands in for the agent: keeps what you typed after the original.
          const original =
            BLOCKS.find((block) => block.id === target)?.text ?? ""
          const added = yours.startsWith(original)
            ? yours.slice(original.length)
            : ""
          setDraft("")
          setGoal(REWRITE + added)
          setWriting(true)
        }}
      />
      {target ? (
        <p className="text-xs text-muted-foreground">
          Edit the highlighted paragraph while it writes to see a clash.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            setBlocks(BLOCKS)
            setGoal(REWRITE)
            setTarget("b")
            setWriting(true)
          }}
          className="cursor-pointer rounded-sm border border-transparent text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:border-ring"
        >
          Rewrite again
        </button>
      )}
    </div>
  )
}
