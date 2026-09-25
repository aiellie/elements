import { BlockViewer } from "@/components/pages/block-viewer"
import { highlightCode } from "@/lib/highlight-code"
import {
  createRegistryFileTree,
  getRegistryItem,
  type RegistryFile,
} from "@/lib/registry"

function languageFor(file: RegistryFile) {
  const extension = file.path.split(".").pop()
  return extension === "ts" ? "typescript" : (extension ?? "text")
}

async function BlockDisplay({ name }: { name: string }) {
  const item = await getRegistryItem(name)
  if (!item || item.type !== "registry:block") return null

  const tree = createRegistryFileTree(item.files)
  const highlightedFiles = await Promise.all(
    item.files.map(async (file) => ({
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
      }}
      tree={tree}
      highlightedFiles={highlightedFiles}
    />
  )
}

export { BlockDisplay }
