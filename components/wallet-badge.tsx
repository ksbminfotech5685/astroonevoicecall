"use client"

import useSWR from "swr"
import { getWallet } from "@/lib/wallet"
import Link from "next/link"

export default function WalletBadge() {
  const { data: balance } = useSWR("wallet", getWallet, { fallbackData: 0 })
  return (
    <Link
      href="/wallet"
      className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
      aria-label="View wallet balance"
    >
      <span className="opacity-70">₹</span>
      <span className="font-medium">{(balance ?? 0).toFixed(2)}</span>
    </Link>
  )
}
