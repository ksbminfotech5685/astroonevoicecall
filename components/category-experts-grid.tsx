"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
// removed unused Card/Button imports
import { getCategoryTitle } from "@/lib/categories"
import { getExpertsByCategory } from "@/components/data/experts"
import ExpertCard from "@/components/expert-card"

type Props = {
  slug: string
  className?: string
}

export default function CategoryExpertsGrid({ slug, className }: Props) {
  const title = getCategoryTitle(slug)
  const experts = getExpertsByCategory(slug)

  return (
    <section aria-labelledby="experts-heading" className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 id="experts-heading" className="text-pretty text-2xl font-semibold text-foreground">
          Top {title} Experts
        </h2>
        <Link href="#chat" className="text-sm text-primary hover:underline">
          Go to chat
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {experts.map((ex) => (
          <ExpertCard key={ex.id} expert={ex} />
        ))}
      </div>
    </section>
  )
}
