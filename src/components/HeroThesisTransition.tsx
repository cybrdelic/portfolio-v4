import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
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
      <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/4 opacity-90">
        <HeroAnimation isActive />
      </div>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pb-24 pt-40 md:px-12">
        <div className="max-w-5xl">
          <p className="mb-6 font-mono text-sm uppercase tracking-widest text-[var(--color-muted)]">
            <ScrambleText text={heroIdentity} />
          </p>
          <h1 className="text-4xl font-normal leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-12 border-t border-[var(--color-line)] pt-12 md:grid-cols-3">
          {heroStats.map((item) => (
            <div key={item.label}>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
                {item.label}
              </p>
              <p className="text-sm">{item.value}</p>
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
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:px-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-[var(--color-muted)] lg:sticky lg:top-12">
            1.0 / Thesis
          </h2>
        </div>
        <div className="overflow-auto pr-2 lg:col-span-8">
          <div className="max-w-4xl font-sans text-lg leading-relaxed text-[var(--color-muted)] md:text-xl">
            {thesisParagraphs.map((paragraph) => (
              <p
                key={paragraph.text}
                className={
                  paragraph.tone === 'lead'
                    ? 'mb-8 text-[var(--color-ink)]'
                    : paragraph.tone === 'closing'
                      ? 'text-[var(--color-ink)]'
                      : 'mb-8'
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
  const cubeTransform = useMotionTemplate`translateZ(calc(var(--hero-thesis-cube) / -2)) rotateX(${rotation}deg) scale(${zoom})`;

  return (
    <section
      ref={ref}
      className="relative border-b border-[var(--color-line)]"
      style={{
        height: prefersReducedMotion ? '100svh' : '200vh',
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

        {prefersReducedMotion && <ThesisFace />}
      </div>
    </section>
  );
}
