"use client"

import React from "react"

type ElevenLabsWebRTCProps = {
  active: boolean
  agentId: string
  onError?: (err: Error) => void
  className?: string
}

/**
 * 🔮 Enhanced Version:
 * - Adds support for dynamic Kundli context (from form)
 * - Allows window.startElevenLabsCall(summary) to begin a context-aware call
 * - Keeps your auto-start/stop behavior from parent
 */
export default function ElevenLabsWebRTC({ active, agentId, onError, className }: ElevenLabsWebRTCProps) {
  const conversationRef = React.useRef<any>(null)
  const [status, setStatus] = React.useState<"idle" | "connecting" | "connected" | "error">("idle")
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
  const [context, setContext] = React.useState<string>("") // store Kundli or user context

  React.useEffect(() => {
    let disposed = false

    async function start(contextText?: string) {
      try {
        setErrorMsg(null)
        setStatus("connecting")
        console.log("[AstroOne] ElevenLabs starting via WebRTC. agentId:", agentId)

        // Ask mic permission first
        await navigator.mediaDevices.getUserMedia({ audio: true })

        // Import SDK dynamically
        const sdk = await import("@elevenlabs/client")
        const Conversation: any =
          (sdk as any).Conversation ||
          (sdk as any).default?.Conversation ||
          (sdk as any)

        if (!Conversation?.startSession) {
          throw new Error("ElevenLabs SDK missing Conversation.startSession")
        }

        // Start session with optional context
        const conv = await Conversation.startSession({
          agentId,
          connectionType: "webrtc",
          // 👇 inject Kundli or user-provided context directly into AI session
          metadata: contextText
            ? { system_prompt: `Use this Kundli context to respond wisely: ${contextText}` }
            : {},
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
          conv?.on?.("connected", () => console.log("[AstroOne] ElevenLabs connected ✅"))
          conv?.on?.("disconnected", () => console.log("[AstroOne] ElevenLabs disconnected ❌"))
          conv?.on?.("error", (e: unknown) => {
            console.log("[AstroOne] ElevenLabs runtime error:", e)
            setStatus("error")
            setErrorMsg(e instanceof Error ? e.message : "Runtime error")
          })
        } catch {
          // ignore event listener issues
        }
      } catch (e: unknown) {
        console.log("[AstroOne] ElevenLabs start error:", e)
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
          console.log("[AstroOne] ElevenLabs ending session 📴")
          await conv.endSession?.()
        } catch {
          try {
            await conv.close?.()
          } catch {}
        }
      }
    }

    if (active) start(context)
    else stop()

    // 🧠 Register global helper so the form can start ElevenLabs call with Kundli context
    if (typeof window !== "undefined") {
      window.startElevenLabsCall = async (kundliSummary: string) => {
        console.log("[AstroOne] startElevenLabsCall triggered with summary:", kundliSummary)
        setContext(kundliSummary)
        await stop()
        await start(kundliSummary)
      }
    }

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
          {status === "idle" && "🎧 Ready to connect"}
          {status === "connecting" && "🔄 Connecting to agent..."}
          {status === "connected" && "✅ Live call in progress"}
          {status === "error" && "❌ Call error"}
        </div>
        <div className="text-xs text-muted-foreground">Agent: {agentId.slice(0, 8)}…</div>
      </div>

      {errorMsg && <p className="mt-2 text-xs text-destructive">{errorMsg}</p>}

      <p className="mt-3 text-xs text-muted-foreground italic">
        Powered by <strong>ElevenLabs WebRTC</strong>.  
        Starts with context and auto-ends when your balance finishes.
      </p>
    </div>
  )
}
