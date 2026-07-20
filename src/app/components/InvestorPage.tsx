import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Play,
  FileText,
  Sparkles,
  Glasses,
  Wallet,
} from 'lucide-react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { InvestorDeckModal } from './InvestorDeckModal';
import { GlassesDemoModal } from './GlassesDemoModal';

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, color = '#0047FF' }: { children: ReactNode; color?: string }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color }}>
        {children}
      </span>
    </div>
  );
}

export function InvestorPage() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [glassesOpen, setGlassesOpen] = useState(false);

  const pillars = [
    { label: 'The market', desc: '$40B in local-business software, premium AI hardware, and a slice of multi-trillion local commerce. We sit on top of all of it.', color: '#0047FF' },
    { label: 'The moat', desc: 'Reinforcing edges - SaaS depth, 0.7% payments, one AI brain - and The Network capturing hyper-local behavioral data no one else can touch.', color: '#9D4EDD' },
    { label: 'The entry', desc: 'A bridge round today, ahead of a priced $3-5M round. Early - by design.', color: '#FF4500' },
  ];

  const builds = [
    {
      icon: <Wallet size={22} />,
      name: 'MythOS Wallet',
      tag: 'Payments',
      desc: 'Payments at 0.7% - undercutting the transaction tax and closing the loop.',
      color: '#FF4500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000]">
      <Navigation />

      {/* ===== 1. HOOK ===== */}
      <section className="relative overflow-hidden border-b border-white/10 px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[#0047FF]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[#FF4500]/[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>MythOS · Bridge Round · May 2026</Eyebrow>
            <h1 className="mythos-headline-medium text-white sm:whitespace-nowrap">
              What if we told you unicorns are real?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#B0B0B0]">
              Every generational company looked obvious in hindsight and absurd at the time. MythOS is building the
              operating system for local economies - software, hardware, and payments that compound city by city.
              The bridge round is your seat at the table before the priced round.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {pillars.map((t, i) => (
              <Reveal key={t.label} delay={0.1 + i * 0.08}>
                <div className="h-full rounded-xl border border-white/10 bg-[#111] p-6">
                  <div className="mb-3 h-1 w-10" style={{ background: t.color }} />
                  <h3 className="mb-2 text-lg font-bold text-white">{t.label}</h3>
                  <p className="text-sm leading-relaxed text-[#B0B0B0]">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 2. VIEW THE DECK ===== */}
      <section className="border-b border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#0047FF]/30 bg-gradient-to-br from-[#0047FF]/10 via-[#000000] to-[#9D4EDD]/10 p-8 sm:p-12">
              <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-xl">
                  <Eyebrow>The thesis · 29 slides</Eyebrow>
                  <h2 className="mythos-headline-medium text-white">The whole story, in five minutes.</h2>
                  <p className="mt-4 text-[#B0B0B0]">
                    The problem, the operating system, the hardware, the traction, and the ask. Request a copy and we'll send the full deck straight over.
                  </p>
                </div>
                <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setRequestOpen(true)}
                    data-mythos-track="investors-request-copy-hero"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#0047FF] px-8 py-4 font-semibold text-white transition-all hover:gap-4 hover:shadow-xl hover:shadow-[#0047FF]/40"
                  >
                    <FileText size={18} />
                    Request the Deck
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== software products CTA (above the hardware) ===== */}
      <section className="border-b border-white/10 px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0047FF]/10 via-[#000000] to-[#000000] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <Eyebrow>The software</Eyebrow>
              <h3 className="text-2xl font-semibold text-white">Check out our software products.</h3>
              <p className="mt-2 text-[#B0B0B0]">MythOS Pro, The Network, and Mylo - the live products behind the hardware.</p>
            </div>
            <button
              onClick={() => (window as { navigateTo?: (p: string) => void }).navigateTo?.('products')}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#F5F5F0] px-7 py-3.5 font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              See the products
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </section>

      {/* ===== 3. THE HARDWARE (Mylo Glasses) ===== */}
      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* ===== Mylo Glasses - the hardware build ===== */}
          <div>
            <Reveal>
              <Eyebrow color="#FF4500">On the face</Eyebrow>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="mythos-headline-large text-white">Mylo Glasses.</h2>
                <span className="rounded-full border border-[#FF4500]/40 bg-[#FF4500]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#FF4500]">
                  Prototype · roadmap
                </span>
              </div>
              <p className="mt-5 max-w-2xl text-lg text-[#B0B0B0]">
                Mylo Glasses are the operating system of the human - one premium device with a full in-lens display,
                putting Mylo on the face of every operator and, eventually, everyone on The Network.
              </p>
              <button
                onClick={() => setGlassesOpen(true)}
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#FF4500] px-8 py-4 font-semibold text-white transition-all hover:gap-4 hover:shadow-xl hover:shadow-[#FF4500]/40"
              >
                <Play size={20} fill="currentColor" />
                Explore the build
              </button>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-white/10 bg-[#111] p-7">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: "#FF45001A", color: "#FF4500" }}>
                    <Glasses size={22} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">For operators</h3>
                  <p className="text-sm leading-relaxed text-[#B0B0B0]">
                    Walk in and Mylo briefs you on every client before they sit - last visit's notes, their cut, their
                    preferences. Ask a question and it answers right on your glasses, hands-free, without breaking your
                    stride.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-[#111] p-7">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: "#0047FF1A", color: "#0047FF" }}>
                    <Sparkles size={22} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">For everyone else</h3>
                  <p className="text-sm leading-relaxed text-[#B0B0B0]">
                    Your city in your line of sight. At a farmers market Mylo points you to the vendor that matches what
                    you're after; land somewhere new and it surfaces the spots that feel like home.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="mt-4 rounded-2xl border border-[#FF4500]/30 bg-[#FF4500]/5 p-7">
                <h3 className="text-lg font-bold text-white">Profile portability, not facial recognition.</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#B0B0B0]">
                  Facial recognition tells a business <span className="text-white">who</span> you are. MythOS tells them{" "}
                  <span className="text-white">who you are, what you need, and how to serve you</span> - from a profile{" "}
                  <span className="text-white">you</span> write and control. No biometrics, no surveillance, legally
                  clean. Mylo filters it down to only what's relevant for that business, in that moment.
                </p>
              </div>
            </Reveal>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { num: '$120B+', label: 'US TAM ceiling - the largest in the MythOS lineup' },
                { num: '$15-25B', label: 'core B2B across ~3M units - barbershops, salons, restaurants, retail' },
                { num: '$899', label: 'one premium SKU · Apple-tier hardware margins at scale' },
              ].map((s, i) => (
                <Reveal key={s.label} delay={0.12 + i * 0.06}>
                  <div className="h-full rounded-xl border border-white/10 bg-[#111] p-6">
                    <div className="mythos-headline-medium text-white">{s.num}</div>
                    <p className="mt-2 text-sm text-[#B0B0B0]">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* One more build */}
          <Reveal>
            <p className="mt-16 mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#707070]">
              And one more build on the roadmap
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {builds.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.1}>
                <div className="flex h-full items-start gap-4 rounded-xl border border-white/10 bg-[#111] p-6">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${b.color}1A`, color: b.color }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{b.name}</h3>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#707070]">
                        {b.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#B0B0B0]">{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. THE ASK ===== */}
      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <Eyebrow>The ask</Eyebrow>
              <h2 className="mythos-headline-large text-white">
                A <span className="text-[#0047FF]">bridge round</span> to ship the proof.
              </h2>
              <p className="mt-5 max-w-md text-lg text-[#B0B0B0]">
                Enough to put MythOS Pro in real shops, prove the unit economics in one city, and step into a priced
                <span className="text-white"> $3-5M</span> round from strength.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-3">
                {[
                  { k: 'First shops live', v: 'MythOS Pro in real businesses' },
                  { k: 'Dallas / Fort Worth', v: 'Prove the model city by city' },
                  { k: 'The team', v: 'Ship faster, sign partners' },
                ].map((row) => (
                  <div key={row.k} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111] px-6 py-5">
                    <span className="font-semibold text-white">{row.k}</span>
                    <span className="text-right text-sm text-[#B0B0B0]">{row.v}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== 7. CONTACT ===== */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="mythos-headline-medium text-white">Start a conversation.</h2>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setRequestOpen(true)}
                data-mythos-track="investors-request-copy-contact"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#0047FF] px-8 py-4 font-semibold text-white transition-all hover:gap-4"
              >
                Request the deck & intro <ArrowRight size={18} />
              </button>
            </div>
            <div className="mt-10 space-y-1 text-[#B0B0B0]">
              <p className="font-semibold text-white">Nate Adams</p>
              <p className="text-sm">Founder &amp; CEO · MythOS Systems</p>
              <p className="text-sm">
                <a href="mailto:nateadams@mythosrebellion.com" data-mythos-track="investors-contact-email" className="underline decoration-white/20 transition-colors hover:text-white hover:decoration-white">
                  nateadams@mythosrebellion.com
                </a>
              </p>
              <p className="text-sm">
                <a href="tel:+12144309485" data-mythos-track="investors-contact-phone" className="underline decoration-white/20 transition-colors hover:text-white hover:decoration-white">
                  214-430-9485
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />

      <GlassesDemoModal isOpen={glassesOpen} onClose={() => setGlassesOpen(false)} />
      <InvestorDeckModal isOpen={requestOpen} onClose={() => setRequestOpen(false)} />
    </div>
  );
}
