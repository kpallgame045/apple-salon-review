import React, { useState } from 'react';
import { Copy, Check, ExternalLink, RefreshCw, Edit3, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SALON_INFO } from '../data/servicesData';

interface ReviewDraftCardProps {
  draftText: string;
  onDraftChange: (text: string) => void;
  onGenerateAnother: () => void;
  isGenerating: boolean;
  hasFeedback: boolean;
  selectedServiceName: string;
  draftSource?: 'gemini_ai' | 'prepared_template_pool';
  language: 'en' | 'hi' | 'gu';
}

export const ReviewDraftCard: React.FC<ReviewDraftCardProps> = ({
  draftText,
  onDraftChange,
  onGenerateAnother,
  isGenerating,
  hasFeedback,
  selectedServiceName,
  draftSource = 'prepared_template_pool',
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#C16A5B', '#D58F82', '#F3D6CF', '#D6C09C', '#202523'],
      });
    } catch {
      // ignore
    }
  };

  const handleCopy = async () => {
    if (!draftText.trim()) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(draftText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = draftText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setCopyError(false);
      triggerConfetti();
      setTimeout(() => setCopied(false), 3500);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const isDraftReady = draftText.trim().length > 0;

  return (
    <div className="bg-white rounded-2xl border border-cream-border shadow-elevated p-5 sm:p-7 relative overflow-hidden transition-all">
      {/* Top Bar with Status and Source Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-cream-border/60">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blush-400 animate-pulse" />
          <h3 className="text-base font-semibold text-charcoal-900 font-serif">
            Your Review Draft
          </h3>
          <span className="text-xs text-charcoal-400 font-sans">
            (Editable)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Service badge */}
          <span className="text-xs bg-ivory-200 text-charcoal-700 px-2.5 py-1 rounded-md font-medium border border-cream-border">
            {selectedServiceName}
          </span>

          {/* Source badge */}
          <span
            className={`inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-full font-medium ${
              draftSource === 'gemini_ai'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {draftSource === 'gemini_ai' ? (
              <>
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Personalized Draft</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Prepared Template (Zero Lag)</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Draft Text Area */}
      <div className="mt-4 relative">
        <label htmlFor="review-draft-input" className="sr-only">
          Customer Review Draft Text
        </label>
        <textarea
          id="review-draft-input"
          value={draftText}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder={
            hasFeedback
              ? 'Your draft will appear here. You can refine any sentence...'
              : 'Choose a service and share a few details above to create your review draft...'
          }
          rows={5}
          className="w-full p-4 rounded-xl bg-ivory-50/70 border border-cream-border text-charcoal-800 text-sm leading-relaxed placeholder-charcoal-400 focus:bg-white focus:border-blush-400 focus:ring-2 focus:ring-blush-200 focus:outline-none transition-all resize-y font-sans"
        />

        {/* Edit indicator */}
        <div className="absolute right-3 bottom-3.5 pointer-events-none flex items-center space-x-1 text-[11px] text-charcoal-400 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm border border-cream-border/40">
          <Edit3 className="w-3 h-3 text-blush-500" />
          <span>Click to edit text</span>
        </div>
      </div>

      {/* Validation / Helper Guidance */}
      {!isDraftReady && (
        <div className="mt-3 flex items-start space-x-2 text-xs text-charcoal-500 bg-ivory-100 p-3 rounded-xl border border-cream-border/70">
          <AlertCircle className="w-4 h-4 text-blush-500 mt-0.5 flex-shrink-0" />
          <p>
            Please write a few words about your visit or select experience highlights above to shape your review draft.
          </p>
        </div>
      )}

      {/* Copy notification banner */}
      {copied && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">
            Draft successfully copied to your clipboard! Now click &quot;Open Google Review&quot; to paste and post it.
          </span>
        </div>
      )}

      {copyError && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Please select and copy the text manually from the box above.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-cream-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={!isDraftReady}
          className={`flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isDraftReady
              ? copied
                ? 'bg-emerald-600 text-white'
                : 'bg-charcoal-900 text-white hover:bg-blush-600 hover:shadow active:scale-[0.99]'
              : 'bg-ivory-300 text-charcoal-400 cursor-not-allowed border border-cream-border'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-blush-200" />
              <span>Copy Review</span>
            </>
          )}
        </button>

        {/* Generate Another Draft Button */}
        <button
          type="button"
          onClick={onGenerateAnother}
          disabled={isGenerating}
          className="inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold bg-ivory-100 text-charcoal-800 border border-cream-border hover:bg-blush-50 hover:border-blush-300 transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
          title="Retrieve another prepared template or draft"
        >
          <RefreshCw className={`w-4 h-4 text-blush-600 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="whitespace-nowrap">Generate Another Draft</span>
        </button>

        {/* Open Google Review Button */}
        <a
          href={SALON_INFO.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={triggerConfetti}
          className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-charcoal-900 border-2 border-charcoal-900 hover:border-blush-600 hover:text-blush-600 hover:bg-blush-50/40 transition-all duration-300 shadow-sm active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-blush-400"
        >
          <span>Open Google Review</span>
          <ExternalLink className="w-4 h-4 text-charcoal-600" />
        </a>
      </div>

      <div className="mt-3 text-center">
        <p className="text-[11px] text-charcoal-400">
          Clicking opens Apple Beauty Salon&apos;s verified Google Maps review page in a new window. You can paste your text and assign your rating there.
        </p>
      </div>
    </div>
  );
};
