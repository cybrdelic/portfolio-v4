import { motion } from 'motion/react';
import { SectionParagraph } from '../content/home';
import { REVEAL_ITEM_TRANSITION, inViewViewport, revealGroupVariants, revealItemVariants, revealRuleVariants } from '../lib/motion';

export default function TextSection({
  label,
  paragraphs,
  variant = 'essay',
}: {
  label: string;
  paragraphs: readonly SectionParagraph[];
  variant?: 'essay' | 'closing';
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
    <section
      className={`section-shell ${variant === 'closing' ? 'section-shell--closing' : 'section-shell--essay'}`}
    >
      <div className="section-inner section-grid">
        <div className="section-rail">
          <h2 className="section-label lg:sticky lg:top-12">{label}</h2>
        </div>
        <motion.div
          className="section-content section-copy section-copy-stage"
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          variants={revealGroupVariants}
        >
          <motion.div aria-hidden="true" className="section-copy-rule origin-left" variants={revealRuleVariants} />
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={paragraph.text}
              variants={revealItemVariants}
              transition={{
                ...REVEAL_ITEM_TRANSITION,
                delay: Math.min(index * 0.04, 0.12),
              }}
              className={getParagraphClass(paragraph.tone, index === paragraphs.length - 1)}
            >
              {paragraph.text}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
