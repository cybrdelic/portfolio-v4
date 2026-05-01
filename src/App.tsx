import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Footer from './components/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import BootSequence from './components/BootSequence';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

export default function App() {
  const location = useLocation();

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
      <BootSequence />
      <CustomCursor />
      <ScrollToTop />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <Suspense
            key={location.pathname}
            fallback={<div className="min-h-screen" aria-hidden="true" />}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
            </Routes>
          </Suspense>
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}
