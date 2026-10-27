"use client"

import { HumanHandoff } from "@/registry/aiellie/components/human-handoff"

export default function Unavailable() {
  return (
    <HumanHandoff
      state="unavailable"
      hours="Support is in from 9:00 to 17:00, Monday to Friday"
      onLeaveContact={(email) => console.log("Reach", email)}
    />
  )
}
