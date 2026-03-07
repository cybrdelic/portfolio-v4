import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { systemDomains } from '../content/home';

function DomainRow({
  description,
  index,
  title,
}: {
  description: string;
  index: number;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 88%', 'end 48%'],
  });

  const shellOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);
  const shellY = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0.18, 1]);
  const indexOpacity = useTransform(scrollYProgress, [0, 0.25, 0.5, 1], [0, 0.25, 0.8, 0.8]);

  return (
    <motion.div
      ref={ref}
      className="group relative block data-row py-10 md:py-12"
      style={
        prefersReducedMotion
          ? undefined
          : {
              opacity: shellOpacity,
              y: shellY,
            }
      }
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--color-line-strong)]"
        style={prefersReducedMotion ? undefined : { scaleX: lineScaleX }}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
        <div className="flex items-baseline gap-4 md:col-span-4">
          <motion.span
            className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-muted)]"
            style={prefersReducedMotion ? undefined : { opacity: indexOpacity }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>
          <h3 className="max-w-[14ch] text-[1.2rem] font-normal tracking-[-0.03em] text-[var(--color-ink)] md:text-[1.7rem]">
            {title}
          </h3>
        </div>

        <div className="md:col-span-8">
          <p className="body-premium max-w-[34rem] text-[1rem] leading-[1.66] md:text-[1.06rem]">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function SystemDomains() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const introY = useTransform(scrollYProgress, [0, 0.35], [10, 0]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.72, 1]);
  const introLineScaleX = useTransform(scrollYProgress, [0, 0.35], [0.18, 1]);

  return (
    <section
      ref={ref}
      className="section-shell section-shell--framed"
    >
      <motion.div
        className="section-intro"
        style={prefersReducedMotion ? undefined : { y: introY, opacity: introOpacity }}
      >
        <div className="section-rail">
          <h2 className="section-label">
            3.0 / System Domains
          </h2>
        </div>

        <div className="section-content relative">
          <motion.div
            aria-hidden="true"
            className="mb-5 h-px w-14 origin-left bg-[var(--color-line-strong)]"
            style={prefersReducedMotion ? undefined : { scaleX: introLineScaleX }}
          />
          <p className="max-w-[28rem] text-[1.05rem] text-[var(--color-ink)] md:text-[1.12rem]">
            Four operating domains.
          </p>
        </div>
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
