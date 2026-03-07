import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';
import {
  heroDeck,
  heroName,
  heroRole,
  heroStats,
  heroTitleLines,
  thesisParagraphs,
} from '../content/home';
import HeroRectLayer from './HeroRectLayer';
import ScrambleText from './ScrambleText';

function HeroFace() {
  return (
    <div className="hero-face relative h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-line-strong)]" />
      <div className="pointer-events-none absolute inset-y-0 left-6 hidden w-px bg-[var(--color-line-soft)]/60 md:left-12 md:block" />

      <div className="hero-stage relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pb-6 pt-16 md:px-12 md:pb-8 md:pt-20">
        <div className="relative z-10 max-w-[62rem]">
          <div className="hero-copy-shell relative overflow-hidden border-t border-[var(--color-line-strong)] pl-4 pr-5 pt-4 md:pl-6 md:pr-10 md:pt-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[var(--color-line-strong)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0))]" />

            <div className="hero-meta-row mb-5 flex flex-col gap-2 border-b border-[var(--color-line-soft)]/90 pb-3 md:mb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="hero-name text-[0.95rem] tracking-[-0.03em] text-[var(--color-ink)] md:text-[1.02rem]">
                  <ScrambleText text={heroName} />
                </p>
                <p className="hero-role mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  {heroRole}
                </p>
              </div>
              <p className="hero-location hidden font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-muted)] md:block">
                System-first
              </p>
            </div>

            <h1 className="hero-headline display-tight max-w-[13ch] text-[clamp(2.4rem,8.6vw,3.35rem)] md:max-w-[11.5ch] md:text-[clamp(3rem,5.6vw,4.2rem)] lg:max-w-[10.8ch] lg:text-[clamp(3.4rem,4.45vw,4.7rem)]">
              {heroTitleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-7 grid gap-5 md:mt-8 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
              <div aria-hidden="true" className="hidden h-px bg-[var(--color-line-soft)] md:block" />
              <p className="hero-deck max-w-[20rem] text-[0.96rem] leading-[1.56] text-[var(--color-muted-soft)] md:justify-self-end md:text-[1rem]">
                {heroDeck}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-0 hidden flex-1 items-center md:flex">
          <HeroRectLayer />
        </div>

        <div className="hero-stats relative z-10 mt-5 grid grid-cols-2 border-t border-[var(--color-line-strong)] md:mt-6 md:grid-cols-3 md:divide-x md:divide-[var(--color-line-soft)]">
          {heroStats.map((item, index) => (
            <div
              key={item.label}
              className={`relative px-3.5 py-3 md:px-[1.125rem] md:py-3.5 ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <div className="mb-2.5 flex items-center justify-between gap-4">
                <p className="eyebrow">{item.label}</p>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="max-w-[21ch] text-[0.78rem] leading-[1.42] text-[var(--color-ink)] md:max-w-[22ch] md:text-[0.84rem] md:leading-[1.47]">
                {item.value}
              </p>
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
          <h2 className="section-label lg:sticky lg:top-12">
            1.0 / Thesis
          </h2>
        </div>
        <div className="pr-2 lg:col-span-8">
          <div className="section-content section-copy max-w-[42rem] font-sans text-lg md:text-[1.32rem]">
            <div aria-hidden="true" className="section-copy-rule mb-8" />
            {thesisParagraphs.map((paragraph) => (
              <p
                key={paragraph.text}
                className={
                  paragraph.tone === 'lead'
                    ? 'section-copy-lead'
                    : paragraph.tone === 'closing'
                      ? 'section-copy-closing'
                      : 'section-copy-body'
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

  const rotation = useTransform(scrollYProgress, [0, 0.5, 1], [0, 38, 84]);
  const zoom = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.986, 1]);
  const frontOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0.76]);
  const nextOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.58, 0.84, 1]);
  const cubeTransform = useMotionTemplate`translateZ(calc(var(--hero-thesis-cube) / -2)) rotateX(${rotation}deg) scale(${zoom})`;

  if (prefersReducedMotion) {
    return (
      <>
        <section className="relative min-h-[100svh] border-b border-[var(--color-line)]">
          <HeroFace />
        </section>
        <section className="relative border-b border-[var(--color-line)]">
          <ThesisFace />
        </section>
      </>
    );
  }

  return (
    <section
      ref={ref}
      className="relative border-b border-[var(--color-line)]"
      style={{
        height: '200vh',
      }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--color-bg)] [perspective:2200px] [--hero-thesis-cube:100svh]">
        <motion.div
          className="absolute inset-0 z-10 [transform-style:preserve-3d]"
          style={{ transform: cubeTransform }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden border-y border-[var(--color-line)] [backface-visibility:hidden]"
            style={{
              opacity: frontOpacity,
              transform: 'translateZ(calc(var(--hero-thesis-cube) / 2))',
            }}
          >
            <HeroFace />
          </motion.div>

          <motion.div
            className="absolute inset-0 overflow-hidden border-y border-[var(--color-line)] [backface-visibility:hidden]"
            style={{
              opacity: nextOpacity,
              transform: 'rotateX(-90deg) translateZ(calc(var(--hero-thesis-cube) / 2))',
              transformOrigin: 'center center',
            }}
          >
            <ThesisFace />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
