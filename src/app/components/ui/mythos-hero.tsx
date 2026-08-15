import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { EarlyAccessModal } from "../EarlyAccessModal";

/* ---------------- WordsPullUp ---------------- */
interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: CSSProperties;
}

export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] text-[#0047FF]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: CSSProperties;
}

export const WordsPullUpMultiStyle = ({ segments, className = "", style }: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- MythOS Hero ---------------- */
const goTo = (page: string) => (window as any).navigateTo?.(page);

const MythosHero = () => {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const videoSrc = isMobile ? "/mythos-hero-mobile.mp4" : "/mythos-site.mp4";

  return (
    <>
      <section className="h-screen w-full">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#000000] md:rounded-[2rem]">

          {/* Background video */}
          <video
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={videoSrc}
          />

          {/* Noise overlay */}
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />

          {/* Hero content */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 sm:px-6 md:px-10">
            <div className="grid grid-cols-12 items-end gap-4">

              <div className="order-1 col-span-12 pb-4 lg:order-2 lg:col-span-8 lg:pb-12 lg:text-right">
                <motion.h1
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-left font-bold tracking-[-0.04em]"
                  style={{ color: "#F5F5F0", fontFamily: "var(--font-headline)" }}
                >
                  <span className="block leading-[0.82] text-[15vw] sm:text-[12vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[8vw]">
                    Reconnect
                  </span>
                  <span className="block leading-[0.95] [text-align-last:justify] text-[10vw] sm:text-[8vw] md:text-[6.7vw] lg:text-[5.9vw] xl:text-[5.7vw]">
                    with your city
                  </span>
                </motion.h1>
              </div>

              <div className="order-2 col-span-12 flex flex-col gap-5 pb-6 lg:order-1 lg:col-span-4 lg:pb-10">

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm sm:text-base"
                  style={{ lineHeight: 1.4, color: "#B0B0B0" }}
                >
                  Define your MythOS
                </motion.p>

                {/* CTAs */}
                <div className="flex flex-col gap-4">

                  {/* Join The Rebellion -> Early Access modal */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-1.5"
                  >
                    <button
                      onClick={() => setIsEarlyAccessOpen(true)}
                      className="group inline-flex items-center gap-2 self-start rounded-full bg-[#F5F5F0] py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                    >
                      Join The Rebellion
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                        <ArrowRight className="h-4 w-4" style={{ color: "#F5F5F0" }} />
                      </span>
                    </button>
                    <span className="pl-2 text-xs text-[#707070]">Get Invited to Early Access List</span>
                  </motion.div>

                  {/* Become a Partner -> Partner page */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-1.5"
                  >
                    <button
                      onClick={() => goTo("partner")}
                      className="group inline-flex items-center gap-2 self-start rounded-full bg-[#F5F5F0] py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                    >
                      Become a Partner
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                        <ArrowRight className="h-4 w-4" style={{ color: "#F5F5F0" }} />
                      </span>
                    </button>
                    <span className="pl-2 text-xs text-[#707070]">Help us rebuild local economies</span>
                  </motion.div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EarlyAccessModal isOpen={isEarlyAccessOpen} onClose={() => setIsEarlyAccessOpen(false)} />
    </>
  );
};

export { MythosHero };
