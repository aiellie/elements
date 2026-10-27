import { Reactions } from "@/registry/aiellie/components/reactions"

export default function WhoReacted() {
  return (
    <Reactions
      reactions={[
        { emoji: "🎉", count: 3, reacted: true, people: ["Ada", "Grace"] },
        { emoji: "👀", count: 1, people: ["Linus"] },
      ]}
    />
  )
}
