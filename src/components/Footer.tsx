import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Magnetic from './Magnetic';

export default function Footer() {
  return (
    <footer id="contact" className="px-6 pb-12 pt-20 text-[var(--color-ink)] md:px-12 md:pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-mono text-sm text-[var(--color-muted)] uppercase tracking-widest">
              Contact
            </h2>
          </div>

          <div className="lg:col-span-8">
            <p className="mb-8 font-sans text-xl leading-relaxed text-[var(--color-ink)] md:text-2xl">
              Interested in systems, simulation, perception, or high-leverage tooling? Let's talk.
            </p>
            <p className="mb-12 max-w-3xl font-sans text-lg leading-relaxed text-[var(--color-muted)]">
              I am open to roles and collaborations involving simulation infrastructure, graphics
              systems, technical product engineering, and interface-heavy systems work.
            </p>

            <div className="flex flex-wrap gap-3">
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
              <Magnetic strength={0.1}>
                <Link
                  to="/project/firesim-native"
                  data-field-target
                  data-field-kind="route"
                  data-field-label="firesim native footer path"
                  className="inline-flex min-h-11 items-center gap-2 border border-[var(--color-line)] px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-muted)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                >
                  Open FireSim <ArrowUpRight size={16} />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 border-t border-[var(--color-line)] pt-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Network
            </p>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <Magnetic strength={0.3}>
                  <a
                    href="https://github.com/cybrdelic"
                    target="_blank"
                    rel="noreferrer"
                    data-field-target
                    data-field-kind="external"
                    data-field-label="github"
                    className="-ml-2 inline-flex min-h-11 items-center p-2 transition-colors hover:text-[var(--color-muted)]"
                  >
                    GitHub
                  </a>
                </Magnetic>
              </li>
              <li>
                <Magnetic strength={0.3}>
                  <Link
                    to="/#work"
                    data-field-target
                    data-field-kind="route"
                    data-field-label="selected work"
                    className="-ml-2 inline-flex min-h-11 items-center p-2 transition-colors hover:text-[var(--color-muted)]"
                  >
                    Selected Work
                  </Link>
                </Magnetic>
              </li>
              <li>
                <Magnetic strength={0.3}>
                  <Link
                    to="/project/filelight-explorer"
                    data-field-target
                    data-field-kind="route"
                    data-field-label="filelight explorer"
                    className="-ml-2 inline-flex min-h-11 items-center p-2 transition-colors hover:text-[var(--color-muted)]"
                  >
                    Filelight Explorer
                  </Link>
                </Magnetic>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Coordinates
            </p>
            <p className="font-sans text-sm text-[var(--color-ink)]">
              Dayton, OH
              <br />
              California roots
            </p>
          </div>
          <div className="flex flex-col items-start justify-end md:col-span-4 md:items-end">
            <p className="text-left font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] md:text-right">
              Simulation, tooling, and systems UX.
              <br />
              © {new Date().getFullYear()} Alex Figueroa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
