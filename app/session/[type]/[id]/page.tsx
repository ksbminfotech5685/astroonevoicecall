"use client"

import { useRouter } from "next/navigation"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { getExpertById } from "@/components/data/experts"
import { getWallet, deductPerMinute, addFunds, recordDeduction } from "@/lib/wallet"
import SessionTimer from "@/components/session-timer"
import RatingDialog from "@/components/rating-dialog"
import ElevenLabsWebRTC from "@/components/elevenlabs-webrtc"

type Params = { params: { type: "chat" | "call"; id: string } }

export default function SessionPage({ params }: Params) {
  const router = useRouter()
  const expert = getExpertById(params.id)
  const rate = expert ? (params.type === "chat" ? expert.pricePerMinChat : expert.pricePerMinCall) : 0

  const { data: balance, mutate } = useSWR("wallet", getWallet, { fallbackData: 0 })
  const [ended, setEnded] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [callActive, setCallActive] = useState(false)
  const [startBalance, setStartBalance] = useState<number | null>(null)

  const hasBalance = useMemo(() => (balance ?? 0) > 0, [balance])
  const isLowForThisRate = useMemo(() => (balance ?? 0) < rate, [balance, rate])
  const canStart = useMemo(() => (balance ?? 0) >= rate, [balance, rate])

  if (!expert) {
    return (
      <div className="px-4 py-6 md:px-8 mx-auto max-w-3xl space-y-4">
        <h1 className="text-xl font-semibold">Expert not found</h1>
        <p className="text-sm text-muted-foreground">Please check the ID or go back to Home.</p>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-2 text-sm" onClick={() => router.back()}>
            Go back
          </button>
          <a href="/" className="rounded-md bg-secondary text-secondary-foreground px-3 py-2 text-sm">
            Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-8 mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {params.type === "chat" ? "Chat Session" : "Call Session"} • {expert.name}
        </h1>
        <p className="text-sm text-muted-foreground">Balance: ₹{balance?.toFixed(2)}</p>
      </div>

      {/* Show a low balance warning, but don't block starting the session */}
      {isLowForThisRate && (
        <div className="rounded-md border p-4">
          <p className="text-sm">
            Your balance is lower than the per-minute rate (₹{rate}). You need at least ₹{rate} to start this session.
          </p>
          <div className="mt-3 flex gap-2">
            {[rate, rate * 3, 999].map((amt, i) => (
              <button
                key={i}
                className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm"
                onClick={() => {
                  addFunds(Math.ceil(amt))
                  mutate()
                }}
              >
                Add now • ₹{Math.ceil(amt)}
              </button>
            ))}
          </div>
        </div>
      )}

      <SessionTimer
        pricePerMinute={rate}
        disabled={!canStart}
        onStart={() => {
          // console.log("[v0] SessionTimer onStart fired. type:", params.type)
          setStartBalance(balance ?? 0)
          if (params.type === "call") {
            setCallActive(true)
          }
        }}
        onTick={() => {
          const ok = deductPerMinute(rate / 60) // per second deduction
          mutate()
          if (!ok) {
            setCallActive(false)
            setEnded(true)
            setShowRating(true)
          }
        }}
        onEnd={(elapsedSeconds) => {
          setCallActive(false)
          setEnded(true)
          setShowRating(true)
          const endBal = balance ?? 0
          const started = startBalance ?? endBal
          const spent = Math.max(0, Math.round((started - endBal) * 100) / 100)
          if (spent > 0) {
            recordDeduction(spent, {
              mode: params.type,
              expertId: expert.id,
              expertName: expert.name,
              elapsedSeconds,
              ratePerMin: rate,
            })
          }
        }}
        lowBalance={(balance ?? 0) < rate * 2}
        onQuickAdd={(amt) => {
          addFunds(amt)
          mutate()
        }}
      />

      {params.type === "chat" ? (
        <div className="rounded-lg border p-4 min-h-48">
          <p className="text-sm text-muted-foreground mb-2">This is a demo chat area (placeholder).</p>
          <div className="rounded-md bg-muted p-3 text-sm">Example: Hello, how can I assist you today?</div>
        </div>
      ) : (
        <ElevenLabsWebRTC
          active={callActive && !ended}
          agentId="agent_4201k5ttey26eexaz3cbwfb7s9dy"
          className="rounded-lg border"
          onError={(e) => {
            // Optional: surface error to user or toast
            console.log("[v0] ElevenLabs onError:", e.message)
          }}
        />
      )}

      <div className="flex justify-between">
        <button className="rounded-md border px-3 py-2 text-sm" onClick={() => router.back()}>
          Leave session
        </button>
        <button
          className="rounded-md bg-secondary text-secondary-foreground px-3 py-2 text-sm"
          onClick={() => {
            setCallActive(false)
            setEnded(true)
            setShowRating(true)
          }}
        >
          End Session
        </button>
      </div>

      <RatingDialog
        open={showRating}
        onOpenChange={setShowRating}
        expertName={expert.name}
        onSubmit={() => {
          setShowRating(false)
          router.push(`/experts/${expert.id}`)
        }}
      />
    </div>
  )
}
