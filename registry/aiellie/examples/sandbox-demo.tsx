"use client"

import { SimpleSandbox } from "@/registry/aiellie/components/sandbox"

const FILES = {
  "/App.js": `import { useState } from "react"
import "./styles.css"

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <p>Pressed {count} {count === 1 ? "time" : "times"}</p>
      <button onClick={() => setCount(count + 1)}>Press me</button>
    </main>
  )
}
`,
  "/styles.css": `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

main {
  display: grid;
  place-items: center;
  gap: 12px;
  min-height: 100vh;
}

button {
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: #18181b;
  color: white;
  font: inherit;
}
`,
}

export default function SandboxDemo() {
  return (
    <SimpleSandbox
      files={FILES}
      title="Counter"
      showSaveReset
      height="100%"
      className="max-h-96"
    />
  )
}
