import { X, Facebook, Linkedin, Instagram } from 'lucide-react';
import xLogo from 'figma:asset/683e55d42d9040ee052fa490450c7713d91934ce.png';

interface StayUpdatedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StayUpdatedModal({ isOpen, onClose }: StayUpdatedModalProps) {
  if (!isOpen) return null;

  const socialLinks = [
    { icon: xLogo, href: 'https://x.com/mythosrebellion?s=11', label: 'X', color: '#000000' },
    { icon: Facebook, href: '#', label: 'Facebook', color: '#1877F2' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/mythos-systems-inc/about/?viewAsMember=true', label: 'LinkedIn', color: '#0A66C2' },
    { icon: Instagram, href: 'https://www.instagram.com/mythosrebellion/', label: 'Instagram', color: '#E4405F' },
  ];

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
            Stay Updated
          </h2>
          <p className="text-[#B0B0B0] text-lg">
            Follow us on social media for the latest updates on the DFW launch
          </p>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-2 gap-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            const isXLogo = social.label === 'X';
            return (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 border border-white/10 rounded-lg hover:border-[#0047FF]/50 hover:bg-white/5 transition-all group"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: social.color }}
                >
                  {isXLogo ? (
                    <img src={Icon as string} alt="X" className="w-6 h-6 brightness-0 invert" />
                  ) : (
                    <Icon size={24} />
                  )}
                </div>
                <span className="text-white font-semibold">{social.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
