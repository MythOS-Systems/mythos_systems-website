import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, ArrowRight, Shield, Plus, Check, Loader2 } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { StayUpdatedModal } from '../components/StayUpdatedModal';
import { EventInquiryModal } from '../components/EventInquiryModal';
import { NeonSign } from '../components/ui/neon-sign';
import { EventStrip, EventsCalendarModal, type MythosEvent } from '../components/ui/events-calendar';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const ACCENT = '#FF4500';

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Upcoming events for the strip + calendar. Only DFW Launch Week has a
 * locked date for now; the rest are "Date TBA" until confirmed. Month is
 * 0-indexed when a date is set.
 */
const EVENTS: MythosEvent[] = [
  { id: 1, name: 'Fight for Local', city: 'Dallas / Fort Worth', tag: 'Fight night + hackathon', featured: true },
  { id: 2, date: new Date(2026, 9, 1), name: 'DFW Launch Week', city: 'Dallas / Fort Worth', tag: 'Launch' },
  { id: 3, name: 'Creator & Community Night', city: 'Multiple cities', tag: 'Community' },
  { id: 4, name: 'Fight for Local: Next City', city: 'Nationwide', tag: 'Fight night' },
];

/** A small orange section label used inside the Fight for Local card. */
function ZoneLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#909090]">{children}</span>
    </div>
  );
}

/** One of the two "Pick your fight" tracks. */
function Track({
  n,
  kind,
  title,
  desc,
  bullets,
  cta,
  onCta,
  color,
  delay = 0,
}: {
  n: string;
  kind: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  onCta: () => void;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border bg-black/30 p-6 md:p-8"
      style={{ borderColor: `${color}40` }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: `${color}26` }}
      />
      <div className="relative flex items-start justify-between">
        <span
          className="rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ backgroundColor: `${color}1f`, color }}
        >
          Track {n} · {kind}
        </span>
        <span
          className="text-5xl font-bold leading-none"
          style={{ fontFamily: 'var(--font-headline)', color, opacity: 0.25 }}
        >
          {n}
        </span>
      </div>
      <h3 className="relative mt-6 text-2xl font-bold text-white md:text-3xl" style={{ fontFamily: 'var(--font-headline)' }}>
        {title}
      </h3>
      <p className="relative mt-3 leading-relaxed text-[#B0B0B0]">{desc}</p>
      <ul className="relative mt-5 space-y-2.5">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-[#C9C5BA]">
            <Check size={18} className="mt-0.5 flex-shrink-0" style={{ color }} />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onCta}
        className="group relative mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-all hover:gap-3"
        style={{ backgroundColor: color }}
      >
        {cta}
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  );
}

