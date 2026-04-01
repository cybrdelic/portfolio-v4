import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-shell section-shell section-shell--closing text-[var(--color-ink)]">
      <div className="section-inner">
        <div className="section-grid footer-grid">
          <div className="section-rail footer-rail">
            <h2 className="section-label">7.0 / Contact</h2>
          </div>

          <div className="section-content footer-content">
            <p className="display-tight max-w-[12ch] text-[clamp(2.25rem,4.8vw,3.45rem)] text-[var(--color-ink)]">
              Open to a small number of serious systems roles and carefully chosen collaborations.
            </p>
            <p className="body-premium mt-6 max-w-[34rem] text-[1.02rem] md:text-[1.1rem]">
              Best fit for products involving autonomy, perception, simulation, or technical interfaces that have to stay legible under real constraints.
            </p>
            <div className="footer-contact-rail mt-10 grid grid-cols-1 gap-8 border-t border-[var(--color-line-strong)] pt-8 md:grid-cols-[minmax(0,1fr)_14rem] md:items-end">
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
                <div className="footer-inline-links">
                  <a href="#top" className="footer-inline-link">
                    Back to top
                  </a>
                  <a
                    href="mailto:alexfigueroa.cybr@gmail.com?subject=Portfolio%20Inquiry"
                    className="footer-inline-link"
                  >
                    Email Alex
                  </a>
                </div>
              </div>
              <div className="footer-aside md:text-right">
                <div className="footer-aside-block">
                  <p className="eyebrow">Availability</p>
                  <p className="footer-aside-copy">
                    Select roles and carefully chosen collaborations.
                  </p>
                </div>
                <div className="footer-aside-block">
                  <p className="eyebrow">Best fit</p>
                  <p className="footer-aside-copy">
                    Systems that need technical depth and strong interface judgment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-grid">
          <div>
            <p className="eyebrow mb-4">Base</p>
            <p className="text-[0.96rem] leading-relaxed text-[var(--color-ink)]">
              Dayton, OH
              <br />
              California roots
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">Scope</p>
            <p className="max-w-[18rem] text-[0.96rem] leading-relaxed text-[var(--color-ink)]">
              Autonomous tooling, perceptual systems, simulation infrastructure.
            </p>
          </div>
          <div className="flex flex-col items-start justify-end md:items-end">
            <p className="text-left font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-muted)] md:text-right">
              Open to serious conversations now.
              <br />
              © {new Date().getFullYear()} Alex Figueroa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
