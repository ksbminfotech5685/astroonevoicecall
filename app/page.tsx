import CategoryGrid from "@/components/category-grid"
import HomeHero from "@/components/home-hero"
import sampleExperts from "@/components/data/experts"
import ExpertCard from "@/components/expert-card"

export default function HomePage() {
  return (
    <div className="px-4 py-8 md:px-8">
      <HomeHero />

      <section className="mx-auto max-w-6xl mt-12">
        <h2 className="text-xl font-semibold mb-4">Tell us your problem</h2>
        <p className="text-sm text-muted-foreground mb-4">Pick a topic to get matched with the right expert.</p>
        <CategoryGrid />
      </section>

      <section className="mx-auto max-w-6xl mt-12">
        <h2 className="text-xl font-semibold mb-4">Featured consultants</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleExperts.slice(0, 3).map((ex) => (
            <ExpertCard key={ex.id} expert={ex} />
          ))}
        </div>
      </section>
    </div>
  )
}
