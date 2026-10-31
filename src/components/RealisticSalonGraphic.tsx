import React, { useEffect, useRef, useState } from 'react';

interface RealisticSalonGraphicProps {
  src: string;
  alt: string;
  className?: string;
  glowColor?: string;
}

/**
 * Photorealistic Beauty Salon Graphic Component:
 * - Uses HTML5 Canvas client-side pixel processing to convert white studio background to genuine transparent alpha with anti-aliased edge feathering.
 * - Provides instant CSS `mix-blend-mode: multiply` fallback so there is zero initial delay or flicker.
 * - Includes soft ambient lighting glow and luxury realistic drop-shadows.
 */
export const RealisticSalonGraphic: React.FC<RealisticSalonGraphicProps> = ({
  src,
  alt,
  className = '',
  glowColor = 'rgba(235, 180, 195, 0.35)',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = img.naturalWidth || 600;
      const height = img.naturalHeight || 600;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Process pure white / studio white pixels to transparent alpha with soft edge antialiasing
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;

          // Studio pure white threshold
          if (r > 242 && g > 242 && b > 242) {
            data[i + 3] = 0; // Pure transparent
          } else if (brightness > 218) {
            // Smooth edge feathering gradient
            const alphaFactor = Math.max(0, Math.min(1, (242 - brightness) / 24));
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setIsProcessed(true);
      } catch {
        // In case of CORS or canvas security policy, gracefully fall back to mix-blend
        setIsProcessed(false);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Soft Ambient Studio Lighting Glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl pointer-events-none transform scale-110 opacity-70"
        style={{ backgroundColor: glowColor }}
        aria-hidden="true"
      />

      {/* Realistic Shadow + Canvas / Mix-Blend Image */}
      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        className={`w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(180,105,120,0.22)] transition-opacity duration-300 ${
          isProcessed ? 'block opacity-100' : 'hidden opacity-0'
        }`}
      />

      {/* Instant zero-delay fallback using multiply blend */}
      {!isProcessed && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(180,105,120,0.22)] mix-blend-multiply"
          loading="eager"
        />
      )}
    </div>
  );
};

export default RealisticSalonGraphic;
