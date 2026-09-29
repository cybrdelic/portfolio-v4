/** The one shared timeline. Rendering, routing and scroll never start separate clocks. */
export type Motif = 'water' | 'fire' | 'amber' | 'geometry' | 'systems';
export const motifs: Motif[] = ['water', 'fire', 'amber', 'geometry', 'systems'];

export const motionState = {
  weights: [1, 0, 0, 0, 0],
  targets: [1, 0, 0, 0, 0],
  pointer: [0, 0],
  pointerTarget: [0, 0],
  scroll: 0,
  previousScroll: 0,
  velocity: 0,
  route: 0,
  routeTarget: 0,
  routeMotif: null as Motif | null,
  hoverMotif: null as Motif | null,
  frame: 1,
  frameTarget: 1,
  chirality: [10, 4],
  time: 0,
  enabled: true,
  reduced: false,
  frozen: false,
  ready: false,
  frames: 0,
  drawCalls: 0,
  cpuMs: [] as number[],
  frameMs: [] as number[],
  quality: 1,
  contextLosses: 0,
};

export function setMotif(motif: Motif) {
  motionState.targets = motifs.map(value => value === motif ? 1 : 0);
}

export const damp = (from: number, to: number, speed: number, dt: number) =>
  from + (to - from) * (1 - Math.exp(-speed * dt));

export function stepTimeline(dt: number) {
  const state = motionState;
  if (!state.reduced && state.enabled) state.time += dt;
  for (let i = 0; i < 5; i++) state.weights[i] = damp(state.weights[i], state.targets[i], 5, dt);
  for (let i = 0; i < 2; i++) state.pointer[i] = damp(state.pointer[i], state.pointerTarget[i], 7, dt);
  const delta = state.scroll - state.previousScroll;
  state.previousScroll = state.scroll;
  state.velocity = damp(state.velocity, Math.max(-2, Math.min(2, delta / Math.max(1, dt * 1000))), 8, dt);
  state.route = damp(state.route, state.routeTarget, state.reduced ? 100 : 7, dt);
  state.frame = damp(state.frame, state.frameTarget, 5, dt);
}

export function getMotionSnapshot() {
  const state = motionState;
  const percentile = (values: number[], fraction: number) => {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    return Math.round(sorted[Math.floor((sorted.length - 1) * fraction)] * 100) / 100;
  };
  return {
    ready: state.ready, enabled: state.enabled, reducedMotion: state.reduced,
    weights: [...state.weights], time: state.time, route: state.route,
    frames: state.frames, drawCalls: state.drawCalls, quality: state.quality,
    cpuP95Ms: percentile(state.cpuMs, 0.95), frameP95Ms: percentile(state.frameMs, 0.95),
    contextLosses: state.contextLosses,
  };
}

declare global {
  interface Window {
    __portfolioMotion?: {
      snapshot: typeof getMotionSnapshot;
      freeze: (time?: number) => void;
      resume: () => void;
    };
  }
}
