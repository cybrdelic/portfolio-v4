import { useEffect } from 'react';
import Lenis from 'lenis';
import useFinePointer from '../hooks/useFinePointer';

type PortfolioWindow = Window & typeof globalThis & {
  __portfolioLenis?: Lenis;
};

export default function SmoothScroll() {
  const canUseFinePointer = useFinePointer();

  useEffect(() => {
    if (!canUseFinePointer) return;

    const portfolioWindow = window as PortfolioWindow;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

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

    portfolioWindow.__portfolioLenis = lenis;
    start();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (portfolioWindow.__portfolioLenis === lenis) {
        delete portfolioWindow.__portfolioLenis;
      }
      stop();
      lenis.destroy();
    };
  }, [canUseFinePointer]);

  return null;
}
