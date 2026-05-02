import { useEffect } from 'react';

declare global {
  interface Window {
    __routeTransitionSource?: {
      height: number;
      index: string;
      kind: string;
      label: string;
      left: number;
      phase: string;
      timestamp: number;
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

function getVisualSource(anchor: HTMLAnchorElement) {
  return anchor.querySelector<HTMLElement>('[data-route-transition-source]') || anchor;
}

function getTargetMeta(anchor: HTMLAnchorElement) {
  const url = new URL(anchor.href);
  const kind = anchor.dataset.fieldKind || 'route';
  const label =
    anchor.dataset.fieldLabel ||
    anchor.getAttribute('aria-label') ||
    anchor.textContent?.replace(/\s+/g, ' ').trim() ||
    'route';

  if (url.pathname.startsWith('/project/')) {
    return {
      index: '02',
      kind,
      label,
      phase: `${kind} transfer`,
    };
  }

  return {
    index: '01',
    kind,
    label,
    phase: url.hash ? 'section transfer' : `${kind} transfer`,
  };
}

function setRouteSource(anchor: HTMLAnchorElement) {
  window.__portfolioLenis?.scrollTo(window.scrollY, {
    force: true,
    immediate: true,
  });

  const visualSource = getVisualSource(anchor);
  const rect = visualSource.getBoundingClientRect();
  const root = document.documentElement;
  const meta = getTargetMeta(anchor);
  const centerX = Math.min(
    window.innerWidth - 120,
    Math.max(120, rect.left + rect.width / 2)
  );
  const centerY = Math.min(
    window.innerHeight - 128,
    Math.max(96, rect.top + rect.height / 2)
  );

  window.__routeTransitionSource = {
    height: rect.height,
    index: meta.index,
    kind: meta.kind,
    label: meta.label,
    left: rect.left,
    phase: meta.phase,
    timestamp: performance.now(),
    top: rect.top,
    width: rect.width,
  };

  root.style.setProperty('--route-origin-left', `${rect.left}px`);
  root.style.setProperty('--route-origin-top', `${rect.top}px`);
  root.style.setProperty('--route-origin-width', `${rect.width}px`);
  root.style.setProperty('--route-origin-height', `${rect.height}px`);
  root.style.setProperty('--route-origin-center-x', `${centerX}px`);
  root.style.setProperty('--route-origin-center-y', `${centerY}px`);

  window.dispatchEvent(
    new CustomEvent('portfolio-route-source', {
      detail: meta,
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
