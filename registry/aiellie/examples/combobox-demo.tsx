"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/aiellie/ui/combobox"

const TIMEZONES = [
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
]

export default function ComboboxDemo() {
  return (
    <Combobox items={TIMEZONES}>
      <ComboboxInput
        placeholder="Pick a time zone"
        aria-label="Time zone"
        className="w-64"
      />
      <ComboboxContent>
        <ComboboxEmpty>No time zones match</ComboboxEmpty>
        <ComboboxList>
          {(zone: string) => (
            <ComboboxItem key={zone} value={zone}>
              {zone.replace("_", " ")}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
