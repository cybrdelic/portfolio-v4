import { motion } from 'motion/react';
import { experienceIntro, experienceRoles } from '../content/home';
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

export default function Experience() {
  return (
    <motion.section
      className="section-shell section-shell--dense section-shell--framed experience-shell"
      {...FLIP_LAYOUT_SCROLL_PROPS}
    >
      <motion.div className="section-intro" {...FLIP_LAYOUT_PROPS}>
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
      </motion.div>

      <motion.div className="section-list" {...FLIP_LAYOUT_PROPS}>
        {experienceRoles.map((role, index) => {
          return (
          <motion.article
            key={`${role.company}-${role.title}`}
            layout
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.58, delay: index * 0.04, ease: EASE_STANDARD, layout: SPRING_FLIP }}
            className="experience-row data-row py-10 md:py-11"
          >
            <motion.div className="experience-row-grid" {...FLIP_LAYOUT_PROPS}>
              <motion.div className="experience-row-rail" {...FLIP_LAYOUT_PROPS}>
                <div className="flex items-start gap-4">
                  <span className="hero-stat-index experience-row-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="profile-row-label">{role.title}</p>
                      <p className="experience-row-company">{role.company}</p>
                    </div>
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
              </motion.div>

              <motion.div className="experience-row-body" {...FLIP_LAYOUT_PROPS}>
                <p className="technical-row-primary">{role.summary}</p>
                <motion.div className="experience-highlight-list" {...FLIP_LAYOUT_PROPS}>
                  {role.highlights.map((highlight) => (
                    <motion.div key={highlight.title} className="experience-highlight" {...FLIP_LAYOUT_PROPS}>
                      <p className="experience-highlight-title">{highlight.title}</p>
                      <p className="experience-highlight-detail">{highlight.detail}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.article>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
