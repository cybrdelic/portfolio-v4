import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import BootSequence from './components/BootSequence';
import SmoothScroll from './components/SmoothScroll';
import PageTransition from './components/PageTransition';
import { projects } from './data';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ProjectsCatalog = lazy(() => import('./pages/ProjectsCatalog'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" aria-label="Loading">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-1 w-1 rounded-full bg-[var(--color-line-strong)] opacity-60"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [bootSequenceComplete, setBootSequenceComplete] = useState(false);
  const isHomeRoute = location.pathname === '/';
  const projectId = location.pathname.startsWith('/project/')
    ? location.pathname.replace('/project/', '')
    : null;
  const activeProject = projectId ? projects.find((project) => project.id === projectId) : null;

  const activeTitle = activeProject
    ? `${activeProject.title} — Alex Figueroa`
    : location.pathname === '/projects'
      ? 'Project Index — Alex Figueroa'
      : 'Alex Figueroa — Autonomous Systems, Perception & Simulation';

  const scrollViewportToTop = () => {
    const lenis = (window as Window & {
      __portfolioLenis?: {
        scrollTo: (target: number | string | HTMLElement, options?: Record<string, unknown>) => void;
      };
    }).__portfolioLenis;

    if (lenis) {
      lenis.scrollTo(0, { duration: 0, force: true, immediate: true });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  useEffect(() => {
    if (!isHomeRoute) {
      setBootSequenceComplete(true);
    }
  }, [isHomeRoute]);

  useEffect(() => {
    document.title = activeTitle;
  }, [activeTitle]);

  return (
    <div
      id="top"
      className="app-shell relative isolate text-[var(--color-ink)] selection:bg-[var(--color-ink)] selection:text-[var(--color-bg)]"
    >
      <SmoothScroll />
      {isHomeRoute && !bootSequenceComplete ? (
        <BootSequence onComplete={() => setBootSequenceComplete(true)} />
      ) : null}

      <div className="relative z-10">
        <AnimatePresence initial={false} mode="wait" onExitComplete={scrollViewportToTop}>
          <PageTransition key={location.pathname}>
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/" element={<Home heroIntroReady={bootSequenceComplete} />} />
                <Route path="/projects" element={<ProjectsCatalog />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>

      </div>
    </div>
  );
}
