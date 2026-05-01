import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { technicalIntro, technicalRows } from '../content/home';
import TechAnimation from './animations/TechAnimation';
import ScrambleText from './ScrambleText';

export default function TechnicalProfile() {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { amount: 0.15 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "12%"]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.12, 0.28, 0.2, 0.08]);

  return (
    <section
      ref={ref}
      className="section-shell section-shell--framed"
      style={{ position: 'relative' }}
    >
      <motion.div 
        style={prefersReducedMotion ? undefined : { opacity: backgroundOpacity, y: backgroundY }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none -z-10 translate-x-1/4 translate-y-1/4"
        aria-hidden="true"
      >
        <TechAnimation isActive={!prefersReducedMotion && isInView} />
      </motion.div>
      <div className="section-intro">
        <div className="section-rail">
          <h2 className="section-label">
            <ScrambleText text="5.0 / Technical Profile" />
          </h2>
        </div>
        <div className="section-content">
          {technicalIntro.map((paragraph, index) => (
            <p
              key={paragraph.text}
              className={
                paragraph.tone === 'lead'
                  ? 'mb-8 text-[var(--color-ink)]'
                  : index === technicalIntro.length - 1
                    ? 'text-[var(--color-ink)]'
                    : 'mb-8'
              }
            >
              {paragraph.text}
            </p>
          ))}
        </div>
      </div>

      <div className="section-list">
        {technicalRows.map(([label, value], i) => (
          <motion.div 
            key={label}
            initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24, y: 18 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.72, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="data-row py-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 font-mono text-sm uppercase tracking-widest text-[var(--color-ink)]">
                {label}
              </div>
              <div className="md:col-span-8 font-sans text-lg text-[var(--color-muted)]">
                {value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
