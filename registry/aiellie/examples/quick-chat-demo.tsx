"use client"

import * as React from "react"

import {
  ChatAttachments,
  type ChatAttachment,
} from "@/registry/aiellie/blocks/chat/components/chat-attachments"
import { ChatComposer } from "@/registry/aiellie/blocks/chat/components/chat-composer"
import {
  SAMPLE_BRANCHES,
  SAMPLE_PLUGINS,
  SAMPLE_PROJECTS,
} from "@/registry/aiellie/blocks/chat/components/chat-data"
import {
  QuickChat,
  type QuickChatMessage,
} from "@/registry/aiellie/components/quick-chat"
import { MODELS } from "@/registry/aiellie/lib/models"
import { Button } from "@/registry/aiellie/ui/button"

const INITIAL_MESSAGES: QuickChatMessage[] = [
  {
    id: "welcome",
    from: "assistant",
    content: "What can I help you work through?",
  },
]

export default function QuickChatDemo() {
  const [open, setOpen] = React.useState(true)
  const [messages, setMessages] =
    React.useState<QuickChatMessage[]>(INITIAL_MESSAGES)
  const [streaming, setStreaming] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [model, setModel] = React.useState(MODELS[0].id)
  const [project, setProject] = React.useState<string | null>(null)
  const [plugins, setPlugins] = React.useState<string[]>([])
  const [workIn, setWorkIn] = React.useState("local")
  const [branches, setBranches] = React.useState(SAMPLE_BRANCHES)
  const [branch, setBranch] = React.useState(SAMPLE_BRANCHES[0])
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const nextIdRef = React.useRef(0)

  const stop = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    setStreaming(false)
    setMessages((all) => all.filter((message) => !message.streaming))
  }, [])

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {!open ? (
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open quick chat
        </Button>
      ) : null}
      <QuickChat
        open={open}
        onOpenChange={setOpen}
        messages={messages}
        composer={
          <ChatComposer
            value={value}
            onValueChange={setValue}
            onSend={(content, attachments: ChatAttachment[]) => {
              const userId = `user-${++nextIdRef.current}`
              const replyId = `reply-${++nextIdRef.current}`
              setMessages((all) => [
                ...all,
                {
                  id: userId,
                  from: "user",
                  content,
                  attachments:
                    attachments.length > 0 ? (
                      <ChatAttachments attachments={attachments} size="xs" />
                    ) : undefined,
                },
                {
                  id: replyId,
                  from: "assistant",
                  content: "",
                  streaming: true,
                },
              ])
              setStreaming(true)
              timerRef.current = setTimeout(() => {
                setMessages((all) =>
                  all.map((message) =>
                    message.id === replyId
                      ? {
                          ...message,
                          content:
                            "Keep the quick task here, and your main conversation stays exactly where you left it.",
                          streaming: false,
                        }
                      : message
                  )
                )
                setStreaming(false)
                timerRef.current = null
              }, 900)
            }}
            onStop={stop}
            status={streaming ? "streaming" : "ready"}
            models={MODELS}
            model={model}
            onModelChange={setModel}
            projects={SAMPLE_PROJECTS}
            project={project}
            onProjectChange={setProject}
            plugins={SAMPLE_PLUGINS}
            activePlugins={plugins}
            onPluginsChange={setPlugins}
            workIn={workIn}
            onWorkInChange={setWorkIn}
            branches={branches}
            branch={branch}
            onBranchChange={setBranch}
            onBranchCreate={(name) => {
              setBranches((all) => [name, ...all])
              setBranch(name)
            }}
          />
        }
        autoFocus={false}
        className="absolute end-0 bottom-0 sm:h-80 sm:w-80"
      />
    </div>
  )
}
