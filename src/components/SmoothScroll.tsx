import { useEffect } from 'react';
import Lenis from 'lenis';
import useFinePointer from '../hooks/useFinePointer';

declare global {
  interface Window {
    __portfolioLenis?: Lenis;
  }
}

export default function SmoothScroll() {
  const canUseFinePointer = useFinePointer();

  useEffect(() => {
    if (!canUseFinePointer) return;

    const lenis = new Lenis({
      duration: 0.95,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    window.__portfolioLenis = lenis;

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    const start = () => {
      if (rafId !== 0) return;
      lenis.start();
      rafId = requestAnimationFrame(raf);
    };

    const stop = () => {
      lenis.stop();
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
        return;
      }

      start();
    };

    start();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (window.__portfolioLenis === lenis) {
        delete window.__portfolioLenis;
      }
      stop();
      lenis.destroy();
    };
  }, [canUseFinePointer]);

  return null;
}
