import React from 'react';
import { Check, Star, RotateCcw } from 'lucide-react';
import { SubmittedFeedbackSummary } from '../types/alumni';

interface SuccessMessageProps {
  summary: SubmittedFeedbackSummary;
  onReset: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  summary,
  onReset,
}) => {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-b from-[#1B1314] to-[#131010] border border-[#D4AF37]/50 p-6 sm:p-10 text-center shadow-2xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#8B0000]/40 border-2 border-[#D4AF37] text-[#D4AF37] shadow-lg">
        <Check className="h-8 w-8 stroke-[2.5]" />
      </div>

      <h3 className="mt-5 font-display text-3xl sm:text-4xl font-bold tracking-wide text-[#F7F1E5] uppercase">
        THANK YOU, {summary.name}!
      </h3>

      <p className="mt-2 font-display italic text-lg sm:text-xl text-[#D4AF37]">
        &ldquo;Your voice helps us build a stronger HNDE Labuduwa Alumni Association.&rdquo;
      </p>

      <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-6 rounded-xl bg-[#111111]/90 border border-white/10 px-6 py-4">
        <div className="text-center">
          <span className="block text-xs uppercase tracking-wider text-[#F7F1E5]/60">
            Your Rating
          </span>
          <div className="mt-1 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= summary.rating
                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="h-8 w-px bg-white/10 hidden sm:block" />

        <div className="text-center">
          <span className="block text-xs uppercase tracking-wider text-[#F7F1E5]/60">
            Batch
          </span>
          <span className="mt-1 block font-mono-num text-sm font-semibold text-[#F7F1E5]">
            {summary.batch}
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm text-[#F7F1E5]/80">
        Your feedback has been successfully recorded and added to our live alumni review board.
      </p>

      <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
          Next Step Below: Share Your Event Memories ↓
        </span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F7F1E5]/70 hover:text-[#D4AF37] transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Submit another response</span>
        </button>
      </div>
    </div>
  );
};
