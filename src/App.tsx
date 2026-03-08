import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Footer from './components/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import BootSequence from './components/BootSequence';
import SmoothScroll from './components/SmoothScroll';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

export default function App() {
  const location = useLocation();
  const [bootSequenceComplete, setBootSequenceComplete] = useState(false);
  const isHomeRoute = location.pathname === '/';

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
        document.title = "Alex Figueroa — Autonomous Systems";
      }
    };
    
    // Set initial title
    document.title = "Alex Figueroa — Autonomous Systems";
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <div className="relative isolate text-[var(--color-ink)] selection:bg-[var(--color-ink)] selection:text-[var(--color-bg)]">
      <SmoothScroll />
      {isHomeRoute ? <BootSequence onComplete={() => setBootSequenceComplete(true)} /> : null}
      <ScrollToTop />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* @ts-ignore */}
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home heroIntroReady={bootSequenceComplete} />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
            </Routes>
          </Suspense>
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}
