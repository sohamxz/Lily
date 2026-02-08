// Mock Data for Review System

interface ReviewCycle {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'closed';
}

interface Review {
  id: string;
  cycleId: string;
  reviewerId: string;
  revieweeId: string;
  type: 'self' | 'manager' | 'peer';
  status: 'pending' | 'completed';
  content?: any;
}

const MOCK_CYCLES: ReviewCycle[] = [
  { id: 'cycle-1', title: 'Q1 2024 Performance Review', startDate: '2024-03-01', endDate: '2024-03-31', status: 'active' }
];

const MOCK_REVIEWS: Review[] = [
  { id: 'rev-1', cycleId: 'cycle-1', reviewerId: 'mock-user-id', revieweeId: 'mock-user-id', type: 'self', status: 'pending' },
  { id: 'rev-2', cycleId: 'cycle-1', reviewerId: 'mock-user-id', revieweeId: '2', type: 'peer', status: 'pending' }
];

export class ReviewService {
  async getActiveCycles() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_CYCLES.filter(c => c.status === 'active');
  }

  async getPendingReviews(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    // In a real app, filter by reviewerId
    return MOCK_REVIEWS; 
  }

  async submitReview(reviewId: string, content: any) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const review = MOCK_REVIEWS.find(r => r.id === reviewId);
    if (review) {
      review.status = 'completed';
      review.content = content;
      return review;
    }
    throw new Error('Review not found');
  }
}

export const reviewService = new ReviewService();
