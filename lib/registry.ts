import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"
import { AiBrain01Icon, Hold05Icon } from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import registry from "@/registry.json"

const REGISTRY_ICONS = {
  AiBrain01Icon,
  Hold05Icon,
} satisfies Record<string, IconSvgElement>

type RegistryItemType = (typeof registry.items)[number]["type"]

type RegistryFile = {
  path: string
  type: string
  target: string
  content: string
}

type RegistryItem = {
  name: string
  type: RegistryItemType
  title: string
  description: string
  icon?: IconSvgElement
  files: RegistryFile[]
}

type RegistryFileTree = {
  name: string
  path?: string
  children?: RegistryFileTree[]
}

function registrySourcePath(filePath: string) {
  if (filePath === "app/globals.css") {
    return path.join(process.cwd(), "app", "globals.css")
  }

  if (filePath.startsWith("registry/")) {
    return path.join(
      process.cwd(),
      "registry",
      filePath.slice("registry/".length)
    )
  }

  throw new Error(`Unsupported registry source path: ${filePath}`)
}

function getRegistryItemNames(type?: RegistryItemType) {
  return registry.items
    .filter((item) => !type || item.type === type)
    .map((item) => item.name)
}

async function getRegistryItem(name: string): Promise<RegistryItem | null> {
  const item = registry.items.find((candidate) => candidate.name === name)
  if (!item || !("files" in item)) return null

  const meta = "meta" in item ? item.meta : null
  const iconName = meta && "icon" in meta ? meta.icon : null

  const files = await Promise.all(
    item.files.map(async (file) => ({
      path: file.path,
      type: file.type,
      target: "target" in file && file.target ? file.target : file.path,
      content: await readFile(registrySourcePath(file.path), "utf8"),
    }))
  )

  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    icon:
      typeof iconName === "string" && iconName in REGISTRY_ICONS
        ? REGISTRY_ICONS[iconName as keyof typeof REGISTRY_ICONS]
        : undefined,
    files,
  }
}

function createRegistryFileTree(files: RegistryFile[]): RegistryFileTree[] {
  const roots: RegistryFileTree[] = []

  for (const file of files) {
    const segments = file.target.split("/").filter(Boolean)
    let level = roots

    segments.forEach((segment, index) => {
      const isFile = index === segments.length - 1
      let node = level.find((candidate) => candidate.name === segment)

      if (!node) {
        node = isFile
          ? { name: segment, path: file.target }
          : { name: segment, children: [] }
        level.push(node)
      }

      if (!isFile) {
        node.children ??= []
        level = node.children
      }
    })
  }

  return roots
}

export { createRegistryFileTree, getRegistryItem, getRegistryItemNames }
export type { RegistryFile, RegistryFileTree, RegistryItem, RegistryItemType }
