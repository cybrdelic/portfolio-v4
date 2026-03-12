import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Footer from './components/Footer';
import Home from './pages/Home';
import BootSequence from './components/BootSequence';
import SmoothScroll from './components/SmoothScroll';
import PageTransition from './components/PageTransition';
import { projects } from './data';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ProjectsCatalog = lazy(() => import('./pages/ProjectsCatalog'));

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
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "System Paused — Alex Figueroa";
      } else {
        document.title = activeTitle;
      }
    };
    
    document.title = activeTitle;
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
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
            {/* @ts-ignore */}
            <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
              <Routes location={location}>
                <Route path="/" element={<Home heroIntroReady={bootSequenceComplete} />} />
                <Route path="/projects" element={<ProjectsCatalog />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}
