import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import heroBackgroundImage from 'figma:asset/8882fdd5839a254621135059d1685a5b2f7a7750.png';
import mythosLogoBackground from 'figma:asset/603c0e6525b97496065a3d319d8d238106096994.png';
import { EarlyAccessModal } from './EarlyAccessModal';
import CityPulseBackground from './CityPulseBackground';
import { HoverBorderGradient } from './ui/hover-border-gradient';

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Analytics on these two CTAs is delegated to the document-level
  // click listener in getinfo.js - it walks `closest('[data-mythos-track]')`,
  // so wrapping the HoverBorderGradient in a <span> with the attr fires
  // the right event_type=click without us having to plumb a tracker call
  // through the (third-party) HBG component's props.
  const handleInvestorClick = () => {
    (window as any).navigateTo?.('partner');
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000000] pt-20">
        {/* MythOS Logo Background - Behind Grid */}
        {/* Mobile */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat opacity-20 lg:hidden"
          style={{ 
            backgroundImage: `url(${mythosLogoBackground})`,
            backgroundSize: '150%'
          }}
        />
        {/* Desktop */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat opacity-20 hidden lg:block"
          style={{ 
            backgroundImage: `url(${mythosLogoBackground})`,
            backgroundSize: '120%'
          }}
        />
        
        {/* City Pulse Grid Background */}
        <CityPulseBackground 
          className="absolute inset-0" 
          density={1.1} 
          intensity={0.9}
          primary="#0047FF"
          accent="#FF4500"
        />
        
        {/* Optional overlay for readability - minimal opacity */}
        <div className="absolute inset-0 bg-black/5" />
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mythos-headline-massive text-white mb-6">
            RReconnect With Your City
          </h1>
          
          <p className="mythos-body-large text-[#B0B0B0] max-w-3xl mx-auto mb-12">
            The digital infrastructure to rebuild local economies
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <span data-mythos-track="hero-join-the-rebellion">
                <HoverBorderGradient
                  as="button"
                  onClick={() => setIsModalOpen(true)}
                  containerClassName="rounded-full"
                  className="bg-[#0047FF] text-white px-8 py-4 flex items-center gap-3"
                  duration={1}
                >
                  <span className="font-semibold">Join The Rebellion</span>
                </HoverBorderGradient>
              </span>
              <p className="text-sm text-[#B0B0B0]">Get Invited to Early Access List</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span data-mythos-track="hero-become-a-partner">
                <HoverBorderGradient
                  as="button"
                  onClick={handleInvestorClick}
                  containerClassName="rounded-full"
                  className="bg-transparent text-white px-8 py-4 flex items-center gap-3"
                  duration={1}
                >
                  <ArrowRight size={20} />
                  <span className="font-semibold">Become a Partner</span>
                </HoverBorderGradient>
              </span>
              <p className="text-sm text-[#B0B0B0]">Help us rebuild local economies</p>
            </div>
          </div>
        </div>
      </section>

      <EarlyAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}