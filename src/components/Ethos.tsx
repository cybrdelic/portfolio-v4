import { motion, useReducedMotion } from 'motion/react';
import { ethosBody, ethosClosing, ethosLead, ethosPrinciples, ethosPullQuote, ethosRailNote } from '../content/home';
import { REVEAL_ITEM_TRANSITION, inViewViewport, revealGroupVariants, revealItemVariants, revealRuleVariants } from '../lib/motion';

export default function Ethos() {
  const prefersReducedMotion = Boolean(useReducedMotion());

  return (
    <section className="section-shell section-shell--essay ethos-shell">
      <div className="section-inner section-grid">
        <div className="section-rail">
          <h2 className="section-label lg:sticky lg:top-12">1.0 / Ethos</h2>
          <p className="ethos-rail-note">{ethosRailNote}</p>
        </div>

        <motion.div
          className="section-content section-copy-stage ethos-stage"
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          variants={revealGroupVariants}
        >
          <motion.div aria-hidden="true" className="section-copy-rule origin-left" variants={revealRuleVariants} />

          <div className="ethos-top-grid">
            <div className="ethos-overview">
              <motion.p
                variants={revealItemVariants}
                className="section-copy-lead ethos-lead"
              >
                {ethosLead}
              </motion.p>
            </div>

            <div className="ethos-support">
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
            </div>
          </div>

          <motion.div
            className="ethos-principle-grid"
            initial="hidden"
            whileInView="visible"
            viewport={inViewViewport}
            variants={revealGroupVariants}
          >
            {ethosPrinciples.map((principle, index) => (
              <motion.article
                key={principle.title}
                tabIndex={0}
                variants={revealItemVariants}
                transition={{
                  ...REVEAL_ITEM_TRANSITION,
                  delay: 0.06 + index * 0.04,
                }}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                whileFocus={prefersReducedMotion ? undefined : { y: -2 }}
                className="ethos-principle-card"
              >
                <div className="ethos-principle-head">
                  <span className="ethos-principle-index">{String(index + 1).padStart(2, '0')}</span>
                  <p className="ethos-principle-signal">{principle.signal}</p>
                </div>
                <p className="ethos-principle-title">{principle.title}</p>
                <p className="ethos-principle-copy">{principle.detail}</p>
              </motion.article>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
