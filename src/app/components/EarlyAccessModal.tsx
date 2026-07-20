import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EarlyAccessModal({ isOpen, onClose }: EarlyAccessModalProps) {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            kind: 'early-access',
            email,
            city,
            source: 'homepage_rebellion',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit');
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-[#000000] border-2 border-white/20 rounded-lg max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B0B0B0] hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {!isSuccess ? (
            <>
              {/* Header */}
              <h2 className="mythos-headline-large text-white mb-3">
                Get invited to early access
              </h2>
              <p className="text-[#B0B0B0] mb-8">
                MythOS is launching city by city. Early access is limited.
              </p>

              {/* Form */}
              <form
                name="join-the-rebellion"
                data-mythos-form="join-the-rebellion"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="email" className="block text-sm text-[#B0B0B0] mb-2">
                    Email address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/20 rounded text-white placeholder-[#666666] focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm text-[#B0B0B0] mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/20 rounded text-white placeholder-[#666666] focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition-colors"
                    placeholder="Dallas"
                  />
                </div>

                {error && (
                  <div className="text-[#FF4500] text-sm bg-[#FF4500]/10 border border-[#FF4500]/30 rounded px-4 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3.5 bg-[#0047FF] text-white rounded font-semibold hover:bg-[#0047FF]/90 transition-all hover:shadow-lg hover:shadow-[#0047FF]/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Request Access'
                  )}
                </button>

                <p className="text-xs text-[#666666] text-center">
                  No spam. No noise. Just launch updates.
                </p>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-[#9D4EDD]/10 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-[#9D4EDD]" 
                    fill="none" 
                    strokeWidth="2" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h2 className="mythos-headline-large text-white mb-3">
                You're on the list.
              </h2>
              <p className="text-[#B0B0B0] mb-8">
                We'll reach out when MythOS launches in your city.
              </p>

              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-white/20 text-white rounded hover:bg-white/5 transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}