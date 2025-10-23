"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  pricePerMinute: number
  onTick: () => void // called every second for wallet deduction
  onEnd: (elapsedSeconds: number) => void
  disabled?: boolean
  lowBalance?: boolean
  onQuickAdd?: (amt: number) => void
  onStart?: () => void
}

export default function SessionTimer({
  pricePerMinute,
  onTick,
  onEnd,
  disabled,
  lowBalance,
  onQuickAdd,
  onStart,
}: Props) {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1)
      onTick()
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [running, onTick])

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Rate</p>
          <p className="font-medium">₹{pricePerMinute}/min</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Time</p>
          <p className="font-medium">
            {Math.floor(seconds / 60)
              .toString()
              .padStart(2, "0")}
            :{(seconds % 60).toString().padStart(2, "0")}
          </p>
        </div>
      </div>

      {lowBalance && (
        <div className="rounded-md border p-3">
          <p className="text-sm">Low balance. Session may interrupt.</p>
          {onQuickAdd && (
            <div className="mt-2 flex gap-2">
              {[99, 199, 499].map((amt) => (
                <button
                  key={amt}
                  className="rounded-md bg-secondary text-secondary-foreground px-3 py-1.5 text-sm"
                  onClick={() => onQuickAdd(amt)}
                >
                  Add ₹{amt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => {
            setRunning(true)
            onStart?.()
          }}
          disabled={running || disabled}
        >
          Start
        </button>
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => {
            setRunning(false)
            onEnd(seconds) // provide elapsedSeconds
          }}
          disabled={!running}
        >
          End
        </button>
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => setRunning(false)}
          disabled={!running}
        >
          Pause
        </button>
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => setRunning(true)}
          disabled={running}
        >
          Resume
        </button>
      </div>
    </div>
  )
}
