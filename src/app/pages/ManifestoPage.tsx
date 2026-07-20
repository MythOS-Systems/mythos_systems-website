import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const ACCENT = '#FF4500';
const EASE = [0.16, 1, 0.3, 1] as const;

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: EASE },
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-5 block font-mono text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
    {children}
  </span>
);

const REBEL_TRIPLET = [
  { they: 'They optimize for', plain: 'Extraction.', accent: 'We build for circulation.' },
  { they: 'They design for', plain: 'Addiction.', accent: 'We design for exploration.' },
  { they: 'They consolidate', plain: 'Power.', accent: 'We distribute it.' },
];

export function ManifestoPage() {
  const go = (page: string) => (window as any).navigateTo?.(page);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="relative min-h-screen bg-[#000000] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{ backgroundImage: GRAIN, backgroundSize: '200px 200px', opacity: 0.05, mixBlendMode: 'overlay' }}
      />

      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-6 pt-40 pb-28 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(1100px 600px at 80% 15%, rgba(255,69,0,0.16), transparent 60%), radial-gradient(800px 500px at 5% 95%, rgba(196,30,30,0.12), transparent 60%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span
              className="h-2 w-2 animate-pulse rounded-full"
              style={{ background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }}
            />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
              The Manifesto
            </span>
          </motion.div>

          <motion.h1
            className="mt-7 max-w-[15ch] text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.96] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-headline)' }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            Big Tech took your Main Street.{' '}
            <span className="block" style={{ color: ACCENT, textShadow: '0 0 50px rgba(255,69,0,0.4)' }}>
              We're taking it back.
            </span>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-xl text-lg font-light leading-relaxed text-[#B0B0B0] md:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            They turned your city into a feed and sold it back to you as ads.{' '}
            <span className="font-semibold text-white">We're building the infrastructure to undo that,</span> and hand
            local its power again.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            <button
              onClick={() => go('home')}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-all hover:gap-3"
              style={{ backgroundColor: ACCENT }}
            >
              Join The Rebellion
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => scrollTo('building')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-[#FF4500]/50 hover:bg-[#FF4500]/[0.06]"
            >
              What We're Building
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="px-6 py-24 text-center lg:px-8">
        <motion.div className="mx-auto max-w-4xl" {...reveal}>
          <Label>Why We Started</Label>
          <h2
            className="mx-auto max-w-[22ch] text-[clamp(1.7rem,4.2vw,3rem)] font-bold leading-[1.2] tracking-tight text-white"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Local businesses don't lose because they're <span className="text-[#5f554e]">worse.</span> They lose because{' '}
            <span style={{ color: ACCENT }}>Big Tech owns the distribution,</span> and rents it back to chains.
          </h2>
        </motion.div>
      </section>

      {/* ===== STAT ===== */}
      <section className="px-6 lg:px-8">
        <motion.div
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-20 text-center backdrop-blur-xl md:px-12"
          {...reveal}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(700px 300px at 50% 0%, rgba(255,69,0,0.16), transparent 65%)' }}
          />
          <div
            className="relative text-[clamp(3.5rem,12vw,8.5rem)] font-bold leading-none tracking-[-0.04em]"
            style={{ fontFamily: 'var(--font-headline)', color: ACCENT, textShadow: '0 0 60px rgba(255,69,0,0.35)' }}
          >
            $1.451B
          </div>
          <p className="relative mx-auto mt-6 max-w-[34ch] text-lg font-light leading-relaxed text-[#B0B0B0]">
            What local businesses in two metros paid Big Tech <span className="font-semibold text-white">in a single
            year,</span> just to be seen in their own neighborhoods. That's roughly{' '}
            <span className="font-semibold text-white">40,000 local jobs,</span> vanished into ad spend.
          </p>
          <div className="relative mt-7 inline-block font-mono text-[13px] uppercase tracking-[0.14em] text-[#909090]">
            The Big Tech Tax Report drops in the press soon.
          </div>
        </motion.div>
      </section>

      {/* ===== BIG TECH TAX REPORT ===== */}
      <section className="px-6 pt-24 lg:px-8">
        <motion.div className="mx-auto max-w-6xl" {...reveal}>
          <Label>The Big Tech Tax Report · with UT Dallas</Label>
          <h2
            className="max-w-[20ch] text-[clamp(1.7rem,4.2vw,3rem)] font-bold leading-[1.1] tracking-tight text-white"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            How much is <span style={{ color: ACCENT }}>Big Tech</span> costing your business?
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-[#B0B0B0]">
            We're quantifying the "Visibility Tax" - what local businesses are forced to spend just to be found online -
            straight from the source, in partnership with UT Dallas.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {([
              { num: '$238B', label: 'Google ad revenue in 2023 alone' },
              { num: '72%', label: 'of SMBs say ad costs rose year over year' },
              {
                num: 'Matt Stoller',
                label: 'Leading anti-trust expert · featured in the report',
                eyebrow: 'Exclusive interview',
                small: true,
              },
            ] as { num: string; label: string; eyebrow?: string; small?: boolean }[]).map((s) => (
              <div key={s.label} className="bg-[#0A0A0A] p-8">
                {s.eyebrow && (
                  <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: ACCENT }}>
                    {s.eyebrow}
                  </div>
                )}
                <div
                  className="font-bold tracking-tight text-white"
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: s.small ? 'clamp(1.5rem,4vw,2.25rem)' : 'clamp(2rem,6vw,3.25rem)',
                  }}
                >
                  {s.num}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#B0B0B0]">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== WHAT WE'RE BUILDING ===== */}
      <section id="building" className="px-6 py-28 lg:px-8">
        <motion.div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16" {...reveal}>
          <div>
            <Label>What We're Building</Label>
            <h2
              className="text-[clamp(1.9rem,4.4vw,3.4rem)] font-bold leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Infrastructure that <span style={{ color: ACCENT }}>levels the field.</span>
            </h2>
          </div>
          <p className="text-xl font-light leading-relaxed text-[#C9C5BA] md:text-2xl">
            The same visibility chains pay millions for. AI that does the work of an entire team, built for how local
            actually operates. Systems designed for <span className="font-semibold text-white">circulation, not
            extraction.</span>
          </p>
        </motion.div>
      </section>

      {/* ===== WHY IT MATTERS ===== */}
      <section className="px-6 py-24 text-center lg:px-8">
        <motion.div className="mx-auto max-w-4xl" {...reveal}>
          <Label>Why It Matters</Label>
          <p
            className="mx-auto max-w-[24ch] text-[clamp(1.4rem,3.2vw,2.5rem)] font-semibold leading-[1.25] tracking-tight text-white"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Find the best taco spot three blocks away, not the chain pushed to the top of your search, and the{' '}
            <span style={{ color: ACCENT }}>money stays in your neighborhood.</span>
          </p>
          <p className="mx-auto mt-8 max-w-[46ch] text-lg font-light leading-relaxed text-[#B0B0B0]">
            When you explore instead of scroll, you meet people. Real connection happens in real places. Strong local
            economies build strong communities. That's the whole point.
          </p>
        </motion.div>
      </section>

      {/* ===== BUILT BY REBELS ===== */}
      <section className="relative px-6 py-28 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(25,12,8,0.6), transparent)' }}
        />
        <motion.div className="relative mx-auto max-w-6xl" {...reveal}>
          <Label>Built By Rebels</Label>
          <h2
            className="mb-10 max-w-[24ch] text-[clamp(1.9rem,4.4vw,3.4rem)] font-bold leading-[1.05] tracking-tight text-white"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            We don't play by their rules. Their rules were built to keep you{' '}
            <span style={{ color: ACCENT }}>losing.</span>
          </h2>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {REBEL_TRIPLET.map((t) => (
              <div key={t.they} className="bg-[#0A0A0A] p-8">
                <div className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-[#707070]">{t.they}</div>
                <div className="text-xl font-bold leading-snug text-white" style={{ fontFamily: 'var(--font-headline)' }}>
                  {t.plain} <span style={{ color: ACCENT }}>{t.accent}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-11 max-w-[34ch] text-lg font-light leading-relaxed text-[#B0B0B0] md:text-xl">
            We're rebels because we had to be. <span className="font-semibold text-white">Because no one else was
            building this,</span> and waiting for the system to fix itself meant watching more neighborhoods die.
          </p>
        </motion.div>
      </section>

      {/* ===== CLOSER ===== */}
      <section className="px-6 pb-28 lg:px-8">
        <motion.div
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] px-6 py-24 text-center backdrop-blur-xl md:px-12"
          {...reveal}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(700px 320px at 50% 100%, rgba(255,69,0,0.2), transparent 60%)' }}
          />
          <h2
            className="relative text-[clamp(2.4rem,7vw,5rem)] font-bold tracking-[-0.02em] text-white"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Are you a <span style={{ color: ACCENT, textShadow: '0 0 50px rgba(255,69,0,0.4)' }}>rebel</span> too?
          </h2>
          <p className="relative mt-4 text-lg font-light text-[#B0B0B0]">
            This is infrastructure. This is how local comes back.
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => go('home')}
              className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold text-white transition-all hover:gap-3"
              style={{ backgroundColor: ACCENT }}
            >
              Join The Rebellion
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => go('partner')}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-colors hover:border-[#FF4500]/50 hover:bg-[#FF4500]/[0.06]"
            >
              Become a Partner
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
