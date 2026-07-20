import { Navigation } from '../components/Navigation';
import { Clock, Target, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { GetInvolvedModal } from '../components/GetInvolvedModal';

export function DFWPage() {
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false);
  const [isGetInvolvedModalOpen, setIsGetInvolvedModalOpen] = useState(false);

  const handleJoinWaitlist = () => {
    setIsEarlyAccessModalOpen(true);
  };

  const handleLearnMore = () => {
    (window as any).navigateTo?.('products');
  };

  const handlePartnerWithUs = () => {
    setIsGetInvolvedModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF4500]/20 via-[#9D4EDD]/10 to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4500]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#9D4EDD]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-6 py-2 border-2 border-[#FF4500] rounded-full">
            <span className="text-[#FF4500] font-bold tracking-wider">MYTHOS PRO - COMING 2026</span>
          </div>
          <h1 
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            DALLAS-FORT WORTH:<br />
            WHERE IT ALL<br />
            STARTED
          </h1>
        </div>
      </section>

      {/* We're From Here Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-[#FF4500] pl-8">
            <h2 
              className="text-5xl font-bold text-white mb-8"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              We're From Here.
            </h2>
            <div className="space-y-6 text-xl text-[#B0B0B0] leading-relaxed">
              <p>
                This isn't some Silicon Valley company parachuting into DFW with another "solution" that doesn't understand your city. <span className="text-white font-bold">We're Dallas natives.</span> We built our first business here. We watched corporate chains crush local spots here. We learned what it takes to survive here.
              </p>
              <p className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-headline)' }}>
                And we decided to do something about it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built in Dallas Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9D4EDD]/5 to-transparent"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-5xl font-bold text-white mb-12 text-center"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Built in Dallas. For Dallas.
          </h2>
          
          <div className="bg-gradient-to-br from-[#FF4500]/10 to-[#9D4EDD]/10 border border-white/10 rounded-2xl p-12 mb-12">
            <div className="space-y-6 text-lg text-[#B0B0B0] leading-relaxed">
              <p>
                MythOS Pro started in a Dallas barbershop. Not a tech incubator. Not a VC boardroom. <span className="text-white font-semibold">A real small business</span> where the owner was working 80-hour weeks, juggling twenty roles at once, and still losing ground to corporate chains with unlimited budgets and entire teams.
              </p>
              <p>
                That's why we're launching MythOS Pro here first. Because Dallas-Fort Worth deserves the tools to fight back.
              </p>
              <p className="text-white font-semibold text-xl">
                We're partnered with <span className="text-[#FF4500]">UTD SOLV</span> right now on a capstone project studying exactly how Big Tech extracts wealth from local economies. The data is clear. The problem is real. And the solution is being built right here in North Texas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Time Back Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-5xl font-bold text-white mb-12 text-center"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Your Time Back
          </h2>

          <div className="mb-12 text-center">
            <p className="text-xl text-[#B0B0B0] leading-relaxed max-w-3xl mx-auto mb-8">
              Corporate chains have marketing teams. Sales teams. Tech teams. Customer service departments. Operations managers.
            </p>
            <p className="text-2xl text-white font-bold mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
              You? You're doing all of it. Alone. While trying to actually run your business.
            </p>
            <p className="text-3xl text-[#0047FF] font-bold mb-8" style={{ fontFamily: 'var(--font-headline)' }}>
              MythOS Pro changes that.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="border border-white/10 rounded-lg p-6 hover:border-[#0047FF]/50 transition-all group">
              <div className="flex items-start gap-4 mb-3">
                <div className="p-3 rounded-lg bg-[#0047FF]/10 group-hover:bg-[#0047FF]/20 transition-all">
                  <Users className="w-5 h-5 text-[#0047FF]" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Reception</h3>
              </div>
              <p className="text-[#B0B0B0]">Handles your reception 24/7 so you don't have to</p>
            </div>

            <div className="border border-white/10 rounded-lg p-6 hover:border-[#9D4EDD]/50 transition-all group">
              <div className="flex items-start gap-4 mb-3">
                <div className="p-3 rounded-lg bg-[#9D4EDD]/10 group-hover:bg-[#9D4EDD]/20 transition-all">
                  <Clock className="w-5 h-5 text-[#9D4EDD]" />
                </div>
                <h3 className="text-xl font-bold text-white">Smart Scheduling</h3>
              </div>
              <p className="text-[#B0B0B0]">Books your appointments automatically</p>
            </div>

            <div className="border border-white/10 rounded-lg p-6 hover:border-[#FF4500]/50 transition-all group">
              <div className="flex items-start gap-4 mb-3">
                <div className="p-3 rounded-lg bg-[#FF4500]/10 group-hover:bg-[#FF4500]/20 transition-all">
                  <Target className="w-5 h-5 text-[#FF4500]" />
                </div>
                <h3 className="text-xl font-bold text-white">Customer Management</h3>
              </div>
              <p className="text-[#B0B0B0]">Manages your customers effortlessly</p>
            </div>

            <div className="border border-white/10 rounded-lg p-6 hover:border-[#0047FF]/50 transition-all group">
              <div className="flex items-start gap-4 mb-3">
                <div className="p-3 rounded-lg bg-[#0047FF]/10 group-hover:bg-[#0047FF]/20 transition-all">
                  <Zap className="w-5 h-5 text-[#0047FF]" />
                </div>
                <h3 className="text-xl font-bold text-white">Built for Small Business</h3>
              </div>
              <p className="text-[#B0B0B0]">Not enterprise software scaled down - built for YOU</p>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border-2 border-[#0047FF]/30 rounded-2xl p-10 text-center">
            <div className="text-6xl font-bold text-[#0047FF] mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
              $100/month
            </div>
            <p className="text-xl text-white font-semibold mb-2">
              No contracts.
            </p>
            <p className="text-[#B0B0B0] text-lg">
              Just the power you need to compete.
            </p>
          </div>
        </div>
      </section>

      {/* The Mission Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-[#FF4500]/5 to-transparent"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-5xl font-bold text-white mb-12 text-center"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            The Mission
          </h2>

          <div className="space-y-6 text-xl text-[#B0B0B0] leading-relaxed max-w-4xl mx-auto">
            <p>
              We're not here to "disrupt" your business. We're here to give you the same advantages that monopolies spend millions on. <span className="text-white font-bold">Level the playing field.</span> Let you focus on what you do best instead of drowning in admin work.
            </p>
            <p>
              Strong local businesses build strong communities. When money stays in Dallas instead of flowing to Seattle or Cupertino, neighborhoods thrive. When you have time to actually serve customers instead of answering the same scheduling questions all day, quality wins.
            </p>
            <p className="text-white text-2xl font-bold text-center" style={{ fontFamily: 'var(--font-headline)' }}>
              This is infrastructure for the local rebellion.
            </p>
            <p className="text-[#FF4500] text-2xl font-bold text-center" style={{ fontFamily: 'var(--font-headline)' }}>
              And it starts in DFW.
            </p>
          </div>
        </div>
      </section>

      {/* Dallas Knows How to Fight Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0047FF]/10 to-[#FF4500]/10 border border-white/10 rounded-2xl p-12">
            <h2 
              className="text-5xl font-bold text-white mb-8 text-center"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Dallas Knows How to Fight
            </h2>
            <div className="space-y-6 text-lg text-[#B0B0B0] leading-relaxed text-center">
              <p>
                This city has always been about hustle. Grit. Building something real. We're not waiting for Silicon Valley to save us. <span className="text-white font-bold">We're building the tools ourselves.</span>
              </p>
              <p className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-headline)' }}>
                MythOS Pro launches here in 2026.
              </p>
              <p className="text-xl text-white">
                Dallas business owners get first access. Because you're not just customers - you're the reason this exists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500]/20 via-[#9D4EDD]/20 to-[#0047FF]/20"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4 mb-12">
            <p className="text-3xl text-white font-bold" style={{ fontFamily: 'var(--font-headline)' }}>
              This is how local wins.
            </p>
            <p className="text-3xl text-white font-bold" style={{ fontFamily: 'var(--font-headline)' }}>
              This is how Dallas takes back what's ours.
            </p>
            <p className="text-4xl text-[#FF4500] font-bold" style={{ fontFamily: 'var(--font-headline)' }}>
              This is MythOS Pro.
            </p>
          </div>

          <div className="text-4xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-headline)' }}>
            Ready to get your time back?
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            <button
              onClick={handleJoinWaitlist}
              className="px-10 py-5 bg-[#FF4500] text-white text-lg font-bold rounded-lg hover:bg-[#FF4500]/90 transition-all duration-200 hover:shadow-lg hover:shadow-[#FF4500]/50"
            >
              Join the Waitlist
            </button>
            <button
              onClick={handleLearnMore}
              className="px-10 py-5 border-2 border-[#0047FF] text-[#0047FF] text-lg font-bold rounded-lg hover:bg-[#0047FF]/10 transition-all duration-200"
            >
              Learn More
            </button>
            <button
              onClick={handlePartnerWithUs}
              className="px-10 py-5 border-2 border-[#9D4EDD] text-[#9D4EDD] text-lg font-bold rounded-lg hover:bg-[#9D4EDD]/10 transition-all duration-200"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <EarlyAccessModal isOpen={isEarlyAccessModalOpen} onClose={() => setIsEarlyAccessModalOpen(false)} />
      <GetInvolvedModal isOpen={isGetInvolvedModalOpen} onClose={() => setIsGetInvolvedModalOpen(false)} />
    </div>
  );
}
