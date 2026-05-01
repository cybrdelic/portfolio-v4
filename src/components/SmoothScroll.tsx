import { useEffect } from 'react';
import Lenis from 'lenis';
import useFinePointer from '../hooks/useFinePointer';

export default function SmoothScroll() {
  const canUseFinePointer = useFinePointer();

  useEffect(() => {
    if (!canUseFinePointer) return;

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

    start();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stop();
      lenis.destroy();
    };
  }, [canUseFinePointer]);

  return null;
}
