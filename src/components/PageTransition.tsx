import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;
const FRAME_TIMING = { duration: 0.42, ease: EASE, times: [0, 0.58, 1] } as const;
const EDGE_VARIANTS = {
  enter: { opacity: 0, scaleX: 0.86 },
  settled: {
    opacity: [0, 0.34, 0],
    scaleX: [0.86, 1, 1],
    transition: FRAME_TIMING,
  },
};
const CORNER_VARIANTS = {
  enter: { opacity: 0, scale: 0.88 },
  settled: {
    opacity: [0, 0.28, 0],
    scale: [0.88, 1, 1],
    transition: FRAME_TIMING,
  },
};
const DEPTH_VARIANTS = {
  enter: { opacity: 0, rotate: -26, scaleX: 0.2 },
  settled: {
    opacity: [0, 0.26, 0],
    rotate: -26,
    scaleX: [0.2, 1, 1],
    transition: { delay: 0.03, ...FRAME_TIMING },
  },
};

export default function PageTransition({
  children,
  pathname = '/',
}: {
  children: ReactNode;
  key?: string;
  pathname?: string;
}) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const routeMode = pathname.startsWith('/project/') ? 'dossier' : 'index';

  if (prefersReducedMotion) {
    return <div className="page-transition-shell" data-route-mode={routeMode}>{children}</div>;
  }

  return (
    <div className="page-transition-shell" data-route-mode={routeMode}>
      <motion.div
        aria-hidden="true"
        className="route-mount-frame"
        initial="enter"
        animate="settled"
      >
        <motion.span
          className="route-mount-line route-mount-line--upper"
          variants={EDGE_VARIANTS}
        />
        <motion.span
          className="route-mount-line route-mount-line--lower"
          variants={EDGE_VARIANTS}
        />
        <motion.span
          className="route-mount-corner route-mount-corner--top-left"
          variants={CORNER_VARIANTS}
        />
        <motion.span
          className="route-mount-corner route-mount-corner--top-right"
          variants={CORNER_VARIANTS}
        />
        <motion.span
          className="route-mount-corner route-mount-corner--bottom-left"
          variants={CORNER_VARIANTS}
        />
        <motion.span
          className="route-mount-corner route-mount-corner--bottom-right"
          variants={CORNER_VARIANTS}
        />
        <motion.span
          className="route-mount-depth route-mount-depth--upper"
          variants={DEPTH_VARIANTS}
        />
        <motion.span
          className="route-mount-depth route-mount-depth--lower"
          variants={DEPTH_VARIANTS}
        />
      </motion.div>

      <motion.div
        className="route-mount-plane"
        initial={{
          clipPath: 'inset(7% 0% 7% 0%)',
          opacity: 0.9,
          y: routeMode === 'dossier' ? 8 : -8,
        }}
        animate={{
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
        }}
        transition={{ duration: 0.38, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
