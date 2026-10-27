"use client"

import * as React from "react"
import { useSandpack } from "@codesandbox/sandpack-react"

import { SimpleSandbox } from "@/registry/aiellie/components/sandbox"

const APP = `import { useState } from "react"
import "./theme.css"
import "./styles.css"

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <section className="card">
        <p className="label">Pressed</p>
        <p className="count">{count}</p>
        <p className="hint">{count === 1 ? "time" : "times"} so far</p>
        <div className="actions">
          <button
            className="ghost"
            disabled={count === 0}
            onClick={() => setCount(0)}
          >
            Reset
          </button>
          <button onClick={() => setCount(count + 1)}>Press me</button>
        </div>
      </section>
    </main>
  )
}
`

const STYLES = `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font: 14px/1.5 ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

main {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
}

.label,
.hint {
  margin: 0;
  font-size: 12px;
  color: var(--muted-foreground);
}

.count {
  margin: 4px 0;
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.actions {
  display: flex;
  gap: 6px;
  margin-top: 16px;
}

button {
  height: 28px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: var(--foreground);
  color: var(--background);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: scale 150ms ease-out, opacity 150ms;
}

button:active {
  scale: 0.97;
}

button:focus-visible {
  outline: none;
  border-color: var(--muted-foreground);
}

button.ghost {
  background: transparent;
  color: var(--muted-foreground);
}

button.ghost:hover {
  background: var(--muted);
  color: var(--foreground);
}

button:disabled {
  opacity: 0.5;
  pointer-events: none;
}
`

// The page's light or dark values, written into the sandbox, since its frame
// can't see the page's `dark` class. Changing the `files` prop would reset
// every file, so the theme goes in through `updateFile` instead.
function theme(dark: boolean) {
  return dark
    ? `:root {
  --background: #0a0a0a;
  --foreground: #ededed;
  --muted: #1f1f1f;
  --muted-foreground: #a1a1a1;
  --border: #262626;
  color-scheme: dark;
}
`
    : `:root {
  --background: #ffffff;
  --foreground: #171717;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --border: #e5e5e5;
  color-scheme: light;
}
`
}

const FILES = {
  "/App.js": APP,
  "/styles.css": STYLES,
  "/theme.css": { code: theme(false), hidden: true },
}

function useDarkClass() {
  return React.useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })
      return () => observer.disconnect()
    },
    () => document.documentElement.classList.contains("dark"),
    () => false
  )
}

function FollowTheme() {
  const dark = useDarkClass()
  const { sandpack } = useSandpack()
  const current = sandpack.files["/theme.css"]?.code
  const { updateFile } = sandpack

  React.useEffect(() => {
    if (current !== theme(dark)) updateFile("/theme.css", theme(dark))
  }, [current, dark, updateFile])

  return null
}

export default function SandboxDemo() {
  return (
    <SimpleSandbox
      files={FILES}
      title="Counter"
      showSaveReset
      height="100%"
      className="max-h-96"
    >
      <FollowTheme />
    </SimpleSandbox>
  )
}
