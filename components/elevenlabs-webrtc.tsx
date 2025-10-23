"use client"

import React from "react"

type ElevenLabsWebRTCProps = {
  active: boolean
  agentId: string
  onError?: (err: Error) => void
  className?: string
}

/**
 * Establishes a WebRTC session with an ElevenLabs agent using the Web SDK.
 * - Starts when `active` becomes true
 * - Ends when `active` becomes false or on unmount
 * Note: Works without exposing an API key for public agents (agentId-only).
 */
export default function ElevenLabsWebRTC({ active, agentId, onError, className }: ElevenLabsWebRTCProps) {
  const conversationRef = React.useRef<any>(null)
  const [status, setStatus] = React.useState<"idle" | "connecting" | "connected" | "error">("idle")
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  React.useEffect(() => {
    let disposed = false

    async function start() {
      try {
        setErrorMsg(null)
        setStatus("connecting")
        console.log("[v0] ElevenLabs starting via WebRTC. agentId:", agentId)

        // Prompt mic permission first for clearer errors and user prompt
        await navigator.mediaDevices.getUserMedia({ audio: true })

        // Lazy-load SDK to avoid SSR issues
        const sdk = await import("@elevenlabs/client")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Conversation: any = (sdk as any).Conversation || (sdk as any).default?.Conversation || (sdk as any)

        if (!Conversation?.startSession) {
          throw new Error("ElevenLabs SDK missing Conversation.startSession")
        }

        const conv = await Conversation.startSession({
          agentId,
          connectionType: "webrtc",
        })

        if (disposed) {
          try {
            await conv?.endSession?.()
          } catch {}
          return
        }

        conversationRef.current = conv
        setStatus("connected")

        try {
          conv?.on?.("connected", () => console.log("[v0] ElevenLabs connected"))
          conv?.on?.("disconnected", () => console.log("[v0] ElevenLabs disconnected"))
          conv?.on?.("error", (e: unknown) => {
            console.log("[v0] ElevenLabs runtime error:", e)
            setStatus("error")
            setErrorMsg(e instanceof Error ? e.message : "Runtime error")
          })
        } catch {
          // optional event API; ignore if not available
        }
      } catch (e: unknown) {
        console.log("[v0] ElevenLabs start error:", e)
        const err = e instanceof Error ? e : new Error("Failed to start ElevenLabs session")
        setStatus("error")
        setErrorMsg(err.message)
        onError?.(err)
      }
    }

    async function stop() {
      setStatus("idle")
      const conv = conversationRef.current
      conversationRef.current = null
      if (conv) {
        try {
          console.log("[v0] ElevenLabs ending session")
          await conv.endSession?.()
        } catch {
          try {
            await conv.close?.()
          } catch {}
        }
      }
    }

    if (active) start()
    else stop()

    return () => {
      disposed = true
      if (conversationRef.current) {
        try {
          conversationRef.current.endSession?.()
        } catch {
          try {
            conversationRef.current.close?.()
          } catch {}
        }
        conversationRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, agentId])

  return (
    <div className={["p-4 rounded-lg border", className].filter(Boolean).join(" ")}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {status === "idle" && "Ready to connect"}
          {status === "connecting" && "Connecting to agent..."}
          {status === "connected" && "Live call in progress"}
          {status === "error" && "Call error"}
        </div>
        <div className="text-xs text-muted-foreground">Agent: {agentId.slice(0, 8)}…</div>
      </div>

      {errorMsg && <p className="mt-2 text-xs text-destructive">{errorMsg}</p>}

      <p className="mt-3 text-xs text-muted-foreground">
        Powered by ElevenLabs WebRTC. Starts with session and auto-ends when your balance finishes.
      </p>
    </div>
  )
}
