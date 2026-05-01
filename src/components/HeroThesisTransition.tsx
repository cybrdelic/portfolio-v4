import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  heroIdentity,
  heroStats,
  heroTitle,
  thesisParagraphs,
} from '../content/home';
import HeroAnimation from './animations/HeroAnimation';
import ScrambleText from './ScrambleText';

function HeroFace() {
  return (
    <div className="relative h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] -translate-y-1/4 translate-x-1/3 opacity-40 mix-blend-multiply md:h-[560px] md:w-[560px] md:opacity-55 lg:opacity-65">
        <HeroAnimation isActive />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center gap-14 px-6 py-16 md:gap-20 md:px-12 md:py-20">
        <div className="max-w-5xl">
          <p className="mb-6 font-mono text-sm uppercase tracking-widest text-[var(--color-muted)]">
            <ScrambleText text={heroIdentity} />
          </p>
          <h1 className="max-w-5xl text-4xl font-normal leading-[1.04] tracking-tight md:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              data-field-target
              data-field-kind="route"
              data-field-label="selected work"
              className="field-action inline-flex min-h-11 items-center gap-2 border border-[var(--color-ink)] px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
            >
              View work <ArrowDown size={14} />
            </a>
            <a
              href="#contact"
              data-field-target
              data-field-kind="contact"
              data-field-label="email path"
              className="field-action inline-flex min-h-11 items-center gap-2 border border-[var(--color-line)] px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              Contact <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 border-t border-[var(--color-line)] pt-6 md:grid-cols-3 md:gap-10 md:pt-8">
          {heroStats.map((item) => (
            <div key={item.label}>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)]">
                {item.label}
              </p>
              <p className="max-w-xs text-sm leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThesisFace() {
  return (
    <div className="h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--color-muted)] lg:sticky lg:top-12">
            1.0 / Thesis
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

export default function HeroThesisTransition() {
  const ref = useRef<HTMLElement>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsCompactViewport(query.matches);

    updateViewport();
    query.addEventListener('change', updateViewport);

    return () => query.removeEventListener('change', updateViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const stageScale = useTransform(
    scrollYProgress,
    [0, 0.24, 0.7, 0.9],
    [1, 0.985, isCompactViewport ? 0.88 : 0.68, isCompactViewport ? 0.74 : 0.42]
  );
  const stageY = useTransform(
    scrollYProgress,
    [0, 0.36, 0.7, 0.9],
    [0, -8, isCompactViewport ? -34 : -112, isCompactViewport ? -112 : -286]
  );
  const stageInset = useTransform(
    scrollYProgress,
    [0, 0.24, 0.76, 1],
    [0, 0, isCompactViewport ? 8 : 36, isCompactViewport ? 16 : 96]
  );
  const stageRadius = useTransform(scrollYProgress, [0, 0.5, 1], ['0px', '5px', '8px']);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.64, 0.76, 0.82], [1, 1, 0.12, 0]);
  const stageClipPath = useMotionTemplate`inset(${stageInset}px round ${stageRadius})`;
  const frameOpacity = useTransform(scrollYProgress, [0, 0.18, 0.58, 0.82], [0, 0, 0.76, 0]);
  const frameScaleX = useTransform(scrollYProgress, [0.2, 1], [0.08, 1]);
  const nextOpacity = useTransform(scrollYProgress, [0, 0.76, 0.88, 1], [0, 0, 0.9, 1]);
  const nextY = useTransform(scrollYProgress, [0, 0.74, 1], [88, 12, 0]);
  const nextScale = useTransform(scrollYProgress, [0, 0.68, 1], [0.965, 0.99, 1]);
  const marginOpacity = useTransform(scrollYProgress, [0, 0.22, 0.72, 1], [0, 0, 0.46, 0.76]);

  if (prefersReducedMotion) {
    return (
      <section ref={ref} className="relative border-b border-[var(--color-line)]">
        <div className="min-h-[100svh]">
          <HeroFace />
        </div>
        <div className="border-t border-[var(--color-line)]">
          <ThesisFace />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="hero-scroll-section relative border-b border-[var(--color-line)]"
    >
      <div className="hero-scroll-sticky sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="hero-scroll-margin-field"
          style={{ opacity: marginOpacity }}
        />

        <motion.div
          className="hero-thesis-underlay absolute inset-0"
          style={{ opacity: nextOpacity, scale: nextScale, y: nextY }}
        >
          <ThesisFace />
        </motion.div>

        <motion.div
          className="hero-stage-shell absolute inset-0 overflow-hidden border-y border-[var(--color-line)] bg-[var(--color-bg)]"
          style={{
            borderRadius: stageRadius,
            clipPath: stageClipPath,
            opacity: stageOpacity,
            scale: stageScale,
            y: stageY,
          }}
        >
          <HeroFace />
          <motion.div
            aria-hidden="true"
            className="hero-stage-chrome"
            style={{ opacity: frameOpacity }}
          >
            <motion.span style={{ scaleX: frameScaleX }} />
            <i>Scroll field</i>
            <b>Thesis handoff</b>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
