import { motion } from 'motion/react';
import { useRef } from 'react';
import { technicalIntro, technicalRows } from '../content/home';
import {
  EASE_STANDARD,
  FLIP_LAYOUT_PROPS,
  FLIP_LAYOUT_SCROLL_PROPS,
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
      {...FLIP_LAYOUT_SCROLL_PROPS}
    >
      <motion.div className="section-intro" {...FLIP_LAYOUT_PROPS}>
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
      </motion.div>

      <motion.div className="section-list" {...FLIP_LAYOUT_PROPS}>
        {technicalRows.map((row, i) => {
          return (
          <motion.div
            key={row.label}
            layout
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.56, delay: i * 0.035, ease: EASE_STANDARD, layout: SPRING_FLIP }}
            className="profile-row data-row py-10 md:py-11"
          >
            <motion.div className="technical-row-grid" {...FLIP_LAYOUT_PROPS}>
              <motion.div className="technical-row-rail" {...FLIP_LAYOUT_PROPS}>
                <div className="flex items-start gap-4">
                  <span className="hero-stat-index technical-row-index">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-4">
                    <p className="profile-row-label">{row.label}</p>
                    <div className="technical-row-signal">
                      <p className="technical-row-signal-label">Operating signal</p>
                      <p>{row.signal}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div className="technical-row-body" {...FLIP_LAYOUT_PROPS}>
                <p className="technical-row-primary">{row.primary}</p>
                <p className="technical-row-detail">{row.detail}</p>
              </motion.div>
            </motion.div>
          </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
