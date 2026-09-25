import { codeIcons } from "@/registry/aiellie/icons/code-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { FileIcon } from "@hugeicons/core-free-icons"
export function getIconForLanguageExtension(language: string) {
    switch (language) {
      case "json":
        return <codeIcons.json />
      case "css":
        return <codeIcons.css className="fill-foreground" />
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "typescript":
        return <codeIcons.ts className="fill-foreground" />
      default:
        return <HugeiconsIcon icon={FileIcon} />
    }
  }