import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { PublicReviewItem, ReviewStats } from '../types/alumni';
import { ReviewSummary } from './ReviewSummary';
import { ReviewCard } from './ReviewCard';
import { Modal } from './Modal';
import { LoadingSpinner } from './LoadingSpinner';

interface RecentReviewsProps {
  reviews: PublicReviewItem[];
  stats: ReviewStats;
  loading: boolean;
  onRateNowClick: () => void;
}

export const RecentReviews: React.FC<RecentReviewsProps> = ({
  reviews,
  stats,
  loading,
  onRateNowClick,
}) => {
  const [selectedReview, setSelectedReview] = useState<PublicReviewItem | null>(null);

  return (
    <section
      id="reviews-section"
      className="py-20 sm:py-24 border-b border-white/10 bg-[#111111]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            Live Alumni Reviews &amp; Ratings
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-[#F7F1E5] text-balance">
            WHAT OUR ALUMNI SAY
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F7F1E5]/75">
            Real experiences and reflections shared by HNDE Labuduwa engineering graduates across all 11 batches.
          </p>
        </div>

        {/* Dynamic Review Summary & Rating Distribution */}
        <ReviewSummary stats={stats} onRateNowClick={onRateNowClick} />

        {/* Latest Alumni Reviews Subheading */}
        <div className="mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              Community Voices
            </p>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#F7F1E5]">
              LATEST ALUMNI REVIEWS
            </h3>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#F7F1E5] transition-colors whitespace-nowrap"
          >
            <span>View All Reviews</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Loading, Empty State, or Review Cards Grid */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" label="Loading alumni reviews..." />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl bg-[#161212] border border-white/10 p-12 text-center max-w-xl mx-auto">
            <p className="font-display text-2xl font-bold text-[#F7F1E5]">
              No reviews yet.
            </p>
            <p className="mt-2 text-sm text-[#F7F1E5]/75">
              Be the first HNDEian to share your experience.
            </p>
            <button
              type="button"
              onClick={onRateNowClick}
              className="mt-6 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#B11226] px-6 py-3 text-xs font-semibold tracking-wider text-[#F7F1E5] border border-[#D4AF37]/50 cursor-pointer"
            >
              RATE OUR ASSOCIATION
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onReadMore={(item) => setSelectedReview(item)}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/reviews"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/5 hover:bg-white/10 px-7 py-3.5 text-sm font-semibold tracking-wider text-[#F7F1E5] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-150 whitespace-nowrap"
              >
                <span>View All Reviews ({stats.totalReviews})</span>
                <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Full Review Modal */}
      <Modal
        isOpen={Boolean(selectedReview)}
        onClose={() => setSelectedReview(null)}
        title="Alumni Review"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= selectedReview.rating
                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono-num text-xs text-[#F7F1E5]/60">
                {new Date(selectedReview.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <p className="text-base leading-relaxed text-[#F7F1E5] whitespace-pre-line">
              &ldquo;{selectedReview.feedback}&rdquo;
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#F7F1E5]">
                — {selectedReview.name}
              </span>
              <span className="font-mono-num font-medium text-[#D4AF37]">
                {selectedReview.batch}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
