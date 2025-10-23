import type { NextRequest } from "next/server"

async function ddgAnswer(query: string) {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { headers: { "User-Agent": "v0-chat/1.0" } },
    )
    const json = await res.json()
    const abstract = json?.AbstractText as string | undefined
    if (abstract && abstract.length > 30) return abstract
    const related = Array.isArray(json?.RelatedTopics) ? json.RelatedTopics : []
    for (const item of related) {
      if (typeof item?.Text === "string" && item.Text.length > 30) return item.Text
      if (Array.isArray(item?.Topics)) {
        const t = item.Topics.find((x: any) => typeof x?.Text === "string" && x.Text.length > 30)
        if (t?.Text) return t.Text
      }
    }
  } catch {}
  return ""
}

async function wikipediaAnswer(query: string) {
  try {
    const search = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json&origin=*`,
      { headers: { "User-Agent": "v0-chat/1.0" } },
    )
    const sjson = await search.json()
    const title = sjson?.[1]?.[0]
    if (!title) return ""
    const sum = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      headers: { "User-Agent": "v0-chat/1.0", Accept: "application/json" },
    })
    const sj = await sum.json()
    if (typeof sj?.extract === "string" && sj.extract.length > 40) {
      return sj.extract
    }
  } catch {}
  return ""
}

function categoryPreamble(category: string) {
  const cat = category.toLowerCase()
  if (cat.includes("legal"))
    return "Note: Ye general legal info hai, professional legal advice ke liye lawyer se consult karein.\n"
  if (cat.includes("health") || cat.includes("mental"))
    return "Note: Ye general health info hai, emergency ya diagnosis ke liye doctor/helpline se contact karein.\n"
  if (cat.includes("marriage"))
    return "Note: Ye general relationship guidance hai; complex matters ke liye counselor se baat karein.\n"
  return ""
}

export async function POST(req: NextRequest) {
  const { category, message } = await req.json()
  const safeCat = typeof category === "string" ? category : "general"
  const q = typeof message === "string" ? message.trim() : ""
  if (!q) {
    return Response.json({ answer: "Please provide a valid question." }, { status: 400 })
  }

  const combinedQuery = `${safeCat} advice: ${q}`
  const [a1, a2] = await Promise.all([ddgAnswer(combinedQuery), wikipediaAnswer(q)])

  const base = a1 || a2
  const pre = categoryPreamble(safeCat)
  const fallback =
    "Is vishay par mujhe filhaal verified info nahi mil payi. Thoda specific poochhen ya phir se try karein."
  const answer = pre + (base || fallback)

  return Response.json({ answer })
}
