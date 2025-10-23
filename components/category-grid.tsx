import Link from "next/link"
import { categories } from "@/lib/categories"
import {
  HeartHandshake,
  BriefcaseBusiness,
  GraduationCap,
  Landmark,
  Scale,
  Stethoscope,
  PiggyBank,
  Users,
  Brain,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  love: HeartHandshake,
  marriage: Landmark,
  career: GraduationCap,
  business: BriefcaseBusiness,
  legal: Scale,
  health: Stethoscope,
  finance: PiggyBank,
  family: Users,
  "mental-wellness": Brain,
}

const colorTokens = [
  "var(--color-chart-2)", // teal
  "var(--color-chart-4)", // lime
  "var(--color-chart-5)", // orange
  "var(--color-chart-3)", // blue
  "var(--color-chart-1)", // purple
]

export default function CategoryGrid() {
  return (
    <div
      id="categories"
      className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      aria-label="Choose a problem category"
    >
      {categories.map((cat, idx) => {
        const Icon = iconMap[cat.slug] ?? Users
        const bg = colorTokens[idx % colorTokens.length]
        return (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="rounded-lg border p-4 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            aria-label={`Talk about ${cat.title}`}
          >
            <div className="flex items-start gap-3">
              <div
                className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center"
                style={{ backgroundColor: bg }}
                aria-hidden
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base font-semibold">{cat.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{cat.subtitle}</div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
