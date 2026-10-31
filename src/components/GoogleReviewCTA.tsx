import React from 'react';
import { Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { SALON_INFO } from '../data/servicesData';

export const GoogleReviewCTA: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-ivory-100 via-blush-50/40 to-ivory-100 border-t border-cream-border/70 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl border border-cream-border p-8 sm:p-12 shadow-elevated text-center">
          {/* Rating stars banner */}
          <div className="flex items-center justify-center space-x-1.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal-900 font-normal tracking-tight mb-3">
            Every Thought Helps Us Flourish
          </h2>

          <p className="text-sm sm:text-base text-charcoal-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Your authentic feedback honors our team&apos;s dedication since 1996 and helps neighbors across Gandhinagar make informed self-care choices.
          </p>

          {/* 3 Step Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-ivory-50 border border-cream-border">
              <div className="w-6 h-6 rounded-full bg-blush-100 text-blush-600 text-xs font-bold flex items-center justify-center mb-2">
                1
              </div>
              <h4 className="text-xs font-semibold text-charcoal-800 mb-1">
                Refine Your Words
              </h4>
              <p className="text-[11px] text-charcoal-500">
                Choose your service and adjust the generated review draft.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-ivory-50 border border-cream-border">
              <div className="w-6 h-6 rounded-full bg-blush-100 text-blush-600 text-xs font-bold flex items-center justify-center mb-2">
                2
              </div>
              <h4 className="text-xs font-semibold text-charcoal-800 mb-1">
                Copy With One Tap
              </h4>
              <p className="text-[11px] text-charcoal-500">
                Copy the text directly to your device clipboard.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-ivory-50 border border-cream-border">
              <div className="w-6 h-6 rounded-full bg-blush-100 text-blush-600 text-xs font-bold flex items-center justify-center mb-2">
                3
              </div>
              <h4 className="text-xs font-semibold text-charcoal-800 mb-1">
                Paste on Google
              </h4>
              <p className="text-[11px] text-charcoal-500">
                Open Google Reviews, paste your feedback, and select your rating.
              </p>
            </div>
          </div>

          {/* Primary External CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={SALON_INFO.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full bg-charcoal-900 text-white font-semibold text-sm uppercase tracking-wider hover:bg-blush-600 hover:shadow-lg transition-all duration-300 shadow-md group active:scale-98"
            >
              <span>Open Google Review Directly</span>
              <ExternalLink className="w-4 h-4 text-blush-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-charcoal-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct link to official Google Business Profile (CfqPqR1K8nwbEBM)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
