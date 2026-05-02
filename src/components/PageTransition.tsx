import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion, usePresence, useReducedMotion } from 'motion/react';

const PRECISION_EASE = [0.16, 1, 0.3, 1] as const;
const SNAP_EASE = [0.83, 0, 0.17, 1] as const;
const SOURCE_TTL_MS = 1400;
const EXIT_HOLD_MS = 300;
const ENTRY_FALLBACK_MS = 680;

function getRouteMeta(pathname: string) {
  if (pathname.startsWith('/project/')) {
    const parts = pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1] || 'project';
    return {
      index: '02',
      label: id.replace(/-/g, ' '),
      mode: 'project',
      phase: 'dossier transfer',
    };
  }

  return {
    index: '01',
    label: 'portfolio index',
    mode: 'home',
    phase: 'system aperture',
  };
}

type RouteSource = {
  index: string;
  kind: string;
  label: string;
  phase: string;
};

function readRouteSource(): RouteSource | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const source = window.__routeTransitionSource;
  if (!source?.label) {
    return null;
  }

  if (source.timestamp && performance.now() - source.timestamp > SOURCE_TTL_MS) {
    return null;
  }

  return {
    index: source.index || '01',
    kind: source.kind || 'route',
    label: source.label,
    phase: source.phase || `${source.kind || 'route'} transfer`,
  };
}

