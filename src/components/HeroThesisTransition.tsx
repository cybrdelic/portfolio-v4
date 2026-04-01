import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
  heroDeck,
  heroName,
  heroRole,
  heroStats,
  heroTitleLines,
  thesisParagraphs,
} from '../content/home';
import {
  EASE_FLIP,
  EASE_STANDARD,
  SPRING_FLIP,
  inViewViewport,
  revealGroupVariants,
  revealItemVariants,
  revealRuleVariants,
} from '../lib/motion';
import HeroRectLayer from './HeroRectLayer';
import ScrambleText from './ScrambleText';

type HeroDebugEvent = {
  detail?: string;
  label: string;
  timeMs: number;
};

type HeroDebugSnapshot = {
  bottomRectAnchor: number | null;
  holdComplete: boolean;
  introGateReady: boolean;
  isCopyVisible: boolean;
  isIntroExpanded: boolean;
  introStarted: boolean;
  isStatsVisible: boolean;
  lowerPanelReady: boolean;
  pageReady: boolean;
  showGlyph: boolean;
  showLivePanels: boolean;
  showPanelTargets: boolean;
  upperPanelReady: boolean;
};

const FLIP_EASE = EASE_FLIP;
const CONTENT_EASE = EASE_STANDARD;
const INTRO_START_DELAY_MS = 600;
const LIVE_PANELS_AFTER_START_MS = 220;
const PANEL_TARGET_HIDE_AFTER_START_MS = 1320;
const COPY_REVEAL_AFTER_START_MS = 620;
const STATS_REVEAL_AFTER_START_MS = 800;

const flipLayoutTransition = {
  ...SPRING_FLIP,
};

function isHeroDebugEnabled() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('heroDebug') === '1';
}

function HeroDebugOverlay({
  enabled,
  events,
  frameStats,
  snapshot,
}: {
  enabled: boolean;
  events: HeroDebugEvent[];
  frameStats: {
    averageMs: number;
    fps: number;
    hitchCount: number;
    longestMs: number;
    samples: number;
  };
  snapshot: HeroDebugSnapshot;
}) {
  if (!enabled) return null;

  return (
    <aside className="hero-debug-panel fixed right-4 top-4 z-[300] w-[min(24rem,calc(100vw-2rem))] overflow-hidden border border-[var(--color-line-strong)] bg-[rgba(17,17,17,0.9)] text-[var(--color-bg)] shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-sm">
      <div className="border-b border-[rgba(255,255,255,0.12)] px-3 py-2">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.72)]">
          Hero Debug / ?heroDebug=1
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 py-2 font-mono text-[0.72rem]">
        <span>glyph</span>
        <span>{snapshot.showGlyph ? 'on' : 'off'}</span>
        <span>targets</span>
        <span>{snapshot.showPanelTargets ? 'on' : 'off'}</span>
        <span>live panels</span>
        <span>{snapshot.showLivePanels ? 'on' : 'off'}</span>
        <span>intro gate</span>
        <span>{snapshot.introGateReady ? 'yes' : 'no'}</span>
        <span>intro started</span>
        <span>{snapshot.introStarted ? 'yes' : 'no'}</span>
        <span>intro expanded</span>
        <span>{snapshot.isIntroExpanded ? 'yes' : 'no'}</span>
        <span>hold complete</span>
        <span>{snapshot.holdComplete ? 'yes' : 'no'}</span>
        <span>page ready</span>
        <span>{snapshot.pageReady ? 'yes' : 'no'}</span>
        <span>upper ready</span>
        <span>{snapshot.upperPanelReady ? 'yes' : 'no'}</span>
        <span>lower ready</span>
        <span>{snapshot.lowerPanelReady ? 'yes' : 'no'}</span>
        <span>copy visible</span>
        <span>{snapshot.isCopyVisible ? 'yes' : 'no'}</span>
        <span>stats visible</span>
        <span>{snapshot.isStatsVisible ? 'yes' : 'no'}</span>
        <span>stats anchor</span>
        <span>{snapshot.bottomRectAnchor === null ? 'null' : `${Math.round(snapshot.bottomRectAnchor)}px`}</span>
      </div>
      <div className="border-t border-[rgba(255,255,255,0.08)] px-3 py-2 font-mono text-[0.72rem]">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span>avg frame</span>
          <span>{frameStats.averageMs.toFixed(1)} ms</span>
          <span>fps</span>
          <span>{frameStats.fps.toFixed(1)}</span>
          <span>worst frame</span>
          <span>{frameStats.longestMs.toFixed(1)} ms</span>
          <span>hitches &gt; 34ms</span>
          <span>{frameStats.hitchCount}</span>
          <span>samples</span>
          <span>{frameStats.samples}</span>
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,0.08)] px-3 py-2">
        <p className="mb-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.56)]">
          Event Log
        </p>
        <div className="max-h-48 space-y-1 overflow-auto font-mono text-[0.68rem] text-[rgba(255,255,255,0.84)]">
          {events.map((event, index) => (
            <div key={`${event.label}-${event.timeMs}-${index}`} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
              <span>{`${(event.timeMs / 1000).toFixed(2)}s`}</span>
              <span>{event.detail ? `${event.label} / ${event.detail}` : event.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

const copyGroupVariants = {
  hidden: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.06,
      staggerChildren: 0.08,
    },
  },
};

const copyItemVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.985,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.72,
      ease: CONTENT_EASE,
    },
  },
};

