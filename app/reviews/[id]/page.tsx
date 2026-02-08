"use client"

import { submitReviewAction } from "@/app/actions/reviews"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ReviewFormPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    await submitReviewAction(params.id, formData)
    router.push('/reviews')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
        <header>
            <h1 className="text-2xl font-bold">Submit Review</h1>
            <p className="text-muted-foreground text-sm">ID: {params.id}</p>
        </header>

        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Top Strengths</label>
                <textarea name="strengths" required className="w-full min-h-[100px] p-3 rounded-md border bg-transparent" placeholder="What are they doing well?" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Areas for Improvement</label>
                <textarea name="improvements" required className="w-full min-h-[100px] p-3 rounded-md border bg-transparent" placeholder="Where can they grow?" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Rating (1-5)</label>
                <select name="rating" className="w-full p-3 rounded-md border bg-transparent">
                    <option value="5">5 - Exceptional</option>
                    <option value="4">4 - Exceeds Expectations</option>
                    <option value="3">3 - Meets Expectations</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                </select>
            </div>

            <button disabled={isSubmitting} className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium disabled:opacity-50 flex justify-center">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Review"}
            </button>
        </form>
    </div>
  )
}
