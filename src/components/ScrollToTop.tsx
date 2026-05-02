import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type Lenis from 'lenis';

declare global {
  interface Window {
    __portfolioLenis?: Lenis;
  }
}

const MAX_HASH_ATTEMPTS = 180;
const SECTION_TRAVEL_DURATION = 0.64;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function getHashTarget(hash: string) {
  if (!hash || hash === '#') {
    return null;
  }

  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return document.getElementById(hash.slice(1));
  }
}

function getDocumentTop(target: HTMLElement) {
  return target.getBoundingClientRect().top + window.scrollY;
}

function scrollToTarget(target: HTMLElement | number, immediate = false) {
  const lenis = window.__portfolioLenis;

  if (lenis) {
    const targetElement = typeof target === 'number' ? null : target;
    const scrollTarget =
      typeof target === 'number'
        ? target
        : Math.max(0, getDocumentTop(target));

    lenis.scrollTo(scrollTarget, {
      duration: SECTION_TRAVEL_DURATION,
      easing: easeOutCubic,
      force: true,
      immediate,
      lock: !immediate,
      onComplete: () => {
        if (!targetElement || immediate) {
          return;
        }

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const correctedTarget = Math.max(
          0,
          Math.min(maxScroll, getDocumentTop(targetElement))
        );

        if (Math.abs(correctedTarget - window.scrollY) > 2) {
          lenis.scrollTo(correctedTarget, {
            duration: 0.28,
            easing: easeOutCubic,
            force: true,
            lock: true,
          });
        }
      },
    });
    return;
  }

  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }

  target.scrollIntoView({
    block: 'start',
    behavior: immediate ? 'auto' : 'smooth',
  });
}

function travelToHash(hash: string) {
  let frameId = 0;
  let attempts = 0;
  let cancelled = false;

  const seek = () => {
    if (cancelled) {
      return;
    }

    const target = getHashTarget(hash);
    if (target) {
      scrollToTarget(target, false);
      return;
    }

    attempts += 1;
    if (attempts < MAX_HASH_ATTEMPTS) {
      frameId = window.requestAnimationFrame(seek);
      return;
    }

    scrollToTarget(0, true);
  };

  frameId = window.requestAnimationFrame(seek);

  return () => {
    cancelled = true;
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }
  };
}

export default function ScrollToTop({
  hash: hashProp,
  pathname: pathnameProp,
}: {
  hash?: string;
  pathname?: string;
}) {
  const location = useLocation();
  const hash = hashProp ?? location.hash;
  const pathname = pathnameProp ?? location.pathname;

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) {
      return;
    }

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    if (!hash) {
      scrollToTarget(0, true);
    }
  }, [hash, pathname]);

  useEffect(() => {
    if (hash) {
      return travelToHash(hash);
    }
  }, [hash, pathname]);

  useEffect(() => {
    const handleSectionClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) {
        return;
      }

      const url = new URL(anchor.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search ||
        !url.hash
      ) {
        return;
      }

      const section = getHashTarget(url.hash);
      if (!section) {
        return;
      }

      event.preventDefault();

      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const update = nextUrl === currentUrl ? 'replaceState' : 'pushState';

      window.history[update](null, '', nextUrl);
      scrollToTarget(section, false);
    };

    window.addEventListener('click', handleSectionClick);
    return () => window.removeEventListener('click', handleSectionClick);
  }, []);

  return null;
}
