import { Navigation } from '../components/Navigation';
import { FinalCTA } from '../components/FinalCTA';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Check, TrendingUp, Users, Zap, DollarSign, Target, BarChart } from 'lucide-react';
import { useState } from 'react';
import { ProductAccessModal } from '../components/ProductAccessModal';
import { WebsiteAuditor } from '../components/WebsiteAuditor';
import { ContainerScroll } from '../components/ui/container-scroll-animation';

export function ForBusinessesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const teamImage = 'https://images.unsplash.com/photo-1601509876296-aba16d4c10a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc3MDM0ODY4OHww&ixlib=rb-4.1.0&q=80&w=1080';

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'One System Instead of Six',
      description: 'Replace fragmented tools with one intelligent system. No bloated SaaS stack. No monopoly tax.',
      color: '#00FF94',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Mylo Handles the Front Desk',
      description: 'Mylo handles routine questions, booking, and organization - so you\'re not pulled away every five minutes.',
      color: '#0047FF',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Hyperlocal Reach',
      description: 'Connect directly with customers in your neighborhood - without competing against global feeds or ad auctions.',
      color: '#9D4EDD',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'You\'re Not Competing Alone',
      description: 'Operate inside a shared local system where insights, attention, and momentum stay in your city.',
      color: '#FF4500',
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: 'One View of Your Business',
      description: 'See revenue, customers, reviews, and trends in one place - without stitching together multiple dashboards.',
      color: '#0047FF',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Level the Playing Field',
      description: 'Use the same class of automation large companies rely on - without enterprise contracts or added complexity.',
      color: '#9D4EDD',
    },
  ];

  const features = [
    {
      category: 'AI Receptionist',
      items: [
        { text: '24/7 SMS handling', status: 'built' },
        { text: 'Automated appointment booking', status: 'built' },
        { text: 'Customer inquiry responses', status: 'built' },
        { text: 'Real-time conversation monitoring', status: 'built' },
        { text: 'Manual takeover capability', status: 'built' },
        { text: 'Voice call handling', status: 'built' },
      ],
    },
    {
      category: 'Business Analytics',
      items: [
        { text: 'Real-time revenue tracking', status: 'built' },
        { text: 'Booking analytics & metrics', status: 'built' },
        { text: 'Booking demand heatmaps', status: 'built' },
        { text: 'Customer visit patterns', status: 'built' },
        { text: 'Weekly AI insights', status: 'built' },
        { text: 'Performance dashboards', status: 'built' },
      ],
    },
    {
      category: 'Operations & Integrations',
      items: [
        { text: 'Square POS sync', status: 'built' },
        { text: 'Manual expense tracking', status: 'built' },
        { text: 'Quick expense estimation', status: 'built' },
        { text: 'Google integration (My Business, Gmail)', status: 'built' },
        { text: 'Meta integration (Instagram)', status: 'built' },
        { text: 'Low inventory alerts', status: 'built' },
        { text: 'Marketing automation', status: 'built' },
      ],
    },
    {
      category: 'Customer Insights',
      items: [
        { text: 'AI-generated business recommendations', status: 'built' },
        { text: 'Priority alerts & notifications', status: 'built' },
        { text: 'Action item tracking', status: 'built' },
        { text: 'Complete CRM system', status: 'built' },
        { text: 'Unified inbox (Email, SMS, Instagram)', status: 'built' },
        { text: 'Smart customer segmentation', status: 'built' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000]">
      <Navigation />
      
      {/* Hero Section with Container Scroll */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF4500]/10 to-transparent"></div>
        
        <ContainerScroll
          titleComponent={
            <div className="text-center px-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
                Own the Power of the Monopolies
              </h1>
            </div>
          }
        >
          <img
            src="/mythos-pro-dashboard.png"
            alt="MythOS Pro Dashboard"
            className="mx-auto h-full w-full rounded-[20px] object-cover object-center"
            draggable={false}
          />
        </ContainerScroll>
        
        {/* Subtitle and CTA Button Below Image */}
        <div className="text-center pb-20 -mt-48 relative z-20 px-4">
          <p className="text-lg md:text-xl text-[#B0B0B0] mb-8 max-w-3xl mx-auto">
            MythOS Pro is an AI-powered operating system built for small businesses - handling customers, conversations, insights, and execution in one place.
          </p>
          <button
            className="px-8 py-4 bg-[#FF4500] text-white rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Request Early Access
          </button>
        </div>
      </section>

      {/* Website Auditor lead magnet */}
      <WebsiteAuditor onRequestFix={() => setIsModalOpen(true)} />

      {/* Benefits Grid */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
            Why Local Businesses Choose MythOS
          </h2>
          <p className="text-lg text-[#B0B0B0] text-center mb-16">
            MythOS Pro isn't another tool - it's infrastructure built specifically for local businesses.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[#000000] border border-white/10 rounded-lg p-8 hover:border-[#FF4500]/50 transition-all duration-300"
              >
                <div 
                  className="mb-6 inline-flex p-3 rounded-lg"
                  style={{ backgroundColor: `${benefit.color}20`, color: benefit.color }}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
                  {benefit.title}
                </h3>
                <p className="text-[#B0B0B0] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Breakdown */}
      <section className="py-20 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16" style={{ fontFamily: 'var(--font-headline)' }}>
            Everything You Need to Run Your Business
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((section, index) => (
              <div
                key={index}
                className="bg-[#111111] border border-white/10 rounded-lg p-8"
              >
                <h3 className="text-2xl font-bold text-[#FF4500] mb-6" style={{ fontFamily: 'var(--font-headline)' }}>
                  {section.category}
                </h3>
                <ul className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      {item.status === 'built' ? (
                        <Check className="text-[#9D4EDD] mr-3 flex-shrink-0 mt-0.5" size={20} />
                      ) : (
                        <span className="text-[#666666] mr-3 flex-shrink-0">🔜</span>
                      )}
                      <span className={item.status === 'built' ? 'text-[#B0B0B0]' : 'text-[#666666]'}>
                        {item.text}
                        {item.status === 'coming' && (
                          <span className="ml-2 text-xs text-[#666666]">(coming soon)</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <FinalCTA />
      
      {/* Modal */}
      <ProductAccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type="pro"
      />
    </div>
  );
}