"use client"

import * as React from "react"
import { Mic01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/registry/aiellie/ui/menu"
import { TooltipIconButton } from "@/registry/aiellie/ui/tooltip-icon-button"

type MicDevice = { deviceId: string; label: string }

// Until the page has been allowed the microphone once, browsers list inputs
// with their names blanked, so those are numbered instead.
function useMicDevices() {
  const [devices, setDevices] = React.useState<MicDevice[]>([])
  const [named, setNamed] = React.useState(false)

  const refresh = React.useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return
    const inputs = (await navigator.mediaDevices.enumerateDevices()).filter(
      (device) => device.kind === "audioinput"
    )
    setNamed(inputs.some((device) => device.label))
    setDevices(
      inputs.map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${index + 1}`,
      }))
    )
  }, [])

  React.useEffect(() => {
    // Deferred so the effect itself sets no state.
    const first = setTimeout(() => void refresh(), 0)
    navigator.mediaDevices?.addEventListener("devicechange", refresh)
    return () => {
      clearTimeout(first)
      navigator.mediaDevices?.removeEventListener("devicechange", refresh)
    }
  }, [refresh])

  /** Opens the microphone just long enough for the browser to reveal the names. */
  const requestNames = React.useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
    } catch {
      // Declined, so the numbers stay.
    }
    await refresh()
  }, [refresh])

  return { devices, named, requestNames }
}

function MicMenu({
  value,
  onValueChange,
  label = "Microphone",
  side = "top",
  align = "start",
  className,
  ...props
}: Omit<React.ComponentProps<typeof TooltipIconButton>, "tooltip" | "value"> & {
  /** The chosen `deviceId`. Empty means the system default. */
  value: string
  onValueChange: (deviceId: string) => void
  label?: string
  align?: "start" | "center" | "end"
}) {
  const { devices, named, requestNames } = useMicDevices()
  const chosen = devices.find((device) => device.deviceId === value)
  const name = chosen?.label ?? "Default microphone"

  return (
    <Menu>
      <MenuTrigger
        data-slot="mic-menu"
        aria-label={`${label}: ${name}`}
        render={
          <TooltipIconButton
            tooltip={name}
            side={side}
            className={cn("size-7", className)}
            {...props}
          />
        }
      >
        <HugeiconsIcon aria-hidden icon={Mic01Icon} />
      </MenuTrigger>
      <MenuContent side={side} align={align} className="w-64">
        <MenuGroup>
          <MenuGroupLabel>{label}</MenuGroupLabel>
          {devices.length === 0 ? (
            <MenuItem disabled>No microphones found</MenuItem>
          ) : (
            <MenuRadioGroup
              value={value}
              onValueChange={(next: string) => onValueChange(next)}
            >
              {devices.map((device) => (
                <MenuRadioItem
                  key={device.deviceId}
                  value={device.deviceId}
                  closeOnClick
                >
                  <span className="truncate">{device.label}</span>
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          )}
          {!named && devices.length > 0 ? (
            <MenuItem closeOnClick={false} onClick={() => void requestNames()}>
              <span className="text-muted-foreground">
                Allow access to see names
              </span>
            </MenuItem>
          ) : null}
        </MenuGroup>
      </MenuContent>
    </Menu>
  )
}

export { MicMenu, useMicDevices }
export type { MicDevice }
