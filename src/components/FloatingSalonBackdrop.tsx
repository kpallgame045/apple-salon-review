import React, { useEffect, useState, useRef } from 'react';
import { RealisticSalonGraphic } from './RealisticSalonGraphic';

/**
 * Realistic Rose Petal SVG Accent for delicate ambient layering
 */
function RosePetalAccent({ angle = 0 }: { angle?: number }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(190,18,60,0.2)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <defs>
        <radialGradient id="delicatePetal" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF1F2" />
          <stop offset="35%" stopColor="#FDA4AF" />
          <stop offset="80%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </radialGradient>
      </defs>
      <path
        d="M 30 8 C 45 6, 54 18, 51 34 C 48 48, 35 54, 28 51 C 18 48, 9 37, 12 24 C 14 13, 22 10, 30 8 Z"
        fill="url(#delicatePetal)"
        opacity="0.85"
      />
      <path d="M 28 50 Q 31 32 30 12" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}

/**
 * FloatingSalonBackdrop Component:
 * - Features genuine photorealistic beauty salon assets (skincare jar, serum bottle, makeup brush, rose flower, crystal perfume)
 * - Smooth continuous up-and-down floating animations with varying durations and delays
 * - Scroll-triggered entrance and responsive parallax effect (different speeds per element)
 * - Safe perimeter layout: placed at corners & margins, never overlapping the review box or buttons
 * - Fully responsive: optimized for mobile, tablet, and desktop
 * - Respects prefers-reduced-motion
 */
