import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface BIDChamberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BIDChamberModal({ isOpen, onClose }: BIDChamberModalProps) {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    contactName: '',
    contactEmail: '',
    city: '',
    state: '',
    contactPhone: '',
    zipCode: '',
    website: '',
    numberOfMembers: '',
    notes: '',
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
      const response = await fetch(
        `/api/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            kind: 'bid-chamber-partner',
            organization_name: formData.organizationName,
            organization_type: formData.organizationType,
            contact_name: formData.contactName,
            contact_email: formData.contactEmail,
            city: formData.city,
            state: formData.state,
            contact_phone: formData.contactPhone || null,
            zip_code: formData.zipCode || null,
            website: formData.website || null,
            number_of_member_businesses: formData.numberOfMembers ? parseInt(formData.numberOfMembers) : null,
            notes: formData.notes || null,
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
      organizationName: '',
      organizationType: '',
      contactName: '',
      contactEmail: '',
      city: '',
      state: '',
      contactPhone: '',
      zipCode: '',
      website: '',
      numberOfMembers: '',
      notes: '',
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
              <div className="w-16 h-16 bg-[#0047FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#0047FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
                Thank You!
              </h2>
              <p className="text-[#B0B0B0] text-lg">
                We'll be in touch soon to discuss partnership opportunities.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#0047FF] text-white rounded-lg hover:bg-[#0047FF]/90 transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
              Partner With Us
            </h2>
            <p className="text-[#B0B0B0] mb-6">BIDs & Chambers of Commerce</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-semibold">Organization Name *</label>
                <input
                  type="text"
                  name="organizationName"
                  required
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Organization Type *</label>
                <select
                  name="organizationType"
                  required
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="BID">Business Improvement District</option>
                  <option value="Chamber">Chamber of Commerce</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Contact Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Contact Email *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
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
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
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
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Number of Member Businesses</label>
                <input
                  type="number"
                  name="numberOfMembers"
                  value={formData.numberOfMembers}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none resize-none"
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
                className="w-full px-8 py-4 bg-[#0047FF] text-white rounded-lg hover:bg-[#0047FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  'Submit Partnership Request'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
