import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface EarlyAdopterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EarlyAdopterModal({ isOpen, onClose }: EarlyAdopterModalProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    ownerEmail: '',
    city: '',
    state: '',
    businessType: '',
    ownerPhone: '',
    businessAddress: '',
    zipCode: '',
    website: '',
    instagram: '',
    facebook: '',
    referredBy: '',
    feedback: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const socialMediaHandles: any = {};
      if (formData.instagram) socialMediaHandles.instagram = formData.instagram;
      if (formData.facebook) socialMediaHandles.facebook = formData.facebook;

      const response = await fetch(
        `/api/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            kind: 'early-adopter-business',
            business_name: formData.businessName,
            owner_name: formData.ownerName,
            owner_email: formData.ownerEmail,
            city: formData.city,
            state: formData.state,
            business_type: formData.businessType || null,
            owner_phone: formData.ownerPhone || null,
            business_address: formData.businessAddress || null,
            zip_code: formData.zipCode || null,
            website: formData.website || null,
            social_media_handles: Object.keys(socialMediaHandles).length > 0 ? socialMediaHandles : null,
            referred_by: formData.referredBy || null,
            feedback_notes: formData.feedback || null,
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

  const handleClose = () => {
    setFormData({
      businessName: '',
      ownerName: '',
      ownerEmail: '',
      city: '',
      state: '',
      businessType: '',
      ownerPhone: '',
      businessAddress: '',
      zipCode: '',
      website: '',
      instagram: '',
      facebook: '',
      referredBy: '',
      feedback: '',
    });
    setIsSuccess(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-[#000000] border border-white/20 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#B0B0B0] hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#9D4EDD]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#9D4EDD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
                Welcome to the Rebellion!
              </h2>
              <p className="text-[#B0B0B0] text-lg mb-4">
                You're now a founding partner. We'll be in touch soon with your Myth Credits and exclusive early access details.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#9D4EDD] text-white rounded-lg hover:bg-[#9D4EDD]/90 transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
              Become a Founding Partner
            </h2>
            <p className="text-[#B0B0B0] mb-6">San Diego Early Adopters - Launching 2026</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-semibold">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Owner Name *</label>
                  <input
                    type="text"
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Owner Email *</label>
                  <input
                    type="email"
                    name="ownerEmail"
                    required
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Business Type</label>
                  <input
                    type="text"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    placeholder="e.g., Restaurant, Barbershop, Gym"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Owner Phone</label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Business Address</label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Instagram Handle</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@yourbusiness"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Facebook Page</label>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="Your Page Name"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">How did you hear about us?</label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Tell us about your business</label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#9D4EDD] focus:outline-none resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-[#9D4EDD] text-white rounded-lg hover:bg-[#9D4EDD]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  'Become a Founding Partner'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
