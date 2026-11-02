import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { ProductAccessModal } from './ProductAccessModal';

type ModalType = 'network' | 'pro' | 'personal' | null;

export function PricingSection() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const tiers = [
    {
      id: 'network' as const,
      name: 'The Network',
      title: 'Reconnect With Your City',
      price: '$0',
      subtitle: 'For Everyone',
      color: '#0047FF',
      features: [
        'Discover local businesses, events, and communities',
        'City-only algorithm, no global feeds',
        'Earn Rebel Points for supporting local',
        'Own your data',
        'Real-time "Now" feed',
        'No ads. No corporate manipulation.',
      ],
      cta: 'Get Early Access',
      featured: false,
    },
    {
      id: 'pro' as const,
      name: 'MythOS Pro',
      title: 'Let Mylo Work for You',
      price: '$100',
      period: ' / month',
      subtitleBadge: 'For Small Businesses',
      color: '#FF4500',
      features: [
        'Mylo AI receptionist (questions, booking, scheduling)',
        'Unified inbox (social, SMS, email)',
        'All-in-one business analytics dashboard',
        'AI insights & priorities',
        'Social posting & scheduling',
        'Free traffic through The Network',
      ],
      cta: 'Request Early Access',
      featured: true,
    },
    {
      id: 'personal' as const,
      name: 'Mylo Personal',
      title: 'Your Personal AI City Assistant',
      price: '$20',
      period: ' / month',
      subtitle: 'For Individuals',
      color: '#9D4EDD',
      features: [
        'Personalized local recommendations',
        'Finds events, spots, and communities for you',
        'Helps you meet people with shared interests',
        'Simplifies discovering your city',
        'Hyperlocal suggestions based on your preferences',
      ],
      cta: 'Get Early Access',
      featured: false,
    },
  ];

  return (
    <>
      <section id="pricing" className="py-24 bg-[#000000] relative">
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mythos-headline-large text-white mb-4">
              An Ecosystem Built for Local
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-[#1A1A1A] rounded-lg p-8 border transition-all duration-300 ${
                  tier.featured 
                    ? 'md:-translate-y-2 hover:md:-translate-y-4' 
                    : 'md:translate-y-12 hover:translate-y-10'
                }`}
                style={{
                  borderColor: tier.color,
                  boxShadow: tier.featured 
                    ? `0 0 60px ${tier.color}60` 
                    : `0 0 20px ${tier.color}30`,
                }}
              >
                {/* Featured badge */}
                {tier.featured && tier.badge && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full flex items-center gap-2"
                    style={{ backgroundColor: tier.color }}
                  >
                    <Star size={14} fill="white" color="white" />
                    <span className="text-xs font-bold text-white tracking-wider">
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Tier name - small badge */}
                <div className="mb-3">
                  <span 
                    className="text-xs font-bold tracking-wider px-3 py-1 rounded"
                    style={{ 
                      backgroundColor: `${tier.color}20`,
                      color: tier.color 
                    }}
                  >
                    {tier.subtitleBadge || tier.subtitle}
                  </span>
                </div>

                {/* Product name - largest */}
                <h3 
                  className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
                  style={{ fontFamily: 'var(--font-headline)', color: tier.color }}
                >
                  {tier.name}
                </h3>

                {/* Value statement - second largest */}
                <p 
                  className="text-xl md:text-2xl font-semibold mb-6 leading-tight text-white"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  {tier.title}
                  {tier.id === 'pro' && (
                    <span className="text-sm md:text-base ml-1">- Your Business OS</span>
                  )}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white mythos-headline-medium">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-xl text-[#B0B0B0]">{tier.period}</span>
                  )}
                </div>

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check 
                        size={20} 
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: tier.color }}
                      />
                      <span className="text-[#B0B0B0] text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* MythOS Pro additional info */}
                {tier.id === 'pro' && (
                  <div className="mb-8 pt-6 border-t" style={{ borderColor: `${tier.color}30` }}>
                    <h4 
                      className="text-lg font-bold mb-3"
                      style={{ color: tier.color, fontFamily: 'var(--font-headline)' }}
                    >
                      Autonomous by Design
                    </h4>
                    <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4">
                      Mylo handles routine decisions on its own,
                      operates within clear boundaries you set,
                      and escalates only what actually needs your attention.
                    </p>
                    <p className="text-white text-sm font-semibold">
                      Saves 4+ hours per day
                    </p>
                  </div>
                )}

                {/* CTA button */}
                <button
                  onClick={() => setActiveModal(tier.id)}
                  className="w-full py-3 rounded font-semibold transition-all text-white hover:opacity-90"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProductAccessModal
        isOpen={activeModal === 'network'}
        onClose={() => setActiveModal(null)}
        type="network"
      />
      <ProductAccessModal
        isOpen={activeModal === 'pro'}
        onClose={() => setActiveModal(null)}
        type="pro"
      />
      <ProductAccessModal
        isOpen={activeModal === 'personal'}
        onClose={() => setActiveModal(null)}
        type="personal"
      />
    </>
  );
}