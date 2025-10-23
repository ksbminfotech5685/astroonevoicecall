export const categories = [
  { slug: "love", title: "Love", subtitle: "Relationship clarity" },
  { slug: "marriage", title: "Marriage", subtitle: "Compatibility & issues" },
  { slug: "career", title: "Career", subtitle: "Jobs & growth" },
  { slug: "business", title: "Business", subtitle: "Strategy & decisions" },
  { slug: "legal", title: "Legal Advice", subtitle: "Rights & disputes" },
  { slug: "health", title: "Health", subtitle: "Holistic guidance" },
  { slug: "finance", title: "Finance", subtitle: "Money & planning" },
  { slug: "family", title: "Family", subtitle: "Home & relations" },
  { slug: "mental-wellness", title: "Mental Wellness", subtitle: "Stress & mindset" },
] as const

export type CategorySlug = (typeof categories)[number]["slug"]

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getCategoryTitle(slug: string) {
  return getCategoryBySlug(slug)?.title ?? "Category"
}
