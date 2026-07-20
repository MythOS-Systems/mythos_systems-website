import { useState } from 'react';
import { X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

type ModalType = 'network' | 'pro' | 'personal';

interface ProductAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
}

export function ProductAccessModal({ isOpen, onClose, type }: ProductAccessModalProps) {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let kind = '';
      let source = '';
      let body: any = { email, city };

      if (type === 'network') {
        kind = 'network-early-access';
        source = 'homepage_network_card';
      } else if (type === 'pro') {
        kind = 'mythos-pro-early-access';
        source = 'homepage_pro_card';
        body.business_name = businessName;
      } else {
        kind = 'mylo-personal-early-access';
        source = 'homepage_mylo_personal_card';
      }

      body.kind = kind;
      body.source = source;

      const response = await fetch(
        `/api/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting early access request:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setCity('');
    setBusinessName('');
    setIsSuccess(false);
    setError('');
    onClose();
  };

  const getSuccessMessage = () => {
    if (type === 'network' || type === 'personal') {
      return {
        title: "You're on the list.",
        message: "We'll reach out when MythOS launches in your city.",
      };
    }
    return {
      title: 'Request received.',
      message: "We'll follow up with access details.",
    };
  };

  const successMessage = getSuccessMessage();

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-[#1A1A1A] rounded-lg max-w-md w-full p-8 relative border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {!isSuccess ? (
          <>
            <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
              {type === 'network' && 'Get Early Access'}
              {type === 'pro' && 'Request Early Access'}
              {type === 'personal' && 'Get Early Access'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email <span className="text-[#FF4500]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#000000] border border-white/20 rounded text-white placeholder-[#707070] focus:outline-none focus:border-[#0047FF] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {type === 'pro' && (
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-white mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/20 rounded text-white placeholder-[#707070] focus:outline-none focus:border-[#0047FF] transition-colors"
                    placeholder="Your business name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-white mb-2">
                  City <span className="text-[#FF4500]">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#000000] border border-white/20 rounded text-white placeholder-[#707070] focus:outline-none focus:border-[#0047FF] transition-colors"
                  placeholder="Dallas"
                />
              </div>

              {error && (
                <div className="text-[#FF4500] text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0047FF] text-white font-semibold rounded hover:bg-[#0047FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-[#9D4EDD]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#9D4EDD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
              {successMessage.title}
            </h3>
            <p className="text-[#B0B0B0] mb-6">
              {successMessage.message}
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-[#0047FF] text-white font-semibold rounded hover:bg-[#0047FF]/90 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}