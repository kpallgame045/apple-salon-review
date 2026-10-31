import React from 'react';
import { CheckCircle2, MessageSquare, Sparkles, Star, Languages } from 'lucide-react';
import { OFFICIAL_SERVICES, EXPERIENCE_ASPECTS } from '../data/servicesData';
import { ReviewDraftCard } from './ReviewDraftCard';

interface ReviewFormProps {
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
  feedbackText: string;
  onFeedbackChange: (text: string) => void;
  selectedLanguage: 'en' | 'hi' | 'gu';
  onSelectLanguage: (lang: 'en' | 'hi' | 'gu') => void;
  rating: number;
  onRatingChange: (stars: number) => void;
  selectedAspects: string[];
  onToggleAspect: (aspectId: string) => void;
  draftText: string;
  onDraftChange: (text: string) => void;
  onGenerateAnother: () => void;
  isGenerating: boolean;
  draftSource: 'gemini_ai' | 'prepared_template_pool';
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  selectedServiceId,
  onSelectService,
  feedbackText,
  onFeedbackChange,
  selectedLanguage,
  onSelectLanguage,
  rating,
  onRatingChange,
  selectedAspects,
  onToggleAspect,
  draftText,
  onDraftChange,
  onGenerateAnother,
  isGenerating,
  draftSource,
}) => {
  const selectedServiceObj = OFFICIAL_SERVICES.find((s) => s.id === selectedServiceId);
  const selectedServiceName = selectedServiceObj ? selectedServiceObj.name : 'Selected Service';

  const languages: { id: 'en' | 'hi' | 'gu'; label: string; scriptName: string }[] = [
    { id: 'en', label: 'English', scriptName: 'English' },
    { id: 'gu', label: 'Gujarati', scriptName: 'ગુજરાતી' },
    { id: 'hi', label: 'Hindi', scriptName: 'हिन्दी' },
  ];

  return (
    <section id="review-section" className="py-16 md:py-24 bg-ivory-100 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blush-100/70 text-blush-600 text-xs font-semibold uppercase tracking-wider mb-3 border border-blush-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Review Experience</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 font-normal tracking-tight mb-3 uppercase">
            How Was Your Experience?
          </h2>
          <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
            Share your experience at Apple Beauty Salon. We&apos;ll help you put your genuine feedback into words.
          </p>
        </div>

        {/* Review Flow Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-cream-border p-6 sm:p-10 shadow-soft mb-8">
          {/* STEP 1: Service Selection */}
          <div className="mb-9">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                1. Select the Service You Received
              </label>
              <span className="text-xs text-blush-500 font-medium">
                {OFFICIAL_SERVICES.length} verified salon services
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {OFFICIAL_SERVICES.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => onSelectService(service.id)}
                    className={`relative p-3 rounded-xl text-left transition-all duration-200 border text-xs sm:text-sm font-medium flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 ${
                      isSelected
                        ? 'bg-charcoal-900 text-ivory-50 border-charcoal-900 shadow-md ring-1 ring-charcoal-900'
                        : 'bg-white hover:bg-blush-50/50 text-charcoal-700 border-cream-border hover:border-blush-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium pr-1">{service.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-gold-subtle flex-shrink-0" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 transition-colors ${
                        isSelected ? 'text-ivory-300' : 'text-charcoal-400 group-hover:text-blush-500'
                      }`}
                    >
                      {service.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Rating & Sentiment */}
          <div className="mb-8 pb-6 border-b border-cream-border/60">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
              2. Your Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onRatingChange(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-stone-300 fill-stone-100'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-charcoal-500 ml-2 font-medium">
                {rating === 5 ? '5.0 — Outstanding Visit' : `${rating}.0 Stars`}
              </span>
            </div>
          </div>

          {/* STEP 3: Customer Feedback */}
          <div className="mb-9">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="customer-feedback"
                className="block text-xs font-semibold uppercase tracking-wider text-charcoal-500"
              >
                3. Your Genuine Feedback &amp; Notes
              </label>
              <span className="text-xs text-charcoal-400">
                {feedbackText.length} characters
              </span>
            </div>

            <div className="relative">
              <textarea
                id="customer-feedback"
                value={feedbackText}
                onChange={(e) => onFeedbackChange(e.target.value)}
                rows={4}
                placeholder="Tell us about the service you received and what you would like to share..."
                className="w-full p-4 rounded-xl bg-ivory-50/80 border border-cream-border text-charcoal-800 text-sm leading-relaxed placeholder-charcoal-400 focus:bg-white focus:border-blush-400 focus:ring-2 focus:ring-blush-200 focus:outline-none transition-all resize-y"
              />
              <div className="absolute right-3 bottom-3 pointer-events-none text-charcoal-400">
                <MessageSquare className="w-4 h-4 opacity-40" />
              </div>
            </div>

            {/* Optional Highlights Chips */}
            <div className="mt-4">
              <p className="text-xs text-charcoal-500 mb-2 font-medium">
                Optional: Tap highlights that stood out during your visit:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_ASPECTS.map((aspect) => {
                  const isChecked = selectedAspects.includes(aspect.id);
                  return (
                    <button
                      key={aspect.id}
                      type="button"
                      onClick={() => onToggleAspect(aspect.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center space-x-1.5 ${
                        isChecked
                          ? 'bg-blush-100 text-blush-700 border-blush-300 font-medium'
                          : 'bg-white text-charcoal-600 border-cream-border hover:border-blush-200'
                      }`}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      <span>{aspect.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 4: Language Selection */}
          <div className="mb-6 pt-4 pb-2 border-t border-cream-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              <Languages className="w-4 h-4 text-blush-500" />
              <span>4. Review Language</span>
            </div>

            <div
              role="radiogroup"
              aria-label="Select draft language"
              className="inline-flex p-1 bg-ivory-200/80 rounded-xl border border-cream-border"
            >
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelectLanguage(lang.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 ${
                      isSelected
                        ? 'bg-white text-charcoal-900 shadow-sm font-semibold'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-white/40'
                    }`}
                  >
                    <span>{lang.scriptName}</span>
                    <span className="hidden sm:inline text-[10px] text-charcoal-400 ml-1">
                      ({lang.label})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: Review Draft Display */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                5. Review Draft for Google
              </label>
              <span className="text-[11px] text-charcoal-400">
                Edit freely before copying
              </span>
            </div>

            <ReviewDraftCard
              draftText={draftText}
              onDraftChange={onDraftChange}
              onGenerateAnother={onGenerateAnother}
              isGenerating={isGenerating}
              hasFeedback={feedbackText.trim().length > 0 || selectedAspects.length > 0}
              selectedServiceName={selectedServiceName}
              draftSource={draftSource}
              language={selectedLanguage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
