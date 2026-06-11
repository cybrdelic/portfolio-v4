import { Link, useLocation } from 'react-router-dom';

export default function SiteNav() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="relative z-50 flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4 md:px-12">
      <Link
        to="/"
        className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
      >
        Alex Figueroa
      </Link>
      <nav className="flex items-center gap-8">
        <a
          href={isHome ? '#work' : '/#work'}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          Work
        </a>
        <a
          href={isHome ? '#contact' : '/#contact'}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          Contact
        </a>
        <a
          href="https://github.com/cybrdelic"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
