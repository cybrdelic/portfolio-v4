import { useEffect } from 'react';

function isModifiedClick(event: PointerEvent | MouseEvent) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function getInternalRouteAnchor(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const anchor = target.closest<HTMLAnchorElement>('a[href]');
  if (!anchor || anchor.target || anchor.hasAttribute('download')) {
    return null;
  }

  const url = new URL(anchor.href);
  if (url.origin !== window.location.origin) {
    return null;
  }

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const nextPath = `${url.pathname}${url.search}`;
  if (currentPath === nextPath && url.hash) {
    return null;
  }

  return anchor;
}

function stopScrollMomentum() {
  window.__portfolioLenis?.scrollTo(window.scrollY, {
    force: true,
    immediate: true,
  });
}

function commitRouteInteraction() {
  stopScrollMomentum();
  window.dispatchEvent(new Event('portfolio-route-commit'));
}

export default function RouteTransitionCapture() {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!isModifiedClick(event) && getInternalRouteAnchor(event.target)) {
        commitRouteInteraction();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, true);
    return () => window.removeEventListener('pointerdown', handlePointerDown, true);
  }, []);

  return null;
}
