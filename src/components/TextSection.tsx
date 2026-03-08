import { motion } from 'motion/react';
import { SectionParagraph } from '../content/home';

export default function TextSection({
  label,
  paragraphs,
}: {
  label: string;
  paragraphs: readonly SectionParagraph[];
}) {
  const getParagraphClass = (tone?: SectionParagraph['tone'], isLast?: boolean) => {
    if (tone === 'lead') {
      return 'section-copy-lead';
    }

    if (tone === 'closing' || isLast) {
      return 'section-copy-closing';
    }

    return 'section-copy-body';
  };

  return (
    <section className="section-shell">
      <div className="section-inner section-grid">
        <div className="section-rail">
          <h2 className="section-label lg:sticky lg:top-12">{label}</h2>
        </div>
        <div className="section-content section-copy section-copy-stage">
          <div aria-hidden="true" className="section-copy-rule" />
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={paragraph.text}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.32, delay: Math.min(index * 0.04, 0.12) }}
              className={getParagraphClass(paragraph.tone, index === paragraphs.length - 1)}
            >
              {paragraph.text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
