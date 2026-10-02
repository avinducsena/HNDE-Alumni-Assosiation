import React from 'react';
import { BATCH_OPTIONS } from '../types/alumni';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface BatchTimelineProps {
  batchCounts?: Record<string, number>;
}

export const BatchTimeline: React.FC<BatchTimelineProps> = ({
  batchCounts = {},
}) => {
  return (
    <section
      id="association"
      className="py-20 sm:py-28 border-b border-white/10 bg-[#111111]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            Uniting Every Generation
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-[#F7F1E5] text-balance">
            ONE ASSOCIATION. 11 BATCHES. ONE FAMILY.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#F7F1E5]/80">
            11 batches of HNDE Labuduwa alumni are coming together under one alumni association.
          </p>
        </div>

        {/* Desktop Horizontal Timeline & Mobile Vertical Timeline */}
        <div className="mt-14 rounded-2xl bg-[#161212] border border-[#D4AF37]/30 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-1.5">
            {BATCH_OPTIONS.map((batch, index) => {
              const count = batchCounts[batch] || 0;
              const isLast = index === BATCH_OPTIONS.length - 1;

              return (
                <React.Fragment key={batch}>
                  <div className="flex-1 rounded-xl bg-[#111111] border border-white/10 hover:border-[#D4AF37]/60 px-3.5 py-3 text-center transition-colors">
                    <span className="font-mono-num block text-xs font-bold tracking-wider text-[#D4AF37]">
                      {batch.toUpperCase()}
                    </span>
                    <span className="mt-1 block text-[11px] text-[#F7F1E5]/65 font-mono-num">
                      {count > 0 ? `${count} ${count === 1 ? 'review' : 'reviews'}` : 'HNDE Labuduwa'}
                    </span>
                  </div>

                  {!isLast && (
                    <div
                      className="flex items-center justify-center text-[#D4AF37]/50 py-0.5 lg:py-0"
                      aria-hidden="true"
                    >
                      <ArrowDown className="h-4 w-4 lg:hidden" />
                      <ArrowRight className="hidden lg:block h-3.5 w-3.5 shrink-0" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Verified Summary Pillar Cards (No invented alumni headcount) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-gradient-to-b from-[#1B1213] to-[#141010] border border-[#D4AF37]/30 p-7">
            <span className="font-mono-num text-4xl sm:text-5xl font-bold text-[#D4AF37]">
              11
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold text-[#F7F1E5]">
              BATCHES
            </h3>
            <p className="mt-2 text-sm text-[#F7F1E5]/75 leading-relaxed">
              Every cohort from Batch 01 through Batch 11 represented under a single unified alumni charter.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-[#1B1213] to-[#141010] border border-[#D4AF37]/30 p-7">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              MULTI-DISCIPLINARY
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold text-[#F7F1E5]">
              ENGINEERING COMMUNITY
            </h3>
            <p className="mt-2 text-xs sm:text-sm font-medium text-[#D4AF37]/90">
              CIVIL · ELECTRICAL · MECHANICAL · QS
            </p>
            <p className="mt-2 text-sm text-[#F7F1E5]/75 leading-relaxed">
              Cross-disciplinary collaboration connecting practicing engineers and technical leaders.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-[#1B1213] to-[#141010] border border-[#D4AF37]/30 p-7">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              ONE
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold text-[#F7F1E5]">
              ALUMNI NETWORK
            </h3>
            <p className="mt-2 text-xs sm:text-sm font-medium text-[#D4AF37]/90">
              PROFESSIONAL CONNECTIONS
            </p>
            <p className="mt-2 text-sm text-[#F7F1E5]/75 leading-relaxed">
              Mentorship, career growth, and lifelong fellowship rooted at ATI Labuduwa, Galle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
