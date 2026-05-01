import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
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
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const rotation = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const zoom = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.92, 1]);
  const frontOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.55]);
  const nextOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.35, 0.75, 1]);
  const hingeOpacity = useTransform(scrollYProgress, [0, 0.18, 0.42, 0.72, 1], [0, 0, 0.58, 0.28, 0]);
  const hingeY = useTransform(scrollYProgress, [0, 1], ['72%', '25%']);
  const cubeTransform = useMotionTemplate`translateZ(calc(var(--hero-thesis-cube) / -2)) rotateX(${rotation}deg) scale(${zoom})`;

  return (
    <section
      ref={ref}
      className="relative border-b border-[var(--color-line)]"
      style={{
        height: prefersReducedMotion ? '100svh' : '200vh',
        position: 'relative',
      }}
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
            <HeroFace />
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
            <ThesisFace />
          </motion.div>
        </motion.div>

        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="hero-cube-hinge"
            style={{ opacity: hingeOpacity, top: hingeY }}
          />
        )}

        {prefersReducedMotion && <ThesisFace />}
      </div>
    </section>
  );
}
