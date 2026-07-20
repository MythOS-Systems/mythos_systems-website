import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { MythosHero } from '../components/ui/mythos-hero';
import { SanDiegoSection } from '../components/SanDiegoSection';
import { HowItWorks } from '../components/HowItWorks';
import { CinematicHero } from '../components/ui/cinematic-hero';
import { MyloOrbLazy } from '../components/ui/mylo-orb-lazy';
import { PricingSection } from '../components/PricingSection';
import { StatsSection } from '../components/StatsSection';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#000000]">
      <Navigation />
      <MythosHero />
      {/* Mylo orb section - right under the hero */}
      <section className="relative w-full overflow-hidden bg-[#000000] py-20 md:py-28">
        {/* Section divider (white) - separates the hero from the Mylo section */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent z-[2]"></div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
          <MyloOrbLazy size={420} />
          <motion.div
            className="relative z-10 -mt-24 md:-mt-32"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6A33]"
              style={{ textShadow: '0 0 6px rgba(255, 95, 35, 0.8), 0 0 16px rgba(255, 69, 0, 0.55), 0 1px 4px rgba(0, 0, 0, 0.9)' }}
            >
              Meet Mylo · The AI Brain
            </p>
            <h2 className="mythos-headline-large text-white">One brain. Many surfaces.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-[#B0B0B0]">
              The intelligence that runs your business, navigates your city, and lives across every MythOS surface.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Testing the cinematic section in place of HowItWorks. Revert: swap back to <HowItWorks /> */}
      <div className="overflow-x-hidden">
        <CinematicHero />
      </div>
      <SanDiegoSection />
      <StatsSection />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
