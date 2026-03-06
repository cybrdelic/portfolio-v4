import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import ScrollToTop from './components/ScrollToTop';
import BootSequence from './components/BootSequence';
import Noise from './components/Noise';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';

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
    <div className="relative bg-[var(--color-bg)] text-[var(--color-ink)] selection:bg-[var(--color-ink)] selection:text-[var(--color-bg)]">
      <SmoothScroll />
      <BootSequence />
      <Noise />
      <CustomCursor />
      <ScrollToTop />
      
      <AnimatePresence mode="wait">
        {/* @ts-ignore */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}
