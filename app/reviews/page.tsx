"use client"

import { useEffect, useState } from "react"
import { getReviews } from "@/app/actions/reviews"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getReviews()
      if (res.success && res.data) {
        setReviews(res.data)
      }
      setLoading(false)
    }
    fetchReviews()
  }, [])

  if (loading) {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Performance Reviews</h1>
        <p className="text-muted-foreground mt-2">Complete your pending reviews.</p>
      </header>

      <div className="grid gap-4">
        {reviews.map((review) => (
          <Link href={`/reviews/${review.id}`} key={review.id}>
            <div className="p-6 bg-card border rounded-xl hover:border-primary transition-colors cursor-pointer group">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg uppercase tracking-tight">
                    {review.type} Review
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className={cn("capitalize font-medium", review.status === 'pending' ? "text-amber-600" : "text-green-600")}>{review.status}</span>
                  </p>
                </div>
                <div className="px-3 py-1 bg-muted rounded-full text-xs font-mono group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Start
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
