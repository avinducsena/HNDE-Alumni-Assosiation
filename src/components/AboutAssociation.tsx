import React, { useState } from 'react';
import campusImage from '../assets/images/campus_ati_labuduwa_1790872328542.jpg';

export const AboutAssociation: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="about"
      className="py-20 sm:py-28 border-b border-white/10 bg-[#141010]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Narrative & Institutional Heritage */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">
              THE FIRST HNDE LABUDUWA ALUMNI ASSOCIATION
            </p>

            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F7F1E5] leading-tight text-balance">
              11 BATCHES. ONE ENGINEERING FAMILY.
            </h2>

            <p className="text-base sm:text-lg text-[#F7F1E5]/90 leading-relaxed">
              From our earliest batch to the newest generation, 11 batches of HNDE Labuduwa alumni come together to reconnect, share experiences, build professional relationships and create a stronger alumni community.
            </p>

            <div className="space-y-4 text-sm sm:text-base text-[#F7F1E5]/75 leading-relaxed pt-2">
              <p>
                HNDE Labuduwa is associated with the{' '}
                <strong className="text-[#F7F1E5] font-semibold">
                  Advanced Technological Institute (ATI) Labuduwa, Galle
                </strong>
                , operating under the{' '}
                <strong className="text-[#F7F1E5] font-semibold">
                  Sri Lanka Institute of Advanced Technological Education (SLIATE)
                </strong>
                .
              </p>
              <p>
                The HNDE engineering community has developed a strong history of producing engineering professionals and maintaining connections among graduates across Sri Lanka and around the world.
              </p>
            </div>

            {/* Core Disciplines & Institutional Address */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/10">
              <div>
                <h3 className="font-display text-xl font-bold text-[#D4AF37]">
                  Engineering Programmes
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-[#F7F1E5]/85">
                  <li>01. Civil Engineering</li>
                  <li>02. Electrical &amp; Electronic Engineering</li>
                  <li>03. Mechanical Engineering</li>
                  <li>04. Quantity Surveying (QS) &amp; Allied Disciplines</li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-[#D4AF37]">
                  Campus Location
                </h3>
                <address className="mt-3 not-italic text-sm text-[#F7F1E5]/85 leading-relaxed">
                  Advanced Technological Institute
                  <br />
                  Labuduwa, Akmeemana
                  <br />
                  Galle, Sri Lanka
                  <br />
                  <span className="text-xs text-[#F7F1E5]/55">
                    Operating under SLIATE
                  </span>
                </address>
              </div>
            </div>
          </div>

          {/* Right Column: Campus Visual Showcase with Fallback */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl bg-[#1A1314] border border-[#D4AF37]/35 shadow-2xl">
              <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[#3A080E] via-[#1B1112] to-[#111111]">
                {!imgError && (
                  <img
                    src={campusImage}
                    alt="Advanced Technological Institute Labuduwa Campus in Galle, Sri Lanka"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#161212] via-transparent to-transparent" />
              </div>

              <div className="p-6 space-y-3">
                <p className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
                  Association Statement
                </p>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#F7F1E5]">
                  The First HNDE Labuduwa Alumni Association
                </p>
                <p className="text-xs sm:text-sm text-[#F7F1E5]/75 leading-relaxed">
                  Formed to unite all 11 batches of the HNDE Labuduwa engineering alumni community under one shared platform for mentorship, industry collaboration, and lifelong fellowship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
