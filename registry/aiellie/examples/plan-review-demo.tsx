"use client";

import { useState } from "react";
import {
  PlanReview,
  type PlanDecision,
  type PlanReviewState,
} from "@/registry/aiellie/components/plan-review";

const STEPS = [
  { id: "read", label: "Read the webhook handler and its tests" },
  { id: "patch", label: "Patch the retry loop" },
  { id: "changelog", label: "Update the changelog" },
  { id: "test", label: "Add a regression test for retries" },
];

export default function PlanReviewDemo() {
  const [state, setState] = useState<PlanReviewState>("review");
  const [decision, setDecision] = useState<PlanDecision>();

  return (
    <PlanReview
      steps={STEPS}
      state={state}
      decision={decision}
      onApprove={(next) => {
        setDecision(next);
        setState("approved");
      }}
      onRevise={(note, next) => {
        setDecision(next);
        setState("revising");
      }}
    />
  );
}