import { motion } from 'motion/react';
import { ethosBody, ethosClosing, ethosLead, ethosPullQuote } from '../content/home';
import { REVEAL_ITEM_TRANSITION, inViewViewport, revealGroupVariants, revealItemVariants, revealRuleVariants } from '../lib/motion';

export default function Ethos() {
  return (
    <section className="section-shell section-shell--essay ethos-shell">
      <div className="section-inner section-grid">
        <div className="section-rail">
          <h2 className="section-label lg:sticky lg:top-12">1.0 / Ethos</h2>
        </div>

        <motion.div
          className="section-content section-copy-stage ethos-stage"
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          variants={revealGroupVariants}
        >
          <motion.div aria-hidden="true" className="section-copy-rule origin-left" variants={revealRuleVariants} />

          <motion.p
            variants={revealItemVariants}
            className="section-copy-lead ethos-lead"
          >
            {ethosLead}
          </motion.p>

          <motion.p
            variants={revealItemVariants}
            className="ethos-pull"
          >
            {ethosPullQuote}
          </motion.p>

          <div className="ethos-body-grid">
            {ethosBody.map((paragraph, index) => (
              <motion.p
                key={paragraph.text}
                variants={revealItemVariants}
                transition={{
                  ...REVEAL_ITEM_TRANSITION,
                  delay: 0.08 + index * 0.04,
                }}
                className="section-copy-body ethos-body-copy"
              >
                {paragraph.text}
              </motion.p>
            ))}
          </div>

          <motion.p
            variants={revealItemVariants}
            transition={{
              ...REVEAL_ITEM_TRANSITION,
              delay: 0.14,
            }}
            className="section-copy-closing ethos-closing"
          >
            {ethosClosing}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
