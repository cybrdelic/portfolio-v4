import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { allProjects } from '../data';
import { Renderer } from './Renderer';
import { getMotionSnapshot, motionState, motifs, normalizeMotif, setMotif, stepTimeline, type Motif } from './state';

export default function MotionWorld({ enabled }: { enabled: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const location = useLocation();

  useEffect(() => {
    motionState.hoverMotif = null;
    motionState.routeMotif = location.pathname.startsWith('/project/')
      ? normalizeMotif(allProjects.find(project => `/project/${project.id}` === location.pathname)?.motif)
      : null;
    if (motionState.routeMotif) { setMotif(motionState.routeMotif); motionState.framedTarget = 0; }
  }, [location.pathname]);

  useEffect(() => {
    motionState.enabled = enabled;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    motionState.reduced = media.matches;
    const root = document.documentElement;
    let renderer: Renderer | null = null;
    let raf = 0, lastTime = 0, accumulated = 0, samples = 0;
    let invalidated = true, stopped = false, anchorDirty = true;
    let anchors: { center: number; motif: Motif; framed: number }[] = [];

    const measure = () => {
      anchors = [...document.querySelectorAll<HTMLElement>('[data-scene]')].map(element => {
        const rect = element.getBoundingClientRect();
        return { center: rect.top + scrollY + rect.height * 0.42, motif: element.dataset.scene as Motif, framed: element.hasAttribute('data-framed') ? 1 : 0 };
      }).sort((a, b) => a.center - b.center);
      anchorDirty = false;
    };
    const updateScene = () => {
      if (motionState.routeMotif) { setMotif(motionState.routeMotif); motionState.framedTarget = 0; return; }
      if (motionState.hoverMotif) { setMotif(motionState.hoverMotif); return; }
      if (anchorDirty) measure();
      if (!anchors.length) return;
      const position = scrollY + innerHeight * 0.42;
      let a = anchors[0], b = anchors[anchors.length - 1];
      for (let i = 0; i < anchors.length; i++) {
        if (anchors[i].center <= position) a = anchors[i];
        if (anchors[i].center >= position) { b = anchors[i]; break; }
      }
      const fraction = a.center === b.center ? 0 : Math.max(0, Math.min(1, (position - a.center) / (b.center - a.center)));
      const travel = Math.max(0, Math.min(1, (fraction - 0.28) / 0.44));
      const blend = travel * travel * (3 - 2 * travel);
      motionState.framedTarget = a.framed * (1 - blend) + b.framed * blend;
      motionState.targets = motifs.map(motif => (a.motif === motif ? 1 - blend : 0) + (b.motif === motif ? blend : 0));
    };
    const onScroll = () => { motionState.scroll = scrollY; invalidated = true; };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const motif = (event.target as Element)?.closest<HTMLElement>('[data-hover-motif]')?.dataset.hoverMotif as Motif | undefined;
      motionState.hoverMotif = motif && motifs.includes(motif) ? motif : null;
      motionState.pointerTarget = [event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2];
    };
    const onResize = () => { invalidated = true; anchorDirty = true; };
    const onMotion = () => { motionState.reduced = media.matches; invalidated = true; root.dataset.reducedMotion = String(media.matches); };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); document.querySelectorAll<HTMLVideoElement>('[data-world-media]').forEach(video => video.pause()); }
      else { lastTime = 0; invalidated = true; raf = requestAnimationFrame(frame); }
    };
    const activate = () => {
      if (!enabled || !canvas.current || stopped) return;
      try {
        renderer = new Renderer(canvas.current);
        root.dataset.gpu = 'ready';
        invalidated = true;
      } catch (error) {
        root.dataset.gpu = 'fallback';
        motionState.ready = false;
        console.info('Portfolio uses its static presentation:', error instanceof Error ? error.message : error);
      }
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      motionState.contextLosses++;
      motionState.ready = false;
      renderer?.dispose(); renderer = null;
      root.dataset.gpu = 'fallback';
    };
    const onRestored = () => { activate(); };

    function frame(now: number) {
      if (stopped || document.hidden) return;
      const frameMs = lastTime ? now - lastTime : 16.67;
      const dt = Math.min(0.1, frameMs / 1000);
      lastTime = now;
      const start = performance.now();
      updateScene();
      if ((motionState.reduced || motionState.frozen) && invalidated) { motionState.weights = [...motionState.targets]; motionState.framed = motionState.framedTarget; }
      if (!motionState.frozen) stepTimeline(dt);
      if (renderer && (!motionState.reduced || invalidated || !motionState.ready) && (!motionState.frozen || invalidated || !motionState.ready)) {
        renderer.draw(); invalidated = false;
      }
      if (!motionState.frozen && !motionState.reduced && renderer) {
        motionState.cpuMs.push(performance.now() - start);
        motionState.frameMs.push(frameMs);
        if (motionState.cpuMs.length > 240) motionState.cpuMs.shift();
        if (motionState.frameMs.length > 240) motionState.frameMs.shift();
        // Sustained expensive frames lower pixel count; one slow startup frame cannot.
        accumulated += frameMs; samples++;
        if (samples === 120) {
          if (accumulated / samples > 28 && motionState.quality > 0.4) motionState.quality = Math.max(0.4, motionState.quality * 0.78);
          accumulated = 0; samples = 0;
        }
      }
      raf = requestAnimationFrame(frame);
    }

    root.dataset.reducedMotion = String(media.matches);
    if (!enabled) root.dataset.gpu = 'disabled';
    activate();
    const observer = new MutationObserver(() => { anchorDirty = true; invalidated = true; });
    observer.observe(document.getElementById('root')!, { childList: true, subtree: true });
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.documentElement);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('pointermove', onPointer, { passive: true });
    addEventListener('resize', onResize, { passive: true });
    addEventListener('portfolio-invalidate', onResize);
    media.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    canvas.current?.addEventListener('webglcontextlost', onLost);
    canvas.current?.addEventListener('webglcontextrestored', onRestored);
    window.__portfolioMotion = {
      snapshot: getMotionSnapshot,
      freeze: (time = 4) => { motionState.time = time; motionState.frozen = true; motionState.pointer = [0, 0]; motionState.velocity = 0; motionState.weights = [...motionState.targets]; invalidated = true; },
      resume: () => { motionState.frozen = false; invalidated = true; },
    };
    raf = requestAnimationFrame(frame);
    return () => {
      stopped = true; cancelAnimationFrame(raf);
      observer.disconnect(); resizeObserver.disconnect();
      removeEventListener('scroll', onScroll); removeEventListener('pointermove', onPointer); removeEventListener('resize', onResize);
      removeEventListener('portfolio-invalidate', onResize);
      media.removeEventListener('change', onMotion); document.removeEventListener('visibilitychange', onVisibility);
      canvas.current?.removeEventListener('webglcontextlost', onLost); canvas.current?.removeEventListener('webglcontextrestored', onRestored);
      renderer?.dispose(); motionState.ready = false;
      delete window.__portfolioMotion;
    };
  }, [enabled]);

  return <><canvas ref={canvas} className="motion-world" aria-hidden="true" /><div className="world-sources" aria-hidden="true"><video data-world-media="water" src="/media/aqua.mp4" poster="/media/aqua.webp" muted loop playsInline preload="none"/><video data-world-media="fire" src="/media/ignia.mp4" poster="/media/ignia.webp" muted loop playsInline preload="none"/><video data-world-media="forest" src="/media/forest.mp4" poster="/media/forest.webp" muted loop playsInline preload="none"/></div></>;
}
