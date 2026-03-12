import { LayoutGroup, motion } from 'motion/react';
import { Suspense, lazy, useEffect, useState } from 'react';
import HeroThesisTransition from '../components/HeroThesisTransition';

const SystemDomains = lazy(() => import('../components/SystemDomains'));
const Projects = lazy(() => import('../components/Projects'));
const Experience = lazy(() => import('../components/Experience'));
const TechnicalProfile = lazy(() => import('../components/TechnicalProfile'));
const WorkingStyle = lazy(() => import('../components/WorkingStyle'));

function SectionPlaceholder({
  minHeightClassName,
}: {
  minHeightClassName: string;
}) {
  return (
    <section className={`relative border-b border-[var(--color-line)] ${minHeightClassName}`}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="h-px w-full bg-[var(--color-line-soft)]/75" />
      </div>
    </section>
  );
}

export default function Home({ heroIntroReady = true }: { heroIntroReady?: boolean }) {
  const [secondaryReady, setSecondaryReady] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      cancelIdleCallback?: (handle: number) => void;
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    };
    let cancelled = false;
    const reveal = () => {
      if (!cancelled) {
        setSecondaryReady(true);
      }
    };
    const idleHandle = win.requestIdleCallback?.(reveal, { timeout: 1500 });
    const fallbackTimer = window.setTimeout(reveal, 900);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      if (idleHandle !== undefined) {
        win.cancelIdleCallback?.(idleHandle);
      }
    };
  }, []);

  return (
    <LayoutGroup id="home-layout">
      <motion.main className="relative">
        <HeroThesisTransition introReady={heroIntroReady} />
        {secondaryReady ? (
          <Suspense fallback={<SectionPlaceholder minHeightClassName="min-h-[70svh]" />}>
            <SystemDomains />
            <Projects />
            <Experience />
            <TechnicalProfile />
            <WorkingStyle />
          </Suspense>
        ) : (
          <>
            <SectionPlaceholder minHeightClassName="min-h-[56svh]" />
            <SectionPlaceholder minHeightClassName="min-h-[100svh]" />
            <SectionPlaceholder minHeightClassName="min-h-[64svh]" />
            <SectionPlaceholder minHeightClassName="min-h-[58svh]" />
            <SectionPlaceholder minHeightClassName="min-h-[52svh]" />
          </>
        )}
      </motion.main>
    </LayoutGroup>
  );
}
