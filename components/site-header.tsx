"use client"

import Link from "next/link"
import WalletBadge from "@/components/wallet-badge"

export default function SiteHeader() {
  return (
    <header className="h-16 border-b bg-background">
      <div className="h-full mx-auto max-w-6xl px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          ksbm astro
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            Home
          </Link>
          <Link href="/wallet" className="text-sm text-muted-foreground hover:underline">
            Wallet
          </Link>
          <WalletBadge />
        </nav>
      </div>
    </header>
  )
}
