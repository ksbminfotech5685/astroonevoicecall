"use client"

import Image from "next/image"
import Link from "next/link"
import WalletBadge from "@/components/wallet-badge"
import { Button } from "@/components/ui/button"

const suggestions = [
  { label: "Love", slug: "love" },
  { label: "Marriage", slug: "marriage" },
  { label: "Career (Job)", slug: "career" },
  { label: "Business", slug: "business" },
  { label: "Legal Advice", slug: "legal" },
  { label: "Health", slug: "health" },
  { label: "Finance", slug: "finance" },
  { label: "Family", slug: "family" },
  { label: "Mental Wellness", slug: "mental-wellness" },
] as const

export default function HomeHero() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <span className="inline-block rounded-full px-3 py-1 text-xs border bg-accent">
            Pay-per-minute • Chat or Call
          </span>
          <h1 className="text-3xl md:text-5xl font-semibold text-balance leading-tight">
            Get trusted guidance for life’s questions — instantly
          </h1>
          <p className="text-muted-foreground text-pretty">
            Start a session with verified experts. Recharge your wallet and talk about love, career, business, legal,
            and more.
          </p>

          <div className="flex items-center gap-3">
            <Link href="#categories">
              <Button className="px-5">Browse Categories</Button>
            </Link>
            <div aria-label="Your wallet status">
              <WalletBadge />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Popular topics</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Link key={s.slug} href={`/categories/${s.slug}`} aria-label={`Open ${s.label} topic`}>
                  <Button variant="secondary" className="h-8 px-3">
                    {s.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative w-full h-[220px] md:h-[360px] rounded-xl overflow-hidden border">
          <Image
            src="/happy-people-consulting-on-a-call.jpg"
            alt="Consult with experts anytime"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
