"use client"

import { useState } from "react"
import useSWR from "swr"
import { getWallet, getTransactions, addFunds, recordRecharge, type WalletTransaction } from "@/lib/wallet"
import RechargeDialog from "@/components/recharge-dialog"

export default function WalletPage() {
  const { data: balance, mutate } = useSWR("wallet", getWallet, { fallbackData: 0 })
  const { data: txs } = useSWR<WalletTransaction[]>("wallet_txs", getTransactions, { fallbackData: [] })
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(199)

  const handleAddTestFunds = () => {
    addFunds(1000)
    recordRecharge(1000, "success", { mode: "test" })
    mutate()
  }

  return (
    <div className="px-4 py-8 md:px-8 mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Wallet</h1>
      <div className="rounded-lg border p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-semibold">₹{balance?.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center rounded-md bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700"
            onClick={handleAddTestFunds}
          >
            Add ₹1000 (Test)
          </button>
          <button
            className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm"
            onClick={() => setOpen(true)}
          >
            Recharge
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Quick Plans</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[99, 199, 499, 999, 1499, 1999].map((amt) => (
            <button
              key={amt}
              className="rounded-lg border p-4 text-center hover:bg-accent"
              onClick={() => {
                setAmount(amt)
                setOpen(true)
              }}
              aria-label={`Recharge ₹${amt}`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Transaction History</h2>
        <div className="rounded-lg border divide-y">
          {(txs ?? []).length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No transactions yet.</div>
          ) : (
            (txs ?? []).map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm">
                    {tx.type === "recharge" ? "Recharge" : tx.type === "deduction" ? "Session deduction" : "Adjustment"}
                    {tx.meta?.expertName ? ` • ${tx.meta.expertName}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString()} • {tx.status}
                    {tx.meta?.mode ? ` • ${tx.meta.mode}` : ""}
                  </p>
                </div>
                <div className={`text-sm font-medium ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {tx.amount >= 0 ? "+" : ""}₹{Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <RechargeDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) mutate()
        }}
        onSuccess={() => mutate()}
        amount={amount}
        onAmountChange={(v) => setAmount(v)}
      />
    </div>
  )
}
