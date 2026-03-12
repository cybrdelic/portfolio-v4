import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { PAGE_CONTENT_TRANSITION, PAGE_CURTAIN_TRANSITION } from '../lib/motion';

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] origin-top pointer-events-none bg-[var(--color-ink)]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, originY: 1 }}
        transition={PAGE_CURTAIN_TRANSITION}
      />
      <motion.div
        className="fixed inset-0 z-[99] origin-bottom pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_28%)]"
        initial={{ scaleY: 1, opacity: 0.56 }}
        animate={{ scaleY: 0, opacity: 0 }}
        exit={{ scaleY: 1, opacity: 0.42, originY: 0 }}
        transition={{ ...PAGE_CURTAIN_TRANSITION, duration: 1.08 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 82, scale: 0.962, filter: 'blur(18px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -40, scale: 0.986, filter: 'blur(12px)' }}
        transition={{ ...PAGE_CONTENT_TRANSITION, delay: 0.16 }}
        style={{ willChange: 'transform, opacity, filter', transformOrigin: '50% 0%' }}
      >
        {children}
      </motion.div>
    </>
  );
}
