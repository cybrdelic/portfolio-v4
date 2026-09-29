import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, type Location } from 'react-router-dom';
import { motionState } from './state';

/** The old route stays readable until the shared field has carried the transition. */
export default function ContinuousRoutes({ children }: { children: (location: Location) => ReactNode }) {
  const location = useLocation();
  const [displayed, setDisplayed] = useState(location);
  const pending = useRef<number[]>([]);

  useEffect(() => {
    pending.current.forEach(clearTimeout); pending.current = [];
    const restore = () => {
      const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      const heading = document.querySelector<HTMLElement>('main h1');
      heading?.focus({ preventScroll: true });
    };
    if (location.pathname === displayed.pathname) {
      setDisplayed(location);
      pending.current.push(window.setTimeout(() => { if (location.hash) restore(); }, 40));
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !motionState.enabled) {
      setDisplayed(location); pending.current.push(window.setTimeout(restore, 40));
      return;
    }
    motionState.routeTarget = 1;
    document.documentElement.dataset.route = 'travel';
    pending.current.push(window.setTimeout(() => {
      setDisplayed(location);
      pending.current.push(window.setTimeout(() => {
        restore(); motionState.routeTarget = 0;
        document.documentElement.dataset.route = 'arrive';
      }, 45));
    }, 230));
    return () => { pending.current.forEach(clearTimeout); motionState.routeTarget = 0; delete document.documentElement.dataset.route; };
    // displayed deliberately follows the requested route after the shared transition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return <div className="route-content">{children(displayed)}</div>;
}
