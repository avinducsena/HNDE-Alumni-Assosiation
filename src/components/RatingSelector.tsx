import React, { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

interface RatingSelectorProps {
  selectedRating: number;
  onSelectRating: (rating: number) => void;
}

const STAR_LABELS: Record<number, { label: string; sentiment: string }> = {
  1: { label: '1 Star', sentiment: 'Needs significant improvement' },
  2: { label: '2 Stars', sentiment: 'Fair — room to grow' },
  3: { label: '3 Stars', sentiment: 'Good initiative & community effort' },
  4: { label: '4 Stars', sentiment: 'Very good — strong alumni connection' },
  5: { label: '5 Stars', sentiment: 'Outstanding — proud to be an HNDEian!' },
};

export const RatingSelector: React.FC<RatingSelectorProps> = ({
  selectedRating,
  onSelectRating,
}) => {
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const activeStar = hoveredRating || selectedRating;

  return (
    <div className="w-full">
      {/* Step Progress Indicator */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-xs font-medium tracking-widest">
        <div
          className={`flex items-center gap-2.5 transition-colors ${
            selectedRating >= 1 ? 'text-[#D4AF37]' : 'text-[#F7F1E5]'
          }`}
        >
          <span
            className={`font-mono-num inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
              selectedRating >= 1
                ? 'bg-[#D4AF37] text-[#111111]'
                : 'bg-[#8B0000] text-[#F7F1E5] border border-[#D4AF37]/50'
            }`}
          >
            1
          </span>
          <span>STEP 1 OF 2 · YOUR RATING</span>
        </div>

        <span className="hidden sm:inline text-white/25" aria-hidden="true">
          —
        </span>

        <div
          className={`flex items-center gap-2.5 transition-colors ${
            selectedRating >= 1 ? 'text-[#F7F1E5]' : 'text-[#F7F1E5]/40'
          }`}
        >
          <span
            className={`font-mono-num inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
              selectedRating >= 1
                ? 'bg-[#8B0000] text-[#F7F1E5] border border-[#D4AF37]'
                : 'bg-white/10 text-[#F7F1E5]/50'
            }`}
          >
            2
          </span>
          <span>STEP 2 OF 2 · YOUR FEEDBACK</span>
        </div>
      </div>

      {/* Main Rating Card */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
          Live Association Rating
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F7F1E5] text-balance">
          How would you rate the HNDE Labuduwa Alumni Association?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#F7F1E5]/75">
          Your feedback shapes the future of our alumni community. Select a star rating below to begin.
        </p>

        {/* Interactive 5-Star Selector */}
        <div
          className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 rounded-2xl bg-[#111111]/80 border border-[#D4AF37]/30 px-5 sm:px-8 py-5 shadow-inner"
          role="radiogroup"
          aria-label="Rate the HNDE Labuduwa Alumni Association from 1 to 5 stars"
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= activeStar;
            const isSelected = star === selectedRating;

            return (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={STAR_LABELS[star].label}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => onSelectRating(star)}
                className="group relative flex flex-col items-center gap-1.5 rounded-xl p-2.5 sm:p-3 transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#D4AF37] cursor-pointer"
              >
                <Star
                  className={`h-9 w-9 sm:h-12 sm:w-12 transition-all duration-150 ${
                    isFilled
                      ? 'fill-[#D4AF37] text-[#D4AF37] drop-shadow-[0_0_12px_rgba(212,175,55,0.45)]'
                      : 'text-[#F7F1E5]/25 group-hover:text-[#D4AF37]/60'
                  }`}
                />
                <span
                  className={`font-mono-num text-[11px] font-medium whitespace-nowrap ${
                    isFilled ? 'text-[#D4AF37]' : 'text-[#F7F1E5]/50'
                  }`}
                >
                  {STAR_LABELS[star].label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step 1 Confirmation Banner when Rating is Selected */}
        {selectedRating > 0 && (
          <div className="mt-6 inline-flex flex-col sm:flex-row items-center justify-center gap-2.5 rounded-xl bg-[#8B0000]/25 border border-[#D4AF37]/40 px-5 py-3 text-sm text-[#F7F1E5] transition-all duration-200">
            <div className="flex items-center gap-2 font-semibold text-[#D4AF37]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Thank you for rating us!</span>
            </div>
            <span className="hidden sm:inline text-white/30" aria-hidden="true">
              ·
            </span>
            <span className="text-[#F7F1E5]/90">
              You selected <strong className="text-[#D4AF37]">{STAR_LABELS[selectedRating].label}</strong> ({STAR_LABELS[selectedRating].sentiment})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
