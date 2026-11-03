"use client"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/aiellie/ui/popover"
import { Status, StatusLabel } from "@/registry/aiellie/ui/status"
import audit from "@/lib/audit.json"

type Failure = { rule: string; file: string; line: number; text: string }

const RULES: Record<string, { section: string; title: string }> = audit.rules
const ITEMS: Record<string, { passed: boolean; failures: Failure[] }> =
  audit.items

// Groups an item's failures by the rule they break, in the checklist's order.
function byRule(failures: Failure[]) {
  const groups = new Map<string, Failure[]>()
  for (const rule of Object.keys(RULES)) {
    const found = failures.filter((failure) => failure.rule === rule)
    if (found.length) groups.set(rule, found)
  }
  return [...groups]
}

export function AuditStatus({ item }: { item: string }) {
  const result = ITEMS[item]
  if (!result) return null
  const checked = Object.keys(RULES).length
  const groups = byRule(result.failures)

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Status
            render={<button type="button" />}
            variant={result.passed ? "success" : "destructive"}
            className="cursor-pointer focus-visible:border-ring"
          />
        }
        aria-label={
          result.passed
            ? `Passed the design audit`
            : `Failed the design audit: ${groups.length} of ${checked} rules`
        }
      >
        <StatusLabel>
          {result.passed ? "Passed" : `Failed ${groups.length}`}
        </StatusLabel>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>
            {result.passed
              ? `Passes all ${checked} design rules`
              : `Breaks ${groups.length} of ${checked} design rules`}
          </PopoverTitle>
          <PopoverDescription className="text-xs text-foreground">
            Checked against the design skill’s checklist by{" "}
            <code className="font-mono text-[11px]">
              scripts/audit-design.mjs
            </code>
            .
          </PopoverDescription>
        </PopoverHeader>
        {groups.length ? (
          <ul className="-mx-2.5 -mb-2.5 flex max-h-72 flex-col gap-3 overflow-y-auto px-2.5 pb-2.5">
            {groups.map(([rule, failures]) => (
              <li key={rule} className="flex flex-col gap-1">
                <p className="text-xs font-medium">
                  <span className="text-destructive">
                    {RULES[rule].section}
                  </span>{" "}
                  · {RULES[rule].title}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {failures.slice(0, 4).map((failure, index) => (
                    <li
                      key={index}
                      className="truncate font-mono text-[11px] text-foreground"
                      title={`${failure.file}${failure.line ? `:${failure.line}` : ""} ${failure.text}`}
                    >
                      {failure.file.replace("registry/aiellie/", "")}
                      {failure.line ? `:${failure.line}` : ""} {failure.text}
                    </li>
                  ))}
                  {failures.length > 4 ? (
                    <li className="text-[11px] text-foreground">
                      and {failures.length - 4} more
                    </li>
                  ) : null}
                </ul>
              </li>
            ))}
          </ul>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
