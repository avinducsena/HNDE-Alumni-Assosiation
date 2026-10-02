import React, { useState } from 'react';
import { Star, Camera } from 'lucide-react';
import heroImage from '../assets/images/hero_alumni_gala_1790872313699.jpg';

interface HeroProps {
  onRateClick: () => void;
  onShareExperienceClick: () => void;
  averageRating?: number;
  totalReviews?: number;
}

export const Hero: React.FC<HeroProps> = ({
  onRateClick,
  onShareExperienceClick,
  averageRating = 0,
  totalReviews = 0,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-[86vh] w-full overflow-hidden flex items-center border-b border-[#D4AF37]/20"
    >
      {/* Background Visual Layer with Zero-Broken-Image Fallback */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#2B0508] via-[#140C0C] to-[#111111]">
        {!imgError && (
          <img
            src={heroImage}
            alt="HNDE Labuduwa Alumni Association Get-Together and Professional Networking Gala"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-center opacity-40 scale-105 transition-transform duration-700"
          />
        )}
        {/* Measured Contrast Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-[#111111]/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,0,0,0.38),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.12),transparent_55%)]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Primary Typography & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-[#D4AF37]">
              Reconnect · Network · Build a Brighter Tomorrow
            </p>

            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F7F1E5] leading-[1.06] text-balance">
                HNDE Labuduwa Alumni Association
              </h1>
              <p className="font-display italic text-2xl sm:text-3xl text-[#D4AF37] text-balance">
                &ldquo;Same Roots. Brighter Futures.&rdquo;
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#F7F1E5]/85 max-w-2xl leading-relaxed">
              11 Batches · One Engineering Family. Welcome to the official feedback and memory-sharing platform for the{' '}
              <span className="font-semibold text-[#F7F1E5]">
                Alumni Get-Together &amp; Professional Networking Event 2026
              </span>
              .
            </p>

            {/* Unboxed Metadata Discipline */}
            <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#F7F1E5]/75">
              <span className="font-medium text-[#D4AF37]">Participating Disciplines:</span>
              <span>Civil</span>
              <span aria-hidden="true">·</span>
              <span>Electrical</span>
              <span aria-hidden="true">·</span>
              <span>Mechanical</span>
              <span aria-hidden="true">·</span>
              <span>QS</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#F7F1E5] font-medium">All HNDEians</span>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={onRateClick}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#8B0000] via-[#B11226] to-[#8B0000] px-7 py-4 text-sm sm:text-base font-semibold tracking-wider text-[#F7F1E5] border border-[#D4AF37]/60 shadow-lg hover:border-[#D4AF37] hover:brightness-110 transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                <span>RATE OUR ASSOCIATION</span>
              </button>

              <button
                type="button"
                onClick={onShareExperienceClick}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-white/5 hover:bg-white/10 px-7 py-4 text-sm sm:text-base font-semibold tracking-wider text-[#F7F1E5] border border-white/20 hover:border-[#D4AF37]/50 transition-all duration-150 whitespace-nowrap cursor-pointer"
              >
                <Camera className="h-4 w-4 text-[#D4AF37]" />
                <span>SHARE YOUR EXPERIENCE</span>
              </button>
            </div>

            {/* Live Community Rating Proof Adjacent to Claim */}
            {totalReviews > 0 && (
              <div className="pt-3 flex items-center gap-3 text-xs sm:text-sm text-[#F7F1E5]/75">
                <div className="flex items-center gap-1 text-[#D4AF37]" aria-label={`${averageRating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= Math.round(averageRating)
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono-num font-semibold text-[#F7F1E5]">
                  {averageRating.toFixed(1)} / 5
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">
                  Rated by {totalReviews} {totalReviews === 1 ? 'alumnus' : 'alumni'}
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Ticket-Inspired Event Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-[#1C1213]/95 to-[#121010]/95 border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              {/* Top Burgundy Header Bar */}
              <div className="rounded-xl bg-gradient-to-r from-[#8B0000] to-[#B11226] px-5 py-4 border border-[#D4AF37]/30">
                <p className="text-xs font-medium tracking-widest text-[#F7F1E5]/90">
                  OFFICIAL ALUMNI CONVERGENCE
                </p>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#F7F1E5]">
                  Alumni Get-Together &amp; Professional Networking Event 2026
                </h2>
              </div>

              <div className="mt-6 space-y-5 divide-y divide-white/10">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs uppercase tracking-wider text-[#F7F1E5]/60">
                    Event Date
                  </span>
                  <span className="font-mono-num text-sm sm:text-base font-semibold text-[#D4AF37] text-right">
                    Sunday, 01 November 2026
                  </span>
                </div>

                <div className="pt-4 flex items-baseline justify-between gap-4">
                  <span className="text-xs uppercase tracking-wider text-[#F7F1E5]/60">
                    Event Time
                  </span>
                  <span className="font-mono-num text-sm sm:text-base font-semibold text-[#F7F1E5] text-right">
                    10.00 AM – 4.00 PM
                  </span>
                </div>

                <div className="pt-4 flex items-baseline justify-between gap-4">
                  <span className="text-xs uppercase tracking-wider text-[#F7F1E5]/60">
                    Venue
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#F7F1E5] text-right">
                    Ramadia Ranmal Holiday Resort, Moratuwa
                  </span>
                </div>

                <div className="pt-4 flex items-baseline justify-between gap-4">
                  <span className="text-xs uppercase tracking-wider text-[#F7F1E5]/60">
                    Community
                  </span>
                  <span className="font-mono-num text-sm font-medium text-[#F7F1E5]/90 text-right">
                    All 11 HNDE Labuduwa Batches
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D4AF37]/25 flex items-center justify-between text-xs text-[#F7F1E5]/70">
                <span>ATI Labuduwa · Galle</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#D4AF37] font-medium">First Alumni Association</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
