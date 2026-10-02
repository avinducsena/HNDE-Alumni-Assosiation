import React from 'react';
import { Star } from 'lucide-react';
import { PublicReviewItem } from '../types/alumni';

interface ReviewCardProps {
  review: PublicReviewItem;
  onReadMore: (review: PublicReviewItem) => void;
}

const PREVIEW_CHAR_LIMIT = 145;

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onReadMore,
}) => {
  const isLong = review.feedback.length > PREVIEW_CHAR_LIMIT;
  const previewText = isLong
    ? `${review.feedback.slice(0, PREVIEW_CHAR_LIMIT).trim()}...`
    : review.feedback;

  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="flex flex-col justify-between rounded-2xl bg-[#161212]/90 border border-white/10 hover:border-[#D4AF37]/40 p-6 shadow-lg transition-colors duration-150">
      <div>
        {/* Star Rating Row */}
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-1"
            aria-label={`Rated ${review.rating} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${
                  s <= review.rating
                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>
          <span className="font-mono-num text-xs text-[#F7F1E5]/50">
            {formattedDate}
          </span>
        </div>

        {/* Review Excerpt */}
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#F7F1E5]/90">
          &ldquo;{previewText}&rdquo;
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => onReadMore(review)}
            className="mt-2 inline-flex items-center text-xs font-semibold text-[#D4AF37] hover:underline underline-offset-4 cursor-pointer"
          >
            Read More
          </button>
        )}
      </div>

      {/* Author Attribution — Unboxed Metadata Discipline (Never shows Card) */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm">
        <span className="font-semibold text-[#F7F1E5]">— {review.name}</span>
        <span className="font-mono-num text-xs text-[#D4AF37]">{review.batch}</span>
      </div>
    </article>
  );
};
