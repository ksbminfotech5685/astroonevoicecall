export const ELEVEN_TALK_URL = "https://elevenlabs.io/app/talk-to?agent_id=agent_4201k5ttey26eexaz3cbwfb7s9dy"

// Note: The provided API key must not be exposed on the client. If needed later for APIs,
// handle it via a server route. For now, we open the public talk-to URL in a new window.

export function openCallWindow() {
  if (typeof window === "undefined") return
  const features = "noopener,noreferrer,width=900,height=700"
  const w = window.open(ELEVEN_TALK_URL, "ksbm-astro-call", features)
  if (w) w.focus()
}
