import Image from "next/image"
import Link from "next/link"
import type { Expert } from "./data/experts"

export default function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <div className="rounded-lg border overflow-hidden flex flex-col">
      <div className="p-4 flex gap-3">
        <Image
          src={expert.photoUrl || "/placeholder.svg"}
          alt={`${expert.name} photo`}
          width={64}
          height={64}
          className="rounded-md object-cover w-16 h-16 bg-muted"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{expert.name}</h3>
            <span className="text-xs rounded-full px-2 py-1 border">{expert.online ? "Online" : "Offline"}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {expert.categoryTitle} • {expert.experience} yrs • {expert.languages.join(", ")}
          </p>
          <p className="text-xs mt-1">Rating: {expert.rating}/5</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 divide-x border-t">
        <Link href={`/session/chat/${expert.id}`} className="p-3 text-center text-sm hover:bg-accent">
          Chat • ₹{expert.pricePerMinChat}/min
        </Link>
        <Link href={`/session/call/${expert.id}`} className="p-3 text-center text-sm hover:bg-accent">
          Call • ₹{expert.pricePerMinCall}/min
        </Link>
      </div>

      <div className="border-t p-3 text-center">
        <Link href={`/experts/${expert.id}`} className="text-sm underline">
          View Profile
        </Link>
      </div>
    </div>
  )
}
