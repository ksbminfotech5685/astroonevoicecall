"use client"

import { useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  expertName: string
  onSubmit: (rating: number, comment: string) => void
}

export default function RatingDialog({ open, onOpenChange, expertName, onSubmit }: Props) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md rounded-lg border bg-background p-4 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-medium">Rate {expertName}</h3>
        <label className="text-sm">Rating (1-5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-24 rounded-md border px-3 py-2"
        />
        <label className="text-sm">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full min-h-24 rounded-md border px-3 py-2"
          placeholder="Share your experience…"
        />
        <div className="flex justify-end gap-2">
          <button className="rounded-md border px-3 py-2 text-sm" onClick={() => onOpenChange(false)}>
            Close
          </button>
          <button
            className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm"
            onClick={() => {
              onSubmit(rating, comment)
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
