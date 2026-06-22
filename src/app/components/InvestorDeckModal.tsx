import { useState } from 'react';
import { X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface InvestorDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvestorDeckModal({ isOpen, onClose }: InvestorDeckModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    organization: '',
    investor_type: '',
    check_size: '',
    notes: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ kind: 'investor-lead', ...formData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to submit form');
      }

      // Success state
      setIsSuccess(true);
      
      // Clear form and close modal after showing success message
      setTimeout(() => {
        setFormData({
          full_name: '',
          email: '',
          organization: '',
          investor_type: '',
          check_size: '',
          notes: '',
        });
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting investor lead:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#111111] border border-white/10 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#B0B0B0] hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="p-8">
          {isSuccess ? (
            // Success state
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#9D4EDD]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#9D4EDD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Deck sent. Check your email.</h3>
              <p className="text-[#B0B0B0]">We'll be in touch soon.</p>
            </div>
          ) : (
            // Form
            <>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                Request the Deck
              </h2>
              <p className="text-[#B0B0B0] mb-8">
                Tell us a bit about yourself and we'll send you our investor deck.
              </p>

              <form
                name="investor-request-copy"
                data-mythos-form="investor-request-copy"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Full Name */}
                <div>
                  <label htmlFor="full_name" className="block text-white font-medium mb-2">
                    Full Name <span className="text-[#FF4500]">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/10 rounded text-white placeholder-[#B0B0B0] focus:border-[#0047FF] focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email <span className="text-[#FF4500]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/10 rounded text-white placeholder-[#B0B0B0] focus:border-[#0047FF] focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="block text-white font-medium mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/10 rounded text-white placeholder-[#B0B0B0] focus:border-[#0047FF] focus:outline-none transition-colors"
                    placeholder="Acme Ventures"
                  />
                </div>

                {/* Investor Type */}
                <div>
                  <label htmlFor="investor_type" className="block text-white font-medium mb-2">
                    Investor Type
                  </label>
                  <select
                    id="investor_type"
                    name="investor_type"
                    value={formData.investor_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/10 rounded text-white focus:border-[#0047FF] focus:outline-none transition-colors"
                  >
                    <option value="">Select type</option>
                    <option value="angel">Angel Investor</option>
                    <option value="vc">Venture Capital</option>
                    <option value="family_office">Family Office</option>
                    <option value="strategic">Strategic Investor</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Check Size */}
                <div>
                  <label htmlFor="check_size" className="block text-white font-medium mb-2">
                    Check Size
                  </label>
                  <select
                    id="check_size"
                    name="check_size"
                    value={formData.check_size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/10 rounded text-white focus:border-[#0047FF] focus:outline-none transition-colors"
                  >
                    <option value="">Select range</option>
                    <option value="under_25k">Under $25K</option>
                    <option value="25k_50k">$25K - $50K</option>
                    <option value="50k_100k">$50K - $100K</option>
                    <option value="100k_250k">$100K - $250K</option>
                    <option value="250k_500k">$250K - $500K</option>
                    <option value="500k_plus">$500K+</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-white font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#000000] border border-white/10 rounded text-white placeholder-[#B0B0B0] focus:border-[#0047FF] focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your investment thesis or any questions you have..."
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-4 bg-[#FF4500]/10 border border-[#FF4500]/30 rounded text-[#FF4500]">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 bg-[#0047FF] text-white rounded font-semibold hover:bg-[#0047FF]/90 transition-all hover:shadow-xl hover:shadow-[#0047FF]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Request Deck'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
