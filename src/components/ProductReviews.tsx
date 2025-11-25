import { Review } from '@/types/product';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ShieldCheck } from 'lucide-react';
import { REVIEWS } from '@/data/products';

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

export function ProductReviews({ productId, averageRating, reviewCount }: ProductReviewsProps) {
  const productReviews = REVIEWS.filter(r => r.productId === productId);
  
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: productReviews.filter(r => r.rating === stars).length,
    percentage: reviewCount > 0 ? (productReviews.filter(r => r.rating === stars).length / reviewCount) * 100 : 0
  }));

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-accent text-accent' : 'text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="glass-card p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="text-5xl font-bold text-gradient">{averageRating.toFixed(1)}</div>
            <div className="flex gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-sm text-muted-foreground">{reviewCount.toLocaleString()} ratings</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm w-12">{stars} star</span>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <Button variant="outline">Write a Review</Button>
        </div>

        {productReviews.length > 0 ? (
          <div className="space-y-4">
            {productReviews.map((review) => (
              <Card key={review.id} className="glass-card p-6">
                <div className="space-y-3">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="text-sm font-semibold">{review.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Reviewed on {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-sm text-muted-foreground">{review.content}</p>

                  <Separator />

                  {/* Review Actions */}
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Report
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="glass-card p-8 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            <Button variant="outline" className="mt-4">Write a Review</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
