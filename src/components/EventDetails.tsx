import React, { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import venueImage from '../assets/images/event_resort_venue_1790872341742.jpg';

export const EventDetails: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="event-details"
      className="py-20 sm:py-28 border-b border-white/10 bg-[#141010]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
            Inaugural Gathering · 2026
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-5xl font-bold text-[#F7F1E5] text-balance">
            HNDE Alumni Get-Together &amp; Professional Networking Event 2026
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F7F1E5]/75">
            Organised by the HNDE Labuduwa Alumni Association
          </p>
        </div>

        {/* Three Core Event Information Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DATE CARD */}
          <div className="rounded-2xl bg-[#181212] border border-[#D4AF37]/35 p-7 text-center shadow-xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              DATE
            </span>
            <div className="mt-4 space-y-1">
              <p className="font-mono-num text-5xl font-bold text-[#F7F1E5]">01</p>
              <p className="font-display text-2xl font-bold tracking-widest text-[#D4AF37]">
                NOVEMBER
              </p>
              <p className="font-mono-num text-lg font-semibold text-[#F7F1E5]/80">
                2026
              </p>
            </div>
            <p className="mt-3 text-xs text-[#F7F1E5]/60">Sunday Full-Day Convergence</p>
          </div>

          {/* TIME CARD */}
          <div className="rounded-2xl bg-[#181212] border border-[#D4AF37]/35 p-7 text-center shadow-xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              TIME
            </span>
            <div className="mt-4 space-y-1">
              <p className="font-mono-num text-3xl font-bold text-[#F7F1E5]">
                10:00 AM
              </p>
              <p className="text-sm font-medium text-[#D4AF37]">–</p>
              <p className="font-mono-num text-3xl font-bold text-[#F7F1E5]">
                4:00 PM
              </p>
            </div>
            <p className="mt-3 text-xs text-[#F7F1E5]/60">
              Registration, Networking, Lunch &amp; Fellowship
            </p>
          </div>

          {/* VENUE CARD */}
          <div className="rounded-2xl bg-[#181212] border border-[#D4AF37]/35 p-7 text-center shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
                VENUE
              </span>
              <div className="mt-4 space-y-1">
                <p className="font-display text-2xl font-bold text-[#F7F1E5]">
                  Ramadia Ranmal
                </p>
                <p className="font-display text-xl font-semibold text-[#D4AF37]">
                  Holiday Resort
                </p>
                <p className="text-sm font-medium text-[#F7F1E5]/80">Moratuwa</p>
              </div>
            </div>

            <div className="mt-5">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ramadia+Ranmal+Holiday+Resort+Moratuwa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold tracking-wider text-[#D4AF37] border border-[#D4AF37]/40 transition-colors whitespace-nowrap"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Commemorative Event Ticket Design Panel */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#D4AF37]/45 bg-[#111111] shadow-2xl">
          {/* Red & Gold Header inspired by the Event Ticket */}
          <div className="bg-gradient-to-r from-[#8B0000] via-[#B11226] to-[#8B0000] px-6 sm:px-10 py-5 border-b border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#D4AF37] uppercase">
                HNDE LABUDUWA ALUMNI ASSOCIATION
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F7F1E5]">
                RECONNECT · NETWORK · BUILD A BRIGHTER TOMORROW
              </h3>
            </div>
            <span className="font-mono-num text-xs font-semibold tracking-widest text-[#F7F1E5]/90">
              BATCH 01 – BATCH 11
            </span>
          </div>

          {/* Cream & Dark Split Ticket Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-6 sm:p-10 bg-[#F7F1E5] text-[#111111] flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold tracking-[0.2em] text-[#8B0000] uppercase">
                  OFFICIAL EVENT COMMEMORATIVE PASS
                </p>
                <h4 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] leading-tight">
                  Alumni Get-Together &amp; Professional Networking Event 2026
                </h4>
                <p className="text-sm text-[#111111]/80 leading-relaxed">
                  Bringing together Civil, Electrical, Mechanical, QS, and all HNDEians from ATI Labuduwa for a landmark day of professional networking and shared memories.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#111111]/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="block uppercase tracking-wider text-[#111111]/60 font-semibold">
                    Date
                  </span>
                  <span className="font-mono-num font-bold text-sm text-[#8B0000]">
                    Sunday, 01 Nov 2026
                  </span>
                </div>
                <div>
                  <span className="block uppercase tracking-wider text-[#111111]/60 font-semibold">
                    Time
                  </span>
                  <span className="font-mono-num font-bold text-sm text-[#111111]">
                    10.00 AM – 4.00 PM
                  </span>
                </div>
                <div>
                  <span className="block uppercase tracking-wider text-[#111111]/60 font-semibold">
                    Venue
                  </span>
                  <span className="font-bold text-sm text-[#111111]">
                    Ramadia Ranmal, Moratuwa
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[240px] bg-gradient-to-br from-[#2B0508] to-[#111111]">
              {!imgError && (
                <img
                  src={venueImage}
                  alt="Ramadia Ranmal Holiday Resort Moratuwa Event Venue"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover opacity-80"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <p className="font-display italic text-xl font-semibold text-[#D4AF37]">
                  &ldquo;Once an HNDEian, Always an HNDEian.&rdquo;
                </p>
                <p className="mt-1 text-xs text-[#F7F1E5]/85">
                  Civil · Electrical · Mechanical · QS · All HNDEians
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
