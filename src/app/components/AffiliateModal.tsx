import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AffiliateModal({ isOpen, onClose }: AffiliateModalProps) {
  const [formData, setFormData] = useState({
    creatorName: '',
    email: '',
    platform: '',
    handleUsername: '',
    phone: '',
    followerCount: '',
    audienceDescription: '',
    contentFocus: '',
    city: '',
    state: '',
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
            kind: 'creator-affiliate',
            creator_name: formData.creatorName,
            email: formData.email,
            platform: formData.platform,
            handle_username: formData.handleUsername,
            phone: formData.phone || null,
            follower_count: formData.followerCount ? parseInt(formData.followerCount) : null,
            audience_description: formData.audienceDescription || null,
            content_focus: formData.contentFocus || null,
            city: formData.city || null,
            state: formData.state || null,
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
      creatorName: '',
      email: '',
      platform: '',
      handleUsername: '',
      phone: '',
      followerCount: '',
      audienceDescription: '',
      contentFocus: '',
      city: '',
      state: '',
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
              <div className="w-16 h-16 bg-[#FF4500]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FF4500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
                Welcome to the Team!
              </h2>
              <p className="text-[#B0B0B0] text-lg mb-4">
                We'll review your application and send you affiliate details soon.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#FF4500] text-white rounded-lg hover:bg-[#FF4500]/90 transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
              Join as an Affiliate
            </h2>
            <p className="text-[#B0B0B0] mb-6">Creators & Community Partners</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Your Name *</label>
                  <input
                    type="text"
                    name="creatorName"
                    required
                    value={formData.creatorName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
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
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Primary Platform *</label>
                <select
                  name="platform"
                  required
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
                >
                  <option value="">Select Platform</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Podcast">Podcast</option>
                  <option value="Blog">Blog</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Handle/Username *</label>
                  <input
                    type="text"
                    name="handleUsername"
                    required
                    value={formData.handleUsername}
                    onChange={handleChange}
                    placeholder="@yourhandle"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Follower/Subscriber Count</label>
                <input
                  type="number"
                  name="followerCount"
                  value={formData.followerCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Describe Your Audience</label>
                <textarea
                  name="audienceDescription"
                  value={formData.audienceDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Who follows you? What do they care about?"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Content Focus</label>
                <input
                  type="text"
                  name="contentFocus"
                  value={formData.contentFocus}
                  onChange={handleChange}
                  placeholder="e.g., Local Business, Community, Entrepreneurship"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Why do you want to partner with MythOS?</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-white focus:border-[#FF4500] focus:outline-none resize-none"
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
                className="w-full px-8 py-4 bg-[#FF4500] text-white rounded-lg hover:bg-[#FF4500]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  'Submit Affiliate Application'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
