"use client"

import {
  CodeWorkspace,
  CodeWorkspacePanel,
  CodeWorkspaceSidebar,
  type CodeWorkspaceFile,
} from "@/registry/aiellie/components/code-workspace"

const FILES: CodeWorkspaceFile[] = [
  {
    path: "app/cart/page.tsx",
    content: `import { Cart } from "@/components/cart"
import { getCart } from "@/lib/cart"

export default async function CartPage() {
  const cart = await getCart()

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl">Your cart</h1>
      <Cart items={cart.items} />
    </main>
  )
}
`,
  },
  {
    path: "app/layout.tsx",
    content: `import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`,
  },
  {
    path: "components/cart.tsx",
    content: `import { formatPrice, totalPrice } from "@/lib/price"
import type { CartItem } from "@/lib/cart"

export function Cart({ items }: { items: CartItem[] }) {
  return (
    <ul className="divide-y">
      {items.map((item) => (
        <li key={item.id} className="flex justify-between py-3">
          <span>{item.name}</span>
          <span>{formatPrice(item.price * item.quantity)}</span>
        </li>
      ))}
      <li className="flex justify-between py-3 font-medium">
        <span>Total</span>
        <span>{formatPrice(totalPrice(items))}</span>
      </li>
    </ul>
  )
}
`,
  },
  {
    path: "lib/cart.ts",
    content: `export type CartItem = {
  id: string
  name: string
  /** In cents, as an integer. */
  price: number
  quantity: number
}

export async function getCart(): Promise<{ items: CartItem[] }> {
  const response = await fetch("/api/cart", { cache: "no-store" })
  return response.json()
}
`,
  },
  {
    path: "lib/price.ts",
    content: `import type { CartItem } from "./cart"

const TAX_RATE = 0.2

// Prices stay in cents until they're shown, so they never drift.
export function totalPrice(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  return Math.round(subtotal * (1 + TAX_RATE))
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(cents / 100)
}
`,
  },
  {
    path: "package.json",
    content: `{
  "name": "shop",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "16.0.0",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  }
}
`,
  },
]

export default function CodeWorkspaceDemo() {
  return (
    <CodeWorkspace
      files={FILES}
      defaultFile="lib/price.ts"
      className="h-full max-h-96"
    >
      <CodeWorkspaceSidebar
        title="shop"
        defaultScopes={["names", "contents"]}
      />
      <CodeWorkspacePanel />
    </CodeWorkspace>
  )
}
