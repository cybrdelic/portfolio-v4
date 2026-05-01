import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';

const PRECISION_EASE = [0.16, 1, 0.3, 1] as const;
const SNAP_EASE = [0.83, 0, 0.17, 1] as const;

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

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [routeSource, setRouteSource] = useState<{ kind: string; label: string } | null>(null);
  const route = useMemo(() => getRouteMeta(location.pathname), [location.pathname]);

  useEffect(() => {
    const handleRouteSource = (event: Event) => {
      const { detail } = event as CustomEvent<{ kind?: string; label?: string }>;
      if (!detail?.label) {
        return;
      }

      setRouteSource({
        kind: detail.kind || 'route',
        label: detail.label,
      });
    };

    window.addEventListener('portfolio-route-source', handleRouteSource);
    return () => window.removeEventListener('portfolio-route-source', handleRouteSource);
  }, []);

  if (prefersReducedMotion) {
    return <div className="page-transition-content">{children}</div>;
  }

  const contentExitRotateY = route.mode === 'project' ? 4 : -4;
  const contentEnterRotateY = route.mode === 'project' ? -3 : 3;
  const transferPhase = routeSource ? `${routeSource.kind} transfer` : route.phase;
  const transferLabel = routeSource?.label || route.label;
  const transferVariants = {
    center: {
      opacity: 0,
      transition: { delay: 0.86, duration: 0.24, ease: PRECISION_EASE },
    },
    enter: { opacity: 1 },
    exit: {
      opacity: 1,
      transition: { duration: 0.01, ease: SNAP_EASE },
    },
  };
  const backdropVariants = {
    center: {
      opacity: 0,
      transition: { delay: 0.62, duration: 0.34, ease: PRECISION_EASE },
    },
    enter: { opacity: 0.96 },
    exit: {
      opacity: 0.92,
      transition: { duration: 0.01, ease: SNAP_EASE },
    },
  };
  const sliceVariants = {
    center: (index: number) => ({
      opacity: 0,
      scaleX: 0.18,
      transition: {
        delay: 0.1 + index * 0.045,
        duration: 0.72,
        ease: PRECISION_EASE,
      },
      x: `${(index - 1.5) * 13}%`,
    }),
    enter: (index: number) => ({
      opacity: 0.68,
      scaleX: 1.16,
      x: `${(index - 1.5) * 3}%`,
    }),
    exit: (index: number) => ({
      opacity: 0.72,
      scaleX: 1.18,
      transition: {
        delay: index * 0.035,
        duration: 0.38,
        ease: SNAP_EASE,
      },
      x: `${(index - 1.5) * 2}%`,
    }),
  };
  const prismVariants = {
    center: {
      opacity: 0,
      rotateX: 58,
      rotateY: route.mode === 'project' ? -38 : 38,
      scale: 0.13,
      transition: { duration: 0.82, ease: PRECISION_EASE },
      x: '-50%',
      y: '-50%',
    },
    enter: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      scale: 2.16,
      x: '-50%',
      y: '-50%',
    },
    exit: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      scale: 2.2,
      transition: { duration: 0.52, ease: SNAP_EASE },
      x: '-50%',
      y: '-50%',
    },
  };
  const reticleVariants = {
    center: {
      opacity: 0,
      scale: 0.62,
      transition: { delay: 0.08, duration: 0.56, ease: PRECISION_EASE },
      x: '-50%',
      y: '-50%',
    },
    enter: { opacity: 1, scale: 1.3, x: '-50%', y: '-50%' },
    exit: {
      opacity: 1,
      scale: 1.14,
      transition: { duration: 0.36, ease: SNAP_EASE },
      x: '-50%',
      y: '-50%',
    },
  };
  const labelVariants = {
    center: {
      opacity: 0,
      transition: { delay: 0.28, duration: 0.36, ease: PRECISION_EASE },
      x: route.mode === 'project' ? 32 : -32,
      y: -10,
    },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: {
      opacity: 1,
      transition: { delay: 0.12, duration: 0.28, ease: SNAP_EASE },
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div className="page-transition-shell" data-route-mode={route.mode}>
      <motion.div
        className="page-transition-content"
        initial={{
          clipPath: 'polygon(2% 0%, 100% 4%, 97% 100%, 0% 96%)',
          filter: 'blur(7px)',
          opacity: 0,
          rotateX: 6,
          rotateY: contentEnterRotateY,
          scale: 0.982,
          y: 32,
        }}
        animate={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          filter: 'blur(0px)',
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          y: 0,
        }}
        exit={{
          clipPath: 'polygon(3% 1%, 100% 7%, 95% 100%, 0% 93%)',
          filter: 'blur(6px)',
          opacity: 0,
          rotateX: -7,
          rotateY: contentExitRotateY,
          scale: 0.972,
          y: -26,
        }}
        transition={{
          clipPath: { duration: 0.74, ease: PRECISION_EASE },
          default: { duration: 0.68, ease: PRECISION_EASE },
          filter: { duration: 0.5, ease: PRECISION_EASE },
          opacity: { duration: 0.42, ease: PRECISION_EASE },
        }}
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="page-transfer"
        initial="enter"
        animate="center"
        exit="exit"
        variants={transferVariants}
      >
        <motion.div
          className="page-transfer-backdrop"
          variants={backdropVariants}
        />

        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="page-transfer-slice"
            custom={index}
            style={{ '--slice-index': index } as CSSProperties}
            variants={sliceVariants}
          />
        ))}

        <motion.div
          className="page-transfer-prism"
          variants={prismVariants}
        >
          <div className="page-transfer-face page-transfer-face--front" />
          <div className="page-transfer-face page-transfer-face--right" />
          <div className="page-transfer-face page-transfer-face--floor" />
          <div className="page-transfer-face page-transfer-face--wire" />
        </motion.div>

        <motion.div
          className="page-transfer-reticle"
          variants={reticleVariants}
        />

        <motion.div
          className="page-transfer-label"
          variants={labelVariants}
        >
          <span>{transferPhase}</span>
          <strong>{route.index} / {transferLabel}</strong>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
