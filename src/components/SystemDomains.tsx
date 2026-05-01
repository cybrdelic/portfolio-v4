import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { systemDomains } from '../content/home';
import SystemAnimation from './animations/SystemAnimation';
import ScrambleText from './ScrambleText';

function DomainRow({
  description,
  index,
  title,
}: {
  description: string;
  index: number;
  key?: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'end 45%'],
  });

  const shellOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);
  const shellY = useTransform(scrollYProgress, [0, 1], [58, 0]);
  const shellRotateX = useTransform(scrollYProgress, [0, 1], [7, 0]);
  const shellScale = useTransform(scrollYProgress, [0, 1], [0.965, 1]);
  const titleX = useTransform(scrollYProgress, [0, 1], [-36, 0]);
  const bodyX = useTransform(scrollYProgress, [0, 1], [54, 0]);
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0.08, 1]);
  const indexOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], [0, 0.35, 1, 1]);

  return (
    <motion.div
      ref={ref}
      className="group relative block data-row py-12 md:py-14"
      style={
        prefersReducedMotion
          ? { position: 'relative' }
          : {
              position: 'relative',
              opacity: shellOpacity,
              transformPerspective: 1600,
              transformOrigin: '50% 0%',
              y: shellY,
              rotateX: shellRotateX,
              scale: shellScale,
            }
      }
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--color-ink)]"
        style={prefersReducedMotion ? undefined : { scaleX: lineScaleX }}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
        <motion.div
          className="flex items-baseline gap-4 md:col-span-4"
          style={prefersReducedMotion ? undefined : { x: titleX }}
        >
          <motion.span
            className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--color-muted)]"
            style={prefersReducedMotion ? undefined : { opacity: indexOpacity }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>
          <h3 className="text-xl font-normal text-[var(--color-ink)] md:text-3xl">
            {title}
          </h3>
        </motion.div>

        <motion.div
          className="md:col-span-8"
          style={prefersReducedMotion ? undefined : { x: bodyX }}
        >
          <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-muted)] md:text-xl">
            {description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function SystemDomains() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isInView = useInView(ref, { amount: 0.15 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);
  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-3%', '8%']);
  const backgroundRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.04, 1.12]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0.1, 0.24, 0.2, 0.1]);
  const introY = useTransform(scrollYProgress, [0, 0.35], [54, 0]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.65, 1]);
  const introLabelX = useTransform(scrollYProgress, [0, 0.35], [-72, 0]);
  const introBodyX = useTransform(scrollYProgress, [0, 0.35], [96, 0]);
  const introLineScaleX = useTransform(scrollYProgress, [0, 0.35], [0.08, 1]);

  return (
    <section
      ref={ref}
      className="section-shell section-shell--framed"
      style={
        prefersReducedMotion
          ? { position: 'relative' }
          : { perspective: '2000px', position: 'relative' }
      }
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2"
        style={
          prefersReducedMotion
            ? undefined
            : {
                x: backgroundX,
                y: backgroundY,
                rotate: backgroundRotate,
                scale: backgroundScale,
                opacity: backgroundOpacity,
              }
        }
      >
        <SystemAnimation
          isActive={!prefersReducedMotion && isInView}
          scrollProgress={scrollYProgress}
        />
      </motion.div>

      <motion.div
        className="section-intro"
        style={prefersReducedMotion ? undefined : { y: introY, opacity: introOpacity }}
      >
        <motion.div className="section-rail" style={prefersReducedMotion ? undefined : { x: introLabelX }}>
          <h2 className="section-label">
            <ScrambleText text="3.0 / System Domains" />
          </h2>
        </motion.div>

        <motion.div
          className="section-content relative"
          style={prefersReducedMotion ? undefined : { x: introBodyX }}
        >
          <motion.div
            aria-hidden="true"
            className="mb-6 h-px origin-left bg-[var(--color-ink)]"
            style={prefersReducedMotion ? undefined : { scaleX: introLineScaleX }}
          />
          <p className="max-w-2xl text-[var(--color-ink)]">
            The work clusters into four operational domains.
          </p>
        </motion.div>
      </motion.div>

      <div className="section-list">
        {systemDomains.map((domain, index) => (
          <DomainRow
            key={domain.title}
            description={domain.desc}
            index={index}
            title={domain.title}
          />
        ))}
      </div>
    </section>
  );
}
