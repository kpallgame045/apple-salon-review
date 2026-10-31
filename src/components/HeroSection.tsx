import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Star, ArrowDown, Clock } from 'lucide-react';

interface HeroSectionProps {
  onScrollToReview: () => void;
  onScrollToServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToReview,
  onScrollToServices,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-ivory-100 via-ivory-50 to-ivory-100 border-b border-cream-border/50">
      {/* Subtle decorative background ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft blush radial glow */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-blush-100/40 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-cream-border/40 blur-2xl" />

        {/* Delicate botanical-inspired arch line art */}
        <svg
          className="absolute right-6 top-10 w-72 h-72 text-blush-200/25 hidden lg:block"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M 30,190 A 70,70 0 0 1 170,190" />
          <path d="M 45,190 A 55,55 0 0 1 155,190" strokeDasharray="3 3" />
          <path d="M 60,190 A 40,40 0 0 1 140,190" />
          <circle cx="100" cy="90" r="14" strokeWidth="0.8" />
          <path d="M 100,104 L 100,140" strokeWidth="0.8" />
          <path d="M 90,120 Q 100,126 110,120" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Authentic Logo Insignia Showcase */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center mb-6"
          >
            <div className="relative p-2 bg-white rounded-t-[3.5rem] rounded-b-2xl border border-cream-border shadow-elevated">
              {/* Subtle gold line accent */}
              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-t-[3rem] rounded-b-xl overflow-hidden bg-ivory-50 flex items-center justify-center p-1.5 border border-blush-100/60">
                <img
                  src="/apple-beauty-salon-logo.jpg"
                  alt="Apple Beauty Salon Kudasan Gandhinagar"
                  className="w-full h-full object-contain filter contrast-105 transition-transform duration-500 hover:scale-105"
                  loading="eager"
                />
              </div>

              {/* Decorative botanical badge */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-charcoal-900 text-ivory-50 text-[10px] tracking-widest uppercase font-medium px-3 py-0.5 rounded-full shadow-sm border border-blush-300/30 whitespace-nowrap">
                Since 1996
              </div>
            </div>

            {/* Location & Heritage Tag */}
            <div className="mt-5 inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-cream-border px-3.5 py-1 rounded-full text-xs text-charcoal-600 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-blush-500" />
              <span className="font-medium text-charcoal-800">Radhe Signature, Kudasan, Gandhinagar</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-4"
          >
            <span className="block text-xs uppercase tracking-widest text-blush-600 font-semibold mb-2">
              Apple Beauty Salon
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-normal tracking-tight text-charcoal-900 leading-tight">
              Thank You for <span className="italic font-normal text-blush-500">Visiting</span>
            </h1>
          </motion.div>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal"
          >
            We&apos;d love to hear about your experience with us. Choose your service and share a few details to craft your review.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
          >
            <button
              onClick={onScrollToReview}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-charcoal-900 text-ivory-50 text-sm font-semibold tracking-wide uppercase shadow-elevated hover:bg-blush-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2.5 group"
            >
              <span>Share Your Experience</span>
              <ArrowDown className="w-4 h-4 text-blush-200 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={onScrollToServices}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-charcoal-800 text-sm font-semibold tracking-wide uppercase border border-cream-border hover:border-blush-300 hover:bg-blush-50/50 shadow-sm transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-blush-500" />
              <span>Explore Our Services</span>
            </button>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-cream-border/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto"
          >
            <div className="flex items-start space-x-2.5">
              <div className="p-1.5 rounded-full bg-blush-100 text-blush-600 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-blush-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal-800">Direct Google Review</p>
                <p className="text-[11px] text-charcoal-500">Official verified link</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="p-1.5 rounded-full bg-blush-100 text-blush-600 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal-800">10:00 AM – 8:30 PM</p>
                <p className="text-[11px] text-charcoal-500">Open 7 days a week</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-start space-x-2.5">
              <div className="p-1.5 rounded-full bg-blush-100 text-blush-600 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal-800">Boutique Care</p>
                <p className="text-[11px] text-charcoal-500">Personalized attention</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
