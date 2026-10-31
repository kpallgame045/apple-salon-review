import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Star } from 'lucide-react';
import { SALON_INFO } from '../data/servicesData';

export const SalonFooter: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 text-ivory-100 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-charcoal-800/80">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center space-x-3.5 mb-4">
              <div className="w-12 h-14 bg-white rounded-t-full rounded-b-md p-1 flex items-center justify-center overflow-hidden border border-cream-border/20 shadow-sm">
                <img
                  src="/apple-beauty-salon-logo.jpg"
                  alt="Apple Beauty Salon Kudasan"
                  className="w-full h-full object-contain filter contrast-105"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-white tracking-wide">
                  {SALON_INFO.name}
                </h3>
                <p className="text-xs text-blush-300 font-medium tracking-wider uppercase">
                  Boutique Beauty Studio • Est. {SALON_INFO.sinceYear}
                </p>
              </div>
            </div>

            <p className="text-xs text-charcoal-300 leading-relaxed max-w-sm mb-6">
              Dedicated to tailored beauty rituals, skincare therapy, and relaxing self-care experiences in Kudasan, Gandhinagar.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={SALON_INFO.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blush-600 hover:bg-blush-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Open Google Review</span>
              </a>

              <a
                href={SALON_INFO.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-ivory-100 text-xs font-semibold uppercase tracking-wider transition-colors border border-charcoal-700"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-charcoal-400" />
              </a>

              <a
                href={`tel:${SALON_INFO.phone}`}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-ivory-100 text-xs font-semibold uppercase tracking-wider transition-colors border border-charcoal-700"
              >
                <Phone className="w-3.5 h-3.5 text-blush-400" />
                <span>Contact Salon</span>
              </a>
            </div>
          </div>

          {/* Location & Address Column */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-ivory-400 mb-4">
              Salon Location
            </h4>
            <div className="space-y-3 text-xs text-charcoal-300 leading-relaxed">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-blush-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{SALON_INFO.locationBrief}</p>
                  <p className="mt-0.5">{SALON_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 pt-2">
                <Clock className="w-4 h-4 text-blush-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Business Hours</p>
                  <p className="mt-0.5">{SALON_INFO.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Contact Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-ivory-400 mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs text-charcoal-300">
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-blush-400 flex-shrink-0" />
                <a
                  href={`tel:${SALON_INFO.phone}`}
                  className="text-white hover:text-blush-300 transition-colors font-medium text-sm"
                >
                  {SALON_INFO.phoneDisplay}
                </a>
              </div>
              <p className="text-[11px] text-charcoal-400 pt-1">
                Appointments, bridal consultations, and service inquiries are welcomed daily.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 gap-4">
          <p>
            © {new Date().getFullYear()} {SALON_INFO.name}. All rights reserved.
          </p>
          <p className="text-[11px] text-charcoal-500">
            Phase 1 Review Experience Platform • Verified Kudasan Location
          </p>
        </div>
      </div>
    </footer>
  );
};
