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

  // The starter copies this file, and the chat item installs the same one.
  if (filePath === "packages/cli/template/.env.example") {
    return path.join(process.cwd(), "packages/cli/template/.env.example")
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

function registryDependencyNames(name: string) {
  const names: string[] = []
  const queue = [name]

  for (let current = queue.shift(); current; current = queue.shift()) {
    if (names.includes(current)) continue
    names.push(current)

    const item = registry.items.find((candidate) => candidate.name === current)
    const dependencies: string[] =
      (item && "registryDependencies" in item && item.registryDependencies) ||
      []
    for (const dependency of dependencies) {
      if (dependency.startsWith("@aiellie/")) {
        queue.push(dependency.slice("@aiellie/".length))
      }
    }
  }

  return names
}

// Every file `shadcn add` writes for the item, its own first, with imports
// pointed at where each registry file lands, the way the CLI rewrites them.
async function getRegistryInstallFiles(name: string) {
  const items = await Promise.all(
    registryDependencyNames(name).map((itemName) => getRegistryItem(itemName))
  )
  const files = items.flatMap((item) => item?.files ?? [])
  const targets = new Map(
    files.map((file) => [
      stripExtension(file.path),
      stripExtension(file.target),
    ])
  )

  return files
    .filter(
      (file, index) =>
        files.findIndex((other) => other.target === file.target) === index
    )
    .map((file) => ({
      ...file,
      content: file.content.replace(
        /(["'])@\/(registry\/aiellie\/[^"']+)\1/g,
        (match, quote: string, importPath: string) => {
          const target = targets.get(importPath)
          return target ? `${quote}@/${target}${quote}` : match
        }
      ),
    }))
}

function stripExtension(filePath: string) {
  return filePath.replace(/\.(tsx?|css)$/, "")
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

  return sortRegistryFileTree(roots)
}

function sortRegistryFileTree(nodes: RegistryFileTree[]): RegistryFileTree[] {
  return nodes
    .map((node) =>
      node.children
        ? { ...node, children: sortRegistryFileTree(node.children) }
        : node
    )
    .sort(
      (a, b) =>
        Number(!a.children) - Number(!b.children) ||
        a.name.localeCompare(b.name)
    )
}

export {
  createRegistryFileTree,
  getRegistryInstallFiles,
  getRegistryItem,
  getRegistryItemNames,
}
export type { RegistryFile, RegistryFileTree, RegistryItem, RegistryItemType }
