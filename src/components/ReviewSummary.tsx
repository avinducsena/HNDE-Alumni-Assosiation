import React from 'react';
import { Star } from 'lucide-react';
import { ReviewStats } from '../types/alumni';
import { RatingDistribution } from './RatingDistribution';

interface ReviewSummaryProps {
  stats: ReviewStats;
  onRateNowClick?: () => void;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  stats,
  onRateNowClick,
}) => {
  return (
    <div className="rounded-2xl bg-[#161212] border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Overall Average Score */}
        <div className="lg:col-span-5 text-center lg:text-left lg:border-r lg:border-white/10 lg:pr-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            Overall Community Rating
          </p>
          <div className="mt-3 flex items-baseline justify-center lg:justify-start gap-2">
            <span className="font-mono-num text-5xl sm:text-6xl font-bold text-[#F7F1E5]">
              {stats.totalReviews > 0 ? stats.averageRating.toFixed(1) : '0.0'}
            </span>
            <span className="font-mono-num text-2xl text-[#F7F1E5]/50">/ 5</span>
          </div>

          <div
            className="mt-3 flex items-center justify-center lg:justify-start gap-1"
            aria-label={`Average rating ${stats.averageRating.toFixed(1)} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${
                  s <= Math.round(stats.averageRating)
                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>

          <p className="mt-2 font-mono-num text-xs sm:text-sm text-[#F7F1E5]/70">
            Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </p>

          {onRateNowClick && (
            <div className="mt-5">
              <button
                type="button"
                onClick={onRateNowClick}
                className="rounded-xl bg-[#8B0000]/40 hover:bg-[#8B0000] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#F7F1E5] border border-[#D4AF37]/40 transition-colors cursor-pointer whitespace-nowrap"
              >
                Add Your Rating
              </button>
            </div>
          )}
        </div>

        {/* Right: Dynamic Rating Distribution */}
        <div className="lg:col-span-7">
          <RatingDistribution distribution={stats.distribution} />
        </div>
      </div>
    </div>
  );
};
