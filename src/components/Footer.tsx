import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-6 pb-12 pt-24 text-[var(--color-ink)] md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="section-label">7.0 / Contact</h2>
          </div>

          <div className="lg:col-span-8 lg:max-w-[42rem]">
            <p className="display-tight max-w-[13ch] text-[clamp(2.25rem,4.6vw,3.25rem)] text-[var(--color-ink)]">
              Available for system-heavy engineering work.
            </p>
            <p className="body-premium mt-6 max-w-[35rem] text-[1.02rem] md:text-[1.1rem]">
              Roles and collaborations involving autonomous tooling, perceptual systems, simulation infrastructure, and interface-heavy technical products.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-[var(--color-line-strong)] pt-8 md:grid-cols-[minmax(0,1fr)_12rem] md:items-end">
              <a
                href="mailto:alexfigueroa.cybr@gmail.com"
                className="group inline-flex w-fit items-center gap-3 text-[var(--color-ink)]"
              >
                <span className="meta-rule text-[0.94rem] tracking-[-0.02em] md:text-[1rem]">
                  alexfigueroa.cybr@gmail.com
                </span>
                <ArrowUpRight size={15} className="text-[var(--color-muted)] transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
              <div className="space-y-2 md:text-right">
                <p className="eyebrow">Availability</p>
                <p className="text-[0.94rem] leading-relaxed text-[var(--color-ink)]">
                  Select roles and collaborations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 border-t border-[var(--color-line-strong)] pt-8 md:grid-cols-12 md:pt-10">
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
              Online.
              <br />
              © {new Date().getFullYear()} Alex Figueroa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
