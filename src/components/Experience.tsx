import { motion } from 'motion/react';
import { experienceIntro, experienceRoles } from '../content/home';
import {
  EASE_STANDARD,
  SPRING_FLIP,
  REVEAL_ITEM_TRANSITION,
  inViewViewport,
  revealGroupVariants,
  revealItemVariants,
  revealRuleVariants,
} from '../lib/motion';

export default function Experience() {
  return (
    <motion.section
      className="section-shell section-shell--dense section-shell--framed experience-shell"
    >
      <div className="section-intro">
        <div className="section-rail section-rail--sticky">
          <h2 className="section-label">
            4.0 / Experience
          </h2>
        </div>
        <motion.div
          className="section-content section-copy section-copy-stage experience-copy-panel"
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          variants={revealGroupVariants}
        >
          <motion.div aria-hidden="true" className="section-copy-rule origin-left" variants={revealRuleVariants} />
          {experienceIntro.map((paragraph, index) => (
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
                  : paragraph.tone === 'closing'
                    ? 'section-copy-closing'
                    : 'section-copy-body'
              }
            >
              {paragraph.text}
            </motion.p>
          ))}
        </motion.div>
      </div>

      <div className="experience-stack">
        {experienceRoles.map((role, index) => {
          return (
          <motion.article
            key={`${role.company}-${role.title}`}
            layout
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.03, ease: EASE_STANDARD, layout: SPRING_FLIP }}
            className="experience-card"
          >
            <div className="experience-card-frame">
              <div className="experience-card-top">
                <div className="experience-card-title-block">
                  <span className="hero-stat-index experience-card-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="experience-card-title-copy">
                    <p className="experience-card-title">{role.title}</p>
                    <p className="experience-row-company">{role.company}</p>
                  </div>
                </div>

                <div className="experience-card-meta-grid">
                  <div className="technical-row-signal">
                    <p className="technical-row-signal-label">Period</p>
                    <p>{role.period}</p>
                  </div>
                  <div className="technical-row-signal">
                    <p className="technical-row-signal-label">Base</p>
                    <p>{role.location}</p>
                  </div>
                </div>
              </div>

              <div className="experience-card-body">
                <p className="experience-card-summary">{role.summary}</p>
                <div className="experience-highlight-grid">
                  {role.highlights.map((highlight) => (
                    <div key={highlight.title} className="experience-highlight-card">
                      <p className="experience-highlight-title">{highlight.title}</p>
                      <p className="experience-highlight-detail">{highlight.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}