export function EventsPage() {
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [inquiry, setInquiry] = useState<{ title: string; blurb: string } | null>(null);

  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribeError('');
    setSubscribing(true);
    try {
      // Route into the MythOS Pro Comms inbox via the website's forwarder.
      // Tagged source=events_page so it's filterable from other signups.
      const res = await fetch(`/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: 'events-signup',
          email: email.trim(),
          city: 'Events page',
          source: 'events_page',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || 'Something went wrong. Please try again.');
      }
      setSubscribed(true);
    } catch (err) {
      setSubscribeError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#000000] text-white">
      {/* Film grain for a little grit */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{ backgroundImage: GRAIN, backgroundSize: '200px 200px', opacity: 0.05, mixBlendMode: 'overlay' }}
      />

      <Navigation />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-4 pt-36 pb-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-1/4 right-0 h-[36rem] w-[36rem] rounded-full bg-[#FF4500]/15 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }} />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
              MythOS Events
            </span>
          </motion.div>

          <motion.h1
            className="mythos-headline-large mt-6 max-w-4xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          >
            Local doesn't happen <span style={{ color: ACCENT }}>online.</span>
          </motion.h1>

          <motion.p
            className="mt-7 max-w-2xl text-lg leading-relaxed text-[#B0B0B0] md:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          >
            So we show up. MythOS hosts events in the cities we serve, bringing local business owners, creators, and
            neighbors together to fight for local in person.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <button
              onClick={() => setIsUpdatesOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-all hover:gap-3"
              style={{ backgroundColor: ACCENT }}
            >
              Get event updates
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href="#fight-for-local"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#909090] transition-colors hover:text-white"
            >
              See Fight for Local ↓
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== FIGHT FOR LOCAL (one glass card) ===== */}
      <section id="fight-for-local" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Neon sign hook */}
          <motion.div
            className="mb-10 flex justify-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <NeonSign text="Fight for Local" sizeClass="text-2xl sm:text-3xl md:text-5xl" />
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.05] shadow-2xl backdrop-blur-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-90px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {/* Liquid-glass sheen + colored glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(80% 60% at 100% 0%, rgba(255,69,0,0.20) 0%, rgba(157,78,221,0.10) 38%, rgba(0,0,0,0) 72%)',
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.08] to-transparent"
            />

            {/* Zone 1 - what it is */}
            <div className="relative p-7 sm:p-9 md:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  Championship fight night
                </span>
                <span className="flex items-center gap-1.5 text-sm text-white">
                  <MapPin size={16} style={{ color: ACCENT }} />
                  Dallas / Fort Worth
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#B0B0B0]">
                  <Calendar size={16} style={{ color: ACCENT }} />
                  Date coming soon
                </span>
              </div>

              <h2
                className="mt-6 max-w-3xl text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.05] text-white"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                A championship fight night that fights for local business.
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#B0B0B0]">
                One night in Dallas / Fort Worth. Two ways in: watch the fights, or build in the hackathon. The whole
                local community in one room, with the first Fight for Local belt on the line.
              </p>
            </div>

            {/* Zone 2 - Pick your fight */}
            <div className="relative border-t border-white/10 p-7 sm:p-9 md:p-12">
              <ZoneLabel>Pick your fight</ZoneLabel>
              <div className="grid gap-4 md:grid-cols-2">
                <Track
                  n="01"
                  kind="Watch"
                  color="#FF4500"
                  title="The Fight Night"
                  desc="Live combat in partnership with a premier fight promotion. The energy, the crowd, the main card. This is the draw, and it's open to everyone. Simple RSVP, grab your spot."
                  bullets={[
                    'Live sanctioned fights',
                    'Open to the public, fans, operators, locals',
                    'Stay for the final 3 demos & the crowning',
                  ]}
                  cta="RSVP to Watch"
                  onCta={() =>
                    setInquiry({
                      title: 'RSVP to Watch',
                      blurb: "Reserve your spot for fight night. We'll send details as the date locks in.",
                    })
                  }
                />
                <Track
                  n="02"
                  kind="Compete"
                  color="#0047FF"
                  delay={0.1}
                  title="The Hackathon"
                  desc="Builders fighting for local. Rules and theme drop a week out, follow to get them, plan with your team, then build all day. The fights are your rounds: present to the judges between bouts, survive the cut, and keep building right up to the final bell."
                  bullets={[
                    'Theme & rules released one week before',
                    'Build all day, keep iterating every round',
                    'Elimination bracket: survive each round to advance',
                    'Final 3 demo in the cage after the main event',
                  ]}
                  cta="Apply to Compete"
                  onCta={() =>
                    setInquiry({
                      title: 'Apply to Compete',
                      blurb: 'Tell us who you are and what you want to build. Spots are limited.',
                    })
                  }
                />
              </div>
            </div>

            {/* Zone 3 - In our corner */}
            <div className="relative border-t border-white/10 p-7 sm:p-9 md:p-12">
              <ZoneLabel>In our corner</ZoneLabel>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Fight partner */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 md:p-8">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                    style={{ background: 'rgba(157,78,221,0.18)' }}
                  />
                  <div className="relative flex items-center gap-2">
                    <Shield size={18} style={{ color: ACCENT }} />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#909090]">
                      Fight partner
                    </span>
                  </div>
                  <h3
                    className="relative mt-4 text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    Produced with a pro fight organization.
                  </h3>
                  <p className="relative mt-3 leading-relaxed text-[#B0B0B0]">
                    The fights are real, put on with a professional fight organization. The partner reveal drops soon.
                  </p>
                  <div className="relative mt-5 flex h-20 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02]">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#707070]">
                      Partner reveal coming soon
                    </span>
                  </div>
                </div>

                {/* Become a sponsor */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 md:p-8">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
                    style={{ background: 'rgba(255,69,0,0.18)' }}
                  />
                  <div className="relative flex items-center gap-2">
                    <Plus size={18} style={{ color: ACCENT }} />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#909090]">
                      Sponsorship
                    </span>
                  </div>
                  <h3
                    className="relative mt-4 text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    Your brand here.
                  </h3>
                  <p className="relative mt-3 leading-relaxed text-[#B0B0B0]">
                    Put your business in front of the whole city. Back a fight, a booth, or the whole night. Local-first
                    brands get the spotlight, not buried under an ad auction.
                  </p>
                  <button
                    onClick={() =>
                      setInquiry({
                        title: 'Become a sponsor',
                        blurb: 'Put your brand in front of the whole city. Tell us how you want to show up.',
                      })
                    }
                    className="group relative mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-all hover:gap-3"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Become a sponsor
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== UPCOMING (date-ordered strip) ===== */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <EventStrip events={EVENTS} onSeeAll={() => setIsCalendarOpen(true)} />
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-10 text-center md:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 80% at 50% 0%, rgba(255,69,0,0.16) 0%, rgba(157,78,221,0.08) 40%, rgba(0,0,0,0) 72%)',
            }}
          />
          <h2 className="mythos-headline-large relative text-white">
            Don't watch from the <span style={{ color: ACCENT }}>sidelines.</span>
          </h2>
          <p className="mythos-body-large relative mx-auto mt-5 max-w-xl text-[#B0B0B0]">
            Drop your email. Be first to get the date, the city, and your way in.
          </p>

          {subscribed ? (
            <div className="relative mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full border border-[#FF4500]/40 bg-[#FF4500]/[0.08] px-6 py-4">
              <Check size={18} style={{ color: ACCENT }} />
              <span className="font-semibold text-white">You're in. Watch your inbox.</span>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubscribe} className="relative mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourcity.com"
                  aria-label="Email address"
                  className="flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-white outline-none backdrop-blur-md transition-colors placeholder:text-[#707070] focus:border-[#FF4500]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-all hover:gap-3 disabled:opacity-70"
                  style={{ backgroundColor: ACCENT }}
                >
                  {subscribing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Joining
                    </>
                  ) : (
                    <>
                      Join The Rebellion
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
              {subscribeError && <p className="relative mt-3 text-sm text-[#ff8a8a]">{subscribeError}</p>}
            </>
          )}
        </motion.div>
      </section>

      <Footer />

      {/* Modals */}
      <StayUpdatedModal isOpen={isUpdatesOpen} onClose={() => setIsUpdatesOpen(false)} />
      <EventsCalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} events={EVENTS} />
      <EventInquiryModal
        isOpen={!!inquiry}
        onClose={() => setInquiry(null)}
        title={inquiry?.title ?? ''}
        blurb={inquiry?.blurb ?? ''}
      />
    </div>
  );
}
