import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { SectionParagraph } from '../content/home';

export default function TextSection({
  label,
  paragraphs,
}: {
  label: string;
  paragraphs: readonly SectionParagraph[];
}) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 88%', 'end 35%'],
  });
  const railX = useTransform(scrollYProgress, [0, 0.38], [-44, 0]);
  const bodyY = useTransform(scrollYProgress, [0, 0.42], [46, 0]);
  const bodyOpacity = useTransform(scrollYProgress, [0, 0.16, 0.42], [0, 0.68, 1]);
  const ruleScale = useTransform(scrollYProgress, [0, 0.4], [0.08, 1]);

  return (
    <section ref={ref} className="section-shell section-motion-shell">
      <div className="section-inner section-grid">
        <motion.div
          className="section-rail"
          style={prefersReducedMotion ? undefined : { x: railX }}
        >
          <h2 className="section-label lg:sticky lg:top-12">{label}</h2>
        </motion.div>
        <motion.div
          className="section-content"
          style={prefersReducedMotion ? undefined : { opacity: bodyOpacity, y: bodyY }}
        >
          <motion.div
            aria-hidden="true"
            className="section-motion-rule"
            style={prefersReducedMotion ? undefined : { scaleX: ruleScale }}
          />
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={paragraph.text}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.08, 0.24) }}
              className={
                paragraph.tone === 'lead'
                  ? 'mb-8 text-[var(--color-ink)]'
                  : paragraph.tone === 'closing'
                    ? 'text-[var(--color-ink)]'
                    : 'mb-8 text-[var(--color-muted)]'
              }
            >
              {paragraph.text}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
