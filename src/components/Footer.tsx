import { ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';

export default function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 md:px-12 bg-[var(--color-bg)] text-[var(--color-ink)]">
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
                className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest border-b border-[var(--color-line)] pb-1 hover:text-[var(--color-muted)] hover:border-[var(--color-muted)] transition-colors p-2 -ml-2"
              >
                alexfigueroa.cybr@gmail.com <ArrowUpRight size={16} />
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
                  <a href="#" className="hover:text-[var(--color-muted)] transition-colors inline-block p-2 -ml-2">GitHub</a>
                </Magnetic>
              </li>
              <li>
                <Magnetic strength={0.3}>
                  <a href="#" className="hover:text-[var(--color-muted)] transition-colors inline-block p-2 -ml-2">LinkedIn</a>
                </Magnetic>
              </li>
              <li>
                <Magnetic strength={0.3}>
                  <a href="#" className="hover:text-[var(--color-muted)] transition-colors inline-block p-2 -ml-2">Resume</a>
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
