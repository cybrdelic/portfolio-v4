import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { Suspense, lazy, startTransition, type RefObject, useEffect, useRef, useState } from 'react';
import {
  ethosBody,
  ethosClosing,
  ethosLead,
  ethosPullQuote,
  heroDeck,
  heroName,
  heroRole,
  heroStats,
  heroTitleLines,
} from '../content/home';
import {
  inViewViewport,
  revealGroupVariants,
  revealItemVariants,
  revealRuleVariants,
} from '../lib/motion';
import AnimatedLogo from './AnimatedLogo';

const LazyHeroRectLayer = lazy(() => import('./HeroRectLayer'));
const HERO_GPU_QUERY_PARAM = 'heroGpu';
const HERO_GPU_STORAGE_KEY = 'portfolio.heroGpu';
const HERO_INTRO_MIN_DURATION_MS = 1180;
const HERO_SHADER_WARMUP_TIMEOUT_MS = 2600;

type HeroSurfaceWarmupState = 'bypassed' | 'fallback' | 'loading' | 'ready';

function parseHeroGpuOverride(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === '1' || normalized === 'true' || normalized === 'on') {
    return true;
  }

  if (normalized === '0' || normalized === 'false' || normalized === 'off') {
    return false;
  }

  return null;
}

function shouldEnableHeroGpuSurfaces() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const queryOverride = parseHeroGpuOverride(params.get(HERO_GPU_QUERY_PARAM));
    if (queryOverride !== null) {
      return queryOverride;
    }

    const storedOverride = parseHeroGpuOverride(window.localStorage.getItem(HERO_GPU_STORAGE_KEY));
    if (storedOverride !== null) {
      return storedOverride;
    }
  } catch {
    return false;
  }

  return true;
}

