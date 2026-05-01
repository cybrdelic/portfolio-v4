import { motion } from 'motion/react';
import { SectionParagraph } from '../content/home';

export default function TextSection({
  label,
  paragraphs,
}: {
  label: string;
  paragraphs: readonly SectionParagraph[];
}) {
  return (
    <section className="section-shell">
      <div className="section-inner section-grid">
        <div className="section-rail">
          <h2 className="section-label lg:sticky lg:top-12">{label}</h2>
        </div>
        <div className="section-content">
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
                    : 'mb-8'
              }
            >
              {paragraph.text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
