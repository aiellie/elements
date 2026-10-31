import { BlockViewer } from "@/components/pages/block-viewer"
import { highlightCode } from "@/lib/highlight-code"
import {
  createRegistryFileTree,
  getRegistryInstallFiles,
  getRegistryItem,
  type RegistryFile,
} from "@/lib/registry"

function languageFor(file: RegistryFile) {
  const name = file.path.split("/").pop() ?? file.path
  if (name === ".env" || name.startsWith(".env.")) return "dotenv"
  const extension = name.split(".").pop()
  return extension === "ts" ? "typescript" : (extension ?? "text")
}

async function BlockDisplay({ name }: { name: string }) {
  const item = await getRegistryItem(name)
  if (!item || item.type !== "registry:block") return null

  const files = await getRegistryInstallFiles(name)
  const tree = createRegistryFileTree(files)
  const highlightedFiles = await Promise.all(
    files.map(async (file) => ({
      ...file,
      highlightedContent: await highlightCode(file.content, languageFor(file)),
    }))
  )

  return (
    <BlockViewer
      item={{
        name: item.name,
        title: item.title,
        description: item.description,
        icon: item.icon,
      }}
      tree={tree}
      highlightedFiles={highlightedFiles}
    />
  )
}

export { BlockDisplay }
