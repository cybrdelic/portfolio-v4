import { LayoutGroup, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { FLIP_LAYOUT_PROPS, FLIP_LAYOUT_SCROLL_PROPS } from '../lib/motion';

export default function Footer() {
  return (
    <LayoutGroup id="footer-layout">
      <motion.footer
        className="footer-shell px-6 pb-12 pt-24 text-[var(--color-ink)] md:px-12"
        {...FLIP_LAYOUT_SCROLL_PROPS}
      >
        <motion.div className="max-w-7xl mx-auto" {...FLIP_LAYOUT_PROPS}>
        <motion.div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12" {...FLIP_LAYOUT_PROPS}>
          <div className="lg:col-span-4">
            <h2 className="section-label">7.0 / Contact</h2>
          </div>

          <motion.div className="lg:col-span-8 lg:max-w-[42rem]" {...FLIP_LAYOUT_PROPS}>
            <p className="display-tight max-w-[12ch] text-[clamp(2.25rem,4.8vw,3.45rem)] text-[var(--color-ink)]">
              Open to a small number of serious systems roles and carefully chosen collaborations.
            </p>
            <p className="body-premium mt-6 max-w-[34rem] text-[1.02rem] md:text-[1.1rem]">
              Best fit for products involving autonomy, perception, simulation, or technical interfaces that have to stay legible under real constraints.
            </p>
            <motion.div
              className="footer-contact-rail mt-10 grid grid-cols-1 gap-8 border-t border-[var(--color-line-strong)] pt-8 md:grid-cols-[minmax(0,1fr)_14rem] md:items-end"
              {...FLIP_LAYOUT_PROPS}
            >
              <div className="space-y-5">
                <a
                  href="mailto:alexfigueroa.cybr@gmail.com"
                  className="cta-link group inline-flex w-fit items-center gap-3 text-[var(--color-ink)]"
                >
                  <span className="meta-rule text-[0.94rem] tracking-[-0.02em] md:text-[1rem]">
                    alexfigueroa.cybr@gmail.com
                  </span>
                  <ArrowUpRight size={15} className="text-[var(--color-muted)] transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px" />
                </a>
                <p className="footer-contact-note">
                  Senior IC, founding engineer, and technical lead conversations.
                </p>
                <motion.div className="footer-inline-links" {...FLIP_LAYOUT_PROPS}>
                  <motion.a href="#top" className="footer-inline-link" {...FLIP_LAYOUT_PROPS}>
                    Back to top
                  </motion.a>
                  <motion.a
                    href="mailto:alexfigueroa.cybr@gmail.com?subject=Portfolio%20Inquiry"
                    className="footer-inline-link"
                    {...FLIP_LAYOUT_PROPS}
                  >
                    Email Alex
                  </motion.a>
                </motion.div>
              </div>
              <motion.div className="footer-aside md:text-right" {...FLIP_LAYOUT_PROPS}>
                <motion.div className="footer-aside-block" {...FLIP_LAYOUT_PROPS}>
                  <p className="eyebrow">Availability</p>
                  <p className="mt-2 text-[0.94rem] leading-relaxed text-[var(--color-ink)]">
                    Select roles and carefully chosen collaborations.
                  </p>
                </motion.div>
                <motion.div className="footer-aside-block" {...FLIP_LAYOUT_PROPS}>
                  <p className="eyebrow">Best fit</p>
                  <p className="mt-2 text-[0.94rem] leading-relaxed text-[var(--color-ink)]">
                    Systems that need technical depth and strong interface judgment.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-10 border-t border-[var(--color-line-strong)] pt-8 md:grid-cols-12 md:pt-10" {...FLIP_LAYOUT_PROPS}>
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Base</p>
            <p className="text-[0.96rem] leading-relaxed text-[var(--color-ink)]">
              Dayton, OH
              <br />
              California roots
            </p>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Scope</p>
            <p className="max-w-[18rem] text-[0.96rem] leading-relaxed text-[var(--color-ink)]">
              Autonomous tooling, perceptual systems, simulation infrastructure.
            </p>
          </div>
          <div className="flex flex-col items-start justify-end md:col-span-4 md:items-end">
            <p className="text-left font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-muted)] md:text-right">
              Open to serious conversations now.
              <br />
              © {new Date().getFullYear()} Alex Figueroa.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.footer>
  </LayoutGroup>
  );
}
