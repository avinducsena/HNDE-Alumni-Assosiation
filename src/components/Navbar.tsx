import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-40 h-16 w-full bg-[#111111]/90 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display text-xl sm:text-2xl font-bold tracking-wider text-[#F7F1E5] hover:text-[#D4AF37] transition-colors whitespace-nowrap"
        >
          HNDE LABUDUWA
        </Link>

        {/* Zone 2: Clean text navigation links */}
        <nav
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#F7F1E5]/80"
          aria-label="Primary Navigation"
        >
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className="hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('association')}
            className="hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            The Association
          </button>
          <Link
            to="/reviews"
            className={`hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap ${
              location.pathname === '/reviews' ? 'text-[#D4AF37] underline' : ''
            }`}
          >
            Reviews
          </Link>
          <button
            type="button"
            onClick={() => scrollToSection('share-memories')}
            className="hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            Share Memories
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('footer-contact')}
            className="hover:text-[#D4AF37] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/admin"
            className={`text-xs font-medium transition-colors whitespace-nowrap ${
              location.pathname === '/admin'
                ? 'text-[#D4AF37]'
                : 'text-[#F7F1E5]/60 hover:text-[#F7F1E5]'
            }`}
          >
            Admin
          </Link>
          <button
            type="button"
            onClick={() => scrollToSection('rate-association')}
            className="rounded-lg bg-gradient-to-r from-[#8B0000] to-[#B11226] px-4 py-2 text-xs font-semibold tracking-wider text-[#F7F1E5] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-150 whitespace-nowrap cursor-pointer"
          >
            Rate Us
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-[#F7F1E5]/85 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141111]/98 border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => scrollToSection('hero')}
              className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-[#F7F1E5] hover:bg-white/5"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-[#F7F1E5] hover:bg-white/5"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('association')}
              className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-[#F7F1E5] hover:bg-white/5"
            >
              The Association
            </button>
            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-[#F7F1E5] hover:bg-white/5"
            >
              Reviews
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection('share-memories')}
              className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-[#F7F1E5] hover:bg-white/5"
            >
              Share Memories
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('footer-contact')}
              className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-[#F7F1E5] hover:bg-white/5"
            >
              Contact
            </button>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium text-[#F7F1E5]/70 hover:bg-white/5"
            >
              Admin Portal
            </Link>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('rate-association')}
                className="w-full rounded-xl bg-gradient-to-r from-[#8B0000] to-[#B11226] py-3 px-4 text-center text-sm font-semibold text-[#F7F1E5] border border-[#D4AF37]/50"
              >
                Rate Our Association
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
