import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getExpertById } from "@/components/data/experts"
import WalletBadge from "@/components/wallet-badge"

export default function ExpertDetailPage({ params }: { params: { id: string } }) {
  const expert = getExpertById(params.id)
  if (!expert) return notFound()

  return (
    <div className="px-4 py-6 md:px-8 mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">{`← Home`}</Link>
        <WalletBadge />
      </div>

      <div className="grid gap-6 md:grid-cols-[160px_1fr]">
        <div className="w-full">
          <Image
            src={expert.photoUrl || "/placeholder.svg"}
            alt={`${expert.name} profile photo`}
            width={160}
            height={160}
            className="rounded-lg object-cover w-40 h-40 bg-muted"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{expert.name}</h1>
          <p className="text-muted-foreground">
            {expert.categoryTitle} • {expert.experience} years experience • {expert.languages.join(", ")}
          </p>
          <p className="text-sm">
            Rating: {expert.rating}/5 • {expert.totalReviews}+ reviews
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/session/chat/${expert.id}`}
              className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm"
            >
              Start Chat • ₹{expert.pricePerMinChat}/min
            </Link>
            <Link
              href={`/session/call/${expert.id}`}
              className="inline-flex items-center rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm"
            >
              Start Call • ₹{expert.pricePerMinCall}/min
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">About</h2>
        <p className="text-pretty text-muted-foreground">{expert.bio}</p>
      </div>
    </div>
  )
}
