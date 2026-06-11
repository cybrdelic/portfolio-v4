import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  heroIdentity,
  heroMobileSubtitle,
  heroStats,
  heroTagline,
  heroTitle,
  thesisParagraphs,
} from '../content/home';
import HeroAnimation from './animations/HeroAnimation';
import ScrambleText from './ScrambleText';

function DesktopHeroFace() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="relative h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-10" />
      <motion.div
        className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] -translate-y-1/4 translate-x-1/3 mix-blend-multiply md:h-[560px] md:w-[560px]"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.4, delay: 0.45, ease }}
      >
        <HeroAnimation isActive />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent" />

      <div className="relative z-10 flex h-full w-full flex-col px-6 py-14 md:px-12 md:py-16">
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <motion.p
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.06, ease }}
          >
            <ScrambleText text="Autonomous Systems · GPU · Simulation" />
          </motion.p>

          {/* ALEX — first name as scale reference, light weight */}
          <div className="overflow-hidden">
            <motion.p
              className="text-[clamp(2rem,4.5vw,66px)] font-light tracking-[0.06em] text-[var(--color-muted)]"
              initial={prefersReducedMotion ? false : { y: '105%' }}
              animate={{ y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.85, delay: 0.1, ease }}
            >
              ALEX
            </motion.p>
          </div>

          {/* FIGUEROA — surname as architectural statement, heavy weight */}
          <div className="overflow-hidden pb-[0.08em]">
            <motion.h1
              className="text-[clamp(4rem,18vw,240px)] font-extrabold leading-[0.86] tracking-[-0.055em]"
              initial={prefersReducedMotion ? false : { y: '105%' }}
              animate={{ y: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.95, delay: 0.22, ease }}
            >
              FIGUEROA
            </motion.h1>
          </div>

          <motion.p
            className="mt-8 font-mono text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.5, ease }}
          >
            {heroTagline}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.62, delay: 0.68, ease }}
          >
            <a
              href="#work"
              data-field-target
              data-field-kind="route"
              data-field-label="selected work"
              className="field-action inline-flex min-h-11 items-center gap-2 border border-[var(--color-ink)] px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
            >
              View work <ArrowDown size={14} />
            </a>
            <Link
              to="/project/firesim-native"
              data-field-target
              data-field-kind="route"
              data-field-label="firesim native case study"
              className="field-action inline-flex min-h-11 items-center gap-2 border border-[var(--color-line)] px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              Open FireSim <ArrowUpRight size={14} />
            </Link>
            <a
              href="https://github.com/cybrdelic"
              target="_blank"
              rel="noreferrer"
              data-field-target
              data-field-kind="external"
              data-field-label="github profile"
              className="field-action inline-flex min-h-11 items-center gap-2 border border-[var(--color-line)] px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 border-t border-[var(--color-line)] pt-6 md:grid-cols-2 md:gap-10 md:pt-8"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.62, delay: 0.85, ease }}
        >
          {heroStats.map((item) => (
            <div key={item.label}>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
                {item.label}
              </p>
              <p className="max-w-xs text-sm leading-relaxed">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function DesktopThesisFace() {
  return (
    <div className="h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--color-muted)] lg:sticky lg:top-12">
            Thesis
          </h2>
        </div>
        <div className="overflow-auto pr-2 lg:col-span-8">
          <div className="max-w-3xl font-sans text-base leading-relaxed text-[var(--color-muted)] md:text-xl">
            {thesisParagraphs.map((paragraph) => (
              <p
                key={paragraph.text}
                className={
                  paragraph.tone === 'lead'
                    ? 'mb-6 text-[var(--color-ink)]'
                    : paragraph.tone === 'closing'
                      ? 'text-[var(--color-ink)]'
                      : 'mb-6'
                }
              >
                {paragraph.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileHero() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-line)] text-[var(--color-ink)] lg:hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
      <div className="pointer-events-none absolute right-[-5rem] top-12 h-[360px] w-[360px] opacity-30 mix-blend-multiply">
        <HeroAnimation isActive />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)]/82 to-transparent" />

      <div className="relative z-10 px-6 pb-8 pt-16">
        <motion.p
          className="mb-5 font-mono text-sm uppercase tracking-widest text-[var(--color-muted)]"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, delay: 0.05 }}
        >
          <ScrambleText text={heroIdentity} />
        </motion.p>
        <div className="overflow-hidden pb-[0.06em]">
          <motion.h1
            className="max-w-[9ch] text-[clamp(2.9rem,13.5vw,4.9rem)] leading-[0.92] tracking-[-0.06em]"
            initial={prefersReducedMotion ? false : { y: '105%' }}
            animate={{ y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.82, delay: 0.12, ease }}
          >
            {heroTagline}
          </motion.h1>
        </div>
        <motion.p
          className="mt-5 max-w-[22ch] text-base leading-[1.45] text-[var(--color-muted)]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, delay: 0.52, ease }}
        >
          {heroMobileSubtitle}
        </motion.p>

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/project/firesim-native"
            data-field-target
            data-field-kind="route"
            data-field-label="firesim native mobile hero"
            className="field-action inline-flex min-h-12 items-center justify-between gap-3 border border-[var(--color-ink)] px-4 py-3 font-mono text-xs uppercase tracking-[0.24em] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
          >
            Open FireSim <ArrowUpRight size={14} />
          </Link>
          <a
            href="#work"
            data-field-target
            data-field-kind="route"
            data-field-label="selected work mobile hero"
            className="field-action inline-flex min-h-12 items-center justify-between gap-3 border border-[var(--color-line)] px-4 py-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
          >
            Selected Work <ArrowDown size={14} />
          </a>
        </div>

        <div className="mt-7 grid gap-3 border-t border-[var(--color-line)] pt-5">
          {heroStats.map((item) => (
            <div key={item.label} className="grid gap-2 border-b border-[var(--color-line)]/60 pb-3 last:border-b-0 last:pb-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
                {item.label}
              </p>
              <p className="max-w-[24ch] text-[13px] leading-relaxed text-[var(--color-ink)]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HeroThesisTransition() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    const apply = () => setIsMobile(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  const rotation = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const zoom = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.92, 1]);
  const frontOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.55]);
  const nextOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.35, 0.75, 1]);
  const hingeOpacity = useTransform(scrollYProgress, [0, 0.18, 0.42, 0.72, 1], [0, 0, 0.58, 0.28, 0]);
  const hingeY = useTransform(scrollYProgress, [0, 1], ['72%', '25%']);
  const cubeTransform = useMotionTemplate`translateZ(calc(var(--hero-thesis-cube) / -2)) rotateX(${rotation}deg) scale(${zoom})`;

  if (isMobile) {
    return <MobileHero />;
  }

  return (
    <section
      ref={ref}
      className="relative hidden border-b border-[var(--color-line)] lg:block"
      style={{ height: prefersReducedMotion ? '100svh' : '160vh' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden [perspective:2200px] [--hero-thesis-cube:100svh]">
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={prefersReducedMotion ? undefined : { transform: cubeTransform }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden border-y border-[var(--color-line)] [backface-visibility:hidden]"
            style={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: frontOpacity,
                    transform: 'translateZ(calc(var(--hero-thesis-cube) / 2))',
                  }
            }
          >
            <DesktopHeroFace />
          </motion.div>

          <motion.div
            className="absolute inset-0 overflow-hidden border-y border-[var(--color-line)] [backface-visibility:hidden]"
            style={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: nextOpacity,
                    transform: 'rotateX(-90deg) translateZ(calc(var(--hero-thesis-cube) / 2))',
                    transformOrigin: 'center center',
                  }
            }
          >
            <DesktopThesisFace />
          </motion.div>
        </motion.div>

        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="hero-cube-hinge"
            style={{ opacity: hingeOpacity, top: hingeY }}
          />
        )}

        {prefersReducedMotion && <DesktopThesisFace />}
      </div>
    </section>
  );
}
