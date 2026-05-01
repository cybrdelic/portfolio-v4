import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ block: 'start' });
          return;
        }

        window.scrollTo(0, 0);
      });
      return;
    }

    window.scrollTo(0, 0);
  }, [hash, pathname]);

  return null;
}
