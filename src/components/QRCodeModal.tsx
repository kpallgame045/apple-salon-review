import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Use current window origin or production domain
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.applebeautysalon.in/';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-elevated border border-cream-border relative text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-charcoal-400 hover:text-charcoal-700 hover:bg-ivory-100 transition-colors"
          aria-label="Close QR Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="w-12 h-12 rounded-2xl bg-blush-50 border border-blush-100 flex items-center justify-center mx-auto mb-4 text-blush-600">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 id="qr-modal-title" className="font-serif text-xl sm:text-2xl font-semibold text-charcoal-900 mb-1">
          Salon Standee QR Code
        </h3>
        <p className="text-xs text-charcoal-500 mb-6">
          Scan with any mobile camera to open Apple Beauty Salon&apos;s Review Experience directly.
        </p>

        {/* QR Code Container */}
        <div className="p-4 bg-ivory-50 rounded-2xl border border-cream-border inline-block shadow-inner mb-5">
          <QRCodeSVG
            value={currentUrl}
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: '/apple-beauty-salon-logo.jpg',
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        {/* URL Pill */}
        <div className="text-[11px] bg-ivory-100 text-charcoal-600 py-1.5 px-3 rounded-full border border-cream-border truncate max-w-full mb-4">
          {currentUrl}
        </div>

        <p className="text-[11px] text-charcoal-400 leading-relaxed">
          Place on your reception desk, styling mirrors, or billing counter for seamless client reviews.
        </p>
      </div>
    </div>
  );
};
