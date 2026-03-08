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
      className="group relative block domain-row data-row py-12 md:py-14"
      style={
        prefersReducedMotion
          ? undefined
          : {
              opacity: shellOpacity,
              position: 'relative',
              y: shellY,
            }
      }
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--color-line-strong)]"
        style={prefersReducedMotion ? undefined : { scaleX: lineScaleX }}
      />

      <div className="grid grid-cols-1 gap-7 md:grid-cols-12 md:items-start">
        <div className="flex items-start gap-4 md:col-span-5">
          <motion.span
            className="hero-stat-index mt-[0.55rem]"
            style={prefersReducedMotion ? undefined : { opacity: indexOpacity }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.span>
          <h3 className="domain-row-title">
            {title}
          </h3>
        </div>

        <div className="md:col-span-7">
          <p className="domain-row-copy">
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
      style={{ position: 'relative' }}
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
          <p className="max-w-[34rem] text-[1.04rem] leading-[1.72] text-[var(--color-ink)] md:text-[1.14rem]">
            Four operating domains where architecture, interaction, and system behavior matter as much as implementation.
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
