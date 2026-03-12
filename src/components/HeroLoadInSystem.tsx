import { useEffect, useMemo, useState, type ReactNode } from 'react';
import AnimatedLogo, { type AnimatedLogoPhase, type AnimatedLogoTargets } from './AnimatedLogo';

export type HeroLoadPhase = 'complete' | 'logo' | 'morph' | 'settle' | 'split';

type HeroLoadState = {
  overlayOpacity: number;
  overlayPhase: AnimatedLogoPhase;
  phase: HeroLoadPhase;
  showOverlay: boolean;
};

const LOAD_TIMINGS_MS = {
  complete: 2520,
  morph: 1480,
  settle: 2120,
  split: 620,
} as const;

function getLoadState(phase: HeroLoadPhase): HeroLoadState {
  switch (phase) {
    case 'logo':
      return {
        overlayOpacity: 1,
        overlayPhase: 'logo',
        phase,
        showOverlay: true,
      };
    case 'split':
      return {
        overlayOpacity: 1,
        overlayPhase: 'compact',
        phase,
        showOverlay: true,
      };
    case 'morph':
      return {
        overlayOpacity: 0.98,
        overlayPhase: 'targets',
        phase,
        showOverlay: true,
      };
    case 'settle':
      return {
        overlayOpacity: 0.42,
        overlayPhase: 'targets',
        phase,
        showOverlay: true,
      };
    case 'complete':
    default:
      return {
        overlayOpacity: 0,
        overlayPhase: 'hidden',
        phase: 'complete',
        showOverlay: false,
      };
  }
}

export default function HeroLoadInSystem({
  active,
  children,
  targets,
}: {
  active: boolean;
  children: (state: HeroLoadState) => ReactNode;
  targets?: AnimatedLogoTargets;
}) {
  const [phase, setPhase] = useState<HeroLoadPhase>(active ? 'logo' : 'complete');

  useEffect(() => {
    if (!active) {
      setPhase('complete');
      return;
    }

    setPhase('logo');

    const splitTimer = window.setTimeout(() => {
      setPhase('split');
    }, LOAD_TIMINGS_MS.split);

    const morphTimer = window.setTimeout(() => {
      setPhase('morph');
    }, LOAD_TIMINGS_MS.morph);

    const settleTimer = window.setTimeout(() => {
      setPhase('settle');
    }, LOAD_TIMINGS_MS.settle);

    const completeTimer = window.setTimeout(() => {
      setPhase('complete');
    }, LOAD_TIMINGS_MS.complete);

    return () => {
      window.clearTimeout(splitTimer);
      window.clearTimeout(morphTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(completeTimer);
    };
  }, [active]);

  const loadState = useMemo(() => getLoadState(phase), [phase]);

  return (
    <>
      {children(loadState)}
      {loadState.showOverlay ? (
        <AnimatedLogo
          className="pointer-events-none absolute inset-0 z-30"
          opacity={loadState.overlayOpacity}
          phase={loadState.overlayPhase}
          targets={targets}
        />
      ) : null}
    </>
  );
}
