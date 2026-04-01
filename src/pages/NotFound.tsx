import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">404</p>
      <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-medium leading-none tracking-[-0.04em] text-[var(--color-ink)]">
        Page not found
      </h1>
      <p className="mt-5 max-w-[28rem] text-[1rem] leading-[1.72] text-[var(--color-muted-soft)]">
        This path doesn't exist. Check the URL or head back home.
      </p>
      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
      >
        <ArrowLeft size={14} />
        Back home
      </Link>
    </div>
  );
}
