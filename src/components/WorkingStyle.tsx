import { motion } from 'motion/react';
import {
  workingStyleBody,
  workingStyleClosing,
  workingStyleLead,
  workingStylePullQuote,
  workingStylePrinciples,
  workingStyleRailNote,
} from '../content/home';
import {
  REVEAL_ITEM_TRANSITION,
  inViewViewport,
  revealGroupVariants,
  revealItemVariants,
  revealRuleVariants,
} from '../lib/motion';

export default function WorkingStyle() {
  return (
    <motion.section
      className="section-shell section-shell--closing working-style-shell"
    >
      <div className="section-inner section-grid">
        <div className="section-rail section-rail--sticky working-style-rail">
          <div className="working-style-rail-stack">
            <h2 className="section-label">6.0 / Working Style</h2>
            <p className="working-style-rail-note">{workingStyleRailNote}</p>
          </div>
        </div>

        <motion.div
          className="section-content section-copy-stage working-style-stage"
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          variants={revealGroupVariants}
        >
          <motion.div aria-hidden="true" className="section-copy-rule origin-left" variants={revealRuleVariants} />

          <div className="working-style-top-grid">
            <motion.div variants={revealItemVariants} className="working-style-overview">
              <p className="section-copy-lead working-style-lead">{workingStyleLead}</p>
            </motion.div>

            <motion.div variants={revealItemVariants} className="working-style-support">
              <p className="working-style-pull">{workingStylePullQuote}</p>

              <div className="working-style-body-grid">
                {workingStyleBody.map((paragraph, index) => (
                  <motion.p
                    key={paragraph.text}
                    variants={revealItemVariants}
                    transition={{
                      ...REVEAL_ITEM_TRANSITION,
                      delay: 0.08 + index * 0.04,
                    }}
                    className="section-copy-body working-style-body-copy"
                  >
                    {paragraph.text}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="working-style-principle-grid">
            {workingStylePrinciples.map((principle, index) => (
              <motion.article
                key={principle.title}
                variants={revealItemVariants}
                transition={{
                  ...REVEAL_ITEM_TRANSITION,
                  delay: 0.1 + index * 0.04,
                }}
                className="working-style-principle-card"
              >
                <div className="working-style-principle-head">
                  <span className="working-style-principle-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="working-style-principle-signal">{principle.signal}</span>
                </div>
                <h3 className="working-style-principle-title">{principle.title}</h3>
                <p className="working-style-principle-copy">{principle.detail}</p>
              </motion.article>
            ))}
          </div>

          <motion.p
            variants={revealItemVariants}
            transition={{
              ...REVEAL_ITEM_TRANSITION,
              delay: 0.14,
            }}
            className="section-copy-closing working-style-closing"
          >
            {workingStyleClosing}
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}
