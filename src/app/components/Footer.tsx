import { Facebook, Linkedin, Instagram } from 'lucide-react';
import xLogo from 'figma:asset/683e55d42d9040ee052fa490450c7713d91934ce.png';

export function Footer() {
  const handleNavigation = (page: string) => {
    (window as any).navigateTo?.(page);
  };

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Products', page: 'products' },
        { label: 'For Businesses', page: 'business' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Events', page: 'events' },
        { label: 'Become a Partner', page: 'partner' },
        { label: 'Join the Rebellion', page: 'home' },
        { label: 'DFW Launch', page: 'dfw' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Investor Info', page: 'investors' },
        { label: 'FAQs', page: 'faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Manifesto', page: 'manifesto' },
      ],
    },
  ];

  const socialLinks = [
    { icon: xLogo, href: 'https://x.com/mythosrebellion?s=11', label: 'X' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/mythos-systems-inc/about/?viewAsMember=true', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/mythosrebellion/', label: 'Instagram' },
  ];

  return (
    <footer className="bg-[#000000] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="mb-12 text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
            Rebuilding local economies. One city at a time.
          </h3>
          <p className="text-[#B0B0B0]">
            Join the rebellion against corporate monopolies.
          </p>
        </div>

        {/* Navigation columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-white font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleNavigation(link.page)}
                      className="text-[#B0B0B0] hover:text-white transition-colors text-sm text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="text-[#707070] text-sm">
            © 2026 MythOS Systems. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              const isXLogo = social.label === 'X';
              return (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-[#B0B0B0] flex items-center justify-center text-[#B0B0B0] hover:text-white hover:border-white transition-colors"
                >
                  {isXLogo ? (
                    <img src={Icon as string} alt="X" className="w-5 h-5" />
                  ) : (
                    <Icon size={18} />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}