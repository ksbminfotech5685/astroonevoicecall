"use client"

import { useEffect, useMemo, useState } from "react"
import { addFunds, recordRecharge } from "@/lib/wallet"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess?: () => void
  amount: number
  onAmountChange: (v: number) => void
}

declare global {
  interface Window {
    Razorpay?: any
  }
}

function useRazorpayScript(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    if (window.Razorpay) return
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.async = true
    document.body.appendChild(s)
    return () => {
      document.body.removeChild(s)
    }
  }, [ready])
}

export default function RechargeDialog({ open, onOpenChange, onSuccess, amount, onAmountChange }: Props) {
  const [keyId, setKeyId] = useState<string | null>(null)
  const [loadingKey, setLoadingKey] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loadingOrder, setLoadingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const amt = Math.max(10, Math.floor(amount))
  const effectiveKey = useMemo(() => keyId || "rzp_test_1DP5mmOlF5G5ag", [keyId])

  useRazorpayScript(open)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    ;(async () => {
      try {
        setLoadingKey(true)
        setError(null)
        const res = await fetch("/api/pay/config")
        const data = (await res.json()) as { key?: string }
        if (!cancelled) setKeyId(data?.key || null)
      } catch (err) {
        console.error("[v0] Failed to fetch key:", err)
        if (!cancelled) {
          setKeyId(null)
          setError("Failed to load payment config")
        }
      } finally {
        if (!cancelled) setLoadingKey(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open || !amt) return
    let cancelled = false
    ;(async () => {
      try {
        setLoadingOrder(true)
        setError(null)
        const res = await fetch("/api/pay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amt }),
        })
        const data = (await res.json()) as { orderId?: string; error?: string }
        if (!cancelled) {
          if (data.error) {
            setError(data.error)
            setOrderId(null)
          } else {
            setOrderId(data.orderId || null)
          }
        }
      } catch (err) {
        console.error("[v0] Failed to create order:", err)
        if (!cancelled) {
          setError("Failed to create payment order")
          setOrderId(null)
        }
      } finally {
        if (!cancelled) setLoadingOrder(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, amt])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div className="w-full max-w-sm rounded-lg border bg-background p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Recharge Wallet</h3>
          <button
            aria-label="Close dialog"
            onClick={() => onOpenChange(false)}
            className="text-sm text-muted-foreground hover:underline"
          >
            Close
          </button>
        </div>

        {error && <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded">{error}</div>}

        <label className="text-sm">Amount (₹)</label>
        <input
          type="number"
          min={10}
          step={1}
          value={amt}
          onChange={(e) => onAmountChange(Number(e.target.value))}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[199, 499, 999].map((a) => (
            <button
              key={a}
              className="rounded-md border px-3 py-2 text-sm hover:bg-accent"
              onClick={() => onAmountChange(a)}
            >
              ₹{a}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded-md border px-3 py-2 text-sm" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm disabled:opacity-50"
            disabled={loadingKey || loadingOrder || !window.Razorpay || !orderId || !!error}
            onClick={() => {
              if (!window.Razorpay) {
                setError("Payment SDK not ready. Please try again in a moment.")
                return
              }
              if (!orderId) {
                setError("Failed to create payment order. Please try again.")
                return
              }
              try {
                const options = {
                  key: effectiveKey,
                  order_id: orderId,
                  amount: amt * 100,
                  currency: "INR",
                  name: "ksbm astro",
                  description: "Wallet recharge",
                  handler: (resp: any) => {
                    console.log("[v0] Payment successful:", resp)
                    addFunds(amt)
                    recordRecharge(amt, "success", {
                      provider: "razorpay",
                      payment_id: resp?.razorpay_payment_id,
                      order_id: resp?.razorpay_order_id,
                      signature: resp?.razorpay_signature,
                    })
                    onSuccess?.()
                    onOpenChange(false)
                  },
                  prefill: {
                    name: "ksbm astro user",
                    email: "user@example.com",
                  },
                  theme: { color: "#111827" },
                }
                const rzp = new window.Razorpay(options)
                rzp.on?.("payment.failed", (resp: any) => {
                  console.error("[v0] Payment failed:", resp)
                  recordRecharge(amt, "failed", {
                    provider: "razorpay",
                    code: resp?.error?.code,
                    description: resp?.error?.description,
                  })
                  setError("Payment failed. No funds were added.")
                })
                rzp.open()
              } catch (e) {
                console.error("[v0] Checkout error:", e)
                recordRecharge(amt, "failed", { error: (e as Error)?.message })
                setError("Something went wrong while opening payment.")
              }
            }}
          >
            {loadingKey || loadingOrder ? "Loading…" : "Pay"}
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Note: This uses Razorpay Test Checkout. For production, add RAZORPAY_SECRET_KEY to create real orders and
          verify signatures.
        </p>
      </div>
    </div>
  )
}
