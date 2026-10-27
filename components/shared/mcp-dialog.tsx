"use client"

import { McpServerIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/registry/aiellie/components/code-block"
import { CodeSnippet } from "@/registry/aiellie/components/code-snippet"
import { Button } from "@/registry/aiellie/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/aiellie/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/aiellie/ui/tabs"

const REGISTRY_CONFIG = `{
  "registries": {
    "@aiellie": "https://elements.aiellie.dev/r/{name}.json"
  }
}`

function serverConfig(key: string) {
  return `{
  "${key}": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}`
}

// What `shadcn mcp init --client <id>` writes for each client.
const CLIENTS = [
  {
    id: "claude",
    label: "Claude Code",
    path: ".mcp.json",
    language: "json",
    config: serverConfig("mcpServers"),
  },
  {
    id: "cursor",
    label: "Cursor",
    path: ".cursor/mcp.json",
    language: "json",
    config: serverConfig("mcpServers"),
  },
  {
    id: "vscode",
    label: "VS Code",
    path: ".vscode/mcp.json",
    language: "json",
    config: serverConfig("servers"),
  },
  {
    id: "codex",
    label: "Codex",
    path: "~/.codex/config.toml",
    language: "toml",
    config: `[mcp_servers.shadcn]
command = "npx"
args = ["shadcn@latest", "mcp"]`,
  },
]

const PROMPTS = [
  "Show me the components in the @aiellie registry",
  "Add the chat block from @aiellie",
  "Build a settings page with the @aiellie settings dialog",
]

function ConfigBlock({
  path,
  language,
  code,
}: {
  path: string
  language: string
  code: string
}) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{path}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopy code={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent code={code} language={language} />
    </CodeBlock>
  )
}

function Step({
  number,
  title,
  description,
  children,
}: {
  number: number
  title: string
  description: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex gap-3">
        <span
          aria-hidden
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[0.6875rem] text-muted-foreground tabular-nums"
        >
          {number}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-sm leading-5 font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-2 ps-8">{children}</div>
    </section>
  )
}

function McpDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" variant="ghost" />}>
        <HugeiconsIcon aria-hidden icon={McpServerIcon} />
        <span>MCP</span>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Use aiellie elements over MCP</DialogTitle>
          <DialogDescription>
            The shadcn MCP server lets your AI editor browse, search and install
            everything on this site.
          </DialogDescription>
        </DialogHeader>
        <Step
          number={1}
          title="Add the registry"
          description={
            <>
              Add the <code className="font-mono text-xs">@aiellie</code>{" "}
              namespace to your project&apos;s{" "}
              <code className="font-mono text-xs">components.json</code>.
            </>
          }
        >
          <ConfigBlock
            path="components.json"
            language="json"
            code={REGISTRY_CONFIG}
          />
        </Step>
        <Step
          number={2}
          title="Connect your client"
          description="Run this in your project, then restart the client and turn on the shadcn server."
        >
          <Tabs defaultValue={CLIENTS[0].id} className="min-w-0">
            <TabsList>
              {CLIENTS.map((client) => (
                <TabsTrigger key={client.id} value={client.id}>
                  {client.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {CLIENTS.map((client) => (
              <TabsContent
                key={client.id}
                value={client.id}
                className="flex min-w-0 flex-col gap-2"
              >
                <CodeSnippet
                  command={`shadcn@latest mcp init --client ${client.id}`}
                />
                <ConfigBlock
                  path={client.path}
                  language={client.language}
                  code={client.config}
                />
              </TabsContent>
            ))}
          </Tabs>
        </Step>
        <Step
          number={3}
          title="Ask for what you need"
          description="Name the registry in your prompt so the server looks there."
        >
          <ul className="flex flex-col gap-1">
            {PROMPTS.map((prompt) => (
              <li
                key={prompt}
                className="rounded-lg bg-muted px-3 py-1.5 text-sm text-foreground"
              >
                {prompt}
              </li>
            ))}
          </ul>
        </Step>
      </DialogContent>
    </Dialog>
  )
}

export { McpDialog }
