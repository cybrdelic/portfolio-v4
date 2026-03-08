import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { systemDomains } from '../content/home';

const domainSignals = [
  'Operator load down',
  'Spatial state live',
  'Behavior over assets',
  'Precision under pressure',
] as const;

function DomainCard({
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
    offset: ['start 88%', 'end 50%'],
  });

  const shellOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);
  const shellY = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const shellScale = useTransform(scrollYProgress, [0, 1], [0.98, 1]);

  return (
    <motion.article
      ref={ref}
      className="domain-card"
      style={
        prefersReducedMotion
          ? undefined
          : {
              opacity: shellOpacity,
              y: shellY,
              scale: shellScale,
            }
      }
    >
      <p className="hero-stat-index domain-card-index">
        {String(index + 1).padStart(2, '0')}
      </p>

      <div className="flex min-h-[8rem] flex-col justify-between gap-6">
        <h3 className="domain-card-title">{title}</h3>
        <p className="domain-card-copy">{description}</p>
      </div>

      <div className="domain-card-band mt-10">
        <p className="eyebrow">Operating signal</p>
        <p>{domainSignals[index]}</p>
      </div>
    </motion.article>
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
          <p className="max-w-[36rem] text-[1.05rem] leading-[1.72] text-[var(--color-ink)] md:text-[1.16rem]">
            Four operating territories where technical systems stop being passive software and start behaving like instruments.
          </p>
        </div>
      </motion.div>

      <div className="section-list border-t-0">
        <div className="domain-card-grid">
          {systemDomains.map((domain, index) => (
            <DomainCard
              key={domain.title}
              description={domain.desc}
              index={index}
              title={domain.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
