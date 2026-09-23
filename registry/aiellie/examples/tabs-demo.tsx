import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/aiellie/ui/tabs"

const TABS = [
  {
    value: "preview",
    label: "Preview",
    body: "The rendered page, as whoever opens it will see it.",
  },
  {
    value: "code",
    label: "Code",
    body: "The source the agent wrote, ready to copy into your project.",
  },
  {
    value: "logs",
    label: "Logs",
    body: "Every step the agent took on the way, in the order it took them.",
  },
]

export default function TabsDemo() {
  return (
    <Tabs defaultValue="preview" className="w-full max-w-sm">
      <TabsList>
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="px-1 text-muted-foreground"
        >
          {tab.body}
        </TabsContent>
      ))}
    </Tabs>
  )
}
