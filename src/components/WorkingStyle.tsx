import { motion } from 'motion/react';
import {
  workingStyleBody,
  workingStyleClosing,
  workingStyleLead,
  workingStylePullQuote,
} from '../content/home';
import {
  FLIP_LAYOUT_PROPS,
  FLIP_LAYOUT_SCROLL_PROPS,
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
      {...FLIP_LAYOUT_SCROLL_PROPS}
    >
      <motion.div className="section-inner section-grid" {...FLIP_LAYOUT_PROPS}>
        <div className="section-rail">
          <h2 className="section-label lg:sticky lg:top-12">6.0 / Working Style</h2>
        </div>

        <motion.div
          className="section-content section-copy-stage working-style-stage"
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          variants={revealGroupVariants}
        >
          <motion.div aria-hidden="true" className="section-copy-rule origin-left" variants={revealRuleVariants} />

          <motion.p
            variants={revealItemVariants}
            className="section-copy-lead working-style-lead"
          >
            {workingStyleLead}
          </motion.p>

          <motion.p
            variants={revealItemVariants}
            className="working-style-pull"
          >
            {workingStylePullQuote}
          </motion.p>

          <motion.div className="working-style-body-grid" {...FLIP_LAYOUT_PROPS}>
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
          </motion.div>

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
      </motion.div>
    </motion.section>
  );
}
