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

  // kundli form states
  const [form, setForm] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: "",
    question: "",
  })
  const [loading, setLoading] = useState(false)
  const [kundliSummary, setKundliSummary] = useState("")

  const hasBalance = useMemo(() => (balance ?? 0) > 0, [balance])
  const isLowForThisRate = useMemo(() => (balance ?? 0) < rate, [balance, rate])
  const canStart = useMemo(() => (balance ?? 0) >= rate, [balance, rate])

  // === handle kundli form submission ===
  const handleFormSubmit = async () => {
    if (!form.name || !form.dob || !form.tob || !form.pob || !form.question) {
      alert("Please fill all the details before starting.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/kundli_full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data?.success) {
        const summary = data?.summary_for_agent || data?.kundli_prediction?.prediction || "Kundli data generated"
        setKundliSummary(summary)

        // Automatically start ElevenLabs session with kundli context
        if (window.startElevenLabsCall) {
          window.startElevenLabsCall(summary)
        } else {
          console.warn("startElevenLabsCall() not found — check ElevenLabs init")
          setCallActive(true) // fallback
        }
      } else {
        alert("Failed to generate Kundli. Please try again.")
      }
    } catch (err) {
      console.error("Form Submit Error:", err)
      alert("Something went wrong while fetching Kundli data.")
    } finally {
      setLoading(false)
    }
  }

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

      {/* Kundli Form Section */}
      <div className="bg-white shadow-sm border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-primary">🔮 Kundli Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name"
            className="border rounded-md p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Date of Birth (YYYY-MM-DD)"
            className="border rounded-md p-2"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />
          <input
            type="text"
            placeholder="Time of Birth (HH:MM)"
            className="border rounded-md p-2"
            value={form.tob}
            onChange={(e) => setForm({ ...form, tob: e.target.value })}
          />
          <input
            type="text"
            placeholder="Place of Birth"
            className="border rounded-md p-2"
            value={form.pob}
            onChange={(e) => setForm({ ...form, pob: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Your Question (e.g. Career, Marriage, Health...)"
          className="border rounded-md p-2 mt-3 w-full"
          rows={2}
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        ></textarea>

        <button
          onClick={handleFormSubmit}
          className="bg-primary text-white px-5 py-2 rounded-md mt-4 hover:opacity-90"
          disabled={loading}
        >
          {loading ? "⏳ Generating Kundli..." : "✨ Start Kundli Voice Call"}
        </button>

        {kundliSummary && (
          <div className="mt-3 bg-muted rounded-md p-3 text-sm text-muted-foreground">
            <strong>Kundli Summary:</strong> {kundliSummary}
          </div>
        )}
      </div>

      {/* Wallet and balance info */}
      {isLowForThisRate && (
        <div className="rounded-md border p-4">
          <p className="text-sm">
            Your balance is lower than ₹{rate}. You need at least ₹{rate} to start this session.
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
                Add ₹{Math.ceil(amt)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timer & ElevenLabs */}
      <SessionTimer
        pricePerMinute={rate}
        disabled={!canStart}
        onStart={() => {
          setStartBalance(balance ?? 0)
          if (params.type === "call") {
            setCallActive(true)
          }
        }}
        onTick={() => {
          const ok = deductPerMinute(rate / 60)
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
          <p className="text-sm text-muted-foreground mb-2">This is a demo chat area.</p>
          <div className="rounded-md bg-muted p-3 text-sm">Example: Hello, how can I assist you today?</div>
        </div>
      ) : (
        <ElevenLabsWebRTC
          active={callActive && !ended}
          agentId="agent_4201k5ttey26eexaz3cbwfb7s9dy"
          className="rounded-lg border"
          onError={(e) => {
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
