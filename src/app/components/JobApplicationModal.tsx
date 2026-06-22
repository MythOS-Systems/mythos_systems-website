import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JobApplicationModal({ isOpen, onClose }: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    positionAppliedFor: '',
    whyMythos: '',
    phone: '',
    locationCity: '',
    locationState: '',
    portfolioUrl: '',
    linkedinUrl: '',
    experienceSummary: '',
    availability: '',
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
            kind: 'job-application',
            full_name: formData.fullName,
            email: formData.email,
            position_applied_for: formData.positionAppliedFor,
            why_mythos: formData.whyMythos,
            phone: formData.phone || null,
            location_city: formData.locationCity || null,
            location_state: formData.locationState || null,
            portfolio_url: formData.portfolioUrl || null,
            linkedin_url: formData.linkedinUrl || null,
            experience_summary: formData.experienceSummary || null,
            availability: formData.availability || null,
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
      fullName: '',
      email: '',
      positionAppliedFor: '',
      whyMythos: '',
      phone: '',
      locationCity: '',
      locationState: '',
      portfolioUrl: '',
      linkedinUrl: '',
      experienceSummary: '',
      availability: '',
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
                Application Received!
              </h2>
              <p className="text-[#B0B0B0] text-lg mb-4">
                Thanks for applying to join the rebellion. We'll review your application and get back to you soon.
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
              Join the Team
            </h2>
            <p className="text-[#B0B0B0] mb-6">Help us fight back against Big Tech</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Position Applying For *</label>
                <select
                  name="positionAppliedFor"
                  required
                  value={formData.positionAppliedFor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                >
                  <option value="">Select Position</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Why do you want to work for MythOS? *</label>
                <textarea
                  name="whyMythos"
                  required
                  value={formData.whyMythos}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">When can you start?</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  >
                    <option value="">Select Availability</option>
                    <option value="Immediate">Immediate</option>
                    <option value="In 2 weeks">In 2 weeks</option>
                    <option value="In 1 month">In 1 month</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">City</label>
                  <input
                    type="text"
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">State</label>
                  <input
                    type="text"
                    name="locationState"
                    value={formData.locationState}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Portfolio/Website</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">LinkedIn Profile</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#0047FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Brief Experience Summary</label>
                <textarea
                  name="experienceSummary"
                  value={formData.experienceSummary}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your relevant experience and skills"
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
                  'Submit Application'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
