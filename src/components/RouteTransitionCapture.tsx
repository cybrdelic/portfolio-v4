import { useEffect } from 'react';

declare global {
  interface Window {
    __routeTransitionSource?: {
      height: number;
      kind: string;
      label: string;
      left: number;
      top: number;
      width: number;
    };
  }
}

function isModifiedClick(event: PointerEvent | MouseEvent) {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function getRouteAnchor(target: EventTarget | null) {
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

function setRouteSource(anchor: HTMLAnchorElement) {
  const rect = anchor.getBoundingClientRect();
  const root = document.documentElement;
  const label =
    anchor.dataset.fieldLabel ||
    anchor.getAttribute('aria-label') ||
    anchor.textContent?.replace(/\s+/g, ' ').trim() ||
    'route';
  const kind = anchor.dataset.fieldKind || 'route';

  window.__routeTransitionSource = {
    height: rect.height,
    kind,
    label,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };

  root.style.setProperty('--route-origin-left', `${rect.left}px`);
  root.style.setProperty('--route-origin-top', `${rect.top}px`);
  root.style.setProperty('--route-origin-width', `${rect.width}px`);
  root.style.setProperty('--route-origin-height', `${rect.height}px`);
  root.style.setProperty('--route-origin-center-x', `${rect.left + rect.width / 2}px`);
  root.style.setProperty('--route-origin-center-y', `${rect.top + rect.height / 2}px`);

  window.dispatchEvent(
    new CustomEvent('portfolio-route-source', {
      detail: { kind, label },
    })
  );
}

export default function RouteTransitionCapture() {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (isModifiedClick(event)) {
        return;
      }

      const anchor = getRouteAnchor(event.target);
      if (anchor) {
        setRouteSource(anchor);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) {
        return;
      }

      const anchor = getRouteAnchor(event.target);
      if (anchor) {
        setRouteSource(anchor);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