function HeroContent({
  statsRef,
}: {
  statsRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="hero-stage relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pb-6 pt-16 md:px-12 md:pb-8 md:pt-20">
      <div className="relative z-10 max-w-[60rem]">
        <div
          className="hero-copy-shell relative origin-left overflow-hidden border-t border-[var(--color-line-soft)]/92 pl-4 pr-5 pt-4 md:pl-6 md:pr-10 md:pt-5"
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[var(--color-line-soft)]/92"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0))]" />

          <div className="hero-meta-row mb-5 flex flex-col gap-2 border-b border-[var(--color-line-soft)]/90 pb-3 md:mb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="hero-name text-[0.95rem] tracking-[-0.03em] text-[var(--color-ink)] md:text-[1.02rem]">
                {heroName}
              </p>
              <p className="hero-role mt-1">
                {heroRole}
              </p>
            </div>
            <p className="hero-location hidden md:block">
              Architecture, interaction, and performance under real constraints
            </p>
          </div>

          <h1 className="hero-headline display-tight max-w-[10.9ch] text-[clamp(2.85rem,9.4vw,4rem)] md:max-w-[9.4ch] md:text-[clamp(4rem,7vw,5.55rem)] lg:max-w-[8.9ch] lg:text-[clamp(4.8rem,5.85vw,6.3rem)]">
            {heroTitleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-8 grid gap-5 md:mt-9 md:grid-cols-[minmax(0,1fr)_19.5rem] md:items-end">
            <div aria-hidden="true" className="hidden h-px bg-[var(--color-line-soft)] md:block" />
            <div
              className="hero-deck-block border-t border-[var(--color-line-soft)]/85 pt-3 md:justify-self-end md:pl-5"
            >
              <p className="eyebrow mb-2">Operating thesis</p>
              <p className="hero-deck max-w-[19rem] md:text-[1.02rem]">
                {heroDeck}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={statsRef}
        className="hero-stats relative z-10 mt-5 origin-left grid grid-cols-2 border-t border-[var(--color-line-soft)]/92 md:mt-6 md:grid-cols-3 md:divide-x md:divide-[var(--color-line-soft)]"
      >
        {heroStats.map((item, index) => (
          <div
            key={item.label}
            className={`relative px-3.5 py-3 md:px-[1.125rem] md:py-3.5 ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
          >
            <div className="hero-stat-copy">
              <div className="mb-2.5 flex items-center justify-between gap-4">
                <p className="eyebrow">{item.label}</p>
                <span className="hero-stat-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="hero-stat-value">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroPanels({
  surfacesEnabled,
  lowerPanelTop,
  upperPanelRef,
}: {
  surfacesEnabled: boolean;
  lowerPanelTop: string;
  upperPanelRef: RefObject<HTMLDivElement | null>;
}) {
  const [showGpuPanels, setShowGpuPanels] = useState(false);

  useEffect(() => {
    if (!surfacesEnabled) {
      setShowGpuPanels(false);
      return;
    }

    let cancelled = false;
    const win = window as Window & {
      cancelIdleCallback?: (handle: number) => void;
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    };
    const revealPanels = () => {
      if (!cancelled) {
        setShowGpuPanels(true);
      }
    };
    const idleHandle = win.requestIdleCallback?.(revealPanels, { timeout: 900 });
    const fallbackTimer = window.setTimeout(revealPanels, 540);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      if (idleHandle !== undefined) {
        win.cancelIdleCallback?.(idleHandle);
      }
    };
  }, [surfacesEnabled]);

  if (!surfacesEnabled) {
    return null;
  }

  return (
    <div className="absolute inset-0 hidden md:block">
      <div
        ref={upperPanelRef}
        className="pointer-events-none absolute left-1/2 top-[25%] -translate-y-1/2 origin-left"
      >
        {showGpuPanels ? (
          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="hero-panel-ghost h-[clamp(8.5rem,15svh,11rem)] w-[min(35rem,37vw)] min-w-0 lg:w-[min(39rem,35vw)]"
              />
            }
          >
            <LazyHeroRectLayer
              className="h-[clamp(8.5rem,15svh,11rem)] w-[min(35rem,37vw)] min-w-0 lg:w-[min(39rem,35vw)]"
              debugLabel="upper-panel"
              interactionMode="sensor"
            />
          </Suspense>
        ) : (
          <div
            aria-hidden="true"
            className="hero-panel-ghost h-[clamp(8.5rem,15svh,11rem)] w-[min(35rem,37vw)] min-w-0 lg:w-[min(39rem,35vw)]"
            style={{ opacity: 0.82 }}
          />
        )}
      </div>
      <div
        className="pointer-events-none absolute left-1/2"
        style={{
          transformOrigin: 'left center',
          top: lowerPanelTop,
          transform: 'translate(-100%, calc(-100% - 0.75rem))',
        }}
      >
        {showGpuPanels ? (
          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="hero-panel-ghost h-[clamp(8.6rem,16svh,11.2rem)] w-[min(37rem,42vw)] min-w-0 max-w-[41rem]"
              />
            }
          >
            <LazyHeroRectLayer
              className="h-[clamp(8.6rem,16svh,11.2rem)] w-[min(37rem,42vw)] min-w-0 max-w-[41rem]"
              debugLabel="lower-panel"
              interactionMode="substrate"
              seed={0.713}
            />
          </Suspense>
        ) : (
          <div
            aria-hidden="true"
            className="hero-panel-ghost h-[clamp(8.6rem,16svh,11.2rem)] w-[min(37rem,42vw)] min-w-0 max-w-[41rem]"
            style={{ opacity: 0.74 }}
          />
        )}
      </div>
    </div>
  );
}

function HeroFace({ surfacesEnabled }: { surfacesEnabled: boolean }) {
  const faceRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const upperPanelRef = useRef<HTMLDivElement>(null);
  const [bottomRectAnchor, setBottomRectAnchor] = useState<number | null>(null);

  useEffect(() => {
    const face = faceRef.current;
    const stats = statsRef.current;
    if (!face || !stats || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateLayoutMetrics = () => {
      const faceBox = face.getBoundingClientRect();
      const statsBox = stats.getBoundingClientRect();
      setBottomRectAnchor(statsBox.top - faceBox.top);
    };

    const observer = new ResizeObserver(updateLayoutMetrics);
    observer.observe(face);
    observer.observe(stats);
    window.addEventListener('resize', updateLayoutMetrics);
    updateLayoutMetrics();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateLayoutMetrics);
    };
  }, []);

  const lowerPanelTop = bottomRectAnchor !== null ? `${Math.max(bottomRectAnchor - 12, 0)}px` : '68%';

  return (
    <div ref={faceRef} className="hero-face relative h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-line-soft)]/85" />
      <div className="pointer-events-none absolute inset-y-0 left-5 w-px bg-[var(--color-line-soft)]/85 md:left-12" />
      <HeroPanels
        surfacesEnabled={surfacesEnabled}
        lowerPanelTop={lowerPanelTop}
        upperPanelRef={upperPanelRef}
      />
      <HeroContent statsRef={statsRef} />
    </div>
  );
}

function HeroBootPreview() {
  const statsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="hero-face relative h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-line-soft)]/85" />
      <div className="pointer-events-none absolute inset-y-0 left-5 w-px bg-[var(--color-line-soft)]/85 md:left-12" />
      <div className="absolute inset-0 hidden md:block">
        <div className="pointer-events-none absolute left-1/2 top-[25%] -translate-y-1/2 origin-left">
          <div
            aria-hidden="true"
            className="hero-panel-ghost h-[clamp(8.5rem,15svh,11rem)] w-[min(35rem,37vw)] min-w-0 lg:w-[min(39rem,35vw)]"
            style={{ opacity: 0.74 }}
          />
        </div>
        <div
          className="pointer-events-none absolute left-1/2"
          style={{
            transformOrigin: 'left center',
            top: '68%',
            transform: 'translate(-100%, calc(-100% - 0.75rem))',
          }}
        >
          <div
            aria-hidden="true"
            className="hero-panel-ghost h-[clamp(8.6rem,16svh,11.2rem)] w-[min(37rem,42vw)] min-w-0 max-w-[41rem]"
            style={{ opacity: 0.68 }}
          />
        </div>
      </div>
      <HeroContent statsRef={statsRef} />
    </div>
  );
}

function HeroIntroStage({
  surfaceWarmupState,
}: {
  surfaceWarmupState: HeroSurfaceWarmupState;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const statusLabel =
    surfaceWarmupState === 'loading'
      ? 'Loading surface shaders'
      : surfaceWarmupState === 'ready'
        ? 'Surface cache ready'
        : surfaceWarmupState === 'fallback'
          ? 'Preparing static surface'
          : 'Preparing hero frame';

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowPreview(true);
    }, 620);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-bg)]"
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: showPreview ? 1 : 0,
          y: showPreview ? 0 : 18,
        }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroBootPreview />
      </motion.div>
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-x-10 top-10 h-px bg-[var(--color-line-soft)]/65 md:inset-x-12" />
        <div className="pointer-events-none absolute inset-y-0 left-10 w-px bg-[var(--color-line-soft)]/65 md:left-12" />
        <div className="pointer-events-none absolute inset-x-10 bottom-10 h-px bg-[var(--color-line-soft)]/45 md:inset-x-12" />
      </div>
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6">
        <motion.div
          className="relative h-[min(18rem,42vw)] w-[min(18rem,42vw)] md:h-[min(22rem,34vw)] md:w-[min(22rem,34vw)]"
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={showPreview ? { opacity: 0.1, scale: 0.46, y: -160 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedLogo className="absolute inset-0" phase="logo" />
        </motion.div>
        <motion.p
          className="mt-8 text-center font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--color-muted)]"
          initial={{ opacity: 0, y: 10 }}
          animate={showPreview ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          {statusLabel}
        </motion.p>
      </div>
    </section>
  );
}

function HeroShaderWarmup({
  active,
  onReady,
}: {
  active: boolean;
  onReady: () => void;
}) {
  const [upperReady, setUpperReady] = useState(false);
  const [lowerReady, setLowerReady] = useState(false);

  useEffect(() => {
    if (!active) {
      setUpperReady(false);
      setLowerReady(false);
    }
  }, [active]);

  useEffect(() => {
    if (active && upperReady && lowerReady) {
      onReady();
    }
  }, [active, lowerReady, onReady, upperReady]);

  if (!active) {
    return null;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-[-200vw] top-[-200vh] opacity-0">
      <Suspense fallback={null}>
        <LazyHeroRectLayer
          className="h-px w-px min-w-0"
          debugLabel="warmup-upper"
          interactionMode="sensor"
          onReady={() => setUpperReady(true)}
        />
        <LazyHeroRectLayer
          className="h-px w-px min-w-0"
          debugLabel="warmup-lower"
          interactionMode="substrate"
          onReady={() => setLowerReady(true)}
          seed={0.713}
        />
      </Suspense>
    </div>
  );
}

function HeroStaticStage() {
  return (
    <section
      className="relative border-b border-[var(--color-line)]"
      style={{
        height: '200vh',
        position: 'relative',
      }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--color-bg)]">
        <HeroBootPreview />
      </div>
    </section>
  );
}

function EthosFace() {
  return (
    <div className="h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:px-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="section-label lg:sticky lg:top-12">
            1.0 / Ethos
          </h2>
        </div>
        <div className="pr-2 lg:col-span-8">
          <motion.div
            className="section-content section-copy-stage ethos-stage h-full justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={inViewViewport}
            variants={revealGroupVariants}
          >
            <motion.div
              aria-hidden="true"
              className="section-copy-rule origin-left"
              variants={revealRuleVariants}
            />

            <motion.p variants={revealItemVariants} className="section-copy-lead ethos-lead">
              {ethosLead}
            </motion.p>

            <motion.p variants={revealItemVariants} className="ethos-pull">
              {ethosPullQuote}
            </motion.p>

            <div className="ethos-body-grid">
              {ethosBody.map((paragraph) => (
                <motion.p
                  key={paragraph.text}
                  variants={revealItemVariants}
                  className="section-copy-body ethos-body-copy"
                >
                  {paragraph.text}
                </motion.p>
              ))}
            </div>

            <motion.p variants={revealItemVariants} className="section-copy-closing ethos-closing">
              {ethosClosing}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function HeroThesisTransition({ introReady = true }: { introReady?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const heroGpuSurfacesEnabled = !prefersReducedMotion && shouldEnableHeroGpuSurfaces();
  const [surfaceWarmupState, setSurfaceWarmupState] = useState<HeroSurfaceWarmupState>(
    heroGpuSurfacesEnabled ? 'loading' : 'bypassed'
  );
  const [showIntroStage, setShowIntroStage] = useState(introReady && !prefersReducedMotion);
  const [introMinimumElapsed, setIntroMinimumElapsed] = useState(!introReady || prefersReducedMotion);
  const [cubeReady, setCubeReady] = useState(!introReady || prefersReducedMotion);
  const surfaceWarmupSettled = surfaceWarmupState !== 'loading';

  useEffect(() => {
    if (!heroGpuSurfacesEnabled) {
      setSurfaceWarmupState('bypassed');
      return;
    }

    let cancelled = false;
    setSurfaceWarmupState('loading');

    const timeoutId = window.setTimeout(() => {
      if (!cancelled) {
        setSurfaceWarmupState('fallback');
      }
    }, HERO_SHADER_WARMUP_TIMEOUT_MS);

    void import('./HeroRectLayer').catch(() => {
      if (cancelled) {
        return;
      }

      window.clearTimeout(timeoutId);
      setSurfaceWarmupState('fallback');
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [heroGpuSurfacesEnabled]);

  useEffect(() => {
    if (!introReady || prefersReducedMotion) {
      setShowIntroStage(false);
      setIntroMinimumElapsed(true);
      setCubeReady(true);
      return;
    }

    setShowIntroStage(true);
    setIntroMinimumElapsed(false);
    setCubeReady(false);
    const timer = window.setTimeout(() => {
      setIntroMinimumElapsed(true);
    }, HERO_INTRO_MIN_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [introReady, prefersReducedMotion]);

  useEffect(() => {
    if (!showIntroStage || !introMinimumElapsed || !surfaceWarmupSettled) {
      return;
    }

    startTransition(() => {
      setShowIntroStage(false);
    });
  }, [introMinimumElapsed, showIntroStage, surfaceWarmupSettled]);

  useEffect(() => {
    if (showIntroStage || prefersReducedMotion) {
      return;
    }

    let cancelled = false;
    const win = window as Window & {
      cancelIdleCallback?: (handle: number) => void;
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    };
    const enableCube = () => {
      if (!cancelled) {
        startTransition(() => {
          setCubeReady(true);
        });
      }
    };
    const idleHandle = win.requestIdleCallback?.(enableCube, { timeout: 2200 });
    const fallbackTimer = window.setTimeout(enableCube, 1600);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      if (idleHandle !== undefined) {
        win.cancelIdleCallback?.(idleHandle);
      }
    };
  }, [showIntroStage, prefersReducedMotion]);

  if (showIntroStage) {
    return (
      <>
        <HeroShaderWarmup
          active={heroGpuSurfacesEnabled && surfaceWarmupState === 'loading'}
          onReady={() => setSurfaceWarmupState('ready')}
        />
        <HeroIntroStage surfaceWarmupState={surfaceWarmupState} />
      </>
    );
  }

  if (!cubeReady) {
    return <HeroStaticStage />;
  }

  return <HeroCubeTransition surfacesEnabled={heroGpuSurfacesEnabled} sectionRef={ref} />;
}

function HeroCubeTransition({
  surfacesEnabled,
  sectionRef,
}: {
  surfacesEnabled: boolean;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const rotation = useTransform(scrollYProgress, [0, 0.5, 1], [0, 38, 84]);
  const zoom = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.986, 1]);
  const frontOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 1, 0.76]);
  const nextOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.58, 0.84, 1]);
  const cubeTransform = useMotionTemplate`translateZ(calc(var(--hero-thesis-cube) / -2)) rotateX(${rotation}deg) scale(${zoom})`;

  if (prefersReducedMotion) {
    return (
      <>
        <section className="relative min-h-[100svh] border-b border-[var(--color-line)]">
          <HeroFace surfacesEnabled={surfacesEnabled} />
        </section>
        <section className="relative border-b border-[var(--color-line)]">
          <EthosFace />
        </section>
      </>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-[var(--color-line)]"
      style={{
        height: '200vh',
        position: 'relative',
      }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[var(--color-bg)] [perspective:2200px] [--hero-thesis-cube:100svh]">
        <motion.div
          className="absolute inset-0 z-10 [transform-style:preserve-3d]"
          style={{ transform: cubeTransform }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden border-y border-[var(--color-line)] [backface-visibility:hidden]"
            style={{
              opacity: frontOpacity,
              transform: 'translateZ(calc(var(--hero-thesis-cube) / 2))',
            }}
          >
            <HeroFace surfacesEnabled={surfacesEnabled} />
          </motion.div>

          <motion.div
            className="absolute inset-0 overflow-hidden border-y border-[var(--color-line)] [backface-visibility:hidden]"
            style={{
              opacity: nextOpacity,
              transform: 'rotateX(-90deg) translateZ(calc(var(--hero-thesis-cube) / 2))',
              transformOrigin: 'center center',
            }}
          >
            <EthosFace />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
