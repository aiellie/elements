/** The panels the shell puts around the page, and the keys that toggle them. */
const PANELS = [
  { name: "Left panel", keys: ["⌘", "B"] },
  { name: "Right panel", keys: ["⌘", "I"] },
  { name: "Bottom panel", keys: ["⌘", "J"] },
]

/**
 * What fills the main panel, with `layout.tsx` putting the shell around it.
 * It is here to be replaced: render your own page in its place and the panels
 * stay as they are.
 */
export default function PanelsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex max-w-sm flex-col gap-2">
        <h1 className="text-xl font-light tracking-tight">
          Your page goes here
        </h1>
        <p className="text-sm text-muted-foreground">
          Open a panel with the toggles in the header, or from the keyboard.
          Drag the edge between two panels to resize them.
        </p>
      </div>
      <ul className="flex w-full max-w-60 flex-col gap-1 text-sm">
        {PANELS.map((panel) => (
          <li
            key={panel.name}
            className="flex h-8 items-center justify-between gap-2 px-2"
          >
            {panel.name}
            <span className="flex gap-1">
              {panel.keys.map((key) => (
                <kbd
                  key={key}
                  className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-muted px-1 font-mono text-xs font-medium text-muted-foreground"
                >
                  {key}
                </kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
