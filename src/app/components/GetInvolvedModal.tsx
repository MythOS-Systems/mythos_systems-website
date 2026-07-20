import { X, Instagram } from 'lucide-react';

interface GetInvolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetInvolvedModal({ isOpen, onClose }: GetInvolvedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#000000] border border-white/20 rounded-xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B0B0B0] hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Get Involved
          </h2>
          <p className="text-[#B0B0B0] text-lg mb-6">
            Want to help with the DFW launch?
          </p>
          <p className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-headline)' }}>
            DM us on Instagram
          </p>
        </div>

        {/* Instagram Button */}
        <a
          href="https://www.instagram.com/mythosrebellion/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 w-full p-6 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] text-white rounded-lg hover:opacity-90 transition-opacity group"
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Instagram size={28} />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold">@mythosrebellion</div>
            <div className="text-xs opacity-90">Send us a message</div>
          </div>
        </a>

        <p className="text-center text-[#707070] text-sm mt-6">
          We're looking for local partners, event organizers, and community leaders
        </p>
      </div>
    </div>
  );
}
