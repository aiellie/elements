"use client"

import { useEffect, useState } from "react"
import {
  CodeSnippet,
  type PackageManager,
} from "@/components/aiellie/code-snippet"
const CONFIRMED_MS = 1600


const BARE =
  "npx aiellie init"

function useCopied() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), CONFIRMED_MS)
    return () => clearTimeout(id)
  }, [copied])

  return { copied, onCopy: () => setCopied(true) }
}
function useInstall() {
  const copy = useCopied()
  const [manager, setManager] = useState<PackageManager>("npm")

  return { ...copy, manager, onManagerChange: setManager }
}

export function InitSnippet() {
  const state = useCopied()
  return <CodeSnippet className="w-fit" command={BARE} {...state} />
}