export const FloatingSalonBackdrop: React.FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const ticking = useRef<boolean>(false);

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);

      // Passive smooth scroll parallax listener
      const handleScroll = () => {
        if (!ticking.current) {
          window.requestAnimationFrame(() => {
            setScrollY(window.scrollY || window.pageYOffset || 0);
            ticking.current = false;
          });
          ticking.current = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Helper for scroll parallax transform (clamped to prevent excessive travel)
  const getParallaxStyle = (factor: number) => {
    if (isReducedMotion) return {};
    const clampedY = Math.max(-120, Math.min(120, scrollY * factor));
    return {
      transform: `translate3d(0, ${clampedY}px, 0)`,
      transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
      willChange: 'transform',
    };
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. TOP-LEFT: Luxury Frosted Skincare Cream Jar */}
      <div
        className="absolute -top-4 -left-4 sm:top-4 sm:left-4 md:top-6 md:left-8 z-0 animate-salon-fade-in"
        style={getParallaxStyle(-0.1)}
      >
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 opacity-80 sm:opacity-90 animate-float-diagonal transform-gpu"
          style={{ animationDelay: '0s' }}
        >
          <RealisticSalonGraphic
            src="/assets/cream-jar.jpg"
            alt="Luxury Skincare Cream Jar with Rose-Gold Lid"
            glowColor="rgba(244, 212, 199, 0.45)"
          />
        </div>
      </div>

      {/* Floating Rose Petal near Top-Left */}
      <div
        className="absolute top-28 left-8 sm:top-36 sm:left-24 z-0 animate-salon-fade-in"
        style={getParallaxStyle(0.06)}
      >
        <div
          className="w-8 h-8 sm:w-11 sm:h-11 opacity-65 animate-float-petal transform-gpu"
          style={{ animationDelay: '0.8s' }}
        >
          <RosePetalAccent angle={35} />
        </div>
      </div>

      {/* 2. TOP-RIGHT: Fresh Pink Velvet English Rose Flower */}
      <div
        className="absolute -top-4 -right-4 sm:top-4 sm:right-6 md:top-6 md:right-8 z-0 animate-salon-fade-in"
        style={getParallaxStyle(0.09)}
      >
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 opacity-80 sm:opacity-90 animate-float-vertical transform-gpu"
          style={{ animationDelay: '0.5s' }}
        >
          <RealisticSalonGraphic
            src="/assets/rose-flower.jpg"
            alt="Blooming Velvet English Rose"
            glowColor="rgba(253, 205, 215, 0.5)"
          />
        </div>
      </div>

      {/* Floating Rose Petal near Top-Right */}
      <div
        className="absolute top-32 right-8 sm:top-40 sm:right-28 z-0 animate-salon-fade-in"
        style={getParallaxStyle(-0.07)}
      >
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 opacity-60 animate-float-sway transform-gpu"
          style={{ animationDelay: '1.2s' }}
        >
          <RosePetalAccent angle={-45} />
        </div>
      </div>

      {/* 3. MID-LEFT: Luxury Cosmetic Serum Dropper Bottle (Hidden on small mobile to avoid crowding) */}
      <div
        className="hidden md:block absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 z-0 animate-salon-fade-in"
        style={getParallaxStyle(-0.13)}
      >
        <div
          className="w-28 h-36 lg:w-32 lg:h-44 opacity-80 lg:opacity-85 animate-float-sway transform-gpu"
          style={{ animationDelay: '1.5s' }}
        >
          <RealisticSalonGraphic
            src="/assets/serum-bottle.jpg"
            alt="Cosmetic Serum Dropper Bottle"
            glowColor="rgba(254, 215, 170, 0.45)"
          />
        </div>
      </div>

      {/* 4. MID-RIGHT: Professional Fluffy Makeup Powder Brush (Hidden on small mobile to keep card clear) */}
      <div
        className="hidden md:block absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 z-0 animate-salon-fade-in"
        style={getParallaxStyle(0.12)}
      >
        <div
          className="w-28 h-36 lg:w-36 lg:h-48 opacity-80 lg:opacity-85 animate-float-reverse-vertical transform-gpu"
          style={{ animationDelay: '2.1s' }}
        >
          <RealisticSalonGraphic
            src="/assets/makeup-brush.jpg"
            alt="Professional Fluffy Makeup Powder Brush"
            glowColor="rgba(244, 182, 194, 0.45)"
          />
        </div>
      </div>

      {/* 5. BOTTOM-LEFT: Vintage Faceted Crystal Perfume Atomizer */}
      <div
        className="absolute bottom-4 -left-4 sm:bottom-6 sm:left-4 md:bottom-8 md:left-8 z-0 animate-salon-fade-in"
        style={getParallaxStyle(0.08)}
      >
        <div
          className="w-24 h-28 sm:w-32 sm:h-36 md:w-36 md:h-44 opacity-80 sm:opacity-85 animate-float-vertical transform-gpu"
          style={{ animationDelay: '1.8s' }}
        >
          <RealisticSalonGraphic
            src="/assets/perfume-bottle.jpg"
            alt="Vintage Crystal Perfume Atomizer Bottle"
            glowColor="rgba(233, 213, 255, 0.45)"
          />
        </div>
      </div>

      {/* Delicate floating petal near Bottom-Left */}
      <div
        className="hidden sm:block absolute bottom-36 left-24 md:bottom-44 md:left-36 z-0 animate-salon-fade-in"
        style={getParallaxStyle(-0.06)}
      >
        <div
          className="w-7 h-7 sm:w-9 sm:h-9 opacity-50 animate-float-petal transform-gpu"
          style={{ animationDelay: '2.5s' }}
        >
          <RosePetalAccent angle={115} />
        </div>
      </div>

      {/* 6. BOTTOM-RIGHT: Rose Blossom and Petals Accent */}
      <div
        className="absolute bottom-4 -right-4 sm:bottom-6 sm:right-4 md:bottom-8 md:right-8 z-0 animate-salon-fade-in"
        style={getParallaxStyle(-0.11)}
      >
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 opacity-80 sm:opacity-85 animate-float-diagonal transform-gpu"
          style={{ animationDelay: '2.7s' }}
        >
          <RealisticSalonGraphic
            src="/assets/rose-flower.jpg"
            alt="Delicate Rose Blossom Petals"
            glowColor="rgba(254, 205, 211, 0.45)"
          />
        </div>
      </div>

      {/* Delicate floating petal near Bottom-Right */}
      <div
        className="hidden sm:block absolute bottom-36 right-24 md:bottom-44 md:right-36 z-0 animate-salon-fade-in"
        style={getParallaxStyle(0.07)}
      >
        <div
          className="w-7 h-7 sm:w-9 sm:h-9 opacity-55 animate-float-sway transform-gpu"
          style={{ animationDelay: '3.1s' }}
        >
          <RosePetalAccent angle={-25} />
        </div>
      </div>
    </div>
  );
};

export default FloatingSalonBackdrop;
