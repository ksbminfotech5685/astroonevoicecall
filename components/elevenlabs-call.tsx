"use client"

import * as React from "react"

type ElevenLabsCallProps = {
  active: boolean
  agentUrl: string // e.g. "https://elevenlabs.io/app/talk-to?agent_id=..."
  className?: string
}

/**
 * Renders an in-page iframe for the ElevenLabs "Talk to" agent.
 * Notes:
 * - We DO NOT expose any API key here.
 * - Permissions are granted via iframe allow for mic/camera.
 * - When inactive, we blank the src to stop the session immediately.
 */
export default function ElevenLabsCall({ active, agentUrl, className }: ElevenLabsCallProps) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    if (active) {
      // Start/continue the session
      iframe.src = agentUrl
    } else {
      // Stop the session hard by blanking the iframe
      try {
        iframe.src = "about:blank"
      } catch {
        // ignore cross-origin errors
      }
    }
  }, [active, agentUrl])

  return (
    <div
      className={className || "relative w-full h-[70vh] rounded-md border overflow-hidden"}
      aria-label="Live call panel"
    >
      <iframe
        ref={iframeRef}
        title="Live Call"
        // Intentionally not showing the URL anywhere in UI; iframe renders content only
        src="about:blank"
        className="absolute inset-0 h-full w-full"
        allow="microphone; camera; autoplay; clipboard-write"
        // Sandbox tightened while allowing necessary features to run
        sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox"
      />
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-sm text-muted-foreground">Call will start when you begin the session…</div>
        </div>
      )}
    </div>
  )
}
