import React from 'react';
import { motion } from 'framer-motion';
import {
  Scissors,
  Sparkles,
  HeartHandshake,
  Feather,
  Droplets,
  Crown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { SHOWCASE_CARDS, SALON_INFO } from '../data/servicesData';

interface ServiceShowcaseProps {
  onSelectServiceAndScroll: (serviceId: string) => void;
}

export const ServiceShowcase: React.FC<ServiceShowcaseProps> = ({
  onSelectServiceAndScroll,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scissors':
        return <Scissors className="w-5 h-5 text-blush-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-blush-500" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-blush-500" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-blush-500" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-blush-500" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-blush-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-blush-500" />;
    }
  };

  return (
    <section id="services-section" className="py-16 md:py-24 bg-ivory-50 border-t border-cream-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white text-charcoal-700 text-xs font-semibold uppercase tracking-wider mb-3 border border-cream-border shadow-xs">
            <span>Verified Service Catalog</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal tracking-tight mb-3">
            Boutique Services &amp; Rituals
          </h2>
          <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
            From precision styling and gentle waxing to bridal transformations, explore the signature offerings at Apple Beauty Salon.
          </p>
        </div>

        {/* 6 Visually Distinct Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {SHOWCASE_CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group bg-white rounded-2xl border border-cream-border p-6 flex flex-col justify-between shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Card Icon & Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blush-50 border border-blush-100 flex items-center justify-center transition-colors group-hover:bg-blush-100/70">
                    {getIcon(card.iconName)}
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-charcoal-400">
                    Catalog 0{idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-2.5 group-hover:text-blush-600 transition-colors">
                  {card.categoryName}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed mb-5">
                  {card.description}
                </p>

                {/* Features list */}
                <div className="mb-6 pt-3 border-t border-cream-border/50">
                  <ul className="space-y-1.5">
                    {card.features.map((feature, fIdx) => (
                      <li key={fIdx} className="text-xs text-charcoal-500 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blush-300 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectServiceAndScroll(card.targetServiceId)}
                className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-ivory-100 hover:bg-charcoal-900 text-charcoal-800 hover:text-white border border-cream-border hover:border-charcoal-900 text-xs font-semibold uppercase tracking-wider transition-all duration-200 group-hover:shadow-sm"
              >
                <span>Review This Service</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* View All Services on Official Website */}
        <div className="mt-12 text-center">
          <a
            href={SALON_INFO.servicesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-charcoal-700 hover:text-blush-600 transition-colors bg-white px-5 py-2.5 rounded-full border border-cream-border shadow-xs hover:border-blush-300"
          >
            <span>Browse Full Service Menu on Official Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
