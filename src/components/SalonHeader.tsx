import React, { useState } from 'react';
import { MapPin, Phone, Menu, X, Star, QrCode } from 'lucide-react';
import { SALON_INFO } from '../data/servicesData';

interface SalonHeaderProps {
  onScrollToReview: () => void;
  onScrollToServices: () => void;
  onOpenQR: () => void;
}

export const SalonHeader: React.FC<SalonHeaderProps> = ({
  onScrollToReview,
  onScrollToServices,
  onOpenQR,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ivory-100/90 backdrop-blur-md border-b border-cream-border/70 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="relative w-12 h-14 bg-white rounded-t-full rounded-b-md shadow-sm border border-stone-200/80 overflow-hidden flex items-center justify-center p-0.5 group">
              <img
                src="/apple-beauty-salon-logo.jpg"
                alt="Apple Beauty Salon Official Insignia"
                className="w-full h-full object-contain filter contrast-105"
                loading="eager"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-charcoal-900 leading-none">
                  Apple Beauty Salon
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase bg-blush-100 text-blush-600 border border-blush-200">
                  Est. 1996
                </span>
              </div>
              <p className="flex items-center text-xs text-charcoal-500 mt-1">
                <MapPin className="w-3 h-3 text-blush-500 mr-1 flex-shrink-0" />
                <span className="truncate">Kudasan, Gandhinagar</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-charcoal-700">
            <button
              onClick={onScrollToServices}
              className="hover:text-blush-600 transition-colors focus-visible:ring-2 focus-visible:ring-blush-400 rounded-md py-1 px-2"
            >
              Services
            </button>
            <button
              onClick={onScrollToReview}
              className="hover:text-blush-600 transition-colors focus-visible:ring-2 focus-visible:ring-blush-400 rounded-md py-1 px-2"
            >
              Share Review
            </button>
            <button
              onClick={onOpenQR}
              className="inline-flex items-center space-x-1.5 hover:text-blush-600 transition-colors py-1 px-2"
              title="Show In-Store QR Code"
            >
              <QrCode className="w-4 h-4 text-blush-500" />
              <span>In-Store QR</span>
            </button>
            <a
              href={SALON_INFO.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blush-600 transition-colors py-1 px-2"
            >
              Official Website
            </a>
            <a
              href={`tel:${SALON_INFO.phone}`}
              className="flex items-center space-x-1.5 text-charcoal-600 hover:text-blush-600 transition-colors py-1 px-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{SALON_INFO.phoneDisplay}</span>
            </a>
          </nav>

          {/* Desktop Header CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onScrollToReview}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-charcoal-900 text-ivory-50 text-xs uppercase tracking-wider font-semibold hover:bg-blush-600 transition-all duration-300 shadow-sm hover:shadow active:scale-95"
            >
              <Star className="w-3.5 h-3.5 text-gold-subtle fill-gold-subtle" />
              <span>Rate Your Visit</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-700 hover:bg-ivory-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blush-400"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-2 border-t border-cream-border/60 bg-ivory-50 rounded-b-2xl shadow-elevated transition-all">
            <div className="flex flex-col space-y-3 text-sm">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScrollToServices();
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-ivory-200 text-charcoal-800 font-medium"
              >
                Explore Salon Services
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScrollToReview();
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-ivory-200 text-charcoal-800 font-medium"
              >
                Share Your Experience
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQR();
                }}
                className="text-left flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-ivory-200 text-charcoal-800 font-medium"
              >
                <QrCode className="w-4 h-4 text-blush-500" />
                <span>Show In-Store QR Code</span>
              </button>
              <a
                href={SALON_INFO.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-ivory-200 text-charcoal-800 font-medium"
              >
                Visit Official Website ↗
              </a>
              <a
                href={`tel:${SALON_INFO.phone}`}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blush-50 text-blush-600 font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>Call {SALON_INFO.phoneDisplay}</span>
              </a>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onScrollToReview();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-charcoal-900 text-white font-medium text-sm tracking-wide shadow-sm"
                >
                  <Star className="w-4 h-4 text-gold-subtle fill-gold-subtle" />
                  <span>Write a Google Review</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
