import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface FooterProps {
  onSocialPlaceholderClick?: (platform: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSocialPlaceholderClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const socialLinks = [
    {
      name: 'Facebook',
      url: import.meta.env.VITE_SOCIAL_FACEBOOK_URL || '',
    },
    {
      name: 'Instagram',
      url: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL || '',
    },
    {
      name: 'LinkedIn',
      url: import.meta.env.VITE_SOCIAL_LINKEDIN_URL || '',
    },
    {
      name: 'WhatsApp',
      url: import.meta.env.VITE_SOCIAL_WHATSAPP_URL || '',
    },
  ];

  const handleNav = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="footer-contact"
      className="bg-[#0D0A0A] border-t border-[#D4AF37]/25 text-[#F7F1E5]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Slogan */}
          <div className="lg:col-span-5 space-y-3">
            <p className="font-display text-2xl sm:text-3xl font-bold tracking-wider text-[#F7F1E5]">
              HNDE LABUDUWA ALUMNI ASSOCIATION
            </p>
            <p className="font-display italic text-lg text-[#D4AF37]">
              &ldquo;Same Roots. Brighter Futures.&rdquo;
            </p>
            <p className="text-sm text-[#F7F1E5]/70 max-w-sm leading-relaxed">
              Bringing together all 11 batches of the HNDE Labuduwa engineering community from Advanced Technological Institute (ATI) Labuduwa, Galle.
            </p>
            <p className="pt-2 font-display italic text-base text-[#F7F1E5]/90">
              &ldquo;Once an HNDEian, Always an HNDEian.&rdquo;
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-lg font-bold tracking-wider text-[#D4AF37] uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F7F1E5]/80">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('hero')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('rate-association')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Rate Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('share-memories')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Share Memories
                </button>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-[#F7F1E5]/60 hover:text-[#D4AF37] transition-colors"
                >
                  Organizer Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Details & Social Channels */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-display text-lg font-bold tracking-wider text-[#D4AF37] uppercase">
              Event 2026
            </h3>
            <div className="text-sm text-[#F7F1E5]/85 space-y-1">
              <p className="font-semibold text-[#F7F1E5]">01 November 2026 · 10.00 AM – 4.00 PM</p>
              <p>Ramadia Ranmal Holiday Resort</p>
              <p>Moratuwa, Sri Lanka</p>
            </div>

            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-[#F7F1E5]/55 mb-2.5">
                Community Channels
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {socialLinks.map((item) =>
                  item.url ? (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 text-[#F7F1E5] border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() =>
                        onSocialPlaceholderClick && onSocialPlaceholderClick(item.name)
                      }
                      className="rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 text-[#F7F1E5]/75 hover:text-[#D4AF37] border border-white/10 transition-colors cursor-pointer"
                    >
                      {item.name}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F1E5]/55">
          <p>© 2026 HNDE Labuduwa Alumni Association. All rights reserved.</p>
          <p>ATI Labuduwa · Galle · Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
};
