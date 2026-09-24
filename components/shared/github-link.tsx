import Link from "next/link"

import { GithubIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { GITHUB_URL } from "@/lib/constants"
import { Button } from "@/registry/aiellie/ui/button"

export function GitHubLink() {
  return (
    <Button
      size="sm"
      variant="ghost"
      nativeButton={false}
      render={<Link href={GITHUB_URL} target="_blank" rel="noreferrer" />}
    >
      <HugeiconsIcon aria-hidden icon={GithubIcon} />
    <span >GitHub</span>
    </Button>
  )
}