function HeroFace({ introReady }: { introReady: boolean }) {
  const faceRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const heroDebugEnabled = isHeroDebugEnabled();
  const debugStartRef = useRef(typeof performance !== 'undefined' ? performance.now() : 0);
  const [bottomRectAnchor, setBottomRectAnchor] = useState<number | null>(null);
  const [isIntroExpanded, setIsIntroExpanded] = useState(prefersReducedMotion);
  const [introStarted, setIntroStarted] = useState(prefersReducedMotion);
  const [isCopyVisible, setIsCopyVisible] = useState(prefersReducedMotion);
  const [isStatsVisible, setIsStatsVisible] = useState(prefersReducedMotion);
  const [showGlyph, setShowGlyph] = useState(!prefersReducedMotion);
  const [showPanelTargets, setShowPanelTargets] = useState(false);
  const [showLivePanels, setShowLivePanels] = useState(prefersReducedMotion);
  const [holdComplete, setHoldComplete] = useState(prefersReducedMotion);
  const [pageReady, setPageReady] = useState(prefersReducedMotion);
  const [upperPanelReady, setUpperPanelReady] = useState(prefersReducedMotion);
  const [lowerPanelReady, setLowerPanelReady] = useState(prefersReducedMotion);
  const [debugEvents, setDebugEvents] = useState<HeroDebugEvent[]>([]);
  const [frameStats, setFrameStats] = useState({
    averageMs: 0,
    fps: 0,
    hitchCount: 0,
    longestMs: 0,
    samples: 0,
  });

  const logDebugEvent = (label: string, detail?: string) => {
    if (!heroDebugEnabled || typeof performance === 'undefined') return;

    const timeMs = performance.now() - debugStartRef.current;
    setDebugEvents((current) => {
      const next = [...current, { detail, label, timeMs }];
      return next.slice(-18);
    });
  };

  useEffect(() => {
    if (!heroDebugEnabled || typeof performance === 'undefined') {
      return;
    }

    let rafId = 0;
    let lastFrame = performance.now();
    let sampleCount = 0;
    let totalMs = 0;
    let longestMs = 0;
    let hitchCount = 0;

    const tick = (now: number) => {
      const delta = now - lastFrame;
      lastFrame = now;
      sampleCount += 1;
      totalMs += delta;
      longestMs = Math.max(longestMs, delta);
      if (delta > 34) {
        hitchCount += 1;
      }

      if (sampleCount % 12 === 0) {
        const averageMs = totalMs / sampleCount;
        setFrameStats({
          averageMs,
          fps: averageMs > 0 ? 1000 / averageMs : 0,
          hitchCount,
          longestMs,
          samples: sampleCount,
        });
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [heroDebugEnabled]);

  useEffect(() => {
    if (!heroDebugEnabled || typeof PerformanceObserver === 'undefined') {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        logDebugEvent('longtask', `${entry.duration.toFixed(1)}ms`);
      }
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch {
      return;
    }

    return () => {
      observer.disconnect();
    };
  }, [heroDebugEnabled]);

  useEffect(() => {
    const face = faceRef.current;
    const stats = statsRef.current;

    if (!face || !stats || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateBottomRect = () => {
      const faceBox = face.getBoundingClientRect();
      const statsBox = stats.getBoundingClientRect();
      const statsTop = statsBox.top - faceBox.top;
      setBottomRectAnchor(statsTop);
    };

    const observer = new ResizeObserver(updateBottomRect);
    observer.observe(face);
    observer.observe(stats);
    window.addEventListener('resize', updateBottomRect);
    updateBottomRect();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBottomRect);
    };
  }, []);

  useEffect(() => {
    logDebugEvent('intro-started', introStarted ? 'yes' : 'no');
  }, [introStarted]);

  useEffect(() => {
    logDebugEvent('glyph', showGlyph ? 'visible' : 'hidden');
  }, [showGlyph]);

  useEffect(() => {
    logDebugEvent('panel-targets', showPanelTargets ? 'visible' : 'hidden');
  }, [showPanelTargets]);

  useEffect(() => {
    logDebugEvent('live-panels', showLivePanels ? 'visible' : 'hidden');
  }, [showLivePanels]);

  useEffect(() => {
    logDebugEvent('intro', isIntroExpanded ? 'expanded' : 'compact');
  }, [isIntroExpanded]);

  useEffect(() => {
    logDebugEvent('copy', isCopyVisible ? 'visible' : 'hidden');
  }, [isCopyVisible]);

  useEffect(() => {
    logDebugEvent('stats', isStatsVisible ? 'visible' : 'hidden');
  }, [isStatsVisible]);

  useEffect(() => {
    logDebugEvent('hold', holdComplete ? 'complete' : 'waiting');
  }, [holdComplete]);

  useEffect(() => {
    logDebugEvent('intro-gate', introReady ? 'yes' : 'no');
  }, [introReady]);

  useEffect(() => {
    logDebugEvent('page-ready', pageReady ? 'yes' : 'no');
  }, [pageReady]);

  useEffect(() => {
    logDebugEvent('upper-panel-ready', upperPanelReady ? 'yes' : 'no');
  }, [upperPanelReady]);

  useEffect(() => {
    logDebugEvent('lower-panel-ready', lowerPanelReady ? 'yes' : 'no');
  }, [lowerPanelReady]);

  useEffect(() => {
    if (bottomRectAnchor === null) return;
    logDebugEvent('stats-anchor', `${Math.round(bottomRectAnchor)}px`);
  }, [bottomRectAnchor]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroStarted(true);
      setIsIntroExpanded(true);
      setIsCopyVisible(true);
      setIsStatsVisible(true);
      setShowGlyph(false);
      setShowPanelTargets(false);
      setShowLivePanels(true);
      setHoldComplete(true);
      setPageReady(true);
      setUpperPanelReady(true);
      setLowerPanelReady(true);
      return;
    }

    setIntroStarted(false);
    setIsIntroExpanded(false);
    setIsCopyVisible(false);
    setIsStatsVisible(false);
    setShowGlyph(true);
    setShowPanelTargets(false);
    setShowLivePanels(false);
    setHoldComplete(false);
    setPageReady(false);
    setUpperPanelReady(false);
    setLowerPanelReady(false);

    if (!introReady) {
      return;
    }

    const holdTimer = window.setTimeout(() => {
      setHoldComplete(true);
    }, INTRO_START_DELAY_MS);

    return () => {
      window.clearTimeout(holdTimer);
    };
  }, [introReady, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    let cancelled = false;
    let rafA = 0;
    let rafB = 0;

    const markReady = () => {
      rafA = window.requestAnimationFrame(() => {
        rafB = window.requestAnimationFrame(() => {
          if (!cancelled) {
            setPageReady(true);
          }
        });
      });
    };

    const awaitLayoutStability = async () => {
      if (document.readyState !== 'complete') {
        await new Promise<void>((resolve) => {
          const handleLoad = () => {
            window.removeEventListener('load', handleLoad);
            resolve();
          };

          window.addEventListener('load', handleLoad);
        });
      }

      const fontSet = document.fonts;
      if (fontSet?.ready) {
        try {
          await fontSet.ready;
        } catch {
          // Continue even if font readiness fails.
        }
      }

      markReady();
    };

    void awaitLayoutStability();

    return () => {
      cancelled = true;
      if (rafA) window.cancelAnimationFrame(rafA);
      if (rafB) window.cancelAnimationFrame(rafB);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (
      prefersReducedMotion ||
      !introReady ||
      !pageReady ||
      bottomRectAnchor === null ||
      !holdComplete ||
      !upperPanelReady ||
      !lowerPanelReady ||
      introStarted
    ) {
      return;
    }

    setIntroStarted(true);
    setShowPanelTargets(true);
    setShowGlyph(false);
    setIsIntroExpanded(true);
  }, [bottomRectAnchor, holdComplete, introReady, introStarted, lowerPanelReady, pageReady, prefersReducedMotion, upperPanelReady]);

  useEffect(() => {
    if (prefersReducedMotion || !introStarted) {
      return;
    }

    const liveTimer = window.setTimeout(() => {
      setShowLivePanels(true);
    }, LIVE_PANELS_AFTER_START_MS);
    const targetTimer = window.setTimeout(() => {
      setShowPanelTargets(false);
    }, PANEL_TARGET_HIDE_AFTER_START_MS);
    const copyTimer = window.setTimeout(() => {
      setIsCopyVisible(true);
    }, COPY_REVEAL_AFTER_START_MS);
    const statsTimer = window.setTimeout(() => {
      setIsStatsVisible(true);
    }, STATS_REVEAL_AFTER_START_MS);

    return () => {
      window.clearTimeout(liveTimer);
      window.clearTimeout(targetTimer);
      window.clearTimeout(copyTimer);
      window.clearTimeout(statsTimer);
    };
  }, [introStarted, prefersReducedMotion]);

  const lowerPanelTop = bottomRectAnchor !== null ? `${Math.max(bottomRectAnchor - 12, 0)}px` : '68%';

  return (
    <div ref={faceRef} className="hero-face relative h-full w-full overflow-hidden text-[var(--color-ink)]">
      <HeroDebugOverlay
        enabled={heroDebugEnabled}
        events={debugEvents}
        frameStats={frameStats}
        snapshot={{
          bottomRectAnchor,
          holdComplete,
          introGateReady: introReady,
          isCopyVisible,
          isIntroExpanded,
          introStarted,
          isStatsVisible,
          lowerPanelReady,
          pageReady,
          showGlyph,
          showLivePanels,
          showPanelTargets,
          upperPanelReady,
        }}
      />
      <motion.div
        initial={false}
        layoutId={showGlyph ? undefined : 'hero-af-top-rail'}
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-line-strong)]"
        animate={{
          opacity: showGlyph ? 0 : 1,
        }}
        transition={{
          opacity: {
            duration: 0.38,
            delay: 0.06,
            ease: FLIP_EASE,
          },
        }}
      />
      <motion.div
        initial={false}
        layoutId={showGlyph ? undefined : 'hero-af-outer-rail'}
        className="pointer-events-none absolute inset-y-0 left-6 hidden w-px bg-[var(--color-line-soft)]/60 md:left-12 md:block"
        animate={{
          opacity: showGlyph ? 0 : 1,
        }}
        transition={{
          opacity: {
            duration: 0.4,
            delay: 0.08,
            ease: FLIP_EASE,
          },
        }}
      />
      <LayoutGroup id="hero-af-intro">
        <AnimatePresence initial={false}>
          {showGlyph ? (
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <motion.div
                className="absolute left-1/2 top-[24%] h-[8.8rem] w-px bg-[var(--color-line-strong)]"
                style={{ transform: 'translateX(-5.45rem) rotate(-22deg)', transformOrigin: 'top center' }}
                exit={{ opacity: 0, scaleY: 0.82, x: -16 }}
                transition={{ duration: 0.7, ease: FLIP_EASE }}
              />
              <motion.div
                layoutId="hero-af-copy-rail"
                className="absolute left-1/2 top-[24%] h-[8.8rem] w-px bg-[var(--color-line-strong)]"
                style={{ transform: 'translateX(-2.4rem) rotate(22deg)', transformOrigin: 'top center' }}
                transition={flipLayoutTransition}
              />
              <motion.div
                layoutId="hero-af-outer-rail"
                className="absolute left-1/2 top-[24.2%] h-[8.65rem] w-px bg-[var(--color-line-strong)]"
                style={{ transform: 'translateX(3.55rem)' }}
                transition={flipLayoutTransition}
              />
              <motion.div
                layoutId="hero-af-top-rail"
                className="absolute left-1/2 top-[24.2%] h-px w-[4.85rem] bg-[var(--color-line-strong)]"
                style={{ transform: 'translateX(3.55rem)' }}
                transition={flipLayoutTransition}
              />
              <motion.div
                layoutId="hero-af-upper-panel"
                className="absolute left-1/2 top-[36.6%] h-[2px] w-[3.4rem]"
                style={{ transform: 'translateX(-4.72rem)' }}
                transition={flipLayoutTransition}
              >
                <div className="hero-panel-ghost h-full w-full" />
              </motion.div>
              <motion.div
                layoutId="hero-af-lower-panel"
                className="absolute left-1/2 top-[36.2%] h-[2px] w-[3.1rem]"
                style={{ transform: 'translateX(4rem)' }}
                transition={flipLayoutTransition}
              >
                <div className="hero-panel-ghost h-full w-full" />
              </motion.div>
            </div>
          ) : null}
          {showPanelTargets ? (
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <motion.div
                layoutId="hero-af-upper-panel"
                className="absolute left-1/2 top-[25%] -translate-y-1/2"
                initial={false}
                animate={{ opacity: showLivePanels ? 0.18 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.72, ease: FLIP_EASE }}
              >
                <div className="hero-panel-ghost h-[clamp(8.5rem,15svh,11rem)] w-[min(35rem,37vw)] min-w-0 lg:w-[min(39rem,35vw)]" />
              </motion.div>
              {bottomRectAnchor !== null ? (
                <motion.div
                  layoutId="hero-af-lower-panel"
                  className="absolute left-1/2"
                  initial={false}
                  animate={{ opacity: showLivePanels ? 0.18 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.76, ease: FLIP_EASE }}
                  style={{
                    top: lowerPanelTop,
                    transform: 'translate(-100%, calc(-100% - 0.75rem))',
                  }}
                >
                  <div className="hero-panel-ghost h-[clamp(8.6rem,16svh,11.2rem)] w-[min(37rem,42vw)] min-w-0 max-w-[41rem]" />
                </motion.div>
              ) : null}
            </div>
          ) : null}
        </AnimatePresence>
      </LayoutGroup>

      <div className="absolute inset-0 hidden md:block">
        {introReady ? (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[25%] -translate-y-1/2"
            initial={false}
            animate={{ opacity: showLivePanels ? 1 : 0 }}
            transition={{ duration: 0.78, ease: FLIP_EASE }}
          >
            <HeroRectLayer
              className="h-[clamp(8.5rem,15svh,11rem)] w-[min(35rem,37vw)] min-w-0 lg:w-[min(39rem,35vw)]"
              debugLabel="upper-panel"
              interactionMode="sensor"
              onReady={() => {
                logDebugEvent('upper-panel', 'ready');
                setUpperPanelReady(true);
              }}
              onProfileEvent={(event) => {
                logDebugEvent(event.debugLabel ?? 'panel', `${event.stage} ${event.elapsedMs.toFixed(0)}ms`);
              }}
            />
          </motion.div>
        ) : null}
        {introReady && bottomRectAnchor !== null ? (
          <motion.div
            className="pointer-events-none absolute left-1/2"
            initial={false}
            animate={{ opacity: showLivePanels ? 1 : 0 }}
            transition={{ duration: 0.82, ease: FLIP_EASE }}
            style={{
              top: lowerPanelTop,
              transform: 'translate(-100%, calc(-100% - 0.75rem))',
            }}
          >
            <HeroRectLayer
              className="h-[clamp(8.6rem,16svh,11.2rem)] w-[min(37rem,42vw)] min-w-0 max-w-[41rem]"
              debugLabel="lower-panel"
              interactionMode="substrate"
              onReady={() => {
                logDebugEvent('lower-panel', 'ready');
                setLowerPanelReady(true);
              }}
              onProfileEvent={(event) => {
                logDebugEvent(event.debugLabel ?? 'panel', `${event.stage} ${event.elapsedMs.toFixed(0)}ms`);
              }}
              seed={0.713}
            />
          </motion.div>
        ) : null}
      </div>

      <div className="hero-stage relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pb-6 pt-16 md:px-12 md:pb-8 md:pt-20">
        <motion.div
          layout
          initial={false}
          className={`relative z-10 ${
            isIntroExpanded ? 'max-w-[60rem]' : 'mx-auto max-w-[24rem] md:max-w-[27rem]'
          }`}
          transition={{
            layout: {
              ...SPRING_FLIP,
            },
          }}
        >
          <motion.div
            layout
            initial={false}
            className="hero-copy-shell relative overflow-hidden border-t border-[var(--color-line-strong)] pl-4 pr-5 pt-4 md:pl-6 md:pr-10 md:pt-5"
            transition={{
              layout: {
                ...SPRING_FLIP,
              },
            }}
            >
              <motion.div
                initial={false}
                layoutId={showGlyph ? undefined : 'hero-af-copy-rail'}
                className="pointer-events-none absolute inset-y-0 left-0 w-px bg-[var(--color-line-strong)]"
                animate={{ opacity: showGlyph ? 0 : 1 }}
                transition={{ duration: 0.34, delay: 0.08, ease: FLIP_EASE }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0))]" />

            <motion.div
              initial={false}
              animate={isCopyVisible ? 'visible' : 'hidden'}
              variants={copyGroupVariants}
            >
              <motion.div variants={copyItemVariants} className="hero-meta-row mb-5 flex flex-col gap-2 border-b border-[var(--color-line-soft)]/90 pb-3 md:mb-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="hero-name text-[0.95rem] tracking-[-0.03em] text-[var(--color-ink)] md:text-[1.02rem]">
                    <ScrambleText text={heroName} />
                  </p>
                  <p className="hero-role mt-1">
                    {heroRole}
                  </p>
                </div>
                <p className="hero-location hidden md:block">
                  Architecture / interaction / performance
                </p>
              </motion.div>

              <motion.h1
                className="hero-headline display-tight max-w-[10.9ch] text-[clamp(2.85rem,9.4vw,4rem)] md:max-w-[9.4ch] md:text-[clamp(4rem,7vw,5.55rem)] lg:max-w-[8.9ch] lg:text-[clamp(4.8rem,5.85vw,6.3rem)]"
                variants={copyGroupVariants}
              >
                {heroTitleLines.map((line) => (
                  <motion.span key={line} variants={copyItemVariants} className="block">
                    {line}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.div
                className="mt-8 grid gap-5 md:mt-9 md:grid-cols-[minmax(0,1fr)_19.5rem] md:items-end"
                variants={copyItemVariants}
              >
                <div aria-hidden="true" className="hidden h-px bg-[var(--color-line-soft)] md:block" />
                <div className="hero-deck-block border-t border-[var(--color-line-soft)]/85 pt-3 md:justify-self-end md:pl-5">
                  <p className="eyebrow mb-2">Operating thesis</p>
                  <p className="hero-deck max-w-[19rem] md:text-[1.02rem]">
                    {heroDeck}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          ref={statsRef}
          className="hero-stats relative z-10 mt-5 grid grid-cols-2 border-t border-[var(--color-line-strong)] md:mt-6 md:grid-cols-3 md:divide-x md:divide-[var(--color-line-soft)]"
          initial={false}
          animate={isStatsVisible ? 'visible' : 'hidden'}
          variants={copyGroupVariants}
        >
          {heroStats.map((item, index) => (
            <motion.div
              key={item.label}
              variants={copyItemVariants}
              className={`relative px-3.5 py-3 md:px-[1.125rem] md:py-3.5 ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <div className="mb-2.5 flex items-center justify-between gap-4">
                <p className="eyebrow">{item.label}</p>
                <span className="hero-stat-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="hero-stat-value">
                {item.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ThesisFace() {
  return (
    <div className="thesis-shell h-full w-full overflow-hidden text-[var(--color-ink)]">
      <div className="h-full w-full px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-24">
        <div className="mx-auto grid h-full w-full max-w-[80rem] grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="thesis-rail lg:col-span-4">
            <h2 className="section-label lg:sticky lg:top-12">
              1.0 / Thesis
            </h2>
          </div>
          <div className="pr-2 lg:col-span-8">
            <motion.div
              className="section-content thesis-stage max-w-[44rem] font-sans text-lg md:text-[1.32rem]"
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
              variants={revealGroupVariants}
            >
              <motion.div aria-hidden="true" className="section-copy-rule mb-8 origin-left" variants={revealRuleVariants} />
              {thesisParagraphs.map((paragraph) => (
                <motion.p
                  key={paragraph.text}
                  variants={revealItemVariants}
                  className={
                    paragraph.tone === 'lead'
                      ? 'section-copy-lead thesis-lead'
                      : paragraph.tone === 'featured'
                        ? 'thesis-dominant'
                        : paragraph.tone === 'closing'
                          ? 'section-copy-closing thesis-closing'
                          : 'section-copy-body'
                  }
                >
                  {paragraph.text}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroThesisTransition({ introReady = true }: { introReady?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
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
          <HeroFace introReady={introReady} />
        </section>
        <section className="relative border-b border-[var(--color-line)]">
          <ThesisFace />
        </section>
      </>
    );
  }

  return (
    <section
      ref={ref}
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
            <HeroFace introReady={introReady} />
          </motion.div>

          <motion.div
            className="absolute inset-0 overflow-hidden border-y border-[var(--color-line)] [backface-visibility:hidden]"
            style={{
              opacity: nextOpacity,
              transform: 'rotateX(-90deg) translateZ(calc(var(--hero-thesis-cube) / 2))',
              transformOrigin: 'center center',
            }}
          >
            <ThesisFace />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
