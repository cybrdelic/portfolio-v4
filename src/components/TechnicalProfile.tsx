import { motion } from 'motion/react';
import { useRef } from 'react';
import { technicalIntro, technicalRows } from '../content/home';
import {
  EASE_STANDARD,
  SPRING_FLIP,
  REVEAL_ITEM_TRANSITION,
  inViewViewport,
  revealGroupVariants,
  revealItemVariants,
  revealRuleVariants,
} from '../lib/motion';

export default function TechnicalProfile() {
  const ref = useRef(null);

  return (
    <motion.section
      ref={ref}
      className="section-shell section-shell--dense section-shell--framed technical-profile-shell"
    >
      <div className="section-intro">
        <div className="section-rail section-rail--sticky">
          <h2 className="section-label">
            5.0 / Technical Profile
          </h2>
        </div>
        <motion.div
          className="section-content section-copy section-copy-stage technical-profile-intro"
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          variants={revealGroupVariants}
        >
          <motion.div aria-hidden="true" className="section-copy-rule origin-left" variants={revealRuleVariants} />
          {technicalIntro.map((paragraph, index) => (
            <motion.p
              key={paragraph.text}
              variants={revealItemVariants}
              transition={{
                ...REVEAL_ITEM_TRANSITION,
                delay: index * 0.05,
              }}
              className={
                paragraph.tone === 'lead'
                  ? 'section-copy-lead'
                  : index === technicalIntro.length - 1
                    ? 'section-copy-closing'
                    : 'section-copy-body'
              }
            >
              {paragraph.text}
            </motion.p>
          ))}
        </motion.div>
      </div>

      <div className="technical-reference-list">
        {technicalRows.map((row, i) => {
          return (
          <motion.article
            key={row.label}
            layout
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.56, delay: i * 0.035, ease: EASE_STANDARD, layout: SPRING_FLIP }}
            className="technical-reference-item"
          >
            <div className="technical-reference-grid">
              <div className="technical-reference-rail">
                <span className="hero-stat-index technical-reference-index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="technical-reference-meta">
                  <p className="technical-reference-label">{row.label}</p>
                  <p className="technical-reference-signal">{row.signal}</p>
                </div>
              </div>

              <div className="technical-reference-primary-block">
                <p className="technical-reference-primary">{row.primary}</p>
              </div>

              <div className="technical-reference-detail-block">
                <p className="technical-reference-detail">{row.detail}</p>
              </div>
            </div>
          </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}
