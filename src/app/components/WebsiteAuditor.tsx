import { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  Check,
  AlertTriangle,
  X,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

/* ----------------------------------------------------------------- types */
type Status = 'pass' | 'warn' | 'fail';
interface Finding {
  label: string;
  status: Status;
  detail: string;
}
interface Category {
  key: string;
  label: string;
  highlight: 'future' | null;
  blurb: string;
  score: number;
  findings: Finding[];
}
interface AuditResult {
  url: string;
  finalUrl: string;
  overall: number;
  categories: Category[];
  psiAvailable: boolean;
}

interface WebsiteAuditorProps {
  /** Fires when the visitor clicks the bottom "fix this" CTA (e.g. open the access modal). */
  onRequestFix?: () => void;
  /** When false, skip the email gate and show the full report immediately (internal use). */
  gated?: boolean;
}

/* ------------------------------------------------------------- helpers */
function scoreColor(score: number) {
  if (score >= 80) return '#00FF94';
  if (score >= 50) return '#FFB020';
  return '#FF4500';
}

function verdict(score: number) {
  if (score >= 80) return 'Solid foundation, with room to pull ahead.';
  if (score >= 60) return 'Getting by, but leaking customers and search visibility.';
  if (score >= 40) return 'Falling behind. Customers and AI are passing you by.';
  return 'Critical. Your site is costing you customers every day.';
}

/* Circular score ring. */
function ScoreRing({
  score,
  size = 132,
  stroke = 10,
  accent,
}: {
  score: number;
  size?: number;
  stroke?: number;
  accent?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = accent || scoreColor(score);
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-white" style={{ fontSize: size * 0.3, lineHeight: 1 }}>
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[#808080]">/ 100</span>
      </div>
    </div>
  );
}

/* Cycled while the (real, ~15-30s) audit runs so the wait feels intentional. */
const LOADING_STEPS = [
  'Fetching your website...',
  'Checking AI & agent readability...',
  'Scanning SEO fundamentals...',
  'Looking for booking & AI features...',
  'Tracing your conversion paths...',
  'Verifying trust signals...',
  'Scoring your results...',
];

const STATUS_ICON: Record<Status, JSX.Element> = {
  pass: <Check size={18} className="text-[#00FF94] mt-0.5 flex-shrink-0" />,
  warn: <AlertTriangle size={18} className="text-[#FFB020] mt-0.5 flex-shrink-0" />,
  fail: <X size={18} className="text-[#FF4500] mt-0.5 flex-shrink-0" />,
};

/* Per-category flag for the AI categories when they score low (almost always). */
function futureFlag(cat: Category): string | null {
  if (cat.highlight !== 'future' || cat.score >= 70) return null;
  return cat.key === 'ai-readability' ? "You're invisible to AI" : 'Missing the tools that book customers';
}

/* ----------------------------------------------------------- component */
export function WebsiteAuditor({ onRequestFix, gated = true }: WebsiteAuditorProps) {
  const [url, setUrl] = useState('');
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');

  // Email gate
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [gateError, setGateError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // Advance the loading message while an audit is in flight (stops on the last one).
  useEffect(() => {
    if (phase !== 'loading') return;
    setLoadingStep(0);
    const id = setInterval(
      () => setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)),
      2600,
    );
    return () => clearInterval(id);
  }, [phase]);

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setPhase('loading');
    setError('');
    setResult(null);
    setUnlocked(false);
    try {
      const resp = await fetch(`/api/audit?url=${encodeURIComponent(url.trim())}`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'The audit failed. Please try again.');
      setResult(data);
      setPhase('done');
      if (!gated) setUnlocked(true); // internal mode: no email required

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPhase('error');
    }
  };

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    setSubmitting(true);
    try {
      const scores =
        result?.categories.reduce<Record<string, number>>((acc, c) => {
          acc[c.key] = c.score;
          return acc;
        }, {}) || {};

      const resp = await fetch(`/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: 'website-audit-lead',
          email: email.trim(),
          website_url: result?.finalUrl || url.trim(),
          business_name: businessName.trim() || null,
          overall_score: result?.overall ?? null,
          scores,
          source: 'for_businesses_auditor',
        }),
      });

      if (!resp.ok && resp.status !== 201) {
        const body = await resp.text();
        throw new Error(body || 'Could not save your details. Please try again.');
      }
      setUnlocked(true);
    } catch (err) {
      setGateError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setPhase('idle');
    setResult(null);
    setError('');
    setUnlocked(false);
    setEmail('');
    setBusinessName('');
  };

  return (
    <section className="relative bg-[#0A0A0A] py-20 border-y border-white/10">
      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9D4EDD]/40 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1 mb-5 rounded-full border border-[#9D4EDD]/40 bg-[#9D4EDD]/10 text-[#C99BF5] text-xs uppercase tracking-wider">
            Free AI-era website audit
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
            Is your website ready for the AI era?
          </h2>
          <p className="text-lg text-[#B0B0B0] max-w-2xl mx-auto">
            We'll score your site on the things that actually win customers in 2026, including the AI signals no one else checks. Takes about 30 seconds.
          </p>
        </div>

        {/* Input */}
        {phase !== 'done' && (
          <form onSubmit={runAudit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="yourbusiness.com"
                  disabled={phase === 'loading'}
                  className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border border-white/20 rounded-lg text-white placeholder-[#666666] focus:outline-none focus:border-[#9D4EDD] focus:ring-1 focus:ring-[#9D4EDD] transition-colors disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={phase === 'loading' || !url.trim()}
                className="px-8 py-4 bg-[#FF4500] text-white rounded-lg font-bold hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {phase === 'loading' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Auditing...
                  </>
                ) : (
                  'Run my free audit'
                )}
              </button>
            </div>
            {phase === 'loading' && (
              <p className="text-center text-sm text-[#9D9D9D] mt-4 transition-opacity animate-pulse">
                {LOADING_STEPS[loadingStep]}
              </p>
            )}
            {phase === 'error' && <p className="text-center text-[#FF4500] mt-4">{error}</p>}
          </form>
        )}

        {/* Results */}
        {phase === 'done' && result && (
          <div className="mt-4">
            {/* Overall */}
            <div className="flex flex-col items-center text-center mb-12">
              <p className="text-sm text-[#808080] mb-4 break-all">{result.finalUrl}</p>
              <ScoreRing score={result.overall} size={168} stroke={12} />
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-6 mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                {verdict(result.overall)}
              </h3>
              <button onClick={reset} className="text-sm text-[#808080] underline hover:text-white transition-colors mt-2">
                Audit a different site
              </button>
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {result.categories.map((cat) => {
                const isFuture = cat.highlight === 'future';
                const flag = futureFlag(cat);
                const accent = isFuture ? '#9D4EDD' : undefined;
                const needWork = cat.findings.filter((f) => f.status !== 'pass').length;
                return (
                  <div
                    key={cat.key}
                    className={`rounded-xl p-6 border transition-all ${
                      isFuture
                        ? 'border-[#9D4EDD]/40 bg-gradient-to-b from-[#9D4EDD]/10 to-transparent shadow-[0_0_24px_rgba(157,78,221,0.12)]'
                        : 'border-white/10 bg-[#111111]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <ScoreRing score={cat.score} size={84} stroke={8} accent={accent} />
                      <div className="flex-1 min-w-0">
                        {isFuture && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C99BF5] mb-1">
                            <Sparkles size={11} /> Future-readiness
                          </span>
                        )}
                        <h4 className="text-lg font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-headline)' }}>
                          {cat.label}
                        </h4>
                        <p className="text-xs text-[#909090] mt-1">
                          {needWork === 0 ? 'All checks passed' : `${needWork} of ${cat.findings.length} checks need work`}
                        </p>
                      </div>
                    </div>
                    {flag && (
                      <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FF4500]/15 border border-[#FF4500]/30 text-[#FF6B3D] text-xs font-semibold">
                        <AlertTriangle size={12} /> {flag}
                      </div>
                    )}
                    <p className="text-sm text-[#B0B0B0] mt-4 leading-relaxed">{cat.blurb}</p>
                  </div>
                );
              })}
            </div>

            {/* Gate or full report */}
            {!unlocked ? (
              <div className="relative max-w-xl mx-auto rounded-xl border border-white/15 bg-[#111111] p-8 text-center">
                <div className="inline-flex p-3 rounded-full bg-[#9D4EDD]/15 mb-4">
                  <Lock size={24} className="text-[#C99BF5]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
                  Unlock your full report
                </h3>
                <p className="text-[#B0B0B0] mb-6">
                  See every issue we found, exactly why it's costing you customers, and how to fix it. We'll email you a copy.
                </p>
                <form onSubmit={unlock} className="space-y-3 text-left">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourbusiness.com"
                    className="w-full px-4 py-3 bg-[#000000] border border-white/20 rounded text-white placeholder-[#666666] focus:outline-none focus:border-[#9D4EDD] transition-colors"
                  />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Business name (optional)"
                    className="w-full px-4 py-3 bg-[#000000] border border-white/20 rounded text-white placeholder-[#666666] focus:outline-none focus:border-[#9D4EDD] transition-colors"
                  />
                  {gateError && <p className="text-[#FF4500] text-sm">{gateError}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#9D4EDD] text-white rounded font-bold hover:bg-[#9D4EDD]/90 transition-all hover:shadow-lg hover:shadow-[#9D4EDD]/40 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : <>Show me the full report <ArrowRight size={18} /></>}
                  </button>
                  <p className="text-xs text-[#666666] text-center">No spam. Just your report and how to fix it.</p>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                {result.categories.map((cat) => {
                  const isFuture = cat.highlight === 'future';
                  return (
                    <div key={cat.key} className="rounded-xl border border-white/10 bg-[#111111] overflow-hidden">
                      <div className={`flex items-center gap-3 px-6 py-4 border-b border-white/10 ${isFuture ? 'bg-[#9D4EDD]/10' : ''}`}>
                        <span className="font-bold text-white" style={{ color: scoreColor(cat.score) }}>
                          {cat.score}
                        </span>
                        <h4 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-headline)' }}>
                          {cat.label}
                        </h4>
                      </div>
                      <ul className="divide-y divide-white/5">
                        {cat.findings.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 px-6 py-4">
                            {STATUS_ICON[f.status]}
                            <div>
                              <p className="text-white font-medium">{f.label}</p>
                              <p className="text-sm text-[#909090] mt-0.5 leading-relaxed">{f.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}

                {/* Pitch block */}
                <div className="relative rounded-2xl border border-[#9D4EDD]/40 bg-gradient-to-br from-[#9D4EDD]/15 via-[#0047FF]/5 to-transparent p-8 md:p-12 text-center overflow-hidden">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-headline)' }}>
                    Own Your Digital Presence
                  </h3>
                  <p className="text-lg md:text-xl text-[#C99BF5] font-semibold mb-3">
                    See the after, before the after.
                  </p>
                  <p className="text-lg text-[#D0D0D0] max-w-2xl mx-auto mb-2">
                    Your customers shouldn't have to imagine the result. Mylo shows them.
                  </p>
                  <p className="text-[#B0B0B0] max-w-2xl mx-auto mb-8">
                    Every gap in this report, AI readability, on-site booking, conversion, trust, is exactly what MythOS was built to close. We don't just fix your website. We make it the smartest one on your street.
                  </p>
                  <button
                    onClick={() => (onRequestFix ? onRequestFix() : (window as any).navigateTo?.('business'))}
                    className="px-8 py-4 bg-[#FF4500] text-white rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all duration-300 inline-flex items-center gap-2"
                  >
                    Have MythOS fix this <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
