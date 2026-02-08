import { reviewService } from '../services/reviews';

async function testReviewService() {
  console.log("🧪 Starting ReviewService Verification...");
  
  try {
    const reviews = await reviewService.getPendingReviews('mock-user-id');
    if (reviews.length === 0) throw new Error("No pending reviews found");
    
    console.log(`✅ Pending Reviews: ${reviews.length}`);
    
    const reviewId = reviews[0].id;
    const result = await reviewService.submitReview(reviewId, { rating: 5 });
    
    if (result.status !== 'completed') throw new Error("Review submission failed status check");
    
    console.log("✅ Review Submitted Successfully");
    
  } catch (error) {
    console.error("❌ Verification Failed:", error);
    process.exit(1);
  }
}

testReviewService();
