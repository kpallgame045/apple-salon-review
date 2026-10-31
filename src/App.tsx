import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  MapPin,
  Edit3,
} from 'lucide-react';
import { FloatingSalonBackdrop } from './components/FloatingSalonBackdrop';
import { retrieveReviewDraft, markReviewAsUsed } from './lib/supabaseClient';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CfqPqR1K8nwbEBM/review';
const FLASHDESIGN_URL = 'https://www.instagram.com/flashdesign_ai/';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewId, setReviewId] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const initialFetchDone = useRef<boolean>(false);

  // Trigger celebratory pastel confetti upon copy
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 36,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#C16A5B', '#D58F82', '#E2A9B8', '#D6C09C', '#C4B5FD'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore confetti error
    }
  };

  // 1-Click Clipboard copy handler without extra prompts or dialogs
  const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
    if (!textToCopy || textToCopy.trim() === '') return false;

    const cleanText = textToCopy.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanText);
        setIsCopied(true);
        triggerConfetti();

        // Mark as used or save to Supabase in background
        markReviewAsUsed(reviewId, cleanText).catch(() => {});
        return true;
      } else {
        // Fallback for non-https or restricted clipboard contexts
        const textArea = document.createElement('textarea');
        textArea.value = cleanText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          setIsCopied(true);
          triggerConfetti();
          markReviewAsUsed(reviewId, cleanText).catch(() => {});
          return true;
        }
      }
    } catch (err) {
      console.warn('Clipboard copy permission notice:', err);
    }

    setIsCopied(false);
    return false;
  };

  // Fetch prepared or newly generated English review draft
  const handleFetchReview = useCallback(async (forceNew = false) => {
    setIsLoading(true);
    setErrorMessage('');
    setIsCopied(false);

    try {
      // 1. Try server-side API endpoint first (handles Gemini 3.1 Flash Lite & Supabase)
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentText: reviewText,
          forceNew,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.reviewText) {
          setReviewText(data.reviewText);
          setReviewId(data.id || '');
          return;
        }
      }

      // 2. Direct Supabase / Curated English Fallback
      const fallback = await retrieveReviewDraft(reviewText);
      if (fallback && fallback.reviewText) {
        setReviewText(fallback.reviewText);
        setReviewId(fallback.id || '');
      } else {
        throw new Error('No review suggestion could be prepared right now. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Error fetching review draft:', err);
      try {
        const fallback = await retrieveReviewDraft(reviewText);
        if (fallback?.reviewText) {
          setReviewText(fallback.reviewText);
          setReviewId(fallback.id || '');
          return;
        }
      } catch {
        // ignore
      }
      const msg = err instanceof Error ? err.message : 'We could not fetch your review draft right now. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [reviewText]);

  // Load initial review draft on page open (Zero API Delay)
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      handleFetchReview(false);
    }
  }, [handleFetchReview]);

  // Handle Open Google Review
  const handleOpenGoogleReview = async () => {
    // Copy review text to clipboard and mark as used
    await copyToClipboard(reviewText);

    // Launch official Google review URL in a new browser tab
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-pastel-mesh flex flex-col justify-between items-center p-4 sm:p-6 md:p-8 relative selection:bg-blush-200 selection:text-charcoal-900 font-sans overflow-x-hidden">
      {/* 3D Photorealistic Beauty Salon Decorative Elements Floating in Background */}
      <FloatingSalonBackdrop />

      {/* Subtle Pastel Ambient Orbs (Blush Pink, Lavender, Peach, Cream) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-pink-100/50 blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-purple-100/50 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-amber-50/60 blur-3xl" />
      </div>

      {/* Main Single-Card Container (Compact & Mobile-First) */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center z-10 my-auto">
        
        {/* HEADER SECTION: Business Logo, Business Name & Main Heading */}
        <header className="flex flex-col items-center text-center mt-2 mb-6 w-full">
          {/* Element 1: Original Business Logo */}
          <div className="relative w-28 h-32 sm:w-32 sm:h-36 rounded-t-full rounded-b-2xl p-1 bg-white/95 shadow-elevated border border-blush-200/80 flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-200 backdrop-blur-xs">
            <img
              src="/apple-beauty-salon-logo.jpg"
              alt="Apple Beauty Salon Official Logo"
              className="w-full h-full object-contain filter contrast-105 rounded-t-full rounded-b-xl"
              loading="eager"
            />
          </div>

          {/* Location Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-blush-200/70 text-xs font-semibold text-charcoal-700 shadow-xs mb-3 backdrop-blur-xs">
            <MapPin className="w-3.5 h-3.5 text-blush-500" />
            <span>Radhe Signature, Kudasan</span>
          </div>

          {/* Element 2: Business Name */}
          <h2 className="text-sm sm:text-base font-semibold uppercase tracking-widest text-blush-600 mb-1">
            Apple Beauty Salon
          </h2>

          {/* Element 3: Main Heading */}
          <h1 className="text-2xl sm:text-4xl font-serif text-charcoal-900 font-normal tracking-tight leading-tight">
            Share Your Google Review
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-charcoal-600 font-normal max-w-sm">
            We&apos;d love to hear about your experience. Personalize your review below, copy it, and share it on Google!
          </p>
        </header>

        {/* Element 9: ERROR STATE */}
        {errorMessage && !isLoading && (
          <div className="w-full bg-rose-50/95 border border-rose-200 text-rose-800 p-4 rounded-2xl text-sm flex items-start gap-3 mb-5 shadow-sm animate-fadeIn backdrop-blur-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-xs sm:text-sm">{errorMessage}</p>
              <button
                type="button"
                onClick={() => handleFetchReview(true)}
                className="mt-2 px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Element 9: LOADING STATE */}
        {isLoading && (
          <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-elevated border border-blush-100 mb-6 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="relative w-11 h-11 mb-3.5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-3 border-blush-100 border-t-blush-500 animate-spin" />
              <Sparkles className="w-5 h-5 text-blush-500" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-charcoal-800 tracking-tight">
              Preparing your review suggestion...
            </h3>
            <p className="text-xs text-charcoal-400 mt-1">
              Selecting an authentic draft from our prepared pool
            </p>
          </div>
        )}

        {/* Element 4, 5, 6, 7: REVIEW DISPLAY CARD & ACTION BUTTONS */}
        {!isLoading && reviewText && (
          <div className="w-full flex flex-col gap-4 animate-fadeIn">
            {/* Primary Review Card with Readable Typography & Padding */}
            <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-elevated border border-blush-100 relative">
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-cream-border/70">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-600 flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  Your Review Suggestion
                </span>
                <div className="flex items-center gap-1 text-charcoal-400 text-xs">
                  <Edit3 className="w-3.5 h-3.5 text-blush-500" />
                  <span className="text-[11px] font-medium text-charcoal-500">Tap to edit</span>
                </div>
              </div>

              {/* Element 4: Review Display Box with 17-19px mobile / 18-20px desktop typography */}
              <div className="relative mb-3.5">
                <label htmlFor="review-text-input" className="sr-only">
                  Your Review Draft
                </label>
                <textarea
                  id="review-text-input"
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    setIsCopied(false);
                  }}
                  rows={4}
                  className="w-full p-4 bg-ivory-50/70 hover:bg-ivory-50 focus:bg-white rounded-2xl border border-cream-border focus:border-blush-400 focus:ring-2 focus:ring-blush-200 outline-none text-charcoal-900 review-text-size font-serif leading-relaxed italic transition-all resize-none shadow-inner"
                  placeholder="Personalize your review here..."
                />
              </div>

              {/* Element 5: Copy Review Button */}
              <div>
                {isCopied ? (
                  <div className="w-full py-3.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Review copied successfully!</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(reviewText)}
                    className="w-full py-3.5 px-4 bg-ivory-200 hover:bg-ivory-300 active:bg-ivory-300 text-charcoal-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-cream-border active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blush-400"
                  >
                    <Copy className="w-4 h-4 text-charcoal-600" />
                    <span>Copy Review</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full">
              {/* Element 7: Open Google Review Button (Primary CTA) */}
              <button
                type="button"
                onClick={handleOpenGoogleReview}
                className="w-full py-4 px-6 rounded-2xl bg-charcoal-900 hover:bg-blush-600 active:bg-charcoal-950 text-white font-bold text-sm sm:text-base tracking-wider uppercase shadow-elevated hover:shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blush-400"
              >
                <span>Open Google Review</span>
                <ExternalLink className="w-5 h-5 text-blush-200" />
              </button>

              {/* Element 6: Generate Another Button (Secondary Action) */}
              <button
                type="button"
                onClick={() => handleFetchReview(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-white/95 backdrop-blur-xs hover:bg-ivory-100 active:bg-ivory-200 text-charcoal-700 font-semibold text-xs sm:text-sm border border-blush-100 shadow-xs transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blush-400"
              >
                <RefreshCw className="w-4 h-4 text-charcoal-500" />
                <span>Generate Another Suggestion</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer Branding - Powered by FlashDesign AI */}
      <footer className="mt-8 mb-2 text-center text-xs text-charcoal-500 z-10 flex items-center justify-center gap-1.5">
        <span>Powered by</span>
        <a
          href={FLASHDESIGN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-blush-600 hover:text-blush-700 hover:underline underline-offset-2 transition-colors inline-flex items-center gap-1"
        >
          FlashDesign AI
          <ExternalLink className="w-3 h-3 text-blush-600" />
        </a>
      </footer>
    </main>
  );
};

export default App;
