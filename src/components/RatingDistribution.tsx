import React from 'react';
import { Star } from 'lucide-react';
import { RatingDistributionItem } from '../types/alumni';

interface RatingDistributionProps {
  distribution: RatingDistributionItem[];
  onFilterByStar?: (star: number | undefined) => void;
  activeStarFilter?: number;
}

export const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  onFilterByStar,
  activeStarFilter,
}) => {
  const ordered = [5, 4, 3, 2, 1].map((star) => {
    const found = distribution.find((d) => d.star === star);
    return found || { star, count: 0, percentage: 0 };
  });

  return (
    <div className="space-y-3" aria-label="Rating distribution breakdown">
      {ordered.map((item) => {
        const isSelected = activeStarFilter === item.star;
        const InteractiveTag = onFilterByStar ? 'button' : 'div';

        return (
          <InteractiveTag
            key={item.star}
            type={onFilterByStar ? 'button' : undefined}
            onClick={
              onFilterByStar
                ? () => onFilterByStar(isSelected ? undefined : item.star)
                : undefined
            }
            className={`w-full flex items-center gap-3 text-xs sm:text-sm transition-colors ${
              onFilterByStar
                ? 'cursor-pointer rounded-lg px-2 py-1 hover:bg-white/5'
                : ''
            } ${isSelected ? 'bg-[#8B0000]/30 text-[#D4AF37]' : 'text-[#F7F1E5]/85'}`}
          >
            {/* Star Symbols */}
            <div
              className="flex items-center gap-0.5 w-24 shrink-0"
              aria-label={`${item.star} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= item.star
                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                      : 'text-white/15'
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8B0000] via-[#B11226] to-[#D4AF37] transition-all duration-500"
                style={{ width: `${Math.max(item.percentage, item.count > 0 ? 4 : 0)}%` }}
              />
            </div>

            {/* Percentage & Count */}
            <div className="w-16 text-right font-mono-num text-xs text-[#F7F1E5]/80 shrink-0">
              <span className="font-semibold text-[#F7F1E5]">{item.percentage}%</span>
            </div>
          </InteractiveTag>
        );
      })}
    </div>
  );
};