export default function PageTransition({
  children,
  pathname,
}: {
  children: ReactNode;
  key?: string;
  pathname: string;
}) {
  const [isPresent, safeToRemove] = usePresence();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [routeSource, setRouteSource] = useState<RouteSource | null>(() => readRouteSource());
  const [showTransfer, setShowTransfer] = useState(true);
  const route = useMemo(() => getRouteMeta(pathname), [pathname]);

  useEffect(() => {
    const handleRouteSource = (event: Event) => {
      const { detail } = event as CustomEvent<Partial<RouteSource>>;
      if (!detail?.label) {
        return;
      }

      setRouteSource({
        index: detail.index || '01',
        kind: detail.kind || 'route',
        label: detail.label,
        phase: detail.phase || `${detail.kind || 'route'} transfer`,
      });
    };

    window.addEventListener('portfolio-route-source', handleRouteSource);
    return () => window.removeEventListener('portfolio-route-source', handleRouteSource);
  }, []);

  useEffect(() => {
    if (isPresent) {
      return;
    }

    if (prefersReducedMotion) {
      safeToRemove();
      return;
    }

    setShowTransfer(true);

    const exitId = window.setTimeout(() => {
      setRouteSource(null);
      safeToRemove();
    }, EXIT_HOLD_MS);

    return () => window.clearTimeout(exitId);
  }, [isPresent, prefersReducedMotion, safeToRemove]);

  useEffect(() => {
    if (!isPresent || prefersReducedMotion || !showTransfer) {
      return;
    }

    const fallbackId = window.setTimeout(() => {
      setShowTransfer(false);
      setRouteSource(null);
    }, ENTRY_FALLBACK_MS);
    return () => window.clearTimeout(fallbackId);
  }, [isPresent, pathname, prefersReducedMotion, showTransfer]);

  if (prefersReducedMotion) {
    return <div className="page-transition-content">{children}</div>;
  }

  const targetMode = routeSource?.index === '02' ? 'project' : route.mode;
  const transferAngle = targetMode === 'project' ? -7 : 7;
  const transferIndex = routeSource?.index || route.index;
  const transferPhase = routeSource?.phase || route.phase;
  const transferLabel = routeSource?.label || route.label;
  const shouldShowTransfer = !isPresent || showTransfer;
  const transferVariants = {
    center: {
      opacity: 0,
      transition: { delay: 0.44, duration: 0.18, ease: PRECISION_EASE },
    },
    enter: { opacity: 1 },
    exit: {
      opacity: 1,
      transition: { duration: 0.24, ease: SNAP_EASE },
    },
  };
  const apertureVariants = {
    center: {
      opacity: 0,
      rotate: transferAngle + 2,
      scaleX: 0.34,
      scaleY: 0.2,
      transition: { duration: 0.58, ease: PRECISION_EASE },
      x: '-50%',
      y: '-50%',
    },
    enter: {
      opacity: 0.92,
      rotate: transferAngle,
      scaleX: 1.08,
      scaleY: 0.86,
      x: '-50%',
      y: '-50%',
    },
    exit: {
      opacity: 0.92,
      rotate: transferAngle,
      scaleX: 0.86,
      scaleY: 0.72,
      transition: { duration: 0.24, ease: SNAP_EASE },
      x: '-50%',
      y: '-50%',
    },
  };
  const axisVariants = {
    center: {
      opacity: 0,
      rotate: transferAngle,
      scaleX: 0.12,
      transition: { delay: 0.12, duration: 0.42, ease: PRECISION_EASE },
      x: '-50%',
      y: '-50%',
    },
    enter: {
      opacity: 0.88,
      rotate: transferAngle,
      scaleX: 1,
      x: '-50%',
      y: '-50%',
    },
    exit: {
      opacity: 0.88,
      rotate: transferAngle,
      scaleX: 0.72,
      transition: { duration: 0.24, ease: SNAP_EASE },
      x: '-50%',
      y: '-50%',
    },
  };
  const cubeVariants = {
    center: {
      opacity: 0,
      rotate: transferAngle + 18,
      scale: 0.62,
      transition: { delay: 0.04, duration: 0.46, ease: PRECISION_EASE },
      x: '-50%',
      y: '-50%',
    },
    enter: {
      opacity: 1,
      rotate: transferAngle,
      scale: 1.08,
      x: '-50%',
      y: '-50%',
    },
    exit: {
      opacity: 1,
      rotate: transferAngle - 10,
      scale: 0.9,
      transition: { duration: 0.22, ease: SNAP_EASE },
      x: '-50%',
      y: '-50%',
    },
  };
  const labelVariants = {
    center: {
      opacity: 0,
      transition: { duration: 0.18, ease: PRECISION_EASE },
      x: targetMode === 'project' ? 14 : -14,
      y: -6,
    },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: {
      opacity: 1,
      transition: { duration: 0.14, ease: SNAP_EASE },
      x: 0,
      y: 0,
    },
  };

  return (
    <div className="page-transition-shell" data-route-mode={route.mode}>
      <div className="page-transition-content">{children}</div>

      {shouldShowTransfer && (
        <motion.div
          aria-hidden="true"
          className="page-transfer"
          initial="enter"
          animate={isPresent ? 'center' : 'exit'}
          variants={transferVariants}
        >
          <motion.div
            className="page-transfer-aperture"
            variants={apertureVariants}
          >
            <span className="page-transfer-aperture__rule page-transfer-aperture__rule--x" />
            <span className="page-transfer-aperture__rule page-transfer-aperture__rule--y" />
            <span className="page-transfer-aperture__corner page-transfer-aperture__corner--a" />
            <span className="page-transfer-aperture__corner page-transfer-aperture__corner--b" />
            <span className="page-transfer-aperture__corner page-transfer-aperture__corner--c" />
            <span className="page-transfer-aperture__corner page-transfer-aperture__corner--d" />
          </motion.div>

          <motion.div
            className="page-transfer-axis page-transfer-axis--primary"
            variants={axisVariants}
          />

          <motion.div
            className="page-transfer-axis page-transfer-axis--echo"
            variants={axisVariants}
          />

          <motion.div className="page-transfer-cube" variants={cubeVariants}>
            <span className="page-transfer-cube__face page-transfer-cube__face--front" />
            <span className="page-transfer-cube__face page-transfer-cube__face--right" />
            <span className="page-transfer-cube__face page-transfer-cube__face--floor" />
            <span className="page-transfer-cube__pin" />
          </motion.div>

          <motion.div
            className="page-transfer-label"
            variants={labelVariants}
          >
            <span>{transferPhase}</span>
            <strong>{transferIndex} / {transferLabel}</strong>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
