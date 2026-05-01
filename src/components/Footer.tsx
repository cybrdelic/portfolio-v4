import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Magnetic from './Magnetic';

export default function Footer() {
  return (
    <footer id="contact" className="px-6 pb-12 pt-20 text-[var(--color-ink)] md:px-12 md:pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-4">
            <h2 className="font-mono text-sm text-[var(--color-muted)] uppercase tracking-widest">
              7.0 / Contact
            </h2>
          </div>

          <div className="lg:col-span-8">
            <p className="font-sans text-xl md:text-2xl text-[var(--color-ink)] leading-relaxed mb-8">
              Interested in systems, simulation, perception, or high-leverage tooling? Let’s talk.
            </p>
            <p className="font-sans text-lg text-[var(--color-muted)] leading-relaxed mb-12">
              I am open to roles and collaborations involving autonomous tooling, perceptual systems, simulation infrastructure, technical product engineering, and interface-heavy systems work. The best conversations are usually the ones where the problem is difficult, unusual, and still undefined enough to matter.
            </p>
            <Magnetic strength={0.1}>
              <a 
                href="mailto:alexfigueroa.cybr@gmail.com" 
                data-field-target
                data-field-kind="contact"
                data-field-label="send email"
                className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-ink)] px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
              >
                Email Alex <ArrowUpRight size={16} />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12 border-t border-[var(--color-line)]">
          <div className="md:col-span-4">
            <p className="font-mono text-xs text-[var(--color-muted)] mb-4 uppercase tracking-widest">Network</p>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <Magnetic strength={0.3}>
                  <a href="https://github.com/cybrdelic" data-field-target data-field-kind="external" data-field-label="github" className="hover:text-[var(--color-muted)] transition-colors inline-block p-2 -ml-2">GitHub</a>
                </Magnetic>
              </li>
              <li>
                <Magnetic strength={0.3}>
                  <Link to="/#work" data-field-target data-field-kind="route" data-field-label="selected work" className="hover:text-[var(--color-muted)] transition-colors inline-block p-2 -ml-2">Selected Work</Link>
                </Magnetic>
              </li>
              <li>
                <Magnetic strength={0.3}>
                  <a href="mailto:alexfigueroa.cybr@gmail.com" data-field-target data-field-kind="contact" data-field-label="email" className="hover:text-[var(--color-muted)] transition-colors inline-block p-2 -ml-2">Contact</a>
                </Magnetic>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="font-mono text-xs text-[var(--color-muted)] mb-4 uppercase tracking-widest">Coordinates</p>
            <p className="font-sans text-sm text-[var(--color-ink)]">Dayton, OH<br />California roots</p>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end items-start md:items-end">
            <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest text-left md:text-right">
              System Status: Online.<br />
              © {new Date().getFullYear()} Alex Figueroa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
