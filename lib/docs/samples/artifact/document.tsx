import { Note01Icon, Share08Icon } from "@hugeicons/core-free-icons"

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactContent,
  ArtifactHeader,
  ArtifactTitle,
} from "@/registry/aiellie/components/artifact"

export default function Document() {
  return (
    <Artifact className="max-w-md">
      <ArtifactHeader>
        <ArtifactTitle icon={Note01Icon} description="Edited just now">
          Launch checklist
        </ArtifactTitle>
        <ArtifactActions>
          <ArtifactAction tooltip="Share" icon={Share08Icon} />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent className="p-4 text-sm leading-6">
        <ol className="list-decimal ps-5">
          <li>Freeze the release branch</li>
          <li>Run the smoke tests on staging</li>
          <li>Post the changelog</li>
        </ol>
      </ArtifactContent>
    </Artifact>
  )
}
