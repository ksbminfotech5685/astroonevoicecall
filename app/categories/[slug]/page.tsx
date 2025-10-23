import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getCategoryTitle } from "@/lib/categories"
import { getExpertsByCategory } from "@/components/data/experts"
import ExpertCard from "@/components/expert-card"
import CategoryChat from "@/components/category-chat"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug)
  if (!category) return notFound()

  const experts = getExpertsByCategory(category.slug)

  return (
    <div className="px-4 py-6 md:px-8 mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{getCategoryTitle(category.slug)}</h1>
        <Link className="text-sm underline text-muted-foreground" href="/">
          Back to Home
        </Link>
      </div>

      {experts.length === 0 ? (
        <p className="text-muted-foreground">No experts available in this category yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experts.map((ex) => (
            <ExpertCard key={ex.id} expert={ex} />
          ))}
        </div>
      )}

      <CategoryChat category={category.slug} minutes={5} />
    </div>
  )
}
