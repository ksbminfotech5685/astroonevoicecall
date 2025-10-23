"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Message = { role: "user" | "assistant"; content: string }

const SUGGESTIONS: Record<string, string[]> = {
  love: ["Long-distance tips?", "Breakup ko kaise handle karein?", "Healthy relationship ke signs?"],
  business: ["Idea validate kaise karein?", "Pehle 10 customers kaise milein?", "Pricing kaise set karein?"],
  career: ["Resume improve tips?", "Salary expectations ka jawab?", "Career switch kaha se start karun?"],
  marriage: [
    "Disagreements ko respectfully kaise handle karein?",
    "Communication improve tips?",
    "Work–marriage balance?",
  ],
  legal: ["Civil vs criminal law?", "Contract basics kya hote hain?", "Arbitration kya hai?"],
  health: ["Sleep hygiene tips?", "Balanced diet basics?", "Beginner workout plan?"],
  finance: ["Investing kaise start karein?", "Emergency fund kitna?", "SIP vs lump sum?"],
  family: ["Family conflicts kaise solve karein?", "Parenting basics?", "Work–family balance?"],
  "mental-wellness": [
    "Anxiety manage kaise karein?",
    "Mindfulness basics?",
    "Emotional resilience build kaise karein?",
  ],
}

const PRICE_PM: Record<string, number> = {
  legal: 30,
  astrology: 25,
  tarot: 20,
  vastu: 22,
  health: 28,
  finance: 26,
  business: 24,
  career: 22,
  marriage: 23,
  family: 18,
  love: 18,
  "mental-wellness": 20,
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

type Props = {
  category: string
  className?: string
  minutes?: number
}

export default function CategoryChat({ category, className, minutes = 5 }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60)
  const intervalRef = useRef<number | null>(null)

  const lowerCat = category.toLowerCase()
  const suggestions = useMemo(() => SUGGESTIONS[lowerCat] ?? ["What should I ask?"], [lowerCat])
  const pricePerMinute = PRICE_PM[lowerCat] ?? 20

  useEffect(() => {
    if (!active) return
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current!)
          setActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [active])

  async function send() {
    const question = input.trim()
    if (!question || loading || !active) return
    const userMsg: Message = { role: "user", content: question }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: lowerCat, message: question, history: messages }),
      })
      const data = await res.json()
      const answer = (data?.answer as string) || "Sorry, I couldn't find anything useful."
      const assistant: Message = { role: "assistant", content: answer }
      setMessages((m) => [...m, assistant])
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Network error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  function handleStart() {
    if (secondsLeft <= 0) setSecondsLeft(minutes * 60)
    setActive(true)
  }

  function handleStop() {
    setActive(false)
    if (intervalRef.current) window.clearInterval(intervalRef.current)
  }

  return (
    <section id="chat" aria-labelledby="chat-heading" className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 id="chat-heading" className="text-pretty text-2xl font-semibold text-foreground">
          {category.replace("-", " ")} Chat
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per minute chat</span>
          <span className="rounded bg-muted px-2 py-1 text-xs text-foreground">{formatTime(secondsLeft)}</span>
          <span className="rounded bg-muted px-2 py-1 text-xs text-foreground">₹{pricePerMinute}/min</span>
          <span className="rounded bg-muted px-2 py-1 text-xs text-foreground">
            ₹{(() => {
              const elapsed = minutes * 60 - secondsLeft
              const billed = Math.max(0, Math.ceil(elapsed / 60))
              return billed * pricePerMinute
            })()}
          </span>
          {!active ? (
            <Button size="sm" onClick={handleStart}>
              Start
            </Button>
          ) : (
            <Button variant="destructive" size="sm" onClick={handleStop}>
              Stop
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4 bg-card text-card-foreground">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInput(s)}
              className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground hover:bg-muted/80"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mb-3 max-h-80 overflow-auto rounded border border-border bg-background p-3 text-sm">
          {messages.length === 0 ? (
            <p className="text-muted-foreground">
              Chat shuru karne ke baad apna sawal type kijiye. Hum aapko {category.replace("-", " ")} se judi madad dene
              ki koshish karenge. Ye information-only hai; professional advice ke liye expert se consult karein.
            </p>
          ) : (
            <ul className="space-y-3">
              {messages.map((m, i) => (
                <li key={i} className={m.role === "user" ? "text-foreground" : "text-pretty text-muted-foreground"}>
                  <span className="font-medium">{m.role === "user" ? "You" : "Consultant"}: </span>
                  <span>{m.content}</span>
                </li>
              ))}
              {loading && <li className="text-muted-foreground">Thinking…</li>}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={active ? "Type your question..." : "Start chat to ask your question"}
            disabled={!active || loading}
            className="min-h-12"
          />
          <Button onClick={send} disabled={!active || loading || !input.trim()}>
            Send
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Disclaimer: Ye feature public web sources (DuckDuckGo, Wikipedia) use karta hai. Legal/medical/relationship
          jaise topics par yeh general info deta hai — professional advice nahi.
        </p>
      </Card>
    </section>
  )
}
