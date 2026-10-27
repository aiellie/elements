import { CodeSnippet } from "@/registry/aiellie/components/code-snippet"

export default function NoTabs() {
  return (
    <CodeSnippet
      managers={[]}
      command="git clone https://github.com/aiellie/elements.git"
      className="max-w-md"
    />
  )
}
