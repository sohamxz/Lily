'use server'

import { reviewService } from '@/services/reviews';
import { revalidatePath } from 'next/cache';

export async function getReviews() {
  try {
    // In real app, get userId from session
    const reviews = await reviewService.getPendingReviews('mock-user-id');
    return { success: true, data: reviews };
  } catch (error) {
    return { success: false, message: 'Failed to load reviews' };
  }
}

export async function submitReviewAction(reviewId: string, formData: FormData) {
  try {
    const content = {
      strengths: formData.get('strengths'),
      improvements: formData.get('improvements'),
      rating: Number(formData.get('rating'))
    };
    
    await reviewService.submitReview(reviewId, content);
    revalidatePath('/reviews');
    return { success: true, message: 'Review submitted' };
  } catch (error) {
    return { success: false, message: 'Failed to submit review' };
  }
}
