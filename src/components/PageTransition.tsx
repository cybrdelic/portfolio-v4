import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PageTransition({
  children,
}: {
  children: ReactNode;
  key?: string;
  pathname?: string;
}) {
  const prefersReducedMotion = Boolean(useReducedMotion());

  if (prefersReducedMotion) {
    return <div className="page-transition-shell">{children}</div>;
  }

  return (
    <motion.div
      className="page-transition-shell"
      initial={{ opacity: 0.96 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
