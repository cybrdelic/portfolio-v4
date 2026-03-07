import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export default function useFinePointer() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [canUseFinePointer, setCanUseFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const update = () => {
      setCanUseFinePointer(mediaQuery.matches && !prefersReducedMotion);
    };

    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, [prefersReducedMotion]);

  return canUseFinePointer;
}
