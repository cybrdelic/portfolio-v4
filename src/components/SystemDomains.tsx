import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { systemDomains } from '../content/home';
import { getCatalogPath, homeDomainLinks } from '../content/projectCatalog';
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

const domainMeta = [
  {
    scope: 'Context capture, ranking, and operator relief',
    signal: 'Load relief',
  },
  {
    scope: 'Gaze, screen geometry, and spatial inference',
    signal: 'Spatial inference',
  },
  {
    scope: 'GPU runtime, emergent behavior, and light transport',
    signal: 'Computed behavior',
  },
  {
    scope: 'State clarity, control surfaces, and precision under pressure',
    signal: 'Precision under pressure',
  },
] as const;

export default function SystemDomains() {
  return (
    <motion.section
      className="section-shell section-shell--dense section-shell--framed domains-shell"
      {...FLIP_LAYOUT_SCROLL_PROPS}
    >
      <motion.div className="section-intro" {...FLIP_LAYOUT_PROPS}>
        <div className="section-rail section-rail--sticky">
          <h2 className="section-label">
            2.0 / System Domains
          </h2>
        </div>

        <motion.div
          className="section-content section-copy section-copy-stage"
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          variants={revealGroupVariants}
        >
          <motion.div aria-hidden="true" className="section-copy-rule origin-left" variants={revealRuleVariants} />
          <motion.p
            variants={revealItemVariants}
            transition={REVEAL_ITEM_TRANSITION}
            className="section-copy-lead domains-lead"
          >
            Four operating territories where technical systems stop being passive software and
            start behaving like instruments.
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div className="section-list" {...FLIP_LAYOUT_PROPS}>
        {systemDomains.map((domain, index) => {
          const meta = domainMeta[index];
          const catalogKey = homeDomainLinks[domain.title as keyof typeof homeDomainLinks];

          return (
            <motion.article
              key={domain.title}
              layout
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.56, delay: index * 0.035, ease: EASE_STANDARD, layout: SPRING_FLIP }}
              className="domains-row data-row py-10 md:py-11"
            >
              <motion.div className="domains-row-grid" {...FLIP_LAYOUT_PROPS}>
                <motion.div className="domains-row-rail" {...FLIP_LAYOUT_PROPS}>
                  <div className="flex items-start gap-4">
                    <span className="hero-stat-index domains-row-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-4">
                      <p className="profile-row-label">{domain.title}</p>
                      <div className="technical-row-signal">
                        <p className="technical-row-signal-label">Operating signal</p>
                        <p>{meta.signal}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="domains-row-body" {...FLIP_LAYOUT_PROPS}>
                  <p className="technical-row-primary">{domain.desc}</p>
                  <motion.div className="domains-row-meta" {...FLIP_LAYOUT_PROPS}>
                    <div className="technical-row-signal">
                      <p className="technical-row-signal-label">Scope</p>
                      <p>{meta.scope}</p>
                    </div>
                    <Link to={getCatalogPath(catalogKey)} className="domains-row-target">
                      <span>Open full project index</span>
                      <ArrowUpRight size={16} />
                    </Link>
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
