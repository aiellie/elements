import { CodeSnippet } from "@/registry/aiellie/components/code-snippet"

export default function CodeSnippetDemo() {
  return (
    <CodeSnippet
      command='shadcn@latest add "@aiellie/code-snippet"'
      className="max-w-md"
    />
  )
}
